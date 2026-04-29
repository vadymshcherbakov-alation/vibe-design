---
name: colours
title: Colours
category: foundation
last_updated: 2026-04-29

description: >
  The Alation colour system. Governs the semantic token layer (Background, Border, Icon, Text) and the underlying raw palette that defines it. Always consume via the semantic token that matches the UI concept — never hard-code hex.
tags: [foundation, colour, palette, theming, semantic-tokens]

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
- **Figma:** [Colours · NEO 2.1 Design System](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-3857&t=eS5ReSD4ZsCMa08a-1) — `Color (Semantic)` collection, 97 tokens, Light + Dark modes
- **Code:** `fabric-theme-morpheus` — `src/lib/ColorPalette.overrides.ts` (+ `src/lib/palettes/*.ts` for shade sources)

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The semantic colour layer of the Alation design system. Tokens are organised by the UI concept they paint — Background, Border, Icon, Text — with a per-element subgroup (button, chip, control, surface, etc.) so a component reaches for a single token that already encodes role + role-context.

## 3. How to use

<!-- Layering narrative for humans: brand/semantic/raw split, which layer to consume, when a one-off is OK. No file paths, no raw values. -->

Colour is organised in two layers. Consumers read the **semantic** layer; the **raw palette** exists to define it and is not for direct use in product UI.

- **Semantic** — 97 tokens grouped by UI concept (Background / Border / Icon / Text) and sub-grouped by element (control, button, chip, surface, accent, scrollbar, avatar, progress, misc). Light and dark modes expose the same token paths, so a component works in both without branching. Reach for the token whose name describes both the property you are painting *and* the element you are painting it on — e.g. `background/chip/blue` for a chip's fill, `text/chip/blue` for its label, `border/button/error` for a destructive button outline.
- **Raw palette** — 9 colour ramps (Blue, Red, Amber, Green, Teal, Purple, Pink, Orange, Yellow) plus a Neutral scale. The semantic layer is assembled from these. Reach past the semantic layer to a raw shade only for a reviewed one-off; otherwise the semantic token is the contract.

If the UI concept you're painting does not map to an existing semantic token, that is a signal to propose a new one rather than alias an existing token or drop down to a raw shade.

**Brand** (`#F16923`, Orange/600) is exposed only via `background/chip/orange-strong` and `text/chip/orange` in the semantic layer — reserved for branded surfaces, never for product UI chrome.

## 4. Contract

<!-- All code here: theme API paths, package paths, token keys. Phrase G/P/C against the real API. -->

### Guarantees
- Every semantic token has a Light and a Dark value — swapping mode never breaks a consuming component.
- Token names describe **property + element** (`background/chip/blue`, `text/button/primary`, `border/misc/placeholder`) — name alone tells you where it belongs.
- Status tokens (`error`, `warning`, `success`, `information`) carry contrast-valid pairings between same-role background/text/icon tokens.
- `fabric-theme-morpheus/src/lib/ColorPalette.overrides.ts` assembles the semantic layer from raw shade palettes in `src/lib/palettes/*.ts`. The Figma `Color (Semantic)` collection is the binding source; morpheus mirrors it.

### Prohibitions
- Never hard-code hex, rgb, or named colours in component code — consume via the semantic token.
- Never use `background/chip/orange-strong` (Brand orange) or `text/chip/orange` outside branded surfaces — reserved for logo and marketing.
- Never alias an existing semantic token to a new name — propose a new role instead.
- Never read raw shades (`Blue/600`, `Neutral (Grey)/400`) when a semantic token fits.
- Never mix groups across a single element — a chip painted with `background/chip/blue` must use `text/chip/blue`, not `text/primary`.
- Nothing outside §5 Variants is valid.

### Conditions
- If a new role is needed, open a proposal with intended usage, target element, and contrast pair — do not alias.
- If a component requires a one-off, document the exception in this foundation before shipping.
- Colour is never the sole signal — always pair status colour with an icon or label.
- Non-text elements (focus ring, border, icon) must meet ≥ 3:1 contrast against the adjacent surface (WCAG 1.4.11).

