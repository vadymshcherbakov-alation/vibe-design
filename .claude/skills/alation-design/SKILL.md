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

> **MANDATORY — `usage.md` is non-skippable.** For every intent in the request, you MUST open the matching `usage.md` and read its **Contract Block** (Guarantees / Prohibitions / Conditions) **before** writing any code. `Example.tsx` alone is **not** sufficient — it shows a pattern but does not encode prohibitions, conditions, or "do not use when" rules. Reading only `Example.tsx` will silently violate prohibitions you didn't know existed (e.g. `subtitle1` vs `subtitle2` labels inside a Dialog, multi-step flows belonging on a page not a Dialog, `size="xsmall"` on Chip not being supported by the local theme override). The pre-flight Contract Audit (see `design-checklist.md` §3) requires you to **list, in your response, the Prohibitions and Conditions you extracted from each `usage.md`**. If you cannot list them, you have not done the read — go back and do it.

> **When `usage.md` cites `MuiX.overrides.ts/tsx`**, the bundled mirror lives at `references/theme/MuiX.overrides.ts/tsx` (see "Theme bundle" below). Open that file when you need to verify what the override does or confirm it is mirrored into the consumer workspace.

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
| Any single-line free-text input (names, titles, email / password / number / URL / search) | `references/components/base/basic-text-field/usage.md` |
| Any multi-line free-text input (descriptions, comments, release notes — bounded `minRows` / `maxRows`) | `references/components/base/multiline-text-area/usage.md` |
| Any single-choice from a fixed short list (≤ ~20 options) | `references/components/base/select-input/usage.md` |
| Any Autocomplete · DatePicker — wrapped by a **Form Field** composite | `references/components/composite/form-field/usage.md` |
| Any single choice from 2–5 mutually-exclusive visible options — **Radio** group (wrap in a Form Field) | `references/components/base/radio/usage.md` |
| Any form-style selection · opt-in · multi-select row · acknowledgement ("I agree") — **Checkbox** (wrap in a `FormControlLabel` or a Form Field) | `references/components/base/checkbox/usage.md` |
| Any On/Off toggle for a single binary setting (Active/Inactive, Enable/Disable, feature flag, notification on/off) — **Switch** (wrap in a `FormControlLabel`) | `references/components/base/switch/usage.md` |
| Any bordered / padded surface (panel, container) — the **Card Wrapper** primitive. Not the composite Nav Card / Metric Card. | `references/components/base/card-wrapper/usage.md` |
| Any inline alert / banner | `references/components/base/alert/usage.md` |
| Any horizontal / vertical separator | `references/components/base/divider/usage.md` |
| Any text-on-hover affordance (icon-only label, truncated text, short supplementary description) | `references/components/base/tooltip/usage.md` |
| Any labeled form control wrapper | `references/components/composite/form-field/usage.md` |
| Any form layout / stack of fields | `references/components/composite/form/usage.md` |
| Any modal / confirm dialog | `references/components/composite/dialog/usage.md` |
| Any clickable entity tile (data source, agent, dashboard) | `references/components/composite/nav-card/usage.md` |
| Any metric / stat / quota surface | `references/components/composite/metric-card/usage.md` |
| Any data table / grid | `references/components/composite/table/usage.md` |
| Any page header (title + actions row) | `references/components/composite/page-header/usage.md` |
| Any view-switcher inside a single page (2–~7 mutually-exclusive views — Imported / Published, Overview / Schema / Lineage) | `references/components/composite/tabs/usage.md` |
| Any parent-navigation above a Page Header — multi-step **Trail** (2+ levels: object detail, settings sub-page, folder path) or single-step **Back to parent** link (exactly one level deep) | `references/components/composite/breadcrumb/usage.md` |
| Any multi-step ordered flow / wizard (2–~6 sequential steps with progress indicator — connect source, publish data product, onboarding) | `references/components/composite/stepper/usage.md` |
| Any collapsible content section / disclosure surface (settings sections, FAQ, optional config, side-panel groups) | `references/components/composite/accordion/usage.md` |

**Workflow:** After opening `usage.md` for an element, also open the sibling `Example.tsx`. That file is the canonical, tested pattern — use it as the baseline for what you generate and deviate only when the request demands it.

## Theme bundle (runtime prerequisite)

The skill ships a runtime theme bundle at `references/theme/`. Every override file a `usage.md` attributes to "the morpheus theme" has its canonical mirror in this folder. See `references/theme/_index.md` for the full file list, the per-element mapping, and the gaps.

**Mapping rule:**
- `usage.md` cites `MuiButton.overrides.ts` → bundled file is `references/theme/MuiButton.overrides.ts` (same basename).
- This applies to every override file referenced in any `usage.md`.

**Why this matters:** `Example.tsx` is call-site code — it assumes the theme override is registered globally. If the consumer workspace's `componentOverrides` barrel does not include the bundled override, the call-site code renders incorrectly even though it follows every rule in `usage.md`. The `MuiStepIcon` / tiny-step-circle bug is the canonical example.

**Before generating UI in a consumer workspace:**
1. Verify each override file the request depends on is mirrored into the consumer's `componentOverrides` barrel (typical path: `packages/ui/src/theme/componentOverrides/`).
2. If any are missing, mirror them from `references/theme/` — verbatim copy, no edits.
3. If you cannot mirror (read-only workspace, locked package), surface it in the Contract Audit's "Conflicts" line and stop. Do not author inline `sx` workarounds at the call site to compensate — that violates the prohibition the override exists to enforce.

The bundle is **append-only and verbatim**. Never edit a file in `references/theme/` to fix a per-consumer issue — fix it in production morpheus first, then re-mirror.

## Post-flight

Run the checklist's post-flight verification before returning output. Include the reporting summary block.

## Usage tracking

After every UI generation, append one JSONL entry to `.design-usage.jsonl` at the consumer-project root. Spec in `references/_usage-tracking.md`.
