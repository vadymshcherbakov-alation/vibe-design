---
name: breadcrumb
title: Breadcrumb
category: composite-component
last_updated: 2026-04-27

description: >
  The parent-navigation composite. Two shapes: a **Trail** (multi-step
  `<nav>` of clickable parents separated by chevrons, ending in the current
  page) for hierarchies 2+ levels deep, and a **Back to parent** link
  (single chevron-left + parent name) for pages exactly one level deep.
  Wraps MUI `<Breadcrumbs>` with a themed `ChevronRight` separator.
  Production uses two trail wrappers: `StandardBreadcrumbs` (generic;
  collapses past `maxItems`) and `ObjectBreadcrumbs` (catalog-aware;
  otype-driven). Always sits above a Page Header on detail / nested pages.
tags: [breadcrumb, navigation, hierarchy, page-trail, back-to-parent]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2063-189&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/lib/MuiBreadcrumbs.overrides.tsx · alation-ui/src/lib/StandardBreadcrumbs/ · alation-ui/src/lib/ObjectBreadcrumbs/"
example_path: ./Example.tsx

mui_base: Breadcrumbs
depends_on_tokens:
  - palette.text.primary
  - palette.text.secondary
  - palette.grey.500
  - shape.borderRadius
depends_on_components:
  - Breadcrumbs
  - Link
  - Typography
  - StandardBreadcrumbs
  - ObjectBreadcrumbs
  - ChevronLeftIcon
  - ChevronRightIcon
---

# Breadcrumb

## 1. Classification

