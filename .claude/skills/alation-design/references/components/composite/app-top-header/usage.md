---
name: app-top-header
title: App Top Header
category: composite-component
last_updated: 2026-04-28

description: >
  The top horizontal strip of global app chrome — customer logo on the left,
  search field centred (max 600px), and a fast actions button group on the
  right (notifications, settings, profile avatar; expandable per workspace).
  Sits above every page on a dark navy ground; the white page surface drops
  in below it with a top-left rounded corner. Always paired with App Side
  Bar (left rail) and optionally App Sub Navigation.
tags: [app-chrome, top-bar, header, search, avatar, layout]

figma_url: ""
code_reference: "no shared production wrapper. Canonical source is the prototype scaffolding at `apps/alation-base-ui/app/components/layout/app-header.tsx`. This doc captures the composition contract."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens:
  - palette.neutral.800
  - palette.text.primary
  - palette.background.paper
  - typography.body2
depends_on_components:
  - Box
  - TextField
  - IconButton
  - Avatar
  - Menu
  - MenuItem
  - ListItemIcon
  - Divider
---

# App Top Header

## 1. Classification

- **Type:** Composite component — **app-shell chrome**, not page-level content
- **MUI base:** none (composes `<Box component="header">` + `TextField` + `IconButton` + `Avatar` + `Menu`)
- **Figma:** Not yet — anchor when NEO 2.1 ships an app-shell frame
- **Code:** No shared production wrapper. Canonical source is `apps/alation-base-ui/app/components/layout/app-header.tsx` — prototype scaffolding shared across pilot apps. **Note: this composite does NOT use MUI `<AppBar>`** — it is a plain `<Box component="header">`, so the morpheus `MuiAppBar.overrides.ts` is not a prerequisite.

## 2. Purpose

The App Top Header is the strip that runs across the top of every authenticated page. It hosts three regions in fixed order: a customer logo on the left, a search field in the centre, and a fast actions button group on the right (notifications, settings, profile avatar — expandable per workspace).

It is global app chrome: it sits outside the page content and is the same on every page. Page-level title rows belong to a separate composite, the Page Header, that lives inside the white main area below.

## 3. When to use / When not to use

**Use when**
- You are rendering the authenticated app shell — every page inside `/app/*` mounts this header
- The page lives inside the standard Alation chrome, paired with [App Side Bar](../app-side-bar/usage.md)

**Do not use when**
- You are rendering a page-level title row — use [Page Header](../page-header/usage.md) inside the white main area instead
- You are inside a [Dialog](../dialog/usage.md), an unauthenticated screen (login, error), or a print / export view — chrome is omitted in those contexts
- You need a tab strip — App Top Header has no tabs; tabs belong to [Tabs](../tabs/usage.md) under a Page Header

## 4. Contract

### Guarantees
- Renders as a single `<Box component="header">` inside the AlationLayout shell — one per page, never nested.
- Three regions in fixed order, left-to-right: **Brand region** (customer logo) · **Search region** (flex-grow, capped at `maxWidth: 600px`) · **Actions region** (fast actions button group: notifications + settings + profile avatar; expandable per workspace).
- The header sits on the dark navy ground (`palette.neutral[800]`) shared with the App Side Bar; text and icons render in white.
- The search field is a MUI `TextField variant="filled"` with `disableUnderline` — translucent white-on-navy when blurred, opaque white when focused; the keyboard `Enter` key submits the search.
- The avatar is a clickable `Avatar` opening a `Menu` with profile / settings / sign-out items; the menu anchors to the avatar's bottom-right.
- Header padding is symmetric (`12px 12px 4px 12px`); the bottom 8px is owned by the layout's `gap`, not by the header.

