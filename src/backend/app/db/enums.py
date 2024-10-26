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
"""Enum definitions to translate values into human enum strings."""

from enum import Enum, IntEnum, StrEnum

TILES_SOURCE = ["esri", "bing", "google"]
TILES_FORMATS = ["mbtiles", "sqlitedb", "pmtiles"]


class HTTPStatus(IntEnum):
    """All HTTP status codes used in endpoints."""

    # Success
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204

    # Client Error
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    CONFLICT = 409
    UNPROCESSABLE_ENTITY = 422

    # Server Error
    INTERNAL_SERVER_ERROR = 500
    NOT_IMPLEMENTED = 501


class ProjectStatus(StrEnum, Enum):
    """All possible states of a Mapping Project."""

    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class OrganisationType(StrEnum, Enum):
    """An organisation's subscription type."""

    FREE = "FREE"
    DISCOUNTED = "DISCOUNTED"
    FULL_FEE = "FULL_FEE"


class ProjectPriority(StrEnum, Enum):
    """All possible project priority levels."""

    MEDIUM = "MEDIUM"
    LOW = "LOW"
    HIGH = "HIGH"
    URGENT = "URGENT"


class UserRole(StrEnum, Enum):
    """Available roles assigned to a user site-wide in FMTM.

    Can be used for global user permissions:
        - READ_ONLY = write access blocked (i.e. banned)
        - MAPPER = default for all
        - ADMIN = super admin with access to everything
    """

    READ_ONLY = "READ_ONLY"
    MAPPER = "MAPPER"
    ADMIN = "ADMIN"


class ProjectRole(StrEnum, Enum):
    """Available roles assigned to a user for a specific project.

    All roles must be assigned by someone higher in the hierarchy:
        - MAPPER = default for all
        - VALIDATOR = can validate the mappers output
        - FIELD_MANAGER = can invite mappers and organise people
        - ASSOCIATE_PROJECT_MANAGER = helps the project manager, cannot delete project
        - PROJECT_MANAGER = has all permissions to manage a project, including delete
    """

    MAPPER = "MAPPER"
    VALIDATOR = "VALIDATOR"
    FIELD_MANAGER = "FIELD_MANAGER"
    ASSOCIATE_PROJECT_MANAGER = "ASSOCIATE_PROJECT_MANAGER"
    PROJECT_MANAGER = "PROJECT_MANAGER"


class MappingLevel(StrEnum, Enum):
    """The mapping level the mapper has achieved."""

    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class TaskEvent(StrEnum, Enum):
    """Task events via API.

    `map` -- Set to *locked for mapping*, i.e. mapping in progress.
    `finish` -- Set to *unlocked to validate*, i.e. is mapped.
    `validate` -- Request recent task ready to be validate.
    `good` -- Set the state to *unlocked done*.
    `bad` -- Set the state *unlocked to map* again, to be mapped once again.
    `split` -- Set the state *unlocked done* then generate additional
        subdivided task areas.
    `merge` -- Set the state *unlocked done* then generate additional
        merged task area.
    `assign` -- For a requester user to assign a task to another user.
        Set the state *locked for mapping* passing in the required user id.
        Also notify the user they should map the area.
    `comment` -- Keep the state the same, but simply add a comment.
    """

    MAP = "MAP"
    FINISH = "FINISH"
    VALIDATE = "VALIDATE"
    GOOD = "GOOD"
    BAD = "BAD"
    SPLIT = "SPLIT"
    MERGE = "MERGE"
    ASSIGN = "ASSIGN"
    COMMENT = "COMMENT"


class MappingState(StrEnum, Enum):
    """State options for tasks in FMTM."""

    UNLOCKED_TO_MAP = "UNLOCKED_TO_MAP"
    LOCKED_FOR_MAPPING = "LOCKED_FOR_MAPPING"
    UNLOCKED_TO_VALIDATE = "UNLOCKED_TO_VALIDATE"
    LOCKED_FOR_VALIDATION = "LOCKED_FOR_VALIDATION"
    UNLOCKED_DONE = "UNLOCKED_DONE"


class EntityState(IntEnum, Enum):
    """State options for Entities in ODK.

    NOTE here we started with int enums and it's hard to migrate.
    NOTE we will continue to use int values in the form.
    NOTE we keep BAD=6 for legacy reasons too.
    """

    READY = 0
    OPEN_IN_ODK = 1
    SURVEY_SUBMITTED = 2
    MARKED_BAD = 6


