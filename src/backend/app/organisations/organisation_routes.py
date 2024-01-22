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

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.auth.osm import AuthUser, login_required
from app.auth.roles import org_admin, super_admin
from app.db import database
from app.db.db_models import DbOrganisation
from app.organisations import organisation_crud, organisation_schemas
from app.organisations.organisation_deps import org_exists
from app.users.user_deps import user_exists

router = APIRouter(
    prefix="/organisation",
    tags=["organisation"],
    dependencies=[Depends(database.get_db)],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[organisation_schemas.OrganisationOut])
def get_organisations(
    db: Session = Depends(database.get_db),
    current_user: AuthUser = Depends(login_required),
    approved: bool = True,
) -> list[organisation_schemas.OrganisationOut]:
    """Get a list of all organisations."""
    return organisation_crud.get_organisations(db, current_user, approved)


@router.get("/{org_id}", response_model=organisation_schemas.OrganisationOut)
async def get_organisation_detail(
    organisation: DbOrganisation = Depends(org_exists),
    db: Session = Depends(database.get_db),
):
    """Get a specific organisation by id or name."""
    return organisation


@router.post("/", response_model=organisation_schemas.OrganisationOut)
async def create_organisation(
    org: organisation_schemas.OrganisationIn = Depends(),
    logo: UploadFile = File(None),
    db: Session = Depends(database.get_db),
) -> organisation_schemas.OrganisationOut:
    """Create an organisation with the given details."""
    return await organisation_crud.create_organisation(db, org, logo)


@router.patch("/{org_id}/", response_model=organisation_schemas.OrganisationOut)
async def update_organisation(
    new_values: organisation_schemas.OrganisationEdit = Depends(),
    logo: UploadFile = File(None),
    organisation: DbOrganisation = Depends(org_exists),
    db: Session = Depends(database.get_db),
):
    """Partial update for an existing organisation."""
    return await organisation_crud.update_organisation(
        db, organisation, new_values, logo
    )


@router.delete("/{org_id}")
async def delete_organisations(
    organisation: DbOrganisation = Depends(org_exists),
    db: Session = Depends(database.get_db),
):
    """Delete an organisation."""
    return await organisation_crud.delete_organisation(db, organisation)


@router.post("/approve/")
async def approve_organisation(
    organisation_id: int,
    db: Session = Depends(database.get_db),
    current_user: AuthUser = Depends(login_required),
):
    """Approve the organisation request made by the user.

    The logged in user must be super admin to perform this action .
    """
    # check if the current_user is the super admin
    super_admin(db, current_user)
    return await organisation_crud.approve_organisation(db, organisation_id)


@router.post("/add_admin/")
async def add_new_organisation_admin(
    db: Session = Depends(database.get_db),
    current_user: AuthUser = Depends(login_required),
    user: AuthUser = Depends(user_exists),
    organisation: DbOrganisation = Depends(org_exists),
):
    """Add a new organisation admin.

    The logged in user must be either the owner of the organisation or a super admin.
    """
    # check if the current_user is the organisation admin
    org_admin(db, organisation.id, current_user)

    return await organisation_crud.add_organisation_admin(db, user, organization)
