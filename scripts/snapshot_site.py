#!/usr/bin/env python3
"""Snapshot the parts of www.drking.com.tw that are edited in the Sober CMS back office; Python stdlib only.

Every editable block is cut out of the public page exactly as the server sends it and saved under versions/live/:
  - the 11 CMS pages (common.php?act=edit&id=N, field "content"),
  - 頁尾資訊 (config.php?act=bottominfo, field contents[91]),
  - 追蹤碼設定 → 轉換代碼 (config.php?act=code, field gadsevent).
The back-office text is the public text with ' written as &qpos; and HTML entities decoded (versions/restore.js does
this when it loads a version back into the editor). versions/STATUS.md says which blocks differ from each saved version.

    python scripts/snapshot_site.py                    # refresh versions/live
    python scripts/snapshot_site.py --freeze NAME      # also keep this snapshot as versions/NAME (restorable)
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

SITE = "https://www.drking.com.tw"
ROOT = Path("versions")
LIVE = "live"
CMS_START = '<div class="col-xs-12 subcon commondetail">\n\t  \t  '
CMS_END = "\t    </div>\n\n<script>\n$(document).ready(function() {\n  $('.commondetail img')"
HEAD_START = '<!-- InstanceBeginEditable name="head" -->\n'
HEAD_END = "<!-- InstanceEndEditable -->\n</head>"
FOOT_START = '<div class="col-xs-12 nopadding botconmarn">'
FOOT_END = '</div>\n\t\t  \t\t   <div class="col-xs-12 copyright">'
PAGES = (
    (1, "about", "診所介紹"),
    (2, "info_all", "院區資訊"),
    (3, "track", "看診進度"),
    (4, "info_newtaipei", "院區資訊-新北市"),
    (5, "info_taoyuan", "院區資訊-桃園市"),
    (6, "contact_el", "聯絡我們"),
    (18, "trackall", "點選可看單院看診進度"),
    (38, "lineprogress", "點選可看單院詳細進度"),
    (39, "lineclinicinfo", "點選可看單院詳細資訊"),
    (40, "lineclinicschedule", "滑動可查未來四週班表"),
    (41, "linedoctorschedule", "醫師個人班表"),
)
# The server cuts some pages short for certain address lengths (about.html, track.html, contact_el.html ...);
# one of these suffixes always gives the complete page.
SUFFIXES = ("", "?snapshot=0123456789abcdefghijklmnop", "?snapshot=0123456789abcdef", "?v=site-version-snapshot-2026")
NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]{0,47}")


class SnapshotError(RuntimeError):
    pass


def http_get(url):
    request = Request(url, headers={"User-Agent": "DrKing-Site-Version-Snapshot/1", "Cache-Control": "no-cache"})
    with urlopen(request, timeout=40) as response:
        if response.status != 200:
            raise SnapshotError("http %s" % response.status)
        return response.read(8_000_000).decode("utf-8")


def fetch_page(path, get=http_get):
    """A complete page (ending in </html>) with CRLF turned into LF, trying the address suffixes in turn."""
    last = "incomplete"
    for suffix in SUFFIXES:
        try:
            text = get(SITE + path + suffix).replace("\r\n", "\n")
        except (HTTPError, URLError, TimeoutError, OSError, UnicodeDecodeError, SnapshotError) as error:
            last = type(error).__name__
            continue
        if text.rstrip().lower().endswith("</html>"):
            return text
    raise SnapshotError(path + ": " + last)


def between(text, start, end, label):
    s = text.find(start)
    if s < 0:
        raise SnapshotError(label + ": start marker missing")
    e = text.find(end, s + len(start))
    if e < 0:
        raise SnapshotError(label + ": end marker missing")
    return text[s + len(start):e]


def collect(get=http_get):
    """{key: (meta, text)} for every block; blocks that cannot be read are left out and reported."""
    blocks, problems, cached = {}, [], {}
    for page_id, urlname, title in PAGES:
        key = "cms-%02d-%s" % (page_id, urlname)
        meta = {"key": key, "title": "CMS %d %s" % (page_id, title), "source": "/%s.html" % urlname,
                "admin": "/sys_manage/common.php?act=edit&id=%d" % page_id, "field": "content", "encoding": "cms"}
        try:
            cached[urlname] = fetch_page(meta["source"], get)
            blocks[key] = (meta, between(cached[urlname], CMS_START, CMS_END, key))
        except SnapshotError as error:
            problems.append(str(error))
    shared = cached.get("trackall")
    if shared is None:
        try:
            shared = fetch_page("/trackall.html", get)
        except SnapshotError as error:
            problems.append(str(error))
    if shared is not None:
        for key, title, admin, field, encoding, start, end in (
            ("footer-info", "頁尾資訊", "/sys_manage/config.php?act=bottominfo", "contents[91]", "cms", FOOT_START, FOOT_END),
            ("head-code", "追蹤碼設定 轉換代碼", "/sys_manage/config.php?act=code", "gadsevent", "raw", HEAD_START, HEAD_END),
        ):
            meta = {"key": key, "title": title, "source": "/trackall.html", "admin": admin, "field": field, "encoding": encoding}
            try:
                blocks[key] = (meta, between(shared, start, end, key))
            except SnapshotError as error:
                problems.append(str(error))
    return blocks, problems


def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as out:
        out.write(text)


def read_manifest(folder):
    try:
        return json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {"items": []}


def save_live(blocks, root=ROOT):
    """Update versions/live; a block that could not be read keeps its previous file."""
    folder = root / LIVE
    old = {item["key"]: item for item in read_manifest(folder)["items"]}
    items = []
    for key in sorted(set(old) | set(blocks)):
        if key in blocks:
            meta, text = blocks[key]
            item = dict(meta, file=key + ".html", length=len(text), sha256=digest(text))
            write_text(folder / item["file"], text)
        else:
            item = old[key]
        items.append(item)
    write_text(folder / "manifest.json", json.dumps({"items": items}, ensure_ascii=False, indent=1) + "\n")
    return items


def freeze(name, root=ROOT):
    if not NAME.fullmatch(name) or name == LIVE:
        raise SnapshotError("bad version name: " + name)
    target = root / name
    if target.exists():
        raise SnapshotError("version already exists: " + name)
    shutil.copytree(root / LIVE, target)
    return target


def versions(root=ROOT):
    return sorted(p.name for p in root.iterdir() if p.is_dir() and p.name != LIVE and (p / "manifest.json").exists())


def write_index_and_status(problems, root=ROOT):
    names = versions(root)
    write_text(root / "index.json", json.dumps({"live": LIVE, "versions": names}, ensure_ascii=False, indent=1) + "\n")
    live = {item["key"]: item for item in read_manifest(root / LIVE)["items"]}
    lines = ["# 網站後台內容版本狀態", "",
             "每天自動抓一次官網（也可在 Actions 手動執行），把後台可編輯的內容存在 `versions/live/`。",
             "下表是最新快照和每個存檔版本的比較；「已變更」代表後台內容和那一版不同，可用 versions/README.md 的方法回復。", ""]
    if problems:
        lines += ["**這次有讀不到的項目（保留上一次的快照）：**", ""] + ["- " + p for p in problems] + [""]
    for name in reversed(names):
        saved = {item["key"]: item for item in read_manifest(root / name)["items"]}
        lines += ["## 與 " + name + " 比較", "", "| 項目 | 後台位置 | 狀態 |", "|---|---|---|"]
        for key in sorted(set(saved) | set(live)):
            ref = saved.get(key) or live.get(key)
            if key not in saved:
                state = "新增（此版本沒有）"
            elif key not in live:
                state = "讀不到"
            elif saved[key]["sha256"] == live[key]["sha256"]:
                state = "相同"
            else:
                state = "**已變更**"
            lines.append("| %s | `%s` | %s |" % (ref["title"], ref["admin"].replace("/sys_manage/", ""), state))
        lines.append("")
    write_text(root / "STATUS.md", "\n".join(lines))


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--freeze", default="", help="also keep this snapshot as versions/NAME")
    args = parser.parse_args(argv)
    blocks, problems = collect()
    for problem in problems:
        print("::warning::" + problem)
    if not blocks:
        print("Nothing could be read; previous snapshot kept.", file=sys.stderr)
        return 1
    save_live(blocks)
    if args.freeze.strip():
        if problems:
            print("Not frozen: some blocks could not be read.", file=sys.stderr)
            return 1
        print("Saved version " + str(freeze(args.freeze.strip())))
    write_index_and_status(problems)
    print("Snapshot: %d blocks, %d problems." % (len(blocks), len(problems)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
