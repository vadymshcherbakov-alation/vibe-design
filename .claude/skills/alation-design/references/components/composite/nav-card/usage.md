---
name: nav-card
title: Nav Card
category: composite-component
last_updated: 2026-04-21

description: >
  A clickable tile for a navigable entity — data source, agent, dashboard, catalog section. Pairs a tinted icon container with a title and short description inside an outlined Card.
tags: [card, nav, tile, navigation]

figma_url: ""
code_reference: "no shared `<NavCard>` wrapper in @alation/alation-ui — production composes `<Card variant=\"outlined\">` + `<Box>` (tinted icon container) + `<Typography>` ad-hoc"
example_path: ./Example.tsx

mui_base: Card
depends_on_tokens:
  - palette.blue[100]
  - palette.blue[600]
  - palette.neutral[300]
  - palette.neutral[500]
  - palette.background.paper
  - shape.borderRadius
  - typography.subtitle1
  - typography.body0
depends_on_components:
  - Card
  - CardContent
  - Box
  - Typography
---

# Nav Card

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** `Card` (via the [Card Wrapper](../base/card-wrapper/usage.md) primitive)
- **Figma:** Nav card — to be linked
- **Code:** There is **no shared `<NavCard>` component** in `@alation/alation-ui`. Production composes `<Card variant="outlined">` + a tinted icon `<Box>` + `<Typography>` directly at the call site. This reference documents that composition contract so every tile looks the same across pages.

## 2. Purpose

A Nav card is a clickable tile that represents one navigable entity — a data source, an agent, a dashboard, a catalog section. It communicates "this is an object you can open" by pairing a tinted circular icon with a short title and a one-line description. Reach for a Nav card when the user is choosing between a small set of entities (roughly 3–8) and each one deserves a distinct visual identity; for longer lists, use a [Table](./table/usage.md) instead.

## 3. When to use / When not to use

**Use when**
- A landing page offers a handful of navigable entities — "Data sources", "Agents", "Dashboards" — and each opens its own view.
- The user benefits from a recognisable icon + short description at a glance.
- The entity count is roughly 3–8. A grid of 4 tiles reads well; 20 does not.

**Do not use when**
- The list is longer than ~8 entries → use a [Table](./table/usage.md).
- The tile has no action on click → use the base [Card](../base/card-wrapper/usage.md) primitive; a non-clickable tile should not look clickable.
- The content is a metric / stat → use [Metric Card](./metric-card/usage.md).
- The target is a labelled form control → use [Form Field](./form-field/usage.md).

## 4. Contract

### Guarantees
- Every Typography node uses a theme variant (`subtitle1` for title, `body0` for description) — no inline `fontSize` / `fontWeight`.
- Icon container renders at exactly 40 × 40 px with circular shape, tinted background, and matching-hue icon colour.
- Hover state is uniform across every Nav card — one documented rule, not a per-tile decision.
- At rest the card has no background fill — only the outline border.

### Prohibitions
- Never hardcode `"#fff"` or `"white"` — use `"background.paper"`.
- Never use `bgcolor: 'white'` on the icon container — always `palette.<hue>[100]`.
- Never invent a custom hover style — use the standard tile hover rule (see §6).
- Never style the Nav card with `bgcolor` at rest — it must be `"transparent"` until hover.
- If a status label is needed, use the [Chip](../base/chip/usage.md) pattern (`<Chip variant="filledLight" color="…" size="xsmall" />`), not an inline badge.

### Conditions
- Every Nav card is clickable — if it isn't, do not use this composite.
- `onClick` must be on the `Card` (not a nested child), so the whole tile is the hit target.
- Cursor is `"pointer"` and the standard hover transition is applied.
- Accessible name — either the title text (read automatically) or an explicit `aria-label` when the title is ambiguous.

## 5. Anatomy

```
┌─────────────────────────────────────────┐
│  ┌──┐  Card title                       │
│  │  │  Short description text…          │
│  └──┘                                   │
└─────────────────────────────────────────┘
```

- **Shell** — outlined `<Card>`, `borderRadius: 2`, `minHeight: 98`, padding `p: 2`, horizontal flex row with `gap: 2`.
- **Icon container** — 40 × 40 `<Box>`, circular, hue-tinted background with matching icon colour.
- **Title** — `<Typography variant="subtitle1">`.
- **Description** — `<Typography variant="body0" color="text.secondary">`, single line or short paragraph.

## 6. Custom

### Shell rule

```tsx
<Card
  variant="outlined"
  onClick={handleClick}
  sx={{
    cursor: 'pointer',
    bgcolor: 'transparent',
    borderRadius: 2,
    minHeight: 98,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.neutral[500]}`,
    },
  }}
>
  <CardContent sx={{ p: 0, width: '100%', '&:last-child': { pb: 0 } }}>
    {/* ... */}
  </CardContent>
</Card>
```

### Standard tile hover (rule)

All Nav cards use the same hover style — do not invent custom hover states:

| Property | Value |
|---|---|
| `bgcolor` | `"background.paper"` |
| `border` | `` `1px solid ${theme.palette.neutral[500]}` `` |

### Icon container

Use a plain `<Box>`, not `Avatar`. Lucide icons inherit `currentColor`, so set `color` on the Box:

```tsx
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    bgcolor: theme.palette.blue[100],
    color: theme.palette.blue[600],
    flexShrink: 0,
  }}
>
  <Database size={20} />
</Box>
```

Rules:
- Size **40 × 40**, `borderRadius: 10` (renders circular via theme multiplier).
- Colour pair: palette `[100]` background + matching `[600]` icon colour.
- Choose palette hue by entity type — blue for data sources, purple for agents, teal for dashboards, emerald for catalog, etc.

### Title + description

```tsx
<Typography variant="subtitle1" sx={{ mb: 0.5 }}>{title}</Typography>
<Typography variant="body0" color="text.secondary">{description}</Typography>
```

## 7. Mock data content

Placeholder — fill with Alation-domain tiles when this composite is used in a pilot. Candidates: Data sources (Snowflake, BigQuery, Postgres), Agents (Catalog AI, SQL AI), Dashboards (Executive summary, Data health), Catalog sections (Tables, Business terms, Queries).

## 11. Example

```tsx
<Card
  variant="outlined"
  onClick={openDataSources}
  sx={{
    cursor: 'pointer',
    bgcolor: 'transparent',
    borderRadius: 2,
    minHeight: 98,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.neutral[500]}`,
    },
  }}
>
  <CardContent sx={{ p: 0, width: '100%', '&:last-child': { pb: 0 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Box
        sx={{
          width: 40, height: 40, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: theme.palette.blue[100],
          color: theme.palette.blue[600],
        }}
      >
        <Database size={20} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Data sources</Typography>
        <Typography variant="body0" color="text.secondary">
          Connect and manage data sources across your organization.
        </Typography>
      </Box>
    </Box>
  </CardContent>
</Card>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
