# Copyright (c) 2023 Humanitarian OpenStreetMap Team
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
from loguru import logger as log

from enum import Enum

from pydantic import BaseModel


class CentralBase(BaseModel):
    """
    A Pydantic model representing the base information for interacting with an ODK Central server.

    Attributes:
        central_url (str): The URL of the ODK Central server.
    """
    central_url: str


class Central(CentralBase):
    """
    A Pydantic model representing additional information for interacting with an ODK Central server.

    Attributes:
        geometry_geojson (str): The geometry of a GeoJSON file.
    """
    geometry_geojson: str
    # qr_code_binary: bytes


class CentralOut(CentralBase):
    log.debug("Hello World!")


class CentralFileType(BaseModel):
    """
    A Pydantic model representing an enumeration of file types that can be used with ODK Central.

    Attributes:
        filetype (Enum): An enumeration of file types.
    """
    filetype: Enum("FileType", ["xform", "extract", "zip", "xlsform", "all"])
    log.debug("Hello World!")


class CentralDetails(CentralBase):
    log.debug("Hello World!")
