---
name: alation-design
description: Generate Alation-consistent UI. Every element must be looked up in references/ before generating — SKILL.md redirects you to the right reference file.
---

# Alation Design skill

This file is an **index**, not a rulebook. Every rule lives in a reference file under `references/`. SKILL.md just tells you which file to open for which need. When a rule changes, only the reference file changes — this file stays stable.

## Cross-cutting principles

These apply everywhere and are short enough to stay inline. Anything longer lives in a reference file.

- **MUI components only** — no raw HTML, no third-party UI libs
- **No visual `sx` overrides** on MUI components — layout `sx` on `<Box>` only
- **All text uses `<Typography variant="…">`** — no raw `<h1>` / `<p>` / `<span>`
- **Sentence case for UI text** (exceptions: product / module proper names)
- **lucide-react for UI icons**; Alation SVG assets for the nav rail only

## Pre-flight

Open the checklist and follow every pre-flight step before generating anything.

@design-checklist.md

## Redirection table — always read the matching reference file before generating

For any intent on the left, open the file on the right. If a reference does not yet exist for a given intent, flag it in the output summary under `References missing:` and stop — do not improvise.

Each reference lives in a per-element folder that contains three files:

- `usage.md` — the rule content (read this first; **the contract block lives here**)
- `Example.tsx` — the canonical runnable pattern. Copy this as the starting point for generated code — do not reconstruct from prose.
- `preview.html` — static homepage preview (for the browsable catalog; humans view this, AI reads `usage.md` + `Example.tsx`)

| Intent | Reference |
|---|---|
| Any colour or palette decision | `references/foundations/colours/usage.md` |
| Any typography / text variant choice | `references/foundations/typography/usage.md` |
| Any spacing / padding / margin value | `references/foundations/spacing/usage.md` |
| Any layout / page-width / responsive rule | `references/foundations/layout/usage.md` |
| Any border-radius / elevation | `references/foundations/shape/usage.md` |
| Any icon choice / size / library | `references/foundations/iconography/usage.md` |
| Any Button (variant, color, size, destructive) | `references/components/base/button/usage.md` |
| Any icon-only action trigger | `references/components/base/icon-button/usage.md` |
| Any chip / tag / label | `references/components/base/chip/usage.md` |
| Any free-text input (single-line, multi-line, email / password / number / URL / search) — **Text Field only** | `references/components/base/text-field/usage.md` |
| Any Select · Autocomplete · Checkbox · Radio group · DatePicker — all wrapped by a **Form Field** composite | `references/components/composite/form-field/usage.md` |
| Any bordered / padded surface (panel, container) — the **Card Wrapper** primitive. Not the composite Nav Card / Metric Card. | `references/components/base/card/usage.md` |
| Any inline alert / banner | `references/components/base/alert/usage.md` |
| Any horizontal / vertical separator | `references/components/base/divider/usage.md` |
| Any labeled form control wrapper | `references/components/composite/form-field/usage.md` |
| Any form layout / stack of fields | `references/components/composite/form/usage.md` |
| Any modal / confirm dialog | `references/components/composite/dialog/usage.md` |
| Any clickable entity tile (data source, agent, dashboard) | `references/components/composite/nav-card/usage.md` |
| Any metric / stat / quota surface | `references/components/composite/metric-card/usage.md` |
| Any data table / grid | `references/components/composite/table/usage.md` |
| Any page header (title + actions row) | `references/components/composite/page-header/usage.md` |

**Workflow:** After opening `usage.md` for an element, also open the sibling `Example.tsx`. That file is the canonical, tested pattern — use it as the baseline for what you generate and deviate only when the request demands it.

## Post-flight

Run the checklist's post-flight verification before returning output. Include the reporting summary block.

## Usage tracking

After every UI generation, append one JSONL entry to `.design-usage.jsonl` at the consumer-project root. Spec in `references/_usage-tracking.md`.
