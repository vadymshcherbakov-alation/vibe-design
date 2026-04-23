---
name: dialog
title: Dialog
category: composite-component
last_updated: 2026-04-21

description: >
  A modal confirmation or form dialog for focused single-task interactions. All spacing and typography are owned by the theme — never add padding or font overrides.
tags: [dialog, modal, confirm]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=136-1787&t=eS5ReSD4ZsCMa08a-1"
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiDialog.overrides.ts (Alation theme only; there is no shared generic ConfirmDialog wrapper in @alation/alation-ui — production assembles `<Dialog>` directly or uses domain wrappers like `DeleteObjectConfirmDialog`)"
example_path: ./Example.tsx

mui_base: Dialog
depends_on_tokens: [spacing, shape.borderRadius, typography.h1, typography.subtitle2]
depends_on_components: [Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography]
---

# Dialog

## 1. Classification

- **Type:** Composite component
- **MUI base:** `Dialog` (+ `DialogTitle`, `DialogContent`, `DialogActions`)
- **Figma:** [Dialog · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=136-1787&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiDialog.overrides.ts`. Note: there is **no shared generic `<ConfirmDialog>` wrapper** in `@alation/alation-ui` — production assembles `<Dialog>` directly or uses domain-specific wrappers (e.g. `DeleteObjectConfirmDialog`, `MoveDialog`).

## 2. Purpose

A confirmation or form dialog for focused single-task interactions. Pulls the user's attention to one decision (confirm a destructive action) or one short task (create/edit an entity) while the rest of the page is blocked.

## 3. When to use / When not to use

**Use when**
- The user must confirm a single destructive or consequential action (delete, publish, approve).
- You need a short focused form that should not navigate the user away from the current page.

**Do not use when**
- The task has more than ~6 fields or multiple steps → use a dedicated page or wizard instead.
- You need a non-blocking notification → use a snackbar / toast.
- You need an inline panel that does not block the page → use a drawer or side panel.

## 4. Contract

### Guarantees
- Focus is trapped inside the dialog while open; Escape closes and returns focus to the trigger.
- Theme applies `padding: spacing(3)` + `borderRadius: 1.2rem` on the Paper — no inline override needed.
- `DialogTitle` renders as `typography.h1`; `DialogTitle`, `DialogContent`, `DialogActions` all have theme-managed spacing.
- `maxWidth` + `fullWidth` are always set together so the dialog fills its sizing column.

### Prohibitions
- Never add font overrides (`fontSize`, `fontWeight`, `lineHeight`) on `DialogTitle`, `DialogContent`, or any Typography inside the dialog.
- Never add padding / spacing overrides on `DialogTitle`, `DialogContent`, or `DialogActions` — the theme owns all dialog spacing.
- Never add `PaperProps` with a border-radius override — theme owns `1.2rem`.
- Never mount more than one primary action (`variant="contained"`) per dialog.
- Never show a disabled submit button without a clear reason (validation state).

### Conditions
- When the dialog wraps a destructive action, the confirm Button MUST use the destructive named-style (see [Button](../base/button.md)).
- When the dialog contains a form, wrap fields in a [Form](./form.md) — use `variant="subtitle2"` for labels when the form is inside a Dialog (tighter than page-level `subtitle1`).
- When content is a simple yes/no confirmation, use `maxWidth="xs"`. Standard form dialogs use `"sm"`. Complex content (preview + form) uses `"md"`.
- When the dialog dismisses, focus returns to the element that opened it.

## 5. Anatomy & Composed of

**Anatomy**
```
┌─────────────────────────────────┐
│  Dialog title                   │  ← DialogTitle (typography.h1)
│                                 │
│  [form content]                 │  ← DialogContent
│                                 │
│              [Cancel] [Confirm] │  ← DialogActions (secondary + primary)
└─────────────────────────────────┘
```

**Composed of**
- `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` — MUI primitives
- [Button](../base/button.md) — Cancel (`color="inherit"`) + Confirm (`variant="contained"` or destructive named-style)
- [TextField](../base/text-field.md) / [Form](./form.md) — form content if applicable
- [Typography](../foundations/typography.md) — `subtitle2` labels inside the body

## 6. Custom

### Shell

```tsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>…</DialogContent>
  <DialogActions>…</DialogActions>
</Dialog>
```

- `maxWidth="sm"` — standard form dialogs
- `maxWidth="xs"` — simple confirmations
- `maxWidth="md"` — complex content
- `fullWidth` always — lets the dialog fill the maxWidth column

### Sizing

| Size | Use for |
|---|---|
| `"xs"` | Simple yes/no confirmation, single-line message |
| `"sm"` | Standard form (1–6 fields) |
| `"md"` | Complex content (preview + form, large select lists) |

### Theme-managed spacing (never override)

| Part | Theme value |
|---|---|
| Paper | `padding: spacing(3)` · `borderRadius: 1.2rem` |
| `DialogTitle` | `typography.h1` · `padding: 0` · `marginBottom: spacing(2)` |
| `DialogContent` | `padding: 0` |
| `DialogActions` | `padding: 0` · `marginTop: spacing(3)` |

### Form field label inside a Dialog

Dialogs use a tighter label variant than page-level forms:

```tsx
<Typography component="label" variant="subtitle2" sx={{ mb: 1, display: 'block' }}>
  Field label
</Typography>
<TextField fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { height: 40 } }} />
```

- `variant="subtitle2"` — 1.3rem / fontWeight 500
- `component="label"` — semantic HTML association with the input
- `height: 40` is a layout override, not a font override — acceptable

### Actions

```tsx
<DialogActions>
  <Button onClick={handleClose} color="inherit">Cancel</Button>
  <Button onClick={handleConfirm} variant="contained" disabled={!isValid}>
    Confirm
  </Button>
</DialogActions>
```

- **Cancel** — `color="inherit"` (muted, not primary)
- **Confirm** — `variant="contained"` (one primary action per dialog)
- Disable the confirm button when the form is invalid

### Focus management

- On open: first focusable element inside receives focus (DialogTitle is not focusable; focus moves to first input or action).
- On Escape: dialog closes and focus returns to the trigger.
- On confirm: dialog closes and focus returns to the trigger (or to a follow-up element if the flow demands).

## 7. Mock data content

Placeholder — fill with Alation-domain mock content when this composite is used in a pilot. Candidates: "Delete data source?" confirm, "Rename Monitor" form, "Publish catalog term" confirm, "Invite user" form.

## 11. Example

```tsx
<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Rename Monitor</DialogTitle>
  <DialogContent>
    <Typography component="label" variant="subtitle2" sx={{ mb: 1, display: 'block' }}>
      Monitor name
    </Typography>
    <TextField fullWidth value={name} onChange={handleName}
      sx={{ '& .MuiOutlinedInput-root': { height: 40 } }} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="inherit">Cancel</Button>
    <Button onClick={handleConfirm} variant="contained" disabled={!isValid}>Save</Button>
  </DialogActions>
</Dialog>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
