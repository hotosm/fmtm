# Importing necessary libraries for defining a function and data types
from typing import Union
from fastapi import Header
from osm_login_python.core import Auth
from pydantic import BaseModel

# Importing configuration settings
from ..config import settings

# Defining a Pydantic BaseModel for an authenticated user
class AuthUser(BaseModel):
    id: int
    username: str
    img_url: Union[str, None]

# Defining a function to initialize an OpenStreetMap (OSM) authentication object
def init_osm_auth():
    # Creating an OSM authentication object using configuration settings
    return Auth(
        osm_url=settings.OSM_URL,
        client_id=settings.OSM_CLIENT_ID,
        client_secret=settings.OSM_CLIENT_SECRET,
        secret_key=settings.OSM_SECRET_KEY,
        login_redirect_uri=settings.OSM_LOGIN_REDIRECT_URI,
        scope=settings.OSM_SCOPE,
    )

# Defining a function to check if a user is logged in by verifying an access token
def login_required(access_token: str = Header(...)):
    # Initializing the OSM authentication object
    osm_auth = init_osm_auth()
    # Verifying the access token using the OSM authentication object
    return osm_auth.deserialize_access_token(access_token)

