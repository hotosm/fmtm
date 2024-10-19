# Copyright (c) 2022, 2023 Humanitarian OpenStreetMap Team
#
# This file is part of FMTM.
#
#     FMTM is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     FMTM is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with FMTM.  If not, see <https:#www.gnu.org/licenses/>.
#
"""Logic for organisation management."""

from io import BytesIO
from typing import Optional

from fastapi import File, HTTPException, Response, UploadFile
from loguru import logger as log
from psycopg import Connection

from app.auth.auth_schemas import AuthUser
from app.config import encrypt_value, settings
from app.db import db_models
from app.db.db_schemas import DbOrganisation
from app.models.enums import HTTPStatus
from app.organisations.organisation_deps import (
    get_organisation,
)
from app.organisations.organisation_schemas import OrganisationIn
from app.s3 import add_obj_to_bucket


async def init_admin_org(db: Connection) -> None:
    """Init admin org and user at application startup."""
    sql_insert_org = """
        -- Insert HOTOSM organisation
        INSERT INTO public.organisations (
            name,
            slug,
            logo,
            description,
            url,
            type,
            approved,
            odk_central_url,
            odk_central_user,
            odk_central_password
        )
        VALUES (
            'HOTOSM',
            'hotosm',
            'https://avatars.githubusercontent.com/u/458752?s=280&v=4',
            'Humanitarian OpenStreetMap Team.',
            'https://hotosm.org',
            'FREE',
            true,
            %(odk_url)s,
            %(odk_user)s,
            %(odk_pass)s
        )
        ON CONFLICT ("name") DO NOTHING
        RETURNING id;
    """

    sql_insert_org_admin = """
        -- Insert localadmin admin user
        INSERT INTO public.users (
            id,
            username,
            role,
            name,
            email_address,
            is_email_verified,
            mapping_level,
            tasks_mapped,
            tasks_validated,
            tasks_invalidated
        )
        VALUES (
            %(admin_user_id)s,
            %(admin_username)s,
            'ADMIN',
            'Admin',
            'admin@fmtm.dev',
            true,
            'ADVANCED',
            0,
            0,
            0
        )
        ON CONFLICT ("username") DO NOTHING;
    """

    sql_set_org_admin = """
        -- Set localadmin user as org admin
        WITH org_cte AS (
            SELECT id FROM public.organisations
            WHERE name = 'HOTOSM'
        )
        INSERT INTO public.organisation_managers (organisation_id, user_id)
        SELECT (SELECT id FROM org_cte), %(admin_user_id)s
        ON CONFLICT DO NOTHING;
    """

    insert_svc_account_sql = """
        -- Insert svcfmtm user (for temp auth)
        INSERT INTO public.users (
            id,
            username,
            role,
            name,
            email_address,
            is_email_verified,
            mapping_level,
            tasks_mapped,
            tasks_validated,
            tasks_invalidated
        )
        VALUES (
            %(svc_user_id)s,
            %(svc_username)s,
            'MAPPER',
            'FMTM Service Account',
            %(odk_user)s,
            true,
            'BEGINNER',
            0,
            0,
            0
        )

        ON CONFLICT ("username") DO UPDATE
        SET
            role = EXCLUDED.role,
            mapping_level = EXCLUDED.mapping_level,
            name = EXCLUDED.name;
    """

    async with db.cursor() as cur:
        await cur.execute(
            sql_insert_org,
            {
                "odk_url": settings.ODK_CENTRAL_URL,
                "odk_user": settings.ODK_CENTRAL_USER,
                "odk_pass": encrypt_value(settings.ODK_CENTRAL_PASSWD),
            },
        )

        org_id = await cur.fetchone()
        # NOTE only upload org logo on first org creation (RETURNING statement)
        if org_id:
            org_id = org_id[0]
            logo_path = "/opt/app/images/hot-org-logo.png"
            with open(logo_path, "rb") as logo_file:
                org_logo = UploadFile(BytesIO(logo_file.read()))
            await upload_logo_to_s3(db, org_id, org_logo)

        await cur.execute(
            sql_insert_org_admin,
            {
                "admin_user_id": 1,
                "admin_username": "localadmin",
            },
        )
        await cur.execute(
            sql_set_org_admin,
            {
                "admin_user_id": 1,
            },
        )
        await cur.execute(
            insert_svc_account_sql,
            {
                "svc_user_id": 20386219,
                "svc_username": "svcfmtm",
                "odk_user": settings.ODK_CENTRAL_USER,
            },
        )


