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

from datetime import datetime, timedelta

from fastapi import HTTPException
from loguru import logger as log
from psycopg import Connection
from psycopg.rows import class_row

from app.db.enums import (
    HTTPStatus,
    TaskStatus,
)
from app.db.models import DbTaskHistory
from app.tasks import task_schemas


# TODO SQL refactor this to use case statements on /next
async def new_task_event(
    db: Connection, project_id: int, task_id: int, user_id: int, new_status: TaskStatus
):
    """Add a new entry to the task events."""
    log.debug(f"Checking if task ({task_id}) is already locked")
    sql = """
        SELECT
            th.event_id,
            th.action_date,
            th.action,
            th.user_id,
            u.username
        FROM
            task_history th
        LEFT JOIN
            users u ON th.user_id = u.id
        WHERE
            th.task_id = %(task_id)s
        ORDER BY
            th.action_date DESC
        LIMIT 1
    """

    async with db.cursor(row_factory=class_row(DbTaskHistory)) as cur:
        await cur.execute(sql, {"task_id": task_id})
        history_entry = await cur.fetchone()

    if history_entry and history_entry.action in [
        TaskStatus.LOCKED_FOR_MAPPING.value,
        TaskStatus.LOCKED_FOR_VALIDATION.value,
    ]:
        if history_entry.user_id != user_id:
            msg = f"Task is locked by user {history_entry.username}"
            log.error(msg)
            raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail=msg)

    log.info(f"Updating task ID {task_id} to status {new_status}")
    sql = """
        WITH new_history AS (
            INSERT INTO task_history (
                event_id,
                project_id,
                task_id,
                user_id,
                action,
                action_text
            ) VALUES (
                gen_random_uuid(),
                %(project_id)s,
                %(task_id)s,
                %(user_id)s,
                %(new_status)s,
                'CHANGED TO MAPPED by svcfmtm'
            )
            RETURNING *
        )
        SELECT
            nh.event_id,
            nh.project_id,
            nh.task_id,
            nh.user_id,
            nh.action,
            nh.action_text,
            nh.action_date,
            u.username,
            u.profile_img
        FROM
            new_history nh
        LEFT JOIN
            users u ON nh.user_id = u.id;
    """
    async with db.cursor(row_factory=class_row(DbTaskHistory)) as cur:
        await cur.execute(
            sql,
            {
                "project_id": project_id,
                "task_id": task_id,
                "user_id": user_id,
                "new_status": new_status.name,
            },
        )
        history_entry = await cur.fetchone()

    if not history_entry:
        raise HTTPException(
            status_code=400, detail="Failed to create task history entry."
        )

    return history_entry


async def get_project_task_activity(
    db: Connection,
    project_id: int,
    days: int,
) -> task_schemas.TaskHistoryCount:
    """Get number of tasks mapped and validated for project.

    Args:
        project_id (int): The ID of the project.
        days (int): The number of days to consider for the
            task activity (default: 10).
        db (Connection): The database connection.

    Returns:
        list[task_schemas.TaskHistoryCount]: A list of task history counts.
    """
    end_date = datetime.now() - timedelta(days=days)

    sql = """
        SELECT
            to_char(action_date::date, 'dd/mm/yyyy') as date,
            COUNT(*) FILTER (WHERE action = 'VALIDATED') AS validated,
            COUNT(*) FILTER (WHERE action = 'MARKED_MAPPED') AS mapped
        FROM
            task_history
        WHERE
            project_id = %(project_id)s
            AND action_date >= %(end_date)s
        GROUP BY
            action_date::date
        ORDER BY
            action_date::date;
    """

    async with db.cursor(row_factory=class_row(task_schemas.TaskHistoryCount)) as cur:
        await cur.execute(sql, {"project_id": project_id, "end_date": end_date})
        return await cur.fetchall()


async def get_task_history(
    db: Connection,
    task_id: int,
    days: int,
    comments_only: bool,
) -> DbTaskHistory:
    """Get the detailed history for a task.

    Args:
        task_id (int): The task ID.
        days (int): The number of days to consider for the
            task history (default: 10).
        comments_only (bool): True or False, True to get comments
            from the project tasks and False by default for
            entire task status history.
        db (Connection): The database connection.

    Returns:
        list[DbTaskHistory]: A list of task history.
    """
    end_date = datetime.now() - timedelta(days=days)

    sql = """
        SELECT
            th.event_id,
            th.action,
            th.action_text,
            th.action_date,
            u.username,
            u.profile_img
        FROM public.task_history th
        LEFT JOIN users u
            ON u.id = th.user_id
        WHERE task_id = %(task_id)s AND action_date >= %(end_date)s
    """
    sql += " AND action = 'COMMENT'" if comments_only else " AND action != 'COMMENT'"
    sql += " ORDER BY id DESC;"

    async with db.cursor(row_factory=class_row(DbTaskHistory)) as cur:
        await cur.execute(sql, {"task_id": task_id, "end_date": end_date})
        return await cur.fetchall()
