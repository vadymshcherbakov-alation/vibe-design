---
name: iconography
title: Iconography
category: foundation
last_updated: 2026-04-24

description: >
  Icon discipline. Production uses `@alation/icons-neo` (MUI `SvgIcon`); the `@repo/ui` prototype uses `lucide-react`. Size is theme-driven by the container, not the icon `size` prop.
tags: [foundation, icons, iconography]

figma_url: "https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2899-12&t=nzfgSH01EOC6MqS6-4"
code_reference: "@alation/icons-neo · lucide-react · src/layout/assets/icon/*.svg?react"
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
- **Code:** `@alation/icons-neo` · `lucide-react` · `src/layout/assets/icon/*.svg?react`

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation icon system. One library per project, one stroke weight, one size scale — so every icon across the app reads as one family and sits in its container at the right size without per-call-site tuning.

## 3. How to use

<!-- Layering narrative for humans: two libraries, container drives size, fallback. No import statements, no code. -->

Iconography is organised around two rules: **one library per project**, and **the container drives the size**.

- **Two libraries, one visual contract.** Production (`alation-ui`) uses `@alation/icons-neo`; the `@repo/ui` prototype uses `lucide-react`. Both are stroke-based, both respect `currentColor`, and both render inside the same Alation containers (Button `startIcon`, IconButton, Chip `icon`, Alert severity). Pick the library that matches the project and stay inside it.
- **Nav rail is its own thing.** The left rail uses local SVG assets; callers never import those directly — `NavButton` handles it.
- **Container drives size.** Every icon-hosting component in the Alation theme sizes its icon from `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`. Pick the right container / size, and the icon follows. Do not pass a `size` prop on the icon itself inside an Alation container.
- **Browse the catalog.** Search [lucide.dev/icons](https://lucide.dev/icons/) by name or category; the Figma mirror lives on the NEO — UI Icons page linked in Classification.

If a needed icon does not exist in the project's library, stop and flag — do not reach for `@mui/icons-material`, emoji, or a hand-rolled SVG. Propose a new asset against the NEO icon library in Figma.

## 4. Contract

<!-- All code here: package names, import shape, size tokens, prop names. Phrase G/P/C against the real API. -->

### Guarantees
- Every app ships icons from a single library — `@alation/icons-neo` in production, `lucide-react` in the `@repo/ui` prototype — so visual weight and stroke style stay consistent.
- Every icon in both libraries is exported by **PascalCase name**. Icons from `@alation/icons-neo` carry an `Icon` suffix (e.g. `PlusIcon`, `SearchIcon`); lucide exports do not (e.g. `Plus`, `Search`).
- Size is theme-driven: the container (IconButton, Button `startIcon`, Chip `icon`, Alert severity, sub-nav item) sets the icon size via `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`.
- Every icon is an SVG — scales cleanly at 200 % browser zoom and respects `currentColor`.

### Prohibitions
- Never import from `@mui/icons-material`.
- Never render a raw SVG literal or a custom icon component inside page components.
- Never use emoji as an icon.
- Never use an SVG from `src/layout/assets/icon/` outside the nav rail.
- Never hard-code an icon size inside an Alation container — the container's `size` prop governs it.
- Never hard-code an icon colour — icons inherit from parent via `currentColor`, or set an explicit theme token via the container's `color` prop.
- Nothing outside §5 Variants is valid.

### Conditions
- Decorative icons (visually reinforcing an adjacent label) must carry `aria-hidden="true"`.
- Icon-only affordances (e.g. `IconButton` without a label) require `aria-label` — owned by IconButton's own contract, not this foundation.
- Lucide icons accept an optional `size={16}` only when the icon is used outside an Alation container (e.g. a plain `<Box>` or inline in prose). Inside an Alation container, the container wins.
- If a needed icon does not exist in `@alation/icons-neo` (production) or `lucide-react` (prototype), stop and flag.

## 5. Variants

<!-- Exhaustive. Libraries list + size conventions table. Nothing outside this list is valid. -->

### 5.1 Libraries

| Library | npm package | Scope |
|---|---|---|
| `@alation/icons-neo` | [`@alation/icons-neo`](https://www.npmjs.com/package/@alation/icons-neo) | All in-page UI icons in **production** (`alation-ui`). Every export is a MUI `SvgIcon`. |
| `lucide-react` | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | All in-page UI icons in the **`@repo/ui`** prototype. Browse names at [lucide.dev/icons](https://lucide.dev/icons/). |
| Alation nav-rail SVGs | — | Local assets under `src/layout/assets/icon/*.svg?react`. Navigation rail **only** — never page content. |

### 5.2 Size conventions

Size is theme-driven by the container. Do not pass `size={…}` on icons inside Alation containers.

| Context | Theme token | Rendered size |
|---|---|---|
| `<IconButton size="xsmall">` | `typography.iconXSmall` | 1.2rem |
| `<IconButton size="small">`, `<Button size="small">` `startIcon` / `endIcon`, table cells, Chip `icon` | `typography.iconSmall` | 1.6rem |
| `<IconButton size="medium">`, `<Button size="medium">` `startIcon` / `endIcon` (default) | `typography.iconMedium` | 2rem |
| `<IconButton size="large">`, `<Button size="large">` `startIcon` / `endIcon`, Alert severity icon | `typography.iconLarge` | 2.4rem |
| SubNav item | (theme-baked) | 1.6rem |
| Nav rail | (via `NavButton`) | 2rem |

### 5.3 Commonly used lucide icons

Not exhaustive — search [lucide.dev/icons](https://lucide.dev/icons/) for anything else, then import by its PascalCase name.

| Category | Names |
|---|---|
| Action | `Plus`, `X`, `Check`, `Trash`, `Trash2`, `SquarePen`, `Pencil`, `Copy`, `Download`, `Upload`, `ExternalLink`, `RefreshCw`, `Play`, `Eye` |
| Navigation | `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `ArrowUpDown`, `CornerDownLeft`, `PanelLeftOpen`, `PanelLeftClose` |
| Menu & overflow | `MoreVertical`, `EllipsisVertical`, `Ellipsis` |
| Status & feedback | `Info`, `AlertTriangle`, `TriangleAlert`, `OctagonAlert`, `HelpCircle`, `CircleStop`, `ThumbsUp`, `ThumbsDown` |
| Communication | `Search`, `MessageSquare`, `MessagesSquare`, `Mail`, `Bell` |
| Content & objects | `Database`, `Table`, `BookOpen`, `BookText`, `Bookmark`, `ClipboardList`, `ListChecks`, `ChartColumn`, `FileText`, `Calendar`, `History`, `Link`, `Link2`, `Link2Off` |
| Agent & workflow | `Bot`, `Bolt`, `Workflow`, `Variable`, `Globe`, `Monitor`, `Settings`, `Settings2`, `Users` |

## 11. Example

```tsx
// Production
import { PlusIcon, MoreVerticalIcon, SearchIcon } from '@alation/icons-neo';
import { Button, IconButton, TextField, InputAdornment } from '@mui/material';

<Button variant="contained" startIcon={<PlusIcon />}>Build agent</Button>
<IconButton size="small" aria-label="More actions"><MoreVerticalIcon /></IconButton>

// Prototype (@repo/ui) — same shape, lucide-react
import { Plus, MoreVertical } from 'lucide-react';

<Button variant="contained" startIcon={<Plus />}>Build agent</Button>
<IconButton size="small" aria-label="More actions"><MoreVertical /></IconButton>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
