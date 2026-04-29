---
name: tabs
title: Tabs
category: composite-component
last_updated: 2026-04-28

description: >
  The view-switcher composite. A horizontal or vertical strip of `<Tab>` items
  inside `<Tabs>`, paired with one or more tab panels. Use when a single page
  is split across 2–~7 mutually-exclusive views (Imported / Published, Overview
  / Schema / Lineage, etc.). Tabs sit beneath a Page Header by convention; the
  underline lives on a wrapping `<Box borderBottom>` so the header itself can
  drop its border. Status counts use the morpheus `.MuiTab-status` pill;
  TabHeaderWithNumber is the production wrapper for warning / error counts.
tags: [tabs, navigation, view-switcher, layout]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=59-1960&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/lib/MuiTabs.overrides.ts · alation-ui/src/lib/TabHeaderWithNumber/TabHeaderWithNumber.tsx (warning / error counts)"
example_path: ./Example.tsx

mui_base: Tabs
depends_on_tokens:
  - typography.body1
  - typography.subtitle2
  - palette.text.primary
  - palette.text.secondary
  - palette.primary.main
  - palette.primary.light
  - palette.primary.dark
  - palette.grey.400
  - palette.error.light
  - palette.error.dark
  - palette.warning.light
  - palette.warning.dark
  - palette.background.darken10
  - palette.divider
depends_on_components:
  - Tabs
  - Tab
  - Box
  - Typography
  - TabHeaderWithNumber
---

# Tabs

## 1. Classification

