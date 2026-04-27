---
name: accordion
title: Accordion
category: composite-component
last_updated: 2026-04-27

description: >
  The collapsible-content composite. A bordered surface whose summary row
  toggles a details panel open and closed. Wraps MUI `<Accordion>` +
  `<AccordionSummary>` + `<AccordionDetails>` with the morpheus override
  (outlined surface, no gutters, themed expand chevron). Production composes
  it with two `@alation/fabric-ui` helpers — `MuiAccordionSummaryHeader`
  (heading + optional icon + tooltip) and `MuiAccordionSummaryAction` (right-
  aligned action region inside the summary).
tags: [accordion, collapsible, disclosure, panel]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=72-1313&t=eS5ReSD4ZsCMa08a-1"
code_reference: "fabric-theme-morpheus/src/lib/MuiAccordion.overrides.ts · alation-ui/libs/fabric-ui/src/lib/MuiAccordionSummaryHeader.tsx · MuiAccordionSummaryAction.tsx"
example_path: ./Example.tsx

mui_base: Accordion
depends_on_tokens:
  - palette.grey.500
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.background.darken10
  - shadows[1]
  - typography.subtitle1
  - typography.body2
  - typography.iconSmall
  - typography.iconLarge
depends_on_components:
  - Accordion
  - AccordionSummary
  - AccordionDetails
  - MuiAccordionSummaryHeader
  - MuiAccordionSummaryAction
  - Typography
  - SvgIcon
  - ChevronDownIcon
---

# Accordion

## 1. Classification

- **Type:** Composite component
- **MUI base:** `Accordion` (+ `AccordionSummary`, `AccordionDetails`)
- **Figma:** [Accordion · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=72-1313&t=eS5ReSD4ZsCMa08a-1)
- **Code:** `@alation/fabric-theme-morpheus` — `src/lib/MuiAccordion.overrides.ts` · `@alation/fabric-ui` — `src/lib/MuiAccordionSummaryHeader.tsx` · `src/lib/MuiAccordionSummaryAction.tsx`

## 2. Purpose

An **Accordion** is a bordered surface with a summary row that opens to reveal a detail panel. The user clicks the summary (or its chevron) to expand the panel; clicking again collapses it back. Multiple accordions stacked together share a single border so the group reads as one continuous surface.

Use an Accordion to keep secondary content out of the way until the user asks for it — settings sections, FAQ entries, optional fields, side-panel groups.

## 3. When to use / When not to use

**Use when**
- The page has several long-form sections that not every reader needs at once — settings, FAQs, optional configuration
- Each section has a clear, short summary that lets the user decide whether to expand
- Collapsing the section saves vertical space without hiding anything the user *must* see
- The sections are independent — opening one does not depend on opening another

**Do not use when**
- The content is critical to the primary task — render it inline; don't make the user expand to find it
- The sections are mutually exclusive views that swap content → use **Tabs**
- The hierarchy is a tree (parent / child / grandchild) → use a tree component
- The content is a single short message — use **Alert** or plain Typography
- The accordion would only ever have one item — drop the wrapper and render the content directly
- The detail panel needs persistent visibility while the user is acting on it (e.g. a form being filled in across sections) — split into a multi-step pattern instead

## 4. Contract

### Guarantees
- Default props (set by the morpheus override): `disableGutters`, `elevation: 0`, `variant: 'outlined'` — every accordion ships as a borderless-stacking outlined surface.
- The container border is `0.1rem solid grey[500]`. Stacked accordions share their adjacent borders (`&:not(:last-child) { border-bottom: 0 }`) so a group renders as one rectangle with internal dividers.
- The summary row paints `background.darken10` on hover and `Mui-focusVisible`. When expanded, the summary picks up `shadows[1]` so the open accordion lifts subtly from its neighbours.
- Each accordion summary carries a programmatic name — either an `aria-controls` + `id` pair on `<AccordionSummary>` linked to its `<AccordionDetails>`, or `aria-label` on the summary describing the action ("Toggle <name> details"). MUI generates these automatically when both children carry matching `id` / `aria-controls` props.
- The expand chevron lives on the right edge of the summary (MUI default). The chevron rotates 180° on expand.
- Disabled accordions render the summary in `text.disabled` and remove the hover background. They are not focusable.
- Custom CSS classes provided by the morpheus override:
  - `.MuiAccordionSummary-headerContent` — the leading content (heading + optional icon + optional tooltip)
  - `.MuiAccordionSummary-blurbContent` — secondary text in `text.secondary` (next to heading)
  - `.MuiAccordionSummary-actionContent` — right-aligned action region (rendered with `flex-direction: row-reverse`)

