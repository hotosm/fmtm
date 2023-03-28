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

# Import necessary modules
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import required database functions and model enums
from ..db import database
from ..models.enums import TaskStatus
from ..users import user_schemas

# Import tasks crud operations and schemas
from . import tasks_crud, tasks_schemas

# Create an API router object
router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    dependencies=[Depends(database.get_db)],
    responses={404: {"description": "Not found"}},
)

# Define a route for getting all tasks
@router.get("/", response_model=tasks_schemas.TaskOut)
async def read_tasks(
    user_id: int = None,
    task_id: int = None,
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(database.get_db),
):
    # Ensure that only one of user_id and task_id is provided
    if user_id and task_id:
        raise HTTPException(
            status_code=300,
            detail="Please provide either user_id OR task_id, not both.",
        )

    # Get the requested tasks
    tasks = tasks_crud.get_tasks(db, user_id, task_id, skip, limit)
    
    # Return the tasks if they exist, otherwise raise an HTTPException
    if tasks:
        return tasks
    else:
        raise HTTPException(status_code=404, detail="Tasks not found")

# Define a route for getting nearby tasks
@router.post("/near_me", response_model=tasks_schemas.TaskOut)
def get_task(lat: float, long: float, project_id: int = None, user_id: int = None):
    return "Coming..."

# Define a route for getting a specific task
@router.get("/{task_id}", response_model=tasks_schemas.TaskOut)
async def read_tasks(task_id: int, db: Session = Depends(database.get_db)):
    # Get the requested task
    task = tasks_crud.get_task(db, task_id)
    
    # Return the task if it exists, otherwise raise an HTTPException
    if task:
        return task
    else:
        raise HTTPException(status_code=404, detail="Task not found")

# Define a route for updating the status of a task
@router.post("/{task_id}/new_status/{new_status}", response_model=tasks_schemas.TaskOut)
async def update_task_status(
    user: user_schemas.User,
    task_id: int,
    new_status: tasks_schemas.TaskStatusOption,
    db: Session = Depends(database.get_db),
):
    # TODO verify logged in user
    user_id = user.id

    # Update the task status and get the updated task
    task = tasks_crud.update_task_status(
        db, user_id, task_id, TaskStatus[new_status.name]
    )
    
    # Return the updated task if it exists, otherwise raise an HTTPException
    if task:
        return task
    else:
        raise HTTPException(status_code=404, detail="Task status could not be updated.")

# Define a route for getting a list of QR codes for a task
@router.post("/task-qr-code/{task_id}")
async def get_qr_code_list(
    task_id: int,
    db: Session = Depends(database.get_db),
    ):
    # Get the QR code list for the task
    return tasks_crud.get_qr_codes_for_task(db=db, task_id=task_id)
