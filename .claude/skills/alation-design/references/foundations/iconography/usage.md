---
name: iconography
title: Iconography
category: foundation
last_updated: 2026-04-29

description: >
  Two icon libraries coexist in every project — the Alation Custom Library (`@alation/icons-neo`) is primary, the Lucide Library (`lucide-react`) is the fallback. Always check Custom first; only reach for Lucide when the icon isn't there. Size is theme-driven by the container.
tags: [foundation, icons, iconography]

figma_url: "https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1"
code_reference: "@alation/icons-neo · lucide-react"
example_path: ./Example.tsx

mui_base: none
depends_on_tokens: []
depends_on_components: []
---

# Iconography

## 1. Classification

- **Type:** Foundation
- **MUI base:** `none`
- **Figma:** [Custom Library — NEO UI Icons](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1) (canonical source for `@alation/icons-neo`)
- **Code:** `@alation/icons-neo` (Custom Library, primary) · `lucide-react` (Lucide Library, fallback)

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation icon system. Two libraries — the **Custom Library** (`@alation/icons-neo`) is the primary source of truth and is always checked first; the **Lucide Library** (`lucide-react`) is the backfill for icons that the Custom Library does not yet ship.

## 3. How to use

<!-- Layering narrative for humans: two libraries, custom-first, lucide fallback, container drives size. No import statements, no code. -->

Iconography is organised around three rules: **Custom Library first**, **Lucide as backfill**, and **the container drives the size**.

