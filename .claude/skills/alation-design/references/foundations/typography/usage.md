---
name: typography
title: Typography
category: foundation
last_updated: 2026-04-29

description: >
  The Alation type system. Governs every piece of visible text via `<Typography variant="…">`. Never render text through raw HTML; never override font styling via `sx`.
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

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation type system. Every variant encodes a specific role on the page — page title, card title, body, metadata, big-number display — and carries the font, size, weight, and line-height that match that role.

## 3. How to use

<!-- Layering narrative for humans: variant-driven, family split, which layer to consume, when a one-off is OK. No file paths, no raw values. -->

Typography is variant-driven. Pick a variant based on what the text *does* on the page, not the size you want it to be — the theme bakes in the correct family, size, weight, and line-height for each role. Each MUI variant maps 1:1 to a Figma text style (e.g. `h1` ↔ **Header - H1**, `subtitle1` ↔ **Subtitle1**) so design and code stay in lockstep.

- **Body family** (`font/family/body` — Inter) — the default UI face, used by every non-monospace variant (headings, subtitles, body, caption, overline, hero).
- **Machine family** (`font/family/mono-body` — JetBrains Mono) — reserved for identifiers, code, hashes. Accessed only through the `machine*` variants. Never toggle it onto a body variant.
- **Headings** — Figma only defines **H1 / H2 / H3**. Use `h1` for page titles, `h2` for major section titles, `h3` for section headings. Do not reach for `h4`–`h6`; deeper hierarchy is handled by `subtitle1` / `subtitle2`.
- **Card and panel titles** — use `subtitle1` (14px / 500). Use `subtitle2` (13px / 500) for secondary labels.
- **Body** — `body1` (13px) is the default paragraph; `body2` (12px) is for secondary body and descriptions. `body0` (14px) is an Alation-only variant reserved for form-field labels.
- **Display numbers** — use `hero` for big-number stat cards; `heroLg` / `heroXl` for rare dashboard or marketing hero slots. (Alation-only — not in the Figma text-style set.)

If a design calls for a size or weight that no variant covers, that is a signal to propose a new variant against the theme — not to hand-tune `fontSize` or `fontWeight` via `sx`.

## 4. Contract

<!-- All code here: theme API paths, package paths, token keys. Phrase G/P/C against the real API. -->

### Guarantees
- Every variant ships a theme-baked family, size, weight, and line-height — using a variant guarantees consistent vertical rhythm and weight across the app.
- `color="text.primary"` / `"text.secondary"` / `"text.disabled"` meet WCAG AA contrast on `background.default` / `background.paper`.
- `<Typography>` renders the correct semantic HTML element (`h1`, `h6`, `p`, `span`) based on its variant.
- `fabric-theme-morpheus/src/lib/MuiTypography.overrides.ts` registers every custom variant (`body0`, `hero*`, `subtitle1/2`, `machine*`, etc.) as a first-class typography key.

### Prohibitions
- Never render raw HTML text elements — no `<p>`, `<span>`, `<h1>`–`<h6>`, `<label>`, `<small>`. Always `<Typography variant="…">`.
- Never override `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing`, or `lineHeight` via `sx`. Pick the right variant instead.
- Never hard-code hex colours in text — use the `color="text.secondary"` prop (or the matching semantic token).
- Never toggle the monospace family onto a body variant — use `machineBody1` / `machineBody2`.
- Never wrap `<Typography>` inside a `<Button>`, `<Chip>`, or form input — those components render their own theme-baked text.
- Nothing outside §5 Variants is valid.

### Conditions
- If a variant does not exist for what the design needs, stop and flag — propose a new variant against morpheus, do not simulate with `sx`.
- The only `sx` override allowed on `<Typography>` is `color`, and prefer the `color="text.secondary"` prop when a semantic token exists.

## 5. Variants

<!-- Exhaustive. Nothing outside this list is valid. Split into sub-tables by role (Display / Body / Button / Machine / Icon sizes). -->

### 5.1 Display & headings

| Variant | Figma text style | Use for |
|---|---|---|
| `heroXl` | — (Alation-only) | Extra-large display numbers (rare, landing / marketing) |
| `heroLg` | — (Alation-only) | Large display numbers (hero numbers on dashboards) |
| `hero` | — (Alation-only) | Large display numbers (big-number stat cards) |
| `h1` | **Header - H1** | Page titles · 22px |
| `h2` | **Header - H2** | Major section title within a page · 18px |
| `h3` | **Header - H3** | Section heading inside a page · 16px |
| `subtitle1` | **Subtitle1** | Card and panel titles · 14px / 500 |
| `subtitle2` | **Subtitle2** | Secondary card label or compact heading · 13px / 500 |

### 5.2 Body & meta

| Variant | Figma text style | Use for |
|---|---|---|
| `body0` | — (Alation-only) | Slightly larger body · 14px — used in form-field labels |
| `body1` | **Body1** | Primary body text · 13px / 400 |
| `body2` | **Body2** | Secondary body text, descriptions · 12px / 400 |
| `caption` | — (Alation-only) | Timestamps, metadata, fine print |
| `overline` | — (Alation-only) | Category labels, eyebrow text |

### 5.3 Button typography (theme-owned — consumed by `<Button>`, never passed directly)

| Variant | Figma text style | Use for |
|---|---|---|
| `buttonLg` | — (Alation-only) | Large Button label |
| `button` | **Button** | Default / medium Button label · 13px / 500 |
| `buttonSm` | — (Alation-only) | Small / xsmall Button label |

### 5.4 Machine (monospace — JetBrains Mono)

| Variant | Figma text style | Use for |
|---|---|---|
| `machineBody1` | **Mono - Body1** | Monospace body — code, identifiers · 13px |
| `machineBody2` | **Mono - Body2** | Monospace compact — inline code, short identifiers · 12px |
| `machineHero`, `machineH1`–`machineH6` | — (Alation-only) | Monospace display / heading variants |
| `machineSubtitle1`, `machineSubtitle2` | — (Alation-only) | Monospace subtitles |
| `machineBody0` | — (Alation-only) | Slightly larger monospace body |
| `machineOverline` | — (Alation-only) | Monospace eyebrow label |
| `machineButton`, `machineButtonLg`, `machineButtonSm` | — (Alation-only) | Monospace button labels (theme-owned) |

### 5.5 Type families (theme-owned — variants select the family automatically)

| Family | Figma token | Stack | Used by |
|---|---|---|---|
| Body | `font/family/body` | `Inter, ui-sans-serif, system-ui, sans-serif, "Open Sans", "Lucida Grande", "Segoe UI", Arial` | All non-monospace variants |
| Machine | `font/family/mono-body` | `"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace` | `machine*` variants |

### 5.6 Icon size tokens (typography-level — consumed by icon containers)

Icon sizes live in the typography layer so every icon container can read them by key. See [iconography](../iconography/usage.md) for the container → size mapping.

| Token | Value |
|---|---|
| `typography.iconXSmall` | `1.2rem` |
| `typography.iconSmall` | `1.6rem` |
| `typography.iconMedium` | `2rem` |
| `typography.iconLarge` | `2.4rem` |

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
