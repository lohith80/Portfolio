"""Extract Lighthouse scores + key audit results from a saved LHR HTML file.

Looks for window.__LIGHTHOUSE_JSON__ = {...}; embedded in the viewer shell.
"""
import json
import os
import re
import sys
import tempfile

LABELS = [
    ("home", "lhr-home.html"),
    ("detections", "lhr-det.html"),
    ("triage", "lhr-triage.html"),
    ("attack-matrix", "lhr-matrix.html"),
]

AUDITS_OF_INTEREST = [
    # perf hints we expected to flip
    "uses-rel-preconnect",
    "legacy-javascript",
    "render-blocking-resources",
    "unused-javascript",
    "unused-css-rules",
    # core web vitals
    "largest-contentful-paint",
    "first-contentful-paint",
    "cumulative-layout-shift",
    "total-blocking-time",
    "speed-index",
    # the three a11y items we targeted on /triage
    "color-contrast",
    "heading-order",
    "label-content-name-mismatch",
    # BP item targeted on /attack-matrix
    "font-size",
    # other common offenders worth checking
    "image-size-responsive",
    "image-alt",
    "link-name",
    "button-name",
    "meta-viewport",
    "document-title",
    "html-has-lang",
    "html-lang-valid",
    "tap-targets",
]


def extract(html: str):
    m = re.search(r"window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.+?\});\s*</script>", html, re.DOTALL)
    if not m:
        return None
    return json.loads(m.group(1))


def fmt_score(cat):
    s = cat.get("score")
    if s is None:
        return "n/a"
    return f"{round(s * 100)}"


def main():
    tmp = os.environ.get("TEMP") or tempfile.gettempdir()
    for label, fname in LABELS:
        path = os.path.join(tmp, fname)
        with open(path, "r", encoding="utf-8") as f:
            data = extract(f.read())
        if not data:
            print(f"[{label}] NO LHR JSON FOUND")
            continue
        cats = data.get("categories", {})
        audits = data.get("audits", {})
        print(f"\n=== /{label if label != 'home' else ''} ===")
        print(
            "  "
            + " | ".join(
                f"{k}: {fmt_score(cats[k])}"
                for k in ("performance", "accessibility", "best-practices", "seo")
                if k in cats
            )
        )
        # Core Web Vitals
        cwv = []
        for aid in ("largest-contentful-paint", "first-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "speed-index"):
            a = audits.get(aid)
            if not a:
                continue
            cwv.append(f"{aid}={a.get('displayValue') or a.get('numericValue') or '?'}")
        print("  CWV: " + " | ".join(cwv))
        # Failing / notable audits
        fails = []
        for aid in AUDITS_OF_INTEREST:
            a = audits.get(aid)
            if not a:
                continue
            score = a.get("score")
            sd = a.get("scoreDisplayMode")
            if sd in ("notApplicable", "informative", "manual"):
                continue
            if score is None:
                continue
            if score < 1:
                title = a.get("title") or aid
                display = a.get("displayValue") or ""
                # details: number of items if list present
                det = a.get("details") or {}
                items = det.get("items") or []
                itm = f" [{len(items)} item(s)]" if items else ""
                fails.append(f"    - {aid}: score={score} {display}{itm}  // {title}")
        if fails:
            print("  FAILING:")
            for line in fails:
                print(line)
        else:
            print("  FAILING: (none from watchlist)")


if __name__ == "__main__":
    main()
