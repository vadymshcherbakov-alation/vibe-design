---
name: app-side-bar
title: App Side Bar
category: composite-component
last_updated: 2026-04-28

description: >
  The vertical icon rail of global app chrome. Hosts the Menu toggle plus the
  primary navigation between top-level destinations (Catalog, Compose, Curate
  and Govern, Analytics, Data Products, Data Quality, CDE Manager, Agent
  Studio) and a bottom-anchored Add-Ons button. Sits to the left of every
  page on the same dark navy ground as the App Top Header; the active
  destination is highlighted in brand orange.
tags: [app-chrome, side-bar, navigation, nav-rail, primary-nav]

figma_url: ""
code_reference: "no shared production wrapper. Canonical source is vibe-design's prototype scaffolding: `vibe-design/apps/alation-base-ui/app/components/layout/app-nav.tsx` + `nav-button.tsx`. This doc captures the composition contract."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens:
  - palette.neutral.800
  - palette.brand.main
  - palette.text.primary
depends_on_components:
  - Box
  - Tooltip
  - Iconography
---

# App Side Bar

## 1. Classification

- **Type:** Composite component — **app-shell chrome**, not page-level content
- **MUI base:** none (composes a `<Box>` column of icon buttons + `Tooltip`s)
- **Figma:** Not yet — anchor when NEO 2.1 ships an app-shell frame
- **Code:** No shared production wrapper. Canonical source is `vibe-design/apps/alation-base-ui/app/components/layout/app-nav.tsx` + `nav-button.tsx` — prototype scaffolding shared across vibe-design pilots.

## 2. Purpose

The App Side Bar is the persistent column on the left edge of every authenticated page. **It is the primary way users navigate between top-level Alation products** — Catalog, Compose, Curate and Govern, Alation Analytics, Data Products, Data Quality, CDE Manager, Agent Studio. Tapping any icon switches the user to that product; the active product is highlighted in brand orange.

The Menu toggle opens the contextual App Sub Navigation panel for the current product. The rail itself does not change between products — it is shared chrome, so muscle memory carries across the whole platform.

It is global app chrome, not a page-level component. The icons are intentionally label-less in the rail itself — each carries an `aria-label` and reveals its name in a Tooltip on hover, so the rail stays narrow and visual rhythm stays consistent across pages.

## 3. When to use / When not to use

**Use when**
- You are rendering the authenticated app shell — every page inside `/app/*` mounts this rail
- The page lives inside the standard Alation chrome, paired with the [App Top Header](../app-top-header/usage.md)

**Do not use when**
- You need a page-level navigation row → use [Tabs](../tabs/usage.md) or a contextual [App Sub Navigation](../app-sub-navigation/usage.md)
- You are inside a [Dialog](../dialog/usage.md), an unauthenticated screen, or a print / export view — chrome is omitted in those contexts

## 4. Contract

### Guarantees
- Renders as a single vertical `<Box>` column inside the AlationLayout shell — one per page, never nested.
- Two groups, top and bottom, separated by `flex` (the column uses `justify-content: space-between`):
  - **Top group** — Menu toggle + the primary destinations, in fixed order
  - **Bottom group** — Add-Ons (anchored to the bottom of the column)
- Each entry is a fixed-size square `36×36px` icon button rendered through the **NavButton** atom — accessible label as `aria-label`, Tooltip on hover with the destination name, brand-orange filled square when active, transparent + white-translucent hover when inactive.
- The rail sits on the dark navy ground (`palette.neutral[800]`) shared with the App Top Header; icons render in white.
- Vertical padding is `10px` top and bottom; horizontal rail padding is `10px` (the rail's outer width is `~56px`).
- Active state is set by the consumer's router (the `pathname` matches the entry's `href` or `activeMatchPrefix`); the rail does not own routing.

