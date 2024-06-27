# Copyright (c) 2022, 2023 Humanitarian OpenStreetMap Team
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
"""Tests for auth routes."""

from contextlib import contextmanager

import pytest

from app.config import settings


@contextmanager
def override_settings(**new_settings):
    """Context manager to temporarily override global settings."""
    old_settings = {}
    for key, value in new_settings.items():
        old_settings[key] = getattr(settings, key)
        setattr(settings, key, value)
    try:
        yield
    finally:
        for key, value in old_settings.items():
            setattr(settings, key, value)


def test_correct_credentials(client, access_token):
    """Test check_login endpoint with correct credentials."""
    headers = {"access-token": access_token}

    with override_settings(DEBUG=False):
        response = client.get("/auth/introspect", headers=headers)

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "username": "localadmin",
        "img_url": None,
        "role": 1,
    }


def test_no_credentials(client):
    """Test check_login endpoint without credentials."""
    with override_settings(DEBUG=False):
        response = client.get("/auth/introspect")

    assert response.status_code == 401
    assert response.json() == {"detail": "No access token provided"}


def test_invalid_credentials(client):
    """Test check_login endpoint with invalid credentials."""
    headers = {"access-token": "invalid_token"}
    with override_settings(DEBUG=False):
        response = client.get("/auth/introspect", headers=headers)

    assert response.status_code == 401
    assert response.json() == {"detail": "Access token not valid"}


if __name__ == "__main__":
    pytest.main()
