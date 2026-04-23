---
name: colours
title: Colours
category: foundation
last_updated: 2026-04-21

description: >
  The Alation colour system. Governs brand, semantic, neutral, text, background, and action tokens for light and dark modes. Always consume via theme tokens (`theme.palette.*`) — never hard-code hex values in components.
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

The semantic colour layer of the Alation design system. Expresses brand identity, communicates state (success, error, warning, info), and carries the neutral / text / background scale that builds every surface.

## 3. How to use

Colour lives in the MUI theme as `theme.palette.*`. Every consumer reads it through the theme — either via the `sx` shorthand (`<Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>`) or directly as `theme.palette.primary.main` inside style objects.

**Codebase path** — `fabric-theme-morpheus/src/lib/ColorPalette.overrides.ts` assembles the semantic layer from raw shade palettes in `src/lib/palettes/*.ts`. Light and dark modes are two separate, parallel assemblies — `colorPaletteOverridesDark` redefines every token rather than deriving from the light palette.

**Token layers**

- **Brand** — reserved for logo and marketing surfaces only. Never consumed by product UI chrome.
- **Semantic** — `primary`, `secondary`, `success`, `error`, `warning`, `info`. Each family exposes `.main`, `.dark`, `.light` plus the numbered shade scale. Consumers read these, not the raw family.
- **Neutral (Grey)** — 10-step scale shared by text, borders, and surfaces. Dark mode is a separate inversion, not a derivation.
- **Text** — semantic layer over Neutral. Use `text.primary` / `secondary` / `disabled` rather than grey shades directly.
- **Background** — surface layer (`default`, `paper`) plus transient overlay helpers (`darken10/30`, `lighten30`) and the brand `gradient`.
- **Raw vs semantic layering** — components read the **semantic** layer (`primary.main`, `text.primary`, `background.paper`). Raw shades (`blue[600]`, `grey[400]`) exist to define the semantic layer and for one-off cases flagged in review.

## 4. Contract

### Guarantees
- Light and dark modes expose the same token paths — swapping theme mode never breaks a consuming component.
- Semantic pairings (e.g. `primary.main` container + contrast-valid label colour) meet WCAG AA by design.
- Brand tokens are stable across product chrome skins.
- Every consumer reads `theme.palette.*` — no hex / rgb / named colour leaks into component code.

### Prohibitions
- Never hard-code hex, rgb, or named colours in component code — consume via `theme.palette.*`.
- Never use `palette.brand.*` inside product UI chrome — reserved for logo and marketing.
- Never alias an existing semantic token to a new name — propose a new role instead.
- Never bypass the semantic layer by reading raw shades (`blue[600]`) when a semantic token fits.
- Never pick a raw shade (e.g. `grey[400]`) for text when a `text.*` token exists.
- Nothing outside the Palette (§5) + Inventory (§6) is valid.

### Conditions
- If a new role is needed, open a proposal with intended usage and contrast pair — do not alias.
- If a component requires a one-off value for a genuine exception, document it in this foundation before shipping.
- If dark mode ships a colour divergence (not just inversion), flag it as a new semantic token.
- Colour is never the sole signal — always pair status colour with an icon or label.
- Non-text elements (focus ring, border, icon) must meet ≥ 3:1 contrast against the adjacent surface (WCAG 1.4.11).

## 5. Palette

Raw base-colour scales. **Source of truth:** [Figma · Palette](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=2973-3656&t=eS5ReSD4ZsCMa08a-4) (91 base colour tokens, bound to Palette variables). Ten families × 9 shades (Neutral has 10). Consume these via the semantic layer in §6 — never reach past the semantic token unless a review has flagged the exception.

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

### Neutral (Grey)

| Shade | Value |
|---|---|
| `50`  | `#FAFAFA` |
| `100` | `#F5F5F5` |
| `200` | `#E5E5E5` |
| `300` | `#D4D4D4` |
| `400` | `#A3A3A3` |
| `500` | `#737373` |
| `600` | `#525252` |
| `700` | `#404040` |
| `800` | `#262626` |
| `900` | `#171717` |

### Code alignment

Figma palette vs `fabric-theme-morpheus/src/lib/palettes/*.ts` (as of 2026-04-22):

- **Aligned:** `blue`, `red`, `amber`, `green`, `teal`, `purple`, `pink` — every shade matches.
- **Aligned (new scale):** Figma `Neutral (Grey)` matches `neutral.ts` (50–900), except `300` — Figma `#D4D4D4`, code `#D4D4D8` (1-bit divergence).
- **Diverges:** `orange.ts` — code ships a generic orange scale (`#FFF7ED`, `#FFEDD5`, `#FB923C`, …); Figma ships the Alation warm orange (`#FFF1EB`, `#FFE3D5`, `#F16923`, …). Only `600 = #F16923` is the canonical Brand value.
- **Diverges:** `yellow.ts` — code `100 = #FFF6DA`, `400 = #F4CB3B`, `700 = #B05F00`; Figma `100 = #F9F5E7`, `400 = #E4C668`, `700 = #915500`. Completely different muted-gold ramp.
- **Legacy co-exists:** the semantic layer in §6 still reads from the legacy `grey.ts` (`#FFFFFF`…`#0D1322`, `#F9F9FB`, `#F1F4F6`) and from `yellow.ts` for `warning.main`. These predate the NEO 2.1 Palette refresh shown in Figma.

