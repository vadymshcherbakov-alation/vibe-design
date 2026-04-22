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

| Intent | Reference |
|---|---|
| Any colour or palette decision | `references/foundations/colours.md` |
| Any typography / text variant choice | `references/foundations/typography.md` |
| Any spacing / padding / margin value | `references/foundations/spacing.md` |
| Any layout / page-width / responsive rule | `references/foundations/layout.md` |
| Any border-radius / elevation | `references/foundations/shape.md` |
| Any icon choice / size / library | `references/foundations/iconography.md` |
| Any Button (variant, color, size, destructive) | `references/components/base/button.md` |
| Any icon-only action trigger | `references/components/base/icon-button.md` |
| Any chip / tag / label | `references/components/base/chip.md` |
| Any free-text input (single-line, multi-line, email / password / number / URL / search) — **Text Field only** | `references/components/base/text-field.md` |
| Any Select · Autocomplete · Checkbox · Radio group · DatePicker — all wrapped by a **Form Field** composite | `references/components/composite/form-field.md` |
| Any bordered / padded surface (panel, container) — the **Card Wrapper** primitive. Not the composite Nav Card / Metric Card. | `references/components/base/card.md` |
| Any inline alert / banner | `references/components/base/alert.md` |
| Any horizontal / vertical separator | `references/components/base/divider.md` |
| Any labeled form control wrapper | `references/components/composite/form-field.md` |
| Any form layout / stack of fields | `references/components/composite/form.md` |
| Any modal / confirm dialog | `references/components/composite/dialog.md` |
| Any clickable entity tile (data source, agent, dashboard) | `references/components/composite/nav-card.md` |
| Any metric / stat / quota surface | `references/components/composite/metric-card.md` |
| Any data table / grid | `references/components/composite/table.md` |
| Any page header (title + actions row) | `references/components/composite/page-header.md` |

## Post-flight

Run the checklist's post-flight verification before returning output. Include the reporting summary block.

## Usage tracking

After every UI generation, append one JSONL entry to `.design-usage.jsonl` at the consumer-project root. Spec in `references/_usage-tracking.md`.
