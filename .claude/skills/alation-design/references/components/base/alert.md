---
name: alert
title: Alert
category: base-component
last_updated: 2026-04-22

description: >
  Inline banner carrying a status message (success, info, warning, error).
  Use for feedback tied to a view region — not for global toasts (see
  `MuiSnackbarAlert`, deprecated) or modal warnings (use Dialog). Alation
  themes MUI `<Alert>` with custom `@alation/icons-neo` icons, `outlined`
  default variant, `theme.spacing(2)` padding, and `body1` / `subtitle1`
  typography — all baked in; callers never set `sx`.
tags: [feedback, status, inline]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=58-417&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib/MuiAlert.overrides.tsx (mirrored in alation-design/template/src/theme/overrides/MuiAlert.overrides.tsx)
example_path: ./Example.tsx

mui_base: Alert
depends_on_tokens:
  - palette.success.main
  - palette.success.light
  - palette.error.main
  - palette.error.light
  - palette.warning.main
  - palette.warning.light
  - palette.info.main
  - palette.info.light
  - palette.text.primary
  - spacing
  - typography.body1
  - typography.subtitle1
depends_on_components:
  - Alert
  - AlertTitle
---

# Alert

## 1. Classification

- **Type:** Base component
- **MUI base:** `Alert` (+ `AlertTitle`)
- **Figma:** [Alert · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=58-417&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — `src/lib/MuiAlert.overrides.tsx` (the template mirrors the same override at `src/theme/overrides/MuiAlert.overrides.tsx`)

## 2. Purpose

An **Alert** is an inline status message — it tells the user something about the region of the view they're looking at. Severity (`success`, `info`, `warning`, `error`) communicates how urgent the message is and carries the matching icon + tint. Reach for an Alert when feedback belongs next to the content it describes (a form, a section, a row) and can be acknowledged passively; use a **Dialog** when the message must block work, and the deprecated **Snackbar / toast** pattern only for transient global confirmations.

**This is plain MUI `<Alert>`, themed.** No Alation wrapper component — callers import `Alert` / `AlertTitle` directly from `@mui/material`. The theme override (`MuiAlert.overrides.tsx`) swaps MUI's default icons for `@alation/icons-neo` (Stop / Information / CheckCircle / Warning), sets the default variant to `outlined`, pads at `theme.spacing(2)`, and sizes typography (`body1` body, `subtitle1` title) — so every Alert in the app looks and reads the same without any `sx` at the call site.

## 3. When to use / When not to use

**Use when**
- A form section needs inline warning / error / success feedback that sits next to the thing it describes
- A page-level panel announces a state the user needs to acknowledge passively ("Credentials expiring in 3 days")
- An empty-state or partial-outage notice fits naturally above the content it affects

**Do not use when**
- The message is transient and global → use a **Snackbar / toast** pattern (note: the `MuiSnackbarAlert` helper in `cdm-design-demo` is marked `@deprecated` — do not reuse; a replacement has not yet been documented)
- The message blocks the user until dismissed → use [Dialog](../composite/dialog.md)
- The message is a single word label → use [Chip](./chip.md)

## 4. Contract

### Guarantees
- Every Alert carries a semantic `severity` that maps to the matching `palette.<severity>` family for icon colour and border / tint.
- Icon, background tint, and border colour come from the severity via the theme override — no `sx` needed at the call site.
- Icons are Alation's own (from `@alation/icons-neo`): `Stop` (error), `Information` (info), `CheckCircle` (success), `Warning` (warning). They are baked into the override's `iconMapping`; callers do not import them.
- Default variant is **`outlined`** (set by the override). `standard` and `filled` are available but not default.
- Padding is **`theme.spacing(2)`**; message line is `body1` with `line-height: 1.85`; title is `subtitle1`.
- `role="alert"` is set by MUI so assistive tech announces the content.

### Prohibitions
- No `sx` override of border, colour, background, padding, or typography on `<Alert>`. The theme is the contract.
- No hard-coded icons inside the Alert — the severity-baked icon carries the meaning. Do not pass a custom `icon` prop.
- No hard-coded hex / px / font values.
- No Alert used as a button — trigger copy belongs in the `action` slot (a `<Button>`), not in the body.
- Nothing outside the severity set `success | info | warning | error` is valid.
- No `MuiSnackbarAlert` in new code — it's deprecated; flag the missing toast pattern in the output summary.

### Conditions
- **Dismissible Alerts** (`onClose` set) render a close button automatically; do not add a custom close button. In current product code, `onClose` is only used inside a **Snackbar / toast** wrapper — inline Alerts on a page typically do not dismiss.
- **Long messages** should use `<AlertTitle>` for the headline and the body slot for detail; do not cram multi-paragraph content into the default slot.
- **Action slot** (`action` prop) takes a single `<Button color="inherit" size="small">` — use it only when the Alert has a clear next step ("View details"). The prop is supported by the theme override but is rarely used in practice today; keep action copy short and verb-first.
- **Destructive actions** — an Alert with `severity="error"` is **feedback**, not an action trigger. A destructive *action* still requires a Destructive [Button](./button.md) + [ConfirmDialog](../composite/dialog.md).

## 5. Variants

### 5.1 `severity` prop (exhaustive)

| Severity | Icon (from `@alation/icons-neo`) | Use |
|---|---|---|
| `success` | `CheckCircle` | Outcome confirmation ("Settings saved") |
| `info` | `Information` | Neutral information, onboarding hints |
| `warning` | `Warning` | Needs attention but not blocking ("Credentials expire in 3 days") |
| `error` | `Stop` | Something failed or is invalid ("Sync failed — check connection") |

### 5.2 `variant` prop

| Variant | Default? | Use |
|---|---|---|
| `outlined` | ✅ **yes — default via override** | Standard inline Alert — bordered, subtle tint |
| `standard` | no | Tinted background, no border |
| `filled` | no | Solid fill — reserve for cases where the Alert must dominate (legacy toast wrappers still use `filled`) |

## 6. Anatomy

- **Icon** — severity-baked (`@alation/icons-neo`), sized at `iconLarge`, rendered automatically by the theme override.
- **Title** *(optional, via `<AlertTitle>`)* — short headline summarising the state; rendered at `subtitle1` with a `spacing(0.5)` bottom margin.
- **Body** — the message; `body1` with `line-height: 1.85`.
- **Action slot** *(optional, via `action` prop)* — a single `<Button color="inherit" size="small">` aligned to the trailing edge.
- **Close affordance** *(optional, when `onClose` is set)* — MUI-rendered dismiss control (typically only used in Snackbar / toast contexts).

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Mount | Severity-tinted / bordered surface with icon | — |
| Hover (dismissible) | Pointer over close control | Close icon gets hover treatment | — |
| Focus-visible (dismissible) | Keyboard focus on close | Visible ring on close control | Required |
| Dismissed | `onClose` fires | Component unmounts | Caller controls state |

## 11. Example

```tsx
import { Alert, AlertTitle, Button } from '@mui/material';

// Inline success — the most common shape
<Alert severity="success">Settings saved.</Alert>

// With title (outlined is the default variant)
<Alert severity="success">
  <AlertTitle>Success</AlertTitle>
  The catalog object was updated successfully.
</Alert>

// Warning with title + action
<Alert
  severity="warning"
  action={<Button color="inherit" size="small">View details</Button>}
>
  <AlertTitle>Credentials expiring</AlertTitle>
  These credentials expire in 3 days.
</Alert>

// Error
<Alert severity="error">Sync failed — check connection settings.</Alert>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
