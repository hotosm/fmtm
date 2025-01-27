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

from typing import Annotated, Optional, Self

from fastapi import Form
from pydantic import BaseModel, Field
from pydantic.functional_validators import model_validator

from app.central.central_schemas import ODKCentralIn
from app.db.enums import CommunityType, OrganisationType
from app.db.models import DbOrganisation, slugify


class OrganisationInBase(ODKCentralIn, DbOrganisation):
    """Base model for project insert / update (validators).

    This mode includes ODK credential variables, plug a generated slug.
    """

    # Exclude the id field as this is autogenerated in the db
    id: Annotated[Optional[int], Field(exclude=True)] = None

    @model_validator(mode="after")
    def append_fmtm_hashtag_and_slug(self) -> Self:
        """Append the #FMTM hashtag and add URL slug."""
        # NOTE the slug is set here as a field_validator
        # does not seem to work?
        self.slug = slugify(self.name)
        return self


class OrganisationIn(OrganisationInBase):
    """Create an org from user input."""

    # Name is mandatory
    name: str


class OrganisationUpdate(OrganisationInBase):
    """Edit an org from user input."""

    # Allow the name field to be omitted / not updated
    name: Optional[str] = None


def parse_organisation_input(
    name: Optional[str] = Form(None),
    slug: Optional[str] = Form(None),
    created_by: Optional[int] = Form(None),
    community_type: CommunityType = Form(None),
    description: Optional[str] = Form(None),
    associated_email: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    type: OrganisationType = Form(None, alias="type"),
    odk_central_url: Optional[str] = Form(None),
    odk_central_user: Optional[str] = Form(None),
    odk_central_password: Optional[str] = Form(None),
) -> OrganisationUpdate:
    """Parse organisation input data from a FastAPI Form.

    The organisation fields are passed as keyword arguments. The
    ODKCentralIn model is used to parse the ODK credential fields, and
    the OrganisationIn model is used to parse the organisation fields.

    The parsed data is returned as an OrganisationIn instance, with the
    ODKCentralIn fields merged in.
    """
    return OrganisationUpdate(
        name=name,
        slug=slug,
        created_by=created_by,
        description=description,
        associated_email=associated_email,
        url=url,
        community_type=community_type,
        type=type,
        odk_central_url=odk_central_url,
        odk_central_user=odk_central_user,
        odk_central_password=odk_central_password,
    )


class OrganisationOut(BaseModel):
    """Organisation to display to user."""

    id: int
    name: str
    approved: bool
    type: OrganisationType
    community_type: CommunityType
    logo: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    url: Optional[str]
    associated_email: Optional[str]
    odk_central_url: Optional[str]
