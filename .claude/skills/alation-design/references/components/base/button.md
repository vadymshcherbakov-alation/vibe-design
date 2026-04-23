---
name: button
title: Button
category: base-component
last_updated: 2026-04-21

description: >
  Triggers an action in place or navigates to a new view. Use for the primary action on a form, confirmation of a choice, or navigation that commits work. Do not use for destructive actions without a confirmation step — use a ConfirmDialog pattern instead.
tags: [action, interactive, form]

figma_url: https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2-9786&t=eS5ReSD4ZsCMa08a-1
code_reference: fabric-theme-morpheus/src/lib/MuiButton.overrides.ts
example_path: ./Example.tsx

mui_base: Button
depends_on_tokens:
  - palette.primary.main
  - palette.primary.dark
  - palette.primary.light
  - palette.error.main
  - palette.grey[500]
  - palette.text.disabled
  - shape.borderRadius
  - typography.button
  - typography.buttonLg
  - typography.buttonSm
depends_on_components: []
---

# Button

## 1. Classification

- **Type:** Base component
- **MUI base:** `Button`
- **Figma:** Button · NEO 2.1 — [Link](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2-9786&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — `src/lib/MuiButton.overrides.ts`

## 2. Purpose

An action trigger. Commits the user's intent — submits, confirms, navigates, or executes.

## 3. When to use / When not to use

**Use when**
- Submitting a form or committing a change
- Confirming a reversible choice
- Primary navigation that commits work (e.g. "Continue", "Save and exit")
- Triggering an asynchronous operation with visible loading feedback

**Do not use when**
- The action navigates without committing → use a **Link**
- The control toggles a binary state → use a **Switch** or **Checkbox**
- The label is an icon only and space is dense → use an [**IconButton**](./icon-button.md)

### Primary-button scarcity

- **At most one Primary button on a page, by default.** A page has one primary commit action at a time — more than one dilutes the signal and leaves users guessing which step comes next.
- **Do not emit a Primary button unless the page has an explicit, singular "next action"** the product is steering the user toward (submit, save, confirm, continue). If the actions on the page are peers — "Export", "Filter", "Share" — use **Blue secondary** or **Grey outlined** instead. Reach for Primary only when omitting it would leave the user unsure what to do next.

## 4. Contract

### Guarantees
- Always renders an accessible name (text content or `aria-label` for icon-only).
- Always uses theme tokens for colour, radius, spacing, typography — no hard-coded values.
- Focus ring is always visible on keyboard focus (`Mui-focusVisible` class).
- Disabled buttons are inert (no activation, no focus skip).

### Prohibitions
- No hard-coded hex, px, or font values — consume via theme.
- No `sx` overrides of colour / radius — use the named-style system (§5.1).
- No `color="secondary"` — morpheus has no visual "secondary" style; use **Blue secondary** (outlined + primary) instead.
- No more than one **Primary** button per page (default). See §3 "Primary-button scarcity" for when to omit it entirely.
- No **Gradient** in product UI — brand / marketing only.
- Nothing outside the Named styles list (§5.1) is valid.

### Conditions
- **Destructive commit** (Destructive named style, `color="error"`) must be paired with a [ConfirmDialog](../composite/dialog.md). The Button is correct — the dialog is the guardrail.
- **Icon-only form** requires `aria-label`.
- **Loading** requires caller to set `disabled` and swap children for the `.spin` spinner — activation must be blocked.
- **Visual order ≠ DOM order** is disallowed; authoring order drives reading order.
- **Reduced motion** — `.spin` loading animation falls back to static "Loading…" text when `prefers-reduced-motion` is on.

## 5. Variants

Buttons have two working levels. Designers pick a **named style** (§5.1) — that is the source of truth. MUI props (§5.2–§5.4) are the underlying axes the named styles are composed from.

### 5.1 Named styles

Exhaustive. Nothing outside this list is valid.

| Named style | Use for | MUI props | Example |
|---|---|---|---|
| **Primary** | The single primary action on the view — submit, confirm, continue | `variant="contained"` + `color="primary"` | "Save changes" |
| **Blue secondary** | Supporting action alongside a Primary | `variant="outlined"` + `color="primary"` | "Cancel" next to "Save changes" |
| **Grey outlined** | Neutral action, no brand emphasis (toolbars, filters, chrome) | `variant="outlined"` + `color="inherit"` | "Export", "Filter" |
| **Text** | Low-emphasis inline action (row actions, dense toolbars, tertiary links that commit) | `variant="text"` + `color="primary"` | "Learn more", "Edit" in a row |
| **Destructive** | Commits an irreversible destructive action (paired with ConfirmDialog) | `variant="contained"` + `color="error"` | "Delete source" |
| **Gradient** ⚠ | Brand / marketing surfaces **only** — never in product UI | `variant="gradient"` | Hero CTA on a marketing landing |

### 5.2 `variant` prop (underlying axis)

| Variant | Role |
|---|---|
| `contained` | Filled surface — used by Primary and Destructive |
| `outlined` | Bordered surface — used by Blue secondary and Grey outlined |
| `text` | No surface — used by Text |
| `gradient` | Brand-only fill — used by Gradient |

### 5.3 `color` prop (underlying axis)

| Colour | Role | Notes |
|---|---|---|
| `primary` | Default brand action | Pairs with `contained`, `outlined`, `text` |
| `error` | Destructive commit | Pairs with `contained` (+ ConfirmDialog) |
| `inherit` | Neutral / grey | Used by Grey outlined |
| `success`, `warning`, `info` | Rare — status-carrying commits | Avoid unless the semantic is exact |
| ~~`secondary`~~ | ❌ **Do not use.** Morpheus does not define a visual "secondary" style. Use **Blue secondary** (outlined + primary) instead |

### 5.4 `size` prop

| Size | Padding (`theme.spacing`) | Typography | Use |
|---|---|---|---|
| `xsmall` | custom (2.4rem height) | `typography.buttonSm` | Dense tables / inline controls |
| `small` | `0.75 × 1.5` | `typography.buttonSm` | Compact forms |
| `medium` (default) | `1 × 2` | `typography.button` | Standard |
| `large` | `1.25 × 2.5` | `typography.buttonLg` | Hero CTAs only |

## 6. Anatomy

- **Container** — rounded surface (`shape.borderRadius = 6px`); colour driven by named style
- **Label** — single line; sentence case; verb-first
- **Start icon** *(optional)* — via `startIcon` prop; 1em relative to label
- **End icon** *(optional)* — via `endIcon` prop; typical for disclosure / external
- **Spinner** *(loading state only)* — replaces label area via `.spin` class

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Named-style container | — |
| Hover | Pointer over | `palette.[color].dark` container | — |
| Focus-visible | Keyboard focus | `theme.outlineStyleMixin()` ring | `Mui-focusVisible` class; never remove |
| Active / Pressed | Pointer down / Space / Enter | Slightly depressed; same token family | — |
| Disabled | `disabled` prop | Label `palette.text.disabled`; container `palette.grey[500]` at reduced opacity | Contrast waiver applies; `aria-disabled` true |
| Loading | Async in flight (app responsibility) | `.spin` animation replaces label | Caller sets `disabled` + swaps children; activation blocked |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case; verb-first; ≤ 3 words where possible | "Save changes", "Delete source" |
| Destructive label | Name the object being destroyed | "Delete connection" (not "Confirm") |
| Disabled reason | Tooltip on hover/focus; plain language | "Complete all required fields" |
| Loading fallback | Static string when reduced-motion is on | "Saving…" |

## 11. Example

```tsx
// Primary — the single primary action on the view
<Button variant="contained" color="primary" onClick={handleSave}>Save changes</Button>

// Blue secondary — supporting action next to a Primary
<Button variant="outlined" color="primary" onClick={handleCancel}>Cancel</Button>

// Grey outlined — neutral toolbar action
<Button variant="outlined" color="inherit" onClick={handleExport}>Export</Button>

// Destructive — must be paired with a ConfirmDialog
<Button variant="contained" color="error" onClick={openConfirm}>Delete source</Button>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