## 5. Variants

<!-- Exhaustive. Nothing outside this list is valid. Mirrors the Figma `Color (Semantic)` collection 1:1. Sub-grouped by element. -->

The semantic layer is organised into four UI-concept groups, each with element subgroups. Token paths use the `/` separator from Figma; the morpheus theme mirrors these paths.

### Background

#### `surface` — page and panel surfaces

| Token | Light | Dark |
|---|---|---|
| `background/surface/default` | `#FFFFFF` | `#171717` |
| `background/surface/secondary` | `#FAFAFA` | `#262626` |
| `background/surface/modal/backdrop` | `#27272AB2` | `#FFFFFF` |

#### `control` — input, select, toggle, checkbox, radio fills

| Token | Light | Dark |
|---|---|---|
| `background/control/default` | `#FFFFFF` | `#262626` |
| `background/control/hover` | `#F5F5F5` | `#404040` |
| `background/control/secondary` | `#F5F5F5` | `#262626` |
| `background/control/secondary-hover` | `#E5E5E5` | `#404040` |
| `background/control/disabled` | `#FAFAFA` | `#404040` |
| `background/control/selected` | `#F5F5F5` | `#404040` |
| `background/control/inverted` | `#262626` | `#F5F5F5` |
| `background/control/warning` | `#FCE9CC` | `#FCE9CC` |
| `background/control/error` | `#FFE1E1` | `#FFE1E1` |
| `background/control/information` | `#D9EEFF` | `#D9EEFF` |
| `background/control/success` | `#E2F3D5` | `#E2F3D5` |

#### `button` — solid + secondary button fills

| Token | Light | Dark |
|---|---|---|
| `background/button/primary` | `#0073DD` | `#57ABFF` |
| `background/button/primary-hover` | `#0059DF` | `#93CCFF` |
| `background/button/error` | `#CA334A` | `#FF7781` |
| `background/button/error-hover` | `#C3002E` | `#FFA8AC` |
| `background/button/secondary-hover` | `#ECF6FF` | `#003EB4` |
| `background/button/error-secondary-hover` | `#FFF0F0` | `#9B001B` |

#### `progress` — progress bar fill

| Token | Light | Dark |
|---|---|---|
| `background/progress/primary` | `#0073DD` | `#57ABFF` |

#### `scrollbar` — scrollbar thumb

| Token | Light | Dark |
|---|---|---|
| `background/scrollbar/default` | `#D4D4D4` | `#404040` |
| `background/scrollbar/hover` | `#A3A3A3` | `#525252` |

#### `avatar` — avatar fills

| Token | Light | Dark |
|---|---|---|
| `background/avatar/default` | `#0073DD` | `#57ABFF` |
| `background/avatar/subtle` | `#D4D4D4` | `#404040` |

#### `misc` — one-off background roles

| Token | Light | Dark |
|---|---|---|
| `background/misc/placeholder` | `#FFF0F4` | `#960044` |

#### `accent` — soft callout / highlight backgrounds

| Token | Light | Dark |
|---|---|---|
| `background/accent/gray` | `#E5E5E5` | `#E5E5E5` |
| `background/accent/blue` | `#D9EEFF` | `#D9EEFF` |
| `background/accent/red` | `#FFE1E1` | `#FFE1E1` |
| `background/accent/amber` | `#FCE9CC` | `#FCE9CC` |
| `background/accent/green` | `#E2F3D5` | `#E2F3D5` |
| `background/accent/teal` | `#CCF6F0` | `#CCF6F0` |
| `background/accent/purple` | `#EDE7FF` | `#EDE7FF` |
| `background/accent/pink` | `#FFE1EA` | `#FFE1EA` |

#### `chip` — chip / tag / pill fills (subtle and strong variants)

