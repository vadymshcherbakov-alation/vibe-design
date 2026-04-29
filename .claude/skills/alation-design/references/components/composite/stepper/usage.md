---
name: stepper
title: Stepper
category: composite-component
last_updated: 2026-04-27

description: >
  The progress-trail composite for multi-step flows. A horizontal or vertical
  series of `<Step>` items with numbered icons, labels, and connector lines —
  rendered via MUI `<Stepper>` + `<Step>` + `<StepLabel>` + `<StepConnector>`.
  Use for wizards, onboarding sequences, and any task that splits across
  ordered steps the user must complete in turn. Vertical for forms with
  inline content under each step; horizontal for top-of-page progress
  indicators.
tags: [stepper, wizard, progress, multi-step]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2992-6720&t=eS5ReSD4ZsCMa08a-1"
code_reference: "no theme override · no shared @alation/alation-ui wrapper — production assembles MUI `<Stepper>` directly. This doc captures the composition contract."
example_path: ./Example.tsx

mui_base: Stepper
depends_on_tokens:
  - palette.primary.main
  - palette.primary.dark
  - palette.text.primary
  - palette.text.secondary
  - palette.text.disabled
  - palette.error.main
  - palette.divider
  - typography.body2
  - typography.caption
depends_on_components:
  - Stepper
  - Step
  - StepLabel
  - StepConnector
  - StepContent
  - StepButton
  - Typography
  - Tooltip
---

# Stepper

## 1. Classification

- **Type:** Composite component
- **MUI base:** `Stepper` (+ `Step`, `StepLabel`, `StepConnector`, optionally `StepContent` and `StepButton`)
- **Figma:** [Stepper · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=2992-6720&t=eS5ReSD4ZsCMa08a-1)
- **Code:** No theme override in `@alation/fabric-theme-morpheus`; no shared wrapper in `@alation/alation-ui` — production assembles MUI `<Stepper>` directly. This reference captures the composition contract.

## 2. Purpose

A **Stepper** shows the user where they are inside a multi-step flow and the path before and after the current step. Each step is a numbered node with a short label connected by a line; the active step is highlighted, completed steps carry a check, and future steps appear in grey.

## 3. When to use / When not to use

