# Alation Design System

Source of truth for Alation's design system — components, foundations, patterns, and page templates. Built to be consumed by AI coding tools (Claude Code, Cursor) so that prototypes and production code use the same components, tokens, and rules.

> **This is not a scaffoldable project.** There is no app to build, no CLI to run, no package to install. It is a documentation repo + Claude skill + static browsable preview site. Point your AI tool at it, or copy the parts you need.

## Browse the docs

A static homepage at [`index.html`](./index.html) at the repo root renders a left-hand catalog (Foundations · Components → Base / Composite · Patterns · Page Templates) with the matching preview HTML in an iframe on the right. Every preview page has an expandable **"View source"** button at the bottom that reveals the verbatim markdown doc inline.

- **Local:** open [`index.html`](./index.html) in a browser (any static file server, or `python3 -m http.server` from this folder).
- **Hosted (Vercel):** deploy this folder as a static project — `index.html` is picked up automatically as the default route. See [`vercel.json`](./vercel.json).
- **Preview inventory:** 20 preview pages covering 6 foundations + 7 base components + 7 composite components. Patterns and Page Templates are nav placeholders (Phase II).

## Who this is for

- **Designers** — reference for how components look, work, and should be used
- **Engineers** — ground truth for component APIs, tokens, and contract rules
- **Product managers** — a shared brain for AI-assisted prototyping so prototypes match what engineers build
- **AI agents** — a structured set of rules, checklists, and references to follow when generating UI

## How to consume this repo

Two supported models:

### 1. Git submodule (recommended for teams)

Pull the repo into your project as a submodule so your team tracks a pinned version and can update it with one command.

```bash
git submodule add https://github.com/<org>/alation-design-system design-system
git submodule update --init
```

Then point your AI tool at the submodule:
- **Claude Code** — add `@design-system/CLAUDE.md` to your project's root `CLAUDE.md`
- **Claude skill** — reference `@design-system/skills/alation-design/SKILL.md`
- **Cursor** — add a project rule that references `@design-system/skills/alation-design/references/...`

Run `git submodule update --remote` to pull the latest docs.

### 2. Plain copy (for quick prototypes)

Clone this repo, copy the files you need into your project:

```bash
git clone https://github.com/<org>/alation-design-system
cp -r alation-design-system/skills/ your-project/design-system/
```

Drawback: no update signal. Re-copy when you need the latest.

## Repo structure

```
alation-design-system/
├── index.html                                 # Browsable preview homepage (sidebar + iframe)
├── vercel.json                                # Static-hosting defaults for Vercel
├── CLAUDE.md                                  # Claude Code entry — redirects to skills/alation-design/
├── README.md
└── skills/
│   └── alation-design/                        # Claude skill
│       ├── SKILL.md                           # Pure redirection file — maps intent → reference
│       ├── design-checklist.md                # Pre-flight + post-flight checklist
│       └── references/                        # Every .md has a matching *-preview.html next to it
│           ├── _usage-tracking.md             # Spec for .design-usage.jsonl
│           ├── foundations/                   # Colours, Typography, Spacing, Layout, Shape, Iconography
│           ├── components/
│           │   ├── base/                      # Button, IconButton, Chip, TextField, Card, Alert, Divider
│           │   └── composite/                 # Form Field, Form, Dialog, Nav Card, Metric Card, Page Header, Table
│           ├── patterns/                      # (Phase II)
│           └── page-templates/                # (Phase II)
└── templates/
    └── documentation/                         # Template v2 — foundation / base / composite / pattern / page-template
```

### Authoring rule — previews stay in sync with docs

Each `<element>.md` has a matching `<element>-preview.html` beside it. Every preview embeds its source markdown (base64) in a collapsible "View source" block at the bottom, so the preview carries the canonical doc with it. When a `.md` is edited, re-inject the embedded source:

```bash
# from the subrepo root
python3 scripts/inject_md_footer.py .
```

The script is idempotent — it strips the previous injection before re-embedding. If the script is missing, the injection pattern lives at the bottom of any `-preview.html` between `<!-- md-viewer-begin -->` and `<!-- md-viewer-end -->`.

### Design principles for this repo

- **SKILL.md is an index, not a rulebook.** All rules live in reference files. When a rule changes, only the reference file changes — SKILL.md stays stable.
- **One source of truth** — all content lives in `skills/alation-design/references/`.
- **Tool-agnostic core** — plain markdown, readable by any AI tool.
- **Progressive disclosure** — small entry files at the root; detail loads on demand.
- **No code, docs only** — this repo does not ship components. Components live in [alation-ui](https://github.com/alation/alation-ui). This repo tells you how to use them.

## Contributing

Use the templates in [`templates/documentation/`](templates/documentation/) when adding a new component, foundation, or pattern doc. Every new doc lands under the matching folder in `skills/alation-design/references/`.

Contribution guidelines will be formalised in Phase III.

## Status

Phase I (Scaffolding & Alignment) — complete. Skill structure live; templates v2 landed; three validated pilots (Button, Form Field, Colours) reformatted. Phase II populates the rest based on the [master audit](https://github.com/<org>/alation-design-system-assist/blob/main/activities/audit/output/master-audit.md) ranking.