- **Type:** Composite component
- **MUI base:** `Tabs` (+ `Tab`)
- **Figma:** [Tabs · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=59-1960&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiTabs.overrides.ts` · `@alation/alation-ui` — `src/lib/TabHeaderWithNumber/TabHeaderWithNumber.tsx` (the production wrapper for warning / error count badges). There is **no shared generic `<Tabs>` wrapper** in `@alation/alation-ui` — production assembles MUI `<Tabs>` + `<Tab>` directly.

## 2. Purpose

Tabs split a single page into 2–~7 mutually-exclusive views — Imported / Published, Overview / Schema / Lineage, All / Mine / Shared. The strip sits at the top of the content area and shows the active view by name; switching tabs swaps the panel below it without navigating away from the page.

Tabs sit at one specific level of the navigation hierarchy: **in-page navigation** between heavy panels. Top-level destinations belong to the app shell — **App bar**, **Wayfinder**, or **Top Nav**. Smaller content blocks, single-axis filters above a table, and 2–5-option choices inside a form belong to a **Content Switcher** (segmented control) or a **Radio** group. Pick the level that matches the *weight* of the content being switched.

## 3. When to use / When not to use

**Use when**
- A page splits cleanly into 2–~7 mutually-exclusive views the user moves between
- Each view is heavy enough to deserve its own panel (a list, a form, a chart) — too heavy to stack on one scroll
- The user comes back to the page expecting to land on the same default view (tabs do not drive routing semantics by default — wire to the URL when persistence matters)

**Do not use when**
- The split is a single-axis filter on a list ("Databases / Dashboards / Agents") → use a **Content Switcher** (filter pill)
- The user picks one option from a form → use **Radio** (2–5 options) or **Select Input** (≤ ~20)
- The destinations are top-level app sections → use the app shell — **App bar**, **Wayfinder**, or **Top Nav** — not Tabs
- The page would have one tab — render the content directly with no strip
- The page would have more than ~7 tabs — split into a parent grouping or move to a left-side rail; horizontal scrolling is allowed (`variant="scrollable"`) but not as a routine answer to too many tabs

## 4. Contract

### Guarantees
- `Tabs` always carries `value` + `onChange`; the `value` of the active tab matches one `<Tab value="…" />`.
- Each `<Tab>` exposes a stable `value` (string or number) so the tab strip is controlled.
- The tab/panel a11y pairing is wired: each `<Tab id="tab-{key}" aria-controls="panel-{key}" />` pairs with a `<div role="tabpanel" id="panel-{key}" aria-labelledby="tab-{key}">`.
- `Tabs` carries a programmatic name — `aria-label` (or `aria-labelledby` pointing at the page title above it) so screen readers announce the strip.
- Selected tab uses `typography.subtitle2`, unselected tabs use `typography.body1` — the morpheus override switches them automatically.
- Hover / focus-visible paint `background.darken10` on the tab; focus is keyboard-reachable via Tab into the strip + arrow keys between tabs.
- The selected indicator is a `0.2rem` border on the trailing edge — `borderBottom` for `orientation="horizontal"`, `borderRight` for `orientation="vertical"`. The morpheus override owns this; never paint a custom indicator.
- A status badge inside a tab label uses the `.MuiTab-status` class — pill at `12px` radius, `2rem` tall, `grey.400` background. When the tab is selected the badge flips to `primary.light` background + `primary.dark` text. Use `TabHeaderWithNumber` for warning / error counts.

### Prohibitions
- No raw `<button>` / `<a>` strip pretending to be tabs. Use MUI `Tabs` + `Tab` so a11y wiring is correct.
- No bare `<Tabs>` without a programmatic name (`aria-label` or `aria-labelledby`).
- No `<Tab>` without a stable `value`.
- No tab panels without `role="tabpanel"` + `aria-labelledby` linkage.
- No `sx` overrides of tab typography, padding, indicator, or hover background — the morpheus override owns the visual contract.
- No `textColor` / `indicatorColor` overrides — both are themed.
- No custom indicator (`TabIndicatorProps={{ sx: … }}`) repainting the bar to a non-theme colour.
- No mixing tabs with a Content Switcher in the same row — pick one, they read as duplicate filters.
- No nested tab strips. If a panel itself splits into views, redesign the page or use a sub-navigation pattern (a left rail inside the panel).
- No tab label longer than ~20 chars — long labels truncate or wrap, breaking the row. Use a noun phrase, not a sentence.
- No icon-only tabs in product UI — tabs are text-first; an optional leading icon is allowed via `<Tab icon={…} iconPosition="start" />` but a label is required.
- No more than ~7 tabs in a page header strip without switching to `variant="scrollable"`. If you need scroll routinely, the page is doing too much — split it.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- When tabs sit beneath a **Page Header**, drop the header's bottom border (`hideBorder`) and put `borderBottom: 1` + `borderColor: 'divider'` on the wrapping `<Box>` around the strip — see Page Header Variant C.
- Vertical tabs (`orientation="vertical"`) are reserved for settings-style layouts where the panel sits to the right and tab labels can be longer (`~30` chars). They are not a substitute for a left nav rail.
- Scrollable tabs (`variant="scrollable"` + `scrollButtons="auto"`) are allowed when the count is high enough to overflow the container width. Always pair with `allowScrollButtonsMobile` for narrow viewports.
- Status counts on tabs:
  - Plain count (Imported · 12) — render the count inside `<span className="MuiTab-status">` in the label; the morpheus override styles it.
  - Warning / error count — use `TabHeaderWithNumber` with `variant={TabStatusType.Warning | Error}`; it adds the right icon + tinted pill.
- Persistence — when the active tab is part of the page's identity (deep-linkable), wire `value` to a URL query param (e.g. `?tab=imported`) and read it back on mount.
- Lazy panels — when a panel is heavy (a chart, a fetch), render only the active panel (`{value === 'imported' && <ImportedView />}`) instead of all panels at once.
- Disabled tab (`<Tab disabled />`) is allowed when the view exists but is gated (entitlement, empty source). Pair with a tooltip explaining why.
- Keyboard: arrow keys move focus between tabs; Home / End jump to first / last; Enter or Space activates. MUI's `Tabs` handles this — do not reimplement.

## 5. Variants

Tabs is a multi-axis composite. The primary axis is **orientation**; secondary axes are **scroll behaviour** and **label content**. Pick one value per axis.

### 5.1 Orientation

| Variant | `Tabs` props | Use when |
|---|---|---|
| **Horizontal** (default) | `orientation="horizontal"` (default) | Standard page-header tab strip; 2–~7 tabs that fit one row |
| **Vertical** | `orientation="vertical"` | Settings-style layouts — labels on the left, panel on the right; allows longer labels |

### 5.2 Scroll behaviour

| Variant | `Tabs` props | Use when |
|---|---|---|
| **Standard** (default) | `variant="standard"` | All tabs fit the container width |
| **Fullwidth** | `variant="fullWidth"` | Two-tab choice that should split the row evenly (e.g. inside a narrow panel or a Dialog) |
| **Scrollable** | `variant="scrollable"` + `scrollButtons="auto"` + `allowScrollButtonsMobile` | The tab count overflows the container; rare in product UI — prefer redesign |

### 5.3 Label content

| Variant | Tab markup | Use when |
|---|---|---|
| **Text only** (default) | `<Tab label="Overview" />` | Standard tab |
| **Text + leading icon** | `<Tab icon={<List size={16} />} iconPosition="start" label="Schema" />` | The icon adds quick recognition; never icon-only |
| **Text + plain count** | `<Tab label={<>Imported <span className="MuiTab-status">12</span></>} />` | Active count without semantic tone |
| **Text + warning / error count** | `<Tab label={<TabHeaderWithNumber title="Issues" count={3} variant={TabStatusType.Error} />} />` | Count carries a status semantic — use the production wrapper |

### Modifiers — layered on any variant

Not variants themselves; layer on top of the axes above.

| Modifier | Pattern | Notes |
|---|---|---|
| **Disabled tab** | `<Tab value="…" label="…" disabled />` | Pair with a tooltip explaining why |
| **URL-bound active tab** | `value` reads from `searchParams.get('tab')`; `onChange` writes back | Use when the active view should be deep-linkable |
| **Lazy panel** | `{value === 'imported' && <ImportedView />}` | Render only the active panel when the panel is heavy |

## 6. Anatomy

- **Strip** — the `<Tabs>` container; horizontal row by default, vertical column when `orientation="vertical"`.
- **Tab** — one `<Tab>`; carries label + optional leading icon + optional status badge. Selected tab uses `subtitle2`, unselected `body1`.
- **Indicator** — `0.2rem` border on the trailing edge of the selected tab (bottom for horizontal, right for vertical). Themed; not paintable.
- **Status badge** *(optional)* — `<span className="MuiTab-status">` pill inside the label, or the `TabHeaderWithNumber` wrapper for warning / error tones.
- **Underline track** — the `1px` `divider` line spanning the row. Lives on the wrapping `<Box borderBottom>` (the strip itself does not paint it).
- **Tab panel** — a `<div role="tabpanel">` paired to its tab via `id` + `aria-labelledby`; sits below (horizontal) or to the right (vertical) of the strip.

### Composed of

- `Tabs`, `Tab` — MUI primitives (themed by `MuiTabs.overrides.ts`)
- [Box](../foundations/layout/usage.md) — wrapping container that owns the underline `borderBottom: 1`
- [Typography](../foundations/typography/usage.md) — `body1` for unselected, `subtitle2` for selected (themed automatically)
- `TabHeaderWithNumber` (`@alation/alation-ui`) — for warning / error count badges
- [Tooltip](../base/tooltip/usage.md) — when a tab is disabled, paired tooltip explains why
- [Page Header](./page-header/usage.md) — Variant C composes this Tabs reference beneath the title

## 7. Custom

### Page-header pairing

When tabs sit beneath a Page Header, the header drops its border and the underline migrates to the wrapping `<Box>` around the strip. This keeps a single `1px` line between the header region and the panel. The composition mirrors [Page Header Variant C](../page-header/usage.md#variant-c--title-with-tabs) exactly — the snippet below and the Page Header doc must stay in sync. The Page Header reference defers all *visual* tab rules (typography swap, padding, indicator colour, hover background) to this Tabs reference; it only owns the *header section* paddings.

Canonical paddings — apply identically in both references:

| Region | Spacing |
|---|---|
| Header section (`PageHeaderSection hideBorder sx={{ pb: 1 }}`) | top / L / R = `theme.spacing(3)` (24px), bottom = `theme.spacing(1)` (8px) |
| Tabs row wrapping `<Box>` | `px: 3` (L / R = 24px), `borderBottom: 1`, `borderColor: 'divider'` |
| Tab itself | morpheus default — `minHeight: 4.8rem` (48px), padding from MUI; `body1` baseline / `subtitle2` selected, hover paints `background.darken10` |

```tsx
<>
  <PageHeaderSection hideBorder sx={{ pb: 1 }}>
    <Typography variant="h1">MCP servers</Typography>
  </PageHeaderSection>
  <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
    <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="MCP server views">
      <Tab label="Imported servers" value="imported" id="tab-imported" aria-controls="panel-imported" />
      <Tab label="Published servers" value="published" id="tab-published" aria-controls="panel-published" />
    </Tabs>
  </Box>
  <Box role="tabpanel" id="panel-imported" aria-labelledby="tab-imported" hidden={tab !== 'imported'}>…</Box>
  <Box role="tabpanel" id="panel-published" aria-labelledby="tab-published" hidden={tab !== 'published'}>…</Box>
</>
```

### A11y wiring rules

- `aria-label` on `<Tabs>` (or `aria-labelledby` pointing at the page title) — required.
- `id` + `aria-controls` on each `<Tab>` — required.
- `role="tabpanel"` + `id` + `aria-labelledby` on each panel — required.
- `hidden` (or conditional render) on inactive panels — required.
- Do not move focus to the panel on tab change — focus stays on the tab, the panel becomes visible.

### URL-bound active tab

```tsx
const [params, setParams] = useSearchParams();
const tab = params.get('tab') ?? 'imported';
const onChange = (_: unknown, v: string) => setParams({ tab: v });
```

The `value` is the URL key — keep keys short, kebab-case, and stable across releases; renaming a tab key breaks deep links.

### Status badges

Two flavours, two implementations.

```tsx
// Plain count — neutral grey when unselected, primary tint when selected (theme handles both)
<Tab
  value="imported"
  label={<>Imported <span className="MuiTab-status">12</span></>}
/>

// Warning / error count — production wrapper from @alation/alation-ui
<Tab
  value="issues"
  label={<TabHeaderWithNumber title="Issues" count={3} variant={TabStatusType.Error} />}
/>
```

Never recolour the plain pill by hand — the morpheus override owns selected vs unselected tinting.

### Lazy panels

When panels are heavy, render only the active one — `hidden` keeps the markup but does not avoid the work.

```tsx
{tab === 'imported'  && <ImportedView />}
{tab === 'published' && <PublishedView />}
```

### Vertical tabs — settings layout

Vertical tabs sit on the left, panel on the right. The indicator is a right-edge border. Labels can run longer (~30 chars).

```tsx
<Box sx={{ display: 'flex', minHeight: 480 }}>
  <Tabs
    orientation="vertical"
    value={tab}
    onChange={(_, v) => setTab(v)}
    aria-label="Notification settings"
    sx={{ borderRight: 1, borderColor: 'divider', minWidth: 240 }}
  >
    <Tab label="Email"   value="email"   id="tab-email"   aria-controls="panel-email" />
    <Tab label="In-app"  value="in-app"  id="tab-in-app"  aria-controls="panel-in-app" />
    <Tab label="Slack"   value="slack"   id="tab-slack"   aria-controls="panel-slack" />
  </Tabs>
  <Box role="tabpanel" id="panel-email" aria-labelledby="tab-email" sx={{ flex: 1, p: 3 }}>…</Box>
</Box>
```

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

- **MCP servers** page — `Imported servers` (count 12) · `Published servers` (count 4)
- **Catalog object** detail — `Overview` · `Schema` · `Lineage` · `Quality` · `Conversations`
- **Monitor runs** — `All runs` · `Failed` (warning count) · `In progress`
- **Notification settings** (vertical) — `Email` · `In-app` · `Slack` · `Webhooks`

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Tab label | Sentence case noun phrase; ≤ ~20 chars | "Imported servers" |
| Status badge | Number only — no units, no prefix | "12" not "12 items" |
| Disabled-tab tooltip | One short sentence — say *why*, not *what* | "Connect a source to see lineage" |
| Group `aria-label` | Sentence case noun phrase that names the views | "MCP server views" |

## 11. Example

```tsx
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

const [tab, setTab] = useState('imported');

<>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="MCP server views">
      <Tab value="imported"  label={<>Imported <span className="MuiTab-status">12</span></>}
           id="tab-imported"  aria-controls="panel-imported" />
      <Tab value="published" label={<>Published <span className="MuiTab-status">4</span></>}
           id="tab-published" aria-controls="panel-published" />
    </Tabs>
  </Box>
  <Box role="tabpanel" id="panel-imported"  aria-labelledby="tab-imported"  hidden={tab !== 'imported'}>
    {tab === 'imported'  && <ImportedView />}
  </Box>
  <Box role="tabpanel" id="panel-published" aria-labelledby="tab-published" hidden={tab !== 'published'}>
    {tab === 'published' && <PublishedView />}
  </Box>
</>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — horizontal default, vertical, scrollable, status-badge variants.
