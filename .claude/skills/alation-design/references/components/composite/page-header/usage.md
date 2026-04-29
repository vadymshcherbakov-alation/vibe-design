---
name: page-header
title: Page Header
category: composite-component
last_updated: 2026-04-29

description: >
  Top-of-page title region. The Title is the only mandatory element; every other
  element (right-side actions group, Breadcrumb, Label Chip, Tabs) is an optional
  add-on that can be enabled or disabled independently. This is a composition
  pattern, not a shared wrapper — production assembles each header at the call
  site using `PageHeaderSection` for paddings + bottom border.
tags: [page-header, layout, title, breadcrumb, tabs, label-chip, actions]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3608-11373&t=POCjkdbyTv1HEcMH-1"
code_reference: "no shared generic `<PageHeader>` wrapper in @alation/alation-ui — production uses domain-specific headers (e.g. `ObjectHeaderActions`, `TabHeaderWithNumber`). Prototype code in @repo/ui uses `<PageHeaderSection>` as a layout scaffold; this doc describes the composition contract."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens: [typography.h1, typography.body2, palette.divider, palette.text.primary, palette.text.secondary]
depends_on_components: [Typography, Button, IconButton, Tabs, Breadcrumbs, Chip, PageHeaderSection]
---

# Page Header

## 1. Classification

- **Type:** Composite component — composition pattern, not a shared wrapper
- **MUI base:** none (composes `<Box>` / `Typography` / `Button` / `IconButton` / MUI `Tabs` / `Breadcrumbs` / `Chip`)
- **Figma:** [Page Header · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3608-11373&t=POCjkdbyTv1HEcMH-1)
- **Code:** There is **no shared generic `<PageHeader>` component** in `@alation/alation-ui`. Production assembles page headers ad-hoc at the call site and uses domain-specific wrappers (`ObjectHeaderActions`, `TabHeaderWithNumber`) for repeated domains. Prototype code in `@repo/ui` exposes `PageHeaderSection` as a layout scaffold — it is prototype-only and not part of the design system contract.

## 2. Purpose

The page header sits at the top of every page inside the white main area. It owns a consistent **title** region (the only mandatory element), wraps it in standard paddings, and optionally hosts a stack of add-ons: a right-side **actions group**, a **Breadcrumb** above the title, a **Label Chip** next to the title, and **Tabs** below it. Each add-on is an independent enable/disable axis — they layer on top of the title rather than producing a fixed list of variants.

## 3. When to use / When not to use

**Use when**
- You are rendering the top-most region of any page inside the app shell.
- You need a page title, optionally combined with one or more of: an actions group, a breadcrumb, a status / category label, or content tabs.

**Do not use when**
- You need a section heading inside page content → use `Typography variant="h4"` or `variant="subtitle1"` directly.
- You need a modal title bar → use Dialog.
- You need a toolbar with multiple peer secondary actions that don't fit the "one Primary + supporting peers + overflow ⋮" shape → render it as a separate row below the header, not inside it.

## 4. Contract

### Guarantees
- Title always uses `Typography variant="h1"`.
- The bottom border comes from `PageHeaderSection` by default.
- Sentence case applies to all title text (branded module names like "Agent Studio" are the only exception).
- The right-side actions group lives in the same flex row as the title (`justifyContent: 'space-between'`); add-ons toggle independently — none of them are required for the header to be valid.
- Mandatory wrapper paddings: `pt: 3`, `px: 3`, `pb: 2.5` (provided by `PageHeaderSection`); when Tabs are enabled the bottom padding tightens to `pb: 1` and the border moves to the tabs row.

### Prohibitions
- Never use a different heading variant (`h2`, `h3`, `h4`) for the page title.
- Never hardcode the bottom border — rely on `PageHeaderSection` default, or disable it via `hideBorder` when tabs are present.
- Never stack more than one Primary button — supporting actions use Blue secondary / Grey outlined; less-frequent actions move into the ⋮ overflow IconButton menu.
- Never style tabs visually — use MUI `Tabs` / `Tab` without custom sx overrides.
- Never use Label Chip for more than one concept on the same header — pick the single category/status that drives the user's mental model.
- Never render Breadcrumb and Tabs as siblings inside one row — Breadcrumb sits **above** the title, Tabs sit **below** the header, they are different jobs.

