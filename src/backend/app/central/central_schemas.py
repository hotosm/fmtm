# Copyright (c) 2023 Humanitarian OpenStreetMap Team
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
"""Schemas for returned ODK Central objects."""

from enum import Enum
from typing import Optional

from geojson_pydantic import Feature, FeatureCollection
from pydantic import BaseModel, Field, computed_field


class CentralBase(BaseModel):
    """ODK Central return."""

    central_url: str


class Central(CentralBase):
    """ODK Central return, with extras."""

    geometry_geojson: str


class CentralOut(CentralBase):
    """ODK Central output."""

    pass


class CentralFileType(BaseModel):
    """ODK Central file return."""

    filetype: Enum("FileType", ["xform", "extract", "zip", "xlsform", "all"])
    pass


class CentralDetails(CentralBase):
    """ODK Central details."""

    pass


class EntityProperties(BaseModel):
    """ODK Entity properties to include in GeoJSON."""

    updatedAt: Optional[str] = Field(exclude=True)  # noqa: N815

    # project_id: Optional[str] = None
    task_id: Optional[str] = None
    osm_id: Optional[str] = None
    tags: Optional[str] = None
    version: Optional[str] = None
    changeset: Optional[str] = None
    timestamp: Optional[str] = None
    status: Optional[str] = None

    @computed_field
    @property
    def updated_at(self) -> Optional[str]:
        """Convert updatedAt field to updated_at."""
        return self.updatedAt


class EntityFeature(Feature):
    """ODK Entities as a GeoJSON Feature."""

    properties: EntityProperties


class EntityFeatureCollection(FeatureCollection):
    """ODK Entity Features wrapped in a FeatureCollection."""

    features: list[EntityFeature]


class EntityMappingStatus(BaseModel):
    """The status for mapping an Entity/feature."""

    updatedAt: Optional[str] = Field(exclude=True)  # noqa: N815

    id: str
    status: Optional[str] = None

    @computed_field
    @property
    def updated_at(self) -> Optional[str]:
        """Convert updatedAt field to updated_at."""
        return self.updatedAt
