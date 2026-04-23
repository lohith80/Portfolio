"""Dump the `details.items` arrays for specific audits so we can see element selectors."""
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

TARGETS = sys.argv[1:] or ["label-content-name-mismatch", "legacy-javascript"]


def extract(html: str):
    m = re.search(r"window\.__LIGHTHOUSE_JSON__\s*=\s*(\{.+?\});\s*</script>", html, re.DOTALL)
    if not m:
        return None
    return json.loads(m.group(1))


def main():
    tmp = os.environ.get("TEMP") or tempfile.gettempdir()
    for label, fname in LABELS:
        path = os.path.join(tmp, fname)
        with open(path, "r", encoding="utf-8") as f:
            data = extract(f.read())
        if not data:
            continue
        audits = data.get("audits", {})
        print(f"\n##### /{label if label != 'home' else ''} #####")
        for aid in TARGETS:
            a = audits.get(aid)
            if not a:
                print(f"[{aid}] missing")
                continue
            print(f"\n[{aid}] score={a.get('score')} display={a.get('displayValue')}")
            det = a.get("details") or {}
            items = det.get("items") or []
            for i, it in enumerate(items):
                # strip massive fields
                clean = {
                    k: v
                    for k, v in it.items()
                    if k not in ("code", "stackTrace", "sourceMaps")
                }
                node = clean.get("node") or {}
                if node:
                    selector = node.get("selector") or node.get("path") or ""
                    snippet = (node.get("snippet") or "")[:200]
                    clean["node_selector"] = selector
                    clean["node_snippet"] = snippet
                    del clean["node"]
                src = clean.get("source") or {}
                if isinstance(src, dict) and "url" in src:
                    clean["src"] = src.get("url")
                    del clean["source"]
                print(f"  item {i}: {json.dumps(clean, indent=2, default=str)[:1200]}")


if __name__ == "__main__":
    main()
