"""Offline tests for the back-office snapshot (no network)."""
import json
from pathlib import Path
import tempfile
import unittest

import snapshot_site as snap


def page(content, head="<script>head()</script>", foot="<p>footer</p>"):
    return ("<html><head>\n" + snap.HEAD_START + head + snap.HEAD_END + "\n<body>\n"
            + snap.CMS_START + content + snap.CMS_END + ".each(function(){});\n});\n</script>\n"
            + snap.FOOT_START + foot + snap.FOOT_END + "</div>\n</body>\n</html>\n")


class FakeSite:
    def __init__(self, cut=()):
        self.cut, self.calls = set(cut), []

    def __call__(self, url):
        self.calls.append(url)
        path = url[len(snap.SITE):]
        name, _, query = path.partition("?")
        text = page("<p>%s it&#39;s &amp; done</p>" % name).replace("\n", "\r\n")
        if name in self.cut and len(query) < 20:
            return text[:200]
        return text


class SnapshotTests(unittest.TestCase):
    def test_truncated_page_is_retried_with_a_longer_address(self):
        site = FakeSite(cut={"/track.html"})
        text = snap.fetch_page("/track.html", site)
        self.assertTrue(text.endswith("</html>\n"))
        self.assertIn("?snapshot=", site.calls[-1])
        self.assertNotIn("\r\n", text)

    def test_never_complete_page_is_an_error(self):
        with self.assertRaises(snap.SnapshotError):
            snap.fetch_page("/x.html", lambda url: "<html><head>")

    def test_blocks_are_cut_exactly(self):
        blocks, problems = snap.collect(FakeSite())
        self.assertEqual(problems, [])
        self.assertEqual(len(blocks), len(snap.PAGES) + 2)
        self.assertEqual(blocks["cms-39-lineclinicinfo"][1], "<p>/lineclinicinfo.html it&#39;s &amp; done</p>")
        self.assertEqual(blocks["head-code"][1], "<script>head()</script>")
        self.assertEqual(blocks["footer-info"][1], "<p>footer</p>")
        self.assertEqual(blocks["cms-39-lineclinicinfo"][0]["admin"], "/sys_manage/common.php?act=edit&id=39")

    def test_missing_marker_keeps_previous_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            blocks, _ = snap.collect(FakeSite())
            snap.save_live(blocks, root)
            before = (root / "live" / "cms-01-about.html").read_text(encoding="utf-8")
            broken = dict(blocks)
            del broken["cms-01-about"]
            items = snap.save_live(broken, root)
            self.assertEqual((root / "live" / "cms-01-about.html").read_text(encoding="utf-8"), before)
            self.assertIn("cms-01-about", [i["key"] for i in items])

    def test_freeze_status_and_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            blocks, _ = snap.collect(FakeSite())
            snap.save_live(blocks, root)
            snap.freeze("stable-20261103", root)
            with self.assertRaises(snap.SnapshotError):
                snap.freeze("stable-20261103", root)
            for bad in ("live", "../x", "a b", ""):
                with self.assertRaises(snap.SnapshotError):
                    snap.freeze(bad, root)
            meta, _ = blocks["cms-40-lineclinicschedule"]
            blocks["cms-40-lineclinicschedule"] = (meta, "<p>changed</p>")
            snap.save_live(blocks, root)
            snap.write_index_and_status([], root)
            status = (root / "STATUS.md").read_text(encoding="utf-8")
            self.assertIn("## 與 stable-20261103 比較", status)
            self.assertEqual(status.count("**已變更**"), 1)
            self.assertIn("CMS 40", status.split("**已變更**")[0].splitlines()[-1])
            self.assertEqual(json.loads((root / "index.json").read_text())["versions"], ["stable-20261103"])
            frozen = (root / "stable-20261103" / "cms-40-lineclinicschedule.html").read_text(encoding="utf-8")
            self.assertNotEqual(frozen, "<p>changed</p>")

    def test_files_keep_exact_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            meta = {"key": "head-code", "title": "t", "source": "/", "admin": "/sys_manage/x", "field": "f", "encoding": "raw"}
            snap.save_live({"head-code": (meta, "a\nb 'c'")}, root)
            self.assertEqual((root / "live" / "head-code.html").read_bytes(), "a\nb 'c'".encode("utf-8"))


if __name__ == "__main__":
    unittest.main()
