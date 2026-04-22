#!/usr/bin/env python3
"""Inject a collapsible 'view source md' footer into every preview HTML."""
import base64
import glob
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
REFS = os.path.join(ROOT, "skills/alation-design/references")

FOOTER = r'''<!-- md-viewer-begin -->
<style>
  .md-viewer {
    max-width: 960px;
    margin: 48px auto 0 auto;
    padding: 0 32px 40px 32px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .md-viewer-toggle {
    all: unset;
    box-sizing: border-box;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    font-size: 13px; font-weight: 500;
    color: #4E4E58;
    background: #F1F4F6;
    border: 1px solid #E8EDF1;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
  }
  .md-viewer-toggle:hover { background: #E8EDF1; color: #0D1322; }
  .md-viewer-toggle:focus-visible { outline: 2px solid #0073DD; outline-offset: 2px; }
  .md-viewer-toggle .chev { display: inline-flex; transition: transform 0.15s ease; }
  .md-viewer[data-open="true"] .md-viewer-toggle .chev { transform: rotate(90deg); }
  .md-viewer-filename {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11px;
    color: #B7B7C1;
    margin-left: 4px;
  }
  .md-viewer-pre {
    display: none;
    margin: 12px 0 0 0;
    padding: 20px 24px;
    background: #FFFFFF;
    border: 1px solid #E8EDF1;
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #0D1322;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
    max-height: 640px;
    overflow-y: auto;
  }
  .md-viewer[data-open="true"] .md-viewer-pre { display: block; }
</style>
<div class="md-viewer" data-open="false" data-md-b64="__B64__">
  <button class="md-viewer-toggle" type="button" aria-expanded="false">
    <span class="chev" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </span>
    View source
    <span class="md-viewer-filename">__FILENAME__</span>
  </button>
  <pre class="md-viewer-pre" aria-hidden="true"></pre>
</div>
<script>
  (function () {
    var host = document.currentScript.previousElementSibling;
    while (host && !host.classList.contains('md-viewer')) host = host.previousElementSibling;
    if (!host) return;
    var btn = host.querySelector('.md-viewer-toggle');
    var pre = host.querySelector('.md-viewer-pre');
    try {
      var b64 = host.getAttribute('data-md-b64') || '';
      // UTF-8 safe base64 → string
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      pre.textContent = new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
      pre.textContent = '(failed to load source)';
    }
    btn.addEventListener('click', function () {
      var open = host.getAttribute('data-open') === 'true';
      host.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      pre.setAttribute('aria-hidden', open ? 'true' : 'false');
    });
  })();
</script>
<!-- md-viewer-end -->
'''

previews = sorted(glob.glob(os.path.join(REFS, "**/*-preview.html"), recursive=True))
updated, skipped = 0, 0

for preview in previews:
    md_path = preview.replace("-preview.html", ".md")
    if not os.path.exists(md_path):
        print(f"SKIP (no md): {preview}")
        skipped += 1
        continue
    with open(md_path, "rb") as f:
        md_b64 = base64.b64encode(f.read()).decode("ascii")
    filename = os.path.basename(md_path)

    with open(preview, "r", encoding="utf-8") as f:
        html = f.read()

    # Remove any previous injection so re-runs are idempotent
    html = re.sub(
        r"<!-- md-viewer-begin -->.*?<!-- md-viewer-end -->\s*",
        "",
        html,
        flags=re.DOTALL,
    )

    footer = FOOTER.replace("__B64__", md_b64).replace("__FILENAME__", filename)

    if "</body>" not in html:
        print(f"SKIP (no </body>): {preview}")
        skipped += 1
        continue

    new_html = html.replace("</body>", footer + "\n</body>", 1)

    with open(preview, "w", encoding="utf-8") as f:
        f.write(new_html)
    updated += 1

print(f"\nUpdated {updated}, skipped {skipped}, total {len(previews)}")
