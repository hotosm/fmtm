#!/bin/bash

set -euo pipefail

# Prompt the user for input and set the BRANCH_NAME variable
read -p "Enter the environment (dev/staging/prod): " ENVIRONMENT

case "$ENVIRONMENT" in
    dev)
        BRANCH_NAME="development"
        ;;
    staging)
        BRANCH_NAME="staging"
        ;;
    prod)
        BRANCH_NAME="main"
        ;;
    *)
        echo "Invalid environment. Please enter dev, staging, or prod."
        exit 1
        ;;
esac

# Check if any containers using the 'ghcr.io/hotosm/fmtm/proxy:${BRANCH_NAME}' image are running
if [[ -z $(docker ps -q -f "ancestor=ghcr.io/hotosm/fmtm/proxy:${BRANCH_NAME}") ]]; then
    echo "No containers using the 'ghcr.io/hotosm/fmtm/proxy:${BRANCH_NAME}' image are running."
    echo "You must first start the containers using:"
    echo
    echo "docker-compose -f docker-compose.${BRANCH_NAME}.yml up -d"
    echo
    exit 1
fi

# Execute the Docker Compose command with the determined BRANCH_NAME
docker compose exec "fmtm-$BRANCH_NAME" certbot --non-interactive renew