class TaskType(StrEnum, Enum):
    """Task type."""

    BUILDINGS = "BUILDINGS"
    AMENITIES = "AMENITIES"
    OTHER = "OTHER"


class ProjectSplitStrategy(StrEnum, Enum):
    """Task splitting type."""

    GRID = "GRID"
    OSM_VECTORS = "OSM_VECTORS"
    OTHER = "OTHER"


class BackgroundTaskStatus(StrEnum, Enum):
    """FastAPI background Task Statuses."""

    PENDING = "PENDING"
    FAILED = "FAILED"
    RECEIVED = "RECEIVED"
    SUCCESS = "SUCCESS"


class TaskSplitType(StrEnum, Enum):
    """Task splitting type for fmtm-splitter."""

    DIVIDE_ON_SQUARE = "DIVIDE_ON_SQUARE"
    CHOOSE_AREA_AS_TASK = "CHOOSE_AREA_AS_TASK"
    TASK_SPLITTING_ALGORITHM = "TASK_SPLITTING_ALGORITHM"


class ProjectVisibility(StrEnum, Enum):
    """Project visibility to end users."""

    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"
    INVITE_ONLY = "INVITE_ONLY"


class CommunityType(StrEnum, Enum):
    """Community type."""

    OSM_COMMUNITY = "OSM_COMMUNITY"
    COMPANY = "COMPANY"
    NON_PROFIT = "NON_PROFIT"
    UNIVERSITY = "UNIVERSITY"
    OTHER = "OTHER"


class ReviewStateEnum(StrEnum, Enum):
    """Review states of submission."""

    HASISSUES = "HASISSUES"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class GeometryType(StrEnum, Enum):
    """GeoJSON geometry types."""

    Polygon = "Polygon"
    LineString = "LineString"
    Point = "Point"


class XLSFormType(StrEnum, Enum):
    """XLSForm categories bundled by default.

    The key is the name of the XLSForm file for internal use.
    This cannot match an existing OSM tag value, so some words are replaced
    (e.g. OSM=healthcare, XLSForm=health).

    The the value is the user facing form name (e.g. healthcare).
    """

    buildings = "buildings"
    # highways = "highways"
    health = "healthcare"
    # toilets = "toilets"
    # religious = "religious"
    # landusage = "landusage"
    # waterways = "waterways"


def get_action_for_status_change(task_state: MappingState) -> TaskEvent:
    """Update task action inferred from previous state."""
    match task_state:
        case MappingState.READY:
            return TaskEvent.RELEASED_FOR_MAPPING
        case MappingState.LOCKED_FOR_MAPPING:
            return TaskEvent.LOCKED_FOR_MAPPING
        case MappingState.MAPPED:
            return TaskEvent.MARKED_MAPPED
        case MappingState.LOCKED_FOR_VALIDATION:
            return TaskEvent.LOCKED_FOR_VALIDATION
        case MappingState.VALIDATED:
            return TaskEvent.VALIDATED
        case MappingState.BAD:
            return TaskEvent.MARKED_BAD
        case MappingState.SPLIT:
            return TaskEvent.SPLIT_NEEDED
        case MappingState.INVALIDATED:
            return TaskEvent.MARKED_INVALID
        case _:
            return TaskEvent.RELEASED_FOR_MAPPING


def get_status_for_action(task_action: TaskEvent) -> MappingState:
    """Get the task status inferred from the action."""
    match task_action:
        case TaskEvent.RELEASED_FOR_MAPPING:
            return MappingState.READY
        case TaskEvent.LOCKED_FOR_MAPPING:
            return MappingState.LOCKED_FOR_MAPPING
        case TaskEvent.MARKED_MAPPED:
            return MappingState.MAPPED
        case TaskEvent.LOCKED_FOR_VALIDATION:
            return MappingState.LOCKED_FOR_VALIDATION
        case TaskEvent.VALIDATED:
            return MappingState.VALIDATED
        case TaskEvent.MARKED_BAD:
            return MappingState.BAD
        case TaskEvent.SPLIT_NEEDED:
            return MappingState.SPLIT
        case TaskEvent.MARKED_INVALID:
            return MappingState.INVALIDATED
        case _:
            return MappingState.READY