### Conditions
- When the right-side **actions group** is enabled, render it inside a flex row with the title (`Box display="flex" justifyContent="space-between" alignItems="center"`); within the group itself use `Stack direction="row" spacing={1}` with this left-to-right order: Grey outlined → Blue secondary → Primary → ⋮ IconButton overflow menu (overflow last). Keep at most one Primary. The ⋮ overflow IconButton uses `size="medium"` (36px) so it sits at the same height as the Buttons next to it — confirmed in production (`FileSystemsHeader.tsx`). `size="small"` is the codebase-wide default, but it is wrong inside a Page Header.
- When **Breadcrumb** is enabled, prepend it above the title row with `sx={{ mb: 1 }}` — use the **Trail** shape for hierarchies 2+ levels deep, the **Back to parent** shape for exactly one level deep.
- When **Label Chip** is enabled, place it right after the title text inside the title group (`gap: 1.5`) — use the Subtle variant (`variant="filledLight"`, `size="xsmall"`) by default; a Strong variant is an explicit escalation.
- When **Tabs** are enabled, disable the header's default border (`hideBorder`) and move `borderBottom: 1` to a `<Box>` wrapping the `<Tabs>` below the header section.
- When the Primary action is a creation context use `variant="contained"` + `startIcon={<Plus size={16} />}`; when it is a state/detail action use `variant="outlined"`.

## 5. Anatomy

The header is composed of **one mandatory element** and **four optional add-ons**. Every optional element is independent — each can be enabled or disabled without affecting the others — so the same header shape covers everything from a bare title to a fully loaded detail page.

### Mandatory
- **Wrapper** (`PageHeaderSection` / `<Box>`) — provides paddings (`pt: 3`, `px: 3`, `pb: 2.5`) and the bottom border. Always present.
- **Title** — `Typography variant="h1"`, sentence case. Always present.

### Optional (enable / disable independently)

| Add-on | Position | When to enable | What it adds |
|---|---|---|---|
| **Right-side actions group** | Same row as the title, right-aligned | The page has a Primary action and/or supporting peers / overflow menu | A `Stack direction="row"` containing Grey outlined → Blue secondary → Primary → ⋮ IconButton (overflow menu); at most one Primary |
| **Breadcrumb** | Above the title row (`mb: 1`) | The current page sits below a parent — Trail for 2+ levels, Back to parent for exactly one | A parent-navigation row; see Breadcrumb reference for shape rules |
| **Label Chip** | Inside the title group, right after the title text (`gap: 1.5`) | The entity has a single status / category / tag worth surfacing | A small Subtle Label Chip (`variant="filledLight"`, `size="xsmall"`); never an Object Chip |
| **Tabs** | Below the header section (own row with bottom border) | Page content splits across 2+ mutually-exclusive views | A MUI `Tabs` row; the header section's own border is suppressed (`hideBorder`) and the border moves to the tabs wrapper |

### Composed of
- `PageHeaderSection` — layout primitive (provides padding + border)
- `Typography` — title (`h1`), breadcrumb items (`body2`)
- `Button` — Primary (contained for creation, outlined for state) · Blue secondary (outlined + primary) · Grey outlined (outlined + inherit)
- `IconButton` — ⋮ overflow menu trigger (lucide `MoreVertical`)
- `Breadcrumbs` — MUI primitive, optional (Trail or Back to parent shape)
- `Chip` — Label Chip (Subtle variant, xsmall), optional
- `Tabs` / `Tab` — MUI primitives, optional

## 6. Examples (progressive composition)

These are not variants. They show how the same header grows by enabling additional optional elements one at a time. Any combination of the four optional add-ons is valid — a real page only enables what it needs.

### Example 1 — Title only (baseline)

The minimum valid header. No actions, no breadcrumb, no chip, no tabs.

```tsx
<PageHeaderSection>
  <Typography variant="h1">Browse agents</Typography>
</PageHeaderSection>
```

### Example 2 — Title + actions group

Add a right-side actions group. The group can include any combination of: Primary, Blue secondary, Grey outlined, and an ⋮ IconButton overflow menu — at most one Primary, with the overflow IconButton last.

```tsx
<PageHeaderSection>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Typography variant="h1">Browse agents</Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" color="inherit">Export</Button>
      <Button variant="outlined" color="primary">Filter</Button>
      <Button variant="contained" color="primary" startIcon={<Plus size={16} />}>Build agent</Button>
      <IconButton size="medium" aria-label="More actions">
        <MoreVertical />
      </IconButton>
    </Stack>
  </Box>
</PageHeaderSection>
```

### Example 3 — Title + Breadcrumb + actions group

Add a Breadcrumb above the title. Use the **Back to parent** shape when the page sits exactly one level below a parent — the chevron points left and the label is the parent's name only.

```tsx
<PageHeaderSection>
  <Box component="nav" aria-label="Back to monitors" sx={{ mb: 1 }}>
    <Link
      component="button"
      color="text.secondary"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
    >
      <ChevronLeft size={16} aria-hidden="true" />
      Monitors
    </Link>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Typography variant="h1">Daily freshness check</Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" color="inherit">Export</Button>
      <Button variant="contained" color="primary" startIcon={<Play size={14} />}>Run now</Button>
      <IconButton size="medium" aria-label="More actions">
        <MoreVertical />
      </IconButton>
    </Stack>
  </Box>
</PageHeaderSection>
```

