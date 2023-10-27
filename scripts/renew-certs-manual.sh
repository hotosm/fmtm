#!/bin/bash

set -euo pipefail

docker compose exec proxy certbot renew
