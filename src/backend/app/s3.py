"""Initialise the S3 buckets for FMTM to function."""

import json
import sys
from io import BytesIO
from typing import Any

from fastapi import HTTPException
from loguru import logger as log
from minio import Minio
from minio.commonconfig import CopySource
from minio.deleteobjects import DeleteObject
from minio.error import S3Error

from app.config import settings
from app.db.enums import HTTPStatus


def s3_client():
    """Return the initialised S3 client with credentials."""
    minio_url, is_secure = is_connection_secure(settings.S3_ENDPOINT)

    log.debug("Connecting to Minio S3 server")
    return Minio(
        minio_url,
        settings.S3_ACCESS_KEY,
        settings.S3_SECRET_KEY,
        secure=is_secure,
    )
    # For AWS Instance Profile usage, but doesn't seem to work...
    # from minio.credentials import IamAwsProvider
    # return Minio(
    #     "s3.amazonaws.com",
    #     secure=True,
    #     credentials=IamAwsProvider()
    # )
    # NOTE however this seems to generate creds without issue
    # provider = IamAwsProvider()
    # creds = provider.retrieve()
    # print(creds.access_key)
    # print(creds.secret_key)


def object_exists(bucket_name: str, s3_path: str) -> bool:
    """Check if an object exists in an S3 bucket using stat_object.

    Args:
        bucket_name (str): The name of the S3 bucket.
        s3_path (str): The path of the object in the S3 bucket.

    Returns:
        bool: True if the object exists, False otherwise.
    """
    client = s3_client()

    try:
        # stat_object will return metadata if the object exists
        client.stat_object(bucket_name, s3_path)
        return True
    except S3Error as e:
        if e.code == "NoSuchKey":
            return False
        else:
            # Handle other exceptions
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST, detail=str(e)
            ) from e


def add_file_to_bucket(bucket_name: str, file_path: str, s3_path: str):
    """Upload a file from the filesystem to an S3 bucket.

    Args:
        bucket_name (str): The name of the S3 bucket.
        file_path (str): The path to the file on the local filesystem.
        s3_path (str): The path in the S3 bucket where the file will be stored.
    """
    # Ensure s3_path starts with a forward slash
    if not s3_path.startswith("/"):
        s3_path = f"/{s3_path}"

    client = s3_client()
    client.fput_object(bucket_name, file_path, s3_path)


def add_obj_to_bucket(
    bucket_name: str,
    file_obj: BytesIO,
    s3_path: str,
    content_type: str = "application/octet-stream",
    **kwargs: dict[str, Any],
):
    """Upload a BytesIO object to an S3 bucket.

    Args:
        bucket_name (str): The name of the S3 bucket.
        file_obj (BytesIO): A BytesIO object containing the data to be uploaded.
        s3_path (str): The path in the S3 bucket where the data will be stored.
        content_type (str, optional): The content type of the uploaded file.
            Default application/octet-stream.
        kwargs (dict[str, Any]): Any other arguments to pass to client.put_object.

    """
    # Strip "/" from start of s3_path (not required by put_object)
    if s3_path.startswith("/"):
        s3_path = s3_path.lstrip("/")

    client = s3_client()
    # Set BytesIO object to start, prior to .read()
    file_obj.seek(0)

    result = client.put_object(
        bucket_name, s3_path, file_obj, file_obj.getbuffer().nbytes, **kwargs
    )
    log.debug(
        f"Created {result.object_name} object; etag: {result.etag}, "
        f"version-id: {result.version_id}"
    )


def get_file_from_bucket(bucket_name: str, s3_path: str, file_path: str):
    """Download a file from an S3 bucket and save it to the local filesystem.

    Args:
        bucket_name (str): The name of the S3 bucket.
        s3_path (str): The path to the file in the S3 bucket.
        file_path (str): The path on the local filesystem where the S3
            file will be saved.
    """
    # Ensure s3_path starts with a forward slash
    if not s3_path.startswith("/"):
        s3_path = f"/{s3_path}"

    client = s3_client()
    client.fget_object(bucket_name, s3_path, file_path)


