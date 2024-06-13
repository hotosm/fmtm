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

"""Auth methods related to OSM OAuth2."""

import os
from typing import Optional

import jwt
from fastapi import Header, HTTPException, Request
from loguru import logger as log
from osm_login_python.core import Auth
from pydantic import BaseModel, ConfigDict

from app.config import settings
from app.models.enums import UserRole

if settings.DEBUG:
    # Required as callback url is http during dev
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


class AuthUser(BaseModel):
    """The user model returned from OSM OAuth2."""

    model_config = ConfigDict(use_enum_values=True)

    id: int
    username: str
    img_url: Optional[str] = None
    role: Optional[UserRole] = UserRole.MAPPER


async def init_osm_auth():
    """Initialise Auth object from osm-login-python."""
    return Auth(
        osm_url=settings.OSM_URL,
        client_id=settings.OSM_CLIENT_ID,
        client_secret=settings.OSM_CLIENT_SECRET,
        secret_key=settings.OSM_SECRET_KEY,
        login_redirect_uri=settings.OSM_LOGIN_REDIRECT_URI,
        scope=settings.OSM_SCOPE,
    )


async def login_required(
    request: Request, access_token: str = Header(None)
) -> AuthUser:
    """Dependency to inject into endpoints requiring login."""
    if settings.DEBUG:
        return AuthUser(
            id=1,
            username="localadmin",
            role=UserRole.ADMIN,
        )

    # Attempt extract from cookie if access token not passed
    if not access_token:
        cookie_name = settings.FMTM_DOMAIN.replace(".", "_")
        log.debug(f"Extracting token from cookie {cookie_name}")
        access_token = request.cookies.get(cookie_name)

    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        token_data = verify_access_token(access_token)
    except ValueError as e:
        log.error(e)
        log.error("Failed to deserialise access token")
        raise HTTPException(status_code=401, detail="Access token not valid") from e

    return AuthUser(**token_data)


def create_access_token(payload: dict) -> str:
    """Generates an access token for the specified user.

    Args:
        payload (dict): user data for which the access token is being generated.

    Returns:
        str: The generated access token.
    """
    private_key = settings.AUTH_PRIVATE_KEY
    return jwt.encode(payload, str(private_key), algorithm=settings.ALGORITHM)


def verify_access_token(token: str):
    """Verifies the access token and returns the payload if valid.

    Args:
        token (str): The access token to be verified.

    Returns:
        dict: The payload of the access token if verification is successful.

    Raises:
        HTTPException: If the token has expired or credentials could not be validated.
    """
    try:
        public_key = settings.AUTH_PUBLIC_KEY
        return jwt.decode(token, str(public_key), algorithms=[settings.ALGORITHM])
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Token has expired") from e
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=401, detail="Could not validate credentials"
        ) from e
