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
"""PostGIS and geometry handling helper funcs."""

import json
import logging
from datetime import datetime, timezone
from random import getrandbits
from typing import Optional, Union

import geojson
import requests
from fastapi import HTTPException
from geoalchemy2 import WKBElement
from geoalchemy2.shape import from_shape, to_shape
from geojson.feature import FeatureCollection
from geojson_pydantic import Feature, Polygon
from geojson_pydantic import FeatureCollection as FeatCol
from shapely.geometry import mapping, shape
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import Session

log = logging.getLogger(__name__)


def timestamp():
    """Get the current time.

    Used to insert a current timestamp into Pydantic models.
    """
    return datetime.now(timezone.utc)


def geometry_to_geojson(
    geometry: WKBElement, properties: Optional[dict] = None, id: Optional[int] = None
) -> Union[Feature, dict]:
    """Convert SQLAlchemy geometry to GeoJSON."""
    if geometry:
        shape = to_shape(geometry)
        geojson = {
            "type": "Feature",
            "geometry": mapping(shape),
            "properties": properties,
            "id": id,
            # "bbox": shape.bounds,
        }
        return Feature(**geojson)
    return {}


def get_centroid(
    geometry: WKBElement,
    properties: Optional[dict] = None,
    id: Optional[int] = None,
) -> Union[list[int], Feature]:
    """Convert SQLAlchemy geometry to Centroid GeoJSON.

    If no id or properties fields are passed, returns the coordinate only.
    Else returns a Feature GeoJSON.
    """
    if geometry:
        shape = to_shape(geometry)
        point = shape.centroid
        if not properties and not id:
            return point
        geojson = {
            "type": "Feature",
            "geometry": mapping(point),
            "properties": properties,
            "id": id,
        }
        return Feature(**geojson)
    return {}


def geojson_to_geometry(
    geojson: Union[FeatCol, Feature, Polygon],
) -> Optional[WKBElement]:
    """Convert GeoJSON to SQLAlchemy geometry."""
    parsed_geojson = parse_and_filter_geojson(geojson.model_dump_json(), filter=False)

    if not parsed_geojson:
        return None

    features = parsed_geojson.get("features", [])

    if len(features) > 1:
        # TODO code to merge all geoms into multipolygon
        # TODO do not use convex hull
        pass

    geometry = features[0].get("geometry")

    shapely_geom = shape(geometry)
    return from_shape(shapely_geom)


def read_wkb(wkb: WKBElement):
    """Load a WKBElement and return a shapely geometry."""
    return to_shape(wkb)


def write_wkb(shape):
    """Load shapely geometry and output WKBElement."""
    return from_shape(shape)


async def geojson_to_flatgeobuf(
    db: Session, geojson: geojson.FeatureCollection
) -> Optional[bytes]:
    """From a given FeatureCollection, return a memory flatgeobuf obj.

    NOTE this generate an fgb with string timestamps, not datetime.
    NOTE ogr2ogr would generate datetime, but parsing does not seem to work.

    Args:
        db (Session): SQLAlchemy db session.
        geojson (geojson.FeatureCollection): a FeatureCollection object.

    Returns:
        flatgeobuf (bytes): a Python bytes representation of a flatgeobuf file.
    """
    geojson_with_props = add_required_geojson_properties(geojson)

    sql = text(
        """
        DROP TABLE IF EXISTS temp_features CASCADE;

        -- Wrap geometries in GeometryCollection
        CREATE TEMP TABLE IF NOT EXISTS temp_features(
            geom geometry(GeometryCollection, 4326),
            osm_id integer,
            tags text,
            version integer,
            changeset integer,
            timestamp text
        );

        WITH data AS (SELECT CAST(:geojson AS json) AS fc)
        INSERT INTO temp_features
            (geom, osm_id, tags, version, changeset, timestamp)
        SELECT
            ST_ForceCollection(ST_GeomFromGeoJSON(feat->>'geometry')) AS geom,
            (feat->'properties'->>'osm_id')::integer as osm_id,
            (feat->'properties'->>'tags')::text as tags,
            (feat->'properties'->>'version')::integer as version,
            (feat->'properties'->>'changeset')::integer as changeset,
            (feat->'properties'->>'timestamp')::text as timestamp
        FROM json_array_elements((SELECT fc->'features' FROM data)) AS f(feat);

        -- Second param = generate with spatial index
        SELECT ST_AsFlatGeobuf(geoms, true)
        FROM (SELECT * FROM temp_features) AS geoms;
    """
    )

    # Run the SQL
    result = db.execute(sql, {"geojson": json.dumps(geojson_with_props)})
    # Get a memoryview object, then extract to Bytes
    flatgeobuf = result.first()

    if flatgeobuf:
        return flatgeobuf[0].tobytes()

    # Nothing returned (either no features passed, or failed)
    return None


