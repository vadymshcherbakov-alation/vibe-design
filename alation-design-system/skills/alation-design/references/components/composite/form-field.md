---
name: form-field
title: Form Field
category: composite-component
last_updated: 2026-04-21

description: >
  A labeled input unit: label + input surface + helper text. The input surface can be a Text Input, Multi-line, Select, Autocomplete, Checkbox, Radio group, or Date picker — Form Field is the wrapper contract they all share. Use for any single field in a form.
tags: [form, input, composite, wrapper]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-564&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib/ (MuiInputLabel, MuiFormControlLabel, MuiFormHelperText, plus input-surface overrides)
example_path: ./Example.tsx

mui_base: FormControl
depends_on_tokens:
  - palette.primary.main
  - palette.error.main
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.background.default
  - palette.background.darken10
  - palette.background.darken20
  - palette.background.darken50
  - palette.divider
  - typography.body0
  - typography.body1
  - typography.fontWeightLight
  - typography.fontWeightMedium
  - shape.borderRadius
  - spacing
depends_on_components:
  - InputLabel
  - FormControlLabel
  - FormHelperText
  - TextField
  - Select
  - Autocomplete
  - Checkbox
  - Radio
  - DatePicker
---

# Form Field

## 1. Classification

- **Type:** Composite component
- **MUI base:** `FormControl`
- **Figma:** [Form Field · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-564&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — `src/lib/` (Label + HelperText overrides + input-surface overrides: TextField / Select / Autocomplete / Checkbox / Radio / DatePicker)

## 2. Purpose

A labeled input unit. Carries a single field's **label** (optionally with a trailing info icon), an **input surface** (text, select, autocomplete, checkbox, radio group, or date picker), and **helper / error text** — the smallest complete block of a form.

**Form Field is the one composite; the input surfaces are the base components.** Form Field doesn't "contain" any specific input — it's the **wrapper contract** every input shape fills: label above, input surface in the middle, helper / error text below. Swap the base component inside (TextField → Select → Checkbox → Autocomplete → DatePicker) and the wrapper, labelling, spacing, required / error / disabled semantics all stay the same. Conceptually:

> **Form Field** = **Label** + *(one base component)* + **Helper text**

Where *(one base component)* comes from the list in §6 (Input types): [Text Field](../base/text-field.md) (the most common — single-line, multi-line, number, password), `Select`, `Autocomplete`, `Checkbox`, `RadioGroup` + `Radio`, or `DatePicker` / `DateTimePicker`.

**For users:** a Form Field always feels the same — one label, one thing to enter, one hint line. The input shape changes, but how the field is read, filled, validated, and announced to assistive tech does not.

**For an LLM / AI agent writing code:** reach for the Form Field composite any time you need a labelled input; pick the base component from §6 based on the data type (free text → Text Field; single-choice from a small set → Select; boolean → Checkbox; etc.). Never emit a bare input — the wrapper owns the label, helper text, `aria-describedby`, error semantics, and required indicator that together make the field accessible.

## 3. When to use / When not to use

**Use when**
- Capturing a single value in a form, regardless of input shape (text, choice, date, boolean).
- The value needs a label, and optionally a hint, validation message, or letter count.
- Any of these input shapes: Text Input, Multi-line, Select / Dropdown, Autocomplete, Checkbox, Radio group, Date picker.

**Do not use when**
- Multiple related inputs share one label or validation (date range, price range, address block) → use a **FormGroup** wrapping several Form Fields.
- The field is read-only display of captured data → use `Typography` with an adjacent label, not a disabled Form Field.
- The control is a destructive toggle (archive, delete) → use a [Button](../base/button.md) with a [ConfirmDialog](./dialog.md), not a Checkbox Form Field.

## 4. Contract

### Guarantees
- Every Form Field has a programmatic label — `<label for>` via `InputLabel` for text-surface inputs, or `FormControlLabel` for Checkbox / Radio — never a placeholder-as-label.
- Label + (optional) label info icon + required indicator follow a consistent size / position across every Form Field: info icon is `1.2rem`, `text.secondary`, `theme.spacing(0.5)` leading margin.
- State visuals (border colour / control tint) come from theme tokens, not hard-coded values.
- Helper text and error message are linked to the input via `aria-describedby`.
- Focus ring is always visible on keyboard focus.
- Disabled inputs are inert (no focus, no activation).

### Prohibitions
- No placeholder as a substitute for a label — always render a Label.
- No `variant="filled"` or `variant="standard"` on text-surface inputs — morpheus themes only `outlined`.
- No hard-coded hex, px, or font values — always via theme.
- No `sx` override of border / control colour — state visuals are the contract; overriding them breaks validation semantics.
- No custom error styling outside the `Mui-error` class path — red ⓘ icon + error-coloured carrier is the contract.
- No bare inputs without a Form Field wrapper, even if the design mock "looks" like one — the wrapper owns the a11y contract.
- No label info icon that isn't `1.2rem` + `text.secondary` + `spacing(0.5)` leading margin — inconsistent icon sizing breaks field alignment.
- Nothing outside the input-type list (see §6 Input types) is valid.

### Conditions
- **Required fields** must carry a visible indicator (asterisk or "Required" text) **and** `aria-required`.
- **Error state** must be triggered only after the user has had a chance to complete the field (on blur or submit) — never on first focus.
- **Label info icon** is used to provide explanation / context; it must open a Tooltip with plain-language content, never a modal or navigation.
- **Letter count** must update live as the user types and announce `aria-live="polite"` only when approaching / exceeding the limit.
- **Async validation** must debounce before showing an error (≥ 300 ms typical).
- **Multi-line** must set a sensible `minRows` / `maxRows` — unbounded growth breaks layout.
- **Adornment icons** must have `aria-hidden="true"` unless they encode the field's meaning.

## 5. Anatomy & Composed of

### Anatomy (labeled regions — top to bottom)

- **Label** — sits above the input (or inline, to the right of the control, for Checkbox / Radio group children). Typography `body0`, colour `text.secondary`. Morpheus disables MUI's float-up transform (`transform: 'none'`); the label is static.
- **Label info icon** *(optional)* — small icon following the label: size `1.2rem`, colour `text.secondary`, leading margin `theme.spacing(0.5)`. Typically `Info` / `HelpOutline` that triggers a Tooltip. Must have an accessible name.
- **Required indicator** *(optional)* — asterisk appended to the label text, or "Required" in the helper text slot. Pick one convention and stay consistent.
- **Input surface** — polymorphic (see §6).
- **Leading adornment** *(optional, text-surface inputs only)* — icon or short text inside the left edge (magnifier, unit prefix).
- **Value** — user's typed / selected value. Text typography `body0` + `fontWeightLight`; colour `text.primary`.
- **Trailing adornment** *(optional, text-surface inputs only)* — icon (clear, reveal-password, chevron) or unit.
- **Helper text** — single line below the input. Typography 1.1rem + `fontWeightLight`; colour `text.secondary`.
- **Letter count** *(optional, text-like inputs)* — right-aligned "n / max".
- **Error icon** *(error state only)* — inline red ⓘ SVG prefixing helper text via `&.Mui-error:before`.

### Composed of

- **`FormControl`** (MUI default) — grouping + context primitive; owns `disabled`, `error`, `required`, `size`.
- **`InputLabel`** — label above text-surface inputs.
- **`FormControlLabel`** — label beside Checkbox / Radio.
- **One of the input surfaces** — [TextField](../base/text-field.md), `Select`, `Autocomplete`, `Checkbox`, `RadioGroup`+`Radio`, `DatePicker` / `DateTimePicker`.
- **`FormHelperText`** — helper / error text; injects the inline error icon via `&.Mui-error:before`.

## 6. Custom

### Input types

Exhaustive. Nothing outside this list is valid.

| Input type | Use for | Input surface (MUI) | Example |
|---|---|---|---|
| **Text Input** | Single-line free text — names, titles, short labels, numbers, passwords | `TextField` (+ `type="number"` / `"password"`) | "Connection name" |
| **Multi-line** | Longer free text — descriptions, comments | `TextField multiline` (+ `minRows` / `maxRows`) | "Description" |
| **Select / Dropdown** | Single choice from a fixed set (≤ ~20) | `Select` | "Database type" |
| **Autocomplete** | Single choice from a large or searchable set | `Autocomplete` | "Owner" (searchable user list) |
| **Checkbox** | Single boolean toggle, labelled | `Checkbox` + `FormControlLabel` | "Enable scheduled sync" |
| **Radio group** | Single choice from 2–5 visible options | `RadioGroup` + `Radio` × N | "Hourly / Daily / Weekly" |
| **Date picker** | A single date or datetime value | `DatePicker` / `DateTimePicker` | "Effective from" |

### Modifiers

Not separate variants — they layer on top of any input type above.

| Modifier | Applies to | Notes |
|---|---|---|
| Required | All | Visible indicator + `aria-required` |
| Error | All | Border / control tint → `error.main`; inline red ⓘ in helper text |
| Disabled | All | Inert; text colour `text.disabled` |
| With letter count | Text Input, Multi-line, Autocomplete free-solo | Right-aligned counter in helper-text slot |
| With leading / trailing adornment | Text-surface inputs only | Icon or short text inside the edge |
| Label info icon | All | Tooltip-triggering icon, optional |

### States

The contract is identical across input types — only the visual carrier differs (border for text-surface; control tint for Checkbox / Radio).

| State | Trigger | Text-surface visual | Checkbox / Radio visual |
|---|---|---|---|
| Default | Idle | Border `0.15rem solid background.darken20` | Control border `background.darken20` |
| Hover | Pointer over | Border `background.darken50` | Control border `background.darken50` |
| Focus-visible | Keyboard focus / click into | Border `primary.main` at `0.2rem` | Focus ring on control |
| Filled / Checked | Has value / is checked | Same as Default (label pinned) | Control filled `primary.main` |
| Error | `error` prop | Border `error.main`; adornment tinted | Control border `error.main` |
| Disabled | `disabled` prop | Border `background.darken10`; text `text.disabled` | Control faded; label `text.disabled` |
| Read-only | `readOnly` prop (text-surface only) | Same as Default; cursor text | N/A |

### `size` prop

| Size | Input height (text-like) | Label typography | Input typography |
|---|---|---|---|
| `medium` (default) | `3.6rem` | `typography.body0` | `typography.body0` + `fontWeightLight` |
| `small` | `2.8rem` | `typography.body1` | `typography.body1` |

### MUI `variant` constraint

Text-surface inputs ship `outlined` / `filled` / `standard`. **Morpheus only themes `outlined`.** The others are forbidden. Checkbox / Radio have no `variant` prop.

### Validation rules

- Error state only after blur or submit — never on first focus.
- Async validation must debounce ≥ 300 ms.
- Error text must state what's wrong and how to fix; name the field if ambiguous ("Connection name can't contain spaces").

### UX copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case; noun; ≤ 3 words | "Connection name" |
| Label info tooltip | Plain language; explain *what* the field affects | "Used in connection URLs, logs, and API calls" |
| Placeholder | Example of expected input; never a label substitute | "e.g. production-replica-01" |
| Helper text | Explain what / why | "We'll email you at this address" |
| Error text | What's wrong + how to fix | "Connection name can't contain spaces" |
| Required indicator | Asterisk OR "Required" — pick one and stay consistent | "Connection name *" |
| Letter count | "n / max"; show at ≤ 80% remaining, then always | "142 / 160" |

## 7. Mock data content

Placeholder — fill with Alation-domain mock data when this composite is used in a pilot. Candidates: Connection name / Database type / Owner / Enable scheduled sync (Data Source creation); Standard Name / Description / Column Data Type / Edit Access (Data Standards flow); Monitor Name / Schedule / Recipients (Monitor creation).

## 11. Example

```tsx
// Text Input — the most common Form Field
<TextField
  label="Connection name"
  helperText="Used in connection URLs and logs"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Select — single choice from a fixed set
<FormControl>
  <InputLabel id="db-type">Database type</InputLabel>
  <Select labelId="db-type" value={dbType} onChange={(e) => setDbType(e.target.value)}>
    <MenuItem value="postgres">PostgreSQL</MenuItem>
    <MenuItem value="mysql">MySQL</MenuItem>
    <MenuItem value="snowflake">Snowflake</MenuItem>
  </Select>
  <FormHelperText>Determines the connection driver</FormHelperText>
</FormControl>

// Checkbox — single boolean toggle, still a Form Field
<FormControl>
  <FormControlLabel
    control={<Checkbox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
    label="Enable scheduled sync"
  />
  <FormHelperText>Sync will run on the schedule defined below</FormHelperText>
</FormControl>

// Label with info icon — consistent size and position
<FormControl>
  <Stack direction="row" alignItems="center" spacing={0.5}>
    <InputLabel htmlFor="conn-name">Connection name</InputLabel>
    <Tooltip title="Used in connection URLs, logs, and API calls">
      <InfoOutlinedIcon
        sx={{ fontSize: '1.2rem', color: 'text.secondary' }}
        aria-describedby="conn-name-info"
      />
    </Tooltip>
  </Stack>
  <TextField id="conn-name" value={name} onChange={(e) => setName(e.target.value)} />
</FormControl>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