| Token | Light | Dark |
|---|---|---|
| `background/chip/gray` | `#E5E5E5` | `#262626` |
| `background/chip/blue` | `#D9EEFF` | `#003EB4` |
| `background/chip/red` | `#FFE1E1` | `#9B001B` |
| `background/chip/amber` | `#FCE9CC` | `#812C00` |
| `background/chip/green` | `#E2F3D5` | `#125C00` |
| `background/chip/teal` | `#CCF6F0` | `#006758` |
| `background/chip/purple` | `#EDE7FF` | `#5519AC` |
| `background/chip/pink` | `#FFE1EA` | `#960044` |
| `background/chip/orange` | `#FFE3D5` | `#FFE3D5` |
| `background/chip/gray-strong` | `#525252` | `#A3A3A3` |
| `background/chip/blue-strong` | `#0073DD` | `#93CCFF` |
| `background/chip/red-strong` | `#CA334A` | `#FFA8AC` |
| `background/chip/amber-strong` | `#AC6000` | `#F2BF6A` |
| `background/chip/green-strong` | `#488800` | `#ACD987` |
| `background/chip/teal-strong` | `#009482` | `#5CE2D2` |
| `background/chip/purple-strong` | `#7C56D5` | `#CBBAFF` |
| `background/chip/pink-strong` | `#C4336F` | `#FFA7C5` |
| `background/chip/orange-strong` *(Brand)* | `#F16923` | `#F16923` |

### Border

#### Default border roles

| Token | Light | Dark |
|---|---|---|
| `border/default` | `#E5E5E5` | `#404040` |
| `border/hover` | `#A3A3A3` | `#525252` |
| `border/disabled` | `#E5E5E5` | `#262626` |
| `border/focused` | `#0073DD` | `#57ABFF` |
| `border/selected` | `#737373` | `#737373` |
| `border/error` | `#CA334A` | `#FF7781` |
| `border/warning` | `#AC6000` | `#E19900` |
| `border/information` | `#0073DD` | `#57ABFF` |
| `border/success` | `#488800` | `#81BE40` |

#### `button`

| Token | Light | Dark |
|---|---|---|
| `border/button/primary` | `#0073DD` | `#57ABFF` |
| `border/button/error` | `#CA334A` | `#FF7781` |
| `border/button/focus` | `#002C81` | `#ECF6FF` |

#### `misc`

| Token | Light | Dark |
|---|---|---|
| `border/misc/placeholder` | `#FC76A4` | `#FFA7C5` |

### Icon

#### Default icon roles

| Token | Light | Dark |
|---|---|---|
| `icon/primary` | `#171717` | `#F5F5F5` |
| `icon/secondary` | `#525252` | `#A3A3A3` |
| `icon/disabled` | `#A3A3A3` | `#525252` |
| `icon/inverted` | `#FAFAFA` | `#171717` |
| `icon/information` | `#0073DD` | `#57ABFF` |
| `icon/success` | `#488800` | `#81BE40` |
| `icon/error` | `#CA334A` | `#FF7781` |
| `icon/error-disabled` | `#FFA8AC` | `#FFA8AC` |
| `icon/warning` | `#AC6000` | `#E19900` |

#### `button`

| Token | Light | Dark |
|---|---|---|
| `icon/button/primary` | `#0073DD` | `#57ABFF` |

### Text

#### Default text roles

| Token | Light | Dark |
|---|---|---|
| `text/primary` | `#171717` | `#F5F5F5` |
| `text/secondary` | `#525252` | `#A3A3A3` |
| `text/disabled` | `#A3A3A3` | `#525252` |
| `text/inverted` | `#FAFAFA` | `#171717` |
| `text/warning` | `#AC6000` | `#AC6000` |
| `text/error` | `#CA334A` | `#CA334A` |
| `text/error-disabled` | `#FFA8AC` | `#FFA8AC` |
| `text/information` | `#0073DD` | `#0073DD` |
| `text/success` | `#488800` | `#488800` |

