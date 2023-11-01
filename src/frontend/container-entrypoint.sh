#!/bin/sh

set -e

# Copy frontend to attached volume
echo "Syncing file /app --> /frontend."
rclone sync /app /frontend
echo "Sync done."

# Successful exit (stop container)
exit 0
