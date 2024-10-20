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
"""Pydantic schemas for Projects for usage in endpoints."""

from datetime import datetime
from typing import Any, List, Optional, Union

from dateutil import parser
from geojson_pydantic import Feature, FeatureCollection, MultiPolygon, Polygon
from pydantic import BaseModel, ValidationInfo, computed_field
from pydantic.functional_serializers import field_serializer
from pydantic.functional_validators import field_validator

from app.central.central_schemas import ODKCentralIn
from app.config import decrypt_value
from app.db.postgis_utils import (
    featcol_to_shapely_geom,
    geojson_to_featcol,
    get_address_from_lat_lon,
    merge_polygons,
    read_wkb,
)
from app.models.enums import (
    ProjectPriority,
    ProjectStatus,
    ProjectVisibility,
    TaskSplitType,
)
from app.tasks.task_schemas import ReadTask
from app.users.user_schemas import UserBasic


class ProjectInBase(BaseModel):
    """Base model for project insert / update (validators)."""

    short_description: Optional[str] = None
    description: Optional[str] = None
    per_task_instructions: Optional[str] = None
    custom_tms_url: Optional[str] = None
    organisation_id: Optional[int] = None
    hashtags: Optional[str] = None
    task_split_type: Optional[TaskSplitType] = None
    task_split_dimension: Optional[int] = None
    task_num_buildings: Optional[int] = None
    data_extract_type: Optional[str] = None

    @computed_field
    @property
    def project_name_prefix(self) -> str:
        """Compute project name prefix with underscores."""
        return self.name.replace(" ", "_").lower()

    @field_validator("hashtags", mode="after")
    @classmethod
    def validate_hashtags(cls, hashtags: Optional[str]) -> List[str]:
        """Validate hashtags.

        - Receives a string and parsed as a list of tags.
        - Commas or semicolons are replaced with spaces before splitting.
        - Add '#' to hashtag if missing.
        - Also add default '#FMTM' tag.
        """
        if hashtags is None:
            return ["#FMTM"]

        hashtags = hashtags.replace(",", " ").replace(";", " ")
        hashtags_list = hashtags.split()

        # Add '#' to hashtag strings if missing
        hashtags_with_hash = [
            f"#{hashtag}" if hashtag and not hashtag.startswith("#") else hashtag
            for hashtag in hashtags_list
        ]

        if "#FMTM" not in hashtags_with_hash:
            hashtags_with_hash.append("#FMTM")

        return hashtags_with_hash


class ProjectIn(ProjectInBase, ODKCentralIn):
    """Upload new project."""

    name: str
    xform_category: str
    outline: FeatureCollection

    @field_validator("outline", mode="before")
    @classmethod
    def outline_geojson_to_featcol(
        cls,
        value: FeatureCollection | Feature | MultiPolygon | Polygon,
    ) -> list[FeatureCollection]:
        """Convert input geojson to FeatureCollection for consistency."""
        featcol = geojson_to_featcol(value.model_dump())
        return merge_polygons(featcol)

    @computed_field
    @property
    def location_str(self) -> Optional[str]:
        """Generate location string from project centroid."""
        if self.location_str is not None:
            # Prevent running triggering multiple times if already set
            return ""

        geom = featcol_to_shapely_geom(self.outline)
        centroid = geom.centroid
        latitude, longitude = centroid.y, centroid.x
        address = get_address_from_lat_lon(latitude, longitude)
        return address if address is not None else ""


class ProjectUpdate(ProjectInBase, ODKCentralIn):
    """Update a project, where all fields are optional."""

    name: Optional[str] = None
    xform_category: Optional[str] = None
    outline: Optional[FeatureCollection] = None
    location_str: Optional[str] = None

    @field_validator("outline", mode="before")
    @classmethod
    def outline_geojson_to_featcol(
        cls,
        value: FeatureCollection | Feature | MultiPolygon | Polygon,
    ) -> list[FeatureCollection]:
        """Convert input geojson to FeatureCollection for consistency."""
        if not value:
            return None
        featcol = geojson_to_featcol(value.model_dump())
        return merge_polygons(featcol)


class GeojsonFeature(BaseModel):
    """Features used for Task definitions."""

    id: int
    geometry: Optional[Feature] = None


