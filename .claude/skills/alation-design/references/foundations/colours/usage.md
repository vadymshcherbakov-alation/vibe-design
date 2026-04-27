---
name: colours
title: Colours
category: foundation
last_updated: 2026-04-24

description: >
  The Alation colour system. Governs brand, semantic, neutral, text, and background tokens for light and dark modes. Always consume via theme tokens — never hard-code hex values in components.
tags: [foundation, colour, palette, theming]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-3857&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib/ColorPalette.overrides.ts
example_path: ./Example.tsx

mui_base: palette
depends_on_tokens: []
depends_on_components: []
---

# Colours

## 1. Classification

- **Type:** Foundation
- **MUI base:** `palette`
- **Figma:** [Colours · NEO 2.1 Design System](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-3857&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — `src/lib/ColorPalette.overrides.ts` (+ `src/lib/palettes/*.ts` for shade sources)

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The semantic colour layer of the Alation design system. Expresses brand identity, communicates state (success, error, warning, info), and carries the neutral, text, and background scale that builds every surface.

## 3. How to use

<!-- Layering narrative for humans: brand/semantic/raw split, which layer to consume, when a one-off is OK. No file paths, no raw values. -->

Colour is organised in three layers. Consumers read the semantic layer; the lower layers exist to define it and are not for direct use in product UI.

- **Brand** — reserved for logo and marketing surfaces. Never consumed by product UI chrome.
- **Semantic** — primary, secondary, success, error, warning, info, plus text and background roles. Every product surface reads from this layer. Light and dark modes expose the same semantic role names, so a component works in both without branching.
- **Raw shades** — the underlying colour ramps that the semantic layer is assembled from. Reach past the semantic layer to a raw shade only for a genuine one-off that has been flagged in design review; otherwise the semantic token is the contract.

Pick the semantic role that matches the job: text roles for text, background roles for surfaces, status roles for state. If no semantic role fits, that is a signal to propose a new role rather than alias an existing one or drop down to a raw shade.

## 4. Contract

<!-- All code here: theme API paths, package paths, token keys. Phrase G/P/C against the real API. -->

### Guarantees
- Light and dark modes expose the same token paths — swapping theme mode never breaks a consuming component.
- Semantic pairings (e.g. `primary.main` container + contrast-valid label) meet WCAG AA by design.
- Every consumer reads `theme.palette.*` — no hex or named colour leaks into component code.
- `fabric-theme-morpheus/src/lib/ColorPalette.overrides.ts` assembles the semantic layer from raw shade palettes in `src/lib/palettes/*.ts`.

### Prohibitions
- Never hard-code hex, rgb, or named colours in component code — consume via `theme.palette.*`.
- Never use `palette.brand.*` inside product UI chrome — reserved for logo and marketing.
- Never alias an existing semantic token to a new name — propose a new role instead.
- Never read raw shades (`blue[600]`, `grey[400]`) when a semantic token fits.
- Nothing outside §5 Variants is valid.

### Conditions
- If a new role is needed, open a proposal with intended usage and contrast pair — do not alias.
- If a component requires a one-off, document the exception in this foundation before shipping.
- Colour is never the sole signal — always pair status colour with an icon or label.
- Non-text elements (focus ring, border, icon) must meet ≥ 3:1 contrast against the adjacent surface (WCAG 1.4.11).

## 5. Variants

<!-- Exhaustive. Nothing outside this list is valid. Semantic tokens first (what code consumes), raw palette second (what defines the semantic layer). -->

### Brand (logo + marketing only)

| Token | Light | Dark |
|---|---|---|
| `palette.brand.main` | `#F16923` | `#F16923` |
| `palette.brand.background` | `#00416B` | `#0C0C0D` |

### Primary / Info (blue family)

| Token | Light | Dark |
|---|---|---|
| `palette.primary.main` | `#0073DD` | `#2080D8` |
| `palette.primary.dark` | `#0059DF` | `#98C9F7` |
| `palette.primary[50]` | `#FBFCFE` | `#214A6F` |
| `palette.primary[100]` | `#ECF6FF` | `#214A6F` |
| `palette.primary[200]` | `#D9EEFF` | `#1E609D` |
| `palette.primary[300]` | `#BAE2FF` | `#2F71AE` |
| `palette.primary[400]` | `#93CCFF` | `#2976BD` |
| `palette.primary[500]` | `#57ABFF` | `#287CCA` |
| `palette.primary[800]` | `#003EB4` | `#D1E9FF` |
| `palette.primary[900]` | `#002C81` | `#F2F9FF` |

### Success (green family)

| Token | Light | Dark |
|---|---|---|
| `palette.success.main` | `#488800` | — |
| `palette.success.dark` | `#277800` | — |
| `palette.success[100]` | `#F0F8EB` | — |
| `palette.success[200]` | `#E2F3D5` | — |
| `palette.success[400]` | `#ACD987` | — |

### Error (red family)

| Token | Light | Dark |
|---|---|---|
| `palette.error.main` | `#CA334A` | — |
| `palette.error.dark` | `#C3002E` | — |
| `palette.error[100]` | `#FFF0F0` | — |

### Warning (yellow family)

| Token | Light | Dark |
|---|---|---|
| `palette.warning.main` | `#F4CB3B` | — |
| `palette.warning.dark` | `#B05F00` | — |
| `palette.warning[100]` | `#FFF6DA` | — |

> Note: `warning.main` (`#F4CB3B`) is insufficient contrast against white — always pair with dark text.

### Text

| Token | Light | Dark |
|---|---|---|
| `palette.text.primary` | `#0D1322` | `#F7FAFB` |
| `palette.text.secondary` | `#4E4E58` | `#A1A5A7` |
| `palette.text.disabled` | `#B7B7C1` | `#777B7E` |
| `palette.textShell.primary` | `#FFFFFF` | `#FFFFFF` |

### Background

| Token | Light | Dark |
|---|---|---|
| `palette.background.default` | `#FFFFFF` | `#242526` |
| `palette.background.paper` | `#FFFFFF` | `#242526` |
| `palette.background.darken10` | `rgba(78,78,88,0.1)` | *(theme-scaled)* |
| `palette.background.darken30` | `rgba(78,78,88,0.3)` | *(theme-scaled)* |
| `palette.background.lighten30` | `rgba(255,255,255,0.3)` | *(theme-scaled)* |
| `palette.background.gradient` | 65° gradient (purple / blue / orange) | — |
| `palette.background.gradientOutline` | Gradient-tinted border | — |
| `palette.background.gradientOrange` | Warm orange gradient | — |

### Neutral / Grey

Light mode:

| Shade | Value |
|---|---|
| `grey[50]` | `#FFFFFF` |
| `grey[200]` | `#F9F9FB` |
| `grey[300]` | `#F1F4F6` |
| `grey[400]` | `#E8EDF1` |
| `grey[500]` | `#D4DDE2` |
| `grey[600]` | `#B7B7C1` |
| `grey[700]` | `#71767D` |
| `grey[800]` | `#4E4E58` |
| `grey[900]` | `#0D1322` |

Dark mode:

| Shade | Value |
|---|---|
| `grey[50]` | `#0C0C0D` |
| `grey[200]` | `#242526` |
| `grey[400]` | `#393B3D` |
| `grey[600]` | `#777B7E` |
| `grey[700]` | `#A1A5A7` |
| `grey[800]` | `#CAD0D2` |
| `grey[900]` | `#F7FAFB` |

### Raw palette (source for semantic layer — not for direct use)

Base-colour scales from Figma · Palette. Consume via the semantic tokens above; reach here only for a reviewed one-off.

| Shade | Blue | Red | Amber | Green | Teal | Purple | Pink | Orange | Yellow |
|---|---|---|---|---|---|---|---|---|---|
| `100` | `#ECF6FF` | `#FFF0F0` | `#FCF4E7` | `#F0F8EB` | `#E7F9F6` | `#F5F3FF` | `#FFF0F4` | `#FFF1EB` | `#F9F5E7` |
| `200` | `#D9EEFF` | `#FFE1E1` | `#FCE9CC` | `#E2F3D5` | `#CCF6F0` | `#EDE7FF` | `#FFE1EA` | `#FFE3D5` | `#F7ECCB` |
| `300` | `#BAE2FF` | `#FFC9CB` | `#FCD9A1` | `#CBEAB2` | `#9FF0E5` | `#E0D5FF` | `#FFC8DB` | `#FFCEB3` | `#F1DDA0` |
| `400` | `#93CCFF` | `#FFA8AC` | `#F2BF6A` | `#ACD987` | `#5CE2D2` | `#CBBAFF` | `#FFA7C5` | `#FFAF89` | `#E4C668` |
| `500` | `#57ABFF` | `#FF7781` | `#E19900` | `#81BE40` | `#00CAB6` | `#AF91FF` | `#FC76A4` | `#FE8047` | `#CFA400` |
| `600` | `#0073DD` | `#CA334A` | `#AC6000` | `#488800` | `#009482` | `#7C56D5` | `#C4336F` | `#F16923` *(Brand)* | `#9B6C00` |
| `700` | `#0059DF` | `#C3002E` | `#A44400` | `#277800` | `#008673` | `#6F33D5` | `#BD005C` | `#C10000` | `#915500` |
| `800` | `#003EB4` | `#9B001B` | `#812C00` | `#125C00` | `#006758` | `#5519AC` | `#960044` | `#990000` | `#713C00` |
| `900` | `#002C81` | `#6F0012` | `#5C1F00` | `#0D4100` | `#00493E` | `#3C137B` | `#6B0030` | `#6E0000` | `#512A00` |

> **Known divergences** (Figma vs `fabric-theme-morpheus` code, as of 2026-04-22): `orange.ts` uses a generic orange scale; Figma uses Alation warm orange (only `600 = #F16923` is canonical Brand). `yellow.ts` ships a different muted-gold ramp than Figma. The semantic layer in the token tables above is the binding contract for product code — the raw palette discrepancies do not affect consuming components unless they reach past the semantic tokens.

### Contrast pairings (light-mode audit)

| Pair | Ratio | Verdict |
|---|---|---|
| `text.primary` on `background.paper` | 17.9:1 | ✓ AAA |
| `text.secondary` on `background.paper` | 8.7:1 | ✓ AAA |
| `primary.main` button (white label) | 4.8:1 | ✓ AA |
| `error.main` button (white label) | 4.6:1 | ✓ AA |
| `warning.main` on white | — | ✗ insufficient — pair with dark text |
| `text.disabled` on `background.paper` | 2.2:1 | ✗ by design (WCAG exempts disabled state) |

Dark-mode audit — TBD.

## 11. Example

```tsx
// Semantic consumption via theme — never hard-code
const styles = {
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.primary.main,
};

// sx shorthand (preferred for MUI components)
<Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
  <Typography>Content</Typography>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
