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
import json
import os
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse, JSONResponse
from osm_fieldwork.odk_merge import OdkMerge
from osm_fieldwork.osmfile import OsmFile
from sqlalchemy.orm import Session

from app.config import settings
from app.db import database
from app.projects import project_crud, project_schemas

from app.submission import submission_crud

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
    """This api returns the submission made in the project.
    It takes two parameters: project_id and task_id.


    project_id: The ID of the project. This endpoint returns the submission made in this project.

    task_id: The ID of the task. This parameter is optional. If task_id is provided, this endpoint returns the submissions made for this task.

    Returns the list of submissions.
    """
    return submission_crud.get_submission_of_project(db, project_id, task_id)


@router.get("/list-forms")
async def list_forms(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    """This api returns the list of forms in the odk central.

    It takes one parameter: project_id.

    project_id: The ID of the project. This endpoint returns the list of forms in this project.

    Returns the list of forms details provided by the central api.
    """
    return await submission_crud.get_forms_of_project(db, project_id)


@router.get("/list-app-users")
async def list_app_users(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    """This api returns the list of forms in the odk central.

    It takes one parameter: project_id.

    project_id: The ID of the project. This endpoint returns the list of forms in this project.

    Returns the list of forms details provided by the central api.
    """
    return await submission_crud.list_app_users_or_project(db, project_id)


@router.get("/download")
async def download_submission(
    project_id: int,
    task_id: int = None,
    export_json: bool = True,
    db: Session = Depends(database.get_db),
):
    """This api downloads the the submission made in the project.
    It takes two parameters: project_id and task_id.

    project_id: The ID of the project. This endpoint returns the submission made in this project.

    task_id: The ID of the task. This parameter is optional. If task_id is provided, this endpoint returns the submissions made for this task.

    """
    if not (task_id or export_json):
        file = submission_crud.gather_all_submission_csvs(db, project_id)
        return FileResponse(file)

    return await submission_crud.download_submission(
        db, project_id, task_id, export_json
    )


@router.get("/submission-points")
async def submission_points(
    project_id: int,
    task_id: int = None,
    db: Session = Depends(database.get_db),
):
    """This api returns the submission points of a project.
    It takes two parameter: project_id and task_id.

    project_id: The ID of the project. This endpoint returns the submission points of this project.
    task_id: The task_id of the project. This endpoint returns the submission points of this task.
    """
    return await submission_crud.get_submission_points(db, project_id, task_id)


@router.get("/convert-to-osm")
async def convert_to_osm(
    project_id: int,
    task_id: int = None,
    db: Session = Depends(database.get_db),
):
    """This api converts the submission to osm format.
    It takes two parameter: project_id and task_id.

    task_id is optional.
    If task_id is provided, this endpoint converts the submission of this task.
    If task_id is not provided, this endpoint converts the submission of the whole project.

    """
    # NOTE runs in separate thread using run_in_threadpool
    converted = await run_in_threadpool(
        lambda: submission_crud.convert_to_osm(db, project_id, task_id)
    )
    return converted


@router.get("/get-submission-count/{project_id}")
async def get_submission_count(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    return await submission_crud.get_submission_count_of_a_project(db, project_id)


@router.post("/conflate_data")
async def conflate_osm_data(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    # All Submissions JSON
    # NOTE runs in separate thread using run_in_threadpool
    submission = await run_in_threadpool(
        lambda: submission_crud.get_all_submissions_json(db, project_id)
    )

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
    with open(jsoninfile, "w") as f:
        f.write(json.dumps(submission))

    # Convert the submission to osm xml format
    osmoutfile, jsonoutfile = await submission_crud.convert_json_to_osm(jsoninfile)

    # Remove the extra closing </osm> tag from the end of the file
    with open(osmoutfile, "r") as f:
        osmoutfile_data = f.read()
        # Find the last index of the closing </osm> tag
        last_osm_index = osmoutfile_data.rfind("</osm>")
        # Remove the extra closing </osm> tag from the end
        processed_xml_string = (
            osmoutfile_data[:last_osm_index]
            + osmoutfile_data[last_osm_index + len("</osm>") :]
        )

    # Write the modified XML data back to the file
    with open(osmoutfile, "w") as f:
        f.write(processed_xml_string)

    odkf = OsmFile(outfile)
    osm = odkf.loadFile(osmoutfile)
    if osm:
        odk_merge = OdkMerge(data_extracts_file, None)
        data = odk_merge.conflateData(osm)
        return data
    return []


@router.post("/download-submission")
async def download_submission_json(
    background_tasks: BackgroundTasks,
    project_id: int,
    background_task_id: Optional[str] = None,
    db: Session = Depends(database.get_db),
):
    # Get Project
    project = await project_crud.get_project(db, project_id)

    # Return existing export if complete
    if background_task_id:
        # Get the backgrund task status
        task_status, task_message = await project_crud.get_background_task_status(
            background_task_id, db
        )

        if task_status != 4:
            return project_schemas.BackgroundTaskStatus(
                status=task_status.name, message=task_message or ""
            )

        bucket_root = f"{settings.S3_DOWNLOAD_ROOT}/{settings.S3_BUCKET_NAME}"
        return JSONResponse(
            status_code=200,
            content=f"{bucket_root}/{project.organisation_id}/{project_id}/submission.zip",
        )

    # Create task in db and return uuid
    background_task_id = await project_crud.insert_background_task_into_database(
        db, "sync_submission", project_id
    )

    background_tasks.add_task(
        submission_crud.update_submission_in_s3, db, project_id, background_task_id
    )
    return JSONResponse(
        status_code=200,
        content={
            "Message": "Submission update process initiated",
            "task_id": str(background_task_id),
        },
    )


@router.get("/get_osm_xml/{project_id}")
async def get_osm_xml(
    project_id: int,
    db: Session = Depends(database.get_db),
):
    # JSON FILE PATH
    jsoninfile = f"/tmp/{project_id}_json_infile.json"

    # # Delete if these files already exist
    if os.path.exists(jsoninfile):
        os.remove(jsoninfile)

    # All Submissions JSON
    # NOTE runs in separate thread using run_in_threadpool
    submission = await run_in_threadpool(
        lambda: submission_crud.get_all_submissions_json(db, project_id)
    )

    # Write the submission to a file
    with open(jsoninfile, "w") as f:
        f.write(json.dumps(submission))

    # Convert the submission to osm xml format
    osmoutfile = await submission_crud.convert_json_to_osm_xml(jsoninfile)

    # Remove the extra closing </osm> tag from the end of the file
    with open(osmoutfile, "r") as f:
        osmoutfile_data = f.read()
        # Find the last index of the closing </osm> tag
        last_osm_index = osmoutfile_data.rfind("</osm>")
        # Remove the extra closing </osm> tag from the end
        processed_xml_string = (
            osmoutfile_data[:last_osm_index]
            + osmoutfile_data[last_osm_index + len("</osm>") :]
        )

    # Write the modified XML data back to the file
    with open(osmoutfile, "w") as f:
        f.write(processed_xml_string)

    # Create a plain XML response
    response = Response(content=processed_xml_string, media_type="application/xml")
    return response


@router.get("/submission_page/{project_id}")
async def get_submission_page(project_id: int, days: int, db: Session = Depends(database.get_db)):
    """
    This api returns the submission page of a project.
    It takes one parameter: project_id.
    project_id: The ID of the project. This endpoint returns the submission page of this project.
    """
    
    return await submission_crud.get_submissions_by_date(db, project_id, days)