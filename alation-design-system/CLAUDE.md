# Alation Design System

You are working in a project that uses the Alation design system. The canonical skill lives at `skills/alation-design/` — open `SKILL.md` and follow its redirection table. Every UI request must consult the skill.

## Skill entry

@skills/alation-design/SKILL.md

## How the skill is organised

- **SKILL.md** — pure redirection. Tells you which reference file to open for which intent.
- **design-checklist.md** — pre-flight + post-flight + fallback semantics.
- **references/** — rule content (every `.md` has a matching `-preview.html` sibling):
  - `foundations/` — colours, typography, spacing, layout, shape, iconography
  - `components/base/` — Button, IconButton, Chip, TextField, Card, Alert, Divider
  - `components/composite/` — Form Field, Form, Dialog, Nav Card, Metric Card, Page Header, Table
  - `_usage-tracking.md` — spec for `.design-usage.jsonl`

## Browsable homepage

The subrepo root contains `index.html` — a static homepage with a left-hand catalog (Foundations · Components [Base/Composite] · Patterns · Page Templates) and an iframe that loads the matching `-preview.html`. Every preview has a collapsible **"View source"** button at the bottom that reveals the verbatim `.md` inline. The homepage is the default Vercel route (see `vercel.json`).

When a `.md` file changes, the preview's embedded source goes stale. Re-sync with:

```bash
python3 scripts/inject_md_footer.py .
```

When adding a new component reference:
1. Author `<element>.md` using the matching template under `../../templates/documentation/`.
2. Author `<element>-preview.html` next to it.
3. Run the inject script to embed the md source in the preview.
4. Add a nav entry in `index.html` under the correct category.

IMPORTANT: Do not invent components, tokens, or patterns outside what the references document. If something is missing, flag it in the output summary and stop — do not improvise.
