---
name: content-switcher
title: Content Switcher
category: base-component
last_updated: 2026-04-28

description: >
  The compact segmented control. A row of mutually-exclusive options inside a
  grey track; the selected option is a raised white pill. Rendered as MUI
  `<ToggleButtonGroup exclusive>` wrapped by alation-ui's `MuiContentSwitcher`
  styled component, with `MuiContentSwitcherOption` for each option. Use for
  in-place view / mode switches and for compact form choices — Grid / List,
  All / Mine / Shared, Daily / Weekly / Monthly, On / Off labelled pairs. Not
  for in-page navigation between heavy panels (use Tabs) and not for top-level
  destinations (use the app shell — App bar / Wayfinder / Top Nav).
tags: [form, input, choice, single-select, segmented]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=18-403&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-ui/src/lib/MuiContentSwitcher.tsx · fabric-ui/src/lib/MuiContentSwitcherOption.tsx · fabric-theme-morpheus/src/lib/MuiToggleButton.overrides.ts"
example_path: ./Example.tsx

mui_base: ToggleButtonGroup
depends_on_tokens:
  - palette.grey.300
  - palette.grey.50
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.background.default
  - typography.body0
  - typography.body1
depends_on_components:
  - ToggleButtonGroup
  - ToggleButton
  - MuiContentSwitcher
  - MuiContentSwitcherOption
---

# Content Switcher

## 1. Classification

