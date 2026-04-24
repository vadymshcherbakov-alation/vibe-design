---
name: typography
title: Typography
category: foundation
last_updated: 2026-04-21

description: >
  The Alation type system. Governs every piece of visible text via `<Typography variant="…">`.
  Never render text through raw HTML; never override font styling via `sx`.
tags: [foundation, typography, text]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6583&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib/MuiTypography.overrides.ts
example_path: ./Example.tsx

mui_base: typography
depends_on_tokens: []
depends_on_components: []
---

# Typography

## 1. Classification

- **Type:** Foundation
- **MUI base:** `typography`
- **Figma:** [Type styles · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6583&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — `src/lib/MuiTypography.overrides.ts`

## 2. Purpose

Typography is how content gets its voice — titles lead, body explains, captions support, numbers punch. Every variant encodes a specific role on the page (page title, card title, body, metadata, big-number display), carrying the font, size, weight, and line-height that match that role. Reach for a variant based on what the text *does* on the page, not the size you want it to be.

## 3. How to use

Consume via `<Typography variant="…">`. The variant is the source of truth — the theme bakes in the correct family / size / weight / line-height for each one. Callers never set `fontSize`, `fontWeight`, or `fontFamily` through `sx`.

- Access custom variants the same way standard MUI variants are accessed — morpheus registers `body0`, `hero`, `subtitle1/2`, `machineBody1/2`, etc. as first-class typography keys.
- The **only** `sx` override allowed on `<Typography>` is the `color` prop — and prefer `color="text.secondary"` over `sx={{ color }}` where the token exists.
- Body text colour defaults to `text.primary`. For muted / metadata, pair a body variant with `color="text.secondary"`.
- For large display numbers (stat cards, metric panels), use `hero`. For card and panel titles, use `subtitle1` (14 px / weight 500 / renders as `<h6>`).

## 4. Contract

### Guarantees
- Every variant ships a theme-baked family, size, weight, and line-height — using a variant guarantees consistent vertical rhythm and weight across the app.
- `color="text.primary"` / `"text.secondary"` / `"text.disabled"` meet WCAG AA contrast on `background.default` / `background.paper`.
- `<Typography>` renders the correct semantic HTML element (`h1`, `h6`, `p`, `span`) based on its variant.

### Prohibitions
- No raw HTML text elements — never `<p>`, `<span>`, `<h1>`–`<h6>`, `<label>`, `<small>`. Always `<Typography variant="…">`.
- No `sx` overrides for `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing`, or `lineHeight`. Pick the right variant instead.
- No hard-coded hex colours in text — use `color="text.secondary"` (or the matching semantic token) instead.
- Nothing outside the Inventory (§5) is valid.

### Conditions
- If the design calls for a variant that does not exist, stop and flag — do not invent a size through `sx`. Propose a new variant against morpheus.
- `<Typography>` inside a `<Button>`, `<Chip>`, or form input is redundant — those components render their own theme-baked text.
- Monospace / machine text (identifiers, code, hashes) must use `machineBody1` or `machineBody2` — never toggle `fontFamily` on a body variant.

## 5. Inventory

Exhaustive. Nothing outside this list is valid.

### Display & headings

| Variant | Use for |
|---|---|
| `heroXl` | Extra-large display numbers (rare, landing / marketing) |
| `heroLg` | Large display numbers (hero numbers on dashboards) |
| `hero` | Large display numbers (big-number stat cards) |
| `h1` | Page titles (rendered at the top of every page) |
| `h2` | Major section title within a page |
| `h3` | Section heading inside a page |
| `h4` | Sub-section heading inside a page |
| `h5` | Card or panel heading (legacy — prefer `subtitle1` for new work) |
| `h6` | Very compact heading (legacy) |
| `subtitle1` | Card and panel titles — renders as `<h6>` |
| `subtitle2` | Secondary card label or compact heading |

### Body & meta

| Variant | Use for |
|---|---|
| `body0` | Slightly larger body (Alation custom — used in form-field labels) |
| `body1` | Primary body text |
| `body2` | Secondary body text, descriptions |
| `caption` | Timestamps, metadata, fine print |
| `overline` | Category labels, eyebrow text |

### Button typography (theme-owned — you won't pass these directly, but `<Button>` consumes them)

| Variant | Use for |
|---|---|
| `buttonLg` | Large Button label |
| `button` | Default / medium Button label |
| `buttonSm` | Small / xsmall Button label |

### Machine (monospace — JetBrains Mono)

| Variant | Use for |
|---|---|
| `machineHero` | Large monospace display (rare — identifiers in hero slots) |
| `machineH1`–`machineH6` | Monospace headings |
| `machineSubtitle1`, `machineSubtitle2` | Monospace subtitles |
| `machineBody0` | Slightly larger monospace body |
| `machineBody1` | Monospace body — code, identifiers |
| `machineBody2` | Monospace compact — inline code, short identifiers |
| `machineOverline` | Monospace eyebrow label |
| `machineButton`, `machineButtonLg`, `machineButtonSm` | Monospace button labels (theme-owned) |

### Icon size tokens (typography-level — consumed by icon containers, not by `<Typography>`)

Icon sizes live in the typography layer so every icon container can read them by key. See [iconography.md](./iconography/usage.md) for the container → size mapping.

| Token | Value |
|---|---|
| `typography.iconXSmall` | `1.2rem` |
| `typography.iconSmall` | `1.6rem` |
| `typography.iconMedium` | `2rem` |
| `typography.iconLarge` | `2.4rem` |

## 6. Type families

Two families are baked into the theme. Callers never override `fontFamily` — picking the right variant picks the right family automatically.

| Family | Stack | Used by |
|---|---|---|
| Body | `Inter, ui-sans-serif, system-ui, sans-serif, "Open Sans", "Lucida Grande", "Segoe UI", Arial` | All non-monospace variants (`h1`–`h5`, `subtitle1/2`, `body0`–`body2`, `caption`, `overline`, `hero`) |
| Machine | `"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace` | `machineBody1`, `machineBody2` — identifiers, code, hashes |

- **Inter** is the primary UI typeface — loaded globally. If Inter fails to load, the stack falls back to the system sans.
- **JetBrains Mono** is reserved for machine content only. Never toggle it onto a body variant via `sx` — use `machineBody1` / `machineBody2` instead.
- Canonical source: `fabric-theme-morpheus/src/lib/MuiTypography.overrides.ts`.

## 11. Example

```tsx
import { Typography } from '@mui/material';

<Typography variant="h1">Page title</Typography>
<Typography variant="subtitle1">Total CDEs</Typography>
<Typography variant="hero">1,284</Typography>
<Typography variant="body1">Primary paragraph content.</Typography>
<Typography variant="body2" color="text.secondary">Muted helper text.</Typography>
<Typography variant="caption">Updated 2 hours ago</Typography>
<Typography variant="machineBody2">src/lib/MuiTypography.overrides.ts</Typography>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
