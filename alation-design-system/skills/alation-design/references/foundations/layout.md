---
name: layout
title: Layout
category: foundation
last_updated: 2026-04-21

description: >
  The Alation page shell and content widths. Every page renders inside the
  `AlationLayout` main area; widths, page padding, and responsive rules
  all come from this foundation.
tags: [foundation, layout, page-shell, responsive]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1"
code_reference: fabric-theme-morpheus/src/lib (breakpoints) + consumer project src/layout/
example_path: ./Example.tsx

mui_base: breakpoints
depends_on_tokens: []
depends_on_components: []
---

# Layout

## 1. Classification

- **Type:** Foundation
- **MUI base:** `breakpoints`
- **Figma:** [Layout grid · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2973-6706&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `fabric-theme-morpheus` — breakpoint + layout primitives in `src/lib/`; page shell in consumer project `src/layout/`

## 2. Purpose

Layout is the envelope every Alation screen renders inside — the sidebar, the header, the main area, and the width discipline that keeps content readable. It tells a page where it lives, how wide it can go, and where the shell hands over control. Reach for a layout value when deciding page padding, content max-width, or responsive behaviour — never to rebuild the shell itself.

## 3. How to use

Every page renders inside the white `<Box component="main">` provided by `AlationLayout`. The outer shell (sidebar, header, sub-nav) is handled — pages own only what's inside the main area.

```
AlationLayout (dark shell, handled by template)
  AppSidebar         — icon-only left rail
  AppHeader          — dark header
  SubNav             — semi-transparent side panel
  <Box component="main">          ← your page renders here
    <PageHeaderSection>           ← bordered top header
    <Box sx={{ p: 4 }}>           ← page body
```

- **Page header** — use `<PageHeaderSection>` for title + action row; do not build a bespoke header bar.
- **Page body padding** — `<Box sx={{ p: 4 }}>` (32 px) inside the main area.
- **Max-width for forms** — `maxWidth: 640`.
- **Max-width for content-heavy pages** — `maxWidth: 960`.
- **Scroll** — the main area handles `overflow: auto` on both axes. Pages must not add their own scroll container.
- **`Box` layout exception** — structural `sx` (`display`, `flex`, `flexDirection`, `alignItems`, `justifyContent`, `gap`, `p`, `m`, `width`, `maxWidth`, `height`, `overflow`) is permitted only on `<Box>` / `<Stack>`, never on MUI UI components.

## 4. Contract

### Guarantees
- Every page starts with the same shell slots (sidebar, header, sub-nav, main area) — pages only fill the main area.
- `<Box component="main">` owns scroll — pages never nest their own scroll container.
- `PageHeaderSection` renders the bordered top header consistently across every page.

### Prohibitions
- No full-page custom shells or layouts that bypass `AlationLayout`.
- No `<body>` / `<html>` / `<main>` / `<header>` / `<footer>` raw HTML landmarks — MUI `<Box>` with `component` prop instead.
- No `sx` styling on MUI UI components to fake a page shell — use the shell primitives.
- No fixed-width pixel widths. Use the maxWidth conventions (640 for forms, 960 for content).
- No horizontal scroll on the main area.
- Nothing outside the Inventory (§5) is valid for content widths.

### Conditions
- If the page is a wizard (multi-step form), widths follow the form rule (`maxWidth: 640`).
- If the page is a dashboard with side-by-side panels, the content column still honours the 960 max unless the user explicitly asks for full-bleed.
- Modals and drawers are not pages — their sizing lives with the Dialog / Drawer composite, not here.

## 5. Inventory

### Content widths (exhaustive)

| Intent | Value |
|---|---|
| Form content | `maxWidth: 640` |
| Content-heavy page | `maxWidth: 960` |
| Full-bleed (data tables, dashboards) | no maxWidth — main area width only |

### Page-body padding

| Intent | Value |
|---|---|
| Default body | `sx={{ p: 4 }}` (32 px) |

### Breakpoints (MUI defaults via `breakpoints`)

| Key | Min-width |
|---|---|
| `xs` | 0 |
| `sm` | 600 |
| `md` | 900 |
| `lg` | 1200 |
| `xl` | 1536 |

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