### Prohibitions
- No raw `<details>` / `<summary>` HTML element.
- No bare `<Accordion>` without an `<AccordionSummary>` and an `<AccordionDetails>` — even an empty details panel is required so the disclosure semantics are correct.
- No `<AccordionSummary>` without an accessible name (either an `id` paired with `aria-controls` on the details, or an explicit `aria-label`).
- No `variant="elevation"` or `variant="filled"` — morpheus only themes `outlined`.
- No `elevation` prop > 0 — the override sets `0` and lifts the *expanded* summary via `shadows[1]`; do not stack page-level shadows.
- No hard-coded hex / px / font values inside the summary or details.
- No `sx` overrides of border colour, hover background, expand-icon size / colour, or the summary's content / blurb / action class styles — those are theme contracts.
- No `color="secondary"` or other forbidden palette values.
- No accordion used as a navigation primitive (jumping the user to a different page on expand) — expansion shows content in place; it does not navigate.
- No accordion with disabled detail content but enabled summary — if the detail is unavailable, disable the whole accordion (`disabled` prop on `<Accordion>`).
- No accordion inside a `Dialog`'s primary task surface — dialogs are for focused single-task interactions; expanding a panel inside a dialog conflicts with that focus.
- No more than ~7 accordions in a single group — past that, the group becomes a list-of-toggles and you should reconsider the page structure.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- For an **accordion group**, render multiple `<Accordion>` siblings inside a single wrapping container (no extra paper / box). The morpheus override handles the shared-border treatment automatically.
- For **single-expand groups** (only one panel open at a time — typical for FAQs, side-panels), control `expanded` and `onChange` at the parent level so a state hook decides which `id` is open.
- For **multi-expand groups** (each panel independent — typical for settings sections), use uncontrolled `<Accordion>` with `defaultExpanded` per item. Do not lift state.
- For **rich summaries** (heading + icon + blurb + actions), compose the summary's children with the production helpers:
  - `<MuiAccordionSummaryHeader primary="…" iconComponent={…} headingLevelVariant="subtitle1">{optional blurb children}</MuiAccordionSummaryHeader>` — leading content
  - `<MuiAccordionSummaryAction>{actionButtons}</MuiAccordionSummaryAction>` — trailing actions, right-aligned
  - Action buttons must `e.stopPropagation()` on click so they don't toggle the accordion.
- The expand chevron defaults to `<ChevronDownIcon>` from `@alation/icons-neo`. Do not swap the icon position or shape — the right-edge chevron is the contract.
- Accordion summaries should never wrap to two lines. Use the `MuiOverflowTooltip` wrapper baked into `MuiAccordionSummaryHeader` (it already trips on overflow when `noWrap` is set).
- Lazy details — when the detail panel is heavy (a chart, a fetch), gate it with `expanded ? <…/> : null` so it does not render until the user opens it.

## 5. Variants

Accordion is a multi-axis composite. The two axes are **summary content** (what regions the summary row carries) and **group behaviour** (single vs multi-expand).

### 5.1 Summary content — composable axes

A summary may carry any combination of these regions. Pick what the use case needs; do not stack all four unless the layout genuinely benefits.

| Region | Production helper | Use when |
|---|---|---|
| **Heading only** (default) | `<MuiAccordionSummaryHeader primary="Section name" />` | Simple groupings — a label is enough; nothing to convey beyond "this is a section" |
| **Heading + leading icon** | `<MuiAccordionSummaryHeader primary="…" iconComponent={MyIcon} />` | The section is one of several typed groups (e.g. icon per data domain, otype) and the icon aids fast scanning |
| **Heading + trailing actions** | `<MuiAccordionSummaryAction>{actions}</MuiAccordionSummaryAction>` (placed alongside `MuiAccordionSummaryHeader`) | Each section has a section-level action (rename, delete, reorder). Action buttons must `stopPropagation` so they don't toggle the panel. |
| **Heading + secondary blurb** | A `<Box className="MuiAccordionSummary-blurbContent">…</Box>` next to `MuiAccordionSummaryHeader` | The section needs a short status / count / hint visible without expanding ("3 fields" · "Updated 2h ago"). Renders in `text.secondary`. |

### 5.2 Group behaviour — single vs multi-expand