For pages 2+ levels deep, switch to the **Trail** shape:

```tsx
<Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
  <Link color="text.secondary">Datasources</Link>
  <Link color="text.secondary">finance_prod</Link>
  <Typography color="text.primary" aria-current="page">Orders</Typography>
</Breadcrumbs>
```

### Example 4 — Title + Breadcrumb + Label Chip + actions group

Add a Label Chip inside the title group, right after the title text (`gap: 1.5`). Subtle variant by default.

```tsx
<PageHeaderSection>
  <Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
    <Link color="text.secondary">Datasources</Link>
    <Link color="text.secondary">finance_prod</Link>
    <Typography color="text.primary" aria-current="page">Orders</Typography>
  </Breadcrumbs>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="h1">Orders</Typography>
      <Chip label="Certified" color="success" variant="filledLight" size="xsmall" />
    </Box>
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" color="inherit">Export</Button>
      <Button variant="outlined" color="primary">Share</Button>
      <Button variant="contained" color="primary" startIcon={<Plus size={16} />}>Add to data product</Button>
      <IconButton size="medium" aria-label="More actions">
        <MoreVertical />
      </IconButton>
    </Stack>
  </Box>
</PageHeaderSection>
```

### Example 5 — Title + Breadcrumb + Label Chip + actions group + Tabs

Add Tabs. The header section's bottom border is suppressed (`hideBorder`); the border moves to the wrapper around `<Tabs>` so it sits below the tabs row, separating the whole header from the page content.

```tsx
<>
  <PageHeaderSection hideBorder sx={{ pb: 1 }}>
    <Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
      <Link color="text.secondary">Datasources</Link>
      <Link color="text.secondary">finance_prod</Link>
      <Typography color="text.primary" aria-current="page">Orders</Typography>
    </Breadcrumbs>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h1">Orders</Typography>
        <Chip label="Certified" color="success" variant="filledLight" size="xsmall" />
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="outlined" color="inherit">Export</Button>
        <Button variant="contained" color="primary" startIcon={<Plus size={16} />}>Add to data product</Button>
        <IconButton size="small" aria-label="More actions">
          <MoreVertical size={18} />
        </IconButton>
      </Stack>
    </Box>
  </PageHeaderSection>
  <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
    <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Object views">
      <Tab label="Overview"  value="overview" />
      <Tab label="Schema"    value="schema" />
      <Tab label="Lineage"   value="lineage" />
    </Tabs>
  </Box>
</>
```

**Visual contract for the Tabs add-on** — Page Header owns only the header-section paddings (`pt: 3`, `px: 3`, `pb: 1`) and the tabs-row wrapping `<Box sx={{ borderBottom: 1, px: 3 }}>`. Everything *inside* the `<Tabs>` (typography, per-tab padding, hover background, selected-state colour switch, indicator) is owned by the Tabs reference. Do not paint or restyle tabs from a page-header context — fix it in the Tabs reference and every consumer benefits.

### Icon sizing inside header actions

- `startIcon={<Plus size={16} />}` for creation Primary buttons
- `startIcon={<Play size={14} />}` for state-change buttons (smaller to match the `outlined` visual weight)
- ⋮ overflow IconButton uses `IconButton size="medium"` (36px container, 20px icon) — height-matches the surrounding Buttons. Do not pass an explicit icon `size` prop; the IconButton's `size` drives the icon via the morpheus `iconMedium` token.

### One Primary action only

Only one Primary button per header. Supporting peers use Blue secondary or Grey outlined; less-frequent actions move into the ⋮ overflow menu.

## 7. Mock data content

Placeholder — fill with Alation-domain titles, breadcrumbs, and labels when this composite is used in a pilot. Candidates: "Browse agents", "Daily freshness check" (Monitors back-to-parent), "orders" (catalog table with Certified label and Overview / Schema / Lineage tabs), "MCP servers" (Imported / Published tabs), "Data Contract for FIFA World Cup Test" (Medium severity).

## 11. Example

```tsx
<PageHeaderSection>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
    <Typography variant="h1">Browse agents</Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" color="inherit">Export</Button>
      <Button variant="contained" color="primary" startIcon={<Plus size={16} />}>Build agent</Button>
      <IconButton size="medium" aria-label="More actions">
        <MoreVertical />
      </IconButton>
    </Stack>
  </Box>
</PageHeaderSection>
```

See `Example.tsx` for the canonical, runnable source — all five progressive examples side by side.
