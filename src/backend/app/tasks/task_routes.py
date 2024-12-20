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
"""Routes for FMTM tasks."""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from loguru import logger as log
from psycopg import Connection

from app.auth.auth_schemas import ProjectUserDict
from app.auth.roles import mapper
from app.central.central_crud import get_entities_data, update_entity_mapping_status
from app.db.database import db_conn
from app.db.enums import EntityState, HTTPStatus
from app.db.models import DbOdkEntities, DbProject, DbTask, DbTaskEvent
from app.tasks import task_crud, task_schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=list[task_schemas.TaskOut])
async def read_tasks(
    project_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    project_user: Annotated[ProjectUserDict, Depends(mapper)],
):
    """Get all task details for a project."""
    return await DbTask.all(db, project_id)


@router.post("/near_me", response_model=task_schemas.TaskOut)
async def get_tasks_near_me(
    lat: float, long: float, project_id: int = None, user_id: int = None
):
    """Get tasks near the requesting user."""
    return "Coming..."


@router.get("/activity", response_model=list[task_schemas.TaskEventCount])
async def task_activity(
    project_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    project_user: Annotated[ProjectUserDict, Depends(mapper)],
    days: int = 10,
):
    """Get the number of mapped or validated tasks on each day.

    Return format:
    [
        {
            date: DD/MM/YYYY,
            validated: int,
            mapped: int,
        }
    ]
    """
    return await task_crud.get_project_task_activity(db, project_id, days)


@router.get("/{task_id}", response_model=task_schemas.TaskOut)
async def get_specific_task(
    task_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    project_user: Annotated[ProjectUserDict, Depends(mapper)],
):
    """Get a specific task by it's ID."""
    try:
        return await DbTask.one(db, task_id)
    except KeyError as e:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e)) from e


@router.post("/{task_id}/event", response_model=task_schemas.TaskEventOut)
async def add_new_task_event(
    task_id: int,
    new_event: task_schemas.TaskEventIn,
    project_user: Annotated[ProjectUserDict, Depends(mapper)],
    db: Annotated[Connection, Depends(db_conn)],
):
    """Add a new event to the events table / update task status."""
    user_id = project_user.get("user").id
    log.info(f"Task {task_id} event: {new_event.event.name} (by user {user_id})")

    new_event.user_id = user_id
    new_event.task_id = task_id
    return await DbTaskEvent.create(db, new_event)


@router.get("/{task_id}/history", response_model=list[task_schemas.TaskEventOut])
async def get_task_event_history(
    task_id: int,
    db: Annotated[Connection, Depends(db_conn)],
    project_user: Annotated[ProjectUserDict, Depends(mapper)],
    days: int = 10,
    comments: bool = False,
):
    """Get the detailed history for a task."""
    return await DbTaskEvent.all(db, task_id=task_id, days=days, comments=comments)


@router.post("/unlock-tasks")
async def trigger_unlock_tasks(db: Annotated[Connection, Depends(db_conn)]):
    """Endpoint to trigger unlock_old_locked_tasks manually."""
    active_projects_query = """
        SELECT DISTINCT project_id
        FROM task_events
        WHERE created_at >= NOW() - INTERVAL '3 days'
    """
    async with db.cursor() as cur:
        await cur.execute(active_projects_query)
        active_projects = await cur.fetchall()

    time_now = datetime.now(timezone.utc)
    threedaysago = (time_now - timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    onehourago = (time_now - timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    for (project_id,) in active_projects:
        project = await DbProject.one(db, project_id, True)

        recent_project_entities = await get_entities_data(
            project.odk_credentials, project.odkid, filter_date=threedaysago
        )
        # If there are recent entity updates, skip this project
        if recent_project_entities:
            continue

        await reset_entities_status(db, project.id, onehourago)

        # Only unlock tasks if there are no recent entity updates
        await unlock_old_locked_tasks(db, project.id)
    return {"message": "Old locked tasks unlocked successfully."}


async def reset_entities_status(db, project_id, filter_date):
    """Reset status for entities that have been 'open in ODK' for more than 1hr."""
    project = await DbProject.one(db, project_id, True)
    recent_opened_entities = await get_entities_data(
        project.odk_credentials,
        project.odkid,
        filter_date=filter_date,
    )
    for entity in recent_opened_entities:
        if entity["status"] != str(EntityState.OPENED_IN_ODK):
            continue
        await update_entity_mapping_status(
            project.odk_credentials,
            project.odkid,
            entity["id"],
            f"Task {entity['task_id']} Feature {entity['osm_id']}",
            str(EntityState.READY),
        )

    # Sync ODK entities in our database
    project_entities = await get_entities_data(project.odk_credentials, project.odkid)
    await DbOdkEntities.upsert(db, project.id, project_entities)


async def unlock_old_locked_tasks(db, project_id):
    """Unlock tasks locked for more than 3 days."""
    disable_trigger_query = """
        ALTER TABLE task_events DISABLE TRIGGER task_event_state_trigger;
    """
    unlock_query = """
        WITH svc_user AS (
            SELECT id AS svc_user_id, username AS svc_username
            FROM users
            WHERE username = 'svcfmtm'
        ),
        recent_events AS (
            SELECT DISTINCT ON (t.id, t.project_id)
                t.id AS task_id,
                t.project_id,
                the.created_at AS last_event_time,
                the.event AS last_event
            FROM tasks t
            JOIN task_events the
                ON t.id = the.task_id
                AND t.project_id = the.project_id
                AND the.comment IS NULL
            WHERE t.project_id = %(project_id)s
            ORDER BY t.id, t.project_id, the.created_at DESC
        ),
        filtered_events AS (
            SELECT *
            FROM recent_events
            WHERE last_event IN ('MAP', 'ASSIGN')
            AND last_event_time < NOW() - INTERVAL '3 days'
        )
        INSERT INTO task_events (
            event_id,
            task_id,
            project_id,
            event,
            user_id,
            state,
            created_at,
            username
        )
        SELECT
            gen_random_uuid(),
            fe.task_id,
            fe.project_id,
            'MAP'::taskevent,
            svc.svc_user_id,
            'UNLOCKED_TO_MAP'::mappingstate,
            NOW(),
            svc.svc_username
        FROM filtered_events fe
        CROSS JOIN svc_user svc;
    """
    enable_trigger_query = """
        ALTER TABLE task_events ENABLE TRIGGER task_event_state_trigger;
    """
    async with db.cursor() as cur:
        await cur.execute(disable_trigger_query)
        await cur.execute(unlock_query, {"project_id": project_id})
        await cur.execute(enable_trigger_query)
