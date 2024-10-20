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
from typing import Any, Optional

from geojson_pydantic import Feature
from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, computed_field
from pydantic.functional_validators import field_validator
from pydantic.types import UUID4

from app.models.enums import TaskStatus, get_status_for_action


class ReadTask(BaseModel):
    """Task for serialising and display."""

    id: int
    project_id: int
    project_task_index: Optional[int] = None
    outline: Feature
    feature_count: Optional[int] = None

    @field_validator("outline", mode="before")
    @classmethod
    def outline_geojson_to_feature(
        cls, value: dict | Feature, info: ValidationInfo
    ) -> Feature:
        """Parse GeoJSON from DB into Feature."""
        if isinstance(value, Feature):
            return

        task_id = info.data.get("task_id")
        project_id = info.data.get("id")

        return Feature(
            **{
                "type": "Feature",
                "geometry": value,
                "id": task_id,
                "properties": {"id": task_id, "project_id": project_id},
            }
        )


class TaskHistoryBase(BaseModel):
    """Task mapping history."""

    event_id: UUID4
    action_text: Optional[str]
    action_date: datetime


class TaskHistoryOut(TaskHistoryBase):
    """Task mapping history display."""

    action: Any = Field(exclude=True)

    username: str
    profile_img: Optional[str]

    @computed_field
    @property
    def status(self) -> Optional[TaskStatus]:
        """Get the status from the recent action.

        TODO refactor this out and use 'action'?
        """
        if not self.action:
            return None
        return get_status_for_action(self.action)


class TaskCommentResponse(TaskHistoryOut):
    """Wrapper Class for comment."""


class TaskHistoryCount(BaseModel):
    """Task mapping history display."""

    date: str
    validated: int
    mapped: int


class TaskHistory(BaseModel):
    """Task history details."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    # Excluded
    action: Any = Field(exclude=True)
    user: Any = Field(exclude=True)

    task_id: int
    action_text: Optional[str]
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
    def status(self) -> Optional[TaskStatus]:
        """Get the status from the recent action."""
        if not self.action:
            return None
        return get_status_for_action(self.action)
