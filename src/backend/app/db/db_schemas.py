# Copyright (c) Humanitarian OpenStreetMap Team
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
"""Pydantic models for parsing database rows."""

from datetime import datetime
from typing import Optional, Self
from uuid import UUID

from fastapi import HTTPException
from loguru import logger as log
from psycopg import Connection
from psycopg.rows import class_row
from pydantic import BaseModel
from pydantic.functional_validators import field_validator

from app.config import settings
from app.models.enums import (
    BackgroundTaskStatus,
    CommunityType,
    HTTPStatus,
    MappingLevel,
    OrganisationType,
    ProjectPriority,
    ProjectRole,
    ProjectStatus,
    ProjectVisibility,
    TaskAction,
    TaskSplitType,
    UserRole,
)
from app.organisations.organisation_schemas import OrganisationIn
from app.projects.project_schemas import ProjectUpload
from app.users.user_schemas import UserBasic


class DbUserRole(BaseModel):
    """Table user_roles."""

    user_id: Optional[int]
    project_id: int
    role: ProjectRole


class DbUser(UserBasic):
    """Table users."""

    id: int
    username: str
    role: UserRole
    profile_img: Optional[str] = None
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    email_address: Optional[str] = None
    is_email_verified: bool = False
    is_expert: bool = False
    mapping_level: Optional[MappingLevel] = MappingLevel.BEGINNER
    tasks_mapped: Optional[int] = 0
    tasks_validated: Optional[int] = 0
    tasks_invalidated: Optional[int] = 0
    projects_mapped: Optional[list[int]] = None
    registered_at: datetime

    # Relationships
    project_roles: Optional[list[DbUserRole]] = None
    orgs_managed: Optional[list[int]] = None

    # @field_validator("role", mode="before")
    # @classmethod
    # def role_enum_str_to_int(cls, value: UserRole | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, UserRole):
    #         return UserRole[value.name]
    #     else:
    #         return UserRole[value]

    # @field_validator("mapping_level", mode="before")
    # @classmethod
    # def mapping_level_enum_str_to_int(cls, value: MappingLevel | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, MappingLevel):
    #         return MappingLevel[value.name]
    #     else:
    #         return MappingLevel[value]

    @classmethod
    async def one(cls, db: Connection, user_identifier: int | str) -> Self:
        """Get a user either by ID or username, including roles and orgs managed."""
        async with db.cursor(row_factory=class_row(cls)) as cur:
            sql = """
                SELECT
                    u.*,
                    array_agg(
                        DISTINCT om.organisation_id
                    ) FILTER (WHERE om.organisation_id IS NOT NULL) AS orgs_managed,
                    jsonb_object_agg(
                        ur.project_id,
                        COALESCE(ur.role, 'MAPPER')
                    ) FILTER (WHERE ur.project_id IS NOT NULL) AS project_roles
                FROM users u
                LEFT JOIN user_roles ur ON u.id = ur.user_id
                LEFT JOIN organisation_managers om ON u.id = om.user_id
            """

            if isinstance(user_identifier, int):
                # Is ID
                sql += """
                    WHERE u.id = %(user_identifier)s
                    GROUP BY u.id;
                """
            else:
                # Is username (basic flexible matching)
                sql += """
                    WHERE u.username ILIKE %(user_identifier)s
                    GROUP BY u.id;
                """
                user_identifier = f"{user_identifier}%"

            await cur.execute(
                sql,
                {"user_identifier": user_identifier},
            )

            db_project = await cur.fetchone()
            if not db_project:
                raise KeyError(f"User ({user_identifier}) not found.")

            return db_project

    @classmethod
    async def all(
        cls, db: Connection, skip: int = 0, limit: int = 100
    ) -> Optional[list[Self]]:
        """Fetch all users."""
        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(
                """
                SELECT * FROM users
                OFFSET %(offset)s
                LIMIT %(limit)s;
                """,
                {"offset": skip, "limit": limit},
            )
            return await cur.fetchall()