### Prohibitions
- No labels rendered next to the icons in the rail itself — labels live in the Tooltip and as `aria-label` only. The rail's contract is "narrow icon column with hover labels".
- No more than one active state at a time. If the router matches more than one entry, pick the most-specific (longest prefix).
- No reordering the primary destinations per-environment — the order is part of the chrome's contract for muscle memory.
- No replacing the Menu toggle's behaviour — it always opens / closes the [App Sub Navigation](../app-sub-navigation/usage.md). It is not a hamburger that hides the rail.
- No "back" / "forward" / "home" affordances inside the rail — those are router concerns, not chrome.
- No hard-coded hex on the navy ground or the orange active state — consume via `palette.neutral[800]` and `palette.brand.main`. (The vibe-design source uses `#f16923` directly; that is a *prototype concession*, not a contract — production should consume the brand token.)
- No nested rails. If a destination has its own nav, that lives in [App Sub Navigation](../app-sub-navigation/usage.md), not inside the rail.
- No icon size other than `20×20`. The square button is `36×36`; the icon inside is always `20×20` for visual rhythm.
- **No lucide-react or generic icons in the rail.** Every entry must use the corresponding **Alation product icon from `@alation/icons-neo`** (see §7 → "Icon library"). The rail is the visual identifier for each product — using a generic outline icon breaks recognition.
- No tooltip placement other than `right` — left or top would clip on the navy ground.
- **No light tooltips on the rail.** The Tooltip uses the canonical dark surface (`palette.grey[900]` / `#262626`) with white text. White tooltips do not exist anywhere in the system, and would clash with the navy ground in particular.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- The App Side Bar is always paired with the [App Top Header](../app-top-header/usage.md) inside an app-chrome composition; together they form the navy frame around the white main area.
- Each NavButton entry must have either an `href` (router-driven destinations) **or** an `onClick` (the Menu toggle) — never both. The Menu entry uses `onClick`; everything else uses `href`.
- Active matching: by default an entry is active when the current `pathname` equals the entry's `href` or starts with `entry.href + '/'`. For nested route groups, set `activeMatchPrefix` to lock the activation. For exact-only matching (the Catalog root), set `activeMatchExact`.
- The Tooltip's accessible label (`title`) must mirror the entry's display name — divergence breaks screen-reader announcement.
- When a destination is gated (feature flag off, role missing), keep its NavButton rendered and visually un-emphasised (do *not* hide), or remove it from the entry list entirely. Half-hidden states fragment muscle memory.

## 5. Variants

App Side Bar is **single-shape**. There is one canonical layout — Menu + 8 primary destinations on top, Add-Ons on bottom. Variation lives only in the *entry list*, not in the shell.

| Slot | Default | When it changes |
|---|---|---|
| Menu toggle | `id: 1` — uses `onClick`, no `href`; opens / closes App Sub Navigation | Never; this slot is fixed |
| Primary destinations | Catalog, Compose, Curate and Govern, Alation Analytics, Data Products, Data Quality, CDE Manager, Agent Studio | Add / remove only when a top-level module ships or is retired; never reorder for cosmetic reasons |
| Bottom slot | Add-Ons | Reserved for cross-cutting destinations only (currently just Add-Ons) |

Per-NavButton **state** is owned by the router; the NavButton renders three visual states:

| State | Trigger | Visual |
|---|---|---|
| **Inactive** | `pathname` does not match | Transparent square; white icon; tooltip on hover |
| **Active** | `pathname` matches the entry's match rule | Brand-orange filled square (`palette.brand.main`); white icon; same tooltip on hover |
| **Hover (inactive only)** | Pointer hovers an inactive entry | White-translucent fill (`rgba(255,255,255,0.3)`); white icon |

## 6. Anatomy

```
┌───────┐
│  ☰    │   ← Menu toggle (onClick)
│  ▢    │
│  ▢    │
│  ▢    │   ← Primary destinations (top group, 8 entries, fixed order)
│  ▢    │
│  ▢    │
│  ▢    │
│  ▢    │
│  ▢    │
│       │
│  …    │
│       │
│  ▢    │   ← Bottom group (Add-Ons)
└───────┘
```

- **Rail container** — `<Box>` flex column, `justify-content: space-between`, `width: ~56px`, full height, dark navy ground.
- **Top group** — flex column with `gap: 10px`; Menu toggle first, then 8 primary destinations.
- **Bottom group** — Add-Ons anchored at the bottom by `space-between`.
- **NavButton** atom — square `36×36`, rounded `4px`, contains a `20×20` icon; tooltip-on-hover; active state painted in brand orange.

### Composed of

- [Box](../../foundations/layout/usage.md) — outer column + the two groups
- [Tooltip](../base/tooltip/usage.md) — hover label on each NavButton, placed `right`, with arrow
- [Iconography](../../foundations/iconography/usage.md) — Alation SVG nav icons (this is one of the rare places where Alation SVG assets are used instead of lucide-react, per the cross-cutting principles in `SKILL.md`)

The NavButton itself is **inline anatomy** — a square clickable surface with tooltip and active-state painting. It is not a separate base reference because no other element consumes its exact shape.

## 7. Custom

### Active state and routing

The rail does not own routing — it only paints the *current* state. Active matching is one of three rules per entry:

```ts
type NavEntry =
  | { href: string }                                  // active when pathname === href OR startsWith(href + '/')
  | { href: string; activeMatchExact: true }          // active only when pathname === href (Catalog root)
  | { href: string; activeMatchPrefix: string }       // active when pathname startsWith activeMatchPrefix
  | { onClick: () => void }                           // Menu toggle — never active
```

Pick the most-specific rule for each entry. The Catalog root needs `activeMatchExact` so it doesn't light up under every `/app/*` route. Agent Studio uses `activeMatchPrefix: '/app/studio'` so all sub-routes (`agents`, `tools`, `flows`) keep the entry lit.

### Brand orange — token, not hex

The active state colour is **`palette.brand.main`** in the morpheus theme. The vibe-design source uses the literal `#f16923` because it is prototype-only scaffolding; production callers must consume the token, not the literal. Calling out the divergence here so the next migration to a shared production wrapper does not bake in the hex.

### Icon library — Alation product icons from `@alation/icons-neo`

This rail is the one canonical place where **Alation-branded product icons** are used instead of lucide-react (per the cross-cutting principle: "lucide-react for UI icons; Alation product icons for the nav rail only"). Each entry maps to a specific named export from `@alation/icons-neo`:

| Entry | Icon import (`@alation/icons-neo`) | Source asset |
|---|---|---|
| Catalog | `LogoIcon` | `alation-logo.svg` (the brand mark — Catalog is the home product) |
| Compose | `ComposeIcon` | `compose.svg` |
| Curate and Govern | `GovernanceIcon` | `governance.svg` |
| Alation Analytics | `AreaChartIcon` | `area-chart.svg` |
| Data Products | `Storefront` (from `@mui/icons-material`) — production fallback while a neo marketplace icon is finalised | — |
| Data Quality | `VerifiedIcon` | `verified.svg` |
| CDE Manager | `CdeIcon` | `cde.svg` |
| Agent Studio | `AgentIcon` | `agent.svg` |
| Add-Ons | `AddOnsIcon` | `add-ons.svg` |

Production wiring lives in `libs/app-switcher-nav/src/lib/AppSwitcherNav.tsx` — that file is the source of truth for which icon belongs to which product. Keep the icon paired with the destination label — swapping one without the other breaks product recognition for users who navigate by icon shape.

### Tooltip — dark surface, anchored outside the rail

The hover Tooltip uses the canonical dark Tooltip (see [Tooltip](../base/tooltip/usage.md)) — `palette.grey[900]` (`#262626`) ground, white text, `placement="right"`, with arrow. The Tooltip floats *outside* the navy rail surface so the label sits on the page background, not on the navy chrome. Light / white tooltips are forbidden everywhere in the system; the navy rail makes that especially visible because a white tooltip would compete with the active brand-orange square.

### A11y wiring rules

- Each NavButton carries `aria-label` matching its display name — required so screen readers announce the destination.
- The Tooltip's `title` mirrors the same string.
- The active entry implicitly carries `aria-current="page"` (set on the active NavButton's link).
- Tab order follows render order (Menu first, then primary destinations top-to-bottom, then Add-Ons).

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

- **Top group entries** — `Menu` · `Catalog` (`/app`) · `Compose` (`/app/compose`) · `Curate and Govern` (`/app/governance`) · `Alation Analytics` (`/app/analytics`) · `Data Products` (`/app/marketplace`) · `Data Quality` (`/app/data_quality`) · `CDE Manager` (`/app/cde-hub`) · `Agent Studio` (`/app/studio/agents`, prefix `/app/studio`)
- **Bottom group** — `Add-Ons` (`/app/add-ons`)

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| NavButton tooltip / `aria-label` | Module proper name; preserves capitalisation (e.g. "Alation Analytics", "CDE Manager") | "Catalog" · "Curate and Govern" · "Agent Studio" |
| Menu toggle `aria-label` | Literal | "Menu" |

## 11. Example

```tsx
<Box sx={{ width: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', bgcolor: 'neutral.800', px: 1.25 }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, py: 1.25 }}>
    <NavButton name="Menu"     icon={NavMenuIcon}    onClick={onMenuClick} />
    <NavButton name="Catalog"  icon={NavCatalogIcon} href="/app" isActive={isCatalogActive} />
    {/* …Compose, Curate and Govern, Analytics, Data Products, Data Quality, CDE, Agent Studio… */}
  </Box>
  <Box sx={{ pb: 1.25 }}>
    <NavButton name="Add-Ons" icon={NavAddOnIcon} href="/app/add-ons" isActive={isAddOnsActive} />
  </Box>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — full rail with all entries, hover state, and active state.