def get_obj_from_bucket(bucket_name: str, s3_path: str) -> BytesIO:
    """Download an S3 object from a bucket and return it as a BytesIO object.

    Args:
        bucket_name (str): The name of the S3 bucket.
        s3_path (str): The path to the S3 object in the bucket.

    Returns:
        BytesIO: A BytesIO object containing the content of the downloaded S3 object.
    """
    # Ensure s3_path starts with a forward slash
    if not s3_path.startswith("/"):
        s3_path = f"/{s3_path}"

    client = s3_client()
    response = None
    try:
        response = client.get_object(bucket_name, s3_path)
        return BytesIO(response.read())
    except Exception as e:
        log.warning(f"Failed attempted download from S3 path: {s3_path}")
        raise ValueError(str(e)) from e
    finally:
        if response:
            response.close()
            response.release_conn()


def copy_obj_bucket_to_bucket(
    source_bucket: str, source_path: str, dest_bucket: str, dest_path: str
) -> bool:
    """Copy an object from one bucket to another, without downloading.

    Occurs entirely on the server side.
    The buckets must be hosted in the same Minio instance.

    Args:
        source_bucket (str): The name of the source S3 bucket.
        source_path (str): The path to the source S3 object in the source bucket.
        dest_bucket (str): The name of the destination S3 bucket.
        dest_path (str): The path to the destination S3 object
            in the destination bucket.

    Returns:
        bool: True if the object was successfully copied, False if there was a failure.
    """
    client = s3_client()

    try:
        log.info(
            f"Copying {source_path} from bucket {source_bucket} "
            f"to {dest_path} on bucket {dest_bucket}"
        )
        client.copy_object(
            dest_bucket,
            dest_path,
            CopySource(source_bucket, source_path),
        )

    except Exception as e:
        log.exception(e)
        log.error(f"Failed to copy object {source_path} to new bucket: {dest_bucket}")
        return False

    return True


def delete_all_objs_under_prefix(bucket_name: str, s3_path: str) -> bool:
    """Delete all objects under a certain path.

    For example, delete all items in a project folder.

    Args:
        bucket_name (str): The name of the S3 bucket.
        s3_path (str): The path to for which everything will be deleted recursively.

    Returns:
        bool: True if the objects were successfully deleted.
    """
    # Strip "/" from start of s3_path (not required for delete object)
    if s3_path.startswith("/"):
        s3_path = s3_path.lstrip("/")
    # However, we should append a tailing slash
    if not s3_path.endswith("/"):
        s3_path = f"{s3_path}/"

    client = s3_client()

    try:
        log.info(f"Deleting all items for bucket ({bucket_name}) under path: {s3_path}")
        # Get all objects under path, recursively
        objects = list(client.list_objects(bucket_name, s3_path, recursive=True))
        delete_object_list = [DeleteObject(obj.object_name) for obj in objects]
        log.debug(f"S3 items to delete: {[obj.object_name for obj in objects]}")

        errors = client.remove_objects(bucket_name, delete_object_list)
        for error in errors:
            log.error(f"Error during deletion: {error}")
        if errors:
            return False

    except Exception as e:
        log.exception(e)
        log.error(
            f"Failed to delete bucket ({bucket_name}) files under path: {s3_path}"
        )
        return False

    log.debug("Successfully deleted S3 objects")
    return True


def create_bucket_if_not_exists(client: Minio, bucket_name: str, is_public: bool):
    """Checks if a bucket exits, else creates it."""
    if not client.bucket_exists(bucket_name):
        log.info(f"Creating S3 bucket: {bucket_name}")
        client.make_bucket(bucket_name)
        if is_public:
            log.info("Setting public (anonymous) download policy")
            policy = policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
                        "Resource": f"arn:aws:s3:::{bucket_name}",
                    },
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{bucket_name}/*",
                    },
                ],
            }
            client.set_bucket_policy(bucket_name, json.dumps(policy))
    else:
        log.debug(f"S3 bucket already exists: {bucket_name}")


def is_connection_secure(minio_url: str):
    """Determine from URL string if is http or https."""
    if minio_url.startswith("http://"):
        secure = False
        stripped_url = minio_url[len("http://") :]
        log.warning("S3 URL is insecure (ignore if on devserver)")

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


def startup_init_buckets():
    """Wrapper to create defined buckets at startup."""
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

    # Init S3 Buckets
    client = s3_client()
    create_bucket_if_not_exists(client, settings.S3_BUCKET_NAME, is_public=True)


if __name__ == "__main__":
    startup_init_buckets()
