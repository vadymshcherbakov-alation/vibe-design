---
name: layout
title: Layout
category: foundation
last_updated: 2026-04-24

description: >
  Page-width discipline and the conventional Alation page shell. Breakpoints are MUI defaults; `AlationLayout` / `PageHeaderSection` live in the consumer project, not in the shared design-system packages.
tags: [foundation, layout, page-shell, responsive]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: "MUI defaults (breakpoints) · consumer-app / @repo/ui (AlationLayout, PageHeaderSection)"
example_path: ./Example.tsx

mui_base: breakpoints
depends_on_tokens: []
depends_on_components: []
---

# Layout

## 1. Classification

- **Type:** Foundation
- **MUI base:** `breakpoints` (MUI defaults — `fabric-theme-morpheus` does **not** override them)
- **Figma:** [Layout grid · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1)
- **Code:** MUI defaults (breakpoints) · consumer-app or `@repo/ui` (`AlationLayout`, `PageHeaderSection`)

## 2. Purpose

<!-- What this foundation governs and why it matters. Two sentences max. No code, no values. Page-sub is auto-filled from here. -->

The Alation page envelope. Governs the shell slots every screen renders inside and the width discipline that keeps long-form content readable.

## 3. How to use

<!-- Layering narrative for humans: shell slots, max-width intents, where the shell hands over control. No raw px, no prop names. -->

Every page renders inside the main area of the Alation shell. The outer chrome — sidebar, header, sub-nav — is handled for you; pages own only what sits inside the main area, starting with a page header and a padded body.

- **Page header** — always use the conventional header section for the title + action row. Do not build a bespoke header bar.
- **Form pages** — cap content to the narrower max-width so long labels and helper text stay comfortable.
- **Content-heavy pages** — cap to the wider max-width for prose, detail views, and configuration screens.
- **Full-bleed surfaces** — data tables and dashboards run at the main-area width with no max — but the page header above them still uses the standard section.

The main area owns scroll. Pages never nest their own scroll container, and never recreate the shell.

## 4. Contract

<!-- All code here: theme API paths, package paths, prop names. Phrase G/P/C against the real API. -->

### Guarantees
- `AlationLayout` provides the same slots on every page: `AppSidebar`, `AppHeader`, optional `SubNav`, and `<Box component="main">`.
- `<Box component="main">` owns `overflow: auto` on both axes.
- `PageHeaderSection` renders the bordered top header consistently across every page.
- Breakpoints follow MUI defaults (`xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, `xl: 1536`).

### Prohibitions
- Never author a full-page custom shell that bypasses `AlationLayout`.
- Never render raw HTML landmarks (`<body>`, `<html>`, `<main>`, `<header>`, `<footer>`) — use `<Box component="main">` etc. instead.
- Never hard-code a fixed-pixel content width. Use the max-width conventions below.
- Never nest a scroll container inside the main area.
- Never use `sx` styling on MUI UI components to fake a page shell — use the shell primitives.
- Nothing outside §5 Variants is valid for content widths.

### Conditions
- Structural `sx` (`display`, `flex`, `flexDirection`, `alignItems`, `justifyContent`, `gap`, `p`, `m`, `width`, `maxWidth`, `height`, `overflow`) is permitted only on `<Box>` / `<Stack>`, never on MUI UI components.
- Wizards (multi-step forms) follow the form-width rule.
- Dashboards with side-by-side panels still honour the content max-width for the text column unless the request is explicitly full-bleed.
- Modals and drawers are not pages — their sizing lives with the Dialog / Drawer composite.

## 5. Variants

<!-- Exhaustive. Nothing outside this list is valid. -->

### 5.1 Content widths

| Intent | Value |
|---|---|
| Form content | `maxWidth: 640` |
| Content-heavy page | `maxWidth: 960` |
| Full-bleed (data tables, dashboards) | no maxWidth — main area width only |

### 5.2 Page-body padding

| Intent | Value |
|---|---|
| Default body | `sx={{ p: 4 }}` (32 px) |

### 5.3 Breakpoints (MUI defaults via `breakpoints`)

| Key | Min-width |
|---|---|
| `xs` | 0 |
| `sm` | 600 |
| `md` | 900 |
| `lg` | 1200 |
| `xl` | 1536 |

### 5.4 Shell slots (provided by `AlationLayout`)

| Slot | Role |
|---|---|
| `AppSidebar` | Icon-only left rail |
| `AppHeader` | Dark top header |
| `SubNav` | Semi-transparent side panel (optional) |
| `<Box component="main">` | Scrollable main area — pages render inside this |

## 11. Example

```tsx
import { Box, Typography } from '@mui/material';
import { PageHeaderSection } from '../layout';

export default function SettingsPage() {
  return (
    <>
      <PageHeaderSection>
        <Typography variant="h1">Settings</Typography>
      </PageHeaderSection>
      <Box sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 640 }}>
          {/* form content */}
        </Box>
      </Box>
    </>
  );
}
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
