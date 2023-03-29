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

import pytest
from fastapi.testclient import TestClient
from fastapi import status
from ..main import api
from .conftest import client
from ..users.user_crud import create_user
from ..users import user_schemas


# create a fixture that creates sample users
@pytest.fixture
def users(db):
    create_user(db, user_schemas.UserIn(username="admin", password="admin"))
    create_user(db, user_schemas.UserIn(username="niraj", password="niraj"))
    create_user(db, user_schemas.UserIn(username="test", password="test"))



def test_list_users(users, client):
    """ test listing all users """
    response = client.get("/users")
    assert len(response.json()) == 3



def test_create_users(client):
    """ test creating a user """
    # test creating a user with valid data
    response = client.post('/users/',json={
                                        "username": "test3",
                                        "password": "test1"
                                        })
    assert response.status_code == status.HTTP_200_OK

    # test creating a user with existing username
    response = client.post('/users/',json={
                                        "username": "niraj",
                                        "password": "niraj"
                                        })
    assert response.status_code == status.HTTP_200_OK

    # test creating a user with missing required fields
    response = client.post('/users/',json={
                                        "username": "niraj"
                                        })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # test creating a user with invalid data
    response = client.post('/users/',json={
                                        "username": "niraj",
                                        "password": "niraj"
                                        })
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Username already registered" }
