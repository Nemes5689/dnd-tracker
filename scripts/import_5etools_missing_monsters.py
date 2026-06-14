#!/usr/bin/env python3
"""
Import the missing monster list into public/data/monsters.json from the public
5e.tools bestiary JSON data files.

Run from the project root:
    python scripts/import_5etools_missing_monsters.py

Recommended first pass:
    python scripts/import_5etools_missing_monsters.py --dry-run

Useful options:
    --limit 20              import/preview only the first 20 wanted monsters
    --source AATM           import/preview only one source code
    --update-existing       replace existing monsters with the same id/name
    --wanted PATH           use another wanted-list JSON/CSV file
"""

from __future__ import annotations

import argparse
import copy
import csv
import datetime as _dt
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MONSTERS_JSON = PROJECT_ROOT / "public" / "data" / "monsters.json"
DEFAULT_WANTED = PROJECT_ROOT / "scripts" / "desired_monsters_missing_to_fetch_unique_names.json"
REPORT_JSON = PROJECT_ROOT / "scripts" / "import_report_5etools_missing_monsters.json"
NOT_FOUND_CSV = PROJECT_ROOT / "scripts" / "import_not_found_5etools_missing_monsters.csv"

BASE_URL = "https://5e.tools/data/bestiary"
BESTIARY_INDEX_URL = f"{BASE_URL}/index.json"

SIZE_MAP = {
    "T": "Tiny",
    "S": "Small",
    "M": "Medium",
    "L": "Large",
    "H": "Huge",
    "G": "Gargantuan",
    "V": "Varies",
}

ALIGN_MAP = {
    "L": "Lawful",
    "N": "Neutral",
    "NX": "Neutral",
    "C": "Chaotic",
    "G": "Good",
    "E": "Evil",
    "U": "Unaligned",
    "A": "Any Alignment",
}

CR_XP = {
    "0": 10,
    "1/8": 25,
    "1/4": 50,
    "1/2": 100,
    "1": 200,
    "2": 450,
    "3": 700,
    "4": 1100,
    "5": 1800,
    "6": 2300,
    "7": 2900,
    "8": 3900,
    "9": 5000,
    "10": 5900,
    "11": 7200,
    "12": 8400,
    "13": 10000,
    "14": 11500,
    "15": 13000,
    "16": 15000,
    "17": 18000,
    "18": 20000,
    "19": 22000,
    "20": 25000,
    "21": 33000,
    "22": 41000,
    "23": 50000,
    "24": 62000,
    "25": 75000,
    "26": 90000,
    "27": 105000,
    "28": 120000,
    "29": 135000,
    "30": 155000,
}

ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"]


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("’", "").replace("'", "")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def norm_name(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).strip()).lower()


def ability_mod(score: int | None) -> int:
    if score is None:
        return 0
    return (int(score) - 10) // 2


