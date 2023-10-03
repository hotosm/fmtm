#!/bin/bash

set -eo pipefail

while !</dev/tcp/${FMTM_DB_HOST:-fmtm-db}/5432;
do
    sleep 1;
done;

# Check all vars present
if [ -z "${FMTM_DB_HOST}" ]; then
    echo "Environment variable FMTM_DB_HOST is not set."
    exit 1
fi
if [ -z "${FMTM_DB_USER}" ]; then
    echo "Environment variable FMTM_DB_USER is not set."
    exit 1
fi
if [ -z "${FMTM_DB_PASSWORD}" ]; then
    echo "Environment variable FMTM_DB_PASSWORD is not set."
    exit 1
fi
if [ -z "${FMTM_DB_NAME}" ]; then
    echo "Environment variable FMTM_DB_NAME is not set."
    exit 1
fi

# Create default svc user
psql "postgresql://${FMTM_DB_USER}:${FMTM_DB_PASSWORD}@${FMTM_DB_HOST}/${FMTM_DB_NAME}" \
    -c "INSERT INTO users (id, username, role) \
        VALUES (20386219, 'svcfmtm', 'MAPPER') \
        ON CONFLICT (id) DO NOTHING;"

exec "$@"
