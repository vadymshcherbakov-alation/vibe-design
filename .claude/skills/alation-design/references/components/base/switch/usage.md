---
name: switch
title: Switch
category: base-component
last_updated: 2026-04-27

description: >
  The On/Off toggle primitive — the digital version of a physical light
  switch. Rendered as MUI `<Switch>` with the morpheus track + thumb override
  (with × / ✓ glyphs inside the thumb). Use for binary opposites — feature
  flag On/Off, source Active/Paused, notifications Enabled/Disabled. For a
  form-style selection or acknowledgement use Checkbox. Always pair a Switch
  with a label via `<FormControlLabel>`.
tags: [form, input, boolean, toggle, on-off]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib (MuiSwitch, MuiFormControlLabel overrides)
example_path: ./Example.tsx

mui_base: Switch
depends_on_tokens:
  - palette.blue.600
  - palette.blue.900
  - palette.blue.200
  - palette.grey.700
  - palette.grey.800
  - palette.grey.400
  - palette.background.default
  - palette.text.primary
depends_on_components:
  - Switch
  - FormControlLabel
---

# Switch

## 1. Classification

- **Type:** Base component
- **MUI base:** `Switch`
- **Figma:** [Switch · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2742-644&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiSwitch.overrides.tsx` · `src/lib/MuiFormControlLabel.overrides.ts`

## 2. Purpose

A **Switch** is the digital version of a physical toggle — a light switch. It captures a **binary opposite**: On / Off, Enable / Disable, Active / Inactive. The metaphor is mechanical — flip it one way or the other and the system reflects that state.

Switches and Checkboxes are not interchangeable. Reach for a Switch when the affordance is *flipping a single setting between two opposite states*. Reach for a Checkbox when the user is *filling in a form* — picking one or more items from a list, opting in, or acknowledging a statement.

## 3. When to use / When not to use

**Use when**
- Flipping a setting between two opposite states — feature flag On/Off, source Active/Paused, notifications Enabled/Disabled, auto-sync On/Off
- The label reads as a state name, not a question — "Active", "Auto-sync", "Send weekly digest"
- The control is a standalone setting in a panel, not one row of a form-style multi-select

**Do not use when**
- The user is choosing one or more items from a list → use **Checkbox** (multi-select rows)
- The user is acknowledging a statement ("I agree to the terms") → use **Checkbox**
- The user picks exactly one option from 2–5 mutually-exclusive choices → use **Radio**
- The control is a single choice from a fixed short list → use **Select Input** (inside a Form Field)
- The control fires an action (run, delete, open) → use a **Button**; switches record state, they do not trigger one-shot side-effects
- The setting is destructive or expensive enough that the user should explicitly confirm → use a **Button** + ConfirmDialog instead
- The label is a question or a sentence that implies an action ("Are you sure?") → reword to a state ("Active") or move to a Button

## 4. Contract

### Guarantees
- Always paired with a programmatic label — `<FormControlLabel>` for inline rows, a wrapping Form Field when helper text or validation is needed.
- Track + thumb colour are bound to morpheus blue / grey ramps via the override — `blue.600` checked default, `blue.900` checked hover, `grey.700` unchecked default, `grey.800` unchecked hover, `grey.400` and `blue.200` for disabled.
- Thumb carries an inline glyph from the NEO icon set — `TimesIcon` (×) when off, `CheckThickIcon` (✓) when on — to reinforce state at a glance.
- Track is a `2rem` × `3.6rem` pill with a `1.6rem` thumb sliding `1.6rem` on toggle.
- Hover state is reachable both on the switch itself and via the wrapping `<FormControlLabel>` (the override propagates hover up the row).
- Disabled switches are inert (not focusable). The label colour stays at `text.primary` so the row remains readable.
- Toggling the switch must commit immediately to its setting — there is no "pending" state.

### Prohibitions
- No raw `<input type="checkbox" role="switch">` HTML element.
- No bare `<Switch>` without a `<FormControlLabel>` (or a Form Field wrapper).
- No hard-coded hex / px / font values.
- No `sx` overrides of track, thumb, glyph, or hover behaviour — the morpheus override owns the visuals.
- No custom `icon` / `checkedIcon` props — the theme already binds the × / ✓ glyphs.
- No `color="secondary"` or other forbidden palette values — only `primary` (default) is themed.
- No Switch as a row inside a form-style multi-select. If the user is *picking from a list*, use Checkbox.
- No "loading" spinner on the track. If a toggle triggers an async commit and you need to surface progress, place a small adjacent indicator and disable the row — never repaint the switch itself.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Destructive or expensive toggles (e.g. "Disable production source") must surface a `ConfirmDialog` before the change lands. The Switch itself is correct; the dialog is the guardrail.
- A Switch may commit immediately or be batched into a Save action — both are valid. The deciding factor is the *mental model* (binary opposite vs form selection), not when the value lands. If the affordance reads as a binary On/Off, Switch is right even when the change is queued for Save.
- A Switch row that triggers async work should briefly disable on toggle until the commit lands (optimistic local update is fine when the operation is reliable).
- Read-only display of a captured boolean is **not** a Switch — render an icon + Typography pair (or a Label Chip in the right colour) instead.
- Rows of related switches in a settings panel may share a section heading and a divider, but each switch keeps its own label — no "select all" parent on a Switch group.
- If the same screen mixes Checkboxes and Switches, group them by mental model: Checkboxes in the form-style section (multi-select, opt-ins, acknowledgements), Switches in the settings / preferences section (binary On/Off rows).

## 5. Variants

Switch is a single-axis component. The named-style axis is the **on/off state**.

### 5.1 Named styles — on/off state

| Named style | Use for | MUI props | Example |
|---|---|---|---|
| **Off** (default) | Setting is disabled | `checked={false}` | "Send weekly digest" — off |
| **On** | Setting is enabled | `checked` | "Send weekly digest" — on |

### 5.2 `color` prop

| Colour | Role | Notes |
|---|---|---|
| `primary` (default) | Standard checked tint — `blue.600` track | Use everywhere |
| ~~`secondary`~~ | ❌ Do not use. No morpheus style. | — |
| ~~`success` / `warning` / `error` / `info`~~ | ❌ Do not use. State semantics live in the row label, not the switch tint. | — |

### 5.3 Label placement

Inherited from `<FormControlLabel>` `labelPlacement`. Pick one per row family.

| Placement | Use when |
|---|---|
| **End** (default) | Standard settings rows — switch on the left, label after |
| **Start** | Right-aligned settings rows in two-column layouts — label first, switch trailing |
| ~~Top / Bottom~~ | ❌ Avoid. Vertical placement breaks the "row of settings" reading model. |

## 6. Anatomy

- **Track** — `2rem` × `3.6rem` pill; background colour bound to state (grey ramp off, blue ramp on).
- **Thumb** — `1.6rem` circle on `background.default`; carries an inline glyph (× off, ✓ on) and slides `1.6rem` between track ends on toggle.
- **Label** *(via `<FormControlLabel>`)* — text adjacent to the switch (default end placement); `body0`; `text.primary`. Sentence case state phrase.
- **Helper text** *(optional)* — owned by the wrapping **Form Field** when present; never inline under a bare switch.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default — off | Idle, off | Track `grey.700`, thumb at left, glyph × | — |
| Default — on | Idle, on | Track `blue.600`, thumb at right, glyph ✓ | — |
| Hover — off | Pointer over (switch *or* row) | Track `grey.800`, thumb tone matches | Hover propagates from `<FormControlLabel>` |
| Hover — on | Pointer over (switch *or* row) | Track `blue.900`, thumb tone matches | Hover propagates from `<FormControlLabel>` |
| Focus-visible — off | Keyboard focus | Same as Hover off | Inherited from `Mui-focusVisible` mapping |
| Focus-visible — on | Keyboard focus | Same as Hover on | Inherited from `Mui-focusVisible` mapping |
| Disabled — off | `disabled` prop | Track `grey.400`, thumb dimmed | Not focusable; label stays readable |
| Disabled — on | `disabled` prop | Track `blue.200`, thumb dimmed | Not focusable; label stays readable |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case; describe the *state when on*, not the action | "Send weekly digest" |
| Section heading | Sentence case noun phrase | "Notifications" |
| Confirm-on-destructive title | Question form | "Disable production source?" |
| Async commit indicator | Short caption next to the row when needed | "Saving…" |

## 11. Example

```tsx
import { FormControlLabel, Switch, Stack } from '@mui/material';

// Inline settings row
<FormControlLabel
  control={
    <Switch
      checked={notify}
      onChange={(e) => setNotify(e.target.checked)}
    />
  }
  label="Send weekly digest"
/>

// Settings panel — multiple rows
<Stack spacing={1}>
  <FormControlLabel control={<Switch checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />} label="Auto-sync sources" />
  <FormControlLabel control={<Switch checked={metrics}  onChange={(e) => setMetrics(e.target.checked)}  />} label="Share usage metrics" />
  <FormControlLabel control={<Switch disabled checked />}                                                  label="Maintenance mode (locked by admin)" />
</Stack>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
