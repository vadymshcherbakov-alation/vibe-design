---
name: spacing
title: Spacing
category: foundation
last_updated: 2026-04-24

description: >
  The Alation spacing scale. Drives every padding, margin, and gap via `theme.spacing(n)` — a rem-based 8 px rhythm with half-step support.
tags: [foundation, spacing, layout]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/index.ts"
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
- **Code:** `@alation/fabric-theme-morpheus` — `src/index.ts`

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation spacing rhythm. Every gap, padding, and margin comes from one scale so "tight", "standard", and "spacious" feel consistent across the app.

## 3. How to use

<!-- Layering narrative for humans: scale-driven, which step to reach for when. No raw pixel values, no file paths. -->

Spacing is scale-driven. Pick a step based on the relationship between elements — tight for a cluster, standard for a block, wider for a section break — and the rhythm follows automatically.

- **Tight** — icon-to-label leading, adjacent controls inside a compact cluster.
- **Standard** — card and paper inner padding, the default block gap between paragraphs, the default gap inside an action row.
- **Block** — vertical rhythm between form fields, section breaks inside a page.
- **Page** — outer padding around the main content area, hero / splash surfaces.

Half-steps exist for places where the standard rhythm lands wrong — use them sparingly. If no step fits, that is a signal to flag and propose a new scale value, not to hand-tune px.

## 4. Contract

<!-- All code here: theme API paths, package paths, token keys. Phrase G/P/C against the real API. -->

### Guarantees
- `theme.spacing(factor)` returns `${0.8 * factor}rem` and the baseline `html { font-size: 62.5% }` rule makes `1rem = 10px` — every scale step lands on the 8 px rhythm.
- Every MUI component's internal spacing is already scale-aligned — consumers never compensate with odd offsets.
- Numeric `sx` shorthands (`m`, `mx`, `my`, `mt`, `mb`, `p`, `px`, `py`, `pt`, `pb`, `gap`) resolve through `theme.spacing(n)`.

### Prohibitions
- Never hard-code px or rem values for spacing. Always `theme.spacing(n)` or the numeric `sx` shorthand.
- Never put `sx` spacing overrides on MUI UI components — put layout spacing on a wrapper `<Box>` or `<Stack>`.
- Never use a negative margin to pull content back over another element's padding — fix the padding instead.
- Nothing outside §5 Variants is valid.

### Conditions
- If a required gap does not match any scale value, stop and flag. Do not freehand a px number — propose a new scale step instead.
- Nested containers must not double-pad: if a `<Paper>` has `p: 2`, its inner `<Stack>` must not add another `p: 2`.

## 5. Variants

<!-- Exhaustive scale. Nothing outside this list is valid. -->

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
