#!/bin/bash

# Certs init image
docker build nginx --no-cache \
    --tag "ghcr.io/hotosm/fmtm/certs-init:latest" \
    --target certs-init \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/certs-init:latest"
fi

# Development proxy
docker build nginx --no-cache \
    --tag "ghcr.io/hotosm/fmtm/proxy:development" \
    --target all \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/proxy:development"
fi

# Staging proxy
docker tag "ghcr.io/hotosm/fmtm/proxy:development" \
    "ghcr.io/hotosm/fmtm/proxy:staging"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/proxy:staging"
fi

# Main proxy
docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/proxy:main" \
    --target api-only \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/proxy:main"
fi