async def flatgeobuf_to_geojson(
    db: Session, flatgeobuf: bytes
) -> Optional[geojson.FeatureCollection]:
    """Converts FlatGeobuf data to GeoJSON.

    Extracts single geometries from wrapped GeometryCollection if used.

    Args:
        db (Session): SQLAlchemy db session.
        flatgeobuf (bytes): FlatGeobuf data in bytes format.

    Returns:
        geojson.FeatureCollection: A FeatureCollection object.
    """
    sql = text(
        """
        DROP TABLE IF EXISTS public.temp_fgb CASCADE;

        SELECT ST_FromFlatGeobufToTable('public', 'temp_fgb', :fgb_bytes);

        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(feature)
        ) AS feature_collection
        FROM (
            SELECT jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(ST_GeometryN(fgb_data.geom, 1))::jsonb,
                'id', fgb_data.osm_id,
                'properties', jsonb_build_object(
                    'osm_id', fgb_data.osm_id,
                    'tags', fgb_data.tags,
                    'version', fgb_data.version,
                    'changeset', fgb_data.changeset,
                    'timestamp', fgb_data.timestamp
                )::jsonb
            ) AS feature
            FROM (
                SELECT
                    geom,
                    osm_id,
                    tags,
                    version,
                    changeset,
                    timestamp
                FROM ST_FromFlatGeobuf(null::temp_fgb, :fgb_bytes)
            ) AS fgb_data
        ) AS features;
    """
    )

    try:
        result = db.execute(sql, {"fgb_bytes": flatgeobuf})
        feature_collection = result.first()
    except ProgrammingError as e:
        log.error(e)
        log.error(
            "Attempted flatgeobuf --> geojson conversion failed. "
            "Perhaps there is a duplicate 'id' column?"
        )
        return None

    if feature_collection:
        return geojson.loads(json.dumps(feature_collection[0]))

    return None


async def split_geojson_by_task_areas(
    db: Session,
    featcol: geojson.FeatureCollection,
    project_id: int,
) -> Optional[dict[int, geojson.FeatureCollection]]:
    """Split GeoJSON into tagged task area GeoJSONs.

    NOTE inserts feature.properties.osm_id as feature.id for each feature.
    NOTE ST_Within used on polygon centroids to correctly capture the geoms per task.

    Args:
        db (Session): SQLAlchemy db session.
        featcol (bytes): Data extract feature collection.
        project_id (int): The project ID for associated tasks.

    Returns:
        dict[int, geojson.FeatureCollection]: {task_id: FeatureCollection} mapping.
    """
    sql = text(
        """
        -- Drop table if already exists
        DROP TABLE IF EXISTS temp_features CASCADE;

        -- Create a temporary table to store the parsed GeoJSON features
        CREATE TEMP TABLE temp_features (
            id VARCHAR,
            geometry GEOMETRY,
            properties JSONB
        );

        -- Insert parsed geometries and properties into the temporary table
        INSERT INTO temp_features (id, geometry, properties)
        SELECT
            (feature->'properties'->>'osm_id')::VARCHAR AS id,
            ST_SetSRID(ST_GeomFromGeoJSON(feature->>'geometry'), 4326) AS geometry,
            jsonb_set(
                jsonb_set(
                    jsonb_set(
                        feature->'properties',
                        '{task_id}', to_jsonb(tasks.id), true
                    ),
                    '{project_id}', to_jsonb(tasks.project_id), true
                ),
                '{title}', to_jsonb(CONCAT(
                    'project_',
                    :project_id,
                    '_task_',
                    tasks.id
                )), true
            ) AS properties
        FROM (
            SELECT jsonb_array_elements(CAST(:geojson_featcol AS jsonb)->'features')
            AS feature
        ) AS features
        CROSS JOIN tasks
        WHERE tasks.project_id = :project_id;

        -- Retrieve task outlines based on the provided project_id
        SELECT
            tasks.id AS task_id,
            jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(feature)
            ) AS task_features
        FROM
            tasks
        LEFT JOIN LATERAL (
            SELECT
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(temp_features.geometry)::jsonb,
                    'id', temp_features.id,
                    'properties', temp_features.properties
                ) AS feature
            FROM (
                SELECT DISTINCT ON (geometry)
                    id,
                    geometry,
                    properties
                FROM temp_features
            ) AS temp_features
            WHERE
                ST_Within(ST_Centroid(temp_features.geometry), tasks.outline)
        ) AS feature ON true
        WHERE
            tasks.project_id = :project_id
        GROUP BY
            tasks.id;
        """
    )

    try:
        result = db.execute(
            sql,
            {
                "geojson_featcol": json.dumps(featcol),
                "project_id": project_id,
            },
        )
        feature_collections = result.all()

    except ProgrammingError as e:
        log.error(e)
        log.error("Attempted geojson task splitting failed")
        return None

    if feature_collections:
        task_geojson_dict = {
            record[0]: geojson.loads(json.dumps(record[1]))
            for record in feature_collections
        }
        return task_geojson_dict

    return None


