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
"""Pydantic schemas for FMTM task areas."""

from datetime import datetime
from typing import Any, List, Optional

from geojson_pydantic import Feature
from pydantic import BaseModel, ConfigDict, Field, computed_field
from pydantic.functional_validators import field_validator

from app.db.postgis_utils import wkb_geom_to_feature
from app.models.enums import TaskStatus


class TaskHistoryBase(BaseModel):
    """Task mapping history."""

    id: int
    action_text: str
    action_date: datetime


class TaskHistoryOut(TaskHistoryBase):
    """Task mapping history display."""

    username: str
    profile_img: Optional[str]
    status: Optional[str] = None


class TaskHistoryCount(BaseModel):
    """Task mapping history display."""

    date: str
    validated: int
    mapped: int


class Task(BaseModel):
    """Core fields for a Task."""

    model_config = ConfigDict(
        use_enum_values=True,
        validate_default=True,
    )

    # Excluded
    lock_holder: Optional[Any] = Field(default=None, exclude=True)
    outline: Optional[Any] = Field(default=None, exclude=True)

    id: int
    project_id: int
    project_task_index: int
    project_task_name: Optional[str]
    feature_count: Optional[int] = None
    task_status: TaskStatus
    task_history: Optional[List[TaskHistoryBase]] = None

    @computed_field
    @property
    def outline_geojson(self) -> Optional[Feature]:
        """Compute the geojson outline from WKBElement outline."""
        # FIXME

        return None
        # Is parsed as geojson already
        if isinstance(self.outline, dict):
            return self.outline

        if not self.outline:
            return None
        geom_geojson = wkb_geom_to_feature(
            geometry=self.outline,
            properties={
                "fid": self.project_task_index,
                "uid": self.id,
                "name": self.project_task_name,
            },
            id=self.id,
        )
        return Feature(**geom_geojson)

    @computed_field
    @property
    def locked_by_uid(self) -> Optional[int]:
        """Get lock uid from lock_holder details."""
        if self.lock_holder:
            return self.lock_holder.id
        return None

    @computed_field
    @property
    def locked_by_username(self) -> Optional[str]:
        """Get lock username from lock_holder details."""
        if self.lock_holder:
            return self.lock_holder.username
        return None

    @field_validator("task_status", mode="before")
    @classmethod
    def convert_status_to_int(cls, value: TaskStatus) -> int:
        """Convert taskstatus enum value to integer."""
        if not isinstance(value, str):
            raise ValueError(f"Could not convert the returned enum: {value}")
        return TaskStatus[value]


class TaskCommentResponse(TaskHistoryOut):
    """Wrapper Class for comment."""


class TaskCommentRequest(BaseModel):
    """Task comment form."""

    task_id: int
    project_id: int
    comment: str


class ReadTask(Task):
    """Task details plus updated task history."""

    task_history: Optional[List[TaskHistoryOut]] = None


class TaskHistory(BaseModel):
    """Task history details."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    # Excluded
    user: Any = Field(exclude=True)

    task_id: int
    action_text: str
    action_date: datetime

    @computed_field
    @property
    def username(self) -> Optional[str]:
        """Get username from user db obj."""
        if self.user:
            return self.user.username
        return None

    @computed_field
    @property
    def profile_img(self) -> Optional[str]:
        """Get profile_img from user db obj."""
        if self.user:
            return self.user.profile_img
        return None

    @computed_field
    @property
    def status(self) -> Optional[str]:
        """Extract status from standard format action_text."""
        if self.action_text:
            split_text = self.action_text.split()
            if len(split_text) > 5:
                return split_text[5]
            else:
                return self.action_text
        return None
