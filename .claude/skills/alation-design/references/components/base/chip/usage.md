---
name: chip
title: Chip
category: base-component
last_updated: 2026-04-24

description: >
  A compact pill that labels content in place. Two named styles only — **Label Chip** (non-interactive status / category / tag) and **Object Chip** (interactive pill representing an Alation catalog object). Never use a Chip as a filter pill; that job belongs to Content Switcher.
tags: [label, tag, chip, object-chip]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1"
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiChip.overrides.ts · @alation/alation-ui/src/lib/ObjectChips/"
example_path: ./Example.tsx

mui_base: Chip
depends_on_tokens:
  - palette.primary
  - palette.success
  - palette.warning
  - palette.error
  - palette.info
depends_on_components:
  - Chip
  - ObjectChips
---

# Chip

## 1. Classification

- **Type:** Base component
- **MUI base:** `Chip`
- **Figma:** [Chip · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiChip.overrides.ts` · `@alation/alation-ui` — `src/lib/ObjectChips/`

## 2. Purpose

A **Chip** is a compact pill that rides inline with content and labels what it sits next to — a status, a category, a tag, or an Alation catalog object. It says "this thing *is* a …" in one glance, without surrounding words.

Only two named styles exist: **Label Chip** (non-interactive, drawn from a fixed 12-colour palette) and **Object Chip** (an interactive version of a Label Chip that represents a catalog object — clickable to open its overlay and removable via a close affordance).

## 3. When to use / When not to use

**Use when**
- Marking a row, card, or heading with a **status, category, or tag** that a reader only needs to glance at — use **Label Chip**. Label Chips are read-only; the full label (and any tooltip) sits on hover.
- Representing an **Alation catalog object** (person, dataset, agent, term, dashboard) inline so a user can add it, click through to its overlay, or remove it — use **Object Chip**. Think of it as an interactive Label Chip: the user *does something* with it.

**Do not use when**
- You need a filter pill or segmented toggle ("Databases / Dashboards / Agents") — use **Content Switcher**. Chips are not filters.
- The label needs to trigger a page-level action → use **Button**.
- The value is an icon only → use **IconButton**.
- The content is a full sentence or wraps across lines → use **Typography**.
- You would need to set colour / height / font-size via `sx` — stop; that means the use case doesn't fit a Chip.

## 4. Contract

### Guarantees
- Theme applies size, font, radius, and colour per named style. Consumers never paint a chip.
- **Label Chip** is non-interactive. No `onClick`, no `onDelete`, no hover affordance beyond an optional tooltip.
- **Object Chip** (via `<ObjectChips>`) is interactive — it supports both *clicking* (opens the object's overlay / detail drawer for that `otype`) and *removing* (close-X affordance fires `onDelete`). Both behaviours live on the same chip.
- Every Label Chip colour maps to one of the 12 documented palette keys (§5.1). No ad-hoc backgrounds.
- When a Label Chip maps to a semantic status (success, warning, error, info), the palette already encodes the correct tone.

### Prohibitions
- **Never use a Chip as a filter pill or segmented toggle.** Filter-style selection is owned by **Content Switcher** (net-new — flag if missing).
- **Never pass `onClick` / `onDelete` on a raw `<Chip>`.** Interactive behaviour belongs to Object Chip only, through `<ObjectChips>`.
- No `sx` that changes appearance (`fontSize`, `height`, `backgroundColor`, `color`, `borderRadius`). Those belong in the theme override.
- No invented colour outside the 12 palette keys in §5.1.
- No `<ObjectChips>` for free-text names — the wrapper expects catalog `items` with `otype`, not bare strings.
- No chip row with more than ~5 chips visible at once — use a truncated list with "+N more".
- Nothing outside §5 Variants is valid.

### Conditions
- `sx` on a chip is permitted for **layout only** (`maxWidth`, `margin`, `flex`).
- Object Chips must be reachable by keyboard — Tab to focus, Enter to open the overlay, Backspace/Delete to remove. `<ObjectChips>` handles this.
- When a Label Chip encodes a status, pick the matching palette colour (e.g. `green` for Active, `red` for Deprecated) — don't use `neutral` for statuses.
- Tooltip is allowed on a Label Chip when the full text is truncated or the label needs context.

## 5. Variants

### 5.1 Named styles

Only these two are valid. Anything else — filters, removable tokens, Beta markers, marketing gradients — is outside Chip's scope.

| Named style | Role | Interactive | Backed by |
|---|---|---|---|
| **Label Chip** | Status / category / tag / metadata badge, drawn from the 12-colour palette. Read-only; tooltip on hover is the only affordance. | No | MUI `<Chip>` + theme |
| **Object Chip** | Inline pill for an Alation catalog object (person, dataset, agent, term, dashboard). Same shape as Label Chip but **clickable** (opens the object overlay) and **removable** (close-X fires `onDelete`). | Yes — click + remove | `<ObjectChips>` from `@alation/alation-ui` |

### 5.2 Label Chip · colour palette

Twelve colours, each a semantic label role. Pick by meaning, not by matching brand accents.

| Colour | Typical use |
|---|---|
| `neutral` | Generic label, no status emphasis (e.g. MCP, source type) |
| `blue` | Native / primary attribute |
| `green` | Active / success status |
| `red` | Deprecated / error state |
| `purple` | Catalog-level grouping |
| `orange` | Beta / experimental |
| `teal` | Lineage / data-flow label |
| `emerald` | Healthy |
| `cyan` | Info |
| `amber` | Warning |
| `pink` | Preview |
| `violet` | Custom / user-defined |

### 5.3 Size

| Size | Use |
|---|---|
| `xsmall` | Dense surfaces — table row status, card badge. Default for Label Chip in lists. |
| `small` | Most UI — inline labels next to headings, chip rows on cards. |
| `medium` | Rare; reserved for hero surfaces. |

Object Chips default to `small` — the overlay affordance needs the extra reach.

## 6. Anatomy

- **Container** — pill shape (theme `borderRadius`); background per palette colour (Label Chip) or neutral chip surface with avatar slot (Object Chip).
- **Label** — single line; theme typography (`caption` at `xsmall`, `body2` at `small`+).
- **Leading icon / avatar** *(Object Chip only)* — `otype`-specific glyph or user avatar at the leading edge.

## 7. States

Label Chip is non-interactive — its only state is Default (with an optional tooltip on hover). Object Chip is fully interactive — both the chip surface and the close-X carry states.

| State | Applies to | Trigger | Visual |
|---|---|---|---|
| Default | Label + Object | Idle | Pill in its palette colour (Label) or neutral surface (Object) |
| Hover (surface) | Object only | Pointer over the chip body | Subtle darken on the chip surface |
| Hover (close-X) | Object only | Pointer over the close affordance | Close icon circle darkens; chip body stays in hover state |
| Focus-visible | Object only | Keyboard focus (Tab) | Theme focus ring on the chip; close-X focus ring on Shift-Tab |
| Disabled | Object only | `disabled` prop on `<ObjectChips>` item | Faded label + container; click and close-X blocked |

## 10. UX Copy

- Label Chip text is a single noun or short noun phrase — "Active", "Deprecated", "Beta", "Native". Sentence case.
- Object Chip text is the object's canonical name (person full name, dataset name, agent name). The wrapper handles casing.
- Never put punctuation at the end of a chip label.
- Never repeat the column header inside a chip ("Status: Active" → just "Active").

## 11. Example

```tsx
import { Chip, Stack, Typography } from '@mui/material';
import { ObjectChips } from '@alation/alation-ui';

// Label Chips — non-interactive status / category badges
<Stack direction="row" spacing={1}>
  <Chip label="Active"     color="success" size="xsmall" />
  <Chip label="Deprecated" color="error"   size="xsmall" />
  <Chip label="Beta"       color="warning" size="xsmall" />
  <Chip label="Native"     color="info"    size="xsmall" />
</Stack>

// Object Chips — interactive catalog objects (clickable + removable)
<ObjectChips
  items={[
    { otype: 'user',    id: 123, name: 'Vadym Shcherbakov' },
    { otype: 'dataset', id: 456, name: 'finance_prod' },
    { otype: 'agent',   id: 789, name: 'ingest_agent' },
  ]}
  chipsClickable
  onDelete={(item) => removeFromSelection(item)}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