def add_required_geojson_properties(
    geojson: geojson.FeatureCollection,
) -> geojson.FeatureCollection:
    """Add required geojson properties if not present.

    This step is required prior to flatgeobuf generation,
    else the workflows of conversion between the formats will fail.
    """
    for feature in geojson.get("features", []):
        properties = feature.get("properties", {})

        # The top level id is defined, set to osm_id
        if feature_id := feature.get("id"):
            properties["osm_id"] = feature_id

        # Check for id type embedded in properties
        if properties.get("osm_id"):
            # osm_id exists already, skip
            pass
        else:
            if prop_id := properties.get("id"):
                # id is nested in properties, use that
                feature["id"] = prop_id
                properties["osm_id"] = prop_id
            elif fid := properties.get("fid"):
                # The default from QGIS
                feature["id"] = fid
                properties["osm_id"] = fid
            else:
                # Random id
                # NOTE 32-bit int is max supported by standard postgres Integer
                random_id = getrandbits(30)
                feature["id"] = random_id
                properties["osm_id"] = random_id

        # Other required fields
        if not properties.get("tags"):
            properties["tags"] = ""
        if not properties.get("version"):
            properties["version"] = 1
        if not properties.get("changeset"):
            properties["changeset"] = 1
        if not properties.get("timestamp"):
            properties["timestamp"] = timestamp().strftime("%Y-%m-%dT%H:%M:%S")

    return geojson


def parse_and_filter_geojson(
    geojson_raw: Union[str, bytes], filter: bool = True
) -> Optional[geojson.FeatureCollection]:
    """Parse geojson string and filter out incomaptible geometries."""
    geojson_parsed = geojson.loads(geojson_raw)

    if isinstance(geojson_parsed, geojson.FeatureCollection):
        log.debug("Already in FeatureCollection format, skipping reparse")
        featcol = geojson_parsed
    elif isinstance(geojson_parsed, geojson.Feature):
        log.debug("Converting Feature to FeatureCollection")
        featcol = geojson.FeatureCollection(features=[geojson_parsed])
    else:
        log.debug("Converting Geometry to FeatureCollection")
        featcol = geojson.FeatureCollection(
            features=[geojson.Feature(geometry=geojson_parsed)]
        )

    # Exit early if no geoms
    if not (features := featcol.get("features", [])):
        return None

    # Strip out GeometryCollection wrappers
    for feat in features:
        geom = feat.get("geometry")
        if (
            geom.get("type") == "GeometryCollection"
            and len(geom.get("geometries")) == 1
        ):
            feat["geometry"] = geom.get("geometries")[0]

    # Return unfiltered featcol
    if not filter:
        return featcol

    # Filter out geoms not matching main type
    geom_type = get_featcol_main_geom_type(featcol)
    features_filtered = [
        feature
        for feature in features
        if feature.get("geometry", {}).get("type", "") == geom_type
    ]

    return geojson.FeatureCollection(features_filtered)


def get_featcol_main_geom_type(featcol: geojson.FeatureCollection) -> str:
    """Get the predominant geometry type in a FeatureCollection."""
    geometry_counts = {"Polygon": 0, "Point": 0, "Polyline": 0}

    for feature in featcol.get("features", []):
        geometry_type = feature.get("geometry", {}).get("type", "")
        if geometry_type in geometry_counts:
            geometry_counts[geometry_type] += 1

    return max(geometry_counts, key=geometry_counts.get)


