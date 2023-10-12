"""Initialise the S3 buckets for FMTM to function."""

import sys

from loguru import logger as log
from minio import Minio

from app.config import settings

# Logging
log.remove()
log.add(
    sys.stderr,
    level=settings.LOG_LEVEL,
    format=(
        "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} "
        "| {name}:{function}:{line} | {message}"
    ),
    colorize=True,
    backtrace=True,  # More detailed tracebacks
    catch=True,  # Prevent app crashes
)


def create_bucket_if_not_exists(client: Minio, bucket_name: str):
    """Checks if a bucket exits, else creates it."""
    if not client.bucket_exists(bucket_name):
        log.info(f"Creating S3 bucket: {bucket_name}")
        client.make_bucket(bucket_name)
    else:
        log.debug(f"S3 bucket already exists: {bucket_name}")


def is_connection_secure(minio_url: str):
    """Determine from URL string if is http or https."""
    if minio_url.startswith("http://"):
        secure = False
        stripped_url = minio_url[len("http://") :]

    elif minio_url.startswith("https://"):
        secure = True
        stripped_url = minio_url[len("https://") :]

    else:
        err = (
            "The S3_ENDPOINT is set incorrectly. "
            "It must start with http:// or https://"
        )
        log.error(err)
        raise ValueError(err)

    return stripped_url, secure


# Init S3 Buckets
log.debug("Determining if S3 is http or https")
minio_url, is_secure = is_connection_secure(settings.S3_ENDPOINT)

log.debug("Connecting to Minio S3 server")
client = Minio(
    minio_url,
    settings.S3_ACCESS_KEY,
    settings.S3_SECRET_KEY,
    secure=is_secure,
)

create_bucket_if_not_exists(client, settings.S3_BUCKET_NAME_BASEMAPS)
create_bucket_if_not_exists(client, settings.S3_BUCKET_NAME_OVERLAYS)