- **Custom Library is primary.** Every project — production (`alation-ui`) and the `@repo/ui` prototype alike — must check `@alation/icons-neo` *first*. If the icon exists there, use it. The Custom Library is the brand-aligned set, mirrored 1:1 with the Figma NEO icon library, and is the only library reviewed by the design system team.
- **Lucide is the backfill.** When the Custom Library does not yet ship an icon you need, fall back to `lucide-react`. This is allowed but must be a deliberate "not in Custom" decision — not a default. Both libraries are stroke-based, both respect `currentColor`, and both render inside the same Alation containers, so visual cohesion holds across the boundary.
- **Two libraries, one visual contract.** Whichever library you draw from, the icon renders inside the same Alation containers (Button `startIcon`, IconButton, Chip `icon`, Alert severity), inherits colour from `currentColor`, and is sized by the container — not by a `size` prop on the icon.
- **Container drives size.** Every icon-hosting component in the Alation theme sizes its icon from `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`. Pick the right container / size, and the icon follows. Do not pass a `size` prop on the icon itself inside an Alation container.
- **Browse the catalogs.** Custom Library: the [Figma NEO icon library](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1), plus the export list in `@alation/icons-neo/src/index.ts`. Lucide Library: [lucide.dev/icons](https://lucide.dev/icons/).

If a needed icon is in **neither** library, stop and flag — do not reach for `@mui/icons-material`, emoji, or a hand-rolled SVG. Propose a new asset against the NEO icon library in Figma so the Custom Library grows over time.

### How to choose, in three steps

1. Open the Custom Library export list (`@alation/icons-neo/src/index.ts`) or the [Figma NEO icon library](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1). Search by intent (e.g. "edit", "trash", "search").
2. **Found in Custom?** Import from `@alation/icons-neo`. Done.
3. **Not in Custom?** Search [lucide.dev/icons](https://lucide.dev/icons/), import from `lucide-react`, and note the gap so it can be added to the Custom Library later.

## 4. Contract

<!-- All code here: package names, import shape, size tokens, prop names. Phrase G/P/C against the real API. -->

### Guarantees
- Every project ships icons from **two libraries**: the Custom Library (`@alation/icons-neo`, primary) and the Lucide Library (`lucide-react`, fallback). No third icon library is allowed.
- The Custom Library is checked first; Lucide is used only when the Custom Library does not yet ship the icon. This rule is identical in production (`alation-ui`) and in the `@repo/ui` prototype (vibe-design).
- Every icon in both libraries is exported by **PascalCase name**. Custom Library exports carry an `Icon` suffix (e.g. `PlusIcon`, `SearchIcon`, `TrashIcon`, `PencilIcon`, `EllipsisIcon`); Lucide exports do not (e.g. `Plus`, `Search`, `Trash2`, `SquarePen`, `EllipsisVertical`).
- Size is theme-driven: the container (IconButton, Button `startIcon`, Chip `icon`, Alert severity, sub-nav item) sets the icon size via `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`.
- Every icon is an SVG — scales cleanly at 200 % browser zoom and respects `currentColor`.

### Prohibitions
- Never import from `@mui/icons-material`.
- Never reach for Lucide without first confirming the icon does not exist in the Custom Library.
- Never render a raw SVG literal or a custom icon component inside page components.
- Never use emoji as an icon.
- Never hard-code an icon size inside an Alation container — the container's `size` prop governs it.
- Never hard-code an icon colour — icons inherit from parent via `currentColor`, or set an explicit theme token via the container's `color` prop.
- Nothing outside §5 Variants is valid.

### Conditions
- Decorative icons (visually reinforcing an adjacent label) must carry `aria-hidden="true"`.
- Icon-only affordances (e.g. `IconButton` without a label) require `aria-label` — owned by IconButton's own contract, not this foundation.
- Lucide icons accept an optional `size={16}` only when the icon is used outside an Alation container (e.g. a plain `<Box>` or inline in prose). Inside an Alation container, the container wins. Custom Library icons follow the same rule.
- If a needed icon is missing from **both** libraries, stop and flag — do not improvise.

## 5. Variants

<!-- Exhaustive. Libraries list + size conventions table. Nothing outside this list is valid. -->

### 5.1 Libraries — order of precedence

| Order | Library | npm package | Scope | When to use |
|---|---|---|---|---|
| **1 (always check first)** | Custom Library | [`@alation/icons-neo`](https://www.npmjs.com/package/@alation/icons-neo) | All projects (production + prototype). Every export is a MUI `SvgIcon`. | Default. Use whenever the icon exists here. |
| **2 (backfill)** | Lucide Library | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | All projects. Browse names at [lucide.dev/icons](https://lucide.dev/icons/). | Only when the Custom Library does not yet ship the icon. |

### 5.2 Size conventions

Size is theme-driven by the container. Do not pass `size={…}` on icons inside Alation containers — applies equally to Custom Library and Lucide Library icons. Morpheus sets `html { font-size: 62.5% }`, so 1rem = 10px and the rem values below resolve to the px values shown.

| Context | Theme token | Rendered size |
|---|---|---|
| `<IconButton size="xsmall">` | `typography.iconXSmall` | 1.2rem · 12px |
| `<IconButton size="small">`, `<Button size="small">` `startIcon` / `endIcon`, table cells, Chip `icon` | `typography.iconSmall` | 1.6rem · 16px |
| `<IconButton size="medium">`, `<Button size="medium">` `startIcon` / `endIcon` (default) | `typography.iconMedium` | 2rem · 20px |
| `<IconButton size="large">`, `<Button size="large">` `startIcon` / `endIcon`, Alert severity icon | `typography.iconLarge` | 2.4rem · 24px |
| SubNav (Wayfinder) item | (theme-baked) | 1.6rem · 16px |

### 5.3 Commonly used icons — Custom Library first

Not exhaustive. For Custom: see `@alation/icons-neo/src/index.ts` for the full export list (~229 icons). For Lucide: search [lucide.dev/icons](https://lucide.dev/icons/).

| Category | Custom Library (`@alation/icons-neo`) | Lucide Library (`lucide-react`) — when not in Custom |
|---|---|---|
| Action | `PlusIcon`, `CloseIcon`, `CheckIcon`, `TrashIcon`, `PencilIcon`, `CopyIcon`, `CloudUploadIcon`, `DownloadCircleIcon`, `UploadCircleIcon`, `ExternalLinkIcon`, `FilterIcon` | `SquarePen`, `RefreshCw`, `Play`, `Eye` |
| Navigation | `ChevronDownIcon`, `ChevronUpIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ArrowLeftIcon`, `ArrowRightIcon`, `ArrowUpIcon`, `ArrowDownIcon`, `CaretDownSmallIcon`, `CaretLeftIcon`, `CaretRightIcon`, `CaretUpSmallIcon` | `ArrowUpDown`, `CornerDownLeft`, `PanelLeftOpen`, `PanelLeftClose` |
| Menu & overflow | `EllipsisDownIcon` (note: `EllipsisIcon` has a known stroke/fill rendering bug — avoid until fixed) | `EllipsisVertical`, `Ellipsis` |
| Status & feedback | `InformationIcon`, `InformationFilledIcon`, `WarningOutlineIcon`, `WarningFilledIcon`, `HelpIcon`, `CheckCircleIcon`, `CheckCircleFilledIcon`, `CloseCircleIcon` | `CircleStop`, `ThumbsUp`, `ThumbsDown`, `OctagonAlert` |
| Communication | `SearchIcon`, `EmailIcon`, `AlternateEmailIcon`, `NotificationIcon`, `CommentOIcon` | `MessageSquare`, `MessagesSquare` |
| Content & objects | `DatabaseIcon`, `TableIcon`, `BookIcon`, `BookmarkIcon`, `ArticleIcon`, `CalendarIcon`, `InsertLinkIcon`, `ColumnsIcon`, `ColumnVerticalIcon` | `BookText`, `ClipboardList`, `ListChecks`, `ChartColumn`, `History`, `Link2`, `Link2Off` |
| Agent & workflow | `AgentIcon`, `FlowIcon`, `ToolIcon`, `WorkflowIcon`, `SettingsIcon`, `SettingsCogIcon`, `UserIcon` | `Bot`, `Bolt`, `Variable`, `Globe`, `Monitor`, `Settings2`, `Users` |

> The lists above are illustrative — the contract is the **precedence rule** in §5.1, not these tables. Always grep `@alation/icons-neo/src/index.ts` first; only fall back to Lucide for genuine gaps.

## 11. Example

```tsx
// Primary — Custom Library (always check first).
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from '@alation/icons-neo';
// Backfill — Lucide Library, only for icons not in the Custom Library.
import { PanelLeftClose, EllipsisVertical, Sparkles } from 'lucide-react';

import { Button, IconButton, TextField, InputAdornment } from '@mui/material';

// Custom Library — covers most actions.
<Button variant="contained" startIcon={<PlusIcon />}>Build agent</Button>
<Button variant="outlined" startIcon={<PencilIcon />}>Edit</Button>
<IconButton size="small" aria-label="Edit"><PencilIcon /></IconButton>
<TextField
  placeholder="Search"
  size="small"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon aria-hidden="true" />
      </InputAdornment>
    ),
  }}
/>
<IconButton size="small" color="error" aria-label="Delete"><TrashIcon /></IconButton>

// Lucide Library — only because these aren't in the Custom Library yet.
<IconButton size="small" aria-label="More actions"><EllipsisVertical /></IconButton>
<IconButton size="small" aria-label="Collapse panel"><PanelLeftClose /></IconButton>
<Button variant="text" startIcon={<Sparkles />}>Generate with AI</Button>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
