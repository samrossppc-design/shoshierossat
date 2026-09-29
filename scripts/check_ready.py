"""Go-live check for shoshierossat.com.

Lists everything still marked "to confirm" (class="tbc"), plus leftover
placeholders and broken internal links. Exits 1 while anything is left, so
the site is only pointed at the domain once this passes.

    python scripts/check_ready.py
"""
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(ROOT.glob("*.html"))

# Leftovers from the Lovable draft or setup that must never go live.
BANNED = {
    "REPLACE_WITH_WEB3FORMS_ACCESS_KEY": "form access key not set",
    "7946 0": "fictional phone number from the Lovable draft",
    "Ruth A.": "example testimonial from the Lovable draft",
    "lovable": "Lovable reference",
}

TBC = re.compile(r'<(?:span|p)[^>]*class="[^"]*\btbc\b[^"]*"[^>]*>(.*?)</(?:span|p)>', re.S)
TAGS = re.compile(r"<[^>]+>")
HREF = re.compile(r'href="([^"#?:]+\.(?:html|svg|css|js|xml|txt))(?:#[^"]*)?"')


def text(fragment):
    return " ".join(html.unescape(TAGS.sub("", fragment)).split())


def main():
    problems = 0
    for page in PAGES:
        src = page.read_text(encoding="utf-8")
        items = [text(m) for m in TBC.findall(src)]
        issues = [f"{why}: {needle!r}" for needle, why in BANNED.items() if needle.lower() in src.lower()]
        for href in HREF.findall(src):
            target = ROOT / href.lstrip("/")
            if not target.exists():
                issues.append(f"broken link: {href}")
        if not re.search(r"<title>[^<]+</title>", src):
            issues.append("missing <title>")
        if 'name="description"' not in src:
            issues.append("missing meta description")
        if "draft: remove at launch" in src:
            issues.append("still hidden from search engines (remove the draft noindex line)")
        if items or issues:
            print(f"\n{page.name}")
            for item in items:
                print(f"  to confirm: {item}")
            for issue in issues:
                print(f"  PROBLEM:    {issue}")
            problems += len(items) + len(issues)

    if not (ROOT / "CNAME").exists():
        print("\nnote: no CNAME file, so the site is not attached to shoshierossat.com")

    if problems:
        print(f"\nNOT READY: {problems} item(s) left.")
        return 1
    print("\nREADY: nothing left to confirm.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
