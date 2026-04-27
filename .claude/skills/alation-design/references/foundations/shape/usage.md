---
name: shape
title: Shape
category: foundation
last_updated: 2026-04-24

description: >
  Border-radius and elevation rules. Every rounded surface derives from `shape.borderRadius` (6 px base); cards, papers, and modal surfaces use `borderRadius: 2` (12 px) by default.
tags: [foundation, shape, radius, elevation]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/index.ts"
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
- **Code:** `@alation/fabric-theme-morpheus` — `src/index.ts`

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation roundness and depth system. Radius and elevation each come from a short, deliberate scale so a card reads as a card everywhere, and a floating panel sits at the right depth without stealing focus.

## 3. How to use

<!-- Layering narrative for humans: radius multiplier, elevation ramp, outlined-vs-elevated preference. No raw px values. -->

Shape splits into radius and elevation. Both are scale-driven — pick a step for what the surface does, not a specific px.

- **Radius** — most product surfaces use the default card / paper roundness. Small controls (Button, Chip, TextField) ship with their own baked-in radius; consumers never override. Circles (avatar, status dot, nav icon wrapper) use the circle step.
- **Elevation** — prefer an outlined Paper over an elevated one for in-content containers. Reach for an elevation step only when the surface must visually float — a popover, a dragging preview, a modal that needs to lift away from the page.
- **Modal surfaces** — their radius and elevation are owned by the Dialog composite. Do not override from the call site.

If a container needs a radius or a depth that the scale does not cover, that is a signal to flag and propose a new step — not to freehand a px value or a custom box-shadow.

## 4. Contract

<!-- All code here: theme API paths, package paths, token keys. Phrase G/P/C against the real API. -->

### Guarantees
- `theme.shape.borderRadius = 6` and `sx={{ borderRadius: n }}` resolves to `n × 6px` — a consistent "roundness" reads across pages.
- Morpheus components (Button, Chip, TextField, IconButton) render with the correct radius without `sx`.
- `theme.borderRadiusToRem(px)` is available when a specific pixel radius is required (returns a rem string). The Dialog override uses it for the modal surface radius.
- `theme.shadows[0..4]` are distinct elevation steps; slots `5..24` repeat slot 4.

### Prohibitions
- Never hard-code `px` or `rem` radii. Always `borderRadius: n` (multiplier) or `borderRadius: '50%'` for circles.
- Never override the radius of a morpheus UI component (Button, Chip, TextField, etc.) via `sx` — the named-style system owns their shape.
- Never author a custom box shadow via `sx` — use `<Paper elevation={n}>` or the morpheus elevation tokens.
- Nothing outside §5 Variants is valid.

### Conditions
- Circles (avatars, status dots) use `borderRadius: '50%'` — the only string value permitted for radius.
- Nav rail icon wrappers use a 40×40 circular token handled by `NavButton` — do not reinvent the wrapper.
- If a container needs a radius that isn't on the scale, stop and flag. Do not freehand `borderRadius: '9px'` — propose a new scale entry.

## 5. Variants

<!-- Exhaustive. Nothing outside this list is valid. -->

### 5.1 Radius scale (multipliers of `theme.shape.borderRadius = 6px`)

| Multiplier | Value | Typical use |
|---|---|---|
| `0` | 0 px | Squared surfaces (inline code blocks) |
| `1` | 6 px | Default for small controls — baked into Button / Chip / IconButton |
| `2` | 12 px | Card, Paper, modal surface |
| `'50%'` | circle | Avatar, status dot, nav rail icon wrapper |

### 5.2 Elevation tokens (use `<Paper elevation={n}>`)

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

<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
  <Typography variant="subtitle1">Metric label</Typography>
  <Typography variant="hero">1,284</Typography>
</Paper>

<Card variant="outlined" sx={{ borderRadius: 2 }}>
  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
    <Typography variant="subtitle1">Card title</Typography>
  </CardContent>
</Card>

<Avatar sx={{ width: 24, height: 24 }}>VS</Avatar>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
