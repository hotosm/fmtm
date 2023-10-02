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

from typing import Any, Generator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from sqlalchemy_utils import create_database, database_exists

from app.config import settings
from app.db.database import Base, get_db
from app.db.db_models import DbOrganisation, DbProject, DbUser
from app.main import api, get_application

engine = create_engine(settings.FMTM_DB_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


@pytest.fixture(autouse=True)
def app() -> Generator[FastAPI, Any, None]:
    """Create a fresh database on each test case."""
    yield get_application()


@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(settings.FMTM_DB_URL)
    if not database_exists:
        create_database(engine.url)

    Base.metadata.create_all(bind=engine)
    yield engine


@pytest.fixture(scope="function")
def db(db_engine):
    connection = db_engine.connect()

    # begin a non-ORM transaction
    connection.begin()

    # bind an individual Session to the connection
    db = TestingSessionLocal(bind=connection)

    yield db

    db.rollback()
    connection.close()


@pytest.fixture(scope="function")
def get_ids(db):
    user_id_query = text(f"SELECT id FROM {DbUser.__table__.name} LIMIT 1")
    organization_id_query = text(
        f"SELECT id FROM {DbOrganisation.__table__.name} LIMIT 1"
    )
    project_id_query = text(f"SELECT id FROM {DbProject.__table__.name} LIMIT 1")

    user_id = db.execute(user_id_query).scalar()
    organization_id = db.execute(organization_id_query).scalar()
    project_id = db.execute(project_id_query).scalar()

    return {
        "user_id": user_id,
        "organization_id": organization_id,
        "project_id": project_id,
    }


@pytest.fixture(scope="function")
def client(db):
    api.dependency_overrides[get_db] = lambda: db

    with TestClient(api) as c:
        yield c
