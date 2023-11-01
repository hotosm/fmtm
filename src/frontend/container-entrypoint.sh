#!/bin/sh

set -e

# Copy frontend to attached volume
rclone sync /app /frontend

# Successful exit (stop container)
exit 0
