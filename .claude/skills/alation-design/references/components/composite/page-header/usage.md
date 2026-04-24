---
name: page-header
title: Page Header
category: composite-component
last_updated: 2026-04-21

description: >
  Top-of-page title region with four variants — simple title, title + primary action, title + tabs, and title + breadcrumb + badge + action. Wraps `PageHeaderSection` layout primitive.
tags: [page-header, layout, title, breadcrumb, tabs]

figma_url: ""
code_reference: "no shared generic `<PageHeader>` wrapper in @alation/alation-ui — production uses domain-specific headers (e.g. `ObjectHeaderActions`, `TabHeaderWithNumber`). Prototype code in @repo/ui uses `<PageHeaderSection>` as a layout scaffold; this doc describes the composition contract."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens: [typography.h1, typography.body2, palette.amber, palette.divider]
depends_on_components: [Typography, Button, Tabs, Breadcrumbs, Chip, PageHeaderSection]
---

# Page Header

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** none (composes `<Box>` / `Typography` / `Button` / MUI `Tabs` / `Breadcrumbs` / [Chip](../base/chip/usage.md))
- **Figma:** Page header — to be linked
- **Code:** There is **no shared generic `<PageHeader>` component** in `@alation/alation-ui`. Production assembles page headers ad-hoc at the call site and uses domain-specific wrappers (`ObjectHeaderActions`, `TabHeaderWithNumber`) for repeated domains. Prototype code in `@repo/ui` exposes `PageHeaderSection` as a layout scaffold — it is prototype-only and not part of the design system contract.

## 2. Purpose

The page header sits at the top of every page inside the white main area. It provides a consistent title region with an optional bottom border. Four variants cover the main use cases: simple title, title + primary action, title + tabs, and title + breadcrumb + badge + action.

## 3. When to use / When not to use

**Use when**
- You are rendering the top-most region of any page inside the app shell.
- You need a page title, optionally with a primary action, tabs, or a breadcrumb trail.

**Do not use when**
- You need a section heading inside page content → use `Typography variant="h4"` or `variant="subtitle1"` directly.
- You need a modal title bar → use [Dialog](./dialog/usage.md).
- You need a toolbar with multiple secondary actions → render it as a separate row below the header, not inside it.

## 4. Contract

### Guarantees
- Title always uses `Typography variant="h1"`.
- The bottom border comes from `PageHeaderSection` by default.
- Sentence case applies to all title text (branded module names like "Agent Studio" are the only exception).

### Prohibitions
- Never use a different heading variant (`h2`, `h3`, `h4`) for the page title.
- Never hardcode the bottom border — rely on `PageHeaderSection` default, or disable it via `hideBorder` when tabs are present.
- Never stack more than one primary action — secondary actions go in a toolbar below the header.
- Never hardcode badge colours — use `theme.palette.<hue>[100]` / `[900]` token pairs.
- Never style tabs visually — use MUI `Tabs` / `Tab` without custom sx overrides.

### Conditions
- When page content is split across tabs, disable the header's default border (`hideBorder`) and move `borderBottom: 1` to a `Box` below the tabs.
- When the page is a detail view navigated from a list, prepend a `Breadcrumbs` row above the title with `sx={{ mb: 1 }}`.
- When the entity has a status, mount a [Chip](../base/chip/usage.md) right after the title (gap `1.5`) — page-level status badges may carry a leading `icon` prop, while body / table chips should stay plain.
- When a primary action button is present and the page is a creation context, use `variant="contained"` + `startIcon={<Plus size={16} />}`. When the page is a state/detail context, use `variant="outlined"`.

## 5. Anatomy & Composed of

**Anatomy** (for the full variant)
```
┌──────────────────────────────────────────────────────────┐
│  Home  /  Monitors                                        │  ← Breadcrumbs (optional)
│  ┌────────────────────────────┐       ┌───────────────┐  │
│  │ Page title         [badge] │       │ [Primary btn] │  │  ← Title row
│  └────────────────────────────┘       └───────────────┘  │
│────────────────────────────────────────────────────────── │  ← Bottom border
└──────────────────────────────────────────────────────────┘
```

**Composed of**
- `PageHeaderSection` — layout primitive (provides padding + border)
- [Typography](../foundations/typography/usage.md) — title (`h1`), breadcrumb items (`body2`)
- [Button](../base/button/usage.md) — primary action (contained for creation, outlined for state)
- `Breadcrumbs` — MUI primitive, optional
- `Chip` — status badge (icon + tinted background), optional
- `Tabs` / `Tab` — MUI primitives, optional

## 6. Custom

### Variant A — Simple title

Use when the page has no primary action and no content tabs.

```tsx
<PageHeaderSection>
  <Typography variant="h1">Browse agents</Typography>
</PageHeaderSection>
```

### Variant B — Title with primary action

Use when the page has a single primary creation/addition action. Button right-aligned in a flex row with the title.

```tsx
<PageHeaderSection>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="h1">Browse agents</Typography>
    <Button variant="contained" startIcon={<Plus size={16} />}>Build agent</Button>
  </Box>
</PageHeaderSection>
```

### Variant C — Title with tabs

Use when page content is split across two or more views. Title and tabs live in separate boxes — the border separates the header from the content below.

```tsx
<>
  <PageHeaderSection hideBorder sx={{ pb: 1 }}>
    <Typography variant="h1">MCP servers</Typography>
  </PageHeaderSection>
  <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
      <Tab label="Imported servers" value="imported" />
      <Tab label="Published servers" value="published" />
    </Tabs>
  </Box>
</>
```

### Variant D — Breadcrumb + title + badge + action

Use for detail pages where the user navigated from a list, the entity has a status, and a single primary action is available.

```tsx
<PageHeaderSection>
  <Breadcrumbs sx={{ mb: 1 }}>
    <Typography variant="body2" color="text.secondary">Home</Typography>
    <Typography variant="body2" color="text.secondary">Monitors</Typography>
  </Breadcrumbs>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="h1">{title}</Typography>
      <Chip
        icon={<AlertCircle size={14} />}
        label="Medium"
        size="small"
        sx={{
          bgcolor: theme.palette.amber[100],
          color: theme.palette.amber[900],
          '& .MuiChip-icon': { color: theme.palette.amber[900] },
        }}
      />
    </Box>
    <Button variant="outlined" startIcon={<Play size={14} />}>Run Now</Button>
  </Box>
</PageHeaderSection>
```

Rules:
- Breadcrumb row `sx={{ mb: 1 }}` above title row.
- Status badge uses [Chip](../base/chip/usage.md) with an `icon` prop (page-level badges may carry icons; body / table chips stay plain).
- Badge colours use `theme.palette.<hue>[100]` / `[900]` tokens.
- Secondary action uses `variant="outlined"` when it reflects a page state (not creation).

### Icon sizing inside header actions

- `startIcon={<Plus size={16} />}` for creation buttons
- `startIcon={<Play size={14} />}` for state-change buttons (smaller to match the `outlined` visual weight)

### One primary action only

Only one primary action button per header. Secondary actions go in a toolbar below the header, not alongside the title.

## 7. Mock data content

Placeholder — fill with Alation-domain titles and breadcrumbs when this composite is used in a pilot. Candidates: "Browse agents", "MCP servers" (Imported / Published tabs), "Data Contract for FIFA World Cup Test" (Medium severity badge), "Monitors", catalog object detail pages.

## 11. Example

```tsx
<PageHeaderSection>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="h1">Browse agents</Typography>
    <Button variant="contained" startIcon={<Plus size={16} />}>Build agent</Button>
  </Box>
</PageHeaderSection>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — all four variants side by side.
