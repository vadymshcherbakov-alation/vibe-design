---
name: icon-button
title: Icon Button
category: base-component
last_updated: 2026-04-21

description: >
  Icon-only action trigger. Use for row-level overflow menus, dense toolbars,
  and inline controls where a full Button would crowd the layout.
tags: [action, interactive, icon]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=4-311&t=eS5ReSD4ZsCMa08a-4"
code_reference: fabric-theme-morpheus/src/lib/MuiIconButton.overrides.ts
example_path: ./Example.tsx

mui_base: IconButton
depends_on_tokens:
  - palette.primary.main
  - palette.text.primary
  - palette.text.disabled
  - palette.action.hover
depends_on_components:
  - lucide-react
---

# Icon Button

## 1. Classification

- **Type:** Base component
- **MUI base:** `IconButton`
- **Figma:** [Icon Button · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=4-311&t=eS5ReSD4ZsCMa08a-4)
- **Code:** `fabric-theme-morpheus` — `src/lib/MuiIconButton.overrides.ts`

## 2. Purpose

An Icon Button is a clickable icon — an action you can trigger without a text label. It communicates a compact, low-ceremony affordance that fits inside dense layouts (row overflow menus, toolbars, inline edits). Reach for it when the icon alone is understood and a full Button would crowd the row; if the action needs words to be clear, use a Button instead.

## 3. When to use / When not to use

**Use when**
- A row-level overflow menu (⋮) or inline action (×, edit, copy) needs to fit inside a dense layout
- A toolbar has space constraints and the icon carries a recognised meaning
- The action is reversible or low-stakes and does not need a text label for clarity

**Do not use when**
- The action needs an explanatory label to be understood → use **Button**
- The control toggles a binary state → use **Switch** or **Checkbox**
- The trigger is a link / navigation that commits work → use **Link** or **Button**

## 4. Contract

### Guarantees
- Always renders an accessible name via `aria-label` (icon alone does not announce).
- Uses `lucide-react` icons at `size={16}` inside the control.
- Focus ring is visible on keyboard focus.
- Disabled state is inert (no activation, not focusable).

### Prohibitions
- No icon-only IconButton without an `aria-label`.
- No `@mui/icons-material` inside an IconButton. `lucide-react` only.
- No hard-coded hex / px / font values — consume via theme.
- No `sx` colour or radius overrides — use the `color` prop.
- No icon `size` other than `16` inside an IconButton.

### Conditions
- Destructive IconButtons (e.g. row-delete) must pair with a ConfirmDialog before committing.
- If the action is ambiguous without a label, prefer a full `<Button>` — do not rely on tooltip alone.
- Tooltip is strongly encouraged on icon-only controls but does not replace `aria-label`.

## 5. Variants

### 5.1 `size` prop

| Size | Use |
|---|---|
| `small` | Dense tables, row actions, inline controls — pairs with `size={16}` icons |
| `medium` (default) | Standalone icon actions in toolbars |

### 5.2 `color` prop

| Colour | Role | Notes |
|---|---|---|
| `inherit` (default) | Follows parent text colour | Most common |
| `primary` | Highlight a primary icon action | Rare in product UI |
| `error` | Destructive icon action (pair with ConfirmDialog) | — |
| ~~`secondary`~~ | ❌ Do not use. Morpheus has no visual "secondary" style. | — |

## 6. Anatomy

- **Container** — circular hit target (theme-baked).
- **Icon** — `lucide-react` at `size={16}`.
- **Focus ring** — theme-baked on keyboard focus.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Transparent container; icon in `currentColor` | — |
| Hover | Pointer over | Subtle surface tint (`palette.action.hover`) | — |
| Focus-visible | Keyboard focus | Visible ring | Required |
| Active / Pressed | Pointer down / Space / Enter | Slightly deeper surface tint | — |
| Disabled | `disabled` prop | Icon at `palette.text.disabled`; no hover | Not focusable |

## 11. Example

```tsx
import { IconButton, Tooltip } from '@mui/material';
import { MoreVertical, Trash2 } from 'lucide-react';

// Standard row-level overflow
<Tooltip title="More actions">
  <IconButton size="small" aria-label="More actions">
    <MoreVertical size={16} />
  </IconButton>
</Tooltip>

// Destructive — paired with a ConfirmDialog (not shown)
<Tooltip title="Delete row">
  <IconButton size="small" color="error" aria-label="Delete row" onClick={openConfirm}>
    <Trash2 size={16} />
  </IconButton>
</Tooltip>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
