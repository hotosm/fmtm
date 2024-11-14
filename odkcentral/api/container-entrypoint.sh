#!/bin/bash

set -eo pipefail

check_all_s3_vars_present() {
    if [ -z "${S3_ENDPOINT}" ]; then
        echo "Environment variable S3_ENDPOINT is not set."
        exit 1
    fi
    if [ -z "${S3_ACCESS_KEY}" ]; then
        echo "Environment variable S3_ACCESS_KEY is not set."
        exit 1
    fi
    if [ -z "${S3_SECRET_KEY}" ]; then
        echo "Environment variable S3_SECRET_KEY is not set."
        exit 1
    fi
    if [ -z "${S3_ODK_BUCKET_NAME}" ]; then
        echo "Environment variable S3_ODK_BUCKET_NAME is not set."
        exit 1
    fi

    # Strip any extra unrequired "quotes"
    export S3_ENDPOINT="${S3_ENDPOINT//\"/}"
    export S3_ACCESS_KEY="${S3_ACCESS_KEY//\"/}"
    export S3_SECRET_KEY="${S3_SECRET_KEY//\"/}"
    export S3_ODK_BUCKET_NAME="${S3_ODK_BUCKET_NAME//\"/}"
}

# Check env vars + strip extra quotes on vars
check_all_s3_vars_present

# Wait for database to be available
wait-for-it "${CENTRAL_DB_HOST:-central-db}:5432"

### Init, generate config, migrate db ###
echo "Stripping pm2 exec command from start-odk.sh script (last 2 lines)"
head -n -2 ./start-odk.sh > ./init-odk-db.sh
chmod +x ./init-odk-db.sh

echo "Running ODKCentral start script to init environment and migrate DB"
echo "The server will not start on this run"
./init-odk-db.sh

### Create admin user ###
echo "Creating test user ${SYSADMIN_EMAIL} with password ***${SYSADMIN_PASSWD: -3}"
echo "${SYSADMIN_PASSWD}" | odk-cmd --email "${SYSADMIN_EMAIL}" user-create || true

echo "Elevating user to admin"
odk-cmd --email "${SYSADMIN_EMAIL}" user-promote || true

### Create S3 bucket for submission photo storage ###
BUCKET_NAME="${S3_ODK_BUCKET_NAME}"
echo "Creating S3 bucket ${BUCKET_NAME} to store submission media"
mc alias set s3 "$S3_ENDPOINT" "$S3_ACCESS_KEY" "$S3_SECRET_KEY"
mc mb "s3/${BUCKET_NAME}" --ignore-existing
mc anonymous set download "s3/${BUCKET_NAME}"

### Run server (hardcode WORKER_COUNT=1 for dev) ###
export WORKER_COUNT=1
echo "Starting server."
exec npx pm2-runtime ./pm2.config.js
