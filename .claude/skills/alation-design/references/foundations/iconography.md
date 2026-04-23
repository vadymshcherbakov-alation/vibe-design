---
name: iconography
title: Iconography
category: foundation
last_updated: 2026-04-23

description: >
  Icon discipline. Production Alation UI uses `@alation/icons-neo` as the
  primary library, rendered through MUI `SvgIcon`. The `vibe-design` prototype
  uses `lucide-react` for the same slots. Size comes from the container (via
  theme `iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`) — not from
  the icon `size` prop. Alation SVG assets are reserved for the navigation
  rail.
tags: [foundation, icons, iconography]

figma_url: "https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4"
code_reference: "@alation/icons-neo (production, wrapped in MUI SvgIcon) · lucide-react (vibe-design prototype) · src/layout/assets/icon/*.svg?react (nav-rail assets)"
example_path: ./Example.tsx

mui_base: none
depends_on_tokens: []
depends_on_components: []
---

# Iconography

## 1. Classification

- **Type:** Foundation
- **MUI base:** `none`
- **Figma:** [Iconography · NEO 2.1](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4) · [Icon library](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2452-565&t=nzfgSH01EOC6MqS6-1)
- **Code:** `@alation/icons-neo` (production, every icon is a MUI `SvgIcon`); `lucide-react` for the `vibe-design` prototype; `src/layout/assets/icon/*.svg?react` (consumer project) for nav-rail assets

## 2. Purpose

Icons are visual shortcuts — they reinforce a label, disambiguate an action, or stand in for one when space is tight. Every icon in Alation UI shares the same stroke weight and size so they read as one family across the app. Reach for an icon when an action, category, or status has a widely understood visual; pick it from the library that matches the project (`@alation/icons-neo` in production, `lucide-react` in the vibe-design prototype) and let the container drive the size.

## 3. How to use

**Two libraries, one API shape.**

