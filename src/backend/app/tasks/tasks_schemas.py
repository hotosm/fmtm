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


import base64
from datetime import datetime
from typing import Any, List, Optional

from geojson_pydantic import Feature
from loguru import logger as log
from pydantic import BaseModel, ConfigDict, Field, ValidationInfo
from pydantic.functional_validators import field_validator

from app.db.postgis_utils import geometry_to_geojson
from app.models.enums import TaskStatus


class TaskHistoryBase(BaseModel):
    id: int
    action_text: str
    action_date: datetime
    obj: Optional[Any] = None


class TaskHistoryOut(TaskHistoryBase):
    pass


class TaskBasicInfo(BaseModel):
    id: int
    project_id: int
    project_task_index: int
    task_status: TaskStatus
    locked_by_uid: int = None
    locked_by_username: str = None
    task_history: List[TaskHistoryBase]


class TaskBase(BaseModel):
    model_config = ConfigDict(
        use_enum_values=True,
        validate_default=True,
    )

    # Excluded
    lock_holder: Any = Field(exclude=True)
    qr_code: Any = Field(exclude=True)

    id: int
    project_id: int
    project_task_index: int
    project_task_name: str
    outline_geojson: Optional[Feature] = None
    # outline_centroid: Feature
    # initial_feature_count: int
    task_status: TaskStatus
    locked_by_uid: Optional[int] = None
    locked_by_username: Optional[str] = None
    task_history: Optional[List[TaskHistoryBase]] = None

    @field_validator("outline_geojson", mode="before")
    @classmethod
    def get_geojson_from_outline(cls, v: Any, info: ValidationInfo) -> str:
        """Get outline_geojson from Shapely geom."""
        if outline := info.data.get("outline"):
            properties = {
                "fid": info.data.get("project_task_index"),
                "uid": info.data.get("id"),
                "name": info.data.get("project_task_name"),
            }
            log.debug("Converting task outline to geojson")
            return geometry_to_geojson(outline, properties, info.data.get("id"))
        return None

    @field_validator("locked_by_uid", mode="before")
    @classmethod
    def get_lock_uid(cls, v: int, info: ValidationInfo) -> str:
        """Get lock uid from lock_holder details."""
        if lock_holder := info.data.get("lock_holder"):
            return lock_holder.get("id")
        return None

    @field_validator("locked_by_username", mode="before")
    @classmethod
    def get_lock_username(cls, v: str, info: ValidationInfo) -> str:
        """Get lock username from lock_holder details."""
        if lock_holder := info.data.get("lock_holder"):
            return lock_holder.get("username")
        return None


class Task(TaskBase):
    qr_code_base64: Optional[str] = None

    @field_validator("qr_code_base64", mode="before")
    @classmethod
    def get_qrcode_base64(cls, v: Any, info: ValidationInfo) -> str:
        """Get base64 encoded qrcode."""
        if qr_code := info.data.get("qr_code"):
            log.debug(
                f"QR code found for task ID {info.data.get('id')}. "
                "Converting to base64"
            )
            return base64.b64encode(qr_code.image)
        else:
            log.warning(f"No QR code found for task ID {db_task.id}")
            return ""


class TaskDetails(TaskBase):
    pass
