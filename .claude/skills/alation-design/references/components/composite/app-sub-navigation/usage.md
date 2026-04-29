---
name: app-sub-navigation
title: App Sub Navigation (Wayfinder)
category: composite-component
last_updated: 2026-04-28

description: >
  The contextual second-level navigation panel — informally called the
  Wayfinder. A 280px-wide column on the same dark navy ground as the App Top
  Header / App Side Bar, hosting a panel title plus either a flat list of
  destinations (per-section pages) or sectioned navigation with drill-down
  (Settings → Profile → Email). Sits between the App Side Bar and the white
  main area; toggleable from the Side Bar's Menu button.
tags: [app-chrome, sub-navigation, wayfinder, drill-down]

figma_url: ""
code_reference: "no shared production wrapper. Canonical source is vibe-design's prototype scaffolding: `vibe-design/apps/alation-base-ui/app/components/layout/sub-nav.tsx` + `sub-nav-configs.ts`. This doc captures the composition contract."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens:
  - palette.neutral.800
  - palette.text.primary
depends_on_components:
  - Box
  - Typography
  - Button
  - Divider
  - Iconography
---

# App Sub Navigation (Wayfinder)

## 1. Classification

- **Type:** Composite component — **app-shell chrome**, not page-level content
- **MUI base:** none (composes `<Box>` + `Typography` + `Button` + `Divider`)
- **Figma:** Not yet — anchor when NEO 2.1 ships an app-shell frame
- **Code:** No shared production wrapper. Canonical source is `vibe-design/apps/alation-base-ui/app/components/layout/sub-nav.tsx` + `sub-nav-configs.ts` — prototype scaffolding shared across vibe-design pilots. Often called **Wayfinder** internally.

## 2. Purpose

The App Sub Navigation — Wayfinder — is the contextual second-level navigation that appears between the App Side Bar and the white main area when a top-level destination has more than one page. It shows the current top-level title at the top and either a flat list of pages (Catalog → Browse / Search / Saved) or a set of sections with drill-down (Settings → Profile / Notifications / API access, each opening into its own list).

The Wayfinder is a *secondary* navigation aid. It is toggleable from the Side Bar's Menu button — the user opens it when they need to jump between sub-pages, closes it when they want maximum body width.

## 3. When to use / When not to use

**Use when**
- The current top-level destination has 2+ named sub-pages the user moves between (Settings, Compose, Agent Studio)
- The sub-page set is genuinely navigation, not content — switching changes the route, not a tab inside a single page
- You want users to be able to drill into a deep area (Settings → Notifications → Email) without losing the chain

**Do not use when**
- The current destination has a single page or two parallel views — those belong in [Tabs](../tabs/usage.md), not the Wayfinder
- The hierarchy is for *content within a page* (table rows, filter facets) — the Wayfinder is for *routes*
- You're rendering an unauthenticated screen, a modal, or a print view — chrome is omitted

**Default open / closed state**

The Wayfinder's default visibility follows the user's depth inside a product, so the panel reveals navigation when it is useful and gets out of the way when it isn't:

- **Open by default** when the user lands on a product's *top-level page* (e.g. `/app/studio`, `/app/marketplace`, `/app/settings`) or on any of its directly-listed sub-pages (e.g. `/app/studio/agents`, `/app/settings/users`). At this depth the user is still orienting — showing all sub-navigation options helps them pick where to go next.
- **Closed by default** when the user drills *into* a specific feature, record, or detail screen (e.g. `/app/studio/agents/<id>/edit`, `/app/marketplace/products/<id>`). At this depth the user is focused on content; the main area should get full width.
- **The user's explicit toggle wins.** Once the user clicks the Side Bar's Menu button to open or close the panel, that choice persists for the rest of the session — the depth-based default does not fight the user.

## 4. Contract

