import json
import requests

SNAPSHOT_URL = "https://countries.altoal.com/api/v1/snapshots/LATEST.json"
METADATA_URL = "https://countries.altoal.com/api/v1/metadata.json"


def format_population(n):
    """Turn a raw integer into a friendly string like '5.9 million'."""
    if not isinstance(n, (int, float)):
        return None

    if n >= 1_000_000_000:
        return f"{round(n / 1_000_000_000, 2)} billion"
    if n >= 1_000_000:
        return f"{round(n / 1_000_000, 2)} million"
    if n >= 1_000:
        return f"{round(n / 1_000, 2)} thousand"
    return str(int(n))


def list_to_label_string(items, max_items=6):
    """
    Turn an array of objects describing ethnic groups/languages into a simple
    comma-separated string, e.g., 'Danes, Turks, Greenlanders'.
    """
    if not isinstance(items, list):
        return None

    names = []
    for item in items[:max_items]:
        if not isinstance(item, dict):
            continue
        name = (
            item.get("name")
            or item.get("label")
            or item.get("group")
            or item.get("ethnicity")
            or item.get("language")
        )
        if name:
            names.append(name.strip())

    return ", ".join(names) if names else None


def extract_ethnicities(people_and_society):
    section = people_and_society or {}
    eg = section.get("ethnic_groups")
    if not isinstance(eg, dict):
        return None
    # Only keep the first 3 ethnicities
    return list_to_label_string(eg.get("value"), max_items=3)


def extract_languages(people_and_society):
    section = people_and_society or {}
    lg = section.get("languages")
    if not isinstance(lg, dict):
        return None
    # Only keep the first (main) language
    return list_to_label_string(lg.get("value"), max_items=1)


def build_population_lookup():
    """
    Use the /metadata.json endpoint to build a dict:
    { iso3: population_number }
    """
    print("Downloading metadata for population...")
    resp = requests.get(METADATA_URL, timeout=60)
    resp.raise_for_status()
    meta = resp.json()

    countries_meta = meta.get("countries", {})
    by_iso3 = {}

    for slug, data in countries_meta.items():
        code = data.get("code", {})
        iso3 = code.get("iso3") or code.get("iso_3")
        pop = data.get("population")

        if iso3 and isinstance(pop, (int, float)):
            by_iso3[iso3] = pop

    print(f"Built population lookup for {len(by_iso3)} ISO3 codes")
    return by_iso3


def main():
    print("Downloading latest country snapshot (for ethnicities/languages)...")
    resp = requests.get(SNAPSHOT_URL, timeout=60)
    resp.raise_for_status()
    snapshot = resp.json()

    countries = snapshot.get("countries", {})

    # Build a separate lookup for population using metadata endpoint
    pop_by_iso3 = build_population_lookup()

    output = {}

    for slug, data in countries.items():
        try:
            identity = data.get("identity", {})
            iso = identity.get("iso", {})

            iso3 = iso.get("alpha3") or iso.get("alpha_3") or iso.get("iso3")
            if not iso3:
                # Skip things without a proper ISO alpha-3 code
                continue

            people_and_society = data.get("people_and_society", {}) or {}

            # Population from metadata
            raw_pop = pop_by_iso3.get(iso3)
            population_str = format_population(raw_pop) if raw_pop is not None else None

            # Ethnicities / languages from snapshot
            ethnicities_str = extract_ethnicities(people_and_society)
            languages_str = extract_languages(people_and_society)

            output[iso3] = {
                "population": population_str,
                "ethnicities": ethnicities_str,
                "languages": languages_str,
            }
        except Exception as e:
            print(f"Skipping {slug} due to error: {e}")

    with open("countries_demographics.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("Wrote countries_demographics.json with", len(output), "entries")


if __name__ == "__main__":
    main()
