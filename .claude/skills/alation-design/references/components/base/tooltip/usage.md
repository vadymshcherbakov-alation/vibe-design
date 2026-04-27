---
name: tooltip
title: Tooltip
category: base-component
last_updated: 2026-04-24

description: >
  A short text hint shown on hover or keyboard focus. Use it to label icon-only
  controls, expand truncated text, or surface supplementary description. Never
  for interactive content, critical info, or anything the user must read.
tags: [tooltip, hint, hover, a11y]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=109-3056"
code_reference: "@alation/fabric-theme-morpheus/src/lib/MuiTooltip.overrides.ts"
example_path: ./Example.tsx

mui_base: Tooltip
depends_on_tokens:
  - palette.grey.900
  - palette.grey.400
  - palette.text.inverted
  - typography.body2
  - shape.borderRadius
  - spacing.1
  - spacing.2
  - shadow.overlay
depends_on_components:
  - Tooltip
---

# Tooltip

## 1. Classification

- **Type:** Base component
- **MUI base:** `Tooltip`
- **Figma:** [Tooltip · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?node-id=109-3056)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiTooltip.overrides.ts`

## 2. Purpose

A Tooltip is a short text hint that appears on hover or keyboard focus. It labels an icon-only control, expands a truncated label, or adds a single line of supplementary description — the kind of thing a user would otherwise need to guess at.

Reach for it when the trigger is focusable, the hint is a short phrase, and the user can still complete the task without ever seeing it. If the content is critical, interactive, or longer than one line, pick a different affordance.

## 3. When to use / When not to use

**Use when**
- An Icon Button or icon-only affordance needs a name on hover / focus
- A truncated label needs its full text available on hover
- A control needs a short supplementary description that isn't required to use it

**Do not use when**
- The content must be read to understand the action → put the label in the UI (or use a **Button** with visible text)
- The content contains interactive elements (links, buttons, inputs) → use a **Popover** or **Dialog**
- The content is longer than one line of running text → use a **Popover** or inline help text
- The trigger is not focusable (a plain `<div>`, a disabled button with no wrapper) → make it focusable first, or move the hint inline
- The tooltip would be the only accessible name for the control → give the control an `aria-label` and use the tooltip as a visible echo

## 4. Contract

### Guarantees
- Wraps a single focusable, hoverable child — fires on pointer hover, keyboard focus, and long-press (mobile).
- Theme default is `arrow: true` and `placement: 'top'` — consumers override only when the placement collides with surrounding content.
- Renders `role="tooltip"` with the trigger described via `aria-describedby`.
- Dismisses on `Escape`, blur, pointer leave, or scroll — focus returns to the trigger.
- Uses `palette.grey[900]` (dark mode: `grey[400]`) for the bubble and `palette.text.inverted` for the label — theme-baked, never consumer-painted.
- Typography is `body2` (12px Inter Regular) at `spacing.1` / `spacing.2` padding with `shape.borderRadius` corners and `shadow.overlay` elevation.

### Prohibitions
- No interactive content inside `title` — no links, buttons, form controls, or focusable nodes. Interactive hover content is a Popover / Dialog job.
- No tooltip as the only accessible name. `aria-label` on the trigger is required; the tooltip is a visible echo, not a substitute.
- No `sx` overrides of background, colour, radius, font, or shadow — the theme owns appearance.
- No tooltip on a `disabled` MUI control without a `<span>` wrapper — disabled buttons don't fire events.
- No long-form content. Keep `title` to one short phrase; if it wraps more than two lines in the bubble, it belongs elsewhere.
- No `open` prop used to pin a tooltip permanently in product UI (outside of controlled feedback like Copy-to-clipboard confirmations).
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Wrapping a disabled trigger → wrap it in a `<span>` so hover/focus events reach the DOM.
- Trigger has visible text of its own → pass `describeChild` so the tooltip describes rather than labels it.
- Placement collides with viewport edge → MUI flips automatically; do not hard-code a `placement` that keeps colliding.
- Tooltip pins brief async feedback (e.g. "Copied") → use controlled `open` with a short timeout, not the default hover behaviour.
- Tooltip is rendered via a custom child component → the child must `forwardRef` and spread props so MUI can attach listeners.

## 5. Variants

Tooltip has no visual named styles — the theme renders one appearance. Variation is API-level: where the bubble sits, whether the arrow is drawn, and what content shape the `title` takes.

### 5.1 `placement` prop

Twelve values. Default is `top`; MUI flips to the opposite side when the bubble would clip the viewport.

| Group | Values |
|---|---|
| Top | `top-start`, `top` (default), `top-end` |
| Bottom | `bottom-start`, `bottom`, `bottom-end` |
| Left | `left-start`, `left`, `left-end` |
| Right | `right-start`, `right`, `right-end` |

### 5.2 `arrow` prop

| Value | Role | Notes |
|---|---|---|
| `true` (default) | Draws a pointer from the bubble to the trigger | Alation theme default |
| `false` | Bubble with no pointer | Use sparingly — arrow helps associate bubble with trigger |

### 5.3 Content shape (`title` prop)

| Shape | Use | Notes |
|---|---|---|
| `string` | Almost every tooltip — a short phrase | No punctuation at the end |
| `ReactNode` | Non-interactive typographic content (e.g. `<Typography>` with emphasis) | Must not contain focusable elements |

### 5.4 Timing (`enterDelay` / `leaveDelay`)

| Prop | Theme default | When to override |
|---|---|---|
| `enterDelay` | MUI default (100ms) | Dense toolbars where tooltips flicker on mouse transit → raise to 500ms |
| `leaveDelay` | MUI default (0ms) | Rare — only to bridge a gap for `describeChild` follow-through |

## 6. Anatomy

- **Trigger** — the child element (must be focusable and hoverable). Tooltip does not render a trigger; the consumer owns it.
- **Bubble** — rounded surface in `palette.grey[900]` (dark mode: `grey[400]`); `shape.borderRadius` (6px); `spacing.1` / `spacing.2` padding.
- **Label** — `typography.body2` at `palette.text.inverted`.
- **Arrow (optional)** — same fill as the bubble; points to the trigger edge implied by `placement`.
- **Shadow** — `shadow.overlay` (3-layer drop shadow) for elevation against the surface below.

## 7. States

| State | Trigger | Visual | Notes |
|---|---|---|---|
| Hidden | Idle | Not in the DOM | Default |
| Opening | Hover / focus on trigger, after `enterDelay` | Bubble fades in at `placement` | Theme `TransitionComponent` |
| Open | Pointer over trigger or keyboard focus | Bubble visible with arrow | `role="tooltip"`; trigger has `aria-describedby` |
| Dismissed (Escape) | `Escape` keypress while open | Bubble unmounts | Focus stays on the trigger |
| Dismissed (blur / leave) | Pointer leaves trigger OR trigger loses focus | Bubble unmounts after `leaveDelay` | — |
| Suppressed | `disabled*Listener` prop set | Bubble never opens for that input mode | Rare |

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Label | Sentence case, one short phrase, no trailing punctuation | "More actions" · "Copied" · "Remove from selection" |
| Describe-child copy | Adds context the visible label doesn't carry | Visible "Delete" → tooltip "Delete this data source permanently" |
| Avoid | Repeating the visible label verbatim | Visible "Filter" → tooltip "Filter" (redundant — drop it) |
| Avoid | Sentences with periods, questions, or marketing voice | — |

## 11. Example

```tsx
import { IconButton, Tooltip } from '@mui/material';
import { MoreVertical } from 'lucide-react';

<Tooltip title="More actions">
  <IconButton size="small" aria-label="More actions">
    <MoreVertical />
  </IconButton>
</Tooltip>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source.
