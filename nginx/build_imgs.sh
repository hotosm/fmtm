#!/bin/bash

# Certs init image
docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/proxy:certs-init" \
    --target certs-init \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/proxy:certs-init"
fi

# Development proxy
docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/proxy:development" \
    --target development \
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
    --target main \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/proxy:main"
fi
