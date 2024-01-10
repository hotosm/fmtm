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

"""User roles authorisation Depends methods.

These methods use FastAPI Depends for dependency injection
and always return an AuthUser object in a standard format.
"""

from fastapi import Depends, HTTPException
from loguru import logger as log
from sqlalchemy.orm import Session

from app.auth.osm import AuthUser, login_required
from app.db.database import get_db
from app.db.db_models import DbUser, DbUserRoles
from app.models.enums import ProjectRole, UserRole


async def get_uid(user_data: AuthUser) -> int:
    """Extract user id from returned OSM user."""
    if user_id := user_data.get("id"):
        return user_id
    else:
        log.error(f"Failed to get user id from auth object: {user_data}")
        raise HTTPException(status_code=401, detail="Auth failed. No user id present")


async def super_admin(
    db: Session = Depends(get_db),
    user_data: AuthUser = Depends(login_required),
) -> AuthUser:
    user_id = await get_uid(user_data)

    match = db.query(DbUser).filter_by(id=user_id, role=UserRole.ADMIN).first()

    if not match:
        log.error(f"User ID {user_id} requested an admin endpoint, but is not admin")
        raise HTTPException(status_code=401, detail="User must be an administrator")

    return user_data


async def validator(
    project_id: int,
    db: Session = Depends(get_db),
    user_data: AuthUser = Depends(login_required),
) -> AuthUser:
    user_id = await get_uid(user_data)

    match = (
        db.query(DbUserRoles).filter_by(user_id=user_id, project_id=project_id).first()
    )

    if not match:
        log.error(f"User ID {user_id} has no access to project ID {project_id}")
        raise HTTPException(status_code=401, detail="User has no access to project")

    if match.role.value < ProjectRole.VALIDATOR.value:
        log.error(
            f"User ID {user_id} does not have validator permission"
            f"for project ID {project_id}"
        )
        raise HTTPException(
            status_code=401, detail="User is not a validator for this project"
        )

    return user_data
