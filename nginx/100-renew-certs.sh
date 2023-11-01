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

# Check if FMTM_DOMAIN is set
if [ -z "${FMTM_DOMAIN}" ]; then
    echo "${FMTM_DOMAIN} variable is not set. Exiting."
    exit 1
fi

# Check if FMTM_API_DOMAIN is set
if [ -z "${FMTM_API_DOMAIN}" ]; then
    echo "${FMTM_API_DOMAIN} variable is not set. Exiting."
    exit 1
fi

# Renew certs (default api & frontend)
certbot_args=(
    "--webroot" "--webroot-path=/var/www/certbot" \
    "--email" "${CERT_EMAIL}" "--agree-tos" "--no-eff-email" \
    "-d" "${FMTM_DOMAIN}" "-d" "${FMTM_API_DOMAIN}" \
)

# Run certbot with the constructed arguments
echo "Running command: certbot --non-interactive certonly ${certbot_args[@]} $@"
certbot --non-interactive certonly "${certbot_args[@]} $@"
echo "Certificates generated under: /etc/letsencrypt/live/${FMTM_DOMAIN}/"

# Successful exit (stop container)
exit 0