Action: reconcile `orange.ts` / `yellow.ts` / `grey.ts` against the Figma Palette — or document the intentional divergence. Until reconciled, the semantic layer (§6) is the binding contract for product code.

## 6. Inventory

Exhaustive. Nothing outside this list is valid.

### Brand (logo + marketing only)
| Token | Light | Dark |
|---|---|---|
| `palette.brand.main` | `#f16923` | `#f16923` |
| `palette.brand.background` | `#00416b` | `#0C0C0D` |

### Primary / Info (blue family)
| Shade | Light | Dark-mode equivalent |
|---|---|---|
| `50` | `#FBFCFE` | `#214A6F` |
| `100` | `#ECF6FF` | `#214A6F` |
| `200` | `#D9EEFF` | `#1E609D` |
| `300` | `#BAE2FF` | `#2F71AE` |
| `400` | `#93CCFF` | `#2976BD` |
| `500` | `#57ABFF` | `#287CCA` |
| `600` (**`primary.main`**) | `#0073DD` | `#2080D8` |
| `700` (**`primary.dark`**) | `#0059DF` | `#98C9F7` |
| `800` | `#003EB4` | `#D1E9FF` |
| `900` | `#002C81` | `#F2F9FF` |

### Success (green family)
| Shade | Value |
|---|---|
| `100` (light surface) | `#F0F8EB` |
| `200` | `#E2F3D5` |
| `400` | `#ACD987` |
| `600` (**`success.main`**) | `#488800` |
| `700` (**`success.dark`**) | `#277800` |

### Error (red family)
| Shade | Value |
|---|---|
| `100` (light surface) | `#FFF0F0` |
| `600` (**`error.main`**) | `#CA334A` |
| `700` (**`error.dark`**) | `#C3002E` |

### Warning (yellow family)
| Shade | Value |
|---|---|
| `100` (light surface) | `#FFF6DA` |
| `400` (**`warning.main`**) | `#F4CB3B` |
| `700` (**`warning.dark`**) | `#B05F00` |

### Neutral / Grey — Light mode
| Shade | Value |
|---|---|
| `50` | `#FFFFFF` |
| `100` | `#FFFFFF` |
| `200` | `#F9F9FB` |
| `300` | `#F1F4F6` |
| `400` | `#E8EDF1` |
| `500` | `#D4DDE2` |
| `600` | `#B7B7C1` |
| `700` | `#71767D` |
| `800` | `#4E4E58` |
| `900` | `#0D1322` |

### Neutral / Grey — Dark mode
| Shade | Value |
|---|---|
| `50` | `#0C0C0D` |
| `200` | `#242526` |
| `400` | `#393B3D` |
| `600` | `#777B7E` |
| `700` | `#A1A5A7` |
| `800` | `#CAD0D2` |
| `900` | `#F7FAFB` |

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
| `palette.background.darken10` | `rgba(78, 78, 88, 0.1)` | *(theme-scaled)* |
| `palette.background.darken30` | `rgba(78, 78, 88, 0.3)` | *(theme-scaled)* |
| `palette.background.lighten30` | `rgba(255, 255, 255, 0.3)` | *(theme-scaled)* |
| `palette.background.gradient` | 65° gradient (purple / blue / orange) | — |
| `palette.background.gradientOutline` | Gradient-tinted border (pairs with `gradient` on `<Paper variant="gradientOutlined">`) | — |
| `palette.background.gradientOrange` | Warm orange gradient (accent / marketing) | — |

> **Production also ships extra colour families** consumed ad-hoc by specific surfaces: `cyan`, `violet`, `green`, `emerald`, `lineage`, `diff`, plus the semantic family aliases (`brand`). These are defined in `fabric-theme-morpheus/src/lib/palettes/*.ts` but are not part of the core semantic layer in §6. Do not reach for them in product UI without a design review — stick to the semantic tokens above.

### Contrast pairings (light-mode audit)

| Pair | Ratio | Verdict |
|---|---|---|
| `text.primary` on `background.paper` — `#0D1322` on `#FFFFFF` | 17.9:1 | ✓ AAA |
| `text.secondary` on `background.paper` — `#4E4E58` on `#FFFFFF` | 8.7:1 | ✓ AAA |
| `primary.main` button (white label) — `#FFFFFF` on `#0073DD` | 4.8:1 | ✓ AA |
| `error.main` button (white label) — `#FFFFFF` on `#CA334A` | 4.6:1 | ✓ AA |
| `warning.main` label on surface — `#F4CB3B` | — | ✗ insufficient against white; pair with dark text |
| `text.disabled` on `background.paper` — `#B7B7C1` on `#FFFFFF` | 2.2:1 | ✗ by design (WCAG exempts disabled state) |

Dark mode parallel audit — TBD.

## 11. Example

```tsx
const styles = {
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.primary.main,
};

// sx shorthand (preferred)
<Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
  <Typography>Content</Typography>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
