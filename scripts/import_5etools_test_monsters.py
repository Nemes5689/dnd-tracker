#!/usr/bin/env python3
"""
Import a small test set of monsters from the public 5e.tools bestiary JSON files
into public/data/monsters.json.

Default test set:
- Animated Coffin (AATM)
- Factol Skall (AATM)
- Heralds of Dust Exorcist (AATM)
- Harvester Devil (ABH)
- Vampire Infernalist (ABH)

Run from the project root:
    python scripts/import_5etools_test_monsters.py

Safer dry run:
    python scripts/import_5etools_test_monsters.py --dry-run

Force updating an already existing monster with the same id:
    python scripts/import_5etools_test_monsters.py --update-existing
"""

from __future__ import annotations

import argparse
import copy
import datetime as _dt
import json
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MONSTERS_JSON = PROJECT_ROOT / "public" / "data" / "monsters.json"
REPORT_JSON = PROJECT_ROOT / "scripts" / "import_report_5etools_test.json"

BASE_URL = "https://5e.tools/data/bestiary"
BESTIARY_INDEX_URL = f"{BASE_URL}/index.json"

TEST_MONSTERS = [
    {"name": "Animated Coffin", "source": "AATM"},
    {"name": "Factol Skall", "source": "AATM"},
    {"name": "Heralds of Dust Exorcist", "source": "AATM"},
    {"name": "Harvester Devil", "source": "ABH"},
    {"name": "Vampire Infernalist", "source": "ABH"},
]

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


def ability_mod(score: int | None) -> int:
    if score is None:
        return 0
    return (int(score) - 10) // 2


def fetch_json(url: str) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "dnd-tracker-monster-importer/1.0 (+local script)",
            "Accept": "application/json,text/plain,*/*",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def clean_5etools_text(value: Any) -> str:
    """Flatten 5e.tools entries and remove common inline tags."""
    if value is None:
        return ""
    if isinstance(value, str):
        text = value
    elif isinstance(value, (int, float)):
        text = str(value)
    elif isinstance(value, list):
        text = "\n".join(clean_5etools_text(v) for v in value if clean_5etools_text(v))
    elif isinstance(value, dict):
        # Common 5e.tools nested block shapes.
        if "entries" in value:
            head = value.get("name")
            body = clean_5etools_text(value.get("entries"))
            return f"{head}. {body}" if head else body
        if "items" in value:
            return clean_5etools_text(value.get("items"))
        if "entry" in value:
            return clean_5etools_text(value.get("entry"))
        # Fallback compact representation.
        return "; ".join(f"{k}: {clean_5etools_text(v)}" for k, v in value.items())
    else:
        text = str(value)

    # Replace common inline tags, e.g. {@hit 5} -> +5, {@damage 2d8 + 3} -> 2d8 + 3.
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
        (r"\{@atk ([^}]+)\}", "Attack Roll:"),
        (r"\{@h\}", "Hit: "),
        (r"\{@recharge ([^}]+)\}", r"(Recharge \1)"),
        (r"\{@b ([^}]+)\}", r"\1"),
        (r"\{@i ([^}]+)\}", r"\1"),
    ]
    for pat, repl in replacements:
        text = re.sub(pat, repl, text)
    text = re.sub(r"\{@[^ ]+ ([^}|]+)(?:\|[^}]*)?\}", r"\1", text)
    text = text.replace("  ", " ")
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
        # Prefer the first numeric/default AC.
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
        mapped = [ALIGN_MAP.get(str(a), str(a)) for a in alignment]
        return " ".join(mapped)
    if isinstance(alignment, dict):
        return clean_5etools_text(alignment)
    return str(alignment)


def parse_senses_with_notes(senses: Any) -> tuple[dict[str, int], dict[str, str]]:
    """Return numeric senses and parenthetical notes, if present.

    Example from 5e.tools:
      blindsight 60 ft. (can't see beyond this radius)
    """
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
    """Flatten 5e.tools condition immunities."""
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
    seen = set()
    deduped = []
    for item in out:
        key = item.lower()
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    return deduped


def flatten_damage_list(value: Any) -> list[str]:
    out: list[str] = []
    if not value:
        return out
    if isinstance(value, str):
        return [value.title()]
    if isinstance(value, list):
        for item in value:
            if isinstance(item, str):
                out.append(item.title())
            elif isinstance(item, dict):
                inner = item.get("resist") or item.get("immune") or item.get("vulnerable") or []
                note = item.get("note") or item.get("preNote") or item.get("cond")
                for x in flatten_damage_list(inner):
                    out.append(f"{x} ({note})" if isinstance(note, str) else x)
    return out


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
    actions = []
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


def find_source_files(index: dict[str, str], needed_sources: set[str]) -> dict[str, str]:
    missing_sources = sorted(src for src in needed_sources if src not in index)
    if missing_sources:
        raise SystemExit(f"Missing source code(s) in 5e.tools index.json: {', '.join(missing_sources)}")
    return {src: index[src] for src in needed_sources}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Do not write monsters.json; only write report.")
    parser.add_argument("--update-existing", action="store_true", help="Replace existing monsters with the same generated id.")
    args = parser.parse_args()

    if not MONSTERS_JSON.exists():
        raise SystemExit(f"Cannot find {MONSTERS_JSON}. Run this script from the project root or keep the default project layout.")

    current = json.loads(MONSTERS_JSON.read_text(encoding="utf-8"))
    if not isinstance(current.get("monsters"), list):
        raise SystemExit("public/data/monsters.json does not contain a top-level 'monsters' list.")

    index = fetch_json(BESTIARY_INDEX_URL)
    source_files = find_source_files(index, {m["source"] for m in TEST_MONSTERS})

    downloaded: dict[str, dict[str, Any]] = {}
    for src, filename in source_files.items():
        downloaded[src] = fetch_json(f"{BASE_URL}/{filename}")

    converted: list[dict[str, Any]] = []
    not_found: list[dict[str, str]] = []
    for wanted in TEST_MONSTERS:
        src = wanted["source"]
        name = wanted["name"]
        candidates = downloaded[src].get("monster", [])
        found = next((m for m in candidates if str(m.get("name", "")).lower() == name.lower()), None)
        if not found:
            not_found.append(wanted)
            continue
        converted.append(convert_5etools_monster(found))

    output = copy.deepcopy(current)
    existing_by_id = {m.get("id"): i for i, m in enumerate(output["monsters"]) if m.get("id")}
    existing_by_name = {str(m.get("name", "")).lower(): i for i, m in enumerate(output["monsters"])}

    appended = []
    updated = []
    skipped_existing = []
    for monster in converted:
        mid = monster["id"]
        lname = str(monster["name"]).lower()
        existing_idx = existing_by_id.get(mid, existing_by_name.get(lname))
        if existing_idx is not None:
            if args.update_existing:
                output["monsters"][existing_idx] = monster
                updated.append(monster["name"])
            else:
                skipped_existing.append(monster["name"])
            continue
        output["monsters"].append(monster)
        appended.append(monster["name"])

    report = {
        "timestamp": _dt.datetime.now().isoformat(timespec="seconds"),
        "dry_run": args.dry_run,
        "requested": TEST_MONSTERS,
        "converted_count": len(converted),
        "appended": appended,
        "updated": updated,
        "skipped_existing": skipped_existing,
        "not_found": not_found,
        "before_count": len(current["monsters"]),
        "after_count": len(output["monsters"]),
    }

    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.dry_run:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        print(f"Dry run complete. Report: {REPORT_JSON}")
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
