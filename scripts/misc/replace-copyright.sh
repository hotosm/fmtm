#!/bin/bash

# Root directory of your repo
REPO_DIR="."

# Pattern to match and clean
REGEX='Copyright \(c\)[^H]*Humanitarian OpenStreetMap Team'

# Find all regular files (excluding binary files)
find "$REPO_DIR" -type f -exec grep -Il 'Copyright (c)' {} \; | while read -r file; do
    echo "Updating: $file"

    # Use sed to replace matching lines
    sed -i -E \
        "s/$REGEX/Copyright (c) Humanitarian OpenStreetMap Team/" "$file"
done
