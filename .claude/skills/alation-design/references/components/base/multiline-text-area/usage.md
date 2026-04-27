---
name: multiline-text-area
title: Multiline Text Area
category: base-component
last_updated: 2026-04-24

description: >
  The multi-line free-text input primitive. Rendered as MUI
  `<TextField multiline variant="outlined" />` with bounded
  `minRows` / `maxRows`. Use for descriptions, comments, and other
  long-form prose. Always wrap a Multiline Text Area in a Form Field;
  never emit a bare textarea.
tags: [form, input, text, multiline]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-1052&t=Ym7BjdwfkXUtQezR-1"
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

# Multiline Text Area

## 1. Classification

- **Type:** Base component
- **MUI base:** `TextField` (outlined, `multiline` + `minRows` / `maxRows`)
- **Figma:** [Multiline Text Area · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-1052&t=Ym7BjdwfkXUtQezR-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiTextField.overrides.ts` · `src/lib/MuiOutlinedInput.overrides.ts`

## 2. Purpose

A **Multiline Text Area** is where the user types a longer piece of free text — a description, a comment, a rationale, a release note. The outlined surface grows within bounded rows so the field can breathe without breaking layout.

Multiline Text Area is one of several input surfaces a **Form Field** can wrap. For single-line text use **Basic Text Field**; for code or structured syntax use **Code Editor**; for markdown-formatted prose use **Markdown Editor**.

## 3. When to use / When not to use

**Use when**
- Capturing free-form prose that can span multiple lines — descriptions, comments, rationales, release notes
- Capturing text the user might paste from elsewhere (quoted content, long URLs list, configuration snippets where syntax highlighting is not required)

**Do not use when**
- The field fits on a single line → use **Basic Text Field**
- The field is code or structured syntax (SQL, JSON, YAML) → use **Code Editor**
- The field is markdown-formatted prose that should preview as rich text → use **Markdown Editor**
- The field is a single choice from a list → use **Select Input**, **Autocomplete**, or **Radio group** (inside a Form Field)
- The field is a boolean or on/off toggle → use a **Label Control** (Checkbox / Switch composite — separate reference)
- The field is on its own in the wild, outside any form semantic → still wrap it in a **Form Field** — the wrapper owns the label, helper text, and accessibility contract

## 4. Contract

### Guarantees
- Always renders as `variant="outlined"` with the `multiline` prop — the only multi-line text surface morpheus themes.
- Always bounded by `minRows` and `maxRows` — never grows unbounded.
- Every field has a programmatic label (`label` prop on the wrapping Form Field, or `<InputLabel>` + `htmlFor`).
- Error state swaps border colour to `error.main` and links helper text via `aria-describedby`.
- Disabled fields are inert (not focusable).
- Focus ring (border colour switch to `primary.main` at `0.2rem`) is always visible.

### Prohibitions
- No raw `<textarea>` HTML element.
- No single-line use — `multiline` is always set; `<TextField />` without `multiline` belongs to **Basic Text Field**.
- No unbounded growth — `minRows` and `maxRows` must both be set.
- No `variant="filled"` or `variant="standard"` — morpheus themes only `outlined`.
- No hard-coded hex / px / font values.
- No `sx` overrides of border / control colour — state visuals are the contract.
- No placeholder used as a substitute for a label.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- `minRows` and `maxRows` must be set together; recommend `minRows={3}` / `maxRows={6}` as the default shape.
- Required fields must carry `aria-required` + a visible indicator (asterisk in label or "Required" in helper text).
- Read-only state uses `InputProps={{ readOnly: true }}` — distinct from disabled (still focusable, still announced).
- Error state must fire only after the user has had a chance to complete the field (blur or submit), never on first focus.
- Letter-count helper (if shown) must update live and announce `aria-live="polite"` only when approaching / exceeding the limit.

## 5. Variants

Variants are **composable axes** — a field picks one value on each axis, not one whole variant.

### 5.1 Resize behaviour

The only behavioural axis. Determines whether the textarea is a **fixed** box or **auto-grows** between bounds.

| Variant | Props | Behaviour |
|---|---|---|
| **Fixed rows** | `minRows === maxRows` (e.g. `minRows={3} maxRows={3}`) | Exactly N rows tall; text beyond scrolls vertically. |
| **Auto-grow (bounded)** (default) | `minRows < maxRows` | Starts at `minRows`; grows line-by-line as user types up to `maxRows`; scrolls beyond. |

Note: MUI's `TextareaAutosize` disables the native `resize` handle — there is no user-draggable corner. Height is controlled entirely by `minRows` / `maxRows`.

### 5.2 Row-bound presets

Not separate variants — recommended starting values for the resize-behaviour axis. Pick the row bounds that fit the data you're capturing.

| Preset | `minRows` / `maxRows` | Use |
|---|---|---|
| **Short** | `2` / `4` | A one-to-four-line comment |
| **Standard** (default) | `3` / `6` | "Description" in a form |
| **Long** | `5` / `12` | "Release notes", "Incident summary" |

### 5.3 Padding size (via `size` prop)

Density axis. The `size` prop changes **internal padding**, not the number of rows (rows drive height; `size` drives how tight the padding feels).

| `size` | Padding density | Use |
|---|---|---|
| `medium` (default) | Standard padding | Standard forms |
| `small` | Compact padding | Dense tables, toolbar-embedded forms |

## 6. Anatomy

- **Container** — outlined rectangle; border colour driven by state; padded for multi-line content.
- **Value** — user input; `body0` + `fontWeightLight`; `text.primary`; wraps within the container.
- **Letter count** *(optional, Form Field–owned)* — right-aligned "n / max" in the helper-text slot.
- **Label / helper text** — owned by the wrapping **Form Field**, not by this primitive.

> **No user-draggable resize handle.** MUI's `TextareaAutosize` sets `resize: none` on the textarea so height is governed by `minRows` / `maxRows` only. Do not re-enable `resize: vertical` in `sx`.

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

// Standard multi-line (wrap in a Form Field at the call site)
<TextField
  label="Description"
  multiline
  minRows={3}
  maxRows={6}
  helperText="Short description of what this source contains"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

// Long-form
<TextField
  label="Release notes"
  multiline
  minRows={5}
  maxRows={12}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
