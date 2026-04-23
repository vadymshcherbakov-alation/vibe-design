---
name: text-field
title: Text Field
category: base-component
last_updated: 2026-04-22

description: >
  The free-text input primitive. A single-line (or multi-line) text field
  rendered as MUI `<TextField variant="outlined" />`. Responsible for text
  input **only** — choice-from-a-list controls (Select, Autocomplete) and
  boolean / date controls live elsewhere and are listed by the Form Field
  composite. Always wrap a Text Field in a Form Field; never emit a bare
  input.
tags: [form, input, text]

figma_url: ""
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

# Text Field

## 1. Classification

- **Type:** Base component
- **MUI base:** `TextField` (outlined variant only)
- **Figma:** Text Field · NEO 2.1 — *not yet linked*
- **Code:** `fabric-theme-morpheus` — `src/lib/` (`MuiTextField`, `MuiOutlinedInput` overrides)

## 2. Purpose

A **Text Field** is where the user types free text — a name, a description, an email, a password, a number, a URL, or a short search query. It is **only** the text-input primitive. The outlined surface with its pinned label communicates "type something here"; the surrounding label and helper text tell the user *what*.

Text Field is one of several input surfaces a **Form Field** composite can wrap. If the field needs a single choice from a fixed list, reach for **Select**; from a large / searchable list, **Autocomplete**; for a boolean, **Checkbox**; for a date, **DatePicker**. This document covers Text Field only.

> **Lexicon** — the three layers you will see across the design system docs and the source code:
>
> | Layer | What it is | Example |
> |---|---|---|
> | **Text Field** (base) | The free-text input surface — MUI `<TextField variant="outlined" />` | `<TextField value={name} onChange={…} />` |
> | Other base components | Select · Autocomplete · Checkbox · Radio · DatePicker · … | `<Select>`, `<Autocomplete>`, etc. |
> | **Form Field** (composite) | Label + (one base component) + Helper text — the smallest complete form unit | `<FormField label="Connection name"><TextField …/></FormField>` |

## 3. When to use / When not to use

**Use when**
- Capturing free single-line text — names, titles, short labels, search queries
- Capturing free multi-line text — descriptions, comments (`multiline` + `minRows` / `maxRows`)
- Capturing a typed value MUI's text surface handles: `type="email"`, `"password"`, `"number"`, `"url"`, `"search"`

**Do not use when**
- The field is a single choice from a fixed short list → use **Select** (inside a Form Field)
- The field is a single choice from a large / searchable list → use **Autocomplete** (inside a Form Field)
- The field is a boolean → use **Checkbox** or **Switch** (inside a Form Field)
- The field is one of 2–5 visible options → use **Radio group** (inside a Form Field)
- The field is a date / date-time → use **DatePicker** (inside a Form Field)
- The field is on its own in the wild, outside any form semantic → still wrap it in a **Form Field** — the wrapper owns the label, helper text, and accessibility contract

## 4. Contract

### Guarantees
- Always renders as `variant="outlined"` — the only text-surface variant morpheus themes.
- Every field has a programmatic label (`label` prop on the wrapping Form Field, or `<InputLabel>` + `htmlFor`).
- Error state swaps border colour to `error.main` and links helper text via `aria-describedby`.
- Disabled fields are inert (not focusable).
- Focus ring (border colour switch to `primary.main` at `0.2rem`) is always visible.

### Prohibitions
- No raw `<input>` or `<textarea>` HTML elements.
- No `variant="filled"` or `variant="standard"` — morpheus themes only `outlined`.
- No hard-coded hex / px / font values.
- No `sx` overrides of border / control colour — state visuals are the contract.
- No placeholder used as a substitute for a label.
- No `autoComplete="off"` as a UX default — set it only when the field truly should not autocomplete.
- No `<TextField select>` or `<TextField>` inside `<Autocomplete renderInput>` documented *here* — those are Select / Autocomplete and they live in their own references (and are wrapped by Form Field, not by this primitive).

### Conditions
- Multi-line fields must set a sensible `minRows` / `maxRows` — unbounded growth breaks layout.
- Required fields must carry `aria-required` + a visible indicator (asterisk in label or "Required" in helper text).
- Read-only state uses `InputProps={{ readOnly: true }}` — distinct from disabled (still focusable, still announced).
- Adornment icons must set `aria-hidden="true"` unless they encode the field's meaning (e.g. a search icon on a search field can be decorative).
- Error state must fire only after the user has had a chance to complete the field (blur or submit), never on first focus.

## 5. Variants

### 5.1 By input shape (props)

| Shape | Props | Example |
|---|---|---|
| **Single-line text** | `<TextField label="…" />` (default) | "Connection name" |
| **Multiline** | `<TextField multiline minRows={3} maxRows={6} />` | "Description" |
| **Typed — email** | `<TextField type="email" />` | "Contact email" |
| **Typed — password** | `<TextField type="password" />` | "Password" |
| **Typed — number** | `<TextField type="number" />` | "Port" |
| **Typed — URL** | `<TextField type="url" />` | "Webhook URL" |
| **Typed — search** | `<TextField type="search" />` (pairs with a leading `Search` adornment) | "Search objects" |

### 5.2 `size` prop

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
| Read-only | `InputProps={{ readOnly: true }}` | Same as Default; text cursor | Still focusable |

## 11. Example

```tsx
import { TextField } from '@mui/material';
import { Search } from 'lucide-react';

// Single-line (wrap in a FormField at the call site — see form-field.md)
<TextField
  label="Connection name"
  required
  helperText="Used in connection URLs and logs"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Multi-line
<TextField
  label="Description"
  multiline
  minRows={3}
  maxRows={6}
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
