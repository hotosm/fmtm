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


import enum
from datetime import datetime
from typing import List

from geojson_pydantic import Feature
from pydantic import BaseModel

from ..models.enums import TaskStatus


def get_task_status_strings():
    """Get the task status strings.

    Returns:
        Enum: Enum containing the task status strings.
    """
    names = [option.name for option in TaskStatus]
    options = {names[i]: names[i] for i in range(len(names))}
    return enum.Enum("TaskStatusOptions", options)


# Dynamically creates String Enums for API based on Task Status options
TaskStatusOption = get_task_status_strings()


class TaskHistoryBase(BaseModel):
    """Base model for a task history entry.

    Attributes:
        id (int): Task history ID.
        action_text (str): Text describing the action taken.
        action_date (datetime): Date and time of the action.
    """

    id: int
    action_text: str
    action_date: datetime


class TaskHistoryOut(TaskHistoryBase):
    """Output model for a task history entry."""

    pass


class TaskBasicInfo(BaseModel):
    """Basic information about a task.

    Attributes:
        id (int): Task ID.
        project_id (int): Project ID.
        project_task_index (int): Index of the task within the project.
        task_status (TaskStatus): Status of the task.
        locked_by_uid (int, optional): User ID of the user who has locked the task. Defaults to None.
        locked_by_username (str, optional): Username of the user who has locked the task. Defaults to None.
        task_history (List[TaskHistoryBase]): List of task history entries for the task.
    """

    id: int
    project_id: int
    project_task_index: int
    task_status: TaskStatus
    locked_by_uid: int = None
    locked_by_username: str = None
    task_history: List[TaskHistoryBase]


class TaskBase(BaseModel):
    """Base model for a task.

    Attributes:
        id (int): Task ID.
        project_id (int): Project ID.
        project_task_index (int): Index of the task within the project.
        project_task_name (str): Name of the task within the project.
        outline_geojson (Feature): GeoJSON representation of the task outline.
        outline_centroid (Feature): Centroid of the task outline.
        task_status (TaskStatus): Status of the task.
        locked_by_uid (int, optional): User ID of the user who has locked the task. Defaults to None.
        locked_by_username (str, optional): Username of the user who has locked the task. Defaults to None.
        task_history (List[TaskHistoryBase]): List of task history entries for the task.
    """

    id: int
    project_id: int
    project_task_index: int
    project_task_name: str
    outline_geojson: Feature
    # outline_centroid: Feature
    # initial_feature_count: int
    task_status: TaskStatus
    locked_by_uid: int = None
    locked_by_username: str = None
    task_history: List[TaskHistoryBase]


class Task(TaskBase):
    """Model for a task.

    Attributes:
        qr_code_base64 (str): Base64 representation of the QR code for the task.
        task_status_str (TaskStatusOption): String representation of the task status.
    """

    # geometry_geojson: str
    qr_code_base64: str
    task_status_str: TaskStatusOption
    pass


class TaskOut(TaskBase):
    qr_code_base64: str
    task_status_str: TaskStatusOption
    pass


class TaskDetails(TaskBase):
    """Detailed information about a task."""

    pass
