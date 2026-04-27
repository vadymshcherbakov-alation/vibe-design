---
name: form-field
title: Form Field
category: composite-component
last_updated: 2026-04-24

description: >
  A labeled input unit: label + input surface + helper text. The input surface can be a Basic Text Field, Multiline Text Area, Code Editor, Markdown Editor, Select Input, Autocomplete, Radio group, or Date picker — Form Field is the wrapper contract they all share. Use for any single field in a form; Checkbox / Switch live in the separate Label Control composite.
tags: [form, input, composite, wrapper]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-576&t=eS5ReSD4ZsCMa08a-1"
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
  - FormHelperText
  - TextField
  - Select
  - Autocomplete
  - Radio
  - DatePicker
---

# Form Field

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** `FormControl`
- **Figma:** [Form Field · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-576&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/` (Label + HelperText overrides + input-surface overrides: TextField / Select / Autocomplete / Radio / DatePicker). There is no shared `<FormField>` component in `@alation/alation-ui` — production composes `FormControl` + `InputLabel` + one input + `FormHelperText` directly at the call site.

## 2. Purpose

A labeled input unit — the smallest complete block of a form. Pairs one label (optionally with an info tooltip) with one input surface and one helper/error line, so every field looks, reads, and validates the same regardless of what the user is entering.

## 3. When to use / When not to use

**Use when**
- Capturing a value in a form — text, chosen option(s), date, or chips — regardless of whether the value is single or multi.
- The value needs a label, and optionally a hint, validation message, or letter count.
- The input surface is one documented in §6 (Basic Text Field, Multiline Text Area, Code Editor, Markdown Editor, Select Input, Autocomplete, Radio group, Date picker).

**Do not use when**
- The input is a boolean or on/off toggle → use a **Label Control** (Checkbox / Switch composite — separate reference) with its label beside the control, not above.
- Multiple related inputs share one label or validation (date range, price range, address block) → use a **FormGroup** wrapping several Form Fields.
- The field is read-only display of captured data → use `Typography` with an adjacent label, not a disabled Form Field.
- The control is a destructive toggle (archive, delete) → use a [Button](../base/button/usage.md) with a [ConfirmDialog](./dialog/usage.md).

## 4. Contract

### Guarantees
- Composition is always **label above → input surface → helper / error text below**. No bare inputs; the wrapper owns the a11y contract.
- Every Form Field has a programmatic label — `<label for>` via `InputLabel` for text-surface inputs, or `FormControlLabel` for Radio children — never a placeholder-as-label.
- Label + (optional) label info icon + required indicator follow a consistent size / position across every Form Field: info icon is `1.2rem`, `text.secondary`, `theme.spacing(0.5)` leading margin.
- State visuals (border colour / control tint) come from theme tokens, not hard-coded values.
- Helper text and error message are linked to the input via `aria-describedby`.
- Focus ring is always visible on keyboard focus.
- Disabled inputs are inert (no focus, no activation).
- Swapping the input surface (Basic Text Field → Multiline Text Area → Select Input → Autocomplete → Radio group → DatePicker) does not change the wrapper, labelling, spacing, or required / error / disabled semantics.

### Prohibitions
- No placeholder as a substitute for a label — always render a Label.
- No `variant="filled"` or `variant="standard"` on text-surface inputs — morpheus themes only `outlined`.
- No hard-coded hex, px, or font values — always via theme.
- No `sx` override of border / control colour — state visuals are the contract; overriding them breaks validation semantics.
- No custom error styling outside the `Mui-error` class path — red ⓘ icon + error-coloured carrier is the contract.
- No bare inputs without a Form Field wrapper, even if the design mock "looks" like one — the wrapper owns the a11y contract.
- No Checkbox / Switch inside a Form Field — those belong to the **Label Control** composite (label beside the control, not above).
- No label info icon that isn't `1.2rem` + `text.secondary` + `spacing(0.5)` leading margin — inconsistent icon sizing breaks field alignment.
- No `readOnly` Form Field for displaying captured data — render a `Typography` next to a label instead.
- Nothing outside the input-type list (see §6 Input types) is valid.

### Conditions
- **Required fields** must carry a visible indicator (asterisk or "Required" text) **and** `aria-required`.
- **Error state** must be triggered only after the user has had a chance to complete the field (on blur or submit) — never on first focus.
- **Label info icon** is used to provide explanation / context; it must open a Tooltip with plain-language content, never a modal or navigation.
- **Letter count** must update live as the user types and announce `aria-live="polite"` only when approaching / exceeding the limit.
- **Async validation** must debounce before showing an error (≥ 300 ms typical).
- **Multiline Text Area** must set a sensible `minRows` / `maxRows` — unbounded growth breaks layout.
- **Adornment icons** must have `aria-hidden="true"` unless they encode the field's meaning.

## 5. Anatomy & Composed of

### Anatomy (labeled regions — top to bottom)

- **Label** — sits above the input (or inline, to the right of the control, for Radio group children). Typography `body0`, colour `text.secondary`. Morpheus disables MUI's float-up transform (`transform: 'none'`); the label is static.
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
- **`FormControlLabel`** — label beside Radio children inside a `RadioGroup`.
- **One of the input surfaces** — [Basic Text Field](../../base/basic-text-field/usage.md), [Multiline Text Area](../../base/multiline-text-area/usage.md), Code Editor *(planned)*, Markdown Editor *(planned)*, [Select Input](../../base/select-input/usage.md), `Autocomplete`, `RadioGroup`+`Radio`, `DatePicker` / `DateTimePicker`.
- **`FormHelperText`** — helper / error text; injects the inline error icon via `&.Mui-error:before`.

## 6. Custom

### Input types

Exhaustive. Nothing outside this list is valid.

| Input surface | Use for | MUI base | Reference | Example |
|---|---|---|---|---|
| **Basic Text Field** | Single-line free text — names, titles, short labels, email, password, number, URL, search | `TextField` (+ `type="email"` / `"password"` / `"number"` / `"url"` / `"search"`) | [basic-text-field](../../base/basic-text-field/usage.md) | "Connection name" |
| **Multiline Text Area** | Longer free text — descriptions, comments, release notes | `TextField multiline` (+ bounded `minRows` / `maxRows`) | [multiline-text-area](../../base/multiline-text-area/usage.md) | "Description" |
| **Code Editor** | Source code with syntax highlighting (SQL, YAML, JSON) | *(planned — Monaco-based)* | *(not yet documented)* | "Query body" |
| **Markdown Editor** | Long-form rich authoring with preview | *(planned — rich editor)* | *(not yet documented)* | "Article content" |
| **Select Input** | Single choice from a fixed set (≤ ~20) | `TextField select` (composes `Select` + `MenuItem`) | [select-input](../../base/select-input/usage.md) | "Database type" |
| **Autocomplete** | A single or multi-value choice from a large or searchable set (includes chip-based multi-select) | `Autocomplete` | *(not yet a reference)* | "Owner" (searchable user list), "Tags" (chip multi-select) |
| **Radio group** | Single choice from 2–5 visible options | `RadioGroup` + `Radio` × N | *(not yet a reference)* | "Hourly / Daily / Weekly" |
| **Date picker** | A single date or datetime value | `DatePicker` / `DateTimePicker` | *(not yet a reference)* | "Effective from" |

For a boolean or an on/off toggle use a **Label Control** (Checkbox / Switch composite — separate reference), not a Form Field.

### Modifiers

Not separate variants — they layer on top of any input type above.

| Modifier | Applies to | Notes |
|---|---|---|
| Required | All | Visible indicator + `aria-required` |
| Error | All | Border / control tint → `error.main`; inline red ⓘ in helper text |
| Disabled | All | Inert; text colour `text.disabled` |
| With letter count | Basic Text Field, Multiline Text Area, Autocomplete free-solo | Right-aligned counter in helper-text slot |
| With leading / trailing adornment | Text-surface inputs only | Icon or short text inside the edge |
| Label info icon | All | Tooltip-triggering icon, optional |

### States

The contract is identical across input types — only the visual carrier differs (border for text-surface; control tint for Radio).

| State | Trigger | Text-surface visual | Radio visual |
|---|---|---|---|
| Default | Idle | Border `0.15rem solid background.darken20` | Control border `background.darken20` |
| Hover | Pointer over | Border `background.darken50` | Control border `background.darken50` |
| Focus-visible | Keyboard focus / click into | Border `primary.main` at `0.2rem` | Focus ring on control |
| Filled / Selected | Has value / is selected | Same as Default (label pinned) | Control filled `primary.main` |
| Error | `error` prop | Border `error.main`; adornment tinted | Control border `error.main` |
| Disabled | `disabled` prop | Border `background.darken10`; text `text.disabled` | Control faded; label `text.disabled` |

### `size` prop

| Size | Input height (text-like) | Label typography | Input typography |
|---|---|---|---|
| `medium` (default) | `3.6rem` | `typography.body0` | `typography.body0` + `fontWeightLight` |
| `small` | `2.8rem` | `typography.body1` | `typography.body1` |

### MUI `variant` constraint

Text-surface inputs ship `outlined` / `filled` / `standard`. **Morpheus only themes `outlined`.** The others are forbidden. Radio has no `variant` prop.

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
// Basic Text Field — the most common Form Field
<TextField
  label="Connection name"
  helperText="Used in connection URLs and logs"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Multiline Text Area — longer free text
<TextField
  label="Description"
  multiline
  minRows={3}
  maxRows={6}
  helperText="Short description of what this source contains"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

// Select Input — single choice from a fixed set
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