class DbOrganisation(BaseModel):
    """Table organisations."""

    id: int
    name: str
    slug: str
    logo: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    type: OrganisationType
    approved: bool = False
    created_by: Optional[int] = None
    odk_central_url: Optional[str] = None
    odk_central_user: Optional[str] = None
    odk_central_password: Optional[str] = None
    community_type: CommunityType

    # Relationships
    managers: list[UserBasic]

    @classmethod
    async def one(cls, db: Connection, org_identifier: int | str) -> Self:
        """Fetch a single organisation by name or ID."""
        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(
                f"""
                SELECT * FROM organisations
                WHERE {
                    'name' if isinstance(org_identifier, str)
                    else 'id'
                } = %(org_identifier)s;
                """,
                {"org_identifier": org_identifier},
            )
            db_org = await cur.fetchone()

            if not db_org:
                raise KeyError(f"Organisation ({org_identifier}) not found.")

            return db_org

    @classmethod
    async def all(
        cls, db: Connection, current_user_id: int = 0
    ) -> Optional[list[Self]]:
        """Fetch all organisations.

        Returns all orgs if user is admin, else only approved orgs.
        """
        sql = """
            SELECT *
            FROM organisations
            WHERE
                CASE
                    WHEN (
                        SELECT role
                        FROM users
                        WHERE id = %(user_id)s) = 'ADMIN'
                        THEN TRUE
                    ELSE approved
                END = TRUE;
        """

        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(sql, {"user_id": current_user_id})
            return await cur.fetchall()

    @classmethod
    async def create(
        cls, db: Connection, org_in: OrganisationIn, user_id: int
    ) -> Optional[Self]:
        """Create a new organisation."""
        org_in["created_by"] = user_id

        async with db.cursor() as cur:
            sql = """
                SELECT EXISTS (
                    SELECT 1
                    FROM organisations
                    WHERE LOWER(name) = %(name)s
                )
            """
            await cur.execute(sql, {"name": org_in.name.lower()})
            org_exists = await cur.fetchone()
            if org_exists[0]:
                msg = f"Organisation named ({org_in.name}) already exists!"
                log.warning(f"User ({user_id}) failed organisation creation: {msg}")
                raise HTTPException(status_code=HTTPStatus.CONFLICT, detail=msg)

        # NOTE: exclude_none is used over exclude_unset to ensure default
        # values are included
        model_dump = org_in.model_dump(exclude_none=True)
        columns = ", ".join(model_dump.keys())
        value_placeholders = ", ".join(f"%({key})s" for key in model_dump.keys())

        sql = f"""
            INSERT INTO organisations
                (created_at, {columns})
            VALUES
                (NOW(), {value_placeholders})
            RETURNING *;
        """

        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(sql, model_dump)
            new_org = await cur.fetchone()

            if not new_org:
                msg = f"Unknown SQL error for data: {model_dump}"
                log.error(f"User ({user_id}) failed organisation creation: {msg}")
                raise HTTPException(
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=msg
                )

            return new_org

    @classmethod
    async def delete(cls, db: Connection, org_id: int) -> bool:
        """Delete an organisation and its related data."""
        sql = """
        WITH deleted_task_events AS (
            DELETE FROM task_events
            WHERE project_id IN (
                SELECT id FROM projects WHERE organisation_id = %(org_id)s
            )
            RETURNING project_id
        ), deleted_tasks AS (
            DELETE FROM tasks
            WHERE project_id IN (
                SELECT id FROM projects WHERE organisation_id = %(org_id)s
            )
            RETURNING project_id
        ), deleted_projects AS (
            DELETE FROM projects
            WHERE organisation_id = %(org_id)s
            RETURNING organisation_id
        ), deleted_org AS (
            DELETE FROM organisations
            WHERE id = %(org_id)s
            RETURNING id
        )
        SELECT id FROM deleted_org;
        """

        async with db.cursor() as cur:
            await cur.execute(sql, {"org_id": org_id})
            deleted_org_id = await cur.fetchone()

            if not deleted_org_id:
                log.warning(f"Failed to delete organisation ({org_id})")
                raise HTTPException(
                    status_code=HTTPStatus.FORBIDDEN,
                    detail="User not authorized to delete this organisation.",
                )
            return deleted_org_id

    @classmethod
    async def unapproved(cls, db: Connection) -> Optional[list[Self]]:
        """Get all organisations not approved yet."""
        sql = """
            SELECT *
            FROM organisations
            WHERE approved != TRUE;
        """

        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(sql)
            return await cur.fetchall()