| Variant | Pattern | Use when |
|---|---|---|
| **Multi-expand** (default) | Uncontrolled — each `<Accordion>` carries `defaultExpanded` (or none); each panel toggles independently | Settings pages, optional-config sections — the user may want several panels open at once |
| **Single-expand** | Controlled — parent owns `expanded={openId === thisId}` + `onChange` writes the new id (or `null` to close all) | FAQs, side-panel filter groups — the user is reading one item at a time, opening another should close the previous |

### Modifiers — layered on any variant

| Modifier | Pattern | Notes |
|---|---|---|
| **Disabled** | `<Accordion disabled />` | Whole accordion is inert; summary in `text.disabled`; not focusable |
| **Lazy details** | `expanded ? <PanelContent /> : null` inside `<AccordionDetails>` | Defer expensive renders until the user opens the panel |
| **Custom heading level** | `<MuiAccordionSummaryHeader headingLevel="h3" headingLevelVariant="subtitle2" />` | The `MuiAccordionSummaryHeader` wraps the primary text in a `<Typography>` — set the semantic heading level so the document outline is correct |

## 6. Anatomy

- **Container** — outlined paper (`grey[500]` border, no shadow at rest); siblings share borders so a group reads as a single rectangle.
- **Summary row** — clickable / focusable; paints `background.darken10` on hover and focus-visible; lifts with `shadows[1]` when its accordion is expanded.
- **Summary header content** *(`MuiAccordionSummaryHeader`)* — heading text in `subtitle1`; optional leading icon (`iconSmall` size) and optional tooltip; uses `MuiOverflowTooltip` to surface the full label when truncated.
- **Summary blurb content** *(optional)* — secondary text in `text.secondary` next to the heading (count, status, hint).
- **Summary action content** *(optional, `MuiAccordionSummaryAction`)* — right-aligned action region (rendered `flex-direction: row-reverse`); typical contents: `IconButton` for rename / delete / reorder, plus a divider before the chevron.
- **Expand chevron** — the `expandIcon` on the right edge of the summary; themed `text.secondary` and `iconLarge` size; rotates 180° on expand.
- **Details panel** — the open content area; padding `theme.spacing(2)`; top border `0.1rem solid grey[500]` separating it from the summary.

### Composed of

- `Accordion`, `AccordionSummary`, `AccordionDetails` — MUI primitives, themed by `MuiAccordion.overrides.ts`
- `MuiAccordionSummaryHeader` (`@alation/fabric-ui`) — heading wrapper with optional icon + tooltip; defaults `subtitle1` / `<h2>`
- `MuiAccordionSummaryAction` (`@alation/fabric-ui`) — right-aligned action region wrapper
- [Typography](../foundations/typography/usage.md) — heading variant inside the summary, body inside the details panel
- `SvgIcon` + `ChevronDownIcon` (`@alation/icons-neo`) — the default expand chevron
- [Tooltip](../base/tooltip/usage.md) — paired with the summary heading when truncation is likely; baked into `MuiAccordionSummaryHeader` via `MuiOverflowTooltip`

## 7. Custom

### Single accordion (default)

The simplest shape — one summary, one details panel. Wrap in a single `<Accordion>` and let the morpheus override do the rest.

```tsx
<Accordion>
  <AccordionSummary
    aria-controls="connection-details"
    id="connection-summary"
    expandIcon={<SvgIcon component={ChevronDownIcon} />}
  >
    <MuiAccordionSummaryHeader primary="Connection details" />
  </AccordionSummary>
  <AccordionDetails id="connection-details">
    <Typography variant="body2">…</Typography>
  </AccordionDetails>
</Accordion>
```

### Group of accordions (multi-expand, uncontrolled)

Multiple sibling `<Accordion>` items inside a single wrapping container. Each panel carries `defaultExpanded` if it should start open. The morpheus override handles the shared-border treatment.

```tsx
<Box>
  <Accordion defaultExpanded>
    <AccordionSummary id="general-summary" aria-controls="general-details" expandIcon={<SvgIcon component={ChevronDownIcon} />}>
      <MuiAccordionSummaryHeader primary="General" />
    </AccordionSummary>
    <AccordionDetails id="general-details">…</AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary id="permissions-summary" aria-controls="permissions-details" expandIcon={<SvgIcon component={ChevronDownIcon} />}>
      <MuiAccordionSummaryHeader primary="Permissions" />
    </AccordionSummary>
    <AccordionDetails id="permissions-details">…</AccordionDetails>
  </Accordion>
</Box>
```

### Group of accordions (single-expand, controlled)

When only one panel should be open at a time, lift `expanded` to the parent. Compare each item's `id` against the active id; clicking the open one closes it.

