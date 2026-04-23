---
name: chip
title: Chip
category: base-component
last_updated: 2026-04-22

description: >
  A compact pill that labels content in place. Alation has two wrappers on
  top of MUI `Chip`: **LabelChip** for categorical / status labels (12
  semantic colours, no delete) and **ObjectChip** for naming a person with a
  leading avatar-icon. Interactive filter / tag chips that need
  `onClick` / `onDelete` fall back to the raw MUI `<Chip size="small">`.
  Never hand-paint a chip with `sx`.
tags: [label, tag, chip, object-chip, label-chip]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1"
code_reference: Consumer project src/components/LabelChip.tsx + src/common/object-chip.tsx (wraps / composes MUI Chip + Typography)
example_path: ./Example.tsx

mui_base: Chip
depends_on_tokens:
  - palette.neutral
  - palette.blue
  - palette.green
  - palette.red
  - palette.purple
  - palette.orange
  - palette.teal
  - palette.emerald
  - palette.cyan
  - palette.amber
  - palette.pink
  - palette.violet
depends_on_components:
  - Chip
  - Typography
---

# Chip

## 1. Classification

- **Type:** Base component
- **MUI base:** `Chip`
- **Figma:** [Chip · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1)
- **Code:** Consumer project — `src/components/LabelChip.tsx` (wraps MUI `Chip`) + `src/common/object-chip.tsx` (custom, uses `Box` + `Typography` + `User` icon)

## 2. Purpose

A **Chip** is a compact pill that rides inline with content and labels what it sits next to — a category, a status, a person, an applied filter. It says "this thing *is* a …" in one glance without surrounding words.

Alation code has **two Chip wrappers** on top of MUI `Chip`, each scoped to a narrow job. Anything that doesn't fit either wrapper falls back to the raw MUI `<Chip>` — typically an *interactive* filter / tag that needs `onClick` or `onDelete`.

| Variant | Component | Use for |
|---|---|---|
| **Label Chip** | `<LabelChip label="…" color="…" />` | A categorical or status label on a row / card (Active, Deprecated, Native, MCP, Beta). 12 semantic colours. No delete. |
| **Object Chip** | `<ObjectChip name="…" />` | Naming a **person** — approver, owner, steward, assignee. Renders a leading `User` icon + display name. Fixed style. |
| **Interactive MUI Chip** | `<Chip size="small" onClick={…} onDelete={…} />` | A chip that *acts* — filter pills on a toolbar, removable tags on a selector. Use MUI directly (outlined for unselected, filled for selected). |

**Code is the source of truth.** Figma shows both `LabelChip` and `ObjectChip` patterns, sometimes with a close button on label chips; the code ships the close button only through raw MUI `<Chip onDelete>`. Do not hand-roll a deletable `LabelChip` variant.

## 3. When to use / When not to use

**Use when**
- Labelling a row, card, or heading with a category or status → **LabelChip**
- Displaying a person alongside a metadata field (Approvers, Stewards, Owners) → **ObjectChip**
- Rendering an applied / removable filter, or a clickable tag in a filter bar → **raw MUI `<Chip size="small">`** with `onClick` / `onDelete`

**Do not use when**
- The label needs to trigger a page-level action → use **Button**
- The value is an icon only → use **IconButton**
- The content is a full sentence or wraps across lines → use **Typography**
- You would need to set colour / height / font-size via `sx` — stop; that means the use case doesn't fit a Chip

## 4. Contract

### Guarantees
- `LabelChip` renders with theme-baked size (`xsmall`, ~20 px), font, radius, and colour per the chosen semantic `color`.
- `ObjectChip` renders with a fixed height (28 px), leading `User` icon, and theme-neutral surface.
- Every `LabelChip` colour maps to a documented Alation palette key — no ad-hoc backgrounds.
- MUI `<Chip size="small">` in interactive use carries a visible focus ring when clickable / deletable.

### Prohibitions
- No bare `<Chip>` with **appearance** `sx` (`fontSize`, `height`, `backgroundColor`, `color`, `borderRadius`) — those belong inside the wrapper or the theme override.
- No invented colour outside the 12 listed for `LabelChip` (§5.1).
- No `size` prop on `LabelChip` or `ObjectChip` — both are fixed by design.
- No `onDelete` / `onClick` on `LabelChip`. If you need either, switch to the raw MUI `<Chip>`.
- No `ObjectChip` for non-person entities — if the entity is a data source, dashboard, or agent, use a **Nav Card** (composite) instead.
- No chip row with > ~5 chips visible at once — if you need more, use a multi-select input or a "+N more" affordance.

