---
name: chip
title: Chip
category: base-component
last_updated: 2026-04-29

description: >
  A compact pill that labels content in place. Two named styles only — **Label Chip** (read-only status / category / tag, label text only, smaller and quiet by default) and **Object Chip** (interactive pill representing an Alation catalog object — always carries an Avatar for users or a lucide-react Icon for datasets / agents / terms / dashboards, larger to host it, white with a grey border by default, freely repeatable across a page).
tags: [label, tag, chip, object-chip]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1"
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiChip.overrides.ts · @alation/alation-ui/src/lib/ObjectChips/"
example_path: ./Example.tsx

mui_base: Chip
depends_on_tokens:
  - palette.success
  - palette.warning
  - palette.error
  - palette.info
  - palette.blue
  - palette.cyan
  - palette.emerald
  - palette.orange
  - palette.purple
  - palette.teal
  - palette.violet
depends_on_components:
  - Chip
  - ObjectChips
---

# Chip

## 1. Classification

- **Type:** Base component
- **MUI base:** `Chip`
- **Figma:** [Chip · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=1-5455&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiChip.overrides.ts` · `@alation/alation-ui` — `src/lib/ObjectChips/`

## 2. Purpose

A **Chip** is a compact pill that labels content inline. Two named styles:

- **Label Chip** — text-only status, category, or tag. Small, read-only, Subtle variant by default.
- **Object Chip** — an Alation catalog object (person, dataset, agent, term, dashboard). Always carries a leading Avatar or Icon, larger to host it, white with a grey border, fully interactive (click + remove). Repeatable across a page.

## 3. When to use / When not to use

**Use when**
- Tagging a row, card, or heading with a single short status, category, or tag — use **Label Chip**.
- Inlining a catalog object so the user can open it, add it, or remove it — use **Object Chip**.

**Do not use when**
- The label needs to trigger a page-level action → use **Button**.
- The value is an icon-only control → use **IconButton**.
- The content is a full sentence or wraps across lines → use **Typography**.
- More than one *concept* would be encoded as Label Chips on the same surface (e.g. Status, Risk, and Severity all as Label Chip columns in one table). Pick the single concept that drives the user's decision and render the others as text, score, or icon. *Object Chips are exempt — see §4.*

## 4. Contract

### Guarantees
- Theme paints every chip per `color` × `variant`. Consumers never use `sx` to change colour, height, font, or radius.
- **Label Chip is read-only.** No `onClick`, no `onDelete`. A tooltip on hover is the only allowed affordance.
- **Label Chip is text-only.** It never renders a leading icon, avatar, or close-X — those belong to Object Chip.
- **Label Chip defaults to the Subtle variant** (`variant="filledLight"`, pastel). Strong (`variant="filled"`, saturated) is an explicit escalation — see Conditions.
- **Object Chip always carries a leading Avatar (for users) or Icon (for datasets, agents, terms, dashboards — `lucide-react` per the project's UI-icon convention).** The avatar / icon is what the user pattern-matches against — without it the chip is just a pill and could be confused with a Label Chip.
- **Object Chip is white with a grey border by default**, fully interactive (click opens the overlay; close-X fires `onDelete`), and uses a larger size than Label Chip to host the avatar / icon comfortably.
- Every chip colour maps to one of the documented `color` keys in §5.2. No invented backgrounds.

### Prohibitions
- Never pass `onClick` / `onDelete` on a raw `<Chip>` — interactive behaviour belongs to Object Chip via `<ObjectChips>`.
- Never put an icon, avatar, or close-X on a Label Chip.
- Never use the `xsmall` size on an Object Chip — it cannot host an avatar / icon at that scale.
- Never render Label Chips for more than one concept on the same page or surface.
- No `sx` that changes appearance (`fontSize`, `height`, `backgroundColor`, `color`, `borderRadius`).
- No `<ObjectChips>` for free-text strings — the wrapper expects catalog `items` with `otype`.
- No invented colour outside the `color` keys in §5.2. The names `neutral`, `green`, `red`, `amber`, `pink` are not valid Chip `color` values in this theme — use the matching semantic key (`default`, `success`, `error`, `warning`).
- No more than ~5 Label Chips visible in one row — truncate with "+N more". This cap does not apply to Object Chips.

### Conditions
- `sx` on a chip is permitted for **layout only** (`maxWidth`, `margin`, `flex`).
- Default to the **Subtle** variant (`variant="filledLight"`). Pastel is the resting state for every Label Chip — status, category, metadata.
- Escalate to **Strong** (`variant="filled"`) only when the chip is the user's call-to-action signal (Critical issue, Deprecated dataset that must be migrated). Do not stack multiple Strong chips with different colours in the same context — the saturation budget is one chip per surface, not five.
- When a Label Chip encodes a status, pick the matching semantic key (`success`, `warning`, `error`, `info`) — don't fall back to `default` for statuses.
- A tooltip on a Label Chip is permitted (and is the only allowed affordance) when the text is truncated or needs context.
- Object Chips are exempt from the one-concept-per-surface rule — they read as *objects* (avatar or icon + white surface), not as colour-coded labels, so a table can carry a Status column of Label Chips and an Owner column of Object Chips on the same row. Multiple Object Chip otypes (users + datasets + agents) may also coexist; the avatar / icon disambiguates them.

## 5. Variants

### 5.1 Named styles

| Named style | Surface | Carries | Size | Interactive | Backed by |
|---|---|---|---|---|---|
| **Label Chip** | Coloured pill (Subtle by default) | Label text only | `xsmall` (default) or `small` | No (tooltip allowed) | MUI `<Chip>` + theme |
| **Object Chip** | White with grey border | Avatar (users) or `lucide-react` Icon (datasets, agents, terms, dashboards) + label + close-X | `small` or `medium` (never `xsmall`) | Yes — click + remove | `<ObjectChips>` from `@alation/alation-ui` |

### 5.2 Variant × colour matrix (Label Chip)

Two variants, two colour groups. Pick a `variant` for *emphasis* and a `color` for *meaning*. Object Chip ignores this matrix — it has its own white-with-border surface (see §5.1).

#### Variants

| Variant | Prop | Look | When |
|---|---|---|---|
| **Subtle** *(default)* | `variant="filledLight"` | Pastel — `palette[color][200]`-style background, `[800]` text | Every Label Chip by default — status, category, metadata. |
| **Strong** *(escalation)* | `variant="filled"` | Saturated — `palette[color].main` background with contrast text | One call-to-action chip per surface — Critical, Deprecated, Action required. Use sparingly; if every chip is Strong, the saturation loses meaning. |

> MUI's library default is `filled`. The Alation system overrides that by convention — **always pass `variant="filledLight"` (or `"filled"`) explicitly**. Omitting the prop falls back to MUI's saturated default and renders the wrong chip.

#### Colour keys

**Semantic (use for status):**

| `color` | Meaning |
|---|---|
| `default` | Generic / unspecified |
| `success` | Active · Healthy · Resolved |
| `warning` | Pending · Investigating |
| `error` | Deprecated · Critical · Open |
| `info` | Informational |

**ColorBase (use for category / tag / metadata):**

| `color` | Typical use |
|---|---|
| `blue` | Native / primary attribute |
| `cyan` | Info-adjacent metadata |
| `emerald` | Catalog-level "Healthy" indicator (when `success` is taken) |
| `orange` | Beta / experimental |
| `purple` | Catalog-level grouping |
| `teal` | Lineage / data-flow |
| `violet` | Custom / user-defined |

`primary` and `secondary` are reserved for brand accents — rarely the right choice for a Chip; prefer `info` or a ColorBase key.

### 5.3 Size

| Size | Use |
|---|---|
| `xsmall` | Label Chip in dense surfaces — table row badges, card metadata. **Default for Label Chip.** |
| `small` | Label Chip next to headings; Object Chip default — leaves room for the avatar / icon. |
| `medium` | Object Chip in hero / detail surfaces. Rare for Label Chip. |

Object Chips never use `xsmall` — the avatar / icon needs the extra reach.

## 6. Anatomy

**Label Chip**
- **Container** — pill shape (theme `borderRadius`), Subtle pastel or Strong saturated background.
- **Label** — single line, theme typography (`caption` at `xsmall`, `body2` at `small`+).
- *No icon, no avatar, no close-X.*

**Object Chip**
- **Container** — pill shape, white surface with a grey border by default.
- **Leading Avatar or Icon** — always present. Avatar (a coloured circle with initials, or a profile photo) for `otype: 'user'`. Icon from `lucide-react` for everything else — `Database` for datasets, `Bot` for agents, `BookOpen` for terms, `LayoutDashboard` for dashboards.
- **Label** — the object's canonical name, single line.
- **Trailing close-X** — fires `onDelete`; optional but the standard pattern.

## 7. States

Label Chip is read-only; its only state is Default (with an optional tooltip on hover). Object Chip is fully interactive on both the chip surface and the close-X.

| State | Applies to | Trigger | Visual |
|---|---|---|---|
| Default | Label + Object | Idle | Subtle / Strong pastel (Label) or white-with-border (Object) |
| Hover (surface) | Object only | Pointer over the chip body | Subtle darken on the chip surface |
| Hover (close-X) | Object only | Pointer over the close affordance | Close icon circle darkens |
| Focus-visible | Object only | Keyboard focus (Tab) | Theme focus ring on the chip; close-X focus ring on Shift-Tab |
| Disabled | Object only | `disabled` prop on the `<ObjectChips>` item | Faded label + container; click and close-X blocked |

## 10. UX Copy

- Label Chip text is a single noun or short noun phrase — "Active", "Deprecated", "Beta", "Native". Sentence case.
- Object Chip text is the object's canonical name (person full name, dataset name, agent name); the wrapper handles casing.
- Never put punctuation at the end of a chip label.
- Never repeat the column header inside a chip ("Status: Active" → just "Active").

## 11. Example

```tsx
import { Chip, Stack, Tooltip } from '@mui/material';
import { ObjectChips } from '@alation/alation-ui';

// Label Chip · Subtle (default — pastel, low-emphasis, every status / category / tag)
<Stack direction="row" spacing={1}>
  <Chip label="Active"     color="success" variant="filledLight" size="xsmall" />
  <Chip label="Pending"    color="warning" variant="filledLight" size="xsmall" />
  <Chip label="Deprecated" color="error"   variant="filledLight" size="xsmall" />
  <Chip label="Native"     color="blue"    variant="filledLight" size="xsmall" />
  <Chip label="Beta"       color="orange"  variant="filledLight" size="xsmall" />
</Stack>

// Label Chip · Strong (escalation only — one call-to-action chip per surface)
<Chip label="Critical" color="error" variant="filled" size="xsmall" />

// Label Chip · with tooltip (the only allowed affordance)
<Tooltip title="Owner has not approved this dataset in the last 30 days">
  <Chip label="Stale" color="warning" variant="filledLight" size="xsmall" />
</Tooltip>

// Object Chip · interactive catalog objects (always avatar / icon, larger size, white surface)
<ObjectChips
  items={[
    { otype: 'user',    id: 123, name: 'Vadym Shcherbakov' },
    { otype: 'dataset', id: 456, name: 'finance_prod' },
    { otype: 'agent',   id: 789, name: 'ingest_agent' },
  ]}
  chipsClickable
  onDelete={(item) => removeFromSelection(item)}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
