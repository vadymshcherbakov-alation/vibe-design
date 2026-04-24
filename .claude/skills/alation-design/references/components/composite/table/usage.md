---
name: table
title: Table
category: composite-component
last_updated: 2026-04-21

description: >
  A data table (MUI X Data Grid) for listing entities with type/status label chips, creator info, and row-level actions. Follows the agents-table pattern from alation-base-ui.
tags: [table, data-grid, list]

figma_url: ""
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiDataGrid.overrides.tsx (Alation DataGrid theme). There is no shared `<Table>` wrapper in @alation/alation-ui — production consumes `<DataGrid>` directly from @mui/x-data-grid-pro."
example_path: ./Example.tsx

mui_base: DataGrid (MUI X Data Grid Pro)
depends_on_tokens: [typography.body1, typography.body2, palette.text.secondary, palette.divider]
depends_on_components: [DataGrid, Chip, Avatar, IconButton, Tooltip, Typography, Box]
---

# Table

## 1. Classification

- **Type:** Composite component — **composition pattern, not a shared wrapper**
- **MUI base:** `DataGrid` from `@mui/x-data-grid-pro` (MUI X Data Grid Pro)
- **Figma:** Table — to be linked
- **Code:** There is **no shared `<Table>` component** in `@alation/alation-ui`. Production consumes `<DataGrid>` directly from `@mui/x-data-grid-pro`, styled by `@alation/fabric-theme-morpheus/src/lib/MuiDataGrid.overrides.tsx`. Shared table utilities (`useTablePagination`, `useApiDrivenTablePagination`, `SaveTableViewAlert`) exist as hooks / helpers around the grid, not as a wrapper.

## 2. Purpose

A data table for listing entities (agents, tools, data sources, OAuth clients, etc.) with type/status indicators, creator info, and row-level actions. Canonical list-page pattern — every list view in the app uses this shape.

## 3. When to use / When not to use

**Use when**
- You need to list more than ~5 entities with multiple columns of metadata.
- The user needs to sort, filter, or paginate the list.
- Each row has row-level actions (menu, quick actions).

**Do not use when**
- The list is 1–5 items of the same type → use a `<Stack>` of [Card (Nav variant)](./card/usage.md) tiles.
- The data is hierarchical / tree-shaped → use a tree component (not yet documented).
- The list is a picker inside a form → use [Autocomplete](./form/usage.md) instead.

## 4. Contract

### Guarantees
- Every chip cell uses MUI `<Chip>` with a documented `variant` + `color` from [chip.md](../base/chip/usage.md) — never a chip with visual `sx` (`bgcolor`, `fontSize`, `height`).
- All UI icons (row icons, action icons, sort indicators) come from `lucide-react`.
- Row text uses Typography variants (`body1` primary, `body2` secondary) — no inline font overrides.
- Text follows sentence case — branded module names (Agent Studio, MCP servers) keep proper capitalization.

### Prohibitions
- Never mount `<Chip sx={{ bgcolor: ..., color: ... }}>` in a cell — use the `variant` + `color` + `size` props per [chip.md](../base/chip/usage.md).
- Never use `fontSize` / `fontWeight` inline on Typography cells — use variant.
- Never import SVG icons for in-table icons — lucide-react only (nav-rail SVG is the only `?react` exception).
- Never hardcode colors — use `theme.palette.*` or semantic tokens (`text.secondary`, `divider`, `background.paper`).
- Never skip the `Tooltip` on the Avatar — creator initials alone are not accessible.
- Never put more than one primary action in a row — row-level actions live behind the `MoreVertical` menu.

