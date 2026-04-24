---
name: chip
title: Chip
category: base-component
last_updated: 2026-04-23

description: >
  A compact pill that labels content in place. Production uses MUI `<Chip>`
  with the Alation theme (`filled` / `filledLight` / `outlined` / `gradient`
  variants) at `xsmall` / `small` / `medium`. For person chips backed by
  catalog objects, use the `<ObjectChips>` wrapper from `@alation/alation-ui`;
  for a fixed "Beta" marker, use `<BetaChip>`. Never hand-paint a chip with `sx`.
tags: [label, tag, chip, object-chip, beta-chip]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1"
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiChip.overrides.ts · @alation/alation-ui/src/lib/ObjectChips/ · @alation/alation-ui/src/lib/BetaChip/"
example_path: ./Example.tsx

mui_base: Chip
depends_on_tokens:
  - palette.primary
  - palette.secondary
  - palette.error
  - palette.warning
  - palette.success
  - palette.default
depends_on_components:
  - Chip
---

# Chip

## 1. Classification

- **Type:** Base component
- **MUI base:** `Chip`
- **Figma:** [Chip · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiChip.overrides.ts` (+ `@alation/alation-ui` wrappers under `src/lib/ObjectChips/`, `src/lib/BetaChip/`)

## 2. Purpose

A **Chip** is a compact pill that rides inline with content and labels what it sits next to — a category, a status, a person, an applied filter. It says "this thing *is* a …" in one glance without surrounding words.

Production uses MUI `<Chip>` directly with the Alation theme applied. Two wrappers exist for specific cases: `<ObjectChips>` for a list of Alation catalog objects (with optional avatars), and `<BetaChip>` for the fixed "Beta" marker. Everything else — status labels, applied filters, removable tags — is raw MUI `<Chip>` at `size="small"` or `xsmall`.

## 3. When to use / When not to use

**Use when**
- Labelling a row, card, or heading with a category or status (e.g. `variant="filledLight"` + `color="success"`).
- Rendering an applied / removable filter, or a clickable tag in a filter bar (`onClick` / `onDelete`).
- Showing a list of Alation catalog objects inline → **`<ObjectChips>`**.
- Marking a surface as Beta → **`<BetaChip>`**.

**Do not use when**
- The label needs to trigger a page-level action → use **Button**.
- The value is an icon only → use **IconButton**.
- The content is a full sentence or wraps across lines → use **Typography**.
- You would need to set colour / height / font-size via `sx` — stop; that means the use case doesn't fit a Chip.

## 4. Contract

### Guarantees
- Theme applies size (`xsmall` = 2rem, `small`, `medium`), font, radius, and colour per `variant` + `color`.
- `filledLight` automatically resolves to `palette[color][200]` background + `palette[color][800]` text (and dark-mode equivalents).
- Every documented `color` maps to an MUI Palette key — no ad-hoc backgrounds.
- Clickable chips (`onClick`/`onDelete`) expose a visible focus ring from the theme.

### Prohibitions
- No bare `<Chip>` with **appearance** `sx` (`fontSize`, `height`, `backgroundColor`, `color`, `borderRadius`) — those belong in the theme override.
- No invented colour outside the Palette keys listed in §5.3.
- No invented variant outside §5.2.
- No `ObjectChips` for single-person free-text names — the wrapper expects catalog `items` with `otype`, not bare strings.
- No chip row with > ~5 chips visible at once — use a multi-select or "+N more" affordance.

### Conditions
- `sx` on a chip is permitted for **layout only** (`maxWidth`, `margin`, `flex`).
- Clickable / deletable chips must expose an accessible name via the `label` prop or an `aria-label`.
- When a label maps to a semantic status (success, error, warning, info), pick the matching `color` key — don't use `default` for statuses.
- Deletable chips must be reachable by keyboard (Tab to focus + Enter / Backspace to delete).

## 5. Variants

### 5.1 Named styles

| Named style | Use for | MUI props |
|---|---|---|
| **Status (soft)** | Active / healthy / warning / error labels in lists and cards | `variant="filledLight"` + `color="success" \| "warning" \| "error" \| "info"` |
| **Status (solid)** | High-emphasis status where the whole row is driven by the chip | `variant="filled"` + semantic `color` |
| **Filter (unselected)** | Toolbar filter that toggles | `variant="outlined"` + `color="default"` + `onClick` |
| **Filter (selected)** | Same filter, active | `variant="filled"` + `color="primary"` + `onClick` |
| **Applied filter** | Value chip with close-X | `variant="outlined"` + `color="default"` + `onDelete` |
| **Gradient** | Marketing / emphasis surface (sparingly) | `variant="filled"` + `color="gradient"` |

### 5.2 `variant` prop

| Variant | Role |
|---|---|
| `filled` | Solid background in the selected `color`. Default MUI behaviour. |
| `filledLight` | Soft tint background (`palette[color][200]`) with dark text (`palette[color][800]`). Best for status labels on dense surfaces. |
| `outlined` | Transparent background, `color`-matched border. Default for unselected filter chips. |
| `gradient` | Branded gradient fill with animated hover. Emphasis use only. |

### 5.3 `color` prop

| Colour | Role |
|---|---|
| `default` | Neutral label with no status emphasis |
| `primary` | Selected / active state for filter chips |
| `secondary` | Secondary action / alt emphasis |
| `error` | Error / deprecated / destructive state |
| `warning` | Warning / attention state |
| `success` | Success / healthy / active state |
| `info` | Informational state |
| `gradient` | Paired with `variant="gradient"` only |

### 5.4 `size` prop

| Size | Use |
|---|---|
| `xsmall` | Dense surfaces — table row status, card badge. Height 2rem. |
| `small` | Most UI — toolbar filters, applied filters, inline labels. |
| `medium` | Rare; large hero surfaces only. |

## 6. Anatomy

- **Container** — pill shape (theme `borderRadius`); background per `variant` × `color`.
- **Label** — single line; typography from theme `caption` (at `xsmall`) or `body2` (at `small`+).
- **Leading icon** *(optional, via `icon` prop)* — aligned with the label.
- **Delete icon** *(when `onDelete` is set)* — theme close icon at the trailing edge.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Pill in the selected variant + color | — |
| Hover | Pointer over (clickable only) | Subtle darken or tint shift | Only when `onClick` / `onDelete` is set |
| Focus-visible | Keyboard focus | Theme focus ring | Interactive chips only |
| Selected | `variant="filled"` + `color="primary"` | Primary-filled pill | Typical for filter chips |
| Disabled | `disabled` prop | Faded label + container | Pointer events blocked |

## 11. Example

```tsx
import { Chip } from '@mui/material';
import { ObjectChips, BetaChip } from '@alation/alation-ui';

// Status labels (soft)
<Chip label="Active"     variant="filledLight" color="success" size="xsmall" />
<Chip label="Deprecated" variant="filledLight" color="error"   size="xsmall" />
<Chip label="Pending"    variant="filledLight" color="warning" size="xsmall" />

// Filter chips (clickable toggle)
<Chip
  label="Databases"
  size="small"
  variant={selected === 'databases' ? 'filled'  : 'outlined'}
  color={selected  === 'databases' ? 'primary' : 'default'}
  onClick={() => setSelected('databases')}
/>

// Applied filter (removable)
<Chip label="Owner: vadym.shcherbakov" size="small" onDelete={() => clearFilter('owner')} />

// Alation catalog object list
<ObjectChips items={[{ otype: 'user', id: 123, name: 'Vadym' }]} chipsClickable />

// Beta marker — fixed styling
<BetaChip />
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
