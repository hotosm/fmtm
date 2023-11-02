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

from typing import List, Optional, Union

from geojson_pydantic import Feature as GeojsonFeature
from pydantic import BaseModel

from ..models.enums import ProjectPriority, ProjectStatus
from ..tasks import tasks_schemas
from ..users.user_schemas import User
from ..db import db_models


class ODKCentral(BaseModel):
    odk_central_url: str
    odk_central_user: str
    odk_central_password: str


class ProjectInfo(BaseModel):
    name: str
    short_description: str
    description: str


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None


class BETAProjectUpload(BaseModel):
    author: User
    project_info: ProjectInfo
    xform_title: Union[str, None]
    odk_central: ODKCentral
    hashtags: Optional[List[str]] = None
    organisation_id: Optional[int] = None
    # city: str
    # country: str


class Feature(BaseModel):
    id: int
    geometry: Optional[GeojsonFeature] = None


class ProjectSummary(BaseModel):
    id: int = -1
    priority: ProjectPriority = ProjectPriority.MEDIUM
    priority_str: str = priority.name
    title: Optional[str] = None
    location_str: Optional[str] = None
    description: Optional[str] = None
    total_tasks: Optional[int] = None
    tasks_mapped: Optional[int] = None
    num_contributors: Optional[int] = None
    tasks_validated: Optional[int] = None
    tasks_bad: Optional[int] = None
    hashtags: Optional[List[str]] = None
    organisation_id: Optional[int] = None
    organisation_logo: Optional[str] = None

    @classmethod
    def from_db_project(cls, project: db_models.DbProject,) -> "ProjectSummary":
        priority = project.priority
        return cls(
            id=project.id,
            priority= priority,
            priority_str=priority.name,
            title=project.title,
            location_str=project.location_str,
            description=project.description,
            total_tasks=project.total_tasks,
            tasks_mapped=project.tasks_mapped,
            num_contributors=project.num_contributors,
            tasks_validated=project.tasks_validated,
            tasks_bad=project.tasks_bad,
            hashtags=project.hashtags,
            organisation_id=project.organisation_id,
            organisation_logo=project.organisation_logo,
        )

class PaginationInfo(BaseModel):
    hasNext: bool
    hasPrev: bool
    nextNum: Optional[int]
    page: int
    pages: int
    prevNum: Optional[int]
    perPage: int
    total: int

class PaginatedProjectSummaries(BaseModel):
    results: List[ProjectSummary]
    pagination: PaginationInfo

class ProjectBase(BaseModel):
    id: int
    odkid: int
    author: User
    project_info: List[ProjectInfo]
    status: ProjectStatus
    # location_str: str
    outline_geojson: Optional[GeojsonFeature] = None
    project_tasks: Optional[List[tasks_schemas.Task]]
    xform_title: Optional[str] = None
    hashtags: Optional[List[str]] = None
    organisation_id: Optional[int] = None


class ProjectOut(ProjectBase):
    pass