async def check_crs(input_geojson: Union[dict, geojson.FeatureCollection]):
    """Validate CRS is valid for a geojson."""
    log.debug("validating coordinate reference system")

    def is_valid_crs(crs_name):
        valid_crs_list = [
            "urn:ogc:def:crs:OGC:1.3:CRS84",
            "urn:ogc:def:crs:EPSG::4326",
            "WGS 84",
        ]
        return crs_name in valid_crs_list

    def is_valid_coordinate(coord):
        if coord is None:
            return False
        return -180 <= coord[0] <= 180 and -90 <= coord[1] <= 90

    error_message = (
        "ERROR: Unsupported coordinate system, it is recommended to use a "
        "GeoJSON file in WGS84(EPSG 4326) standard."
    )
    if "crs" in input_geojson:
        crs = input_geojson.get("crs", {}).get("properties", {}).get("name")
        if not is_valid_crs(crs):
            log.error(error_message)
            raise HTTPException(status_code=400, detail=error_message)
        return

    if (input_geojson_type := input_geojson.get("type")) == "FeatureCollection":
        features = input_geojson.get("features", [])
        coordinates = (
            features[-1].get("geometry", {}).get("coordinates", []) if features else []
        )
    elif input_geojson_type == "Feature":
        coordinates = input_geojson.get("geometry", {}).get("coordinates", [])
    else:
        coordinates = input_geojson.get("coordinates", {})

    first_coordinate = None
    if coordinates:
        while isinstance(coordinates, list):
            first_coordinate = coordinates
            coordinates = coordinates[0]

    if not is_valid_coordinate(first_coordinate):
        log.error(error_message)
        raise HTTPException(status_code=400, detail=error_message)


def get_address_from_lat_lon(latitude, longitude):
    """Get address using Nominatim, using lat,lon."""
    base_url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "format": "json",
        "lat": latitude,
        "lon": longitude,
        "zoom": 18,
    }
    headers = {"Accept-Language": "en"}  # Set the language to English

    log.debug("Getting Nominatim address from project centroid")
    response = requests.get(base_url, params=params, headers=headers)
    if (status_code := response.status_code) != 200:
        log.error(f"Getting address string failed: {status_code}")
        return None

    data = response.json()
    log.debug(f"Nominatim response: {data}")

    address = data.get("address", None)
    if not address:
        log.error(f"Getting address string failed: {status_code}")
        return None

    country = address.get("country", "")
    city = address.get("city", "")

    address_str = f"{city},{country}"

    if not address_str or address_str == ",":
        log.error("Getting address string failed")
        return None

    return address_str


async def get_address_from_lat_lon_async(latitude, longitude):
    """Async wrapper for get_address_from_lat_lon."""
    return get_address_from_lat_lon(latitude, longitude)


async def geojson_to_javarosa_geom(geojson_geometry: dict) -> str:
    """Convert a GeoJSON Polygon geometry to JavaRosa format string.

    This format is unique to ODK and the JavaRosa XForm processing library.
    Example JavaRosa polygon (semicolon separated):
    -8.38071535576881 115.640801902838 0.0 0.0;
    -8.38074220774489 115.640848633963 0.0 0.0;
    -8.38080128208577 115.640815355738 0.0 0.0;
    -8.38077407987063 115.640767444534 0.0 0.0;
    -8.38071535576881 115.640801902838 0.0 0.0

    Args:
        geojson_geometry (dict): The geojson polygon geom.

    Returns:
        str: A string representing the geometry in JavaRosa format.
    """
    # Ensure the GeoJSON geometry is of type Polygon
    # FIXME support other geom types
    if geojson_geometry["type"] != "Polygon":
        raise ValueError("Input must be a GeoJSON Polygon")

    coordinates = geojson_geometry["coordinates"][
        0
    ]  # Extract the coordinates of the Polygon
    javarosa_geometry = []

    for coordinate in coordinates:
        lon, lat = coordinate[:2]
        javarosa_geometry.append(f"{lat} {lon} 0.0 0.0")

    javarosa_geometry_string = ";".join(javarosa_geometry)

    return javarosa_geometry_string


async def get_entity_dicts_from_task_geojson(
    project_id: int,
    task_id: int,
    task_data_extract: FeatureCollection,
) -> dict:
    """Get a dictionary of Entity info mapped from task geojsons."""
    id_properties_dict = {}

    features = task_data_extract.get("features", [])
    for feature in features:
        geometry = feature.get("geometry")
        javarosa_geom = await geojson_to_javarosa_geom(geometry)

        properties = feature.get("properties", {})
        osm_id = properties.get("osm_id", getrandbits(30))
        tags = properties.get("tags")
        version = properties.get("version")
        changeset = properties.get("changeset")
        timestamp = properties.get("timestamp")

        # Must be string values to work with Entities
        id_properties_dict[osm_id] = {
            "project_id": str(project_id),
            "task_id": str(task_id),
            "geometry": javarosa_geom,
            "tags": str(tags),
            "version": str(version),
            "changeset": str(changeset),
            "timestamp": str(timestamp),
        }

    return id_properties_dict
