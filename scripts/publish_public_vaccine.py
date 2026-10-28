#!/usr/bin/env python3
"""Publish validated public vaccine counts and the instant-opening HTML seed."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

SOURCE_URL = "https://script.google.com/macros/s/AKfycbyg27BeLHq_F4alO48T0QcTnbK5yy-dR19M4zcjTxuWrEdTJbd8zIg-nAso_mVC2paD/exec"
CALLBACK = "vaccineCacheReadback"
TARGET = Path("public-vaccine/latest.json")
HTML_TARGET = Path("linevaccines.html")
CLINICS = ("鶯歌院區", "三樹院區", "桃園院區", "土城院區", "八德院區", "龍潭院區", "大溪院區", "大竹院區", "大湳院區", "平鎮院區", "埔心院區", "觀音院區", "龍岡院區")
VACCINES = ("自費-GSK伏適流", "自費-東洋輔流威護", "公費疫苗-不分廠牌")
TAIPEI = timezone(timedelta(hours=8))
MAX_RESPONSE_BYTES = 100_000
MAX_SOURCE_AGE_SECONDS = 300
MAX_FUTURE_SECONDS = 60
MARKER = re.compile(r'(<script id="lineVaccineSnapshot" type="application/json">)(.*?)(</script>)', re.DOTALL)


class InvalidSnapshot(ValueError):
    """Fixed error codes only; never include upstream private fields in logs."""


def require(condition, code):
    if not condition:
        raise InvalidSnapshot(code)


def timestamp(value):
    require(isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}", value), "timestamp")
    try:
        result = datetime.strptime(value, "%Y-%m-%d %H:%M").replace(tzinfo=TAIPEI)
    except ValueError:
        raise InvalidSnapshot("timestamp") from None
    require(result.strftime("%Y-%m-%d %H:%M") == value, "timestamp")
    return result


def json_text(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)


def validate_snapshot(raw, now=None, require_fresh=True):
    now = now or datetime.now(timezone.utc)
    require(now.tzinfo is not None, "clock")
    require(isinstance(raw, dict), "snapshot")
    require(raw.get("vaccines") == list(VACCINES), "vaccine-columns")
    generated_at = raw.get("generatedAt")
    generated = timestamp(generated_at)
    if require_fresh:
        require(-MAX_FUTURE_SECONDS <= (now - generated).total_seconds() <= MAX_SOURCE_AGE_SECONDS, "source-age")
    clinics = raw.get("clinics")
    require(isinstance(clinics, list) and len(clinics) == len(CLINICS), "clinic-count")
    found = {}
    for clinic in clinics:
        require(isinstance(clinic, dict), "clinic")
        name = clinic.get("name")
        require(isinstance(name, str) and name in CLINICS and name not in found, "clinic-name")
        qty = clinic.get("qty")
        require(isinstance(qty, list) and len(qty) == len(VACCINES), "quantity-count")
        for value in qty:
            require(value is None or value == "不提供" or type(value) is int and 0 <= value <= 1_000_000, "quantity")
        require("updatedAt" in clinic, "clinic-time-missing")
        updated = clinic["updatedAt"]
        if updated is not None:
            require(timestamp(updated) <= generated, "clinic-time-future")
        found[name] = {"name": name, "qty": qty[:], "updatedAt": updated}
    require(set(found) == set(CLINICS), "clinic-incomplete")
    require("latestUpdate" in raw, "latest-time-missing")
    reported = [clinic["updatedAt"] for clinic in found.values() if clinic["updatedAt"]]
    latest = raw["latestUpdate"]
    require(latest == (max(reported) if reported else None), "latest-time")
    return {"vaccines": list(VACCINES), "clinics": [found[name] for name in CLINICS], "latestUpdate": latest, "generatedAt": generated_at}


def reject_regression(snapshot, previous):
    require(timestamp(snapshot["generatedAt"]) >= timestamp(previous["generatedAt"]), "older-than-published")
    old = {clinic["name"]: clinic for clinic in previous["clinics"]}
    for clinic in snapshot["clinics"]:
        prior_time = old[clinic["name"]]["updatedAt"]
        if prior_time:
            require(clinic["updatedAt"] is not None and timestamp(clinic["updatedAt"]) >= timestamp(prior_time), "older-clinic-report")


class GooglePublicRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        parsed = urlparse(newurl)
        require(parsed.scheme == "https" and parsed.hostname in ("script.google.com", "script.googleusercontent.com") and not parsed.username and not parsed.password, "redirect")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def parse_response(body):
    require(isinstance(body, bytes) and len(body) <= MAX_RESPONSE_BYTES, "response-size")
    try:
        text = body.decode("utf-8").strip()
        matched = re.fullmatch(re.escape(CALLBACK) + r"\((.*)\);?", text, re.DOTALL)
        require(matched is not None, "response-wrapper")
        return json.loads(matched.group(1))
    except (ValueError, UnicodeDecodeError):
        raise InvalidSnapshot("response-json") from None


def fetch_snapshot():
    query = urlencode({"action": "stock", "callback": CALLBACK, "_": str(int(datetime.now(timezone.utc).timestamp()))})
    request = Request(SOURCE_URL + "?" + query, headers={"Accept": "application/javascript", "User-Agent": "DrKing-Public-Vaccine-Cache/1"})
    with build_opener(GooglePublicRedirects()).open(request, timeout=35) as response:
        require(response.status == 200, "http-status")
        body = response.read(MAX_RESPONSE_BYTES + 1)
    return parse_response(body)


def atomic_write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile("wb", dir=path.parent, prefix=".vaccine-", delete=False) as out:
            temporary = Path(out.name)
            out.write(data)
            out.flush()
            os.fsync(out.fileno())
        os.replace(temporary, path)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def publish_snapshot(raw, target=TARGET, html_target=HTML_TARGET, now=None):
    """Validate both outputs first; GitHub publishes the two files in one commit.

    Each file replacement is atomic. If a later replacement fails, restore earlier
    local replacements so no partial pair can accidentally be committed.
    """
    snapshot = validate_snapshot(raw, now)
    target, html_target = Path(target), Path(html_target)
    require(target.resolve() != html_target.resolve(), "target-paths")
    html_before = html_target.read_bytes()
    try:
        html = html_before.decode("utf-8")
    except UnicodeDecodeError:
        raise InvalidSnapshot("html-encoding") from None
    matches = list(MARKER.finditer(html))
    require(len(matches) == 1, "snapshot-marker")
    try:
        embedded = validate_snapshot(json.loads(matches[0].group(2)), now, require_fresh=False)
    except (ValueError, TypeError):
        raise InvalidSnapshot("embedded-snapshot") from None
    reject_regression(snapshot, embedded)
    previous_bytes = target.read_bytes() if target.exists() else None
    if previous_bytes is not None:
        try:
            previous = validate_snapshot(json.loads(previous_bytes), now, require_fresh=False)
        except (ValueError, TypeError):
            raise InvalidSnapshot("previous-snapshot") from None
        reject_regression(snapshot, previous)
    data = json_text(snapshot)
    html_after = MARKER.sub(lambda match: match.group(1) + data + match.group(3), html).encode("utf-8")
    json_after = (data + "\n").encode("utf-8")
    if previous_bytes == json_after and html_before == html_after:
        return False
    if now is None:
        validate_snapshot(snapshot, datetime.now(timezone.utc))
    changed = []
    try:
        if previous_bytes != json_after:
            atomic_write(target, json_after)
            changed.append((target, previous_bytes))
        if html_before != html_after:
            atomic_write(html_target, html_after)
            changed.append((html_target, html_before))
    except Exception:
        for path, old in reversed(changed):
            if old is None:
                path.unlink(missing_ok=True)
            else:
                atomic_write(path, old)
        raise
    return True


def main():
    try:
        changed = publish_snapshot(fetch_snapshot())
        print("Public vaccine cache and page seed updated." if changed else "Public vaccine cache unchanged.")
        return 0
    except InvalidSnapshot as error:
        print("Vaccine cache rejected; previous files retained: " + str(error), file=sys.stderr)
    except (HTTPError, URLError, TimeoutError, OSError):
        print("Vaccine cache unavailable; previous files retained.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
