---
name: iconography
title: Iconography
category: foundation
last_updated: 2026-04-21

description: >
  Icon discipline. `lucide-react` is the primary icon library. Alation SVG
  assets are reserved for the navigation rail. Sizes are fixed per context
  (16 for inline; 20 for nav rail).
tags: [foundation, icons, iconography]

figma_url: "https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4"
code_reference: Consumer project — lucide-react (npm) + src/layout/assets/icon/ (nav-rail SVGs)
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
- **Code:** `lucide-react` (npm) for UI icons; `src/layout/assets/icon/*.svg?react` (consumer project) for nav-rail assets

## 2. Purpose

Icons are visual shortcuts — they reinforce a label, disambiguate an action, or stand in for one when space is tight. Every icon in Alation UI shares the same stroke weight and size so they read as one family across the app. Reach for an icon when an action, category, or status has a widely understood visual; pick it from `lucide-react` at the size that matches its context.

## 3. How to use

**The icon library is [`lucide-react`](https://www.npmjs.com/package/lucide-react).** Every in-page UI icon comes from it. The only exception is the navigation rail, which uses local SVG assets under `src/layout/assets/icon/*.svg?react` (handled by `NavButton` — callers never import those directly).

### Browse the catalog

The full set lives at [**lucide.dev/icons**](https://lucide.dev/icons/) — browse by name, category, or search. The Figma mirror is [NEO — UI Icons](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4) (see Classification for the icon-library sub-page).

### Import from code

Every icon exports under its **PascalCase name** (`Plus`, `MoreVertical`, `ChevronDown`). Lucide also re-exports each icon with an `Icon` suffix (`PlusIcon`, `MoreVerticalIcon`) — both forms resolve to the same component. Prefer the un-suffixed name unless the suffix avoids a name collision with a local symbol.

```tsx
import { Plus, Search, MoreVertical, Trash2 } from 'lucide-react';

<Plus size={16} />
```

Rename at import time to disambiguate or match a local convention:

```tsx
import { Settings as SettingsIcon, Upload as UploadIcon } from 'lucide-react';
```

Icons are stroke-based and respect `currentColor`. Sub-nav items pass `iconStyle: 'stroke'` in their config.

### Size per context

- **Button `startIcon` / `endIcon`** — `size={16}`
- **Standalone `IconButton`** — `size={16}`
- **SubNav item** — `width={16} height={16}`
- **Nav rail** — `width={20} height={20}` (handled by `NavButton`, not authored at call sites)

### Fallback

If the icon you need isn't in lucide — **stop and flag**. Do not reach for `@mui/icons-material` or hand-roll an SVG. Propose a new asset against the NEO icon library in Figma instead.

## 4. Contract

### Guarantees
- All UI icons ship from a single library (`lucide-react`) — visual weight and stroke style stay consistent across the app.
- Size conventions align icons with adjacent text and control height — 16 px pairs with body-size text and 36 px controls.
- Every icon is an SVG — scales cleanly at 200 % browser zoom and respects `currentColor` for state changes.

### Prohibitions
- No `@mui/icons-material` imports anywhere.
- No raw SVG literals or custom icon components inside page components.
- No emoji as an icon.
- No SVG from `src/layout/assets/icon/` used outside the nav rail.
- No arbitrary icon sizes. Only the values in §5 are valid.
- No hard-coded icon colours — icons inherit from parent via `currentColor`, or use an explicit theme token via `color` prop.

### Conditions
- Decorative icons (visually reinforcing an adjacent label) carry `aria-hidden="true"`.
- Icon-only affordances (e.g. `IconButton` without a label) must provide `aria-label` (owned by IconButton, not this foundation).
- If a needed icon does not exist in `lucide-react`, stop and flag — do not reach for `@mui/icons-material` as a substitute.

## 5. Inventory

### Libraries (exhaustive)

| Library | npm package | Scope |
|---|---|---|
| `lucide-react` | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | All in-page UI icons. Browse names at [lucide.dev/icons](https://lucide.dev/icons/). |
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

| Context | Size |
|---|---|
| Button `startIcon` / `endIcon` | `size={16}` |
| Standalone `IconButton` | `size={16}` |
| SubNav item | `width={16} height={16}` |
| Nav rail | `width={20} height={20}` (via `NavButton`) |

## 11. Example

```tsx
import { Plus, MoreVertical, Search } from 'lucide-react';
import { Button, IconButton, TextField, InputAdornment } from '@mui/material';

<Button variant="contained" startIcon={<Plus size={16} />}>
  Build agent
</Button>

<IconButton size="small" aria-label="More actions">
  <MoreVertical size={16} />
</IconButton>

<TextField
  placeholder="Search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Search size={16} />
      </InputAdornment>
    ),
  }}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
