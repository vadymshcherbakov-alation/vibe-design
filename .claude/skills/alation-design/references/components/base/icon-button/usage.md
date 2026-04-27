---
name: icon-button
title: Icon Button
category: base-component
last_updated: 2026-04-23

description: >
  Icon-only action trigger. Use for row-level overflow menus, dense toolbars,
  and inline controls where a full Button would crowd the layout. Supports
  four sizes (`xsmall` / `small` / `medium` / `large`) and three surface
  variants (`contained` / `outlined` / `text`) from the Alation theme.
tags: [action, interactive, icon]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=4-311&t=eS5ReSD4ZsCMa08a-4"
code_reference: fabric-theme-morpheus/src/lib/MuiIconButton.overrides.ts
example_path: ./Example.tsx

mui_base: IconButton
depends_on_tokens:
  - palette.primary.main
  - palette.error.main
  - palette.warning.main
  - palette.success.main
  - palette.info.main
  - palette.text.primary
  - palette.text.disabled
  - palette.action.hover
  - typography.iconXSmall
  - typography.iconSmall
  - typography.iconMedium
  - typography.iconLarge
depends_on_components:
  - lucide-react
---

# Icon Button

## 1. Classification

- **Type:** Base component
- **MUI base:** `IconButton`
- **Figma:** [Icon Button · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=4-311&t=eS5ReSD4ZsCMa08a-4)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiIconButton.overrides.ts`

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
- Icon sizes are theme-baked per IconButton size: `xsmall` → `typography.iconXSmall` (1.2rem), `small` → `iconSmall` (1.6rem), `medium` → `iconMedium` (2rem), `large` → `iconLarge` (2.4rem). Do not pass an icon `size` prop — the container handles it.
- Focus ring is visible on keyboard focus.
- Disabled state is inert (no activation, not focusable).
- Production uses `@alation/icons-neo` icons wrapped in MUI `SvgIcon`. Prototype code (`@repo/ui` consumers) uses `lucide-react` per the project's UI-icon convention; both are rendered inside an `IconButton` the same way.

### Prohibitions
- No icon-only IconButton without an `aria-label`.
- No `@mui/icons-material` inside an IconButton in product UI — use `@alation/icons-neo` (production) or `lucide-react` (prototypes consuming `@repo/ui`) to match the surrounding app.
- No hard-coded hex / px / font values — consume via theme.
- No `sx` colour, size, or radius overrides — use the `color` / `size` / `variant` props.
- No custom icon `size` prop — the IconButton size governs the icon size.

### Conditions
- Destructive IconButtons (e.g. row-delete) must pair with a [ConfirmDialog](../composite/dialog/usage.md) before committing.
- If the action is ambiguous without a label, prefer a full `<Button>` — do not rely on tooltip alone.
- Tooltip is strongly encouraged on icon-only controls but does not replace `aria-label`.
- When an IconButton sits in a toolbar alongside surfaced actions, prefer `variant="text"` (default) — reserve `contained` / `outlined` for standalone, emphasised controls.

## 5. Variants

### 5.1 `size` prop

| Size | Icon size (from theme) | Use |
|---|---|---|
| `xsmall` | `iconXSmall` (1.2rem) | Very dense tables, row-level mini actions |
| `small` | `iconSmall` (1.6rem) | Dense tables, row actions, inline controls |
| `medium` (default) | `iconMedium` (2rem) | Standalone icon actions in toolbars |
| `large` | `iconLarge` (2.4rem) | Rare — hero / empty-state icon affordances |

### 5.2 `variant` prop

The Alation theme exposes three IconButton surface variants via `className` (applied automatically by the `variant` prop in this codebase).

| Variant | Role |
|---|---|
| `text` (default) | No surface — icon sits on the parent background. Standard for toolbars / row actions. |
| `outlined` | Bordered surface — standalone icon control that needs a visible target |
| `contained` | Filled surface — emphasised icon action (rare) |

### 5.3 `color` prop

| Colour | Role | Notes |
|---|---|---|
| `default` / `inherit` | Follows parent text colour | Most common |
| `primary` | Highlight a primary icon action | Rare in product UI |
| `secondary` | Alt emphasis | Rare |
| `error` | Destructive icon action (pair with ConfirmDialog) | — |
| `warning` | Attention-grabbing icon state | — |
| `success` | Positive / healthy icon state | — |
| `info` | Informational icon state | — |

## 6. Anatomy

- **Container** — circular hit target sized by the `size` prop; surface per `variant`.
- **Icon** — child `SvgIcon` from `@alation/icons-neo` (production) or `lucide-react` (prototype); size governed by the IconButton `size`.
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
import { MoreVertical, Trash2 } from 'lucide-react'; // or @alation/icons-neo in production

// Standard row-level overflow (size drives the icon; no size on the icon itself)
<Tooltip title="More actions">
  <IconButton size="small" aria-label="More actions">
    <MoreVertical />
  </IconButton>
</Tooltip>

// Outlined standalone control
<Tooltip title="Filter">
  <IconButton size="medium" variant="outlined" aria-label="Filter">
    <FilterIcon />
  </IconButton>
</Tooltip>

// Destructive — paired with a ConfirmDialog (not shown)
<Tooltip title="Delete row">
  <IconButton size="small" color="error" aria-label="Delete row" onClick={openConfirm}>
    <Trash2 />
  </IconButton>
</Tooltip>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