### Guarantees
- Renders as a single `<Box>` column to the right of the [App Side Bar](../app-side-bar/usage.md). One per page; never nested.
- Width is fixed at `280px`. Top corners are rounded (`12px 12px 0 0`); the panel sits on a translucent white-on-navy ground (`rgba(255, 255, 255, 0.0625)` / `#FFFFFF10`) so it reads as part of the navy chrome but distinct from the side bar.
- Two shapes — picked at config time, not at runtime:
  - **Flat list** — `config.items: SubNavItem[]`. Each item renders as an icon + label row, with the active item highlighted in white-translucent fill.
  - **Sectioned with drill-down** — `config.sections: SubNavSection[]`. Top level shows section names with a chevron-right; clicking a section reveals its items in place, with a "Back" affordance pinned to the top of the items view.
- Title row at the top: panel title (`22px`, weight 600), 24px left padding to clear the rounded corner; never scrolls (it's `flex-shrink: 0`).
- Items area scrolls vertically when content exceeds the panel height; uses a custom 6px-wide scrollbar with translucent-white thumb so it doesn't break the navy aesthetic.
- Active state for an item: `pathname === item.href` (exact match) renders the row with `rgba(255,255,255,0.15)` background and `font-weight: 500`. Hover follows the same colour family.
- Section title row in drill-down mode: clicking it descends into the section's items; the section row itself never holds an `href`.
- Toggle wiring: the panel's visibility is controlled by the parent layout (`AlationLayout`); the Wayfinder itself does not own the toggle state.

### Prohibitions
- No more than one App Sub Navigation per page.
- No mixing both shapes in one config — pick `items` *or* `sections`. Configs that pass both are invalid; the prototype falls back to `sections` but production must reject the config.
- No labels longer than ~3 words per item — they ellipsise hard at 280px width and become unreadable.
- No fixed-pixel item heights — content drives height via padding (`10px 12px`).
- No icon other than 16×16 (lucide-react `size={16}` or equivalent SVG) inside an item row. The icon is left-aligned, the label sits to its right with `gap: 12px`.
- No alternate widths (240, 320 etc) — `280px` is the contract for chrome stability across pages.
- No light-on-light styling — every item, section row, and title is white text on a dark or translucent-white ground.
- No nested drill-down (sections inside sections). Two levels max: top-level sections, then per-section items.
- No hard-coded brand colours inside the Wayfinder — the active state is white-translucent, never brand orange. Brand orange is reserved for the Side Bar's primary destination.
- No removing the title row, even when there is only one section — the title is the user's anchor inside the chrome.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- The Wayfinder always renders inside an [App Top Header](../app-top-header/usage.md) + [App Side Bar](../app-side-bar/usage.md) chrome — it is the third element of the navy frame. Mounting it outside the frame is invalid.
- Active matching is **exact** (`pathname === item.href`). Prefix matching is left to the route, not to the Wayfinder — see the active rule under Guarantees.
- In drill-down mode, the auto-navigation rule fires only on initial mount: when the user lands on a route that lives inside a section, the Wayfinder opens that section automatically. Subsequent navigation is user-driven (no implicit reopen).
- The "Back" affordance inside drill-down mode is a `Button variant="text"` with a leading `ChevronLeft size={16}`; its label is the panel title (e.g. "All Settings"). When clicked, it returns to the top-level section list — it does **not** route the user.
- A `dividerBefore: true` on a SubNavItem renders a `Divider` above the item with `borderColor: rgba(255,255,255,0.15)` and `my: 4px`. Use sparingly to group related items.
- Default open/closed state is depth-driven. On a product's top-level page or any directly-listed sub-page, the Wayfinder is open by default so the user can see all sub-navigation options. On a drilled-in feature/detail screen, it is closed by default so the main area gets full width. Once the user explicitly toggles the panel via the Side Bar's Menu button, that choice persists for the session and the depth-based default no longer applies.

## 5. Variants

App Sub Navigation has **two shapes**, picked at config time. Inside each shape there is no styling axis — only content variation.

### 5.1 Shape — flat list

Use when the destination has a small set of sub-pages with no internal hierarchy (Compose, Agent Studio, Catalog).

```ts
type SubNavConfig = {
  title: string;
  items: SubNavItem[];   // 2–~12 items
};

type SubNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; ... }>;
  href: string;
  iconStyle?: 'fill' | 'stroke';   // 'fill' default — Alation SVGs ship as filled glyphs
  dividerBefore?: boolean;         // optional separator above this row
};
```

### 5.2 Shape — sectioned with drill-down

Use when the destination groups its sub-pages into sections (Settings, Curate and Govern). Each section shows its name + a chevron-right; tapping reveals the section's items in place, with a "Back" affordance to return.

```ts
type SubNavConfig = {
  title: string;
  sections: SubNavSection[];
};

type SubNavSection = {
  title: string;            // section name, e.g. "Notifications"
  items: SubNavItem[];      // ≤ ~12 items
};
```

The auto-navigate rule selects the section whose items contain the current `pathname` on initial mount. The section's H3 title sits above the items list.

### Per-row state

| Named style | Trigger | Visual |
|---|---|---|
| **Inactive** | Item row, `pathname !== href` | Transparent fill; white label at weight 400 |
| **Hover (inactive)** | Pointer hovers an inactive row | `rgba(255,255,255,0.10)` fill |
| **Active** | `pathname === href` | `rgba(255,255,255,0.15)` fill; label at weight 500 |
| **Hover (active)** | Pointer hovers the active row | `rgba(255,255,255,0.20)` fill |

Section rows in drill-down mode use the same family — inactive / hover; "active" is implicit (the section is the one currently expanded).

## 6. Anatomy

```
┌────────────────────────┐
│  Settings              │   ← Title row (22px, weight 600, 24px left pad)
│                        │
│  ▢ Profile           > │   ← Section row (drill-down mode) — chevron right
│  ▢ Notifications     > │
│  ▢ API access        > │
└────────────────────────┘

       drill-down
            ▼

┌────────────────────────┐
│  Settings              │
│                        │
│  ‹ All Settings        │   ← Back affordance (Button text, leading ChevronLeft)
│  Notifications         │   ← Section title H3
│                        │
│  ✉ Email              │   ← Item row (active state: white-translucent fill)
│  💬 In-app             │
│  📱 Mobile push        │
└────────────────────────┘
```

- **Panel container** — `<Box>`, fixed `280px` wide, translucent-white ground, top corners rounded `12px`.
- **Title row** — `<Typography>` at `22px` weight 600, `pl: 24px`, `py: 16px`, `flex-shrink: 0`.
- **Items / sections area** — `flex: 1`, scrolls vertically; custom 6px translucent scrollbar.
- **Section row** (drill-down only) — flex row `space-between` with section title + `ChevronLeft` rotated 180°; clickable.
- **Back affordance** (drill-down second level) — `Button variant="text"` with leading `ChevronLeft size={16}`; label is the panel's top-level title.
- **Section title H3** (drill-down second level) — `Typography` at `16px` weight 500, sits above the items.
- **Item row** — flex row, `gap: 12px`, `py: 10px px: 12px`, with the row extending into the parent's left/right padding via negative margin (`ml: -12px; mr: -12px`) so the active background bleeds full-width.
- **Item icon** — `16×16`, white. Filled by default; `iconStyle: 'stroke'` flips to outlined.
- **Item label** — `Typography`, `13px`, line-height `1.54`.
- **Divider** (when `dividerBefore: true`) — `<Divider>` with `borderColor: rgba(255,255,255,0.15)` and `my: 4px`.

### Composed of

- [Box](../../foundations/layout/usage.md) — outer column + groups + item rows
- [Typography](../../foundations/typography/usage.md) — title (22px), section H3 (16px), item label (13px)
- [Button](../base/button/usage.md) — the "Back" affordance in drill-down mode (`variant="text"` named style)
- Divider — between grouped items
- [Iconography](../../foundations/iconography/usage.md) — Alation SVG icons for the item rows; `ChevronLeft` lucide-react for the Back affordance and the section chevron-right

## 7. Custom

### Toggle ownership

The Wayfinder does **not** own its visibility. The parent layout (`AlationLayout`) owns the boolean and re-renders without the Wayfinder when it is hidden — the Wayfinder is mounted-or-not, not opened-and-closed via animation. This keeps the layout reflow predictable.

The Side Bar's Menu button calls a callback that flips the boolean — see [App Side Bar](../app-side-bar/usage.md) §5 (Menu toggle slot).

### Depth-driven default visibility

The initial value of the toggle boolean is computed from the route depth, not hard-coded to `true`:

- If the current route is a product's top-level page or one of its directly-listed sub-pages (i.e. the route appears as a `SubNavItem.href` or section-level entry in the active `SubNavConfig`), the layout mounts the Wayfinder open by default.
- If the current route is a drilled-in detail/feature screen below those entries (typically anything matching `<sub-page-href>/<id>` or deeper), the layout mounts the Wayfinder closed by default so the main area gets full width.
- Once the user clicks the Side Bar's Menu button, the layout switches to a "user-controlled" mode for the rest of the session — the depth-based default no longer overrides the user's choice on subsequent navigations.

```ts
// AlationLayout (sketch)
const [userToggled, setUserToggled] = useState(false);
const [userVisible, setUserVisible] = useState(true);

const isLeaf = useMemo(() => isDrilledRoute(pathname, activeSubNav), [pathname, activeSubNav]);
const isSubNavVisible = userToggled ? userVisible : !isLeaf;

const onMenuClick = () => {
  setUserToggled(true);
  setUserVisible((v) => !v);
};
```

`isDrilledRoute` is the predicate that checks whether `pathname` is below any `SubNavItem.href` in the active config. If yes → drilled-in (default closed). If no → top-level / sub-page (default open).

### Drill-down state

Drill-down state lives inside the Wayfinder (`useState<SubNavSection | null>`). On mount, an effect picks the section whose items contain the current `pathname` and sets it as `currentSection`; subsequent navigation does **not** retrigger the auto-pick (the user can drill back to top-level explicitly).

### Auto-navigation rule

```ts
useEffect(() => {
  if (config.sections && currentSection === null) {
    const activeSection = config.sections.find(section =>
      section.items.some(item =>
        pathname === item.href || pathname.startsWith(item.href + '/')
      )
    );
    if (activeSection) setCurrentSection(activeSection);
  }
}, [pathname, config.sections]);
```

The rule fires once per mount when `currentSection === null`; it does not retrigger when the user navigates between sections via the rail. This avoids fighting the user's explicit Back / drill-into actions.

### Per-route config

Configs are keyed by route prefix in `sub-nav-configs.ts` (or the workspace's equivalent). The longest-matching prefix wins. Top-level destinations without a Wayfinder (e.g. plain index pages) simply do not have a config — the panel does not render.

### A11y wiring rules

- The panel container should carry `aria-label` (or `aria-labelledby` pointing at the title) so screen readers announce the panel.
- Each item row's accessible name is its visible label.
- The active item carries `aria-current="page"`.
- The "Back" affordance is a real `<button>` (Button variant="text"); keyboard-accessible.

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

**Flat list shape:**
- **Compose** (title) → New thread / Drafts / Shared with me / Templates
- **Agent Studio** (title) → Agents / Tools / Flows / Models / MCP servers / Logs / Settings

**Sectioned drill-down shape:**
- **Settings** (title) → sections: Profile · Notifications · API access · Roles & permissions · Audit log
  - Notifications (drilled) → Email / In-app / Mobile push / Daily digest
  - Profile (drilled) → Personal details / Photo / Time zone / Locale

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Panel title | Module proper name | "Settings" · "Compose" · "Agent Studio" |
| Section title | Sentence case noun phrase; ≤ 3 words | "Notifications" · "API access" |
| Item label | Sentence case noun phrase; ≤ 3 words | "Email" · "Daily digest" |
| Back affordance label | Always the panel title | "All Settings" |
| Section row chevron | Always points right (rendered as `ChevronLeft` rotated 180° to share an icon import) | — |

## 11. Example

```tsx
<Box sx={{ width: 280, bgcolor: 'rgba(255,255,255,0.0625)', borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column' }}>
  <Box sx={{ pl: 3, py: 2, flexShrink: 0 }}>
    <Typography sx={{ color: '#FFF', fontSize: 22, fontWeight: 600 }}>Settings</Typography>
  </Box>
  <Box sx={{ flex: 1, overflowY: 'auto', pl: 3, pr: 1.5, pb: 2 }}>
    {/* sections (drill-down) or items (flat) */}
  </Box>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — both shapes plus drill-down state.
