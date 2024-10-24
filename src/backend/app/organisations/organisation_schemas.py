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
"""Pydantic models for Organisations."""

from re import sub
from typing import Annotated, Optional

from pydantic import BaseModel, Field, ValidationInfo
from pydantic.functional_validators import field_validator

from app.central.central_schemas import ODKCentralIn
from app.db.enums import OrganisationType
from app.db.models import DbOrganisation


class OrganisationInBase(ODKCentralIn, DbOrganisation):
    """Base model for project insert / update (validators).

    This mode includes ODK credential variables, plug a generated slug.
    """

    # Exclude the id field as this is autogenerated in the db
    id: Annotated[Optional[int], Field(exclude=True)] = None
    # validate_default to trigger when slug is empty (hack to build from name)
    slug: Annotated[Optional[str], Field(validate_default=True)] = None

    @field_validator("slug", mode="after")
    @classmethod
    def set_slug(cls, value: Optional[str], info: ValidationInfo) -> str:
        """Set the slug attribute from the name.

        NOTE this is a bit of a hack.
        Ideally we would set this as a computed_field, but attributes
        cannot be overridden by properties & we get an error.

        To avoid having to list all attributes again in this mode, we simply
        set the value in field_validator that always runs and exclude 'slug'.
        """
        org_name = info.data.get("name")
        # Handle case of updating without name field
        if org_name is None:
            return None
        # Remove special characters and replace spaces with hyphens
        slug = sub(r"[^\w\s-]", "", org_name).strip().lower().replace(" ", "-")
        # Remove consecutive hyphens
        slug = sub(r"[-\s]+", "-", slug)
        return slug


class OrganisationIn(OrganisationInBase):
    """Create an org from user input."""

    # Name is mandatory
    name: str


class OrganisationUpdate(OrganisationInBase):
    """Edit an org from user input."""

    # Allow the name field to be omitted / not updated
    name: Optional[str] = None


class OrganisationOut(BaseModel):
    """Organisation to display to user."""

    id: int
    name: str
    approved: bool
    type: OrganisationType
    logo: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    url: Optional[str]
    odk_central_url: Optional[str]
