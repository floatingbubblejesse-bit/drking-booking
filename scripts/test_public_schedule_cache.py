"""Offline contract, fail-closed, atomic-replacement and real-fixture tests."""
import copy
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.request import Request

import publish_public_schedule as publisher


NOW = datetime(2026, 10, 27, 15, 44, 0, tzinfo=timezone.utc)


def iso(value):
    return value.isoformat(timespec="milliseconds").replace("+00:00", "Z")


def fixture(now=NOW):
    starts = publisher.week_starts(now)
    result = {"ok": True, "view": "linedoctors", "schema": publisher.SCHEMA,
              "version": "", "generatedAt": iso(now - timedelta(seconds=5)),
              "froms": starts, "stale": False, "clinics": []}
    for code in publisher.CODES:
        checked = iso(now - timedelta(seconds=10))
        clinic = {"ok": True, "clinic": code, "available": True, "version": "", "checkedAt": checked,
                  "stale": False, "weeks": [], "currentVersion": ""}
        for start in starts:
            dates = [(datetime.fromisoformat(start).date() + timedelta(days=i)).isoformat() for i in range(7)]
            boards = [{"kind": "health", "dates": dates, "rows": [
                {"session": session, "days": [[{"name": "張慧馨", "start": "7:30", "end": "12:30", "off": False, "changed": False}]
                                               for _ in range(7)]}
                for session in publisher.SESSIONS]}]
            clinic["weeks"].append({"ok": True, "clinic": code, "from": start, "to": dates[-1],
                                     "updatedAt": checked, "version": "", "boards": boards})
        result["clinics"].append(clinic)
    rehash(result)
    return result


def rehash(value):
    stored = []
    for clinic in value["clinics"]:
        code = clinic["clinic"]
        if clinic.get("available") is False:
            stored.append({"clinic": code, "available": False, "reason": "not_provided",
                           "checkedAt": clinic["checkedAt"], "stale": False})
            continue
        weeks = [{"from": week["from"], "to": week["to"], "boards": week["boards"]} for week in clinic["weeks"]]
        version = publisher.CLINIC_SCHEMA + "|" + code + "|" + publisher.digest(weeks)
        clinic["version"] = clinic["currentVersion"] = version
        for week in clinic["weeks"]:
            week["version"] = version
        stored.append({"clinic": code, "available": True, "version": version,
                       "checkedAt": clinic["checkedAt"], "stale": False, "weeks": weeks})
    raw = {"schema": publisher.SCHEMA, "froms": value["froms"], "generatedAt": value["generatedAt"], "clinics": stored}
    value["version"] = publisher.SCHEMA + "|" + publisher.digest(raw)