class DbXLSForm(BaseModel):
    """Table xlsforms.

    XLSForm templates and custom uploads.

    TODO SQL migrate and rename this to 'template_xlsforms'.
    """

    id: int
    title: str
    xls: bytes


class DbTaskHistory(BaseModel):
    """Table task_history.

    Task events such as locking, marking mapped, and comments.
    """

    event_id: UUID
    project_id: int
    task_id: int
    action: TaskAction
    action_text: Optional[str] = None
    action_date: datetime
    user_id: int


class DbTask(BaseModel):
    """Table tasks."""

    id: int
    project_id: int
    project_task_index: Optional[int] = None
    outline: dict
    feature_count: Optional[int] = None

    @classmethod
    async def one(cls, db: Connection, org_identifier: int | str) -> Self:
        """Fetch a single organisation by name or ID."""
        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(
                f"""
                SELECT * FROM organisations
                WHERE {
                    'name' if isinstance(org_identifier, str)
                    else 'id'
                } = %(org_identifier)s;
                """,
                {"org_identifier": org_identifier},
            )
            db_org = await cur.fetchone()

            if not db_org:
                raise KeyError(f"Organisation ({org_identifier}) not found.")

            return db_org


class DbProjectInfo(BaseModel):
    """Table project_info.

    TODO SQL refactor all usage of .project_info throughout app...
    This should be refactored in future?
    We simply do an SQL JOIN to include in the project fields.
    """

    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    per_task_instructions: Optional[str] = None