**Use when**
- The task splits into 2–~6 ordered, named steps the user works through in turn — "Connect source", "Map schema", "Review", "Publish"
- Each step is heavy enough to deserve its own surface (a form, a preview, a confirm) — too heavy to stack on one scroll
- The user benefits from seeing the full trail at a glance (what's done, what's current, what's next)
- The flow has a clear terminal state — submitting at the last step commits the work

**Do not use when**
- The task is one-shot — a single form, a single confirm → use **Form** or **Dialog** directly
- The task has more than ~6 steps — split into a parent grouping or move to a left-side rail; long horizontal steppers compress beyond usefulness
- The user picks one of N parallel views, not a sequence → use **Tabs**
- The trail is hierarchical, not sequential (parent / child / grandchild) → use **Breadcrumb**
- The component is a pure progress bar with no per-step semantics → use a Progress Indicator
- The step labels would be sentences or wrap across lines — reword to noun phrases or rethink the flow

## 4. Contract

### Guarantees
- `Stepper` always carries an `activeStep` (zero-indexed) — the index of the current step. The render order of `<Step>` children defines the visual order.
- `orientation="horizontal"` (default) lays steps left-to-right with labels to the right of (or below, with `alternativeLabel`) each icon; `orientation="vertical"` stacks steps top-to-bottom with labels to the right of each icon and optional `<StepContent>` panels below.
- Each `<Step>` derives its visual state from the parent — the step at index < `activeStep` is **completed**, the step at index = `activeStep` is **active**, steps at index > `activeStep` are **inactive** (future). `<Step disabled>` overrides this to render the step inert.
- `<StepLabel>` renders the step icon (default: number; replaced by check on completion) and the label text. The label is `typography.body2`; the icon glyph is rendered inside a `24×24` filled circle (active / completed) or outlined circle (inactive).
- `<StepConnector>` is the horizontal / vertical line between two steps; theme owns its colour (`divider` inactive, `primary.main` completed) and stroke.
- `<StepLabel optional>` renders a `caption` line below the label — used to mark a step as skippable ("Optional") or to add a short hint.
- `<StepLabel error>` flips the icon to `error.main` with the alert glyph; the label colour stays at `text.primary` so it remains readable.
- `<StepButton>` (used inside a non-linear stepper, `<Stepper nonLinear>`) makes the whole step a button — keyboard-focusable, click activates, focus-visible outline lives on the button.
- Vertical layout's `<StepContent>` panel is collapsible — only the active step's content is visible; transitions via the MUI `Collapse` primitive.

### Prohibitions
- No raw `<ol>` / `<ul>` strip pretending to be a stepper. Use MUI `<Stepper>` so the step roles, focus, and theme bindings are correct.
- No `<Stepper>` without `activeStep` — the parent owns the index, children must not paint state independently.
- No mixing `linear` and `nonLinear` modes within the same flow — pick one. Linear is the default; flip to `nonLinear` only for review-style flows where every step is reachable.
- No hard-coded hex / px / font values inside the stepper or its children.
- No `sx` overrides on `Stepper`, `StepLabel`, or `StepConnector` to change icon colour, icon size, label typography, label size, or connector stroke — the **morpheus `MuiStepIcon` theme override** locks the 24×24 icon contract; per-step state owns colour; `body2` owns label typography. Specifically forbidden at the call site: `sx={{ '& .MuiStepIcon-root': { fontSize: … } }}`, `slotProps={{ stepIcon: { sx: { width, height } } }}`, and wrapping `<StepLabel>` children in a `<Typography variant="…">` to upsize the label. If the icon does not render at 24×24, the **theme** is broken — fix the theme override, not the call site. If a designer asks for "bigger steps", the answer is *vertical orientation* or *fewer, more meaningful steps*, not a scale-up.
- **No full-width Stepper.** A horizontal Stepper must **never** stretch to fill its parent's available width — connectors are **fixed-gap** between steps, not flex-grow lines that scale with the container. Wrap the Stepper in a centring flex (`display: flex; justify-content: center;`) so the whole trail sits as a tight, centred unit. The MUI `<StepConnector>`'s default flex-grow line must be neutralised at the theme level (or via a tightly-scoped wrapper) so each connector renders at a fixed width regardless of container size. In a Dialog or full-page wizard, constrain the Stepper by **centring**, not by setting a `max-width` on the Stepper itself.
- No more than ~6 steps in a horizontal stepper (Wizard Step extends this to 7 — see [Wizard Step §2](../../../page-templates/wizard-step/usage.md)). If you need more, split the flow or switch to vertical.
- No step label longer than ~3 words. Use a noun phrase ("Map schema"), not a sentence ("Map the columns to types").
- No clickable last step that fires a *different* action than the in-flow Submit — once you reach the terminal step, the flow's Submit button commits; the step itself is just a marker.
- No nested steppers. If a step's content needs sub-steps, redesign as a parent flow with a sub-flow inside its `StepContent` panel.
- No Stepper as the *primary* navigation between top-level pages — Stepper is a progress indicator inside a single task, not a route switcher.
- Nothing outside the Variants list (§5) is valid.

### Conditions
- Each step's `<StepLabel>` must carry a programmatic name — the label text. Screen readers announce "Step *N* of *M*: *<label>*"; screen reader output is broken without a label.
- The active step must carry `aria-current="step"` (MUI's `<Step>` sets this automatically when the index matches `activeStep`).
- **Navigation controls do not belong to this composite.** Back / Next / Submit buttons sit outside the Stepper and are owned by the Wizard pattern (planned reference). The Stepper renders progress only — it never wires `onClick` handlers that advance the flow.
- For **non-linear flows** (`<Stepper nonLinear>` + `<StepButton>`), every step is reachable by clicking the step itself. This is still progress wiring, not navigation chrome — the Wizard pattern decides whether non-linear traversal is the right interaction model.
- For **error states**, set `<StepLabel error>` on the failing step. Keep the error visible on subsequent navigations until the underlying issue is fixed.
- For **vertical with inline content**, only the active step's `<StepContent>` is visible — completed steps collapse back to label-only.
- Persistence — when the active step is part of the page's identity (deep-linkable wizards), wire `activeStep` to a URL param. Otherwise, in-memory state is fine; on unmount the flow resets.
- Lazy step content — when a step's content is heavy (a chart, a fetch), render the content only when its step is active; do not pre-render hidden steps.

## 5. Variants

Stepper is a multi-axis composite. The primary axis is **orientation**; secondary axes are **label placement**, **interaction model**, and **per-step state**. Pick one value per axis.

### 5.1 Orientation

| Variant | `Stepper` props | Use when |
|---|---|---|
| **Horizontal** (default) | `orientation="horizontal"` (default) | Top-of-page progress indicator for a wizard; steps fit one row; per-step content lives below the stepper, not inside it |
| **Vertical** | `orientation="vertical"` | Multi-step form with inline content per step (`<StepContent>`); allows longer labels (~6 words); each step's panel expands inline when active |

### 5.2 Label placement (horizontal only)

| Variant | `Stepper` props | Use when |
|---|---|---|
| **End** (default) | `<Stepper>` (no `alternativeLabel`) | Default — label sits to the right of each step icon; compact; works for short labels |
| **Bottom** | `<Stepper alternativeLabel>` | Equal-weight steps where the trail reads as a horizontal banner; label sits below the icon, centred; gives more breathing room for slightly longer labels |

Vertical orientation has no placement axis — labels always sit to the right of the icon.

### 5.3 Interaction model

| Variant | Stepper / Step markup | Use when |
|---|---|---|
| **Linear** (default) | `<Stepper>` with plain `<Step><StepLabel>…</StepLabel></Step>` children | The user must complete steps in order — wizards, onboarding, signup |
| **Non-linear** | `<Stepper nonLinear>` with `<Step><StepButton onClick={…}>…</StepButton></Step>` | Review-style flows where every step is reachable — the user can revisit prior steps without an explicit "Back" |

### 5.4 Per-step state (named styles per Step)

Steps automatically derive their state from `activeStep` index. The named-style table below covers what each state renders.

| Named style | Trigger | Visual | Notes |
|---|---|---|---|
| **Inactive** | Step index > `activeStep` | Outlined circle, number in `text.disabled`; label in `text.secondary` | Future step — not yet started |
| **Active** | Step index = `activeStep` | Filled circle in `primary.main`, number in white; label in `text.primary` (bold) | Current step — `aria-current="step"` |
| **Completed** | Step index < `activeStep` | Filled circle in `primary.main`, check icon in white; label in `text.primary` | Past step — done |
| **Error** | `<StepLabel error>` | Filled circle in `error.main`, **step number in white** (no glyph swap — colour is the affordance); label in `text.primary` | Step failed — must be fixed before proceeding |
| **Disabled** | `<Step disabled>` | Outlined circle, number in `text.disabled`; label in `text.disabled` | Step is gated; pair with a tooltip explaining why |
| **Optional** | `<StepLabel optional={<Typography variant="caption">Optional</Typography>}>` | Same as Inactive / Active / Completed; adds a `caption` line below the label | Step may be skipped — caption gives the user permission |

### Modifiers — layered on any variant

| Modifier | Pattern | Notes |
|---|---|---|
| **Custom step icon** | `<StepLabel StepIconComponent={MyIcon}>` | Replace the default number with a domain icon. Keep colour bindings — set fill via `StepIconProps={{ sx: { color: … } }}` only on inactive default state, never on active / completed |
| **Hidden connector segment** | `<Stepper connector={null}>` | Drops the connector line entirely — rare; only when the layout already implies sequence (e.g. inside a card with built-in dividers) |
| **URL-bound active step** | `activeStep` reads from `searchParams.get('step')`; "Next" / "Back" write back | Use when the wizard should be deep-linkable |

## 6. Anatomy

The Stepper composite owns the following visible regions. Each is a labelled atom — none are separate base references; they are MUI primitives owned by this composite, the same way `DialogTitle` / `DialogContent` / `DialogActions` are owned by `Dialog`.

- **Stepper container** — `<nav>`-like wrapper; flex row (horizontal) or flex column (vertical); owns padding and gap between steps.
- **Step** — one entry in the trail; combines a step icon, a step label, and (vertical only) an optional content panel.
- **Step icon** — the `24×24` glyph at the leading edge of each step. Default is the step number; flips to a `Check` glyph on completion, an alert glyph on error, or a custom glyph via `StepIconComponent`. Filled circle (active / completed / error), outlined circle (inactive / disabled).
- **Step label** — short noun phrase, `typography.body2`; sits to the right of the icon (default / vertical) or below it (`alternativeLabel`).
- **Optional caption** — `typography.caption` line below the label; used for "Optional" markers or short hints.
- **Step connector (separator)** — the line between two steps. Horizontal stroke (horizontal orientation) or vertical stroke (vertical orientation). Theme owns the colour: `divider` between inactive steps, `primary.main` between completed steps.
- **Step content panel** *(vertical only)* — the inline content (form, preview, instructions) attached to each step; only the active step's panel is visible; collapses on transition.

### Composed of

- `Stepper`, `Step`, `StepLabel`, `StepConnector` — MUI primitives; `Stepper` owns layout, `Step` owns per-item state, `StepLabel` renders the icon + label, `StepConnector` is the line between steps
- `StepContent` — MUI primitive for vertical orientation only; collapsible content panel
- `StepButton` — MUI primitive used inside `<Stepper nonLinear>`; turns the step into a clickable surface
- [Typography](../foundations/typography/usage.md) — `body2` for the label, `caption` for the optional hint
- [Tooltip](../base/tooltip/usage.md) — paired with disabled steps to explain why

Navigation controls (Back / Next / Submit) are **not** part of this composite — they belong to the Wizard pattern (planned reference) that consumes the Stepper alongside step content.

## 7. Custom

### Linear progress trail (horizontal, top-of-page)

The most common shape — a banner of steps above a content region. The Stepper itself only paints progress; the surrounding Wizard pattern owns the active-step content panel and the Back / Next / Submit row beneath it.

```tsx
const steps = ['Connect source', 'Map schema', 'Review', 'Publish'];

<Stepper activeStep={activeStep} aria-label="Source connection flow">
  {steps.map((label) => (
    <Step key={label}><StepLabel>{label}</StepLabel></Step>
  ))}
</Stepper>
```

### Vertical progress trail with inline content

Use `<StepContent>` so each step's form sits inline beneath its label. Only the active step's content is visible.

```tsx
<Stepper activeStep={activeStep} orientation="vertical" aria-label="Create monitor flow">
  <Step>
    <StepLabel>Connect source</StepLabel>
    <StepContent>
      <TextField label="Connection name" />
    </StepContent>
  </Step>
  <Step>
    <StepLabel>Map schema</StepLabel>
    <StepContent>…</StepContent>
  </Step>
</Stepper>
```

### Non-linear (review-style) trail

Make every step reachable. Use `<StepButton>` so the step itself is the affordance — clicking a step sets it as active. This is *progress wiring* (which step is current), not *navigation chrome* (which step the user is *committing* to).

```tsx
<Stepper activeStep={activeStep} nonLinear aria-label="Invite review">
  {steps.map((label, index) => (
    <Step key={label} completed={completed[index]}>
      <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
    </Step>
  ))}
</Stepper>
```

### Error and optional steps

Mark errors via `<StepLabel error>`; mark optional steps via `<StepLabel optional>` with a `caption` Typography. Keep both states visible until the underlying condition is resolved.

```tsx
<Step>
  <StepLabel
    error={validationFailed}
    optional={isOptional ? <Typography variant="caption">Optional</Typography> : undefined}
  >
    Map schema
  </StepLabel>
</Step>
```

### A11y wiring rules

- `aria-label` on the outer `<Stepper>` — required when the surrounding heading does not describe the flow (e.g. "Connect source flow").
- Each `<StepLabel>` carries the visible label as its accessible name — required.
- The active step automatically receives `aria-current="step"` from MUI.
- `<StepButton>` (non-linear mode) is keyboard-focusable; arrow keys do *not* move between steps — Tab does. This matches the WAI-ARIA "stepper as a series of buttons" pattern.
- Disabled steps must pair with a Tooltip explaining why — the visual "this is dimmed" alone is not enough.

### Persistence — URL-bound active step

When the wizard is deep-linkable, wire `activeStep` to a URL param. Keep the param value short and stable (e.g. `?step=2`).

```tsx
const [params, setParams] = useSearchParams();
const activeStep = Number(params.get('step') ?? 0);
const setActiveStep = (next: number) => setParams({ step: String(next) });
```

### Step icon visual

The step icon is a `24×24` filled circle (MUI default `<StepIcon>`):

| State | Background | Content |
|---|---|---|
| Inactive (future step) | `palette.grey[400]` (NEO 2.1: medium grey) | Step number, white |
| Active (current step) | `palette.primary.main` | Step number, white |
| Completed (past step) | `palette.primary.main` | `Check` glyph, white |
| Error | `palette.error.main` | Step number, white — colour change is the affordance, no glyph swap |
| Disabled | `palette.text.disabled` (paler grey) | Step number, white |

**Step icon size is a theme contract, not a call-site responsibility.** The morpheus `MuiStepIcon` override (and its `@repo/ui` mirror in prototype workspaces) locks the icon at `1.5rem` (24×24). The label is always `body2`. Do **not** ship `sx={{ '& .MuiStepIcon-root': { fontSize: … } }}`, do **not** size the icon via `slotProps={{ stepIcon: { sx: { width, height } } }}`, and do **not** wrap `<StepLabel>` children in a `<Typography variant="…">` to upsize the label. Those patterns predate the theme override and are deprecated.

> **Why the override exists.** The base `MuiSvgIcon` override in morpheus sets `root: { fontSize: 'inherit' }`, which kills MUI's default `1.5rem` for `StepIcon` (it ships as `<SvgIcon fontSize="inherit">`). Without an explicit `MuiStepIcon` override, the icon collapses to `body2`'s 13px and inherits the label's font size. The `MuiStepIcon` override restores the 24×24 contract globally so the canonical Example renders correctly with no call-site `sx`.

If the Stepper renders smaller than 24×24 in a consumer app, the **theme** is missing or broken — fix the theme override, not the call site.

**MUI default vs NEO 2.1 — error state.** MUI's stock `<StepIcon>` swaps the step number for a warning glyph when `error` is set. NEO 2.1 keeps the step number and only changes the circle colour to `error.main`. To match Figma in code, override `StepIconComponent` at the call site so the number always renders — keep the rendered circle at `24×24`:

```tsx
import { StepIconProps } from '@mui/material';

function StepNumberIcon({ active, completed, error, icon }: StepIconProps) {
  // Render a 24×24 filled circle whose background flips by state, with the
  // raw `icon` (the step number) inside even when `error` is true.
  // Do NOT scale the circle — the design size is 24×24, full stop.
}

<StepLabel StepIconComponent={StepNumberIcon} error={…}>{label}</StepLabel>
```

**Historical note.** `WizardStepper` (`@alation/data-products/product-ui`) and `StepsSidebar` (`@alation/cde/ui`) carry legacy inline `sx` that bumped the icon size before the morpheus `MuiStepIcon` override existed. Strip that `sx` on next touch — the theme handles sizing now. If you need the NEO-style error icon, copy only the `StepNumberIcon` shape above; do not import the historical size overrides those modules may still carry.

## 8. Mock data content

Placeholder — fill with Alation-domain values when this composite is used in a pilot.

- **Connect a data source** (4 steps, horizontal) — `Choose connector` · `Authenticate` · `Map schema` · `Review`
- **Publish a data product** (5 steps, horizontal) — `Define product` · `Add datasets` · `Standards check` · `Review` · `Publish`
- **Onboarding** (3 steps, horizontal `alternativeLabel`) — `Profile` · `Workspace` · `Invite team`
- **Create monitor** (4 steps, vertical with inline content) — `Pick target` · `Set conditions` · `Schedule` · `Notify`

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Step label | Sentence case noun phrase; ≤ ~3 words | "Map schema" · "Review" |
| Optional caption | Sentence case; one short word/phrase | "Optional" · "Recommended" |
| Outer `aria-label` | Sentence case noun phrase that names the flow | "Source connection flow" |
| Disabled-step tooltip | One short sentence — say *why*, not *what* | "Connect a source first" |

## 11. Example

```tsx
import { Step, StepLabel, Stepper } from '@mui/material';

const steps = ['Connect source', 'Map schema', 'Review', 'Publish'];

// Stepper renders progress only. Wiring `activeStep`, the active step's
// content panel, and the Back / Next / Submit buttons all live in the
// surrounding Wizard pattern (planned reference).
<Stepper activeStep={activeStep} aria-label="Source connection flow">
  {steps.map((label) => (
    <Step key={label}><StepLabel>{label}</StepLabel></Step>
  ))}
</Stepper>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — horizontal default, alternative-label, vertical with inline content, non-linear, and per-step state variants. None of the examples render Back / Next / Submit buttons — those belong to the Wizard pattern.
