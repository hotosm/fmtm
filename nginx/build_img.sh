#!/bin/bash

docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/certs-init:latest" \
    --target api-only-cert-init \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"

docker build nginx \
    --tag "ghcr.io/hotosm/fmtm/certs-init-all:latest" \
    --target all-cert-init \
    --build-arg NGINX_TAG="${NGINX_TAG:-1.25.2}"
