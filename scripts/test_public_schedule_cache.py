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
            self.assertEqual(json.loads(target.read_text()), dict(self.value, source=publisher.SOURCE_MARK))

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

    def test_redirect_rejects_non_eip_or_http(self):
        handler = publisher.EipNoRedirects()
        request = Request(publisher.SOURCE_URL)
        for url in ("http://erp.drking.com.tw/x", "https://evil.example/x", "https://user:password@erp.drking.com.tw/x"):
            with self.assertRaises(publisher.InvalidSnapshot):
                handler.redirect_request(request, None, 302, "Found", {}, url)


def eip_cell(doctor, start="", end="", off=False, changed=False, base_start=None):
    return {"doctor": doctor, "start": start, "end": end, "off": off, "changed": changed, "note": "",
            "baseDoctor": doctor, "baseStart": start if base_start is None else base_start, "baseEnd": end}


def eip_branch(code, start, health=None, weight=None):
    dates = [(datetime.fromisoformat(start).date() + timedelta(days=i)).isoformat() for i in range(7)]
    days = [{"date": d, "md": d[5:], "label": "", "changed": False} for d in dates]
    def board(title, rows, wl):
        empty = {s: [[] for _ in range(7)] for s in publisher.SESSIONS}
        empty.update(rows or {})
        value = {"title": title, "changed": False, "showDates": True, "days": days,
                 "rows": [{"session": s, "days": empty[s]} for s in publisher.SESSIONS]}
        if wl:
            value["isWl"] = True
        return value
    return {"branchCode": code, "branchName": code + "院區",
            "boards": [board(code + "健保", health, False), board(code + "減重", weight, True)]}


def eip_weeks(now=NOW):
    starts = publisher.week_starts(now)
    lists = []
    for start in starts:
        branches = []
        for code in publisher.CODES:
            health = {"早診": [[eip_cell("林永昌", "07:30", "12:00")] for _ in range(7)]}
            weight = {"午診": [[eip_cell("張慧馨", "11:00", "13:00"), eip_cell("闕壯理", "15:00", "17:00")]] + [[] for _ in range(6)]}
            branches.append(eip_branch(code, start, health, weight))
        lists.append(branches)
    return starts, lists


class EipConversionTests(unittest.TestCase):
    def test_eip_snapshot_validates_and_keeps_sheet_shape(self):
        starts, lists = eip_weeks()
        raw = publisher.build_snapshot(starts, lists, NOW - timedelta(seconds=5))
        result = publisher.validate_snapshot(raw, NOW)
        self.assertEqual(result, raw)
        week = result["clinics"][0]["weeks"][0]
        health, weight = week["boards"]
        self.assertEqual((health["kind"], weight["kind"]), ("health", "weight"))
        self.assertEqual(health["rows"][0]["days"][0], [{"name": "林永昌", "start": "7:30", "end": "12:00", "off": False, "changed": False}])
        # a weight visit listed at noon but starting at 11:00 is published in 早診, the 15:00 one stays
        self.assertEqual([c["name"] for c in weight["rows"][0]["days"][0]], ["張慧馨"])
        self.assertEqual([c["name"] for c in weight["rows"][1]["days"][0]], ["闕壯理"])

    def test_doctor_on_leave_becomes_closed_cell(self):
        start = publisher.week_starts(NOW)[0]
        leave = eip_cell("", off=True, changed=True, base_start="15:00")
        leave["baseDoctor"] = "林永昌"
        boards = publisher.convert_branch(start, eip_branch("A", start, None, {"午診": [[leave]] + [[] for _ in range(6)]}))
        self.assertEqual(boards[1]["rows"][1]["days"][0], [{"name": "休診", "start": "", "end": "", "off": True, "changed": True}])

    def test_empty_cells_markup_and_overflow_dropped(self):
        start = publisher.week_starts(NOW)[0]
        cells = [eip_cell(""), eip_cell("<b>x</b>", "08:00", "09:00")] + [eip_cell("醫師" + str(i), "08:00", "09:00") for i in range(10)]
        boards = publisher.convert_branch(start, eip_branch("A", start, {"早診": [cells] + [[] for _ in range(6)]}))
        self.assertEqual([c["name"] for c in boards[0]["rows"][0]["days"][0]], ["醫師" + str(i) for i in range(8)])

    def test_missing_branch_or_wrong_week_is_not_provided(self):
        starts, lists = eip_weeks()
        lists[0] = [b for b in lists[0] if b["branchCode"] != "C"]
        lists[1][3]["boards"][0]["days"][0]["date"] = "2026-01-05"
        raw = publisher.build_snapshot(starts, lists, NOW - timedelta(seconds=5))
        result = publisher.validate_snapshot(raw, NOW)
        unavailable = [c["clinic"] for c in result["clinics"] if c["available"] is False]
        self.assertEqual(unavailable, ["C", "D"])

    def test_branch_without_boards_gets_an_empty_board(self):
        start = publisher.week_starts(NOW)[0]
        boards = publisher.convert_branch(start, {"branchCode": "A", "boards": []})
        self.assertEqual(len(boards), 1)
        self.assertEqual([r["session"] for r in boards[0]["rows"]], list(publisher.SESSIONS))


if __name__ == "__main__":
    unittest.main()
