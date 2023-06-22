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
from fastapi import status
from ..projects.project_schemas import BETAProjectUpload
from ..projects.project_crud import create_project_with_project_info


@pytest.fixture
def projects(db):
    create_project_with_project_info(db, BETAProjectUpload(author={
        "username": "Freenine"
    }, project_info={
        "name": "project1",
        "short_description": "short_description1",
        "description": "description1",

    }, xform_title="form1", odk_central={
        "odk_central_url": "centralurl",
        "odk_central_user": "centraluser",
        "odk_central_password": "password"
    }))

    create_project_with_project_info(db, BETAProjectUpload(author={
        "username": "Freenine2"
    }, project_info={
        "name": "project2",
        "short_description": "short_description2",
        "description": "description2",

    }, xform_title="form1", odk_central={
        "odk_central_url": "centralurl2",
        "odk_central_user": "centraluser2",
        "odk_central_password": "password2"
    }))

    create_project_with_project_info(db, BETAProjectUpload(author={
        "username": "Freenine3"
    }, project_info={
        "name": "project3",
        "short_description": "short_description3",
        "description": "description3",

    }, xform_title="form1", odk_central={
        "odk_central_url": "centralurl3",
        "odk_central_user": "centraluser3",
        "odk_central_password": "password3"
    }))


def test_list_projects(client):
    response = client.get("/projects")
    assert len(response.json()) == 3


def test_list_projects_summuries(client):
    response = client.get("/projects/summuries")
    assert response.status_code == status.HTTP_200_OK


def test_list_single_project(client):
    response = client.get("/projects/{id}")
    assert len(response.json()) == 1


def test_list_organisations(client):
    response = client.get("/projects/organizations")
    assert len(response.json()) == 3


def test_list_projects_features(client):
    response = client.get("/projects/{project_id}/features")
    assert response.status_code == status.HTTP_200_OK


def test_project_logs(client):
    response = client.get("/projects/generate_log")
    assert response.status_code == status.HTTP_200_OK


def test_categories(client):
    response = client.get("/categories")
    assert response.status_code == status.HTTP_200_OK


def test_get_task(client):
    response = client.post('/projects/near_me', json={
        "id": -1,
        "priority": 2,
        "priority_str": "MEDIUM",
        "title": "string",
        "location_str": "string",
        "description": "string",
        "num_contributors": 0,
        "total_tasks": 0,
        "tasks_validated": 0,
        "tasks_validated": 0,
        "tasks_bad": 0
    })
    assert response.status_code == status.HTTP_200_OK


def test_create_project(client):
    response = client.post('/projects/create_project', json={
        {
            "author": {
                "username": "Freenine2"
            },
            "project_info": {
                "name": "project2",
                "short_description": "short_description2",
                "description": "description2",
            },
            "xform_title": "form1",
            "odk_central": {
                "odk_central_url": "centralurl2",
                "odk_central_user": "centraluser2",
                "odk_central_password": "password2"
            }
        }
    })
    assert response.status_code == status.HTTP_200_OK


def test_delete_project(client):
    response = client.post('/projects/delete/{project_id}', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_upload_project(client):
    response = client.post('/projects/beta/{project_id}/upload', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_upload_xlsform(client):
    response = client.post('/projects/upload_xlsform', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_upload_multi_polygon(client):
    response = client.post('/projects/{poroject_id}/upload_multi_polygon', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_upload_boundary(client):
    response = client.post('prjects/{porject_id}/upload', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_download_project(client):
    response = client.post('/projects/{project_id}/download', json={
        "project_id"
    })
    assert response.status == status.HTTP_200_OK


def test_download_task(client):
    response = client.post('/projects/{project_id}/download_tasks', json={
        "project_id"
    })
    assert response.status == status.HTTP_200_OK


def test_generate_files(client):
    response = client.post('/projects/{projects_id}/generate', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_create_organization(client):
    response = client.post('/projects/organization/', json={
        {
            "slug": "string",
            "logo": "string",
            "name": "string",
            "description": "string",
            "url": "string",
            "type": 0
        }
    })
    assert response.status_code == status.HTTP_200_OK


def test_preview_task(client):
    response = client.post('/projects/preview_tasks', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK


def test_add_features(client):
    response = client.post('/projects/add_features/', json={
        "project_id"
    })
    assert response.status_code == status.HTTP_200_OK

# @freedischTODO adding tests for the remaining endpoints
