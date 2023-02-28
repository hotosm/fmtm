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

from fastapi.logger import logger as logger
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import table, column

import os
import csv
from pyxform.xls2xform import xls2xform_convert
import xmltodict
import pathlib

from odkconvert.OdkCentral import OdkProject, OdkAppUser, OdkForm
from odkconvert.CSVDump import CSVDump
import odkconvert

from ..env_utils import config_env

url = config_env["ODK_CENTRAL_URL"]
user = config_env["ODK_CENTRAL_USER"]
pw = config_env["ODK_CENTRAL_PASSWD"]

project = OdkProject(url, user, pw)
xform = OdkForm(url, user, pw)
appuser = OdkAppUser(url, user, pw)
# project.authenticate()


def list_odk_projects():
    """List all projects on a remote ODK Server"""
    return project.listProjects()


def create_odk_project(
    name: str
):
    """Create a project on a remote ODK Server"""
    result = project.createProject(name)
    project.id = result["id"]
    logger.info(f"Project {name} has been created on the ODK Central server.")
    return result


def delete_odk_project(
    project_id: int
):
    """Delete a project from a remote ODK Server"""
    result = project.deleteProject(project_id)
    logger.info(f"Project {project_id} has been deleted from the ODK Central server.")
    return result


def create_appuser(
    project_id: int,
    name: str
):
    """Create an app-user on a remote ODK Server"""
    # project.listAppUsers(project_id)
    # user = project.findAppUser(name=name)
    # user = False
    # if not user:
    result = appuser.create(project_id, name)
    return result


def delete_app_user(project_id: int, name: str):
    """Delete an app-user from a remote ODK Server"""
    appuser = OdkAppUser()
    result = appuser.delete(project_id, name)
    return result


def create_odk_xform(
    project_id: int,
    xform: str
):
    """Create an XForm on a remote ODK Central server."""
    logger.error("create_odk_xform is unimplemented!")
    # FIXME: make sure it's a valid project id
    return None


def list_odk_xforms(
    project_id: int
):
    """List all XForms in an ODK Central project."""
    xforms = project.listForms(project_id)
    # FIXME: make sure it's a valid project id
    return xforms


def list_submissions(
    project_id: int
):
    """List submissions from a remote ODK server"""
    submissions = list()
    for user in project.listAppUsers(project_id):
        for subm in xform.listSubmissions(project_id, user['displayName']):
            submissions.append(subm)

    return submissions

def download_submissions(
    project_id: int,
    xform_id: str
):
    """Download submissions from a remote ODK server"""
    # FIXME: should probably filter by timestamps or status value
    data = xform.getSubmissions(project_id, xform_id, True)
    fixed = str(data, 'utf-8')
    return fixed.splitlines()


def generate_updated_xform(
    db: Session,
    task_id: dict,
    xlsform: str,
    xform: str,
):
    """Update the version in an XForm so it's unique"""
    name = xlsform.split(".")[0]
    os.path.basename(name)
    outfile = xform
    try:
        xls2xform_convert(xlsform_path=xlsform, xform_path=outfile, validate=True)
    except Exception:
        logger.error(f"Couldn't convert {xlsform} to an XForm!")
        return None
    if os.path.getsize(outfile) <= 0:
        logger.warning(f"{outfile} is empty!")
        return None
    xls = open(outfile, "r")
    data = xls.read()
    xls.close()

    xml = xmltodict.parse(str(data))
    # First change the osm data extract file
    index = 0
    for inst in xml["h:html"]["h:head"]["model"]["instance"]:
        try:
            if "@src" in inst:
                xml["h:html"]["h:head"]["model"]["instance"][index][
                    "@src"
                ] = "FIXME.geojson"
            if "data" in inst:
                if "data" == inst:
                    xml["h:html"]["h:head"]["model"]["instance"]["data"][
                        "@id"
                    ] = "FIXME XFORM"
                else:
                    xml["h:html"]["h:head"]["model"]["instance"][0]["data"][
                        "@id"
                    ] = "FIXME XFORM"
        except Exception:
            continue
        index += 1
    xml["h:html"]["h:head"]["h:title"] = "FIXME title"

    # write the updated XML file
    outxml = open(outfile, "w")
    newxml = xmltodict.unparse(xml)
    outxml.write(newxml)
    outxml.close()

    # insert the new version
    forms = table(
        "xlsforms", column("title"), column("xls"), column("xml"), column("id")
    )
    ins = insert(forms).values(title=name, xml=data)
    sql = ins.on_conflict_do_update(
        constraint="xlsforms_title_key", set_=dict(title=name, xml=newxml)
    )
    db.execute(sql)
    db.commit()

    return outfile


def create_QRCode(
    project_id: int,
    token: str,
    name: str,
):
    """Create the QR Code for an app-user"""
    appuser = OdkAppUser()
    return appuser.createQRCode(project_id, token, name)


def upload_media(
    project_id: int,
    xform_id: str,
    filespec: str
):
    """Upload a data file to Central"""
    xform.uploadMedia(project_id, xform_id, filespec)


def download_media(
    project_id: int,
    xform_id: str,
    filespec: str
):
    """Upload a data file to Central"""
    filename = "test"
    xform.getMedia(project_id, xform_id, filename)

def convert_csv(
    filespec: str,
    data: bytes,
):
    """Convert ODK CSV to OSM XML and GeoJson"""
    parent = pathlib.Path(odkconvert.__file__).resolve().parent
    csvin = CSVDump(str(parent.absolute()) + "/xforms.yaml")

    osmoutfile = f"{filespec}.osm"
    csvin.createOSM(osmoutfile)

    jsonoutfile = f"{filespec}.geojson"
    csvin.createGeoJson(jsonoutfile)

    if len(data) == 0:
        logger.debug("Parsing csv file %r" % filespec)
        # The yaml file is in the package files for odkconvert
        data = csvin.parse(filespec)
    else:
        csvdata = csvin.parse(filespec, data)
        for entry in csvdata:
            logger.debug(f"Parsing csv data {entry}")
            if len(data) <= 1:
                continue
            feature = csvin.createEntry(entry)
            # Sometimes bad entries, usually from debugging XForm design, sneak in
            if len(feature) > 0:
                if 'tags' not in feature:
                    logger.warning("Bad record! %r" % feature)
                else:
                    if 'lat' not in feature['attrs']:
                        import epdb; epdb.st()
                    csvin.writeOSM(feature)
                    # This GeoJson file has all the data values
                    csvin.writeGeoJson(feature)
                    pass

    csvin.finishOSM()
    csvin.finishGeoJson()

    return True
