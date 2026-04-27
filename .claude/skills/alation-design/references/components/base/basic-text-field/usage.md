---
name: basic-text-field
title: Basic Text Field
category: base-component
last_updated: 2026-04-24

description: >
  The single-line free-text input primitive. Rendered as MUI
  `<TextField variant="outlined" />`. Covers plain text plus typed variants
  (email, password, number, URL, search). Multi-line lives in Multiline Text
  Area; choice-from-a-list controls live in Select Input, Autocomplete, etc.
  Always wrap a Basic Text Field in a Form Field; never emit a bare input.
tags: [form, input, text]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5348&t=Ym7BjdwfkXUtQezR-1"
code_reference: fabric-theme-morpheus/src/lib (MuiTextField, MuiOutlinedInput overrides)
example_path: ./Example.tsx

mui_base: TextField
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
  - TextField
---

# Basic Text Field

## 1. Classification

- **Type:** Base component
- **MUI base:** `TextField` (outlined variant only, single-line)
- **Figma:** [Basic Text Field · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5348&t=Ym7BjdwfkXUtQezR-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiTextField.overrides.ts` · `src/lib/MuiOutlinedInput.overrides.ts`

## 2. Purpose

A **Basic Text Field** is where the user types a single line of free text — a name, an email, a password, a number, a URL, or a short search query. It is the most common input surface a **Form Field** can wrap.

Basic Text Field covers single-line text only. For long-form text (descriptions, comments) use **Multiline Text Area**; for code or markdown use **Code Editor** or **Markdown Editor**; for single-choice from a fixed list use **Select Input**.

## 3. When to use / When not to use

**Use when**
- Capturing a single-line free-text value — name, title, short label, search query
- Capturing a typed single-line value MUI's text surface handles: `type="email"`, `"password"`, `"number"`, `"url"`, `"search"`

**Do not use when**
- The field is multi-line free text → use **Multiline Text Area**
- The field contains code or structured syntax → use **Code Editor**
- The field is markdown-formatted prose → use **Markdown Editor**
- The field is a single choice from a fixed short list → use **Select Input** (inside a Form Field)
- The field is a single choice from a large / searchable list → use **Autocomplete** (inside a Form Field)
- The field is a boolean or an on/off toggle → use a **Label Control** (Checkbox / Switch composite — separate reference)
- The field is one of 2–5 visible options → use **Radio group** (inside a Form Field)
- The field is a date / date-time → use **DatePicker** (inside a Form Field)
- The field is on its own in the wild, outside any form semantic → still wrap it in a **Form Field** — the wrapper owns the label, helper text, and accessibility contract

## 4. Contract

### Guarantees
- Always renders as `variant="outlined"` — the only text-surface variant morpheus themes.
- Always single-line; `multiline`, `minRows`, `maxRows` are not used here.
- Every field has a programmatic label (`label` prop on the wrapping Form Field, or `<InputLabel>` + `htmlFor`).
- Error state swaps border colour to `error.main` and links helper text via `aria-describedby`.
- Disabled fields are inert (not focusable).
- Focus ring (border colour switch to `primary.main` at `0.2rem`) is always visible.

### Prohibitions
- No raw `<input>` HTML element.
- No `multiline`, `minRows`, or `maxRows` props — those belong to **Multiline Text Area**.
- No `variant="filled"` or `variant="standard"` — morpheus themes only `outlined`.
- No hard-coded hex / px / font values.
- No `sx` overrides of border / control colour — state visuals are the contract.
- No placeholder used as a substitute for a label.
- No `autoComplete="off"` as a UX default — set it only when the field truly should not autocomplete.
- No `<TextField select>` in this reference — that is **Select Input** and lives in its own reference.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Required fields must carry `aria-required` + a visible indicator (asterisk in label or "Required" in helper text).
- Adornment icons must set `aria-hidden="true"` unless they encode the field's meaning (e.g. a search icon on a search field can be decorative).
- Password-visibility toggle — when `type="password"` needs a reveal affordance, render a trailing `IconButton` with `Eye` / `EyeOff` (lucide) that swaps `type` between `"password"` and `"text"`. The toggle must have `aria-label="Show password"` / `"Hide password"`.
- Error state must fire only after the user has had a chance to complete the field (blur or submit), never on first focus.
- Read-only display of captured data is **not** a Basic Text Field — render a `Typography` next to a label instead. There is no read-only variant here.

## 5. Variants

Variants are **composable axes** — a field picks one value on each axis, not one whole variant.

### 5.1 Adornment (visual shape)

The only visual-shape axis. Picks whether the field carries an icon inside its left / right edge.

| Variant | Props | Typical use |
|---|---|---|
| **No adornment** (default) | `<TextField label="…" />` | Names, titles, plain free text |
| **Leading icon** | `InputProps={{ startAdornment: <Icon aria-hidden="true" /> }}` | Search (`Search`), URL (`Link`), email (`Mail`) |
| **Trailing icon** | `InputProps={{ endAdornment: <Icon aria-hidden="true" /> }}` | Password reveal (`Eye`/`EyeOff`), clear (`X`), unit suffix |
| **Leading + trailing** | Both `startAdornment` and `endAdornment` | Search with clear, URL with external-link action |

Icons come from `lucide-react` (prototype) or `@alation/icons-neo` (production). No emoji, no raw SVG. See [iconography foundation](../../../foundations/iconography/usage.md).

### 5.2 Password visibility

Scoped to `type="password"`. The reveal toggle is a trailing `IconButton`; the field's `type` flips between `"password"` (hidden) and `"text"` (visible).

| Variant | `type` | Trailing icon | Toggle `aria-label` |
|---|---|---|---|
| **Hidden** (default) | `"password"` | `Eye` | "Show password" |
| **Visible** | `"text"` | `EyeOff` | "Hide password" |

### 5.3 HTML `type` (semantic only — not a visual variant)

The `type` prop changes keyboard, validation hints, and browser affordances — **not the visual shape**. Listed for completeness:

| `type` | Use for | Pairs with |
|---|---|---|
| `"text"` (default) | Plain single-line text | — |
| `"email"` | Contact email | Optional `Mail` leading icon |
| `"password"` | Secrets | See 5.2 |
| `"number"` | Numeric values | — |
| `"url"` | Absolute URLs | Optional `Link` leading icon |
| `"search"` | Query input | Usually `Search` leading icon |

### 5.4 `size` prop

| Size | Height | Use |
|---|---|---|
| `medium` (default) | `3.6rem` | Standard forms |
| `small` | `2.8rem` | Dense tables, toolbar-embedded forms |

## 6. Anatomy

- **Container** — outlined rectangle; border colour driven by state.
- **Leading adornment** *(optional)* — icon / short prefix text inside the left edge (e.g. `Search` icon, unit prefix).
- **Value** — user input; `body0` + `fontWeightLight`; `text.primary`.
- **Trailing adornment** *(optional)* — icon (clear, reveal-password) or short suffix.
- **Label / helper text** — owned by the wrapping **Form Field**, not by this primitive.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Border `0.15rem` solid divider-ish | — |
| Hover | Pointer over | Darker border | — |
| Focus-visible | Keyboard focus / click into | Border `primary.main` at `0.2rem` | Never remove |
| Filled | Has value | Same as Default; label stays pinned | Label does not float |
| Error | `error` prop | Border `error.main`; helper text in error colour + ⓘ icon | `aria-invalid` true |
| Disabled | `disabled` prop | Faded border; text `text.disabled` | Not focusable |

## 11. Example

```tsx
import { TextField } from '@mui/material';
import { Search } from 'lucide-react';

// Single-line (wrap in a Form Field at the call site — see form-field/usage.md)
<TextField
  label="Connection name"
  required
  helperText="Used in connection URLs and logs"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Typed — password
<TextField label="Password" type="password" />

// Typed — number
<TextField label="Port" type="number" />

// Typed — search with leading adornment
<TextField
  label="Search"
  type="search"
  InputProps={{
    startAdornment: <Search size={16} aria-hidden="true" />,
  }}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