class PublicScheduleCacheTests(unittest.TestCase):
    def setUp(self):
        self.value = fixture()

    def rejected(self, value, now=NOW):
        with self.assertRaises(publisher.InvalidSnapshot):
            publisher.validate_snapshot(value, now)

    def test_valid_four_weeks_fourteen_clinics(self):
        result = publisher.validate_snapshot(self.value, NOW)
        self.assertEqual(result, self.value)
        self.assertEqual(len(result["clinics"]), 14)
        self.assertEqual(len(result["froms"]), 4)

    def test_real_public_fixture_when_available(self):
        path = Path("/tmp/line-public-schedule-speed-20261027.json")
        if not path.exists():
            self.skipTest("Optional local real-public fixture unavailable")
        value = json.loads(path.read_text(encoding="utf-8"))
        result = publisher.validate_snapshot(value, publisher.timestamp(value["generatedAt"]))
        self.assertEqual(len(result["clinics"]), 14)
        self.assertEqual(result, value)

    def test_source_age_limit_is_120_seconds(self):
        self.rejected(self.value, NOW + timedelta(seconds=111))
        publisher.validate_snapshot(self.value, NOW + timedelta(seconds=110))

    def test_future_timestamp_rejected(self):
        self.value["generatedAt"] = iso(NOW + timedelta(seconds=61))
        self.rejected(self.value)

    def test_generated_before_clinic_check_rejected(self):
        self.value["generatedAt"] = iso(NOW - timedelta(seconds=11))
        self.rejected(self.value)

    def test_source_or_clinic_stale_rejected(self):
        self.value["stale"] = True
        self.rejected(self.value)
        self.value["stale"] = False
        self.value["clinics"][0]["stale"] = True
        self.rejected(self.value)

    def test_incomplete_or_duplicate_clinic_rejected(self):
        self.value["clinics"].pop()
        self.rejected(self.value)
        self.value = fixture()
        self.value["clinics"][1] = copy.deepcopy(self.value["clinics"][0])
        self.rejected(self.value)

    def test_pending_clinic_rejected(self):
        self.value["clinics"][0] = {"clinic": "A", "available": None, "ok": False, "reason": "pending", "stale": True}
        self.rejected(self.value)

    def test_explicit_not_provided_is_not_partial_failure(self):
        self.value["clinics"][0] = {"ok": False, "clinic": "A", "available": False,
                                    "reason": "not_provided", "checkedAt": iso(NOW - timedelta(seconds=10)), "stale": False}
        rehash(self.value)
        self.assertEqual(publisher.validate_snapshot(self.value, NOW), self.value)

    def test_missing_week_board_or_day_rejected(self):
        self.value["clinics"][0]["weeks"].pop()
        self.rejected(self.value)
        self.value = fixture()
        self.value["clinics"][0]["weeks"][0]["boards"] = []
        self.rejected(self.value)
        self.value = fixture()
        self.value["clinics"][0]["weeks"][0]["boards"][0]["rows"][0]["days"].pop()
        self.rejected(self.value)

    def test_invalid_date_and_time_rejected(self):
        self.value["clinics"][0]["weeks"][0]["boards"][0]["dates"][0] = "2026-10-25"
        self.rejected(self.value)
        self.value = fixture()
        cell = self.value["clinics"][0]["weeks"][0]["boards"][0]["rows"][0]["days"][0][0]
        cell["start"] = "24:00"
        self.rejected(self.value)
        cell["start"] = "13:00"
        self.rejected(self.value)

    def test_active_cell_requires_times_but_off_may_be_blank(self):
        cell = self.value["clinics"][0]["weeks"][0]["boards"][0]["rows"][0]["days"][0][0]
        cell["start"] = cell["end"] = ""
        self.rejected(self.value)
        cell["off"] = True
        cell["name"] = "休診"
        rehash(self.value)
        publisher.validate_snapshot(self.value, NOW)

    def test_content_and_bundle_hashes_checked(self):
        self.value["clinics"][0]["weeks"][0]["boards"][0]["rows"][0]["days"][0][0]["name"] = "黃錦崧"
        self.rejected(self.value)
        self.value = fixture()
        self.value["version"] = publisher.SCHEMA + "|" + "0" * 64
        self.rejected(self.value)

    def test_extra_fields_never_published(self):
        expected = copy.deepcopy(self.value)
        self.value["internal"] = {"token": "must-not-publish"}
        c = self.value["clinics"][0]
        c["email"] = "must-not-publish"
        c["weeks"][0]["leave_reason"] = "must-not-publish"
        b = c["weeks"][0]["boards"][0]
        b["private"] = "must-not-publish"
        b["rows"][0]["secret"] = "must-not-publish"
        b["rows"][0]["days"][0][0]["password"] = "must-not-publish"
        self.assertEqual(publisher.validate_snapshot(self.value, NOW), expected)

    def test_name_control_or_markup_rejected(self):
        cell = self.value["clinics"][0]["weeks"][0]["boards"][0]["rows"][0]["days"][0][0]
        for name in ("<script>", "醫師\n備註", "", "醫" * 61):
            cell["name"] = name
            self.rejected(self.value)

    def test_week_rollover_uses_taipei(self):
        before = datetime(2026, 11, 1, 15, 59, 50, tzinfo=timezone.utc)
        after = before + timedelta(seconds=15)
        previous_week = fixture(before)
        publisher.validate_snapshot(previous_week, before)
        self.rejected(previous_week, after)
        next_week = fixture(after)
        self.assertEqual(publisher.validate_snapshot(next_week, after)["froms"][0], "2026-11-02")

    def test_atomic_replacement_and_no_change(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "latest.json"
            self.assertTrue(publisher.publish_snapshot(self.value, target, NOW))
            self.assertFalse(publisher.publish_snapshot(self.value, target, NOW))
            self.assertEqual(json.loads(target.read_text()), self.value)

    def test_invalid_or_older_snapshot_retains_previous_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "latest.json"
            publisher.publish_snapshot(self.value, target, NOW)
            before = target.read_bytes()
            for bad in (fixture(NOW - timedelta(seconds=1)), {"ok": False}):
                with self.assertRaises(publisher.InvalidSnapshot):
                    publisher.publish_snapshot(bad, target, NOW)
                self.assertEqual(target.read_bytes(), before)

    def test_file_replace_error_retains_previous_and_cleans_temporary(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "latest.json"
            publisher.publish_snapshot(self.value, target, NOW)
            before = target.read_bytes()
            with patch.object(publisher.os, "replace", side_effect=OSError("disk-failure")):
                with self.assertRaises(OSError):
                    publisher.publish_snapshot(fixture(NOW + timedelta(seconds=1)), target, NOW + timedelta(seconds=1))
            self.assertEqual(target.read_bytes(), before)
            self.assertEqual(sorted(p.name for p in Path(tmp).iterdir()), ["latest.json"])

    def test_redirect_rejects_non_google_or_http(self):
        handler = publisher.GooglePublicRedirects()
        request = Request(publisher.SOURCE_URL)
        for url in ("http://script.google.com/x", "https://evil.example/x", "https://user:password@script.google.com/x"):
            with self.assertRaises(publisher.InvalidSnapshot):
                handler.redirect_request(request, None, 302, "Found", {}, url)


if __name__ == "__main__":
    unittest.main()
