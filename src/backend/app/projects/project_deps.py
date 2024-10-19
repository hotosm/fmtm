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

"""Project dependencies for use in Depends."""

from typing import Annotated, Optional

from async_lru import alru_cache
from fastapi import Depends
from fastapi.exceptions import HTTPException
from loguru import logger as log
from psycopg import Connection
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.central import central_schemas
from app.db.database import db_conn
from app.db.db_schemas import DbProject
from app.models.enums import HTTPStatus


async def get_project(db: Annotated[Connection, Depends(db_conn)], id: Optional[int]):
    """Wrap get_project_by_id in a route Depends."""
    return await get_project_by_id(db, id)


async def get_project_by_id(db: Connection, id: int):
    """Get a single project by it's ID."""
    if not id:
        # Skip if no project id passed
        # NOTE we need this for roles.org_admin
        return None

    try:
        return await DbProject.one(db, id)
    except KeyError as e:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e)) from e


async def check_project_dup_name(db: Connection, name: str):
    """Simple check if project already exists with name."""
    # Check if the project name already exists
    sql = """
        SELECT EXISTS (
            SELECT 1
            FROM project_info
            WHERE LOWER(name) = :project_name
        )
    """
    async with db.cursor() as cur:
        await cur.execute(sql, {"project_name": name})
        project_exists = await cur.fetchone()
    if project_exists:
        project_exists = project_exists[0]

    if project_exists:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail=f"Project with name '{name}' already exists.",
        )


@alru_cache(maxsize=32)
async def get_odk_credentials(db: Session, project_id: int):
    """Get ODK credentials of a project, or default organization credentials."""
    sql = text("""
    SELECT
        COALESCE(
            NULLIF(projects.odk_central_url, ''),
            organisations.odk_central_url)
        AS odk_central_url,
        COALESCE(
            NULLIF(projects.odk_central_user, ''),
            organisations.odk_central_user)
        AS odk_central_user,
        COALESCE(
            NULLIF(projects.odk_central_password, ''),
            organisations.odk_central_password
        ) AS odk_central_password
    FROM
        projects
    LEFT JOIN
        organisations ON projects.organisation_id = organisations.id
    WHERE
        projects.id = :project_id
    """)
    result = db.execute(sql, {"project_id": project_id})
    creds = result.first()

    url = creds.odk_central_url
    user = creds.odk_central_user
    password = creds.odk_central_password

    log.debug(f"Retrieved ODK creds for project ({project_id}): {url} | {user}")

    return central_schemas.ODKCentralDecrypted(
        odk_central_url=url,
        odk_central_user=user,
        odk_central_password=password,
    )
