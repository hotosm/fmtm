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

# import required libraries and modules
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# import database and user related files
from ..db import database
from . import user_crud, user_schemas

# create a new router object with prefix, tags, and response object
router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(database.get_db)],
    responses={404: {"description": "Not found"}},
)

# create a new user and return the user's details
@router.post("/", response_model=user_schemas.UserOut)
def create_user(user: user_schemas.UserIn, db: Session = Depends(database.get_db)):
    existing_user = user_crud.get_user_by_username(db, username=user.username)
    # check if the username is already registered or not
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # create a new user and return the user details
    return user_crud.create_user(db=db, user=user)

# get all users, and filter users based on username, skip, and limit parameters
@router.get("/", response_model=List[user_schemas.UserOut])
def get_users(
    username: str = "",
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    # get all users based on skip and limit parameters
    users = user_crud.get_users(db, skip=skip, limit=limit)
    # return the list of users
    return users
    # TODO error thrown when no users are in db

# get a single user details using user id
@router.get("/{id}", response_model=user_schemas.UserOut)
async def get_user_by_id(id: int, db: Session = Depends(database.get_db)):
    # get the user details based on the user id
    user = user_crud.get_user(db, user_id=id)
    # if the user exists, return the user details
    if user:
        return user
    # if the user does not exist, raise a HTTP exception with status code 404
    else:
        raise HTTPException(status_code=404, detail="User not found")