```tsx
const [openId, setOpenId] = useState<string | null>('faq-1');

<Box>
  {faqs.map((faq) => (
    <Accordion
      key={faq.id}
      expanded={openId === faq.id}
      onChange={(_, isOpen) => setOpenId(isOpen ? faq.id : null)}
    >
      <AccordionSummary id={`${faq.id}-summary`} aria-controls={`${faq.id}-details`} expandIcon={<SvgIcon component={ChevronDownIcon} />}>
        <MuiAccordionSummaryHeader primary={faq.question} />
      </AccordionSummary>
      <AccordionDetails id={`${faq.id}-details`}>{faq.answer}</AccordionDetails>
    </Accordion>
  ))}
</Box>
```

### Rich summary — heading + icon + blurb + action

When the summary needs to convey status and offer a section-level action. The action button must stop propagation so it does not toggle the panel.

```tsx
<Accordion>
  <AccordionSummary id="standard-summary" aria-controls="standard-details" expandIcon={<SvgIcon component={ChevronDownIcon} />}>
    <MuiAccordionSummaryHeader primary="Data quality standard" iconComponent={ShieldCheckIcon} />
    <Box className="MuiAccordionSummary-blurbContent">3 fields · Updated 2h ago</Box>
    <MuiAccordionSummaryAction>
      <IconButton
        aria-label="Edit standard"
        onClick={(e) => { e.stopPropagation(); openEditor(); }}
      >
        <SvgIcon component={EditIcon} />
      </IconButton>
    </MuiAccordionSummaryAction>
  </AccordionSummary>
  <AccordionDetails id="standard-details">…</AccordionDetails>
</Accordion>
```

### A11y wiring rules

- Each `<AccordionSummary>` must carry an `id` and a paired `aria-controls` pointing at the `<AccordionDetails>` `id` — or an explicit `aria-label` describing the toggle action. MUI sets `aria-expanded` and the toggle `role="button"` automatically.
- The summary's keyboard surface is the whole row — Enter / Space toggle expansion. Action buttons inside the summary are independent focus stops; their `onClick` must `stopPropagation` so activating the action doesn't toggle the panel.
- The details panel inherits `role="region"` and is wired by MUI; do not reassign roles.
- Group label — for a stacked group with semantic meaning ("Settings sections"), wrap the group in a labelled landmark (`<section aria-label="Settings">…</section>` or a heading directly above).

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

- **Object detail page sections** (multi-expand) — `Overview` (default open) · `Schema` · `Lineage` · `Data Quality` · `Conversations`
- **Settings page** (multi-expand) — `General` (default open) · `Permissions` · `Notifications` · `Integrations`
- **FAQ list** (single-expand) — `How do I connect a source?` · `What is a data product?` · `How are object trails resolved?`
- **Policies & Standards detail** (multi-expand) — `Curation requirements` · `Risk levels` · `Standards approvers`

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Summary heading | Sentence case noun phrase; ≤ ~6 words | "Data quality" · "Permissions" |
| Summary blurb | Short, factual; counts / status / timestamps | "3 fields" · "Updated 2h ago" · "1 issue" |
| Summary action `aria-label` | Verb + object | "Edit standard" · "Delete section" |
| Disabled-accordion tooltip | One short sentence — say *why*, not *what* | "Connect a source to view standards" |

## 11. Example

```tsx
import { Accordion, AccordionDetails, AccordionSummary, Box, SvgIcon, Typography } from '@mui/material';
import { ChevronDownIcon } from '@alation/icons-neo';
import { MuiAccordionSummaryHeader } from '@alation/fabric-ui';

// Multi-expand group (uncontrolled) — the simplest shape
<Box>
  <Accordion defaultExpanded>
    <AccordionSummary
      id="overview-summary"
      aria-controls="overview-details"
      expandIcon={<SvgIcon component={ChevronDownIcon} />}
    >
      <MuiAccordionSummaryHeader primary="Overview" />
    </AccordionSummary>
    <AccordionDetails id="overview-details">
      <Typography variant="body2">Plain-language definition of this object.</Typography>
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      id="schema-summary"
      aria-controls="schema-details"
      expandIcon={<SvgIcon component={ChevronDownIcon} />}
    >
      <MuiAccordionSummaryHeader primary="Schema" />
    </AccordionSummary>
    <AccordionDetails id="schema-details">…</AccordionDetails>
  </Accordion>
</Box>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — multi-expand group, rich summary (heading + blurb + action), and single-expand controlled FAQ specimens.