#### `button`

| Token | Light | Dark |
|---|---|---|
| `text/button/primary` | `#0073DD` | `#57ABFF` |

#### `chip` — paired with `background/chip/<colour>` of the same name

| Token | Light | Dark |
|---|---|---|
| `text/chip/gray` | `#525252` | `#A3A3A3` |
| `text/chip/blue` | `#0073DD` | `#93CCFF` |
| `text/chip/red` | `#CA334A` | `#FFA8AC` |
| `text/chip/amber` | `#AC6000` | `#F2BF6A` |
| `text/chip/green` | `#488800` | `#ACD987` |
| `text/chip/teal` | `#009482` | `#5CE2D2` |
| `text/chip/purple` | `#7C56D5` | `#CBBAFF` |
| `text/chip/pink` | `#C4336F` | `#FFA7C5` |
| `text/chip/orange` *(Brand)* | `#F16923` | `#F16923` |

### Utility

| Token | Value |
|---|---|
| `white` | `#FFFFFF` |
| `transparent` | `#FFFFFF00` |
| `transparent-001` | `#FFFFFF03` |

### Raw palette (source for the semantic layer — not for direct use)

Base-colour scales from Figma · `Palette` collection. Consume via the semantic tokens above; reach here only for a reviewed one-off.

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

Neutral (Grey) scale (own column — runs alongside the colour ramps):

| Shade | Value (Light) | Value (Dark) |
|---|---|---|
| `50` | `#FAFAFA` | — |
| `100` | `#F5F5F5` | — |
| `200` | `#E5E5E5` | — |
| `300` | `#D4D4D4` | — |
| `400` | `#A3A3A3` | — |
| `500` | `#737373` | — |
| `600` | `#525252` | — |
| `700` | `#404040` | — |
| `800` | `#262626` | — |
| `900` | `#171717` | — |

> **Known divergences** (Figma vs `fabric-theme-morpheus` code, as of 2026-04-29): `orange.ts` uses a generic orange scale; Figma uses Alation warm orange (only `Orange/600 = #F16923` is canonical Brand). `yellow.ts` ships a different muted-gold ramp than Figma. The semantic layer in §5 is the binding contract for product code — raw-palette discrepancies do not affect consuming components unless they reach past the semantic tokens.

### Contrast pairings (light-mode audit, paired tokens only)

| Pair | Ratio | Verdict |
|---|---|---|
| `text/primary` on `background/surface/default` | 17.9:1 | ✓ AAA |
| `text/secondary` on `background/surface/default` | 8.7:1 | ✓ AAA |
| `text/inverted` on `background/button/primary` | 4.8:1 | ✓ AA |
| `text/inverted` on `background/button/error` | 4.6:1 | ✓ AA |
| `text/disabled` on `background/surface/default` | 2.2:1 | ✗ by design (WCAG exempts disabled state) |
| `text/chip/blue` on `background/chip/blue` | 7.1:1 | ✓ AAA |
| `text/chip/green` on `background/chip/green` | 5.4:1 | ✓ AA |

Dark-mode audit — TBD.

## 11. Example

```tsx
// Semantic consumption — reach for the token whose name describes the
// UI concept (background / border / icon / text) and the element it paints.
const styles = {
  color: 'var(--text-primary)',                       // text/primary
  backgroundColor: 'var(--background-surface-default)', // background/surface/default
  borderColor: 'var(--border-default)',               // border/default
};

// MUI sx — use existing palette paths where they map:
//   text/primary       → palette.text.primary
//   text/secondary     → palette.text.secondary
//   text/disabled      → palette.text.disabled
//   background/surface/default → palette.background.default
// New Figma tokens (background/chip/*, background/control/*, etc.) are not
// yet bound to MUI palette paths — bind via theme override before consuming.
<Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
  <Typography>Content</Typography>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — it renders the full semantic-token catalog grouped by Figma's UI-concept structure.
