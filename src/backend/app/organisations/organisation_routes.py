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
"""Routes for organisation management."""

from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Response,
    UploadFile,
)
from psycopg import Connection

from app.auth.auth_schemas import AuthUser, OrgUserDict
from app.auth.osm import login_required
from app.auth.roles import org_admin, super_admin
from app.db.database import db_conn
from app.db.db_models import DbOrganisation
from app.models.enums import HTTPStatus
from app.organisations import organisation_crud, organisation_schemas
from app.organisations.organisation_deps import org_exists

router = APIRouter(
    prefix="/organisation",
    tags=["organisation"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[organisation_schemas.OrganisationOut])
async def get_organisations(
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(login_required)],
) -> list[DbOrganisation]:
    """Get a list of all organisations."""
    return await DbOrganisation.all(db, current_user.id)


@router.get(
    "/my-organisations", response_model=list[organisation_schemas.OrganisationOut]
)
async def get_my_organisations(
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(login_required)],
) -> list[DbOrganisation]:
    """Get a list of all organisations."""
    return await organisation_crud.get_my_organisations(db, current_user)


@router.get("/unapproved/", response_model=list[organisation_schemas.OrganisationOut])
async def list_unapproved_organisations(
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(login_required)],
) -> list[DbOrganisation]:
    """Get a list of unapproved organisations."""
    return await organisation_crud.get_unapproved_organisations(db)


@router.get("/{org_id}", response_model=organisation_schemas.OrganisationOut)
async def get_organisation_detail(
    organisation: Annotated[DbOrganisation, Depends(org_exists)],
    current_user: Annotated[AuthUser, Depends(login_required)],
):
    """Get a specific organisation by id or name."""
    return organisation


@router.post("/", response_model=organisation_schemas.OrganisationOut)
async def create_organisation(
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(login_required)],
    # Depends required below to allow logo upload
    org: organisation_schemas.OrganisationIn = Depends(),
    logo: Optional[UploadFile] = File(None),
) -> organisation_schemas.OrganisationOut:
    """Create an organisation with the given details.

    TODO refactor to use base64 encoded logo / no upload file.
    TODO then we can use the pydantic model as intended.
    """
    return await organisation_crud.create_organisation(db, org, current_user.id, logo)


@router.patch("/{org_id}/", response_model=organisation_schemas.OrganisationOut)
async def update_organisation(
    db: Annotated[Connection, Depends(db_conn)],
    org_user_dict: Annotated[AuthUser, Depends(org_admin)],
    new_values: organisation_schemas.OrganisationEdit = Depends(),
    logo: UploadFile = File(None),
):
    """Partial update for an existing organisation."""
    # TODO add this logic to db_schemas.DbOrganisation.update()
    return None


@router.delete("/{org_id}")
async def delete_org(
    db: Annotated[Connection, Depends(db_conn)],
    org_user_dict: Annotated[AuthUser, Depends(org_admin)],
):
    """Delete an organisation."""
    org = org_user_dict.get("org")
    deleted_org_id = await DbOrganisation.delete(db, org.id)
    if deleted_org_id:
        return Response(
            status_code=HTTPStatus.NO_CONTENT,
            details=f"Deleted org {(org.deleted_org_id)}.",
        )
    return Response(
        status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        details=f"Failed deleting org {(org.name)}.",
    )


@router.delete("/unapproved/{org_id}")
async def delete_unapproved_org(
    org_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(super_admin)],
):
    """Delete an unapproved organisation.

    ADMIN ONLY ENDPOINT.
    """
    organisation = db.query(DbOrganisation).filter(DbOrganisation.id == org_id).first()
    return await organisation_crud.delete_organisation(db, organisation)


@router.post("/approve/", response_model=organisation_schemas.OrganisationOut)
async def approve_organisation(
    org_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    current_user: Annotated[AuthUser, Depends(super_admin)],
):
    """Approve the organisation request made by the user.

    The logged in user must be super admin to perform this action .
    """
    approved_org = await organisation_crud.approve_organisation(db, org_id)

    # Set organisation requester as organisation manager
    if approved_org.created_by:
        await organisation_crud.add_organisation_admin(
            db, approved_org.id, approved_org.created_by
        )

    return approved_org


@router.post("/add_admin/")
async def add_new_organisation_admin(
    db: Annotated[Connection, Depends(db_conn)],
    org_user_dict: Annotated[OrgUserDict, Depends(org_admin)],
    # user: Annotated[DbUser, Depends(get_user)],
    # org: DbOrganisation = Depends(org_exists),
):
    """Add a new organisation admin.

    The logged in user must be either the owner of the organisation or a super admin.
    """
    # NOTE do we need to uncomment above so org_id is not a mandatory URL param?
    return await organisation_crud.add_organisation_admin(
        db,
        org_user_dict.get("org").id,
        org_user_dict.get("user").id,
    )
