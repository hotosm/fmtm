"""Add dataset property for submission ID."""

import asyncio

from psycopg import AsyncConnection

from app.central import central_deps, central_schemas
from app.config import settings
from app.db.models import DbProject


async def add_submission_id_to_project(
    odk_creds: central_schemas.ODKCentralDecrypted,
    odk_id: int,
) -> list:
    """Add dataset property 'submission_ids' for each project."""
    try:
        async with central_deps.get_odk_dataset(odk_creds) as odk_central:
            await odk_central.createDatasetProperty(
                odk_id,
                "submission_ids",
            )
    except Exception:
        msg = f"Failed for ODK project ({odk_id}): e"  # usually "already exists"
        print(msg)


async def add_submission_id():
    """Adds dataset property for all projects."""
    async with await AsyncConnection.connect(
        settings.FMTM_DB_URL.unicode_string(),
    ) as db:
        projects = await DbProject.all(db)
        if not projects:
            print("No projects found.")
            return

        for project in projects:
            print("")
            print("--------------------------")
            print(f"------- Project {project.id} -------")
            print("--------------------------")
            print("")
            await add_submission_id_to_project(project.odk_credentials, project.odkid)
    print("success")


if __name__ == "__main__":
    asyncio.run(add_submission_id())
