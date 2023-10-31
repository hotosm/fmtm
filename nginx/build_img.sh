#!/bin/bash

docker build nginx --no-cache \
    --tag "ghcr.io/hotosm/fmtm/certs-init:latest" \
    --target certs-init \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/certs-init:latest"
fi

docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/certs-init-all:latest" \
    --target certs-init-all \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

if [[ -n "$PUSH_IMGS" ]]; then
    docker push "ghcr.io/hotosm/fmtm/certs-init-all:latest"
fi
