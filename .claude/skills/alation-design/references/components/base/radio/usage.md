---
name: radio
title: Radio
category: base-component
last_updated: 2026-04-27

description: >
  The single-choice-from-2-to-5-visible-options primitive. Rendered as MUI
  `<Radio>` inside a `<RadioGroup>`. Use when a user picks exactly one option
  from a small set of mutually-exclusive choices that benefit from being seen
  all at once. For longer fixed lists use Select Input; for searchable lists
  use Autocomplete; for booleans use Checkbox or Switch. Always wrap a
  RadioGroup in a Form Field.
tags: [form, input, choice, single-select]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib (MuiRadio overrides)
example_path: ./Example.tsx

mui_base: Radio
depends_on_tokens:
  - palette.primary.dark
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
depends_on_components:
  - Radio
  - RadioGroup
  - FormControlLabel
  - FormLabel
---

# Radio

## 1. Classification

- **Type:** Base component
- **MUI base:** `Radio` (within a `RadioGroup`)
- **Figma:** [Radio · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiRadio.overrides.ts`

## 2. Purpose

A **Radio** lets the user pick exactly one option from a small set of mutually-exclusive choices — a sync cadence, a permission tier, an export format. Radios shine when seeing all options at once helps the decision; the layout itself is the affordance.

Radios always travel in a group and always wrap in a **Form Field** for label and helper text. For 2–5 visible choices, prefer Radio over Select Input; for longer fixed lists use **Select Input**; for large / searchable lists use **Autocomplete**; for a boolean use **Checkbox** or **Switch**.

## 3. When to use / When not to use

**Use when**
- Capturing a single choice from 2–5 mutually-exclusive options
- Seeing all options together aids the decision (sync cadence, access level, export format)
- The options are stable and short enough to render inline

**Do not use when**
- The list has more than ~5 items → use **Select Input** (inside a Form Field)
- The list is large, dynamic, or searchable → use **Autocomplete** (inside a Form Field)
- The user can pick more than one → use **Checkbox** group or multi-select **Autocomplete**
- The control flips a single setting between two opposite states (Active/Inactive, feature flag On/Off) → use a **Switch**
- The user is opting in, acknowledging a statement, or picking one-or-many from a list → use a **Checkbox**
- The labels are long sentences that wrap → reconsider — long descriptions belong in helper text, not radio labels

## 4. Contract

### Guarantees
- Always rendered inside a `<RadioGroup>` so MUI handles the single-selection invariant.
- Every group has a programmatic group label — `<FormLabel>` (with `id` matched to `aria-labelledby`) or the wrapping Form Field's label.
- Each radio is paired with a `<FormControlLabel>` carrying the option's display text and a stable `value`.
- Selected radio shows the filled centre dot in `primary.dark`; unselected radios use `text.secondary` for the outline ring.
- Focus-visible renders an inset outline ring (`0.2rem solid primary.dark`, `outlineOffset: -0.2rem`).
- Disabled radios are inert (not focusable) and tinted `text.disabled`.
- Hover does not paint a background — it is a no-op visual.

### Prohibitions
- No raw `<input type="radio">` HTML element.
- No bare `<Radio>` outside a `<RadioGroup>`. The group is the contract — it owns selection state and keyboard arrow navigation.
- No bare `<RadioGroup>` without a programmatic group label (Form Field label or `<FormLabel>` + `aria-labelledby`).
- No hard-coded hex / px / font values.
- No `sx` overrides of colour, padding, or focus ring — the morpheus override owns the visuals.
- No `color="secondary"` or other forbidden palette values — only `primary` (default) and `default` are themed.
- No mixing checked-state visual with a checkbox tick — radios are always circles.
- No "no selection" sentinel after the user has interacted — once a value is set, one option must remain selected.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Required groups must carry the `required` flag on the wrapping Form Field, with the asterisk in the group label — never on individual radios.
- Group orientation: vertical by default; horizontal (`row`) is allowed only when labels are short and the row fits without truncation.
- A group may render with no default selection on first paint (user must pick) — but the group label must convey that ("Pick one to continue"). Do not introduce an "I prefer not to say" sentinel option without a real semantic need.
- Read-only display of a captured selection is **not** a Radio — render the option's label + a check icon, or a Typography pair.
- Per-option helper text is permitted as a secondary `Typography` line under the radio label — keep it to one line; longer descriptions belong in the group's helper text.

## 5. Variants

Radio is a single-axis component within a group. The named-style axis is the **selection state** of an individual radio; orientation is a group-level axis.

### 5.1 Named styles — selection state

| Named style | Use for | MUI props | Example |
|---|---|---|---|
| **Unselected** (default) | Available, not chosen | `<Radio value="…" />` (group's `value` ≠ this) | "Daily" — when "Hourly" is chosen |
| **Selected** | The current choice | (group's `value` = this radio's `value`) | "Hourly" — current sync cadence |

### 5.2 Group orientation

| Orientation | RadioGroup props | Use when |
|---|---|---|
| **Vertical** (default) | `<RadioGroup>` (no `row`) | Standard forms; labels of any length |
| **Horizontal** | `<RadioGroup row>` | Short labels (≤ ~12 chars) that fit on one line; toolbar / inline controls |

### 5.3 `color` prop

| Colour | Role | Notes |
|---|---|---|
| `primary` (default) | Standard selected dot tint | Use everywhere |
| `default` | Neutral grey selected tint | Rare — only in chrome surfaces where blue would compete |
| ~~`secondary`~~ | ❌ Do not use. No morpheus style. | — |
| ~~`success` / `warning` / `error` / `info`~~ | ❌ Do not use. Status belongs on the field, not the radio. | — |

## 6. Anatomy

- **Outline ring** — circle outline, `text.secondary` when unselected, `primary.dark` when selected.
- **Centre dot** *(selected only)* — filled circle in `primary.dark`.
- **Label** *(via `<FormControlLabel>`)* — text to the right of the ring; `body0`; `text.primary`. Sentence case noun phrase or short label.
- **Group label** *(via `<FormLabel>` or wrapping Form Field)* — names what the group is choosing among.
- **Helper text** *(optional)* — owned by the wrapping **Form Field**; never inline under the group itself.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default — unselected | Idle, not the group's value | Outline ring `text.secondary`, no centre dot | — |
| Default — selected | Idle, this is the group's value | Outline ring + centre dot in `primary.dark` | — |
| Hover | Pointer over | Same icon, no background paint | Hover is a no-op |
| Focus-visible | Keyboard focus | Inset outline ring `0.2rem solid primary.dark`, `outlineOffset: -0.2rem` | Required |
| Disabled | `disabled` prop on the radio (or group) | Ring `text.disabled`; label stays `text.primary` for legibility | Not focusable |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Group label | Sentence case noun phrase; describe the *axis of choice* | "Sync cadence" |
| Option label | Sentence case; ≤ ~4 words; the value, not a sentence | "Hourly", "Daily", "Weekly" |
| Required indicator | Asterisk in the group label, never on individual radios | "Sync cadence *" |
| Per-option helper | One short line under the option label only when necessary | "Recommended for active sources" |

## 11. Example

```tsx
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

// Vertical group (the standard shape — wrap in a Form Field at the call site)
<FormControl>
  <FormLabel id="cadence-label">Sync cadence</FormLabel>
  <RadioGroup
    aria-labelledby="cadence-label"
    name="cadence"
    value={cadence}
    onChange={(e) => setCadence(e.target.value)}
  >
    <FormControlLabel value="hourly"  control={<Radio />} label="Hourly" />
    <FormControlLabel value="daily"   control={<Radio />} label="Daily" />
    <FormControlLabel value="weekly"  control={<Radio />} label="Weekly" />
  </RadioGroup>
</FormControl>

// Horizontal group — short labels only
<RadioGroup row name="format" value={format} onChange={(e) => setFormat(e.target.value)}>
  <FormControlLabel value="csv"  control={<Radio />} label="CSV" />
  <FormControlLabel value="json" control={<Radio />} label="JSON" />
  <FormControlLabel value="xlsx" control={<Radio />} label="XLSX" />
</RadioGroup>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
