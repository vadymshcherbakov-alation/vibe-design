---
name: shape
title: Shape
category: foundation
last_updated: 2026-04-23

description: >
  Border-radius and elevation rules. Every rounded surface derives from
  `shape.borderRadius` (6 px base). Cards, Papers, and modal surfaces use
  `borderRadius: 2` (12 px) by default. A `theme.borderRadiusToRem(px)`
  utility converts px → rem for `sx` values that need a specific pixel size.
tags: [foundation, shape, radius, elevation]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/index.ts (shape.borderRadius = 6, borderRadiusToRem utility, shadows array — all inline)"
example_path: ./Example.tsx

mui_base: shape
depends_on_tokens: []
depends_on_components: []
---

# Shape

## 1. Classification

- **Type:** Foundation
- **MUI base:** `shape`
- **Figma:** [Shape / radius · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus/src/index.ts` (inline): `shape: { borderRadius: 6 }`, `borderRadiusToRem: (r) => \`${r/10}rem\``, and the 25-slot `shadows` array. There is no standalone `ShadowsOverrides.ts`.

## 2. Purpose

Shape is how a surface reads as a surface — rounded enough to feel like a distinct object, flat or raised enough to sit at the right depth. Radius and elevation each come from a short, deliberate scale so a card feels like a card everywhere, and a floating panel reads as floating without stealing focus from the page. Reach for shape when deciding how rounded a container should look or whether it needs to visually lift off the page.

## 3. How to use

`theme.shape.borderRadius` is the base unit (6 px). `sx={{ borderRadius: n }}` is a multiplier — `borderRadius: 2` resolves to `12 px`, `borderRadius: 1` to `6 px`.

For cases where a specific pixel radius is required (e.g. Dialog surfaces use `borderRadius: 1.2rem` = 12 px in the MuiDialog override), the theme exposes a `theme.borderRadiusToRem(px)` helper — e.g. `theme.borderRadiusToRem(12)` → `'1.2rem'`. Prefer the multiplier form in `sx` unless the radius doesn't land on the scale.

- **Default component radius** — morpheus components (Button, Chip, TextField) already ship with the right radius; do not override.
- **Card / Paper containers** — `borderRadius: 2` (12 px).
- **Main content area top-left corner** — `8px` top-left only, applied by the shell (handled by `AlationLayout`).
- **Nav icon circle (nav rail)** — `40 × 40 px` circular wrapper; handled by `NavButton`.
- **Elevation** — prefer `<Paper variant="outlined">` over `<Paper elevation={n}>` for in-content containers. Use `elevation` only when the surface must visually float (floating panel, popover).

## 4. Contract

### Guarantees
- Every radius is a multiple of the `shape.borderRadius` base — a consistent "roundness" reads across pages.
- Component-level radii are theme-baked — Button, Chip, TextField, IconButton render with the correct radius without `sx`.

### Prohibitions
- No hard-coded `px` / `rem` radii. Always `borderRadius: n` (multiplier) or `borderRadius: 'n%'` / `'50%'` for circles.
- No `sx` radius overrides on MUI UI components (Button, Chip, TextField, etc.) — the named-style system owns their shape.
- No custom box shadows via `sx` — use `<Paper elevation>` or the morpheus elevation tokens.
- Nothing outside the Inventory (§5) is valid.

### Conditions
- Circles (avatars, status dots) use `borderRadius: '50%'` — this is the only string value permitted.
- Nav rail icon wrappers use a 40×40 circular token (handled by `NavButton`); do not reinvent the wrapper.
- If a container needs a radius that isn't on the scale, stop and flag. Do not freehand `borderRadius: '9px'` — propose a new scale entry.

## 5. Inventory

### Radius scale (multipliers of `theme.shape.borderRadius = 6px`)

| Multiplier | Value | Typical use |
|---|---|---|
| `0` | 0 px | Squared surfaces (inline code blocks) |
| `1` | 6 px | Default for small controls — already baked into Button / Chip / IconButton |
| `2` | 12 px | Card, Paper, modal surface |
| `'50%'` | circle | Avatar, status dot, nav rail icon wrapper |

### Elevation tokens (use `<Paper elevation={n}>`)

The theme ships a 25-slot `shadows` array (`theme.shadows[0]`–`theme.shadows[24]`). Slots 0–4 are distinct ramp steps; slots 5–24 all repeat the slot-4 shadow — in practice only 0–4 are meaningful.

| `elevation` | Use |
|---|---|
| `0` | Flat — prefer `<Paper variant="outlined">` instead |
| `1` | Subtle raise (rare in product UI) |
| `2` | Floating panel, popover |
| `3` | Modal surface (handled by Dialog composite — don't override) |
| `4` | Heavy floating (rare — e.g. drag preview) |

## 11. Example

```tsx
import { Paper, Card, CardContent, Avatar, Typography } from '@mui/material';

// Content container — outlined Paper at radius 2
<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
  <Typography variant="subtitle1">Metric label</Typography>
  <Typography variant="hero">1,284</Typography>
</Paper>

// Card with theme-baked radius
<Card variant="outlined" sx={{ borderRadius: 2 }}>
  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
    <Typography variant="subtitle1">Card title</Typography>
  </CardContent>
</Card>

// Circle (avatar)
<Avatar sx={{ width: 24, height: 24 }}>VS</Avatar>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
