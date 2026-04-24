---
name: spacing
title: Spacing
category: foundation
last_updated: 2026-04-23

description: >
  The Alation spacing scale. Drives every padding, margin, and gap via
  `theme.spacing(n)` — a rem-based 8 px rhythm with half-step support.
tags: [foundation, spacing, layout]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/index.ts (spacing fn, inline) + MuiCssBaseline html { fontSize: '62.5%' }"
example_path: ./Example.tsx

mui_base: spacing
depends_on_tokens: []
depends_on_components: []
---

# Spacing

## 1. Classification

- **Type:** Foundation
- **MUI base:** `spacing`
- **Figma:** [Spacing scale · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus/src/index.ts` — `spacing: (factor) => \`${0.8 * factor}rem\`` + `MuiCssBaseline` sets `html { fontSize: '62.5%' }` (so `1rem = 10px`, `0.8rem = 8px`).

## 2. Purpose

Spacing is the breathing room between elements — how close or how separated they read. Every gap, padding, and margin comes from one 8 px rhythm, so "tight", "standard", and "spacious" feel the same across the app. Reach for a specific step based on the relationship between elements: tight for a cluster, standard for a block, wider for a section break.

## 3. How to use

Consume via `theme.spacing(n)` or the `sx` numeric shorthand (`p: 2` → `theme.spacing(2)` → `1.6rem` → `16px`). Half-steps (`1.5`, `2.5`) are supported.

Under the hood, `theme.spacing(factor)` returns `${0.8 * factor}rem` and the baseline `html { font-size: 62.5% }` rule makes `1rem = 10px`. Consumers don't need to think about rem — use the numeric scale and the render value falls on the 8 px rhythm.

- **Page body padding** — `<Box sx={{ p: 4 }}>` (32 px) inside the main content area.
- **Form stack spacing** — `<Stack spacing={3}>` (24 px) between fields.
- **Card / Paper inner padding** — `sx={{ p: 2 }}` (16 px). Do not reach for `p: 3` unless the context is a large modal, empty state, or explicitly spacious layout.
- **Icon-to-label leading margin** (e.g. label info icon) — `theme.spacing(0.5)` (4 px).
- Standard MUI string shorthands (`m`, `mx`, `my`, `mt`, `mb`, `p`, `px`, `py`, `pt`, `pb`, `gap`) all accept the numeric scale.

## 4. Contract

### Guarantees
- The 8 px base × multiplier rhythm is stable across components — picking a scale value guarantees alignment with neighbouring elements.
- Every component's internal spacing is already scale-aligned — consumers never need to compensate with odd offsets.

### Prohibitions
- No hard-coded px / rem values in spacing. Always `theme.spacing(n)` or the numeric `sx` shorthand.
- No `sx` spacing overrides on MUI UI components — put layout spacing on a wrapper `<Box>` or `<Stack>` instead.
- No negative margins to pull content back over another element's padding — fix the padding instead.
- Nothing outside the Inventory (§5) is valid.

### Conditions
- If a required gap does not match any scale value, stop and flag. Do not freehand a px number — propose a new scale step instead.
- Nested containers should not double-pad: if a `<Paper>` has `p: 2`, its inner `<Stack>` should not add another `p: 2`.

## 5. Inventory

Exhaustive. Nothing outside this list is valid.

| `sx` / `theme.spacing(n)` | Value | Typical use |
|---|---|---|
| `0` | 0 px | No gap |
| `0.5` | 4 px | Icon-to-label leading; adjacent-icon gap |
| `1` | 8 px | Tight cluster (chip gap, inline control gap) |
| `1.5` | 12 px | Compact form stacks |
| `2` | 16 px | Card / Paper inner padding; standard block gap |
| `2.5` | 20 px | Spacious card padding (exception cases) |
| `3` | 24 px | Form field stack (`<Stack spacing={3}>`); section breaks |
| `4` | 32 px | Page body padding (`<Box sx={{ p: 4 }}>`) |
| `5` | 40 px | Large section separation on spacious layouts |
| `6` | 48 px | Empty-state vertical rhythm |
| `8` | 64 px | Page hero / splash padding |

## 11. Example

```tsx
import { Box, Paper, Stack, TextField, Button } from '@mui/material';

// Page body
<Box sx={{ p: 4 }}>
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
    <Stack spacing={3}>
      <TextField label="Name" fullWidth />
      <TextField label="Description" fullWidth multiline minRows={3} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained">Save</Button>
        <Button variant="outlined" color="inherit">Cancel</Button>
      </Box>
    </Stack>
  </Paper>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
