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
import os
import json
from fastapi import APIRouter, Depends, HTTPException, Response
from ..projects import project_crud, project_schemas
from fastapi.logger import logger as logger
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from osm_fieldwork.odk_merge import OdkMerge
from osm_fieldwork.osmfile import OsmFile
from ..projects import project_crud
from ..db import database
from . import submission_crud

router = APIRouter(
    prefix="/submission",
    tags=["submission"],
    dependencies=[Depends(database.get_db)],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def read_submissions(
    project_id: int,
    task_id: int = None,
    db: Session = Depends(database.get_db),
):
    """
    Returns the submission made in the project.

    Args:
        project_id (int): The ID of the project. This endpoint returns the submission made in this project.
        task_id (int, optional): The ID of the task. If provided, this endpoint returns the submissions made for this task. Defaults to None.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: The list of submissions.
    """
    return submission_crud.get_submission_of_project(db, project_id, task_id)


@router.get("/list-forms")
async def list_forms(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    """
    Returns the list of forms in the odk central.

    Args:
        project_id (int): The ID of the project. This endpoint returns the list of forms in this project.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: The list of forms details provided by the central api.
    """
    return submission_crud.get_forms_of_project(db, project_id)


@router.get("/list-app-users")
async def list_app_users(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    """
    Returns the list of app users in a project.

    Args:
        project_id (int): The ID of the project. This endpoint returns the list of app users in this project.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: The list of app users details provided by the central api.
    """
    return submission_crud.list_app_users_or_project(db, project_id)


@router.get("/download")
async def download_submission(
    project_id: int,
    task_id: int = None,
    export_json: bool = True,
    db: Session = Depends(database.get_db),
):
    """
    Downloads the submission made in a project.

    Args:
        project_id (int): The ID of the project. This endpoint returns the submission made in this project.
        task_id (int, optional): The ID of the task. If provided, this endpoint returns the submissions made for this task. Defaults to None.
        export_json (bool, optional): If True, exports submission data as a JSON file. If False, exports submission data as a ZIP file. Defaults to True.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: A FileResponse object containing the downloaded submission data as a ZIP or JSON file.
    """
    if not (task_id or export_json):
        file = submission_crud.download_submission_for_project(db, project_id)
        return FileResponse(file)

    return submission_crud.download_submission(db, project_id, task_id, export_json)


@router.get("/submission-points")
async def submission_points(
    project_id: int,
    task_id: int = None,
    db: Session = Depends(database.get_db),
):
    """
    Returns the submission points of a project.

    Args:
        project_id (int): The ID of the project. This endpoint returns the submission points of this project.
        task_id (int, optional): The ID of the task. If provided, this endpoint returns the submission points made for this task. Defaults to None.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: The list of submission points.
    """
    return submission_crud.get_submission_points(db, project_id, task_id)


@router.get("/convert-to-osm")
async def convert_to_osm(
    project_id: int,
    task_id: int = None,
    db: Session = Depends(database.get_db),
):

    """
    Converts submission data to OSM format.

    Args:
        project_id (int): The ID of the project. This endpoint converts submission data for this project.
        task_id (int, optional): The ID of the task. If provided, this endpoint converts submission data for this task only. Defaults to None.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: A FileResponse object containing a ZIP file with converted OSM data.
    """
    return await submission_crud.convert_to_osm(db, project_id, task_id)


@router.get("/get-submission-count/{project_id}")
async def get_submission_count(
    project_id: int,
    db: Session = Depends(database.get_db),
    ):
    """
    Returns the submission count for a project.

    Args:
        project_id (int): The ID of the project. This endpoint returns the submission count for this project.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        int: The submission count for the specified project.
    """
    return await submission_crud.get_submission_count_of_a_project(db, project_id)


@router.post("/conflate_data")
async def conflate_osm_date(
    project_id: int,
    db: Session = Depends(database.get_db),
    ):
    """
    Conflates OSM data for a project.

    Args:
        project_id (int): The ID of the project. This endpoint conflates OSM data for this project.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Any: The conflated OSM data for the specified project.
    """

    # Submission JSON
    submission = submission_crud.get_all_submissions(db, project_id)

    # Data extracta file
    data_extracts_file = "/tmp/data_extracts_file.geojson"

    await project_crud.get_extracted_data_from_db(db, project_id, data_extracts_file)

    # Output file
    outfile = "/tmp/output_file.osm"
    # JSON FILE PATH
    jsoninfile = "/tmp/json_infile.json"

    # # Delete if these files already exist
    if os.path.exists(outfile):
        os.remove(outfile)
    if os.path.exists(jsoninfile):
        os.remove(jsoninfile)

    # Write the submission to a file
    with open(jsoninfile, 'w') as f:
        f.write(json.dumps(submission))

    # Convert the submission to osm xml format
    osmoutfile, jsonoutfile = await submission_crud.convert_json_to_osm(jsoninfile)

    # Remove the extra closing </osm> tag from the end of the file
    with open(osmoutfile, 'r') as f:
        osmoutfile_data = f.read()
        # Find the last index of the closing </osm> tag
        last_osm_index = osmoutfile_data.rfind('</osm>')
        # Remove the extra closing </osm> tag from the end
        processed_xml_string = osmoutfile_data[:last_osm_index] + osmoutfile_data[last_osm_index + len('</osm>'):]
    
    # Write the modified XML data back to the file
    with open(osmoutfile, 'w') as f:
        f.write(processed_xml_string)

    odkf = OsmFile(outfile)
    osm = odkf.loadFile(osmoutfile)
    if osm:
        odk_merge = OdkMerge(data_extracts_file,None)
        data = odk_merge.conflateData(osm)
        return data
    return []


@router.get("/get_osm_xml/{project_id}")
async def get_osm_xml(
    project_id: int,
    db: Session = Depends(database.get_db),
    ):
    """
    Returns an OSM XML file for a project.

    Args:
        project_id (int): The ID of the project. This endpoint returns an OSM XML file for this project.
        db (Session, optional): A database session. Defaults to Depends(database.get_db).

    Returns:
        Response: A Response object containing an OSM XML file for the specified project.
    """

    # JSON FILE PATH
    jsoninfile = "/tmp/json_infile.json"

    # # Delete if these files already exist
    if os.path.exists(jsoninfile):
        os.remove(jsoninfile)

    # Submission JSON
    submission = submission_crud.get_all_submissions(db, project_id)

    # Write the submission to a file
    with open(jsoninfile, 'w') as f:
        f.write(json.dumps(submission))

    # Convert the submission to osm xml format
    osmoutfile = await submission_crud.convert_json_to_osm_xml(jsoninfile)

    # Remove the extra closing </osm> tag from the end of the file
    with open(osmoutfile, 'r') as f:
        osmoutfile_data = f.read()
        # Find the last index of the closing </osm> tag
        last_osm_index = osmoutfile_data.rfind('</osm>')
        # Remove the extra closing </osm> tag from the end
        processed_xml_string = osmoutfile_data[:last_osm_index] + osmoutfile_data[last_osm_index + len('</osm>'):]

    # Write the modified XML data back to the file
    with open(osmoutfile, 'w') as f:
        f.write(processed_xml_string)

    # Create a plain XML response
    response = Response(content=processed_xml_string, media_type="application/xml")
    return response
