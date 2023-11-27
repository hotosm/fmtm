import json
from io import BytesIO
from typing import Optional

import requests
import sozipfile.sozipfile as zipfile
from fastapi import File, HTTPException
from loguru import logger as log
from sqlalchemy.orm import Session

from app.central.central_crud import (
    create_odk_project,
    get_form_full_details,
    get_odk_project_full_details,
    list_odk_xforms,
)
from app.central.central_schemas import (
    CentralProjectDetails,
)
from app.config import settings
from app.projects.project_crud import (
    create_project_with_project_info,
    generate_appuser_files,
    get_project_by_id,
    preview_tasks,
    split_into_tasks,
    update_background_task_status_in_database,
    update_multi_polygon_project_boundary,
)
from app.projects.project_schemas import (
    ODKCentral,
    ProjectExport,
    ProjectOut,
    ProjectUpload,
)
from app.s3 import add_obj_to_bucket
from app.submission.submission_crud import get_all_submissions
from app.users.user_crud import get_user_by_username
from app.users.user_schemas import User


def _export_fmtm_project(
    db: Session,
    project_id: int,
    file_buffer: BytesIO,
) -> ProjectOut:
    # Get FMTM Project
    project_with_tasks = get_project_by_id(db, project_id)
    if not project_with_tasks:
        raise HTTPException(
            status_code=428, detail=f"Project with id {project_id} does not exist."
        )

    # Set ODK Central schema
    project_with_tasks.odk_central = ODKCentral(
        odk_central_url=project_with_tasks.odk_central_url,
        odk_central_user=project_with_tasks.odk_central_user,
        odk_central_password=project_with_tasks.odk_central_password,
    )

    # Validate db return with Pydantic model
    project_json = ProjectExport.model_validate(project_with_tasks)
    log.debug(f"Export FMTM project details: {project_json}")

    # Dump to json
    project_json_dump: str = project_json.model_dump_json()

    # Write to BytesIO zip
    with zipfile.ZipFile(file_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("fmtm_project.json", project_json_dump)

    return project_with_tasks


def _export_odk_project(
    db: Session,
    fmtm_project: ProjectOut,
    file_buffer: BytesIO,
) -> None:
    """Export ODK Project associated with FMTM.

    NOTE this function does not work yet.
    """
    # Get ODK Project
    odk_project = get_odk_project_full_details(
        odk_project_id=fmtm_project.odkid, odk_central=fmtm_project.odk_central
    )

    # Get ODK Forms
    form_list = list_odk_xforms(project_id, fmtm_project.odk_central)
    log.debug(f"Returned forms for project ID {project_id}: {form_list}")
    form_ids = [form.get("xmlFormId") for form in form_list]
    forms = []
    for form_id in form_ids:
        form_details = get_form_full_details(
            project_id, form_id, fmtm_project.odk_central
        )
        form_details["userId"] = form_details.get("createdBy", "").get("id")
        forms.append(form_details)
    odk_project["forms"] = forms

    # Validate ODKProject Pydantic model
    odk_json = CentralProjectDetails.model_validate(odk_project)
    log.debug(f"Export ODK project details: {odk_json}")

    # Dump odk project to json
    odk_json_dump: str = odk_json.model_dump_json()

    # Write odk project to BytesIO zip
    with zipfile.ZipFile(file_buffer, "a", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("odk_project.json", odk_json_dump)

    # Get ODK Submissions
    submissions = get_all_submissions(db, project_id)
    log.debug(f"Returned submissions for project ID {project_id}: {submissions}")

    # # TODO check format of submission jsons
    # # TODO and update central_schemas.CentralSubmission
    # # TODO then add to the zipped response as submissions.json
    # if submissions:
    # # Validate ODKProject Pydantic model
    # # FIXME must be validated as list, possibly append to CentralProjectDetails
    # submission_json = CentralSubmission.model_validate(submissions)
    # log.debug(f"Export ODK project submissions: {submission_json}")
    # # Dump to json
    # submission_json_dump: str = submission_json.model_dump_json()
    # # Write to BytesIO zip
    # with zipfile.ZipFile(file_buffer, 'a', zipfile.ZIP_DEFLATED) as zip_file:
    #     zip_file.writestr("submissions.json", submission_json_dump)


def export_project_by_id(db: Session, project_id: int, background_task_id: str):
    """Export an FMTM project as a zip file.

    For exporting when the ODK Central instance remains the same.

    TODO note this does not support custom xlsforms yet.
    """
    log.info(f"Exporting project: {project_id}")

    try:
        # Create in-memory zip
        buffer = BytesIO()

        # Export fmtm project
        _export_fmtm_project(db, project_id, buffer)

        # Upload to S3
        log.debug("Uploading zip to S3 bucket")
        add_obj_to_bucket(settings.S3_BUCKET_NAME, buffer, f"{project_id}/export.zip")

        update_background_task_status_in_database(
            db, background_task_id, 4
        )  # 4 is COMPLETED

    except Exception as e:
        log.warning(str(e))

        # Update background task status to FAILED
        update_background_task_status_in_database(
            db, background_task_id, 2, str(e)
        )  # 2 is FAILED


def export_project_by_id_with_odk(
    db: Session, project_id: int, background_task_id: str
):
    """Export an FMTM project, with ODK project, as a zip file.

    For exporting when you wish to migrate ODK Central instance.

    TODO note this does not support custom xlsforms yet.
    """
    log.info(f"Exporting project (with odk): {project_id}")

    try:
        # Create in-memory zip
        buffer = BytesIO()

        # Export fmtm project
        fmtm_project = _export_fmtm_project(db, project_id, buffer)
        # Export odk project
        _export_odk_project(db, fmtm_project, buffer)

        # Upload to S3
        log.debug("Uploading zip to S3 bucket")
        # TODO optimise this to use stream-zip and upload to S3
        # TODO as generated on-the-fly. Avoiding load into memory
        # TODO https://stream-zip.docs.trade.gov.uk/output-examples/#upload-to-s3
        add_obj_to_bucket(settings.S3_BUCKET_NAME, buffer, f"{project_id}/export.zip")

        update_background_task_status_in_database(
            db, background_task_id, 4
        )  # 4 is COMPLETED

    except Exception as e:
        log.warning(str(e))

        # Update background task status to FAILED
        update_background_task_status_in_database(
            db, background_task_id, 2, str(e)
        )  # 2 is FAILED


async def load_zip_in_memory(
    url: Optional[str] = None, file: Optional[File] = None
) -> zipfile.ZipFile:
    """Load a zip directly from URL, or uploaded file."""
    if url:
        log.debug(f"Getting zipfile from url: {url}")
        # FIXME use of the SOZip index is not currently implemented in the
        # FIXME read side, for now. Check for updates and replace
        # FIXME requests.get with direct load of zipfile from S3
        response = requests.get(url, stream=True)
        response.raise_for_status()
        zip_buffer = BytesIO(response.content)
    elif file:
        log.debug("Getting zipfile from file upload")
        zip_buffer = await BytesIO(file.read())
    else:
        raise HTTPException(status_code=400, detail="Invalid zip file source.")

    return zipfile.ZipFile(zip_buffer)


def import_fmtm_project(
    db: Session,
    org_id: int,
    user_obj: User,
    zip_obj: zipfile.ZipFile,
):
    log.info(f"Importing project from zip into organisation id: {org_id}")

    # Parse FMTM JSON
    log.debug("Parsing fmtm project json from zipfile.")
    import_json = json.loads(zip_obj.read("fmtm_project.json").decode("utf-8"))

    # Validate current user & assign to author key
    if not get_user_by_username(db, user_obj.get("username")):
        raise HTTPException(
            status_code=401, detail="User does not exist. Please log in again"
        )
    import_json["author"] = user_obj
    log.debug(f"Parsed json for import: {import_json}")

    # Validate and parse as ProjectExport
    import_project = ProjectExport.model_validate(import_json)
    log.debug(f"Project model: {import_project}")

    # Create new project
    new_project = create_project_with_project_info(
        db, ProjectUpload.model_validate(import_json), import_project.odkid
    )

    # Split tasks & generate task area geojson
    if "task_split_type" in import_project:
        # if import_project.task_split_type == "":
        task_geojson = split_into_tasks(
            db,
            dict(import_project.outline_geojson),
            no_of_buildings=50,
            has_data_extracts=False,
        )
    # elif import_project.task_split_type == "":
    else:
        task_geojson = preview_tasks(
            dict(import_project.outline_geojson),
            dimension=100,
        )

    # Update project with task areas
    update_multi_polygon_project_boundary(db, new_project.id, task_geojson)

    # Finalise project (generate QR codes etc)
    generate_appuser_files(
        db,
        new_project.id,
        extract_polygon=False,
        custom_xls_form=None,
        extracts_contents=None,
        xform_title=None,
        form_type="xls",
    )


def import_fmtm_project_with_odk(
    db: Session,
    org_id: int,
    user_obj: User,
    zip_obj: zipfile.ZipFile,
):
    # Parse FMTM JSON
    fmtm_project = ProjectUpload()

    # Set ODK Central schema
    odk_credentials = ODKCentral(
        odk_central_url=fmtm_project.odk_central_url,
        odk_central_user=fmtm_project.odk_central_user,
        odk_central_password=fmtm_project.odk_central_password,
    )

    odkproject = create_odk_project(fmtm_project.project_info.name, odk_credentials)

    # Parse ODK JSON
    # TODO Create forms, submissions etc