### Prohibitions
- No MUI `<AppBar>` here — the contract is a plain `<Box component="header">` to avoid pulling in MUI's elevation / position behaviour. (If you want elevation later, fix the morpheus `MuiAppBar` override and migrate; do not add an inline `<AppBar>` at the call site.)
- No more than one App Top Header on a page.
- No page-specific actions in the actions region — only **global, persistent, cross-page** affordances (notifications, settings, profile, help, etc.) are valid. Page-level actions belong in the [Page Header](../page-header/usage.md) below.
- No tabs, no breadcrumbs, no titles inside the App Top Header — those are page-level concerns.
- No fixed-pixel widths on the search field; only `maxWidth: 600px` so it adapts to viewport width.
- No hard-coded hex on the navy ground or white text — consume via theme tokens (`palette.neutral[800]`, `palette.text.primary` against the dark surface).
- No removing the search field on individual pages. If a page genuinely cannot search, leave the field present and `disabled`. Layout stability across pages is the contract.
- No swapping the avatar for an initials chip without the surrounding menu. Action icons are `lucide-react` size 20; the avatar is the only non-icon affordance in the actions region.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- The App Top Header is always paired with the [App Side Bar](../app-side-bar/usage.md) inside [App Layout](../../../page-templates/wizard-step/usage.md) compositions — they share the same dark navy ground and form a single visual unit.
- When the search field is focused, its background flips to opaque white and its text colour to `text.primary`; this is the contract for legibility, not a state to override.
- When a page is gated (Loading / unauthenticated), keep the header rendered as a chrome shell with `disabled` controls — never blank out the chrome.
- Keyboard `Enter` inside the search field submits to `/app/search?q=…` (or the workspace's equivalent route). The search button is a click affordance only — submission is via Enter.
- The avatar's menu is closed on outside click and on `Escape`. Menu items navigate via the workspace's router.

## 5. Variants

App Top Header is **single-shape**. There is one canonical layout — logo · search · fast actions group — and variation lives only inside the slots, not in the shell.

| Slot | Default | When it changes |
|---|---|---|
| Brand | Customer logo as text wordmark (the `CustomerAlationLogo` import in the prototype scaffolding) | Always tenant-branded — the brand slot exists to be replaced per customer. Treat the in-workspace asset as a placeholder; the canonical name in copy and documentation is "Logo", not "Alation". The logo is text-only — no decorative mark / square / icon next to the wordmark. |
| Search | TextField with placeholder "Search Alation" | Placeholder may be customised per surface ("Search agents", "Search data products") — keep ≤ 4 words |
| Actions | Fast actions button group: `Bell` (notifications) + `Settings` + profile `Avatar`. Icons are lucide-react size 20; avatar is size 32 and opens a menu. | Workspaces may add **global, persistent, cross-page** affordances (e.g. help, what's new, command palette) to the group. Per-page actions never belong here — they live in the Page Header. The avatar is always the right-most item. |

The header has no per-environment variants (admin / non-admin / etc). All users see the same shell; gating happens inside the menu items, not at the slot level.

## 6. Anatomy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo]            ┌────────────────────┐         [Bell] [Settings] [Avatar] │   ← App Top Header (navy)
│                    │ Search Alation     │                                    │
│                    └────────────────────┘                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Brand region** — customer logo as a text wordmark, left-aligned; flex item, fixed natural width. **The brand is always customer-customisable** — never hard-code "Alation" as the visible word. In demos and templates use the literal word "Logo" as the placeholder. No decorative mark / square / glyph alongside the wordmark.
- **Search region** — `<Box>` with `flex: 1`, `maxWidth: 600px`; centred horizontally between Brand and Actions. Hosts a single filled TextField.
- **Actions region** — flex item with `display: flex; gap: 8px`; right-aligned; the fast actions button group. Default contents: notifications IconButton + Settings IconButton + Avatar. Workspaces may add other global affordances; the Avatar always sits right-most.

### Composed of

- [Box](../../foundations/layout/usage.md) — `component="header"`, the outer surface and three flex children
- TextField (filled variant; documented in [Basic Text Field](../../components/base/basic-text-field/usage.md) — but used here in `variant="filled"` mode specific to this chrome)
- [Icon Button](../../components/base/icon-button/usage.md) — Settings affordance
- Avatar — clickable user avatar (MUI primitive; no separate Alation reference)
- Menu / MenuItem / ListItemIcon / Divider — avatar's dropdown
- [Iconography](../../foundations/iconography/usage.md) — `Bell`, `Settings`, `User`, `LogOut`, `Search` lucide-react icons

## 7. Custom

### Search field shape on the navy ground

The search TextField has two visual modes — blurred and focused — that flip on focus. This is part of the chrome's contract:

- **Blurred:** translucent white background (`rgba(255, 255, 255, 0.15)`), white text, white-translucent placeholder
- **Focused:** opaque white background, `text.primary` text, dark-translucent placeholder, slightly darker border

Use `onFocus` / `onBlur` to swap the styles. The contract here is *legibility against navy* — do not invent a third "hover" state, and do not skip the focus flip.

### Actions are global, not per-page

The actions region hosts the fast actions button group — global, persistent, cross-page affordances only (notifications, settings, profile, optionally help / what's new / command palette). Per-page actions never belong here — they belong on the [Page Header](../page-header/usage.md) inside the white main area. Adding page-specific actions to the chrome breaks layout stability across pages.

### Layout pairing

App Top Header always renders inside the AlationLayout shell, which expects exactly one App Top Header above the row of `App Side Bar | (Sub Navigation) | <main>`. The shell owns vertical rhythm; the header owns its own horizontal padding only.

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

- **Search placeholder** — "Search Alation" (default), "Search agents" (Agent Studio), "Search data products" (Marketplace)
- **Avatar menu** — "My Profile" / "Profile Settings" / "Logout" (with a divider before Logout)
- **Settings icon target** — `/app/settings`

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Search placeholder | "Search …" + scope; sentence case; ≤ 4 words | "Search Alation" · "Search agents" |
| Avatar menu items | Sentence case verb / noun phrase | "My Profile" · "Logout" |
| Notifications icon `aria-label` | "Notifications" | — |
| Settings icon `aria-label` | "Settings" | — |
| Avatar `alt` | "User avatar" | — |

## 11. Example

```tsx
<Box component="header" sx={{ px: 1.5, py: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'neutral.800' }}>
  <CustomerAlationLogo />
  <Box sx={{ flex: 1, maxWidth: 600 }}>
    <TextField variant="filled" placeholder="Search Alation" fullWidth size="small" InputProps={{ disableUnderline: true }} />
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconButton aria-label="Notifications"><Bell size={20} /></IconButton>
    <IconButton aria-label="Settings"><Settings size={20} /></IconButton>
    <Avatar src="…" alt="User avatar" sx={{ width: 32, height: 32, cursor: 'pointer' }} />
  </Box>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — full header with focus-flip search, avatar menu, and the navy ground.
