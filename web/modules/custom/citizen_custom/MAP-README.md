# Citizen Custom – Advisories Map Layer

## Overview
The _world countries_ overlay enhances Drupal Geolocation maps with a Natural Earth polygon layer and demographic tooltips that render population, ethnicities, and primary language information per country. The feature is composed of three parts:

1. **Data assets** in `web/modules/custom/citizen_custom/data/`
   - `natural_earth_countries.geojson`: converted Natural Earth Admin 0 boundaries.
   - `countries_demographics.json`: Altoal snapshot-derived demographics keyed by ISO alpha-3 codes.
2. **Scripts** for keeping the data fresh:
   - `scripts/convert_natural_earth_countries.py` converts the `.shp` bundle into the lightweight GeoJSON served to clients (requires `gasparesganga/php-shapefile` and a Python virtualenv; `.venv/` is ignored in git).
   - `data/build_countries_demographics.py` downloads the latest Altoal `snapshots/LATEST` + `metadata` payloads, formats population strings, and extracts the top ethnicities/language.
3. **Runtime integration**
   - `citizen_custom.module` attaches the `world-countries-layer` library, injects default settings + data URLs into `drupalSettings.citizenCustom.worldCountriesLayer`, and merges the demographics JSON at request time.
   - `js/world-countries-layer.js` resolves the dataset URL, builds a Leaflet layer with default styling and hover effects, hydrates tooltip content with demographics, and auto-attaches to Drupal Geolocation maps discovered via configured IDs or selectors.
   - `web/themes/custom/citizen_dart` hooks (`includes/citizen_dart.html.inc` and `templates/geolocation-map-wrapper.html.twig`) ensure the behavior targets the standard `#geoleaflet-map` container and that compiled theme CSS (`components/00-base/mixins/_views-mixins.scss`, `components/03-composites/nodes/advising-center/_advising-center.scss`) styles tooltips and pending demographics displays.

## Refreshing the Data
1. **Set up a Python environment** (optional but recommended):
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements/map-data.txt  # or install requests + pyshp manually
   ```
2. **Update the GeoJSON** (if Natural Earth publishes a new release):
   ```bash
   python scripts/convert_natural_earth_countries.py \
     --source /path/to/ne_10m_admin_0_countries.shp \
     --destination web/modules/custom/citizen_custom/data/natural_earth_countries.geojson
   ```
3. **Regenerate demographics**:
   ```bash
   python web/modules/custom/citizen_custom/data/build_countries_demographics.py
   ```
4. Commit the regenerated JSON assets. The large source shapefiles are intentionally not tracked—only the converted GeoJSON and demographics JSON live in the repo.

## Extending or Reusing the Layer
- Use `Drupal.citizenCustom.worldCountriesLayer.load({ ... })` to attach the overlay to custom maps; pass a Leaflet map instance or a `mapId`, optional `style`/`hoverStyle` overrides, and custom tooltip formatters if needed.
- Additional maps can opt-in automatically by pushing their DOM selectors into `drupalSettings.citizenCustom.worldCountriesLayer.mapSelectors` (use `#attached` in preprocessors or via the theme).
- The tooltip demographic fields are configurable via `demographicFields` in the behavior options; by default they read `population`, `ethnicities`, and `languages` keys from the JSON dataset.

Keeping these steps documented here should make it easier to maintain the custom country layer and associated data in future iterations.