class DbProject(DbProjectInfo):
    """Table projects."""

    id: int
    odkid: Optional[int] = None
    author_id: int
    organisation_id: int
    task_split_type: Optional[TaskSplitType] = None
    project_name_prefix: Optional[str] = None
    location_str: Optional[str] = None
    custom_tms_url: Optional[str] = None
    # TODO SQL need to update outline_geojson references
    outline: dict
    status: ProjectStatus
    visibility: ProjectVisibility
    total_tasks: Optional[int] = None
    xform_category: Optional[str] = None
    odk_form_id: Optional[str] = None  # TODO SQL need to update references to xform_id
    xlsform_content: Optional[bytes] = None  # TODO SQL this was LargeBinary previously
    mapper_level: MappingLevel
    priority: ProjectPriority
    featured: Optional[bool] = None
    odk_central_url: Optional[str] = None
    odk_central_user: Optional[str] = None
    odk_central_password: Optional[str] = None
    odk_token: Optional[str] = None
    data_extract_type: Optional[str] = None
    data_extract_url: Optional[str] = None
    task_split_dimension: Optional[int] = None
    task_num_buildings: Optional[int] = None
    hashtags: Optional[list[str]] = None
    due_date: Optional[datetime] = None
    updated_at: datetime
    created_at: datetime

    # Relationships
    tasks: Optional[list[DbTask]] = None
    author: Optional[UserBasic] = None
    # TODO SQL replace usage of projects.organisation_logo with
    # projects.organisation.logo

    # Calculated
    organisation_logo: Optional[str] = None
    centroid: Optional[dict] = None
    bbox: Optional[list] = None

    @field_validator("bbox", mode="before")
    @classmethod
    def bbox_string_to_list(cls, value: str) -> Optional[list]:
        """Parse PostGIS BOX2D format to BBOX list.

        Format: [xmin, ymin, xmax, ymax].
        """
        if not value:
            return None
        return value[4:-1].replace(",", " ").split(" ")

    # @field_validator("status", mode="before")
    # @classmethod
    # def project_status_enum_str_to_int(cls, value: ProjectStatus | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, ProjectStatus):
    #         return ProjectStatus[value.name]
    #     else:
    #         return ProjectStatus[value]

    # @field_validator("visibility", mode="before")
    # @classmethod
    # def project_visibility_enum_str_to_int(
    # cls, value: ProjectVisibility | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, ProjectVisibility):
    #         return ProjectVisibility[value.name]
    #     else:
    #         return ProjectVisibility[value]

    # @field_validator("mapper_level", mode="before")
    # @classmethod
    # def mapper_level_enum_str_to_int(cls, value: MappingLevel | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, MappingLevel):
    #         return MappingLevel[value.name]
    #     else:
    #         return MappingLevel[value]

    # @field_validator("priority", mode="before")
    # @classmethod
    # def project_priority_enum_str_to_int(cls, value: ProjectPriority | str) -> int:
    #     """Get the the int value from a string enum."""
    #     if isinstance(value, ProjectPriority):
    #         return ProjectPriority[value.name]
    #     else:
    #         return ProjectPriority[value]

    @classmethod
    async def one(cls, db: Connection, project_id: int) -> Self:
        """Get project by ID, including all tasks and other details."""
        async with db.cursor(row_factory=class_row(cls)) as cur:
            sql = """
                WITH latest_task_history AS (
                    SELECT DISTINCT ON (task_id)
                        task_id,
                        action,
                        action_date,
                        user_id
                    FROM
                        task_history
                    WHERE
                        action != 'COMMENT'
                    ORDER BY
                        task_id, action_date DESC
                )
                SELECT
                    p.*,
                    pi.*,
                    ST_AsGeoJSON(p.outline)::jsonb AS outline,
                    ST_AsGeoJSON(ST_Centroid(p.outline))::jsonb AS centroid,
                    ST_Extent(p.outline)::text AS bbox,
                    JSON_BUILD_OBJECT(
                        'id', project_author.id,
                        'username', project_author.username,
                        'role', project_author.role
                    ) AS author,
                    project_org.logo as organisation_logo,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', t.id,
                                'project_id', t.project_id,
                                'project_task_index', t.project_task_index,
                                'outline', ST_AsGeoJSON(t.outline)::jsonb,
                                'feature_count', t.feature_count,
                                'task_status', COALESCE(
                                    latest_th.action,
                                    'RELEASED_FOR_MAPPING'
                                ),
                                'locked_by_uid', COALESCE(
                                    latest_user.id,
                                    NULL
                                ),
                                'locked_by_username', COALESCE(
                                    latest_user.username,
                                    NULL
                                )
                            )
                        ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
                    ) AS tasks
                FROM
                    projects p
                LEFT JOIN
                    project_info pi ON p.id = pi.project_id
                LEFT JOIN
                    users project_author ON p.author_id = project_author.id
                LEFT JOIN
                    organisations project_org ON p.organisation_id = project_org.id
                LEFT JOIN
                    tasks t ON p.id = t.project_id
                LEFT JOIN
                    latest_task_history latest_th ON t.id = latest_th.task_id
                LEFT JOIN
                    users latest_user ON latest_th.user_id = latest_user.id
                WHERE
                    p.id = %(project_id)s
                GROUP BY
                    p.id, pi.project_id, project_author.id, project_org.id;
            """

            await cur.execute(
                sql,
                {"project_id": project_id},
            )

            obj = await cur.fetchone()
            if not obj:
                raise KeyError(f"Project ({project_id}) not found.")

            if obj.odk_token is None:
                log.warning(
                    f"Project ({obj.id}) has no 'odk_token' set. "
                    "The QRCode will not work!"
                )

            return obj

    @classmethod
    async def all(
        cls,
        db: Connection,
        skip: int = 0,
        limit: int = 100,
        user_id: Optional[int] = None,
        hashtags: Optional[list[str]] = None,
        search: Optional[str] = None,
    ) -> Optional[list[Self]]:
        """Fetch all projects with optional filters for user, hashtags, and search."""
        filters = []
        params = {"offset": skip, "limit": limit}

        # Filter by user_id (project author)
        if user_id:
            filters.append("author_id = %(user_id)s")
            params["user_id"] = user_id

        # Filter by hashtags
        if hashtags:
            filters.append("hashtags && %(hashtags)s")
            params["hashtags"] = hashtags

        # Filter by search term (project name using ILIKE for case-insensitive match)
        if search:
            filters.append("project_name_prefix ILIKE %(search)s")
            params["search"] = f"%{search}%"

        # Base query with optional filtering
        sql = f"""
            SELECT
                p.*,
                pi.*,
                ST_AsGeoJSON(p.outline)::jsonb AS outline,
                project_org.logo as organisation_logo,
                COUNT(t.id) AS task_count
            FROM
                projects p
            LEFT JOIN
                project_info pi ON p.id = pi.project_id
            LEFT JOIN
                organisations project_org ON p.organisation_id = project_org.id
            LEFT JOIN
                tasks t ON p.id = t.project_id
            {'WHERE ' + ' AND '.join(filters) if filters else ''}
            GROUP BY
                p.id, pi.project_id, project_org.id
            ORDER BY
                p.id DESC
            OFFSET %(offset)s
            LIMIT %(limit)s;
        """

        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(sql, params)
            return await cur.fetchall()

    @classmethod
    async def create(cls, db: Connection, project_in: ProjectUpload) -> Self:
        """Create a new project in the database."""
        model_dump = project_in.model_dump(exclude_none=True)

        if not model_dump:
            log.error("Attempted to create a project with no data.")
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST, detail="No project data provided"
            )

        log.debug(
            f"Creating project in the database with the following data: {model_dump}"
        )

        columns = ", ".join(model_dump.keys())
        value_placeholders = ", ".join(f"%({key})s" for key in model_dump.keys())

        sql = f"""
            INSERT INTO projects
                (created_at, {columns})
            VALUES
                (NOW(), {value_placeholders})
            RETURNING *;
        """

        async with db.cursor(row_factory=class_row(cls)) as cur:
            await cur.execute(sql, model_dump)
            new_project = await cur.fetchone()

            if not new_project:
                msg = f"Unknown SQL error for data: {model_dump}"
                log.error(f"Project creation failed: {msg}")
                raise HTTPException(
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=msg
                )

            new_project_id = new_project.id

            # Append hashtag to the project
            extra_hashtag = f"#{settings.FMTM_DOMAIN}-{new_project_id}"
            await cur.execute(
                """
                UPDATE projects
                SET hashtags = CONCAT(COALESCE(hashtags, ''), ' ', %(extra_hashtag)s)
                WHERE id = %(project_id)s;
                """,
                {
                    "project_id": new_project_id,
                    "extra_hashtag": extra_hashtag,
                },
            )

        return new_project


class BackgroundTask(BaseModel):
    """Table background_tasks.

    For managing long-running background tasks.

    TODO SQL this will eventually be removed.
    """

    id: str
    name: str
    project_id: Optional[int] = None
    status: BackgroundTaskStatus
    message: Optional[str] = None


class DbTilesPath(BaseModel):
    """Table tiles_path."""

    id: int
    project_id: int
    status: BackgroundTaskStatus
    path: str
    tile_source: str
    background_task_id: str
    created_at: datetime


class DbSubmissionPhoto(BaseModel):
    """Table submission_photo.

    TODO SQL this will be replace by ODK Central direct S3 upload.
    """

    id: int
    project_id: int
    task_id: int  # Note this is not a DbTask, but an ODK task_id
    submission_id: str
    s3_path: str
