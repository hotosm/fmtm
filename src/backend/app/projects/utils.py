import uuid
from typing import Optional

from fastapi import (
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from ..db import database
from . import project_crud


async def generate_files(
    background_tasks: BackgroundTasks,
    project_id: int,
    extract_polygon: bool = Form(False),
    upload: Optional[UploadFile] = File(None),
    db: Session = Depends(database.get_db),
):
    """Generate required media files and tasks for a project based on the provided parameters.

    This function accepts a project ID, category, custom form flag, and an uploaded file as inputs.
    The generated files are associated with the project ID and stored in the database.
    This utility function generates QR codes, forms, and other media files.
    It also creates an app user for each task and assigns the required roles.
    Additionally, this function can convert an uploaded XLS file provided by the user to an XForm,
    generate OSM data extracts, and upload them to the form.

    Args:
        project_id (int): The ID of the project for which files are being generated. This is a required field.
        extract_polygon (bool): A boolean flag indicating whether a polygon is extracted or not.
        upload (UploadFile, optional): An uploaded file that is used as input for generating the files.
            This is not a required field. A file should be provided if the user wants to upload a custom XLS form.
        db (Session): A SQLAlchemy database session.

    Returns:
        dict: A dictionary containing a success message and the associated task ID.

    """
    contents = None
    xform_title = None

    project = project_crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=428, detail=f"Project with id {project_id} does not exist"
        )

    project.data_extract_type = "polygon" if extract_polygon else "centroid"
    db.commit()

    if upload:
        file_ext = "xls"
        contents = upload

    # generate a unique task ID using uuid
    background_task_id = uuid.uuid4()

    # insert task and task ID into database
    await project_crud.insert_background_task_into_database(
        db, task_id=background_task_id, project_id=project_id
    )

    background_tasks.add_task(
        project_crud.generate_appuser_files,
        db,
        project_id,
        extract_polygon,
        contents,
        None,
        xform_title,
        file_ext if upload else "xls",
        background_task_id,
    )

    return {"Message": f"{project_id}", "task_id": f"{background_task_id}"}
