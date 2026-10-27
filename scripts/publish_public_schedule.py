#!/usr/bin/env python3
"""Publish only validated, already-public clinic timetables; Python stdlib only."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

SOURCE_URL = "https://script.google.com/macros/s/AKfycbxgqUfWwelvtQDBYu4-Y_JXGj0pWwaI1ltA9RSei7HZGW-Tqr27elypzT1XwOSbu3F28Q/exec?view=linedoctors"
TARGET = Path("public-schedule/latest.json")
SCHEMA = "allclinic-bundle-v1"
CLINIC_SCHEMA = "allclinic-readonly-v1"
CODES = tuple("ABCDEFGHIJKLMN")
SESSIONS = ("早診", "午診", "晚診")
TAIPEI = timezone(timedelta(hours=8))
MAX_RESPONSE_BYTES = 2_000_000
MAX_SOURCE_AGE_SECONDS = 120
MAX_FUTURE_SECONDS = 60


class InvalidSnapshot(ValueError):
    """Messages contain fixed diagnostic codes only, never source payloads."""


def require(condition, code):
    if not condition:
        raise InvalidSnapshot(code)


def json_text(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)


def digest(value):
    return hashlib.sha256(json_text(value).encode("utf-8")).hexdigest()


def timestamp(value):
    require(isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z", value), "timestamp")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise InvalidSnapshot("timestamp") from None


def fresh_timestamp(value, now):
    parsed = timestamp(value)
    age = (now - parsed).total_seconds()
    require(-MAX_FUTURE_SECONDS <= age <= MAX_SOURCE_AGE_SECONDS, "source-age")
    return parsed


def week_starts(now):
    local = now.astimezone(TAIPEI).date()
    monday = local - timedelta(days=local.weekday())
    return [(monday + timedelta(weeks=i)).isoformat() for i in range(4)]


def safe_name(value):
    require(isinstance(value, str) and 0 < len(value) <= 60, "doctor-name")
    require(value == value.strip() and not re.search(r"[\x00-\x1f\x7f<>]", value), "doctor-name")
    return value


def time_value(value, off):
    require(isinstance(value, str), "time")
    if value == "" and off:
        return value
    require(re.fullmatch(r"(?:[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", value), "time")
    return value


def minute(value):
    hour, minutes = value.split(":")
    return int(hour) * 60 + int(minutes)


def clean_cell(raw):
    require(isinstance(raw, dict), "cell")
    require(type(raw.get("off")) is bool and type(raw.get("changed")) is bool, "cell-flags")
    off = raw["off"]
    start, end = time_value(raw.get("start"), off), time_value(raw.get("end"), off)
    require(bool(start) == bool(end), "time-pair")
    if start:
        require(minute(start) < minute(end), "time-order")
    return {"name": safe_name(raw.get("name")), "start": start, "end": end, "off": off, "changed": raw["changed"]}


def clean_boards(raw, start):
    require(isinstance(raw, list) and 1 <= len(raw) <= 2, "boards")
    dates = [(datetime.fromisoformat(start).date() + timedelta(days=i)).isoformat() for i in range(7)]
    result, kinds = [], set()
    for board in raw:
        require(isinstance(board, dict), "board")
        kind = board.get("kind")
        require(kind in ("health", "weight") and kind not in kinds, "board-kind")
        kinds.add(kind)
        require(board.get("dates") == dates, "board-dates")
        rows = board.get("rows")
        require(isinstance(rows, list) and len(rows) == 3, "rows")
        cleaned_rows = []
        for index, row in enumerate(rows):
            require(isinstance(row, dict) and row.get("session") == SESSIONS[index], "row-session")
            days = row.get("days")
            require(isinstance(days, list) and len(days) == 7, "row-days")
            cleaned_days = []
            for cells in days:
                require(isinstance(cells, list) and len(cells) <= 8, "day-cells")
                cleaned_days.append([clean_cell(cell) for cell in cells])
            cleaned_rows.append({"session": SESSIONS[index], "days": cleaned_days})
        result.append({"kind": kind, "dates": dates, "rows": cleaned_rows})
    return result


def validate_snapshot(raw, now=None):
    """Reconstruct every object from whitelisted fields, checking content hashes."""
    now = now or datetime.now(timezone.utc)
    require(now.tzinfo is not None, "clock")
    require(isinstance(raw, dict), "snapshot")
    require(raw.get("ok") is True and raw.get("view") == "linedoctors" and raw.get("schema") == SCHEMA, "schema")
    require(raw.get("stale") is False, "stale")
    starts = week_starts(now)
    require(raw.get("froms") == starts, "week-range")
    generated_at = raw.get("generatedAt")
    generated = fresh_timestamp(generated_at, now)
    clinics = raw.get("clinics")
    require(isinstance(clinics, list) and len(clinics) == len(CODES), "clinics")
    clean, stored = [], []
    for code, clinic in zip(CODES, clinics):
        require(isinstance(clinic, dict) and clinic.get("clinic") == code, "clinic-code")
        require(clinic.get("stale") is False, "clinic-stale")
        checked_at = clinic.get("checkedAt")
        checked = fresh_timestamp(checked_at, now)
        require(checked <= generated, "checked-after-generated")
        if clinic.get("available") is False:
            require(clinic.get("ok") is False and clinic.get("reason") == "not_provided", "unavailable")
            clean.append({"ok": False, "clinic": code, "available": False, "reason": "not_provided", "checkedAt": checked_at, "stale": False})
            stored.append({"clinic": code, "available": False, "reason": "not_provided", "checkedAt": checked_at, "stale": False})
            continue
        require(clinic.get("ok") is True and clinic.get("available") is True, "clinic-incomplete")
        version = clinic.get("version")
        require(isinstance(version, str) and re.fullmatch(re.escape(CLINIC_SCHEMA + "|" + code + "|") + r"[a-f0-9]{64}", version), "clinic-version")
        require(clinic.get("currentVersion") == version, "current-version")
        weeks = clinic.get("weeks")
        require(isinstance(weeks, list) and len(weeks) == 4, "weeks")
        clean_weeks, stored_weeks = [], []
        for index, week in enumerate(weeks):
            start = starts[index]
            end = (datetime.fromisoformat(start).date() + timedelta(days=6)).isoformat()
            require(isinstance(week, dict) and week.get("ok") is True and week.get("clinic") == code, "week")
            require(week.get("from") == start and week.get("to") == end, "week-dates")
            require(week.get("updatedAt") == checked_at and week.get("version") == version, "week-version")
            boards = clean_boards(week.get("boards"), start)
            stored_weeks.append({"from": start, "to": end, "boards": boards})
            clean_weeks.append({"ok": True, "clinic": code, "from": start, "to": end, "updatedAt": checked_at, "version": version, "boards": boards})
        require(version == CLINIC_SCHEMA + "|" + code + "|" + digest(stored_weeks), "clinic-hash")
        stored.append({"clinic": code, "available": True, "version": version, "checkedAt": checked_at, "stale": False, "weeks": stored_weeks})
        clean.append({"ok": True, "clinic": code, "available": True, "version": version, "checkedAt": checked_at, "stale": False, "weeks": clean_weeks, "currentVersion": version})
    stored_bundle = {"schema": SCHEMA, "froms": starts, "generatedAt": generated_at, "clinics": stored}
    version = SCHEMA + "|" + digest(stored_bundle)
    require(raw.get("version") == version, "bundle-hash")
    return {"ok": True, "view": "linedoctors", "schema": SCHEMA, "version": version, "generatedAt": generated_at, "froms": starts, "stale": False, "clinics": clean}


class GooglePublicRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        parsed = urlparse(newurl)
        require(parsed.scheme == "https" and parsed.hostname in ("script.google.com", "script.googleusercontent.com") and not parsed.username and not parsed.password, "redirect")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch_snapshot():
    request = Request(SOURCE_URL, headers={"Accept": "application/json", "User-Agent": "DrKing-Public-Schedule-Cache/1"})
    with build_opener(GooglePublicRedirects()).open(request, timeout=45) as response:
        require(response.status == 200, "http-status")
        body = response.read(MAX_RESPONSE_BYTES + 1)
    require(len(body) <= MAX_RESPONSE_BYTES, "response-size")
    try:
        return json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        raise InvalidSnapshot("response-json") from None


def publish_snapshot(raw, target=TARGET, now=None):
    """The prior file is never touched until the complete new snapshot is valid."""
    snapshot = validate_snapshot(raw, now)
    target = Path(target)
    if target.exists():
        try:
            previous = json.loads(target.read_text(encoding="utf-8"))
            previous_time = timestamp(previous.get("generatedAt"))
        except (ValueError, AttributeError):
            previous_time = None
        if previous_time:
            require(timestamp(snapshot["generatedAt"]) >= previous_time, "older-than-published")
            if timestamp(snapshot["generatedAt"]) == previous_time:
                require(snapshot["version"] == previous.get("version"), "same-time-different-version")
    data = json_text(snapshot) + "\n"
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_text(encoding="utf-8") == data:
        return False
    temporary = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=target.parent, prefix=".latest-", delete=False) as out:
            temporary = Path(out.name)
            out.write(data)
            out.flush()
            os.fsync(out.fileno())
        # Recheck rollover and freshness at replacement time during a live run.
        if now is None:
            validate_snapshot(snapshot, datetime.now(timezone.utc))
        os.replace(temporary, target)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return True


def main():
    try:
        changed = publish_snapshot(fetch_snapshot())
        print("Public four-week timetable cache updated." if changed else "Public timetable cache unchanged.")
        return 0
    except InvalidSnapshot as error:
        print("Cache update rejected; previous file retained: " + str(error), file=sys.stderr)
    except (HTTPError, URLError, TimeoutError, OSError):
        print("Cache update unavailable; previous file retained.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
