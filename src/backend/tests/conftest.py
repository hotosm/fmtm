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
"""Configuration and fixtures for PyTest."""

import logging
import os
from contextlib import ExitStack
from typing import Any, Generator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from loguru import logger as log

from app.central import central_crud
from app.db.database import get_db, sessionmanager
from app.db.db_models import DbOrganisation, DbUser
from app.main import get_application
from app.projects import project_crud
from app.projects.project_schemas import ODKCentral, ProjectInfo, ProjectUpload
from app.users.user_schemas import User


def pytest_configure(config):
    """Configure pytest runs."""
    # Stop sqlalchemy logs
    sqlalchemy_log = logging.getLogger("sqlalchemy")
    sqlalchemy_log.propagate = False


@pytest.fixture(autouse=True)
def app() -> Generator[FastAPI, Any, None]:
    """Get the FastAPI test server."""
    with ExitStack():
        # Use ExitStack to correctly close and cleanup resources
        yield get_application()


@pytest.fixture(scope="function")
def client(app, db):
    """The FastAPI test server."""
    app.dependency_overrides[get_db] = lambda: db

    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function", autouse=True)
async def transactional_session():
    """Each test function is a clean slate."""
    async with sessionmanager.session() as session:
        try:
            await session.begin()
            yield session
        finally:
            # Roll back the outer transaction
            await session.rollback()


@pytest.fixture(scope="function")
async def db(transactional_session):
    """SQLAlchemy session init."""
    yield transactional_session


@pytest.fixture(scope="function", autouse=True)
async def session_override(app, db_session):
    """Replace get_db with session override."""

    async def get_db_session_override():
        """Yield the session override."""
        yield db[0]

    app.dependency_overrides[get_db] = get_db_session_override


@pytest.fixture(scope="function")
def user(db):
    """A test user."""
    db_user = DbUser(id=100, username="test_user")
    db.add(db_user)
    db.commit()
    return db_user


@pytest.fixture(scope="function")
def organisation(db):
    """A test organisation."""
    db_org = DbOrganisation(
        name="test_org_qwerty",
        slug="test_qwerty",
        description="test org",
        url="https://test.org",
        logo="none",
    )
    db.add(db_org)
    db.commit()
    return db_org


@pytest.fixture(scope="function")
async def project(db, user, organisation):
    """A test project, using the test user and org."""
    project_metadata = ProjectUpload(
        author=User(username=user.username, id=user.id),
        project_info=ProjectInfo(
            name="test project",
            short_description="test",
            description="test",
        ),
        xform_title="buildings",
        odk_central=ODKCentral(
            odk_central_url=os.getenv("ODK_CENTRAL_URL"),
            odk_central_user=os.getenv("ODK_CENTRAL_USER"),
            odk_central_password=os.getenv("ODK_CENTRAL_PASSWD"),
        ),
        hashtags=["hot-fmtm"],
        organisation_id=organisation.id,
    )

    # Create ODK Central Project
    if project_metadata.odk_central.odk_central_url.endswith("/"):
        # Remove trailing slash
        project_metadata.odk_central.odk_central_url = (
            project_metadata.odk_central.odk_central_url[:-1]
        )

    try:
        odkproject = central_crud.create_odk_project(
            project_metadata.project_info.name, project_metadata.odk_central
        )
        log.debug(f"ODK project returned: {odkproject}")
        assert odkproject is not None
    except Exception as e:
        log.exception(e)
        pytest.fail(f"Test failed with exception: {str(e)}")

    # Create FMTM Project
    try:
        new_project = await project_crud.create_project_with_project_info(
            db, project_metadata, odkproject["id"]
        )
        log.debug(f"Project returned: {new_project.__dict__}")
        assert new_project is not None
    except Exception as e:
        log.exception(e)
        pytest.fail(f"Test failed with exception: {str(e)}")

    return new_project


# @pytest.fixture(scope="function")
# def get_ids(db, project):
#     user_id_query = text(f"SELECT id FROM {DbUser.__table__.name} LIMIT 1")
#     organisation_id_query = text(
#         f"SELECT id FROM {DbOrganisation.__table__.name} LIMIT 1"
#     )
#     project_id_query = text(f"SELECT id FROM {DbProject.__table__.name} LIMIT 1")

#     user_id = db.execute(user_id_query).scalar()
#     organisation_id = db.execute(organisation_id_query).scalar()
#     project_id = db.execute(project_id_query).scalar()

#     data = {
#         "user_id": user_id,
#         "organisation_id": organisation_id,
#         "project_id": project_id,
#     }
#     log.debug(f"get_ids return: {data}")
#     return data
