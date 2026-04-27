---
name: divider
title: Divider
category: base-component
last_updated: 2026-04-21

description: >
  A horizontal or vertical separator. Use for grouping within a surface —
  never as a page-level shell divider (the shell already owns its borders).
tags: [separator, divider, layout]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3423-347&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib/MuiDivider.overrides.ts
example_path: ./Example.tsx

mui_base: Divider
depends_on_tokens:
  - palette.divider
depends_on_components:
  - Divider
---

# Divider

## 1. Classification

- **Type:** Base component
- **MUI base:** `Divider`
- **Figma:** [Divider · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3423-347&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiDivider.overrides.ts`

## 2. Purpose

A Divider is a thin line that breaks content into groups inside a surface. It communicates "these are related to each other but not to what's on the other side of the line." Reach for it when two adjacent blocks need to feel separate but shouldn't sit in their own containers — sections inside a Card, groups inside a Menu, toolbar clusters next to each other.

## 3. When to use / When not to use

**Use when**
- Separating sections inside a Card / Paper
- Splitting toolbar groups (vertical divider)
- Grouping menu items inside a `Menu` / `List`

**Do not use when**
- The separator is the edge of a shell region (page header, main area) → the shell already owns that border
- The group needs more visual emphasis → use a `<Paper variant="outlined">` to wrap the section instead
- The content is already visually separated by spacing alone — do not over-divide

## 4. Contract

### Guarantees
- Uses `palette.divider` colour — consistent across modes and surfaces.
- Thin (1 px) rule with no shadow.
- Renders the correct semantic element (horizontal `<hr>` or vertical presentation) based on `orientation`.

### Prohibitions
- No raw `<hr />` in JSX.
- No `sx` override of colour or thickness. The token is the contract.
- No decorative dividers with custom icons or labels in plain product UI — `<Divider>Label</Divider>` is permitted but sparingly.
- No Divider stacked back-to-back (two in a row) — it indicates missing content or over-grouping.

### Conditions
- Vertical dividers in a flex row must have an explicit `flexItem` prop for height to track the row.
- A divider inside a `<List>` should use `component="li"` to remain valid inside the list semantics.

## 5. Variants

### 5.1 `orientation` prop

| Value | Use |
|---|---|
| `horizontal` (default) | Between stacked sections |
| `vertical` | Inside a flex row — requires `flexItem` |

### 5.2 `variant` prop

| Variant | Use |
|---|---|
| `fullWidth` (default) | Spans the container |
| `middle` | Inset from both sides — for lists |
| `inset` | Inset from the left — for lists with leading avatars |

## 6. Anatomy

- **Rule** — 1 px line in `palette.divider`.
- **Optional label** — centred text (sparingly used).

## 7. States

Dividers are stateless.

## 11. Example

```tsx
import { Divider, Paper, Stack, Typography, Box, Button } from '@mui/material';

// Between stacked sections
<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
  <Typography variant="subtitle1">Section A</Typography>
  <Divider sx={{ my: 2 }} />
  <Typography variant="subtitle1">Section B</Typography>
</Paper>

// Vertical in a toolbar
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  <Button variant="text">Filter</Button>
  <Divider orientation="vertical" flexItem />
  <Button variant="text">Sort</Button>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
