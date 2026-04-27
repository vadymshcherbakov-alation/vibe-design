---
name: checkbox
title: Checkbox
category: base-component
last_updated: 2026-04-27

description: >
  The form-field selection primitive — the digital version of a paper form
  checkbox. Rendered as MUI `<Checkbox>`. Use for picking one or more items
  from a list (multi-select), opting in to a setting, or acknowledging a
  statement ("I agree to the terms"). For a binary On/Off toggle of a single
  setting (Active/Inactive, feature flag) use Switch. Always wrap a Checkbox
  in a `<FormControlLabel>` (or a Form Field for validated forms) — the bare
  box never ships in the wild without a programmatic label.
tags: [form, input, choice, multi-select, acknowledgement]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib (MuiCheckbox, MuiFormControlLabel overrides)
example_path: ./Example.tsx

mui_base: Checkbox
depends_on_tokens:
  - palette.primary.main
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.grey.800
  - palette.blue.900
depends_on_components:
  - Checkbox
  - FormControlLabel
---

# Checkbox

## 1. Classification

- **Type:** Base component
- **MUI base:** `Checkbox`
- **Figma:** [Checkbox · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiCheckbox.overrides.tsx` · `src/lib/MuiFormControlLabel.overrides.ts`

## 2. Purpose

A **Checkbox** is the digital version of a paper form field. It captures a **selection or acknowledgement** — picking one or more items from a list (multi-select), opting in to a setting, or confirming a statement like "I agree to the terms".

Checkboxes and Switches are not interchangeable. Reach for a Checkbox when the user is *filling in a form*: each box stands on its own and the action is "tick this". Reach for a **Switch** when the affordance is *flipping a single setting between two opposite states* (On / Off, Active / Inactive). For a single choice from 2–5 mutually-exclusive options use **Radio**; for one option from a longer fixed list use **Select Input**.

## 3. When to use / When not to use

**Use when**
- Picking zero, one, or many items from a list (multi-select rows)
- Capturing an opt-in inside a form — "Send me product updates", "Remember me"
- Capturing an acknowledgement — "I agree to the terms", "I've reviewed the warnings"

**Do not use when**
- The control flips a single setting between two opposite states (Active/Inactive, feature flag On/Off) → use a **Switch**
- The user picks exactly one option from 2–5 visible choices → use a **Radio** group
- The user picks one option from a fixed short list (≤ ~20) → use a **Select Input** (inside a Form Field)
- The user picks many options from a long / searchable list → use a multi-select **Autocomplete**
- The control needs an inline action button next to it → use a **Button** instead; a checkbox is not a trigger
- The label is a full sentence that wraps across lines → reconsider the form layout; long disclosures belong above the field, not as a checkbox label

## 4. Contract

### Guarantees
- Always paired with a programmatic label — either `<FormControlLabel>` or a wrapping Form Field.
- Three checked states are supported and rendered with the morpheus icon set (`CheckboxOutlineBlankIcon`, `CheckboxIcon`, `CheckboxIndeterminateIcon`).
- Indeterminate is a **visual** state only; the underlying value is still boolean. Use it on a parent to indicate "some children selected".
- Focus-visible renders an outline ring (`grey.800` unchecked, `blue.900` checked) at `borderRadius: 0.5rem`.
- Disabled boxes are inert (not focusable). The label colour stays at `text.primary` so the row remains readable.
- Hover does not paint a background — it is a no-op visual.

### Prohibitions
- No raw `<input type="checkbox">` HTML element.
- No bare `<Checkbox>` without a `<FormControlLabel>` (or a Form Field wrapper). The label is the contract.
- No hard-coded hex / px / font values.
- No `sx` overrides of icon, colour, padding, or focus ring — the morpheus override owns the visuals.
- No custom `icon` / `checkedIcon` / `indeterminateIcon` props — the theme already binds the NEO icon set.
- No `color="secondary"` or other forbidden palette values — only `primary` (default) and `default` are themed.
- No checkbox used as an action trigger (commit, delete, open). Checkboxes record state; they do not fire side-effects.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- A group of related checkboxes (multi-select) must be wrapped in a `<FormGroup>` with a shared `<FormLabel>` so screen readers announce the group name.
- A "select-all" parent checkbox must use `indeterminate` when *some* children are checked. When all are checked it becomes `checked`; when none, `unchecked`.
- Required boolean (e.g. "I agree to the terms") must carry `required` and surface validation via the wrapping Form Field's `error` + helper text — never a bespoke red border on the box itself.
- Read-only display of a captured boolean is **not** a Checkbox — render an icon + Typography pair instead.
- For a high-traffic instant-on/off setting, prefer **Switch**; choose Checkbox only if the change is committed on save.

## 5. Variants

Checkbox is a single-axis component. The named-style axis is the **checked state**; size is a secondary axis.

### 5.1 Named styles — checked state

| Named style | Use for | MUI props | Example |
|---|---|---|---|
| **Unchecked** (default) | Off / not selected | `checked={false}` | "Send me product updates" — off |
| **Checked** | On / selected | `checked` | "Send me product updates" — on |
| **Indeterminate** | Parent of a partially-selected group | `indeterminate` | "Select all sources" when some are checked |

### 5.2 `size` prop

| Size | Padding | Use |
|---|---|---|
| `medium` (default) | `theme.spacing(1)` | Standard forms, settings rows |
| `small` | `theme.spacing(0.75, 1)` | Dense table rows, toolbar filters |

### 5.3 `color` prop

| Colour | Role | Notes |
|---|---|---|
| `primary` (default) | Standard checked tint | Use everywhere |
| `default` | Neutral grey checked tint | Rare — only in chrome surfaces where blue would compete |
| ~~`secondary`~~ | ❌ Do not use. No morpheus style. | — |
| ~~`success` / `warning` / `error` / `info`~~ | ❌ Do not use. Status belongs on the field, not the box. | — |

## 6. Anatomy

- **Box** — the square; outline icon when unchecked, filled tick icon when checked, filled bar icon when indeterminate.
- **Label** *(via `<FormControlLabel>`)* — text to the right of the box; `body0`; `text.primary`. Sentence case, verb-first or noun phrase.
- **Helper text** *(optional)* — owned by the wrapping **Form Field** when the checkbox sits inside one; never inline under a bare box.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default — unchecked | Idle, off | Outline-blank icon, `text.secondary` | — |
| Default — checked | Idle, on | Filled tick icon, `primary.main` | — |
| Default — indeterminate | Idle, mixed children | Filled bar icon, `primary.main` | Visual only; value is still boolean |
| Hover | Pointer over | Same icon, no background paint | Hover is a no-op |
| Focus-visible | Keyboard focus | Outline ring `0.2rem`, `grey.800` (unchecked) / `blue.900` (checked), `borderRadius 0.5rem` | Required |
| Disabled | `disabled` prop | Icon `text.disabled`; label stays `text.primary` | Not focusable |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case; ≤ ~6 words; describe what *true* means | "Send me product updates" |
| Group label | Sentence case noun phrase | "Notify me about" |
| Required indicator | Asterisk in the wrapping Form Field label, never on the box | "I agree to the terms *" |
| "Select all" label | Plain "Select all" or "Select all <noun>" | "Select all sources" |

## 11. Example

```tsx
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';

// Single boolean
<FormControlLabel
  control={<Checkbox checked={subscribed} onChange={(e) => setSubscribed(e.target.checked)} />}
  label="Send me product updates"
/>

// Multi-select group with select-all
<FormLabel id="sources-label">Sources</FormLabel>
<FormGroup aria-labelledby="sources-label">
  <FormControlLabel
    control={<Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />}
    label="Select all"
  />
  {sources.map((s) => (
    <FormControlLabel
      key={s.id}
      control={<Checkbox checked={s.selected} onChange={() => toggle(s.id)} />}
      label={s.name}
    />
  ))}
</FormGroup>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
