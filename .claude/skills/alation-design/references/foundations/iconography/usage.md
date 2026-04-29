---
name: iconography
title: Iconography
category: foundation
last_updated: 2026-04-29

description: >
  Two icon libraries coexist in every project — the Lucide Library (`lucide-react`) is primary and is always checked first; the Alation Custom Library (`@alation/icons-neo`) is the backfill for cases where Lucide does not have a fitting icon. Size is theme-driven by the container.
tags: [foundation, icons, iconography]

figma_url: "https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1"
code_reference: "lucide-react · @alation/icons-neo"
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
- **Code:** `lucide-react` (Lucide Library, primary) · `@alation/icons-neo` (Custom Library, backfill)

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation icon system. Two libraries — the **Lucide Library** (`lucide-react`) is the primary source and is always checked first; the **Custom Library** (`@alation/icons-neo`) is the backfill, used when Lucide does not have a suitable icon for the intent.

## 3. How to use

<!-- Layering narrative for humans: two libraries, lucide-first, custom fallback, container drives size. No import statements, no code. -->

Iconography is organised around three rules: **Lucide Library first**, **Custom Library as backfill**, and **the container drives the size**.

- **Lucide is primary.** Every project — production (`alation-ui`) and the `@repo/ui` prototype alike — checks `lucide-react` *first*. Lucide is the broad, fast-moving open-source set; it covers most everyday intents and gives engineers the largest possible vocabulary to find what they need quickly.
- **Custom Library is the backfill.** When Lucide does not have a suitable icon — typically Alation-specific concepts (Agent, Flow, Workflow, Catalog Set, BI View, CDE, Lexicon-style entities, brand marks) — fall back to `@alation/icons-neo`. The Custom Library is brand-aligned, mirrored 1:1 with the Figma NEO icon library, and is the only library reviewed by the design system team for those Alation-specific concepts.
- **Two libraries, one visual contract.** Whichever library you draw from, the icon renders inside the same Alation containers (Button `startIcon`, IconButton, Chip `icon`, Alert severity), inherits colour from `currentColor`, and is sized by the container — not by a `size` prop on the icon.
- **Container drives size.** Every icon-hosting component in the Alation theme sizes its icon from `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`. Pick the right container / size, and the icon follows. Do not pass a `size` prop on the icon itself inside an Alation container.
- **Browse the catalogs.** Lucide Library: [lucide.dev/icons](https://lucide.dev/icons/). Custom Library: the [Figma NEO icon library](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1), plus the export list in `@alation/icons-neo/src/index.ts`.

If a needed icon is in **neither** library, stop and flag — do not reach for `@mui/icons-material`, emoji, or a hand-rolled SVG. Propose a new asset against the NEO icon library in Figma so the Custom Library grows over time.

### How to choose, in three steps

1. Search [lucide.dev/icons](https://lucide.dev/icons/) by intent (e.g. "edit", "trash", "search").
2. **Found in Lucide?** Import from `lucide-react`. Done.
3. **Not in Lucide?** Open the Custom Library export list (`@alation/icons-neo/src/index.ts`) or the [Figma NEO icon library](https://www.figma.com/design/gzsftXhK5hKlTaZOsip1hy/NEO---UI-Icons?node-id=2032-768&t=ReyfN2LWJiqbcriS-1). If the icon is there (typically Alation-specific concepts), import from `@alation/icons-neo`. If not, stop and flag.

## 4. Contract

<!-- All code here: package names, import shape, size tokens, prop names. Phrase G/P/C against the real API. -->

### Guarantees
- Every project ships icons from **two libraries**: the Lucide Library (`lucide-react`, primary) and the Custom Library (`@alation/icons-neo`, backfill). No third icon library is allowed.
- Lucide is checked first; the Custom Library is used only when Lucide does not have a suitable icon (typically Alation-specific concepts). This rule is identical in production (`alation-ui`) and in the `@repo/ui` prototype (vibe-design).
- Every icon in both libraries is exported by **PascalCase name**. Lucide exports do not carry a suffix (e.g. `Plus`, `Search`, `Trash2`, `SquarePen`, `EllipsisVertical`); Custom Library exports carry an `Icon` suffix (e.g. `AgentIcon`, `FlowIcon`, `WorkflowIcon`, `DatabaseIcon`).
- Size is theme-driven: the container (IconButton, Button `startIcon`, Chip `icon`, Alert severity, sub-nav item) sets the icon size via `typography.iconXSmall` / `iconSmall` / `iconMedium` / `iconLarge`.
- Every icon is an SVG — scales cleanly at 200 % browser zoom and respects `currentColor`.

### Prohibitions
- Never import from `@mui/icons-material`.
- Never reach for the Custom Library without first confirming Lucide does not have a suitable icon for the intent.
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
| **1 (always check first)** | Lucide Library | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | All projects (production + prototype). Browse names at [lucide.dev/icons](https://lucide.dev/icons/). | Default. Use whenever Lucide has a fitting icon for the intent. |
| **2 (backfill)** | Custom Library | [`@alation/icons-neo`](https://www.npmjs.com/package/@alation/icons-neo) | All projects. Every export is a MUI `SvgIcon`. | Only when Lucide does not have a suitable icon — typically for Alation-specific concepts (Agent, Flow, Workflow, BI View, CDE, brand marks). |

### 5.2 Size conventions

Size is theme-driven by the container. Do not pass `size={…}` on icons inside Alation containers — applies equally to Lucide Library and Custom Library icons. Morpheus sets `html { font-size: 62.5% }`, so 1rem = 10px and the rem values below resolve to the px values shown.

| Context | Theme token | Rendered size |
|---|---|---|
| `<IconButton size="xsmall">` | `typography.iconXSmall` | 1.2rem · 12px |
| `<IconButton size="small">`, `<Button size="small">` `startIcon` / `endIcon`, table cells, Chip `icon` | `typography.iconSmall` | 1.6rem · 16px |
| `<IconButton size="medium">`, `<Button size="medium">` `startIcon` / `endIcon` (default) | `typography.iconMedium` | 2rem · 20px |
| `<IconButton size="large">`, `<Button size="large">` `startIcon` / `endIcon`, Alert severity icon | `typography.iconLarge` | 2.4rem · 24px |
| SubNav (Wayfinder) item | (theme-baked) | 1.6rem · 16px |

### 5.3 Commonly used icons — Lucide first

Not exhaustive. For Lucide: search [lucide.dev/icons](https://lucide.dev/icons/). For Custom: see `@alation/icons-neo/src/index.ts` for the full export list (~229 icons).

| Category | Lucide Library (`lucide-react`) — primary | Custom Library (`@alation/icons-neo`) — backfill (Alation-specific) |
|---|---|---|
| Action | `Plus`, `X`, `Check`, `Trash2`, `SquarePen`, `Pencil`, `Copy`, `Download`, `Upload`, `ExternalLink`, `RefreshCw`, `Play`, `Eye`, `Filter` | — |
| Navigation | `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `ArrowUpDown`, `CornerDownLeft`, `PanelLeftOpen`, `PanelLeftClose` | — |
| Menu & overflow | `EllipsisVertical`, `Ellipsis` | — (note: `EllipsisIcon` in the Custom Library has a known stroke/fill rendering bug — avoid until fixed) |
| Status & feedback | `Info`, `TriangleAlert`, `OctagonAlert`, `CircleHelp`, `CircleStop`, `ThumbsUp`, `ThumbsDown` | — |
| Communication | `Search`, `MessageSquare`, `MessagesSquare`, `Mail`, `Bell` | — |
| Content & objects | `Database`, `Table`, `BookOpen`, `BookText`, `Bookmark`, `ClipboardList`, `ListChecks`, `ChartColumn`, `FileText`, `Calendar`, `History`, `Link`, `Link2`, `Link2Off` | — |
| Agent & workflow (Alation-specific) | `Bot`, `Bolt`, `Globe`, `Monitor`, `Settings`, `Settings2`, `Users`, `Variable`, `Sparkles` | `AgentIcon`, `FlowIcon`, `ToolIcon`, `WorkflowIcon`, `AiFlowIcon`, `AiToolIcon`, `BiFieldIcon`, `BiViewIcon`, `CdeIcon`, `CatalogSetIcon`, `AlationLogo`, `AlationMetricIcon`, `BedrockLogoIcon` |

> The lists above are illustrative — the contract is the **precedence rule** in §5.1, not these tables. Always search Lucide first; only fall back to the Custom Library for icons Lucide does not ship (typically Alation-specific concepts).

## 11. Example

```tsx
// Primary — Lucide Library (always check first).
import { Plus, Search, Pencil, Trash2, EllipsisVertical, Sparkles } from 'lucide-react';
// Backfill — Custom Library, only for icons (typically Alation-specific) not in Lucide.
import { AgentIcon, FlowIcon, CdeIcon } from '@alation/icons-neo';

import { Button, IconButton, TextField, InputAdornment } from '@mui/material';

// Lucide Library — covers most everyday intents.
<Button variant="contained" startIcon={<Plus />}>Build agent</Button>
<Button variant="outlined" startIcon={<Pencil />}>Edit</Button>
<IconButton size="small" aria-label="Edit"><Pencil /></IconButton>
<TextField
  placeholder="Search"
  size="small"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Search aria-hidden="true" />
      </InputAdornment>
    ),
  }}
/>
<IconButton size="small" color="error" aria-label="Delete"><Trash2 /></IconButton>
<IconButton size="small" aria-label="More actions"><EllipsisVertical /></IconButton>
<Button variant="text" startIcon={<Sparkles />}>Generate with AI</Button>

// Custom Library — only because these are Alation-specific concepts not in Lucide.
<Button variant="contained" startIcon={<AgentIcon />}>Open Agent</Button>
<IconButton size="small" aria-label="Open flow"><FlowIcon /></IconButton>
<IconButton size="small" aria-label="Open CD Manager"><CdeIcon /></IconButton>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
