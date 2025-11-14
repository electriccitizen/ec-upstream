#!/usr/bin/env python3
"""Convert the Natural Earth country shapefile to GeoJSON."""

from __future__ import annotations

import argparse
import json
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

import shapefile  # type: ignore

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPO_ROOT / "natural-earth-countries" / "ne_10m_admin_0_countries.shp"
DEFAULT_OUTPUT = (
    REPO_ROOT
    / "web"
    / "modules"
    / "custom"
    / "citizen_custom"
    / "data"
    / "natural_earth_countries.geojson"
)


def _coerce_value(value: Any) -> Any:
    """Make sure every shapefile attribute serializes cleanly."""
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="ignore")
    return value


def convert(
    source: Path,
    destination: Path,
    *,
    indent: Optional[int] = None,
) -> None:
    reader = shapefile.Reader(str(source))
    fields = [meta[0] for meta in reader.fields if meta[0] != "DeletionFlag"]
    features = []

    for record in reader.iterShapeRecords():
        properties = {
            field_name: _coerce_value(record.record[index])
            for index, field_name in enumerate(fields)
        }
        features.append(
            {
                "type": "Feature",
                "properties": properties,
                "geometry": record.shape.__geo_interface__,
            }
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps(
            {"type": "FeatureCollection", "features": features},
            indent=indent,
            ensure_ascii=False,
            separators=(",", ":") if indent is None else None,
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"Defaults to {DEFAULT_SOURCE.relative_to(REPO_ROOT)}",
    )
    parser.add_argument(
        "--destination",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Defaults to {DEFAULT_OUTPUT.relative_to(REPO_ROOT)}",
    )
    parser.add_argument(
        "--indent",
        type=int,
        default=None,
        help="Pretty-print JSON output. Defaults to a compact single-line file.",
    )
    args = parser.parse_args()

    convert(args.source, args.destination, indent=args.indent)