### Conditions
- `sx` on `LabelChip` / `ObjectChip` is permitted for **layout only** (`maxWidth`, `margin`, `flex`).
- Interactive MUI chips (`onClick` or `onDelete`) must expose an accessible name via the `label` prop or an `aria-label`.
- When a label maps to a semantic status (active / success, deprecated / error, warning, info), pick the matching `LabelChip` colour — don't paint statuses with `neutral`.
- Removable filters (`onDelete`) must visibly change state on keyboard focus; the delete icon must be reachable by Tab + Enter.

## 5. Variants

### 5.1 `LabelChip` — `color` prop (exhaustive)

| Colour | Typical use |
|---|---|
| `neutral` (default) | Default tag, no status emphasis |
| `blue` | Informational / native category |
| `green` | Active / success status |
| `red` | Deprecated / error status |
| `purple` | Secondary category |
| `orange` | Attention / beta |
| `teal` | Supporting category |
| `emerald` | Alt success / healthy |
| `cyan` | Informational variant |
| `amber` | Warning status |
| `pink` | Custom / preview |
| `violet` | Secondary category variant |

### 5.2 `LabelChip` — `size` prop

`LabelChip` is fixed-size by design (`xsmall`). **Do not pass a `size` prop.**

### 5.3 `ObjectChip` — props

`ObjectChip` takes one required prop:

| Prop | Type | Purpose |
|---|---|---|
| `name` | `string` | The display name of the person |

No `color`, no `size`, no `onClick` / `onDelete`. The wrapper is intentionally rigid so every person-chip in the app reads the same.

### 5.4 Interactive MUI `<Chip>` — props

When using raw MUI `<Chip>` for clickable / deletable cases:

| Prop | Value | Notes |
|---|---|---|
| `size` | `"small"` | Always `small` in product UI (not `xsmall`, not `medium`). |
| `variant` | `"outlined"` (default / unselected) / `"filled"` (selected) | Pair with `color="primary"` on the selected state. |
| `onClick` | handler | Clickable filter / tag. |
| `onDelete` | handler | Removable filter / applied value. Renders the close icon automatically. |

## 6. Anatomy

**LabelChip**
- **Container** — rounded pill (theme-baked radius); filled surface in the semantic colour.
- **Label** — single line, caption-sized; colour driven by `color` prop.

**ObjectChip**
- **Container** — pill with `28 px` height; neutral surface.
- **Leading icon** — `User` from `lucide-react`, size matched by the wrapper.
- **Name** — single line `Typography`, `body2` weight.

**Interactive MUI `<Chip>`**
- **Container** — outlined or filled pill at `size="small"`.
- **Label** — text; the `label` prop is the accessible name.
- **Delete icon** *(if `onDelete`)* — theme-baked close icon at the trailing edge.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default | Idle | Filled pill in semantic colour (LabelChip) / neutral pill (ObjectChip) / outlined pill (interactive) | — |
| Hover | Pointer over (interactive only) | Subtle darken or tint shift | Only when `onClick` / `onDelete` is set |
| Focus-visible | Keyboard focus | Visible ring | Interactive chips only |
| Selected | `variant="filled"` + `color="primary"` (interactive) | Primary-filled pill | Typical for filter chips |
| Disabled | `disabled` prop on MUI `<Chip>` | Faded label + container | LabelChip / ObjectChip don't expose this |

## 11. Example

```tsx
import { Chip } from '@mui/material';
import { LabelChip } from '../components/LabelChip';
import { ObjectChip } from '../common/object-chip';

// LabelChip — categorical / status labels
<LabelChip label="Active" color="green" />
<LabelChip label="Deprecated" color="red" />
<LabelChip label="Native" color="blue" />
<LabelChip label="MCP" />                         {/* neutral default */}

// ObjectChip — naming a person
<ObjectChip name="Vadym Shcherbakov" />

// Interactive MUI Chip — filter pills
<Chip
  label="Databases"
  size="small"
  variant={filter === 'databases' ? 'filled' : 'outlined'}
  color={filter === 'databases' ? 'primary' : 'default'}
  clickable
  onClick={() => setFilter('databases')}
/>

// Interactive MUI Chip — applied / removable filter
<Chip
  label="Owner: vadym.shcherbakov"
  size="small"
  onDelete={() => clearFilter('owner')}
/>

// Layout-only sx is fine
<LabelChip label="Long category label" sx={{ maxWidth: 120 }} />
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
