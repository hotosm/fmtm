from typing import Union

from fastapi import Depends
from fastapi.exceptions import HTTPException
from loguru import logger as log
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.db_models import DbUser
from app.models.enums import HTTPStatus
from app.users.user_crud import get_user, get_user_by_username


async def user_exists(
    user_id: Union[str, int],
    db: Session = Depends(get_db),
) -> DbUser:
    """Check if user exists, else error."""
    try:
        user_id = int(user_id)
    except ValueError:
        pass

    if isinstance(user_id, int):
        log.debug(f"Getting user by id: {user_id}")
        db_user = await get_user(db, user_id)

    if isinstance(user_id, str):
        log.debug(f"Getting user by username: {user_id}")
        db_user = await get_user_by_username(db, user_id)

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f"User {user_id} does not exist",
        )

    return db_user
