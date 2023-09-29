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


class ODKCentral(BaseModel):
    """Represents the configuration details for an ODK Central instance.

    Attributes:
        odk_central_url (str): The URL of the ODK Central instance.
        odk_central_user (str): The username for ODK Central.
        odk_central_password (str): The password for ODK Central.

    """

    odk_central_url: str
    odk_central_user: str
    odk_central_password: str


class ProjectInfo(BaseModel):
    """Basic information about a project.

    Attributes:
        name (str): The project's name.
        short_description (str): A short description of the project.
        description (str): The full description of the project.

    """

    name: str
    short_description: str
    description: str


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None


class BETAProjectUpload(BaseModel):
    """Data needed to upload a new project.

    Attributes:
        author (User): The author of the project.
        project_info (ProjectInfo): Information about the project.
        xform_title (Union[str, None]): The title of the XForm.
        odk_central (ODKCentral): Configuration for ODK Central.
        hashtags (Union[List[str], None]): List of hashtags for the project.

    """

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
    project_id: int
    task_id: Optional[int] = None
    geometry: Optional[GeojsonFeature] = None


class ProjectSummary(BaseModel):
    """Summary view of project details.

    Attributes:
        id (int): The project's ID.
        priority (ProjectPriority): The priority of the project.
        priority_str (str): String representation of priority.
        title (str): The project's title.
        location_str (str): String representation of project location.
        description (str): The project's description.
        num_contributors (int): Number of contributors.
        total_tasks (int): Total number of tasks.
        tasks_mapped (int): Number of mapped tasks.
        tasks_validated (int): Number of validated tasks.
        tasks_bad (int): Number of problematic tasks.
        hashtags (List[str]): List of project hashtags.

    """

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


class ProjectBase(BaseModel):
    """Base structure of a project.

    Attributes:
        id (int): The project's ID.
        odkid (int): The ODK ID of the project.
        author (User): The author of the project.
        project_info (List[ProjectInfo]): List of project information.
        status (ProjectStatus): The status of the project.
        outline_geojson (Feature): Outline geometry of the project.
        project_tasks (List[tasks_schemas.Task]): List of project tasks.
        xform_title (str): Title of the XForm.
        hashtags (List[str]): List of project hashtags.

    """

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
    """Detailed project information.

    Inherits from ProjectBase and provides additional information.

    """

    pass