- **Type:** Base component
- **MUI base:** `ToggleButtonGroup` (with `ToggleButton` items)
- **Figma:** [Content Switcher · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=18-403&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-ui` — `src/lib/MuiContentSwitcher.tsx` · `src/lib/MuiContentSwitcherOption.tsx` · `@alation/fabric-theme-morpheus` — `src/lib/MuiToggleButton.overrides.ts`

## 2. Purpose

A **Content Switcher** is a compact segmented control — a row of mutually-exclusive options sitting inside a grey track, where the selected option lifts as a white pill. It captures *which slice of the same content the user is looking at right now* — Grid / List, All / Mine / Shared, Daily / Weekly / Monthly — and swaps a small content block in place without navigating away.

Content Switcher, Tabs, and the app shell sit at three different levels of the navigation hierarchy: Tabs split a single page into 2–~7 heavy panels; the **App bar / Wayfinder / Top Nav** carry top-level destinations; Content Switcher (and Radio) handle the smallest grain — a compact filter pill above a table, a view-mode toggle in a toolbar, a 2–5-option choice inside a form. Pick the level that matches the *weight* of the content being switched.

## 3. When to use / When not to use

**Use when**
- Switching between small in-place views or modes — Grid / List, Compact / Comfortable, Day / Week / Month
- A single-axis filter pill above a data-table view ("All · Mine · Shared", "Active · Paused · Archived")
- A compact 2–5-option choice inside a form where the horizontal segmented look fits better than a Radio column (sync cadence, export format, permission tier)
- A binary opposite that benefits from showing both labels simultaneously (a Switch hides the *other* state — when both labels need to stay visible, reach for Content Switcher)

**Do not use when**
- The destinations are top-level app sections → use the app shell — **App bar**, **Wayfinder**, or **Top Nav** — not Content Switcher
- The split is between heavy in-page panels (Imported / Published, Overview / Schema / Lineage) → use **Tabs**
- The list has more than ~5 options → use **Select Input** (inside a Form Field)
- The list is large, dynamic, or searchable → use **Autocomplete** (inside a Form Field)
- The user can pick more than one → use a **Checkbox** group or multi-select **Autocomplete**
- The control flips a single setting between two opposite states and the *other* label can be implied (Active / Inactive feature flag) → use a **Switch**
- The labels run longer than ~12 characters or wrap onto two lines → use **Radio** (vertical, accommodates long labels)
- The control fires an action (Run, Delete, Open) → use a **Button**; Content Switcher records state, it does not trigger one-shot side-effects

## 4. Contract

### Guarantees
- Always rendered as `<ToggleButtonGroup exclusive>` (or the `MuiContentSwitcher` wrapper) — `exclusive` is required so MUI enforces the single-selection invariant.
- The group always carries a programmatic name — `aria-label` (or `aria-labelledby` pointing at a visible heading).
- Each option is a `<ToggleButton value="…">` (or `MuiContentSwitcherOption`) carrying a stable `value` matching one entry of the group's `value`.
- Track is `palette.grey[300]` background, `theme.spacing(0.5)` (4px) padding, `borderRadius` `theme.borderRadiusToRem(6)` — owned by `MuiContentSwitcher`.
- Selected option is `palette.grey[50]` background with a soft `0 0 0.3rem rgba(0,0,0,0.25)` shadow and `fontWeightBold` — owned by `MuiContentSwitcherOption`.
- Hover (selected or unselected) paints `palette.grey[50]` — no border change.
- Focus-visible paints `palette.background.default` with a `0.2rem solid text.secondary` outline — keyboard reachable.
- Unselected option text is `text.secondary`; selected and hovered options shift to `text.primary` weight via the bold rule.
- Sizes: **Medium** (default — `body1`, `padding: 0.5 2`) and **Small** (omit `size` → MUI default; `body0`/`body1` falls through). The Figma library exposes Medium (default) and Small as the two variant axes.
- Disabled options are inert (not focusable) and tinted `text.disabled`.
- Keyboard: arrow keys move focus between options inside the group; Enter / Space activates. MUI's `ToggleButtonGroup` handles this — do not reimplement.

### Prohibitions
- No raw `<input type="radio">` / `<button>` strip pretending to be a segmented control. Use `ToggleButtonGroup` + `ToggleButton` (or the `MuiContentSwitcher` wrapper) so single-selection + a11y are correct.
- No `ToggleButtonGroup` without `exclusive` — non-exclusive turns the group into a multi-toggle, which is not a Content Switcher.
- No bare `ToggleButtonGroup` without `aria-label` (or `aria-labelledby`).
- No `ToggleButton` without a stable `value`.
- No hard-coded hex / px / font values.
- No `sx` overrides of the track background, option padding, hover background, or selected box-shadow — `MuiContentSwitcher` + `MuiContentSwitcherOption` own those visuals.
- No `color="secondary"` / `success` / `warning` / `error` / `info` on the group or options — only the default tinting is themed.
- No `variant="outlined"` ToggleButtons inside a Content Switcher — that styling belongs to a different segmented pattern; `MuiContentSwitcher` removes the border.
- No icon-only options without `aria-label` on the option.
- No "no selection" state after the user has interacted — once a `value` is set, one option must remain selected. (`MuiContentSwitcher` is `exclusive` and rejects `null` updates by convention; the consumer's `onChange` should ignore null — see the production `OCFSegmentedControllerWidget` pattern.)
- No mixing a Content Switcher with a Tabs strip in the same row — they read as duplicate filters; pick one.
- No more than ~5 options. If the count grows, switch to **Select Input**.
- No multi-line labels. Keep each option to one short noun phrase, ≤ ~12 chars.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Place a Content Switcher above the content it filters or above the toolbar of the data-table view, never inline with body text.
- For binary opposites, prefer a Content Switcher when both labels need to stay visible (Grid / List, Compact / Comfortable). When the affordance is "flip this setting On / Off and the other label is implied", use a **Switch**.
- A Content Switcher inside a form must be wrapped in a Form Field when it carries a label, helper text, or validation. Without those, the inline `aria-label` on the group is sufficient.
- Disabled group: pass `disabled` on the `ToggleButtonGroup` to disable every option together (e.g. while a parent toggle is Off). Pair with a tooltip on the group's wrapper explaining why.
- Read-only display of a captured choice is **not** a Content Switcher — render the option's label as a Typography line (or a Label Chip).
- When Content Switcher acts as a filter for a data table, persist the active value in a URL query param (e.g. `?view=mine`) so the view is deep-linkable, the same persistence rule Tabs follows.
- Lazy panels: when the swapped content is heavy, render only the active block (`{value === 'mine' && <MineView />}`) instead of all blocks at once.

## 5. Variants

Content Switcher is a single-axis component within a group. The named-style axis is the **selection state** of an individual option; **size** is a group-level axis exposed by Figma.

### 5.1 Named styles — selection state

| Named style | Use for | Implementation | Example |
|---|---|---|---|
| **Unselected** (default) | Available, not chosen | Group `value` ≠ this option's `value` | "List" — when "Grid" is chosen |
| **Selected** | The current choice | Group `value` = this option's `value` | "Grid" — current view mode |

### 5.2 `size` prop

| Size | `ToggleButton` props | Use when |
|---|---|---|
| **Medium** (default) | `size="medium"` (default) | Standard density — toolbars, page filters, form fields. Label is `body1`, padding `0.5 2`. |
| **Small** | `size="small"` | Tight density — embedded in a dense toolbar or a card header where vertical space is constrained. |

### 5.3 `orientation` (group-level)

| Orientation | `ToggleButtonGroup` props | Use when |
|---|---|---|
| **Horizontal** (default) | `orientation="horizontal"` (default) | Standard segmented row |
| **Vertical** | `orientation="vertical"` | Rare — only when a horizontal row would force truncation in a narrow side panel. Prefer Radio for vertical option groups. |

### Modifiers — layered on any variant

Not variants themselves; layer on top of the axes above.

| Modifier | Pattern | Notes |
|---|---|---|
| **Disabled group** | `<ToggleButtonGroup disabled>` | Disables every option; pair with a tooltip on the wrapper explaining why |
| **Disabled option** | `<ToggleButton disabled value="…">` | Single option gated (e.g. "Grid" unavailable until data loads); pair with a tooltip |
| **URL-bound active value** | `value` reads from `searchParams.get('view')`; `onChange` writes back | Use when the active view should be deep-linkable |
| **Lazy panel** | `{value === 'mine' && <MineView />}` | Render only the active block when the swapped content is heavy |

## 6. Anatomy

- **Track / container** — the `<ToggleButtonGroup>` (or `MuiContentSwitcher`); grey-300 pill, `0.5` padding, `radius 6`, contains the options.
- **Option** — one `<ToggleButton>` (or `MuiContentSwitcherOption`); transparent background when unselected, white pill (`grey.50`) with soft shadow when selected. Carries the option `value`.
- **Label** — the text inside the option; `body1` (Medium) or `body0` (Large where used). Sentence case, ≤ ~12 chars.
- **Selected indicator** — the white pill itself + the soft shadow + the `fontWeightBold` swap. There is no separate underline / dot; the lift *is* the indicator.
- **Group label** *(external)* — when the group sits above a table or inside a form, an external Typography line or a Form Field's `<FormLabel>` names what the group is choosing among. The `aria-label` mirrors that text.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Default — unselected | Idle, not the group's value | Track grey-300; option transparent; label `text.secondary` | — |
| Default — selected | Idle, this is the group's value | Option `grey.50` background with soft shadow; label `text.primary`, `fontWeightBold` | The lift *is* the indicator |
| Hover — unselected | Pointer over a non-selected option | Option `grey.50` background, no shadow | — |
| Hover — selected | Pointer over the selected option | Same as default selected (no extra paint) | — |
| Focus-visible | Keyboard focus on an option | Option `background.default` with `0.2rem solid text.secondary` outline | Required |
| Active / Pressed | Pointer down / Space / Enter | Same as hover; commits on release | — |
| Disabled — group | `disabled` on the group | Track grey-300; every option `text.disabled`; not focusable | Pair with tooltip |
| Disabled — option | `disabled` on a single option | Option `text.disabled`; not focusable | Pair with tooltip |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Option label | Sentence case noun phrase or short label; ≤ ~12 chars; the value, not a sentence | "Grid", "List", "Mine", "Shared", "Daily", "Weekly" |
| Group `aria-label` | Sentence case noun phrase that names the choice axis | "View mode", "Source filter", "Sync cadence" |
| Disabled-option tooltip | One short sentence — say *why*, not *what* | "Connect a source to enable List view" |
| Required indicator | When wrapped in a Form Field, the asterisk is on the Form Field label, never on individual options | "Sync cadence *" |

## 11. Example

```tsx
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

const [view, setView] = useState<'grid' | 'list'>('grid');

<ToggleButtonGroup
  exclusive
  value={view}
  onChange={(_, v) => v !== null && setView(v)}
  aria-label="View mode"
>
  <ToggleButton value="grid">Grid</ToggleButton>
  <ToggleButton value="list">List</ToggleButton>
</ToggleButtonGroup>
```

For the production wrapper that paints the grey track + white-pill selection automatically, swap `ToggleButtonGroup` → `MuiContentSwitcher` and `ToggleButton` → `MuiContentSwitcherOption` from `@alation/fabric-ui`.

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — sizes, filter-pill, form-field, disabled, and URL-bound variants.
