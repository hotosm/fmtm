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
from uuid import uuid4

from fastapi import Depends, HTTPException
from loguru import logger as log
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

from app.db import database, db_models
from app.db.postgis_utils import timestamp
from app.models.enums import (
    TaskStatus,
    get_action_for_status_change,
    verify_valid_status_update,
)
from app.tasks import tasks_schemas
from app.users import user_crud


async def get_task_count_in_project(db: Session, project_id: int):
    """Get task count for a project."""
    query = text(f"""select count(*) from tasks where project_id = {project_id}""")
    result = db.execute(query)
    return result.fetchone()[0]


async def get_task_id_list(db: Session, project_id: int) -> list[int]:
    """Get a list of tasks id for a project."""
    query = text(
        """
        SELECT id
        FROM tasks
        WHERE project_id = :project_id
    """
    )

    # Then execute the query with the desired parameter
    result = db.execute(query, {"project_id": project_id})

    # Fetch the result
    task_ids = [row.id for row in result]
    return task_ids


async def get_tasks(
    db: Session, project_id: int, user_id: int, skip: int = 0, limit: int = 1000
):
    """Get task details for a project."""
    if project_id:
        db_tasks = (
            db.query(db_models.DbTask)
            .filter(db_models.DbTask.project_id == project_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    elif user_id:
        db_tasks = (
            db.query(db_models.DbTask)
            .filter(db_models.DbTask.locked_by == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    else:
        db_tasks = db.query(db_models.DbTask).offset(skip).limit(limit).all()
    return db_tasks


async def get_task(db: Session, task_id: int) -> db_models.DbTask:
    """Get details for a specific task ID."""
    log.debug(f"Getting task with ID '{task_id}' from database")
    return db.query(db_models.DbTask).filter(db_models.DbTask.id == task_id).first()


async def update_task_status(
    db: Session, user_id: int, task_id: int, new_status: TaskStatus
):
    """Update the status of a task."""
    log.debug(f"Updating task ID {task_id} to status {new_status}")
    if not user_id:
        log.error(f"User id is not present: {user_id}")
        raise HTTPException(status_code=400, detail="User id required.")

    db_user = await user_crud.get_user(db, user_id)
    if not db_user:
        msg = f"User with id {user_id} does not exist."
        log.error(msg)
        raise HTTPException(status_code=400, detail=msg)

    db_task = await get_task(db, task_id)
    log.debug(f"Returned task from db: {db_task}")

    if db_task:
        if db_task.task_status in [
            TaskStatus.LOCKED_FOR_MAPPING,
            TaskStatus.LOCKED_FOR_VALIDATION,
        ]:
            log.debug(f"Task {task_id} currently locked")
            if user_id != db_task.locked_by:
                msg = (
                    f"User {user_id} with username {db_user.username} "
                    "has not locked this task."
                )
                log.error(msg)
                raise HTTPException(
                    status_code=403,
                    detail=msg,
                )

        if not verify_valid_status_update(db_task.task_status, new_status):
            msg = f"{new_status} is not a valid task status"
            log.error(msg)
            raise HTTPException(
                status_code=422,
                detail=msg,
            )

        # update history prior to updating task
        update_history = await create_task_history_for_status_change(
            db_task, new_status, db_user
        )
        db.add(update_history)

        db_task.task_status = new_status

        if new_status in [
            TaskStatus.LOCKED_FOR_MAPPING,
            TaskStatus.LOCKED_FOR_VALIDATION,
        ]:
            db_task.locked_by = db_user.id
        else:
            db_task.locked_by = None

        if new_status == TaskStatus.MAPPED:
            db_task.mapped_by = db_user.id
        if new_status == TaskStatus.VALIDATED:
            db_task.validated_by = db_user.id
        if new_status == TaskStatus.INVALIDATED:
            db_task.mapped_by = None

        db.commit()
        db.refresh(db_task)
        return update_history

    else:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Not a valid status update: "
                f"{db_task.task_status.name} to {new_status.name}"
            ),
        )


# ---------------------------
# ---- SUPPORT FUNCTIONS ----
# ---------------------------


async def create_task_history_for_status_change(
    db_task: db_models.DbTask, new_status: TaskStatus, db_user: db_models.DbUser
):
    """Append task status change to task history."""
    msg = (
        f"Task {db_task.id} changed from {db_task.task_status.name} "
        f"to {new_status.name} by {db_user.username}"
    )
    log.info(msg)

    new_task_history = db_models.DbTaskHistory(
        event_id=uuid4(),
        project_id=db_task.project_id,
        task_id=db_task.id,
        action=get_action_for_status_change(new_status),
        action_text=msg,
        action_date=timestamp(),
        user_id=db_user.id,
    )

    return new_task_history


# --------------------
# ---- CONVERTERS ----
# --------------------

# TODO: write tests for these


async def add_task_comments(
    db: Session, comment: tasks_schemas.TaskCommentRequest, user_id: int
):
    """Add a comment to a task.

    Parameters:
    - db: SQLAlchemy database session
    - comment: TaskCommentBase instance containing the comment details
    - user_id: OAuth user id.

    Returns:
    - Dictionary with the details of the added comment
    """
    # Construct the query to insert the comment and retrieve inserted comment details
    query = text(
        """
        INSERT INTO public.task_history (
            event_id, project_id, task_id, action,
            action_text, action_date, user_id
        )
        VALUES (
            :event_id :project_id, :task_id, 'COMMENT',
            :comment_text, :current_date, :user_id
        )
        RETURNING
            task_history.event_id,
            task_history.action_text,
            task_history.action_date,
            (SELECT username FROM users WHERE id = :user_id) AS username,
            (SELECT profile_img FROM users WHERE id = :user_id) AS profile_img;
    """
    )

    # Define a dictionary with the parameter values
    params = {
        "event_id": uuid4(),
        "project_id": comment.project_id,
        "task_id": comment.task_id,
        "comment_text": comment.comment,
        "current_date": timestamp(),
        "user_id": user_id,
    }

    # Execute the query with the named parameters and commit the transaction
    result = db.execute(query, params)
    db.commit()

    # Fetch the first row of the query result
    row = result.fetchone()

    # Return the details of the added comment as a dictionary
    return {
        "event_id": row[0],
        "action_text": row[1],
        "action_date": row[2],
        "username": row[3],
        "profile_img": row[4],
    }


async def update_task_history(
    task_history: db_models.DbTaskHistory, db: Session = Depends(database.get_db)
):
    """Update task history with username and user profile image."""
    if user_id := task_history.user_id:
        user = db.query(db_models.DbUser).filter_by(id=user_id).first()
        if user:
            task_history.username = user.username
            task_history.profile_img = user.profile_img
    return task_history


async def get_project_task_history(
    task_id: int,
    comment: bool,
    end_date: datetime,
    db: Session,
) -> list:
    """Retrieves the task history records for a specific project.

    Args:
        task_id (int): The task_id of the project.
        comment (bool): True or False, True to get comments
            from the project tasks and False by default for
            entire task status history.
        end_date (datetime, optional): The end date of the task history
            records to retrieve.
        db (Session): The database session.

    Returns:
        A list of task history records for the specified project.
    """
    query = """
        SELECT
            th.event_id, th.action, th.action_text, th.action_date,
            u.username, u.profile_img
        FROM public.task_history th
        LEFT JOIN users u
            ON u.id = th.user_id
        WHERE task_id = :task_id AND  action_date >= :end_date
    """

    query += " AND action = 'COMMENT'" if comment else " AND action != 'COMMENT'"
    query += " ORDER BY id DESC;"

    result = db.execute(
        text(query), {"task_id": task_id, "end_date": end_date}
    ).fetchall()
    task_history = [
        {
            "event_id": row[0],
            "status": None if comment else row[1],
            "action_text": row[2],
            "action_date": row[3],
            "username": row[4],
            "profile_img": row[5],
        }
        for row in result
    ]

    return task_history


async def count_validated_and_mapped_tasks(
    task_history: list, end_date: datetime
) -> list[tasks_schemas.TaskHistoryCount]:
    """Counts the number of validated and mapped tasks.

    Args:
        task_history: The task history records to count.
        end_date: The end date of the date range.

    Returns:
        A list of dictionaries with following keys:
        - 'date': The date in the format 'MM/DD'.
        - 'validated': The cumulative count of validated tasks.
        - 'mapped': The cumulative count of mapped tasks.
    """
    cumulative_counts = {}
    results = []

    current_date = end_date
    while current_date <= datetime.now():
        date_str = current_date.strftime("%m/%d")
        cumulative_counts = {"date": date_str, "validated": 0, "mapped": 0}
        results.append(cumulative_counts)
        current_date += timedelta(days=1)

    # Populate cumulative_counts with counts from task_history
    for history in task_history:
        for result in history:
            task_status = result.get("status")
            date_str = (result.get("action_date")).strftime("%m/%d")
            entry = next(
                (entry for entry in results if entry["date"] == date_str), None
            )

            if entry:
                if task_status == "VALIDATED":
                    entry["validated"] += 1
                elif task_status == "MAPPED":
                    entry["mapped"] += 1

    total_validated = 0
    total_mapped = 0

    for entry in results:
        total_validated += entry["validated"]
        total_mapped += entry["mapped"]
        entry.update({"validated": total_validated, "mapped": total_mapped})

    return results