class ProjectSummary(BaseModel):
    """Project summaries."""

    id: int
    priority: ProjectPriority
    title: Optional[str] = None
    # NOTE we cannot be WKBElement element here, as it can't be serialized
    centroid: Optional[Any]
    location_str: Optional[str] = None
    description: Optional[str] = None
    total_tasks: Optional[int] = None
    num_contributors: Optional[int] = None
    tasks_mapped: Optional[int] = None
    tasks_validated: Optional[int] = None
    tasks_bad: Optional[int] = None
    hashtags: Optional[List[str]] = None
    organisation_id: Optional[int] = None
    organisation_logo: Optional[str] = None

    @field_serializer("centroid")
    def get_coord_from_centroid(self, value) -> Optional[list[float]]:
        """Get the cetroid coordinates from WBKElement."""
        if value is None:
            return None
        centroid_point = read_wkb(value)
        centroid = [centroid_point.x, centroid_point.y]
        return centroid


class PaginationInfo(BaseModel):
    """Pagination JSON return."""

    has_next: bool
    has_prev: bool
    next_num: Optional[int]
    page: int
    pages: int
    prev_num: Optional[int]
    per_page: int
    total: int


class PaginatedProjectSummaries(BaseModel):
    """Project summaries + Pagination info."""

    results: List[ProjectSummary]
    pagination: PaginationInfo


class ReadProject(BaseModel):
    """Subset of DbProject for serialising and display."""

    id: int
    odkid: Optional[int] = None
    author_id: int
    organisation_id: int
    task_split_type: Optional[TaskSplitType] = None
    project_name_prefix: Optional[str] = None
    location_str: Optional[str] = None
    custom_tms_url: Optional[str] = None
    outline: Feature
    status: ProjectStatus
    visibility: ProjectVisibility
    total_tasks: Optional[int] = None
    xform_category: Optional[str] = None
    odk_form_id: Optional[str] = None
    odk_token: Optional[str] = None
    data_extract_type: Optional[str] = None
    data_extract_url: Optional[str] = None
    task_split_dimension: Optional[int] = None
    task_num_buildings: Optional[int] = None
    hashtags: Optional[list[str]] = None
    updated_at: datetime
    created_at: datetime

    # Relationships
    tasks: Optional[list[ReadTask]] = None
    author: Optional[UserBasic] = None

    # Calculated
    organisation_logo: Optional[str] = None
    centroid: Optional[Feature] = None
    bbox: Optional[list] = None

    @field_validator("outline", mode="before")
    @classmethod
    def outline_geojson_to_feature(
        cls, value: dict | Feature, info: ValidationInfo
    ) -> Feature:
        """Parse GeoJSON from DB into Feature."""
        if isinstance(value, Feature):
            return

        project_id = info.data.get("id")
        return Feature(
            **{
                "type": "Feature",
                "geometry": value,
                "id": project_id,
                "properties": {"id": project_id, "bbox": info.data.get("bbox")},
            }
        )

    @field_validator("centroid", mode="before")
    @classmethod
    def centroid_geojson_to_feature(
        cls, value: dict | Feature, info: ValidationInfo
    ) -> Feature:
        """Parse GeoJSON from DB into Feature."""
        if isinstance(value, Feature):
            return

        return Feature(
            **{
                "type": "Feature",
                "geometry": value,
                "id": info.data.get("id"),
                "properties": {},
            }
        )

    @field_serializer("odk_token")
    def decrypt_password(self, value: str) -> Optional[str]:
        """Decrypt the ODK Token extracted from the db."""
        if not value:
            return ""

        return decrypt_value(value)


class BackgroundTaskStatus(BaseModel):
    """Background task status for project related tasks."""

    status: str
    message: Optional[str] = None


class ProjectDashboard(BaseModel):
    """Project details dashboard."""

    project_name_prefix: str
    organisation_name: str
    total_tasks: int
    created_at: datetime
    organisation_logo: Optional[str] = None
    total_submission: Optional[int] = None
    total_contributors: Optional[int] = None
    last_active: Optional[Union[str, datetime]] = None

    @field_serializer("last_active")
    def get_last_active(self, value, values):
        """Date of last activity on project."""
        if value is None:
            return None

        last_active = parser.parse(value).replace(tzinfo=None)
        current_date = datetime.now()

        time_difference = current_date - last_active

        days_difference = time_difference.days

        if days_difference == 0:
            return "today"
        elif days_difference == 1:
            return "yesterday"
        elif days_difference < 7:
            return f'{days_difference} day{"s" if days_difference > 1 else ""} ago'
        else:
            return last_active.strftime("%d %b %Y")
