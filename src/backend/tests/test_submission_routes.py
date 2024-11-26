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
"""Tests for submission routes."""

import pytest


async def test_read_submissions(client, submission):
    """Test get submissions with a single submission expected."""
    odk_project = submission["project"]
    submission_data = submission["submission_data"]

    response = await client.get(f"/submission?project_id={odk_project.id}")
    assert response.status_code == 200, f"Failed to fetch submissions: {response.text}"

    submission_list = response.json()
    assert isinstance(submission_list, list), "Expected a list of submissions"

    first_submission = submission_list[0]
    test_instance_id = submission_data["instanceId"]
    assert first_submission["__id"] == test_instance_id, "Instance ID mismatch"
    assert (
        first_submission["meta"]["instanceID"] == test_instance_id
    ), "Meta instanceID mismatch"
    assert first_submission["__system"]["submitterId"] == str(
        submission_data["submitterId"]
    ), "Submitter ID mismatch"


if __name__ == "__main__":
    """Main func if file invoked directly."""
    pytest.main()
