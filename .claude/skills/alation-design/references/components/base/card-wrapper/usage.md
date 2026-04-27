---
name: card-wrapper
title: Card Wrapper
category: base-component
last_updated: 2026-04-22

description: >
  The surface primitive — a low-level wrapper that provides the rounded,
  bordered container used by every card-like UI in the system. Covers MUI
  `Card` + `Paper`. Use `<Card>` for composed surfaces with header / content
  / actions; use `<Paper>` for lighter containers (metric panels, subtle
  grouping). Named **Card Wrapper** to distinguish it from the composite
  cards (Nav Card, Metric Card) that consume it.
tags: [surface, card, card-wrapper, paper, container]

figma_url: ""
code_reference: fabric-theme-morpheus/src/lib (MuiCard, MuiCardContent, MuiPaper overrides)
example_path: ./Example.tsx

mui_base: Card
depends_on_tokens:
  - palette.background.paper
  - palette.divider
  - shape.borderRadius
  - typography.subtitle1
depends_on_components:
  - Card
  - CardContent
  - Paper
---

# Card Wrapper

## 1. Classification

- **Type:** Base component
- **MUI base:** `Card` (plus `Paper` as the lower-level surface primitive)
- **Figma:** Card Wrapper · NEO 2.1 — *not yet linked*
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiCard.overrides.ts` · `src/lib/MuiCardContent.overrides.ts` · `src/lib/MuiPaper.overrides.ts`

## 2. Purpose

**Card Wrapper** is the low-level surface primitive that gives other UI its rounded, bordered container. It groups related content into one readable surface — a summary tile, a settings group, a metric, a nav entry — and gives that content a shape the eye can scan as a single unit. Reach for Card Wrapper whenever a block of information needs to sit apart from the page flow as its own readable object.

The name **Card Wrapper** distinguishes this base primitive from the *composite* cards in the system — **Nav Card**, **Metric Card** — which are themselves built on top of Card Wrapper. If you're composing a branded entity tile with its own fixed anatomy, reach for the composite; if you just need a bordered, padded surface to put arbitrary content in, Card Wrapper is the right tool.

**On Paper.** `Paper` is the same surface without the `CardHeader` / `CardContent` / `CardActions` slots. If the content is flat (a metric panel, a simple bordered box), use `<Paper variant="outlined">`; if the content needs the structured slots, use `<Card>`. Both share the same radius, padding, and border rules.

## 3. When to use / When not to use

**Use when**
- Grouping related content into a visually distinct surface (content card, metric panel, sidebar module)
- A page section needs a light border to separate it from the page body
- A composed unit needs a header / content / actions slot structure → `<Card>`
- A simple container needs only a bordered box with padding → `<Paper variant="outlined">`

**Do not use when**
- The surface is a modal → use **Dialog** (composite) — do not paint a Card as a modal
- The surface is a page section with no visual separation → use plain `<Box>`
- The container needs to float over other content → use **Popover** / **Menu** (component-owned elevation)

## 4. Contract

### Guarantees
- Every surface uses `borderRadius: 2` (12 px) by default.
- Every inner surface uses `p: 2` (16 px) by default.
- Card titles render with `<Typography variant="subtitle1">`.
- Variant `outlined` is theme-consistent with surrounding UI; no custom borders needed.

### Prohibitions
- No raw `<Box>` with hand-painted `border` + `borderRadius` when a `<Paper>` fits.
- No `p: 3` (24 px) as a default — reserve for large modals, full-page empty states, or explicitly spacious layouts. Prefer `p: 2.5` over `p: 3` when more space is genuinely needed.
- No Card / panel title in `body1`, `body2`, or any `h*` variant. Always `subtitle1`.
- No hard-coded `boxShadow` via `sx`. Use `<Paper elevation={n}>` or `variant="outlined"`.
- No `CardContent` without the last-child padding override — MUI's default adds unwanted `pb: 3`.

### Conditions
- **`CardContent` last-child gutter** must always be neutralised:
  ```tsx
  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
  ```
- Clickable Cards must expose an accessible name (either via `aria-label` or the card's own header text) and a visible focus ring — wrap in `<CardActionArea>` rather than hand-rolling the click target.
- Choose `<Paper>` over `<Card>` when you don't need the `CardHeader` / `CardContent` / `CardActions` slot structure (metric panels, simple stat tiles, generic content boxes).

## 5. Variants

### 5.1 `variant` prop

| Variant | Role |
|---|---|
| `outlined` (default) | Bordered surface — standard in product UI |
| `elevation` | Raised surface — use only when the surface must visually float |
| `gradient` | Branded gradient fill. Emphasis / marketing surfaces only. Not for standard product UI. |
| `gradientOutlined` | Branded gradient border on a neutral fill. Same restriction — emphasis only. |

### 5.2 `elevation` prop (Paper only, when `variant="elevation"`)

| Value | Use |
|---|---|
| `0` | Flat — prefer `variant="outlined"` instead |
| `1` | Subtle raise (rare) |
| `2` | Floating panel, popover (Popover / Menu components handle this themselves) |
| `3` | Modal surface (handled by Dialog — don't set directly) |

## 6. Anatomy

**Card (structured)**
- **Container** — bordered surface at `borderRadius: 2`.
- **Header** (`CardHeader`, optional) — title + subheader + optional avatar / action slot.
- **Content** (`CardContent`) — body area; padding `p: 2` with last-child override.
- **Actions** (`CardActions`, optional) — row of buttons at the bottom.

**Paper (flat)**
- **Container** — bordered or elevated surface; padding and radius from `sx`.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Border colour from theme; radius `2` | — |
| Hover (clickable) | Pointer over `CardActionArea` | Subtle surface tint | Only when wrapped in `CardActionArea` |
| Focus-visible (clickable) | Keyboard focus on `CardActionArea` | Visible ring | Required |
| Disabled | Rarely applies | Faded border + content | — |

## 11. Example

```tsx
import { Card, CardContent, Paper, Typography } from '@mui/material';

// Default Card with structured content
<Card variant="outlined" sx={{ borderRadius: 2 }}>
  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
    <Typography variant="subtitle1">Card title</Typography>
    <Typography variant="body2" color="text.secondary">Supporting description text.</Typography>
  </CardContent>
</Card>

// Metric / stat Paper
<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
  <Typography variant="subtitle1">Total CDEs</Typography>
  <Typography variant="hero">1,284</Typography>
</Paper>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
