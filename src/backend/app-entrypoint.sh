#!/bin/bash

set -eo pipefail

wait_for_db() {
    max_retries=30
    retry_interval=5

    for ((i = 0; i < max_retries; i++)); do
        if </dev/tcp/${FMTM_DB_HOST:-fmtm-db}/5432; then
            echo "Database is available."
            return 0  # Database is available, exit successfully
        fi
        echo "Database is not yet available. Retrying in ${retry_interval} seconds..."
        sleep ${retry_interval}
    done

    echo "Timed out waiting for the database to become available."
    exit 1  # Exit with an error code
}

wait_for_s3() {
    max_retries=30
    retry_interval=5

    for ((i = 0; i < max_retries; i++)); do
        if curl --silent -I ${S3_ENDPOINT} >/dev/null; then
            echo "S3 is available."
            return 0  # S3 is available, exit successfully
        fi
        echo "S3 is not yet available. Retrying in ${retry_interval} seconds..."
        sleep ${retry_interval}
    done

    echo "Timed out waiting for S3 to become available."
    exit 1  # Exit with an error code
}

create_s3_buckets() {
    echo "Running init_s3_buckets.py script"
    python /opt/app/init_s3_buckets.py
}

# Start wait in background with tmp log files
wait_for_db &
wait_for_s3 &
# Wait until checks complete
wait

create_s3_buckets
exec "$@"