async def get_my_organisations(
    db: Connection,
    current_user: AuthUser,
):
    """Get organisations filtered by the current user.

    TODO add extra UNION for all associated projects to user.

    Args:
        db (Session): The database session.
        current_user (AuthUser): The current user.

    Returns:
        list[dict]: A list of organisation objects to be serialised.
    """
    user_id = current_user.id

    sql = """
        SELECT DISTINCT org.*
        FROM organisations org
        JOIN organisation_managers managers
            ON managers.organisation_id = org.id
        WHERE managers.user_id = :user_id

        UNION

        SELECT DISTINCT org.*
        FROM organisations org
        JOIN projects project
            ON project.organisation_id = org.id
        WHERE project.author_id = %(user_id)s;
    """
    async with db.cursor() as cur:
        await cur.execute(sql, {"user_id": user_id})
        orgs = cur.fetchall()
    return orgs


async def get_unapproved_organisations(
    db: Connection,
) -> list[DbOrganisation]:
    """Get unapproved orgs."""
    return DbOrganisation.unapproved(db)


async def upload_logo_to_s3(db: Connection, org_id: int, logo_file: UploadFile) -> str:
    """Upload logo using standardised /{org_id}/logo.png format.

    Browsers treat image mimetypes the same, regardless of extension,
    so it should not matter if a .jpg is renamed .png.

    Args:
        db (Connection): Database connection.
        org_id (int): The organisation id in the database.
        logo_file (UploadFile): The logo image uploaded to FastAPI.

    Returns:
        logo_url(str): The S3 URL for the logo file.
    """
    logo_path = f"/{org_id}/logo.png"

    file_bytes = await logo_file.read()
    file_obj = BytesIO(file_bytes)

    add_obj_to_bucket(
        settings.S3_BUCKET_NAME,
        file_obj,
        logo_path,
        content_type=logo_file.content_type,
    )

    logo_url = f"{settings.S3_DOWNLOAD_ROOT}/{settings.S3_BUCKET_NAME}{logo_path}"

    # Update db
    async with db.cursor() as cur:
        await cur.execute(
            """
            UPDATE organisations
            SET logo = %(logo_url)s
            WHERE id = %(org_id)s;
        """,
            {"org_id": org_id, "logo_url": logo_url},
        )

    return logo_url


async def create_organisation(
    db: Connection,
    org_model: OrganisationIn,
    user_id: AuthUser,
    logo: Optional[UploadFile] = File(None),
) -> DbOrganisation:
    """Creates a new organisation with the given name, description, url, type, and logo.

    Saves the logo file S3 bucket under /{org_id}/logo.png.

    Args:
        db (Connection): database connection.
        org_model (OrganisationIn): Pydantic model for organisation input.
        user_id: User ID of requester.
        logo (UploadFile, optional): logo file of the organisation.
            Defaults to File(...).

    Returns:
        DbOrganisation: Organisation model.
    """
    if await get_organisation(db, org_model.name):
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail=f"Organisation already exists with the name ({org_model.name})",
        )

    db_org = DbOrganisation.create(db, org_model, user_id, logo)
    # Update the logo field in the database with the correct path
    if logo:
        await upload_logo_to_s3(db, db_org.id, logo)

    return db_org


async def delete_organisation(
    db: Connection,
    organisation: db_models.DbOrganisation,
) -> Response:
    """Delete an existing organisation database entry.

    Args:
        db (Session): database session
        organisation (DbOrganisation): Database model to delete.

    Returns:
        bool: If deletion was successful.
    """
    db.delete(organisation)
    db.commit()

    return Response(status_code=HTTPStatus.NO_CONTENT)


async def add_organisation_admin(db: Connection, org_id: int, user_id: int):
    """Adds a user as an admin to the specified organisation.

    Args:
        db (Session): The database session.
        org_id (int): The organisation ID.
        user_id (int): The user ID to add as manager.

    Returns:
        Response: The HTTP response with status code 200.
    """
    log.info(f"Adding user ({user_id}) as org ({org_id}) admin")
    sql = """
        INSERT INTO public.organisation_managers
        (organisation_id, user_id) VALUES (%(org_id)s, %(user_id)s)
        ON CONFLICT DO NOTHING;
    """

    async with db.cursor() as cur:
        await cur.execute(sql, {"org_id": org_id, "user_id": user_id})

    return Response(status_code=HTTPStatus.OK)


async def approve_organisation(db: Connection, org_id: int):
    """Approves an oranisation request made by the user .

    Args:
        db: The database session.
        org_id (int): The organisation ID.

    Returns:
        Response: An HTTP response with the status code 200.
    """
    log.info(f"Approving organisation ({org_id}).")

    async with db.cursor() as cur:
        await cur.execute(
            """
            UPDATE organisations
            SET VALUE
                approved = true
            WHERE
                id = %(org_id)s;
        """,
            {"org_id": org_id},
        )

    return Response(status_code=HTTPStatus.OK)
