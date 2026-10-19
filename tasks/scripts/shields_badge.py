"""Write a shields.io endpoint badge from a coverage.py JSON report.

Usage: python3 shields_badge.py coverage.json badge.json
"""

import json
import sys

COLORS = ((90, "brightgreen"), (80, "green"), (70, "yellowgreen"), (50, "orange"))

report_path, badge_path = sys.argv[1:]
with open(report_path) as report:
    percent = round(json.load(report)["totals"]["percent_covered"])
color = next((color for limit, color in COLORS if percent >= limit), "red")

with open(badge_path, "w") as badge:
    json.dump(
        {
            "schemaVersion": 1,
            "label": "coverage",
            "message": f"{percent}%",
            "color": color,
        },
        badge,
    )
