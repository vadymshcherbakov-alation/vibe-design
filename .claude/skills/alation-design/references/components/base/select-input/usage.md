---
name: select-input
title: Select Input
category: base-component
last_updated: 2026-04-24

description: >
  The single-choice-from-a-fixed-set input primitive. Rendered as MUI
  `<TextField select />` (which composes `Select` + `MenuItem` with an
  outlined surface that matches Basic Text Field). Use for a short fixed
  list (≤ ~20 options). For large / searchable lists reach for
  Autocomplete. Always wrap a Select Input in a Form Field; never emit
  a bare select.
tags: [form, input, select, choice]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-628&t=Ym7BjdwfkXUtQezR-1"
code_reference: fabric-theme-morpheus/src/lib (MuiSelect, MuiTextField, MuiMenuItem overrides)
example_path: ./Example.tsx

mui_base: Select
depends_on_tokens:
  - palette.primary.main
  - palette.error.main
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.divider
  - typography.body0
  - shape.borderRadius
depends_on_components:
  - Select
  - TextField
  - MenuItem
---

# Select Input

## 1. Classification

- **Type:** Base component
- **MUI base:** `Select` (via `<TextField select>` in practice — outlined variant)
- **Figma:** [Select Input · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-628&t=Ym7BjdwfkXUtQezR-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiSelect.overrides.ts` · `src/lib/MuiTextField.overrides.ts` · `src/lib/MuiMenuItem.overrides.ts`

## 2. Purpose

A **Select Input** is where the user picks a single value from a short fixed list — a database type, a sync cadence, an access level, a country. The outlined surface with its trailing chevron communicates "pick one"; the surrounding label and helper text tell the user *what*.

Select Input is one of several input surfaces a **Form Field** can wrap. For a large / searchable list use **Autocomplete**; for 2–5 visible options use **Radio group**; for free text use **Basic Text Field** or **Multiline Text Area**. For a boolean or on/off toggle use a **Label Control** (Checkbox / Switch composite — separate reference).

## 3. When to use / When not to use

**Use when**
- Capturing a single choice from a fixed short list (typically ≤ 20 options)
- The options are stable and can be enumerated at render time
- The chosen value is short enough to display fully in the collapsed surface

**Do not use when**
- The list is long or dynamic → use **Autocomplete** (inside a Form Field)
- The options are 2–5 visible, and seeing them all at once aids the decision → use **Radio group** (inside a Form Field)
- The user can choose multiple values → use a multi-select **Autocomplete**, a chip-based multi-select, or a set of **Label Controls** (Checkbox composite — separate reference)
- The field is free text → use **Basic Text Field** or **Multiline Text Area**
- The field is a boolean or on/off toggle → use a **Label Control** (Checkbox / Switch composite — separate reference)
- The field is on its own in the wild, outside any form semantic → still wrap it in a **Form Field** — the wrapper owns the label, helper text, and accessibility contract

## 4. Contract

### Guarantees
- Always renders as outlined — the only text-surface variant morpheus themes.
- Every field has a programmatic label (`label` prop on the wrapping Form Field, or `<InputLabel>` + `labelId`).
- Options are rendered as `<MenuItem value={…}>…</MenuItem>`; each item has a stable `value`.
- Selected value is shown in the collapsed surface; chevron indicates it opens.
- Error state swaps border colour to `error.main` and links helper text via `aria-describedby`.
- Disabled fields are inert (not focusable); disabled options within an open list are inert.
- Focus ring (border colour switch to `primary.main` at `0.2rem`) is always visible.
- Keyboard: Space / Enter / ArrowDown open the list; ArrowUp / ArrowDown move selection; Enter commits; Escape closes.

### Prohibitions
- No raw `<select>` HTML element.
- No `variant="filled"` or `variant="standard"` — morpheus themes only `outlined`.
- No hard-coded hex / px / font values.
- No `sx` overrides of border / control colour — state visuals are the contract.
- No placeholder used as a substitute for a label (an empty-value MenuItem as a prompt is fine — see Conditions).
- No multi-select here — `multiple` belongs to Autocomplete, not Select Input.
- No free-typed values — for "pick or type" use Autocomplete `freeSolo`.
- No long value labels that truncate visibly in the collapsed surface — if they do, switch to Autocomplete.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- An empty-value prompt MenuItem (`<MenuItem value="">Select…</MenuItem>`) is allowed when no default makes sense — it must be distinct from valid values.
- Required fields must carry `aria-required` + a visible indicator (asterisk in label or "Required" in helper text).
- Read-only state uses `readOnly` on the input — distinct from disabled (still focusable, still announced, but not changeable).
- Icons inside a MenuItem must set `aria-hidden="true"` unless they encode the option's meaning.
- Error state must fire only after the user has had a chance to complete the field (blur or submit), never on first focus.
- Long lists approaching the ≤ 20 threshold should be reviewed against Autocomplete before authoring.

## 5. Variants

Variants are **composable axes** — a field picks one value on each axis, not one whole variant.

### 5.1 Leading icon on items

Whether each `MenuItem` carries an icon inside a `ListItemIcon` slot. Icons come from `lucide-react` (prototype) or `@alation/icons-neo` (production) — never emoji, never raw SVG. See [iconography foundation](../../../foundations/iconography/usage.md).

| Variant | Props | Typical use |
|---|---|---|
| **Without** (default) | `<MenuItem value="…">Label</MenuItem>` | "Database type" — Postgres / MySQL / Snowflake |
| **With** | `<MenuItem><ListItemIcon><Icon aria-hidden="true" /></ListItemIcon>Label</MenuItem>` | "Access level" — `Lock` Private / `Users` Team / `Globe` Public |

### 5.2 Grouping

Whether the option list is flat or split into named groups. Adds `<ListSubheader>` rows as non-selectable section headings.

| Variant | Props | Typical use |
|---|---|---|
| **Flat** (default) | `<MenuItem>` × N | Small list with no natural grouping |
| **Grouped** | `<ListSubheader>…</ListSubheader>` + `<MenuItem>` × N | "Region" — Americas / EMEA / APAC |

### 5.3 Prompt row

Whether the list includes an empty-value row inviting selection. Distinct from a placeholder — this is a real `MenuItem` with `value=""`.

| Variant | Props | Use when |
|---|---|---|
| **None** (default) | First `MenuItem` is a real default | A sensible default exists |
| **Empty-value prompt** | `<MenuItem value=""><em>Select a region…</em></MenuItem>` | No default makes sense — user must actively pick |

### 5.4 `size` prop

| Size | Height | Use |
|---|---|---|
| `medium` (default) | `3.6rem` | Standard forms |
| `small` | `2.8rem` | Dense tables, toolbar-embedded forms |

### Modifiers — layered on any variant

Not variants themselves; layer on top of the axes above.

| Modifier | Pattern | Notes |
|---|---|---|
| **Secondary text in item** | `<MenuItem>Primary <Typography variant="caption">…</Typography></MenuItem>` | Supplementary text inline. Keep selected-surface value short — if truncation would hit, move to Autocomplete. |

## 6. Anatomy

- **Container** — outlined rectangle; border colour driven by state.
- **Selected value** — current choice as text; `body0` + `fontWeightLight`; `text.primary`.
- **Placeholder** *(optional)* — shown when no value is selected; `text.disabled`.
- **Trailing chevron** — `ChevronDown` icon; rotates when open.
- **Option list** *(popover, when open)* — elevated surface with `MenuItem` rows; selected item highlighted.
- **Label / helper text** — owned by the wrapping **Form Field**, not by this primitive.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Border `0.15rem` solid divider-ish | — |
| Hover | Pointer over | Darker border | — |
| Focus-visible | Keyboard focus / click into | Border `primary.main` at `0.2rem` | Never remove |
| Open | List expanded | Chevron rotated; popover visible below | Focus trapped in list |
| Filled | Has value | Same as Default; label stays pinned | Label does not float |
| Error | `error` prop | Border `error.main`; helper text in error colour + ⓘ icon | `aria-invalid` true |
| Disabled | `disabled` prop | Faded border; text `text.disabled`; chevron dimmed | Not focusable |
| Read-only | `readOnly` prop | Same as Default; cursor default | Still focusable |

## 11. Example

```tsx
import { MenuItem, TextField } from '@mui/material';

// Simple select (wrap in a Form Field at the call site)
<TextField
  select
  label="Database type"
  value={dbType}
  onChange={(e) => setDbType(e.target.value)}
  helperText="Determines the connection driver"
  required
>
  <MenuItem value="postgres">PostgreSQL</MenuItem>
  <MenuItem value="mysql">MySQL</MenuItem>
  <MenuItem value="snowflake">Snowflake</MenuItem>
</TextField>

// With prompt option
<TextField select label="Region" value={region} onChange={(e) => setRegion(e.target.value)}>
  <MenuItem value=""><em>Select a region…</em></MenuItem>
  <MenuItem value="us">Americas</MenuItem>
  <MenuItem value="eu">EMEA</MenuItem>
  <MenuItem value="apac">APAC</MenuItem>
</TextField>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
