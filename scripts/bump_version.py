"""Bump the ?v= number on the stylesheet and script links in every page, so
browsers fetch the new files straight away instead of a saved copy.

Run before publishing any change to assets/css/site.css or assets/js/site.js:

    python scripts/bump_version.py
"""
import pathlib
import re
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK = re.compile(r'(assets/(?:css/site\.css|js/site\.js))(\?v=\d+)?"')

version = time.strftime("%Y%m%d%H%M%S")
changed = 0
for page in sorted(ROOT.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    new, n = LINK.subn(lambda m: f'{m.group(1)}?v={version}"', text)
    if n:
        page.write_text(new, encoding="utf-8", newline="\n")
        changed += 1
print(f"version {version} set on {changed} pages")
