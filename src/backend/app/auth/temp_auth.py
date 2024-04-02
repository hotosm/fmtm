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

"""Temporary Auth methods related to field users."""


import os
from datetime import datetime, timedelta
from typing import Dict, Union

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from app.auth.osm import AuthUser
from app.config import settings
from app.models.enums import UserRole

router = APIRouter(
    prefix="/temp",
    tags=["temp-auth"],
    responses={404: {"description": "Not found"}},
)

SECRET_KEY = os.environ.get("AUTH_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week


def create_access_token(data: dict):
    """Creates an access token based on the provided user data."""
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(request: Request, token: str) -> Dict[str, Union[str, int]]:
    """Verifies the authenticity of a token by decoding it."""
    try:
        if token:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        else:
            cookie_name = settings.FMTM_DOMAIN.replace(".", "_")
            access_token = request.cookies.get(cookie_name)
            return access_token
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Token has expired") from e
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e


@router.get("/login/")
async def temp_login(
    request: Request,
):
    """Handles the authentication check endpoint.

    By creating a temporary access token and
    setting it as a cookie.

    Args:
        request (Request): The incoming request object.
        response (Response): The outgoing response object.

    Returns:
        Response: The response object containing the access token as a cookie.
    """
    access_token = create_access_token(
        {"id": 20386219, "username": "svcfmtm", "role": "MAPPER"}
    )  # create temporary user token

    response = JSONResponse(content={"access_token": access_token}, status_code=200)
    cookie_name = settings.FMTM_DOMAIN.replace(".", "_")

    # Set JWT token as cookie
    response.set_cookie(
        key=cookie_name,
        value=access_token,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        httponly=True,
    )
    return response


async def auth_check(access_token: str = Depends(verify_token)):
    """Wrapper of verify token requiring temporary access."""
    return AuthUser(
        id=20386219,
        username="svcfmtm",
        role=UserRole.ADMIN,
    )
