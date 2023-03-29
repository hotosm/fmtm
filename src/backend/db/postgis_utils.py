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

''' Import required modules '''
import datetime
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from geojson_pydantic import Feature
from shapely.geometry import mapping

''' Define a function to return current UTC timestamp '''
def timestamp():
    """Used in SQL Alchemy models to ensure we refresh timestamp when new models initialised."""
    return datetime.datetime.utcnow()

''' Define a function to convert Geometry object to GeoJSON format '''
def geometry_to_geojson(geometry: Geometry, properties: str = {}):
    ''' Check if a geometry is passed '''
    if geometry:
        ''' Convert the geometry to a Shapely shape object '''
        shape = to_shape(geometry)
        ''' Construct a GeoJSON feature using the shape and properties '''
        geojson = {
            "type": "Feature",
            "geometry": mapping(shape),
            "properties": properties,
        }
        ''' Create and return a GeoJSON feature object using the constructed geojson dictionary '''
        return Feature(**geojson)

''' Define a function to get centroid of a geometry in GeoJSON format '''
def get_centroid(geometry: Geometry, properties: str = {}):
    ''' Check if a geometry is passed '''
    if geometry:
        ''' Convert the geometry to a Shapely shape object '''
        shape = to_shape(geometry)
        ''' Get the centroid of the shape '''
        point = shape.centroid
        ''' Construct a GeoJSON feature using the centroid and properties '''
        geojson = {
            "type": "Feature",
            "geometry": mapping(point),
            "properties": properties,
        }
        ''' Create and return a GeoJSON feature object using the constructed geojson dictionary '''
        return Feature(**geojson)