def fetch_json(url: str, retries: int = 3, sleep_seconds: float = 0.6) -> dict[str, Any]:
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "dnd-tracker-monster-importer/1.0 (+local script)",
                    "Accept": "application/json,text/plain,*/*",
                },
            )
            with urllib.request.urlopen(req, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt < retries:
                time.sleep(sleep_seconds * attempt)
    raise RuntimeError(f"Could not fetch {url}: {last_error}")


def clean_5etools_text(value: Any) -> str:
    """Flatten 5e.tools entries and remove common inline tags."""
    if value is None:
        return ""
    if isinstance(value, str):
        text = value
    elif isinstance(value, (int, float)):
        text = str(value)
    elif isinstance(value, list):
        parts = []
        for v in value:
            cleaned = clean_5etools_text(v)
            if cleaned:
                parts.append(cleaned)
        text = "\n".join(parts)
    elif isinstance(value, dict):
        if value.get("type") == "list" and "items" in value:
            return clean_5etools_text(value.get("items"))
        if value.get("type") == "table":
            rows = value.get("rows") or []
            return "\n".join(clean_5etools_text(row) for row in rows)
        if "entries" in value:
            head = value.get("name")
            body = clean_5etools_text(value.get("entries"))
            return f"{head}. {body}" if head else body
        if "items" in value:
            return clean_5etools_text(value.get("items"))
        if "entry" in value:
            return clean_5etools_text(value.get("entry"))
        return "; ".join(f"{k}: {clean_5etools_text(v)}" for k, v in value.items())
    else:
        text = str(value)

    replacements = [
        (r"\{@hit ([^}]+)\}", r"+\1"),
        (r"\{@dc ([^}]+)\}", r"DC \1"),
        (r"\{@damage ([^}]+)\}", r"\1"),
        (r"\{@dice ([^}]+)\}", r"\1"),
        (r"\{@condition ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@spell ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@skill ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@creature ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@item ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@sense ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@scaledice ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@scaledamage ([^}|]+)(?:\|[^}]*)?\}", r"\1"),
        (r"\{@atk ([^}]+)\}", "Attack Roll:"),
        (r"\{@h\}", "Hit: "),
        (r"\{@recharge ([^}]+)\}", r"(Recharge \1)"),
        (r"\{@b ([^}]+)\}", r"\1"),
        (r"\{@i ([^}]+)\}", r"\1"),
    ]
    for pat, repl in replacements:
        text = re.sub(pat, repl, text)
    text = re.sub(r"\{@[^ ]+ ([^}|]+)(?:\|[^}]*)?\}", r"\1", text)
    text = text.replace("{@h}", "Hit: ")
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_bonus(value: Any) -> int:
    if value is None:
        return 0
    if isinstance(value, int):
        return value
    match = re.search(r"[-+]?\d+", str(value))
    return int(match.group(0)) if match else 0


def parse_ac(ac: Any) -> int | None:
    if isinstance(ac, int):
        return ac
    if isinstance(ac, list) and ac:
        first = ac[0]
        if isinstance(first, int):
            return first
        if isinstance(first, dict):
            return first.get("ac")
    if isinstance(ac, dict):
        return ac.get("ac")
    return None


def parse_speed(speed: Any) -> dict[str, int]:
    out: dict[str, int] = {}
    if not isinstance(speed, dict):
        return out
    for key, value in speed.items():
        if key == "canHover":
            continue
        if isinstance(value, int):
            out[key] = value
        elif isinstance(value, dict) and isinstance(value.get("number"), int):
            out[key] = value["number"]
        elif isinstance(value, str):
            match = re.search(r"\d+", value)
            if match:
                out[key] = int(match.group(0))
    return out


def parse_type(mon_type: Any) -> tuple[str, str | None]:
    if isinstance(mon_type, str):
        return mon_type.title(), None
    if isinstance(mon_type, dict):
        base = str(mon_type.get("type", "Unknown")).title()
        tags = mon_type.get("tags") or []
        tag_texts: list[str] = []
        for tag in tags:
            if isinstance(tag, str):
                tag_texts.append(tag.title())
            elif isinstance(tag, dict):
                tag_texts.append(str(tag.get("tag") or tag.get("prefix") or "").title())
        return base, ", ".join(t for t in tag_texts if t) or None
    return "Unknown", None


def parse_size(size: Any) -> str:
    if isinstance(size, list) and size:
        if len(size) == 1:
            return SIZE_MAP.get(str(size[0]), str(size[0]))
        return " or ".join(SIZE_MAP.get(str(s), str(s)) for s in size)
    return SIZE_MAP.get(str(size), str(size)) if size else "Medium"


def parse_alignment(alignment: Any) -> str:
    if alignment is None:
        return "Unaligned"
    if isinstance(alignment, list):
        if alignment == ["N"]:
            return "Neutral"
        return " ".join(ALIGN_MAP.get(str(a), str(a)) for a in alignment)
    if isinstance(alignment, dict):
        return clean_5etools_text(alignment)
    return str(alignment)


def parse_senses_with_notes(senses: Any) -> tuple[dict[str, int], dict[str, str]]:
    out: dict[str, int] = {}
    notes: dict[str, str] = {}
    if not senses:
        return out, notes
    senses_list = [senses] if isinstance(senses, str) else senses
    for sense in senses_list:
        raw = clean_5etools_text(sense)
        text = raw.lower()
        for key in ["blindsight", "darkvision", "tremorsense", "truesight"]:
            match = re.search(rf"{key}\s+(\d+)\s*ft\.?(?:\s*(\([^)]*\)))?", text)
            if match:
                out[key] = int(match.group(1))
                if match.group(2):
                    notes[key] = match.group(2)
    return out, notes


def parse_condition_immunities(value: Any) -> list[str]:
    out: list[str] = []
    if not value:
        return out
    items = value if isinstance(value, list) else [value]
    for item in items:
        if isinstance(item, str):
            out.append(clean_5etools_text(item).title())
        elif isinstance(item, dict):
            inner = item.get("conditionImmune") or item.get("immune") or item.get("conditions") or []
            note = item.get("note") or item.get("preNote") or item.get("cond")
            for x in parse_condition_immunities(inner):
                out.append(f"{x} ({clean_5etools_text(note)})" if note else x)
    return dedupe(out)


def dedupe(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        key = str(item).lower()
        if key not in seen:
            seen.add(key)
            out.append(item)
    return out


def flatten_damage_list(value: Any) -> list[str]:
    out: list[str] = []
    if not value:
        return out
    if isinstance(value, str):
        return [clean_5etools_text(value).title()]
    if isinstance(value, list):
        for item in value:
            if isinstance(item, str):
                out.append(clean_5etools_text(item).title())
            elif isinstance(item, dict):
                inner = item.get("resist") or item.get("immune") or item.get("vulnerable") or []
                note = item.get("note") or item.get("preNote") or item.get("cond")
                for x in flatten_damage_list(inner):
                    out.append(f"{x} ({clean_5etools_text(note)})" if note else x)
    return dedupe(out)


def convert_named_entries(entries: Any) -> list[dict[str, str]]:
    result: list[dict[str, str]] = []
    if not entries:
        return result
    for entry in entries:
        if isinstance(entry, dict):
            name = clean_5etools_text(entry.get("name", "Unnamed"))
            desc = clean_5etools_text(entry.get("entries", []))
            result.append({"name": name, "description": desc})
        else:
            result.append({"name": "Entry", "description": clean_5etools_text(entry)})
    return result


def convert_spellcasting(spellcasting: Any) -> list[dict[str, str]]:
    if not spellcasting:
        return []
    result = []
    for block in spellcasting:
        if not isinstance(block, dict):
            continue
        parts: list[str] = []
        parts.extend(clean_5etools_text(x) for x in block.get("headerEntries", []) if x)
        if block.get("will"):
            parts.append("At will: " + ", ".join(clean_5etools_text(x) for x in block["will"]))
        daily = block.get("daily") or {}
        for k in sorted(daily.keys(), reverse=True):
            label = k.replace("e", "/day each").replace("d", "/day")
            parts.append(f"{label}: " + ", ".join(clean_5etools_text(x) for x in daily[k]))
        spells = block.get("spells") or {}
        for level, data in sorted(spells.items(), key=lambda kv: int(kv[0])):
            if isinstance(data, dict):
                spell_list = data.get("spells", [])
                slots = data.get("slots")
                prefix = f"Level {level}"
                if slots is not None:
                    prefix += f" ({slots} slots)"
                parts.append(prefix + ": " + ", ".join(clean_5etools_text(x) for x in spell_list))
        result.append({"name": clean_5etools_text(block.get("name", "Spellcasting")), "description": "\n".join(p for p in parts if p)})
    return result


class BestiaryCache:
    def __init__(self, index: dict[str, str]):
        self.index = index
        self.index_by_upper = {str(k).upper(): v for k, v in index.items()}
        self.downloaded: dict[str, dict[str, Any]] = {}
        self.by_key: dict[tuple[str, str], dict[str, Any]] = {}
        self.source_errors: dict[str, str] = {}

    def get_filename(self, source: str) -> str | None:
        if source in self.index:
            return self.index[source]
        return self.index_by_upper.get(str(source).upper())

    def load_source(self, source: str) -> dict[str, Any] | None:
        source = str(source)
        if source in self.downloaded:
            return self.downloaded[source]
        filename = self.get_filename(source)
        if not filename:
            self.source_errors[source] = "source code not found in index.json"
            return None
        try:
            data = fetch_json(f"{BASE_URL}/{filename}")
        except Exception as exc:
            self.source_errors[source] = str(exc)
            return None
        self.downloaded[source] = data
        for mon in data.get("monster", []):
            msource = str(mon.get("source", source))
            self.by_key[(norm_name(mon.get("name", "")), msource.upper())] = mon
        return data

    def find_monster(self, name: str, source: str) -> dict[str, Any] | None:
        data = self.load_source(source)
        if not data:
            return None
        key = (norm_name(name), str(source).upper())
        found = self.by_key.get(key)
        if found:
            return self.resolve_copy(found)
        # Fallback: match name within the source file even if source casing differs.
        for mon in data.get("monster", []):
            if norm_name(mon.get("name", "")) == norm_name(name):
                return self.resolve_copy(mon)
        return None

    def resolve_copy(self, mon: dict[str, Any], seen: set[tuple[str, str]] | None = None) -> dict[str, Any]:
        """Resolve simple 5e.tools _copy blocks before conversion."""
        if "_copy" not in mon:
            return mon
        seen = seen or set()
        copy_info = mon.get("_copy") or {}
        base_name = copy_info.get("name")
        base_source = copy_info.get("source") or mon.get("source")
        key = (norm_name(base_name), str(base_source).upper())
        if not base_name or key in seen:
            return mon
        seen.add(key)
        self.load_source(str(base_source))
        base = self.by_key.get(key)
        if not base:
            return mon
        merged = copy.deepcopy(self.resolve_copy(base, seen))
        for k, v in mon.items():
            if k == "_copy":
                continue
            merged[k] = copy.deepcopy(v)
        return merged


def convert_5etools_monster(src: dict[str, Any]) -> dict[str, Any]:
    mon_type, subtype = parse_type(src.get("type"))
    cr = src.get("cr")
    if isinstance(cr, dict):
        cr = cr.get("cr")
    cr = str(cr or "Unknown")

    abilities = {
        key: {"score": int(src.get(key, 10)), "modifier": ability_mod(int(src.get(key, 10)))}
        for key in ABILITY_KEYS
    }

    dex_mod = abilities["dex"]["modifier"]
    initiative = src.get("initiative")
    if isinstance(initiative, dict):
        init_mod = parse_bonus(initiative.get("bonus", dex_mod))
    else:
        init_mod = dex_mod

    traits = convert_named_entries(src.get("trait"))
    actions: list[dict[str, str]] = []
    actions.extend(convert_spellcasting(src.get("spellcasting")))
    actions.extend(convert_named_entries(src.get("action")))

    source_code = str(src.get("source", "5eTools"))
    monster_slug = slugify(str(src.get("name", "monster")))
    source_slug = slugify(source_code)
    senses, senses_notes = parse_senses_with_notes(src.get("senses"))

    return {
        "id": monster_slug,
        "name": src.get("name"),
        "size": parse_size(src.get("size")),
        "type": mon_type,
        "subtype": subtype,
        "alignment": parse_alignment(src.get("alignment")),
        "ac": parse_ac(src.get("ac")),
        "hp": (src.get("hp") or {}).get("average") if isinstance(src.get("hp"), dict) else None,
        "hp_formula": (src.get("hp") or {}).get("formula") if isinstance(src.get("hp"), dict) else None,
        "speed": parse_speed(src.get("speed")),
        "initiative": {"modifier": init_mod, "score": 10 + init_mod},
        "abilities": abilities,
        "saves": {k: parse_bonus(v) for k, v in (src.get("save") or {}).items()},
        "skills": {k: parse_bonus(v) for k, v in (src.get("skill") or {}).items()},
        "senses": senses,
        "senses_notes": senses_notes,
        "passive_perception": src.get("passive"),
        "languages": [clean_5etools_text(x) for x in src.get("languages", [])],
        "cr": cr,
        "xp": CR_XP.get(cr, 0),
        "damage_resistances": flatten_damage_list(src.get("resist")),
        "damage_immunities": flatten_damage_list(src.get("immune")),
        "damage_vulnerabilities": flatten_damage_list(src.get("vulnerable")),
        "condition_immunities": parse_condition_immunities(src.get("conditionImmune")),
        "gear": [],
        "traits": traits,
        "actions": actions,
        "bonus_actions": convert_named_entries(src.get("bonus")),
        "reactions": convert_named_entries(src.get("reaction")),
        "legendary_actions": convert_named_entries(src.get("legendary")),
        "source": f"5e.tools / {source_code}",
        "url": f"https://5e.tools/bestiary/{monster_slug}-{source_slug}.html",
    }


def load_wanted(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise SystemExit(f"Wanted list not found: {path}")
    if path.suffix.lower() == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            for key in ["monsters_to_fetch_unique_names", "monsters_to_fetch", "monsters"]:
                if isinstance(data.get(key), list):
                    return data[key]
        if isinstance(data, list):
            return data
        raise SystemExit(f"Unsupported wanted JSON structure in {path}")
    if path.suffix.lower() == ".csv":
        with path.open("r", encoding="utf-8-sig", newline="") as f:
            return list(csv.DictReader(f))
    raise SystemExit(f"Unsupported wanted list file type: {path}")


def write_not_found_csv(rows: list[dict[str, Any]]) -> None:
    fields = ["name", "source", "reason", "type", "cr"]
    with NOT_FOUND_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Do not write monsters.json; only write report.")
    parser.add_argument("--update-existing", action="store_true", help="Replace existing monsters with the same generated id/name.")
    parser.add_argument("--wanted", type=Path, default=DEFAULT_WANTED, help="Wanted monster list JSON/CSV path.")
    parser.add_argument("--limit", type=int, default=None, help="Only process the first N wanted rows after filtering.")
    parser.add_argument("--source", default=None, help="Only process one source code, e.g. AATM.")
    args = parser.parse_args()

    if not MONSTERS_JSON.exists():
        raise SystemExit(f"Cannot find {MONSTERS_JSON}. Run this script from the project root or keep the default project layout.")

    current = json.loads(MONSTERS_JSON.read_text(encoding="utf-8"))
    if not isinstance(current.get("monsters"), list):
        raise SystemExit("public/data/monsters.json does not contain a top-level 'monsters' list.")

    wanted = load_wanted(args.wanted)
    wanted = [w for w in wanted if w.get("name") and w.get("source")]
    if args.source:
        wanted = [w for w in wanted if str(w.get("source", "")).upper() == args.source.upper()]
    if args.limit is not None:
        wanted = wanted[: args.limit]

    print(f"Wanted monsters to process: {len(wanted)}")
    print("Downloading 5e.tools bestiary index...")
    index = fetch_json(BESTIARY_INDEX_URL)
    cache = BestiaryCache(index)

    converted: list[dict[str, Any]] = []
    not_found: list[dict[str, Any]] = []
    conversion_errors: list[dict[str, Any]] = []

    for i, wanted_row in enumerate(wanted, start=1):
        name = str(wanted_row.get("name", "")).strip()
        source = str(wanted_row.get("source", "")).strip()
        if i % 50 == 0 or i == 1:
            print(f"Processing {i}/{len(wanted)}: {name} [{source}]")
        found = cache.find_monster(name, source)
        if not found:
            reason = cache.source_errors.get(source) or "monster not found in source file"
            not_found.append({**wanted_row, "reason": reason})
            continue
        try:
            converted.append(convert_5etools_monster(found))
        except Exception as exc:
            conversion_errors.append({**wanted_row, "reason": str(exc)})

    output = copy.deepcopy(current)
    existing_by_id = {m.get("id"): i for i, m in enumerate(output["monsters"]) if m.get("id")}
    existing_by_name = {norm_name(m.get("name", "")): i for i, m in enumerate(output["monsters"])}

    appended: list[str] = []
    updated: list[str] = []
    skipped_existing: list[str] = []
    for monster in converted:
        mid = monster["id"]
        lname = norm_name(monster["name"])
        existing_idx = existing_by_id.get(mid, existing_by_name.get(lname))
        if existing_idx is not None:
            if args.update_existing:
                output["monsters"][existing_idx] = monster
                updated.append(monster["name"])
            else:
                skipped_existing.append(monster["name"])
            continue
        output["monsters"].append(monster)
        existing_by_id[mid] = len(output["monsters"]) - 1
        existing_by_name[lname] = len(output["monsters"]) - 1
        appended.append(monster["name"])

    report = {
        "timestamp": _dt.datetime.now().isoformat(timespec="seconds"),
        "dry_run": args.dry_run,
        "wanted_file": str(args.wanted),
        "wanted_count": len(wanted),
        "downloaded_source_count": len(cache.downloaded),
        "source_errors": cache.source_errors,
        "converted_count": len(converted),
        "appended_count": len(appended),
        "updated_count": len(updated),
        "skipped_existing_count": len(skipped_existing),
        "not_found_count": len(not_found),
        "conversion_error_count": len(conversion_errors),
        "before_count": len(current["monsters"]),
        "after_count": len(output["monsters"]),
        "appended_sample": appended[:50],
        "updated_sample": updated[:50],
        "skipped_existing_sample": skipped_existing[:50],
        "not_found_sample": not_found[:50],
        "conversion_errors": conversion_errors[:100],
    }

    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_not_found_csv(not_found + conversion_errors)

    if args.dry_run:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        print(f"Dry run complete. Report: {REPORT_JSON}")
        print(f"Not-found CSV: {NOT_FOUND_CSV}")
        return 0

    backup = MONSTERS_JSON.with_suffix(f".backup-{_dt.datetime.now().strftime('%Y%m%d-%H%M%S')}.json")
    backup.write_text(json.dumps(current, ensure_ascii=False, indent=2), encoding="utf-8")
    MONSTERS_JSON.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"Backup written: {backup}")
    print(f"Updated: {MONSTERS_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
