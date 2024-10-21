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

from geojson_pydantic import Polygon
from pydantic import BaseModel, Field, computed_field
from pydantic.types import UUID4

from app.db.enums import TaskStatus, get_status_for_action
from app.db.models import DbTask, DbTaskHistory


class TaskOut(DbTask):
    """Task for serialising and display."""

    # Parse as geojson_pydantic.Polygon
    outline: Polygon


class TaskHistoryBase(BaseModel):
    """Task mapping history."""

    event_id: UUID4
    action_text: Optional[str]
    action_date: datetime


class TaskHistoryOut(DbTaskHistory):
    """Task mapping history display."""

    action: Any = Field(exclude=True)

    event_id: UUID4

    @computed_field
    @property
    def status(self) -> Optional[TaskStatus]:
        """Get the status from the recent action.

        TODO SQL refactor this out and use 'action' or similar?
        """
        if not self.action:
            return None
        return get_status_for_action(self.action)


class TaskHistoryCount(BaseModel):
    """Task mapping history status counts per day."""

    date: str
    validated: int
    mapped: int
