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
"""Logic for FMTM tasks."""

from fastapi import HTTPException
from loguru import logger as log
from psycopg import Connection

from app.db.enums import (
    HTTPStatus,
    MappingState,
    TaskEvent,
)
from app.db.models import DbTask, DbTaskEvent
from app.tasks import task_schemas


# TODO SQL refactor this to use case statements on /next
async def new_task_event(
    db: Connection, task_id: int, user_id: int, new_event: TaskEvent
):
    """Add a new entry to the task events."""
    log.debug(f"Checking if task ({task_id}) is already locked")
    task_entry = await DbTask.one(db, task_id)

    if task_entry and task_entry.task_state in [
        MappingState.LOCKED_FOR_MAPPING,
        MappingState.LOCKED_FOR_VALIDATION,
    ]:
        if task_entry.actioned_by_uid != user_id:
            msg = f"Task is locked by user {task_entry.username}"
            log.error(msg)
            raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail=msg)

    log.info(f"Updating task ID {task_id} to status {new_event}")
    event_in = task_schemas.TaskEventIn(
        task_id=task_id,
        user_id=user_id,
        event=new_event,
        # NOTE we don't include a comment unless necessary
    )
    created_task_event = await DbTaskEvent.create(db, event_in)
    return created_task_event


# FIXME the endpoint that calls this isn't used?
# async def get_project_task_activity(
#     db: Connection,
#     project_id: int,
#     days: int,
# ) -> task_schemas.TaskEventCount:
#     """Get number of tasks mapped and validated for project.

#     Args:
#         project_id (int): The ID of the project.
#         days (int): The number of days to consider for the
#             task activity (default: 10).
#         db (Connection): The database connection.

#     Returns:
#         list[task_schemas.TaskEventCount]: A list of task event counts.
#     """
#     end_date = datetime.now() - timedelta(days=days)

#     sql = """
#         SELECT
#             to_char(created_at::date, 'dd/mm/yyyy') as date,
#             COUNT(*) FILTER (WHERE state = 'UNLOCKED_DONE') AS validated,
#             COUNT(*) FILTER (WHERE state = 'UNLOCKED_TO_VALIDATE') AS mapped
#         FROM
#             task_events
#         WHERE
#             project_id = %(project_id)s
#             AND created_at >= %(end_date)s
#         GROUP BY
#             created_at::date
#         ORDER BY
#             created_at::date;
#     """

#     async with db.cursor(row_factory=class_row(task_schemas.TaskEventCount)) as cur:
#         await cur.execute(sql, {"project_id": project_id, "end_date": end_date})
#         return await cur.fetchall()
