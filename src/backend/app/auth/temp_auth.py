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
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.config import settings

router = APIRouter(
    prefix="/temp",
    tags=["temp-auth"],
    responses={404: {"description": "Not found"}},
)


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
    access_token = settings.OSM_SVC_TOKEN

    response = JSONResponse(content={"access_token": access_token}, status_code=200)
    cookie_name = settings.FMTM_DOMAIN.replace(".", "_")
    response.set_cookie(
        key=cookie_name,
        value=access_token,
        max_age=604800,
        expires=604800,  # expiry set to 7 days,
        path="/",
        domain=settings.FMTM_DOMAIN,
        secure=False if settings.DEBUG else True,
        httponly=True,
        samesite="lax",
    )
    return response