### Conditions
- When a column represents a type or status → use a [Chip](../base/chip/usage.md) cell (`variant="filledLight"` + semantic `color` for status, `variant="outlined"` for neutral type labels).
- When a column represents a creator → use a 24px `Avatar` with initials wrapped in a `Tooltip` showing the full name.
- When a row has actions → mount a `MoreVertical` `IconButton` in the last column, width 60.
- When the table is empty → render an empty-state block (title + subtitle + optional CTA) — do not show the grid with zero rows.
- When the table is loading → use the DataGrid's built-in `loading` prop; do not replace with a separate skeleton.
- When columns can be reordered or resized → rely on the DataGrid's built-in affordances (draggable header + trailing-edge resize handle). Do not build custom drag handles.
- When the row set exceeds the page size → mount a pagination footer below the grid (Show-rows select + range counter + first/prev/next/last chevron `IconButton`s). The footer sits outside the bordered grid shell.

## 5. Anatomy & Composed of

**Anatomy** — canonical column set
| Column | Content | Width |
|---|---|---|
| Name | lucide icon + name (`body1`) + description (`body2`, `text.secondary`) | flex / flexible |
| Access | [Chip](../base/chip/usage.md) `variant="outlined"` + `color="default"` + `size="xsmall"` | 140 |
| Type | [Chip](../base/chip/usage.md) — `filledLight` + `color="info"` (native) or `outlined` + `color="default"` (custom) | 100 |
| Created | Formatted date string — `body1`, `text.secondary` | 140 |
| Creator | 24px `Avatar` with initials + `Tooltip` with full name | 88 |
| Actions | `MoreVertical` `IconButton` (lucide-react) | 60 |

**Header affordances** (built into every column except the trailing Actions column)
- **Draggable reorder** — the column header sits inside `MuiDataGrid-columnHeaderDraggableContainer`; users can drag a header to a new position. Do not override `cursor` on the header — the default cursor + DataGrid's drag handling is the contract.
- **Resize handle** — a 10px hit target at the trailing edge of each header (`MuiDataGrid-columnSeparator--resizable`) drags to resize the column. `cursor: col-resize` inside the handle only.

**Grid chrome**
- **Filler row** — `MuiDataGrid-filler` renders a blank strip below the last data row to extend the grid to the container height. This is built-in; do not suppress it.
- **Pagination footer** — sits *outside* the bordered grid shell, directly below it, with `mt: 2`. Anatomy: `Show rows` label + size `<select>` on the left; range counter ("1–5 of N") + first / previous / next / last chevron `IconButton`s on the right.

**Composed of**
- `DataGrid` from `@mui/x-data-grid-pro` — grid primitive
- [Chip](../base/chip/usage.md) — type / access / status cells
- [IconButton](../base/icon-button/usage.md) — row-level action trigger
- `Avatar` + `Tooltip` — creator column
- [Typography](../foundations/typography/usage.md) — cell text
- `Box` — layout wrappers inside cells

## 6. Custom

### Name cell

Icon + stacked text in a flex `Box`:

```tsx
<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, minWidth: 0 }}>
  <Bot size={16} />  {/* lucide-react icon */}
  <Box sx={{ minWidth: 0 }}>
    <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {name}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {description}
    </Typography>
  </Box>
</Box>
```

### Chip cell

Use MUI `<Chip>` with the documented `variant` + `color` + `size` from [chip.md](../base/chip/usage.md). `size="xsmall"` is the standard for table rows.

```tsx
import { Chip } from '@mui/material';

<Chip label="MCP" variant="outlined" color="default" size="xsmall" />
<Chip label="Native" variant="filledLight" color="info" size="xsmall" />
<Chip label="Active" variant="filledLight" color="success" size="xsmall" />
```

`sx` on `<Chip>` is for layout only (`maxWidth`, `margin`). Never pass `fontSize`, `height`, `backgroundColor`, or `color` via `sx`.

### Creator avatar

24px with initials, wrapped in a `Tooltip` for the full name:

```tsx
<Tooltip title={creator}>
  <Avatar sx={{ width: 24, height: 24 }}>{initials}</Avatar>
</Tooltip>
```

### Row actions

