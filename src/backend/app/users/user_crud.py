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
from typing import List

import bcrypt
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..db import db_models
from . import user_schemas

# --------------
# ---- CRUD ----
# --------------


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
    Get a list of users from the database.

    Args:
        db (Session): The database session.
        skip (int, optional): The number of users to skip. Defaults to 0.
        limit (int, optional): The maximum number of users to return. Defaults to 100.

    Returns:
        List[user_schemas.User]: A list of users.
    """
    db_users = db.query(db_models.DbUser).offset(skip).limit(limit).all()
    return convert_to_app_user(db_users) if db_users else []


def get_user(db: Session, user_id: int, db_obj: bool = False):
    """
    Get a user from the database by their ID.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve.
        db_obj (bool, optional): If True, return the database object instead of the app user object. Defaults to False.

    Returns:
        user_schemas.User: The user with the given ID.
    """
    
    db_user = db.query(db_models.DbUser).filter(db_models.DbUser.id == user_id).first()
    if db_obj:
        return db_user
    return convert_to_app_user(db_user)


def get_user_by_username(db: Session, username: str):
    """
    Get a user from the database by their username.

    Args:
        db (Session): The database session.
        username (str): The username of the user to retrieve.

    Returns:
        user_schemas.User: The user with the given username.
    """
    db_user = (
        db.query(db_models.DbUser).filter(db_models.DbUser.username == username).first()
    )
    return convert_to_app_user(db_user)


def create_user(db: Session, user: user_schemas.UserIn):
    """
    Create a new user in the database.

    Args:
        db (Session): The database session.
        user (user_schemas.UserIn): The data for the new user.

    Returns:
        user_schemas.User: The newly created user.

    Raises:
        Exception: If no data is provided for the new user.
    """
    if user:
        db_user = db_models.DbUser(
            username=user.username, password=hash_password(user.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)  # now contains generated id etc.

        return convert_to_app_user(db_user)

    return Exception("No user passed in")


# ---------------------------
# ---- SUPPORT FUNCTIONS ----
# ---------------------------


def hash_password(password: str):
    
    """
    Hash a password using bcrypt.

    Args:
        password (str): The password to hash.

    Returns:
        str: The hashed password.
    """
    hashed_password_encoded = bcrypt.hashpw(password.encode("utf8"), bcrypt.gensalt())
    hashed_password = hashed_password_encoded.decode("utf8")
    return hashed_password


def verify_password(user_password, hashed_password):
    """"
    Verify if a given password matches a hashed password.

    Args:
        user_password (str): The password entered by the user.
        hashed_password (str): The hashed password stored in the database.

    Returns:
        bool: True if the passwords match, False otherwise.
        
    """
    is_valid = bcrypt.checkpw(
        user_password.encode("utf8"), hashed_password.encode("utf8")
    )
    return is_valid


def unhash_password(hashed_password: str):
    """
    Returns hashed password

    Args:
        hashed_password (str): The hashed password stored in the database.

    Returns:
        str: The hashed password.
        
    """
    return hashed_password


def verify_user(db: Session, questionable_user: user_schemas.UserIn):
    """
    Verify if a given username and password are valid and registered in the database.

    Args:
        db (Session): The database session.
        questionable_user (user_schemas.UserIn): The data for the questionable user.

    Returns:
        dict[str,str]: A dictionary containing information about the verified user.

    Raises:
        HTTPException: If the username is not registered or if the password is incorrect.
    """
    db_user = get_user_by_username(db, questionable_user.username)
    if db_user:
        if verify_password(questionable_user.password, db_user.password):
            return {"id": db_user.id, "name": db_user.username, "role": db_user.role}

        else:
            raise HTTPException(status_code=400, detail="Incorrect password.")
    else:
        raise HTTPException(status_code=400, detail="Username not registered.")


# --------------------
# ---- CONVERTERS ----
# --------------------

# TODO: write tests for these
def convert_to_app_user(db_user: db_models.DbUser):
    """
    Convert a database user object to an app user object.

    Args:
        db_user (db_models.DbUser): The database user object.

    Returns:
        user_schemas.User: The app user object.
    """
    if db_user:
        app_user: user_schemas.User = db_user
        return app_user
    else:
        return None


def convert_to_app_users(db_users: List[db_models.DbUser]):
    """
    Convert a list of database user objects to a list of app user objects.

    Args:
        db_users (List[db_models.DbUser]): The list of database user objects.

    Returns:
        List[user_schemas.User]: The list of app user objects.
    """
    if db_users and len(db_users) > 0:
        app_users = []
        for user in db_users:
            if user:
                app_users.append(convert_to_app_user(user))
        app_users_without_nones = [i for i in app_users if i is not None]
        return app_users_without_nones
    else:
        return []


def get_user_role_by_user_id(db: Session, user_id: int):
    """
    Get the role of a user from the database by their ID.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user.

    Returns:
        str: The role of the user with the given ID.
    """
    
    db_user_role = (
        db.query(db_models.DbUserRoles)
        .filter(db_models.DbUserRoles.user_id == user_id)
        .first()
    )
    if db_user_role:
        return db_user_role.role.value
    return None


async def create_user_roles(user_role: user_schemas.UserRoles, db: Session):

    db_user_role = db_models.DbUserRoles(
        user_id=user_role.user_id,
        role=user_role.role,
        organization_id=user_role.organization_id,
        project_id=user_role.project_id,
    )
    """
    Create a new user role in the database.

    Args:
        user_role (user_schemas.UserRoles): The data for the new user role.
        db (Session): The database session.

    Returns:
        db_models.DbUserRoles: The newly created user role.
    """

    db.add(db_user_role)
    db.commit()
    db.refresh(db_user_role)
    return db_user_role


def get_user_by_id(db: Session, user_id: int):
    """
    Get a user from the database by their ID.

    Args:
        db (Session): The database session.
        user_id (int): The ID of the user to retrieve.

    Returns:
        db_models.DbUser: The user with the given ID.
    """
    db_user = db.query(db_models.DbUser).filter(db_models.DbUser.id == user_id).first()
    return db_user