- **Type:** Composite component
- **MUI base:** `Breadcrumbs` (+ `Link` / `Typography` items)
- **Figma:** [Breadcrumb · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2063-189&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiBreadcrumbs.overrides.tsx` · `@alation/alation-ui` — `src/lib/StandardBreadcrumbs/` (generic) · `src/lib/ObjectBreadcrumbs/` (catalog-aware)

## 2. Purpose

A **Breadcrumb** shows where the current page sits in a hierarchy and lets the user jump back up the trail in one click. The composite has two shapes — a **Trail** for hierarchies that span 2+ levels (each parent is a chevron-separated link, the current page is plain text), and a **Back to parent** link for pages that sit exactly one level deep (a single chevron-left next to the parent's name).

Breadcrumb is a *secondary* navigation aid — never the primary way to move between top-level destinations (the app shell's nav rail owns that). Use it on detail pages and any page that lives below a parent, so the user always has an escape route to a parent context.

## 3. When to use / When not to use

**Use when**
- The current page sits at least one level deep under a parent the user can navigate up to — catalog object detail, folder contents, settings sub-page
- The trail genuinely helps orientation — the user benefits from seeing the parent chain at a glance
- The parent items map to real, navigable destinations (every parent is clickable and exists)
- Use the **Trail shape** when the hierarchy is **2+ levels deep** (Settings → Notifications → Email)
- Use the **Back-to-parent shape** when the hierarchy is **exactly one level deep** (one parent + the current page)

**Do not use when**
- The page is a top-level destination — the nav rail already places the user; a breadcrumb would be noise
- The trail is a flat list of equal-weight pages, not a parent chain → use **Tabs** (mutually-exclusive views) or the nav rail
- The parent items are not real navigable destinations (just labels with no URL) → reword them into the page title or a subtitle
- The page is a modal / dialog — Dialog has its own title, not a breadcrumb
- The hierarchy depth is so deep that even the collapsed Trail form is unreadable (>~8 items with no clean parent grouping) → redesign the navigation
- Do not use the **Back-to-parent shape** when the hierarchy is more than a single parent → switch to the Trail shape so the user sees the full chain
- Do not use the **Trail shape** when there is only one parent → switch to Back-to-parent so the row is not visually noisy

## 4. Contract

### Guarantees
- The container renders as `<nav aria-label="…">` so screen readers announce it as a navigation landmark.
- Items are an ordered list of `<Link>` (parents — clickable) or `<Typography>` (current — plain text).
- Separator is the morpheus default — `ChevronRightIcon` from `@alation/icons-neo` — applied automatically by the `MuiBreadcrumbs` override.
- Non-last items render in `text.secondary`; the last item renders in `text.primary` (handled by the override's `&:last-child *` rule).
- Focus-visible on any link uses the morpheus outline-style mixin; links are inline-block + carry `borderRadius` so the outline frames cleanly.
- Past `maxItems`, items collapse into an ellipsis affordance — the morpheus override wires the ellipsis IconButton to `aria-haspopup="true"` and the click opens a `<Menu>` with the hidden items (this is what `StandardBreadcrumbs` provides).
- The current page item carries `aria-current="page"` so assistive tech announces it correctly.

### Prohibitions
- No raw `<a>` strip pretending to be breadcrumbs. Use MUI `<Breadcrumbs>` so the `<nav>` landmark, list semantics, and themed separator are correct.
- No bare `<Breadcrumbs>` without `aria-label` (or `aria-labelledby` pointing at a heading) — the landmark needs a name.
- No custom `separator` prop on the Trail shape — `ChevronRightIcon` is the contract. No "/", "›", or other glyphs.
- No `sx` overrides of item colour, separator size / colour, or focus ring — the morpheus override owns these.
- No clickable last item in the Trail shape — the current page is plain text, not a link.
- No breadcrumb item that opens a popover / menu *inline* — use the collapsed-ellipsis menu only when items overflow `maxItems`. Treating a non-overflow item as a popover is a different pattern (treeview, picker) and does not belong here.
- No breadcrumb mixed with **Tabs** as a single navigation row — the breadcrumb sits above the page title, the tabs sit below it; they are different jobs.
- No breadcrumb inside a `Dialog`, `Popover`, or any floating surface — these have their own title contract.
- **Back-to-parent label is the parent's name only** — never `"Back to <parent>"`, never `"← Back"`, never any prefix word. The chevron carries the meaning; the label is the destination. If the destination is "Settings", the link reads `< Settings` — full stop.
- No Back-to-parent shape when the page sits 2+ levels deep — switch to the Trail shape so the user sees the full chain. Conversely, no Trail shape with only one parent — switch to Back-to-parent.
- The chevron in the Back-to-parent shape points **left** (`ChevronLeftIcon`) — never right, never up. Left is the universal "go back / up one level" direction.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- **Choose the shape from the depth** — count the parents that exist between the current page and the top-level destination. One parent → Back-to-parent. Two or more → Trail. Top-level → no breadcrumb.
- Page-header pairing — both shapes sit **above** the page title with `sx={{ mb: 1 }}` — see [Page Header](./page-header/usage.md) Variant D for the canonical composition.
- For **catalog objects** (datasource → schema → table → column, folder hierarchies, agents in a workspace), use **`ObjectBreadcrumbs`** — it walks the otype tree, applies the right item construction per type, and handles polyhierarchy. Never reconstruct the otype trail by hand. Always Trail-shape; the wrapper does not produce a Back-to-parent variant.
- For **non-catalog Trail hierarchies** (settings → notifications → email; admin → roles → permissions), use **`StandardBreadcrumbs`** — it accepts arbitrary children and handles collapse to an ellipsis menu past `maxItems`.
- The **Back-to-parent shape** is built directly from MUI primitives — no production wrapper exists; assemble a `<MuiLink>` (or React Router `Link`) with a leading `ChevronLeftIcon` and the parent's name as the label. Wrap in a `<nav aria-label="…">` so the landmark name is announced.
- Items past `maxItems` (default `8` in `StandardBreadcrumbs`, `2` in `ObjectBreadcrumbs`) collapse to an ellipsis. `itemsBeforeCollapse` and `itemsAfterCollapse` control how many siblings flank the ellipsis (defaults: 1 / 1).
- Long item labels (`noWrap` mode in `ObjectBreadcrumbs`) ellipsise with `text-overflow: ellipsis` and a tooltip on hover — never wrap to a second line in a header context.
- Each item label is the destination's canonical name (object name, folder name, settings sub-page name) — not a verb, not a status, not a description.
- Routing — production breadcrumbs link via React Router `Link` (`react-router`) with `getUrl(item)` from `@alation/alation-router`. Prototype code may use plain `<MuiLink href="…">`; production must not.

## 5. Variants

Breadcrumb is a multi-axis composite. The **primary axis is shape** — Trail (multi-step) vs Back-to-parent (single-step). Secondary axes only apply to the Trail shape: **wrapper choice**, **collapse behaviour**, and **per-item content**.

### 5.1 Shape — the primary axis

Pick the shape from the **hierarchy depth** (number of parents above the current page). The two shapes are not interchangeable.

| Variant | Use when | Markup | Figma |
|---|---|---|---|
| **Trail** (default) | The current page sits **2+ levels deep** — show the full parent chain separated by `ChevronRight` icons; the last item is plain text | `<Breadcrumbs aria-label="…"><Link>Parent A</Link><Link>Parent B</Link><Typography aria-current="page">Current</Typography></Breadcrumbs>` | [Trail · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2063-189&t=eS5ReSD4ZsCMa08a-1) |
| **Back to parent** | The current page sits **exactly one level deep** — show a single `ChevronLeft` + parent name as a link | `<nav aria-label="…"><MuiLink to="…"><ChevronLeftIcon /> {parentName}</MuiLink></nav>` | [Back Link · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=3506-6169&t=eS5ReSD4ZsCMa08a-4) |

The Trail shape uses the production wrappers (`ObjectBreadcrumbs` / `StandardBreadcrumbs`) and inherits everything in §5.2–§5.4 below. The Back-to-parent shape is a thin assembly — no wrapper, no collapse, no per-item axis — and the only additional rule lives in §10 UX Copy.

### 5.2 Wrapper choice (Trail only)

| Variant | Component | Use when |
|---|---|---|
| **Object Breadcrumb** | `<ObjectBreadcrumbs items={…} rootObject={…} />` | Catalog object trail — datasource → schema → table → column; folder → child; agent → workspace. Walks the otype tree automatically. |
| **Standard Breadcrumb** | `<StandardBreadcrumbs maxItems={…}>…</StandardBreadcrumbs>` | Any non-catalog hierarchy — settings sub-pages, admin sub-pages, documentation paths. Accepts arbitrary children. |
| **Bare MUI Breadcrumbs** | `<Breadcrumbs aria-label="…">…</Breadcrumbs>` | Last resort — only when the trail is short (≤ 3 items), guaranteed not to collapse, and outside production code (prototypes, design playground). Production should use one of the wrappers. |

### 5.3 Collapse behaviour (Trail only)

| Variant | Props | Use when |
|---|---|---|
| **No collapse** (short trail) | `<StandardBreadcrumbs disableCollapse>` *or* trail length ≤ `maxItems` | The trail always fits |
| **Collapse to ellipsis menu** (default) | `<StandardBreadcrumbs maxItems={8} itemsBeforeCollapse={1} itemsAfterCollapse={1}>` | The trail may exceed `maxItems`; hidden items live in a popover menu opened from the ellipsis |
| **Catalog default** | `<ObjectBreadcrumbs maxItems={2} />` | Object trails — keeps the row short; the ellipsis menu reveals the rest |

### 5.4 Per-item content (Trail only)

| Variant | Markup | Use when |
|---|---|---|
| **Text only** (default) | `<Link to="…">Schema</Link>` | Standard parent link |
| **Leading icon + text** | `<Link to="…"><SvgIcon component={DatasourceIcon} />Datasource</Link>` | The first item is a typed root (otype icon) — the morpheus override spaces the icon `0.75 × theme.spacing` from the label automatically |
| **Truncated text + tooltip** | `<ObjectBreadcrumbs noWrap showTooltip>` | Long object names that would push the row past the header width |
| **Disabled link** | `<ObjectBreadcrumbs disableLinks>` | Read-only display of a trail (e.g. inside a dialog preview) — items render as plain text, no navigation |

### Modifiers — layered on any Trail variant

| Modifier | Pattern | Notes |
|---|---|---|
| **Root prefix** | `<ObjectBreadcrumbs rootBreadcrumbPrefix={<HomeIcon />}>` | Prepends a glyph (Home icon, app shortcut) before the first item — useful when the first item alone is ambiguous |
| **Custom expand text** | `<StandardBreadcrumbs expandText="Show more">` | Sets the `aria-label` on the collapsed-ellipsis IconButton; default is empty — set this for any user-facing context |

## 6. Anatomy

### Trail shape (multi-step)

- **Nav landmark** — `<nav aria-label="…">`; the outer container.
- **Item list** — ordered list (`MuiBreadcrumbs-ol`) of breadcrumb items.
- **Parent item** — `<Link>` rendering as text in `text.secondary`; clickable; focus-visible outline at `shape.borderRadius`.
- **Separator** — `ChevronRightIcon`; injected automatically by the morpheus default; sits between every two items.
- **Current item** — `<Typography>` in `text.primary`; not a link; should carry `aria-current="page"`.
- **Collapsed ellipsis** *(when items > maxItems)* — `<MuiIconButton class="ellipsis-item">` with `EllipsesVerticalOutlineIcon`; `aria-haspopup="true"`; opens a `<Menu>` of hidden items.
- **Collapsed menu** — popover listing hidden middle items as `<MenuItem component={Link}>` rows.

### Back-to-parent shape (single-step)

- **Nav landmark** — `<nav aria-label="…">`; same landmark contract as the Trail shape.
- **Leading chevron** — `ChevronLeftIcon`, sized to match the parent label's line-height (typically `16×16`); `text.secondary` to mirror the parent-link colour; left-pointing direction is the contract.
- **Parent link** — `<MuiLink>` (or React Router `Link`) carrying the parent's canonical name as the label, in `text.secondary`; clickable; focus-visible outline at `shape.borderRadius`. The chevron sits inside the same clickable surface so the entire affordance is one focus stop.

### Composed of

- `Breadcrumbs` — MUI primitive, themed by `MuiBreadcrumbs.overrides.tsx`
- [Typography](../foundations/typography/usage.md) — current-page item; rendered automatically as `text.primary` by `&:last-child *` rule
- `Link` (MUI) wrapping React Router `Link` — parent items in production
- [Icon Button](../base/icon-button/usage.md) — the collapsed-ellipsis affordance (themed via the override's `.ellipsis-item` class)
- `Menu` / `MenuItem` — popover for hidden items in collapse mode
- [Tooltip](../base/tooltip/usage.md) — on truncated long labels (`noWrap` mode)
- [Page Header](./page-header/usage.md) — Variant D composes this Breadcrumb reference above the title

## 7. Custom

### Page-header pairing

Breadcrumb sits above the page title with `sx={{ mb: 1 }}`. The Page Header reference owns the canonical composition — this section duplicates it so a reader landing on Breadcrumb first does not need the round-trip.

```tsx
<PageHeaderSection>
  <Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
    <Link component={RouterLink} to="/sources">Datasources</Link>
    <Link component={RouterLink} to="/sources/finance_prod">finance_prod</Link>
    <Typography color="text.primary" aria-current="page">orders</Typography>
  </Breadcrumbs>
  <Typography variant="h1">orders</Typography>
</PageHeaderSection>
```

### Back-to-parent shape — assemble inline

For a single-level hierarchy, build the affordance directly from MUI primitives — no production wrapper. The chevron sits inside the link so the entire row is one focus stop, and the label is the parent's name *only*.

```tsx
<Box component="nav" aria-label="Back to settings" sx={{ mb: 1 }}>
  <Link
    component={RouterLink}
    to="/settings"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
  >
    <ChevronLeft size={16} aria-hidden="true" />
    Settings
  </Link>
</Box>
<Typography variant="h1">Notification preferences</Typography>
```

Rules:
- The link label is the parent's name — never `"Back to Settings"`, never `"Back"`. Just `Settings`.
- The chevron is `ChevronLeft` (lucide-react) or the morpheus `ChevronLeftIcon` from `@alation/icons-neo`. Always points left.
- Wrap the link in a `<Box component="nav">` so the navigation landmark is announced; set `aria-label` to a clear sentence-case phrase ("Back to settings", "Back to datasources").
- The chevron and label must live inside the same `<Link>` — splitting them creates two focus stops.
- Apply the same `mb: 1` rhythm as a Trail breadcrumb so the page header sits at the same height regardless of which shape is in use.

### Catalog object trails — use `ObjectBreadcrumbs`

For any catalog object (otype-typed entity), let `ObjectBreadcrumbs` walk the parent chain. Pass `items` (the trail), `rootObject` (the topmost ancestor), and optionally `indexOtype` (the leaf otype). The wrapper handles the chevron icon, polyhierarchy, and the sensible `maxItems={2}` default.

```tsx
<ObjectBreadcrumbs
  items={parentChain}
  rootObject={schema}
  indexOtype="table"
  noWrap
  showTooltip
/>
```

Never reconstruct the otype trail by hand — the wrapper encodes the otype-specific rules (which links open the overlay, which open a detail page, which use a tooltip).

### Non-catalog trails — use `StandardBreadcrumbs`

Any non-catalog hierarchy uses `StandardBreadcrumbs`. Pass children directly; set `maxItems` if the trail can grow long. The `expandText` is the `aria-label` on the collapsed-ellipsis button.

```tsx
<StandardBreadcrumbs maxItems={5} expandText="Show hidden steps">
  <Link to="/settings">Settings</Link>
  <Link to="/settings/notifications">Notifications</Link>
  <Link to="/settings/notifications/email">Email</Link>
  <Typography aria-current="page">Daily digest</Typography>
</StandardBreadcrumbs>
```

### A11y wiring rules

- `aria-label` on the outer `<Breadcrumbs>` (or `aria-labelledby` pointing at a heading) — required.
- `aria-current="page"` on the current (last) item — required.
- The collapsed-ellipsis IconButton carries `aria-haspopup="true"` + `aria-controls` to the menu — handled by `StandardBreadcrumbs`.
- The collapsed Menu carries an `id` referenced by the IconButton's `aria-controls` — handled by `StandardBreadcrumbs`.

### Truncation

Long object names (a long term name, a long table name) push the row past the page-header width. Two options:

- `noWrap` (in `ObjectBreadcrumbs`) — items truncate with `text-overflow: ellipsis`; pair with `showTooltip` so the full label is on hover.
- Drop to a shorter trail by raising `parentFolderIndex` or letting collapse take over — sometimes the right answer is "show fewer ancestors", not "ellipsise everything".

Never wrap to a second line in a header context.

### Disabled-link mode

Render-only mode — items appear as plain text, no navigation. Used in dialog previews ("Move object: showing target location") and read-only states.

```tsx
<ObjectBreadcrumbs items={previewChain} disableLinks />
```

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

**Trail shape** (2+ levels deep)
- **Catalog object detail** — `Datasources / finance_prod / public / orders / customer_id` (5-deep, will collapse on `ObjectBreadcrumbs maxItems={2}` to `Datasources … customer_id`)
- **Settings sub-page** — `Settings / Notifications / Email / Daily digest`
- **Admin sub-page** — `Admin / Roles & Permissions / Custom roles / Read-only`
- **Move-object dialog preview** (disabled-link mode) — `finance_prod / public / orders` (no navigation, just visual context)

**Back-to-parent shape** (exactly one level deep)
- A settings *category* page under Settings — `< Settings` above the title "Notification preferences"
- A datasource detail page under the Datasources index — `< Datasources` above the title "finance_prod"
- A monitor detail under the Monitors index — `< Monitors` above the title "Daily freshness check"

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Trail item label | Destination's canonical name; sentence case for sub-pages, exact-case for object names | "Datasources" · "finance_prod" |
| **Back-to-parent label** | **Parent's name only — never `"Back to <name>"`, never any prefix.** The chevron carries the meaning. | `< Settings` (✅) · `< Back to Settings` (❌) · `← Back` (❌) |
| Outer `aria-label` | Sentence case noun phrase that names the trail | "Object trail" · "Settings navigation" · "Back to settings" |
| Collapsed-ellipsis `expandText` (`aria-label` on the IconButton) | Sentence case verb phrase | "Show hidden steps" |
| Truncation tooltip | Full label, no extras | "very_long_table_name_here" |

## 11. Example

```tsx
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { ChevronLeft } from 'lucide-react';

// Trail shape — 2+ levels deep · sits above a Page Header
<Breadcrumbs aria-label="Settings trail" sx={{ mb: 1 }}>
  <Link component={RouterLink} to="/settings">Settings</Link>
  <Link component={RouterLink} to="/settings/notifications">Notifications</Link>
  <Typography color="text.primary" aria-current="page">Email</Typography>
</Breadcrumbs>

// Back-to-parent shape — exactly one level deep · parent name only
<Box component="nav" aria-label="Back to settings" sx={{ mb: 1 }}>
  <Link
    component={RouterLink}
    to="/settings"
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
  >
    <ChevronLeft size={16} aria-hidden="true" />
    Settings
  </Link>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — both shapes plus all Trail variants.
