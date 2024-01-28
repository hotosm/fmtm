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
from typing import Optional

from fastapi import Form
from pydantic import BaseModel, Field, HttpUrl, computed_field
from pydantic.functional_serializers import field_serializer
from pydantic.functional_validators import field_validator

from app.config import decrypt_value, encrypt_value
from app.models.enums import OrganisationType

# class OrganisationBase(BaseModel):
#     """Base model for organisation to extend."""


class OrganisationIn(BaseModel):
    """Organisation to create from user input."""

    name: str = Field(Form(..., description="Organisation name"))
    description: Optional[str] = Field(
        Form(None, description="Organisation description")
    )
    url: Optional[HttpUrl] = Field(Form(None, description=("Organisation website URL")))
    odk_central_url: Optional[str] = Field(
        Form(None, description="Organisation default ODK URL")
    )
    odk_central_user: Optional[str] = Field(
        Form(None, description="Organisation default ODK User")
    )
    odk_central_password: Optional[str] = Field(
        Form(None, description="Organisation default ODK Password")
    )

    @field_validator("url", mode="after")
    @classmethod
    def convert_url_to_str(cls, value: HttpUrl) -> str:
        """Convert Pydantic Url type to string.

        Database models do not accept type Url for a string field.
        """
        if value:
            return value.unicode_string()
        return ""

    @computed_field
    @property
    def slug(self) -> str:
        """Sanitise the organisation name for use in a URL."""
        if self.name:
            # Remove special characters and replace spaces with hyphens
            slug = sub(r"[^\w\s-]", "", self.name).strip().lower().replace(" ", "-")
            # Remove consecutive hyphens
            slug = sub(r"[-\s]+", "-", slug)
            return slug

    @field_validator("odk_central_password", mode="before")
    @classmethod
    def encrypt_odk_password(cls, value: str) -> str:
        """Encrypt the ODK Central password before db insertion."""
        if not value:
            return ""
        return encrypt_value(value)


class OrganisationEdit(OrganisationIn):
    """Organisation to edit via user input."""

    # Override to make name optional
    name: Optional[str] = Field(Form(None, description="Organisation name"))


class OrganisationOut(BaseModel):
    """Organisation to display to user."""

    id: int
    name: str
    logo: Optional[str]
    description: Optional[str]
    slug: Optional[str]
    url: Optional[str]
    type: OrganisationType


class OrganisationOutWithCreds(BaseModel):
    """Organisation plus decrypted ODK Central password.

    WARNING Do not display this to the user.
    WARNING contains decrypted credentials.
    """

    odk_central_url: Optional[str] = None
    odk_central_user: Optional[str] = None
    odk_central_password: Optional[str] = None

    @field_serializer("odk_central_password")
    def decrypt_password(self, value: str) -> str:
        """Decrypt the database password value."""
        if not value:
            return ""
        return decrypt_value(value)
