"""Public-field, freshness and no-partial-publication regression tests."""
import copy
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.request import Request

import publish_public_vaccine as publisher

NOW = datetime(2026, 10, 28, 4, 0, tzinfo=timezone.utc)


def fixture(now=NOW):
    generated = now.astimezone(publisher.TAIPEI).strftime("%Y-%m-%d %H:%M")
    return {"vaccines": list(publisher.VACCINES), "generatedAt": generated,
            "latestUpdate": "2026-10-27 21:32", "clinics": [
                {"name": name, "qty": [0, None, "不提供"], "updatedAt": "2026-10-27 21:32"}
                for name in publisher.CLINICS]}


class VaccineCacheTests(unittest.TestCase):
    def setUp(self):
        self.value = fixture()

    def rejected(self, value, now=NOW):
        with self.assertRaises(publisher.InvalidSnapshot):
            publisher.validate_snapshot(value, now)

    def test_valid_all_thirteen_and_three_distinct_quantity_states(self):
        self.assertEqual(publisher.validate_snapshot(self.value, NOW), self.value)
        self.assertEqual(self.value["clinics"][0]["qty"], [0, None, "不提供"])

    def test_private_fields_never_emitted_or_mutated(self):
        self.value.update(updatedBy="secret", token="secret", v=11)
        self.value["clinics"][0].update(updatedBy="secret", notes="secret")
        result = publisher.validate_snapshot(self.value, NOW)
        self.assertEqual(set(result), {"vaccines", "clinics", "latestUpdate", "generatedAt"})
        for clinic in result["clinics"]:
            self.assertEqual(set(clinic), {"name", "qty", "updatedAt"})
        self.assertNotIn("secret", json.dumps(result))
        self.assertEqual(self.value["clinics"][0]["updatedBy"], "secret")

    def test_source_order_normalized_by_public_clinic_whitelist(self):
        self.value["clinics"].reverse()
        result = publisher.validate_snapshot(self.value, NOW)
        self.assertEqual([clinic["name"] for clinic in result["clinics"]], list(publisher.CLINICS))

    def test_partial_duplicate_unknown_and_empty_clinics_fail(self):
        for change in [lambda r: r["clinics"].pop(), lambda r: r["clinics"].clear(),
                       lambda r: r["clinics"][0].update(name="unknown"),
                       lambda r: r["clinics"][0].update(name=r["clinics"][1]["name"])]:
            value = fixture()
            change(value)
            self.rejected(value)

    def test_quantity_bad_types_bounds_and_length(self):
        for bad in [False, True, -1, 1.5, 1000001, "0", {}, []]:
            with self.subTest(bad=bad):
                value = fixture()
                value["clinics"][0]["qty"][0] = bad
                self.rejected(value)
        self.value["clinics"][0]["qty"].pop()
        self.rejected(self.value)

    def test_reordered_or_missing_vaccine_columns_fail(self):
        self.value["vaccines"].reverse()
        self.rejected(self.value)
        self.value = fixture()
        del self.value["vaccines"]
        self.rejected(self.value)

    def test_invalid_date_does_not_normalize_silently(self):
        for date in ["2026-02-30 12:00", "2026-10-28 24:00", "2026-1-2 03:00", "bad"]:
            value = fixture()
            value["generatedAt"] = date
            self.rejected(value)

    def test_source_age_and_future_bounds(self):
        publisher.validate_snapshot(self.value, NOW + timedelta(seconds=300))
        self.rejected(self.value, NOW + timedelta(seconds=301))
        self.rejected(self.value, NOW - timedelta(seconds=61))

    def test_future_clinic_time_and_latest_time_inconsistency_rejected(self):
        self.value["clinics"][0]["updatedAt"] = "2026-10-29 00:00"
        self.rejected(self.value)
        self.value = fixture()
        self.value["latestUpdate"] = "2026-10-27 21:31"
        self.rejected(self.value)

    def test_explicit_null_reporting_valid_but_missing_dates_rejected(self):
        for clinic in self.value["clinics"]:
            clinic["updatedAt"] = None
        self.value["latestUpdate"] = None
        self.assertEqual(publisher.validate_snapshot(self.value, NOW), self.value)
        del self.value["clinics"][0]["updatedAt"]
        self.rejected(self.value)

    def test_response_only_fixed_jsonp_callback_and_bounded_size(self):
        response = (publisher.CALLBACK + "(" + json.dumps(self.value) + ");").encode()
        self.assertEqual(publisher.parse_response(response), self.value)
        for body in [b"wrong({});", b"vaccineCacheReadback({});evil();", b"<html>login</html>", b"\xff", b"x" * (publisher.MAX_RESPONSE_BYTES + 1)]:
            with self.assertRaises(publisher.InvalidSnapshot):
                publisher.parse_response(body)

    def test_redirect_allowlist(self):
        handler = publisher.GooglePublicRedirects()
        request = Request(publisher.SOURCE_URL)
        allowed = handler.redirect_request(request, None, 302, "Found", {}, "https://script.googleusercontent.com/macros/echo?a=b")
        self.assertEqual(allowed.host, "script.googleusercontent.com")
        for url in ["http://script.google.com/x", "https://evil.example/x", "https://x:secret@script.google.com/x"]:
            with self.assertRaises(publisher.InvalidSnapshot):
                handler.redirect_request(request, None, 302, "Found", {}, url)

    def files(self, root, value=None):
        value = value or fixture(NOW - timedelta(minutes=1))
        target, html = root / "public-vaccine/latest.json", root / "linevaccines.html"
        target.parent.mkdir()
        target.write_text(publisher.json_text(value) + "\n")
        html.write_text('<html><script id="lineVaccineSnapshot" type="application/json">' + publisher.json_text(value) + '</script><p>preserved</p></html>')
        return target, html

    def test_updates_cache_and_only_seed_marker_html(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            before = html.read_text()
            self.assertTrue(publisher.publish_snapshot(self.value, target, html, NOW))
            self.assertEqual(json.loads(target.read_text()), self.value)
            embedded = publisher.MARKER.search(html.read_text())
            self.assertEqual(json.loads(embedded.group(2)), self.value)
            self.assertEqual(publisher.MARKER.sub("SEED", before), publisher.MARKER.sub("SEED", html.read_text()))
            self.assertFalse(publisher.publish_snapshot(self.value, target, html, NOW))

    def test_invalid_source_keeps_both_files_byte_identical(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            old = (target.read_bytes(), html.read_bytes())
            self.value["clinics"].pop()
            with self.assertRaises(publisher.InvalidSnapshot):
                publisher.publish_snapshot(self.value, target, html, NOW)
            self.assertEqual(old, (target.read_bytes(), html.read_bytes()))

    def test_missing_duplicate_or_bad_html_marker_keeps_cache(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            old = target.read_bytes()
            good = html.read_text()
            for content in ["<html></html>", good + good, good.replace('"vaccines"', '"bad"')]:
                html.write_text(content)
                with self.assertRaises(publisher.InvalidSnapshot):
                    publisher.publish_snapshot(self.value, target, html, NOW)
                self.assertEqual(target.read_bytes(), old)
                self.assertEqual(html.read_text(), content)

    def test_older_snapshot_and_per_clinic_report_rejected(self):
        previous = fixture()
        with self.assertRaises(publisher.InvalidSnapshot):
            publisher.reject_regression(fixture(NOW - timedelta(minutes=1)), previous)
        newer = fixture(NOW + timedelta(minutes=1))
        newer["clinics"][0]["updatedAt"] = "2026-10-27 21:31"
        with self.assertRaises(publisher.InvalidSnapshot):
            publisher.reject_regression(newer, previous)
        newer["clinics"][0]["updatedAt"] = None
        with self.assertRaises(publisher.InvalidSnapshot):
            publisher.reject_regression(newer, previous)

    def test_same_minute_corrected_count_is_allowed(self):
        # Upstream timestamps have minute precision: two valid updates can share it.
        previous = fixture()
        self.value["clinics"][0]["qty"][0] = 1
        publisher.reject_regression(self.value, previous)

    def test_second_write_failure_restores_first_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            old = (target.read_bytes(), html.read_bytes())
            original = publisher.atomic_write
            def fail_html(path, data):
                if path == html:
                    raise OSError("synthetic")
                original(path, data)
            with patch.object(publisher, "atomic_write", side_effect=fail_html):
                with self.assertRaises(OSError):
                    publisher.publish_snapshot(self.value, target, html, NOW)
            self.assertEqual(old, (target.read_bytes(), html.read_bytes()))

    def test_new_target_is_removed_if_html_write_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            target.unlink()
            original = publisher.atomic_write
            def fail_html(path, data):
                if path == html:
                    raise OSError("synthetic")
                original(path, data)
            with patch.object(publisher, "atomic_write", side_effect=fail_html):
                with self.assertRaises(OSError):
                    publisher.publish_snapshot(self.value, target, html, NOW)
            self.assertFalse(target.exists())

    def test_bad_previous_cache_is_not_silently_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            target, html = self.files(Path(tmp))
            target.write_text("invalid")
            old = html.read_bytes()
            with self.assertRaises(publisher.InvalidSnapshot):
                publisher.publish_snapshot(self.value, target, html, NOW)
            self.assertEqual(target.read_text(), "invalid")
            self.assertEqual(html.read_bytes(), old)


if __name__ == "__main__":
    unittest.main()