Mount a `MoreVertical` lucide icon inside an `IconButton` as the final column, width 60:

```tsx
<IconButton aria-label={`Actions for ${row.name}`} onClick={openMenu}>
  <MoreVertical size={16} />
</IconButton>
```

See [`icon-button.md`](../base/icon-button/usage.md) for the accessibility-name contract.

### Table header styling

```tsx
const headerCellSx = {
  p: '12px',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  borderTop: `1px solid ${borderColor}`,
  borderBottom: `1px solid ${borderColor}`,
  backgroundColor: 'background.paper',
};
```

### Sort + filter

- Use the DataGrid's built-in column-header sort toggle — do not build a custom sort UI.
- Use the DataGrid toolbar for filters — do not build a custom filter bar above the grid.

### Column reorder + resize

Built into the DataGrid — no custom wiring or overrides. Two affordances to be aware of:

- **Reorder** — every column header is wrapped in `MuiDataGrid-columnHeaderDraggableContainer`. A user drag on the header moves the column. Keep the default header cursor.
- **Resize** — the trailing edge of each header is a 10px `MuiDataGrid-columnSeparator--resizable` hit target. Hover reveals a thin vertical line; drag resizes the column. The last column does not render a separator.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  // reorder + resize are on by default — nothing to enable
/>
```

Never build a custom drag grip or resize handle on top of the DataGrid — the built-ins are the contract.

### Pagination footer

Sits *below* the bordered grid shell, not inside. Use `hideFooter` on the DataGrid and render a custom footer row so the controls can match the rest of the app's visual language.

```tsx
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
  {/* Left — page size */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" color="text.secondary">Show rows</Typography>
    <Box component="select" defaultValue={5} sx={{ /* small outlined select */ }}>
      {[5, 10, 25].map((size) => <option key={size} value={size}>{size}</option>)}
    </Box>
  </Box>

  {/* Right — range + chevrons */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="body2" color="text.secondary">1–5 of {total}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton size="small" disabled={atStart}><ChevronsLeft size={16} /></IconButton>
      <IconButton size="small" disabled={atStart}><ChevronLeft size={16} /></IconButton>
      <IconButton size="small" disabled={atEnd}><ChevronRight size={16} /></IconButton>
      <IconButton size="small" disabled={atEnd}><ChevronsRight size={16} /></IconButton>
    </Box>
  </Box>
</Box>
```

Rules:
- All four chevron icons come from `lucide-react` (`ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`) at `size={16}`.
- `IconButton size="small"` only — no custom `sx` for appearance.
- "Show rows" + the range counter use `Typography variant="body2" color="text.secondary"`.
- When at the first page, disable `ChevronsLeft` + `ChevronLeft`; when at the last page, disable `ChevronsRight` + `ChevronRight`.

### Empty / loading states

- **Loading** — `<DataGrid loading />`. Do not replace with a skeleton wrapper.
- **Empty** — render a dedicated empty-state block (title + subtitle + optional CTA) in place of the grid. Showing zero rows with the grid header visible is not acceptable.

### Icon rule (all table icons)

Use `lucide-react` for every in-table icon (row icon, action icon, sort indicator, pagination chevrons). The `?react` SVG import path is reserved for the nav rail only.

## 7. Mock data content

Placeholder — fill with Alation-domain mock data when this composite is used in a pilot. Candidates: Agents list (name + description + access chip + type chip + created-by avatar + actions); MCP servers list (application name + client ID + created-by + createdAt); Data sources list.

Mock data rules:
- Reflects Alation domain (agents, tools, data sources, monitors, catalog objects).
- Names in sentence case — "Data analyst agent", "Query assistant".
- Branded module names keep proper capitalization — "Agent Studio", "MCP servers".

## 11. Example

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  loading={loading}
  slots={{ toolbar: CustomToolbar }}
/>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — includes column definitions, row rendering, and action menu wiring.
