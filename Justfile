# Copyright (c) 2020, 2021 Humanitarian OpenStreetMap Team
#
# This file is part of FMTM.
#
#     FMTM is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     FMTM is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with FMTM.  If not, see <https:#www.gnu.org/licenses/>.
#

# Builds

build-backend:
  docker compose build api

build-frontend:
  docker compose build ui

build: build-backend build-frontend

# Run

run:
  docker compose up -d

run-without-central:
  docker compose --profile no-odk up -d

run-with-josm:
  docker compose \
    -f docker-compose.yml \
    -f josm/docker-compose.yml \
    up -d

# Tests

test-backend:
  docker compose run --rm api pytest

test-frontend:
  docker compose run -e CI=True --rm --entrypoint='sh -c' ui 'npm run test'

test: test-backend test-frontend

# Maintenance

lint:
  TAG_OVERRIDE=ci TARGET_OVERRIDE=ci docker compose run --rm --no-deps \
    --volume $PWD:$PWD --workdir $PWD \
    --entrypoint='sh -c' api \
    'git config --global --add safe.directory $PWD \
    && pre-commit run --all-files'

bump:
  TAG_OVERRIDE=ci TARGET_OVERRIDE=ci docker compose run --rm --no-deps \
    --volume $PWD:$PWD --workdir $PWD \
    --entrypoint='sh -c' api \
    'git config --global --add safe.directory $PWD \
    && git config --global user.name svcfmtm \
    && git config --global user.email fmtm@hotosm.org \
    && cd src/backend \
    && cz bump --check-consistency'
