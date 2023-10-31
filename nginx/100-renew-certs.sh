#!/bin/bash

set -euo pipefail

echo
echo "Substituing env vars"
echo
bash /docker-entrypoint.d/20-envsubst-on-templates.sh

echo
echo "Starting NGINX in the background"
echo
nginx -g "daemon off;" > /dev/null 2>&1 &

# Wait for NGINX to start with a maximum timeout of 20 seconds
timeout=20
while [ $timeout -gt 0 ]; do
    if nc -z localhost 80; then
        break
    fi

    echo ""
    echo "Waiting for NGINX to be running..."
    sleep 2
    timeout=$((timeout - 2))
done

# Check if the timeout was reached
if [ $timeout -eq 0 ]; then
  echo "NGINX did not start within the timeout."
  exit 1
fi

# Renew certs
certbot_args=("--webroot" "--webroot-path=/var/www/certbot" \
    "--email" "${CERT_EMAIL}" "--non-interactive", "--agree-tos" "--no-eff-email")

# Check if FMTM_DOMAIN is set
if [ -n "${FMTM_DOMAIN}" ]; then
    certbot_args+=("-d" "${FMTM_DOMAIN}")
fi

# Check if FMTM_API_DOMAIN is set
if [ -n "${FMTM_API_DOMAIN}" ]; then
    certbot_args+=("-d" "${FMTM_API_DOMAIN}")
fi

# Check if FMTM_ODK_DOMAIN is set
if [ -n "${FMTM_ODK_DOMAIN}" ]; then
    certbot_args+=("-d" "${FMTM_ODK_DOMAIN}")
fi

# Check if FMTM_S3_DOMAIN is set
if [ -n "${FMTM_S3_DOMAIN}" ]; then
    certbot_args+=("-d" "${FMTM_S3_DOMAIN}")
fi

# Run certbot with the constructed arguments
certbot certonly "${certbot_args[@]}"

# Successful exit (stop container)
exit 0
