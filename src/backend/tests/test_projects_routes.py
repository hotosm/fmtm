import json
import os
import uuid
import zipfile
from unittest.mock import Mock, patch

import pytest
from dotenv import load_dotenv
from fastapi import FastAPI
from geoalchemy2.elements import WKBElement
from shapely import Polygon

from app.central.central_crud import create_odk_project
from app.db import db_models
from app.projects import project_crud, project_schemas
from app.projects.project_schemas import BETAProjectUpload, ODKCentral, ProjectInfo
from app.tasks import tasks_crud
from app.users.user_schemas import User

load_dotenv()

odk_central_url = os.getenv("ODK_CENTRAL_URL")
odk_central_user = os.getenv("ODK_CENTRAL_USER")
odk_central_password = os.getenv("ODK_CENTRAL_PASSWD")

app = FastAPI()


class MockSession:
    def add(self, item):
        pass

    def commit(self):
        pass

    def refresh(self, item):
        pass


def test_create_project(client, db):
    project_data = {
        "author": {"username": "test_user", "id": 1},
        "project_info": {
            "name": "test project",
            "short_description": "test",
            "description": "test",
        },
        "xform_title": "buildings",
        "odk_central": {
            "odk_central_url": odk_central_url,
            "odk_central_user": odk_central_user,
            "odk_central_password": odk_central_password,
        },
        "hashtags": ["hot-fmtm"],
        "organisation_id": 1,
    }

    response = client.post("/projects/create_project", json=project_data)

    assert response.status_code == 200

    response_data = response.json()
    assert "id" in response_data


def test_create_odk_project():
    mock_project = Mock()
    mock_project.createProject.return_value = {"status": "success"}

    with patch("app.central.central_crud.get_odk_project", return_value=mock_project):
        result = create_odk_project("Test Project")

    assert result == {"status": "success"}
    mock_project.createProject.assert_called_once_with("Test Project")


def test_convert_to_app_project():
    polygon = Polygon(
        [
            (85.924707758, 26.727727503),
            (85.922703741, 26.732440043),
            (85.928284549, 26.735158727),
            (85.930643709, 26.734365785),
            (85.932368686, 26.732372075),
            (85.924707758, 26.727727503),
        ]
    )

    # Get the WKB representation of the Polygon
    wkb_outline = WKBElement(polygon.wkb, srid=4326)
    mock_db_project = db_models.DbProject(
        id=1,
        outline=wkb_outline,
    )

    result = project_crud.convert_to_app_project(mock_db_project)

    assert result is not None
    assert isinstance(result, db_models.DbProject)

    assert result.outline_geojson is not None

    assert result.project_tasks is not None
    assert isinstance(result.project_tasks, list)


def test_create_project_with_project_info(db):
    project_metadata = BETAProjectUpload(
        author=User(username="test_user", id=1),
        project_info=ProjectInfo(
            name="test project",
            short_description="test",
            description="test",
        ),
        xform_title="buildings",
        odk_central=ODKCentral(
            odk_central_url=odk_central_url,
            odk_central_user=odk_central_user,
            odk_central_password=odk_central_password,
        ),
        hashtags=["hot-fmtm"],
        organisation_id=1,
    )
    try:
        result = project_crud.create_project_with_project_info(
            db, project_metadata, project_id=123
        )
        assert result is not None
    except Exception as e:
        pytest.fail(f"Test failed with exception: {str(e)}")


def test_generate_app_user(db, get_ids):
    custom_form = "/opt/app/test_data/buildings.xls"
    with open(custom_form, "rb") as file:
        contents = file.read()
    
    data_extracts = "/opt/app/test_data/building_footprint.zip"
    with zipfile.ZipFile(data_extracts, 'r') as zip_archive:
        extract_contents = zip_archive.read("building_foot_jnk.geojson")
    json.loads(extract_contents)
    
    odk_credentials = {
        "odk_central_url": odk_central_url,
        "odk_central_user": odk_central_user,
        "odk_central_password": odk_central_password,
    }
    odk_credentials = project_schemas.ODKCentral(**odk_credentials)
    project_id = get_ids["project_id"]
    test_data = {
        "db": db,
        "project_id": project_id,
        "extract_polygon": True,
        "upload": contents,
        "extracts_contents": extract_contents,
        "category": "buildings",
        "form_type": "example_form_type",
        "background_task_id": uuid.uuid4(),
    }
    result1 = project_crud.upload_custom_data_extracts(db, project_id, extract_contents)
    assert result1 is True

    result2 = tasks_crud.get_task_lists(db, project_id)
    assert isinstance(result2, list)

    for task in result2:
        result3 = project_crud.generate_task_files(
            db, project_id, task, custom_form, "xls", odk_credentials
        )
    assert result3 is True

    result = project_crud.generate_appuser_files(**test_data)
    assert result is None


if __name__ == "__main__":
    pytest.main()