- **Production** (`alation-ui`) uses [`@alation/icons-neo`](https://www.npmjs.com/package/@alation/icons-neo). Every icon is exported as a MUI `SvgIcon` component; callers import by PascalCase name and render it inside a container (`<Button startIcon={…}>`, `<IconButton>`, `<Chip icon={…}>`, `<Alert>` severity icon mapping, etc.). The container governs the icon's size via the Alation theme (`typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`).
- **Prototype** (`vibe-design`) uses [`lucide-react`](https://www.npmjs.com/package/lucide-react) for the same slots. The visual contract is identical — stroke-based SVG, inherits `currentColor`, rendered inside the same MUI containers.
- **Nav rail only** — local SVG assets under `src/layout/assets/icon/*.svg?react` (handled by `NavButton`; callers never import those directly).

### Browse the catalog

The full set lives at [**lucide.dev/icons**](https://lucide.dev/icons/) — browse by name, category, or search. The Figma mirror is [NEO — UI Icons](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4) (see Classification for the icon-library sub-page).

### Import from code

Both libraries export each icon under its **PascalCase name**.

```tsx
// Production
import { PlusIcon, SearchIcon, MoreVerticalIcon, Trash2Icon } from '@alation/icons-neo';

<Button startIcon={<PlusIcon />}>Build agent</Button>

// Prototype (vibe-design)
import { Plus, Search, MoreVertical, Trash2 } from 'lucide-react';

<Button startIcon={<Plus />}>Build agent</Button>
```

Rename at import time to disambiguate or match a local convention:

```tsx
import { SettingsIcon as Settings, UploadIcon as Upload } from '@alation/icons-neo';
```

Icons are stroke-based and respect `currentColor`. Sub-nav items pass `iconStyle: 'stroke'` in their config.

### Size comes from the container, not the icon

Every icon container in the Alation theme sets the icon size via `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`. Do **not** pass a `size` prop on the icon itself; let the container govern it.

| Container | Icon size (via theme) |
|---|---|
| `<IconButton size="xsmall">` | `iconXSmall` (1.2rem) |
| `<IconButton size="small">`, `<Button size="small">` `startIcon` / `endIcon`, table cells | `iconSmall` (1.6rem) |
| `<IconButton size="medium">`, `<Button size="medium">` `startIcon` / `endIcon` (default) | `iconMedium` (2rem) |
| `<IconButton size="large">`, `<Button size="large">` `startIcon` / `endIcon` | `iconLarge` (2.4rem) |
| SubNav item | 1.6rem (theme-baked) |
| Nav rail | 2rem (handled by `NavButton`, not authored at call sites) |

In the vibe-design prototype, lucide icons accept an optional `size={16}` when the icon is used outside an Alation container (a plain `<Box>`, a raw icon rendered inline). Inside an Alation container, the container wins.

### Fallback

If the icon you need isn't in `@alation/icons-neo` (or `lucide-react` for prototypes) — **stop and flag**. Do not reach for `@mui/icons-material` or hand-roll an SVG. Propose a new asset against the NEO icon library in Figma instead.

## 4. Contract

### Guarantees
- Every app ships icons from a single library — `@alation/icons-neo` in production, `lucide-react` in the vibe-design prototype — so visual weight and stroke style stay consistent.
- Size is theme-driven: the container (IconButton, Button `startIcon`, Chip `icon`, Alert severity mapping, sub-nav item) sets the icon size via `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`.
- Every icon is an SVG — scales cleanly at 200 % browser zoom and respects `currentColor` for state changes.

### Prohibitions
- No `@mui/icons-material` imports anywhere.
- No raw SVG literals or custom icon components inside page components.
- No emoji as an icon.
- No SVG from `src/layout/assets/icon/` used outside the nav rail.
- No hard-coded icon sizes inside an Alation container. The container's `size` governs the icon.
- No hard-coded icon colours — icons inherit from parent via `currentColor`, or use an explicit theme token via `color` prop.

### Conditions
- Decorative icons (visually reinforcing an adjacent label) carry `aria-hidden="true"`.
- Icon-only affordances (e.g. `IconButton` without a label) must provide `aria-label` (owned by IconButton, not this foundation).
- If a needed icon does not exist in `@alation/icons-neo` (production) or `lucide-react` (prototype), stop and flag — do not reach for `@mui/icons-material` as a substitute.

## 5. Inventory

### Libraries (exhaustive)

| Library | npm package | Scope |
|---|---|---|
| `@alation/icons-neo` | [`@alation/icons-neo`](https://www.npmjs.com/package/@alation/icons-neo) | All in-page UI icons in **production** (`alation-ui`). Every export is a MUI `SvgIcon`. |
| `lucide-react` | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | All in-page UI icons in the **vibe-design** prototype. Browse names at [lucide.dev/icons](https://lucide.dev/icons/). |
| Alation nav-rail SVGs | — | Local assets under `src/layout/assets/icon/*.svg?react`. Navigation rail **only** — never page content. |

### Commonly used lucide icons

These are the icons that appear most often across Alation UI. The list is not exhaustive — search [lucide.dev/icons](https://lucide.dev/icons/) for anything else, then import it by its PascalCase name.

| Category | Names |
|---|---|
| Action | `Plus`, `X`, `Check`, `Trash`, `Trash2`, `SquarePen`, `Pencil`, `Copy`, `Download`, `Upload`, `ExternalLink`, `RefreshCw`, `Play`, `Eye` |
| Navigation | `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `ArrowUpDown`, `CornerDownLeft`, `PanelLeftOpen`, `PanelLeftClose` |
| Menu & overflow | `MoreVertical`, `EllipsisVertical`, `Ellipsis` |
| Status & feedback | `Info`, `AlertTriangle`, `TriangleAlert`, `OctagonAlert`, `HelpCircle`, `CircleStop`, `ThumbsUp`, `ThumbsDown` |
| Communication | `Search`, `MessageSquare`, `MessagesSquare`, `Mail`, `Bell` |
| Content & objects | `Database`, `Table`, `BookOpen`, `BookText`, `Bookmark`, `ClipboardList`, `ListChecks`, `ChartColumn`, `FileText`, `Calendar`, `History`, `Link`, `Link2`, `Link2Off` |
| Agent & workflow | `Bot`, `Bolt`, `Workflow`, `Variable`, `Globe`, `Monitor`, `Settings`, `Settings2`, `Users` |

### Size conventions (exhaustive)

Size is theme-driven by the container. Do not pass `size={…}` on icons inside Alation containers.

| Context | Theme token | Rendered size |
|---|---|---|
| `<IconButton size="xsmall">` | `typography.iconXSmall` | 1.2rem |
| `<IconButton size="small">`, `<Button size="small">` `startIcon` / `endIcon`, table cells, Chip `icon` | `typography.iconSmall` | 1.6rem |
| `<IconButton size="medium">`, `<Button size="medium">` `startIcon` / `endIcon` (default) | `typography.iconMedium` | 2rem |
| `<IconButton size="large">`, `<Button size="large">` `startIcon` / `endIcon`, Alert severity icon | `typography.iconLarge` | 2.4rem |
| SubNav item | (theme-baked) | 1.6rem |
| Nav rail | (via `NavButton`) | 2rem |

## 11. Example

```tsx
// Production
import { PlusIcon, MoreVerticalIcon, SearchIcon } from '@alation/icons-neo';
import { Button, IconButton, TextField, InputAdornment } from '@mui/material';

<Button variant="contained" startIcon={<PlusIcon />}>
  Build agent
</Button>

<IconButton size="small" aria-label="More actions">
  <MoreVerticalIcon />
</IconButton>

<TextField
  placeholder="Search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
  }}
/>

// Prototype (vibe-design) — same shape, lucide-react
import { Plus, MoreVertical, Search } from 'lucide-react';

<Button variant="contained" startIcon={<Plus />}>Build agent</Button>
<IconButton size="small" aria-label="More actions"><MoreVertical /></IconButton>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
