---
name: wizard-step
title: Wizard Step
category: page-template
last_updated: 2026-04-29

description: >
  Full-page shape for multi-step ordered tasks (3–7 steps). A wizard-shaped
  header (h1 title on the left, close cross on the right) sits over a centred
  Stepper with fixed gaps between steps, the active step's content fills the
  body in one of three width shapes (small form / standard form / full-width),
  and a sticky footer pins Back on the left with Complete Later and Confirm &
  Continue on the right. Renders inside the full Alation app chrome.
tags: [page-template, wizard, multi-step, flow]

figma_url: "https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3605-10922&t=POCjkdbyTv1HEcMH-1"
code_reference: "./Example.tsx — the canonical, runnable Wizard Step composition. No shared production wrapper; Wizard Step is a composition contract assembled from App Top Header + App Side Bar chrome plus the inline wizard header (h1 title + close cross), centred fixed-gap Stepper, step content in one of three body shapes, and the conditional-render footer described in §6/§7."
example_path: ./Example.tsx

mui_base: none
depends_on_tokens:
  - palette.background.paper
  - palette.background.default
  - palette.divider
  - palette.text.primary
  - palette.text.secondary
  - palette.primary.main
  - palette.neutral.800
  - spacing.3
  - spacing.4
  - typography.h1
  - typography.h2
  - typography.body1
  - typography.body2
  - shape.borderRadius
depends_on_components:
  - AppTopHeader
  - AppSideBar
  - Stepper
  - Button
  - IconButton
  - Box
  - Typography
---

# Wizard Step

## 1. Classification

- **Type:** Page template
- **MUI base:** none (composes design-system components into a fixed page shape inside the app chrome)
- **Figma:** [Wizard Step Page · NEO 2.1](https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO-2.1---Design-System?m=auto&node-id=3605-10922&t=POCjkdbyTv1HEcMH-1)
- **Code:** No shared `<WizardStep>` wrapper. The canonical, runnable composition is [`./Example.tsx`](./Example.tsx) (sibling of this file); production callers assemble the four regions (wizard header, stepper, body, footer) inside the App Top Header + App Side Bar chrome.

## 2. Purpose

A **Wizard Step** is the canonical page shape for one step inside a multi-step ordered task. The user works through **3–7 steps** in sequence — each one heavy enough to deserve its own surface — with the trail of progress visible at the top and the same action row at the bottom on every step. **Two steps** is too few — collapse into a single Form. **Eight or more** is too many — group adjacent steps under fewer parent steps, split into two sequential wizards, or redesign as a sectioned long-form page with a left-side rail. (See §3 *When to use* and §4 *Conditions* for the full step-count rule.)

The shape is fixed: a wizard-shaped header carries an `h1` title on the left and a close cross on the right; a horizontal Stepper with **fixed gaps** between steps sits below it, **centred** in the body's available width; the active step's content fills the body in one of three width shapes; and a sticky footer pins Back, Complete Later, and Confirm & Continue with **conditional rendering** (Back hidden on step 0, Complete Later hidden until draftable data exists, Confirm & Continue disabled until the step is valid). The page renders inside the full Alation app chrome ([App Top Header](../../components/composite/app-top-header/usage.md) + [App Side Bar](../../components/composite/app-side-bar/usage.md)).

## 3. When to use / When not to use

**Use when**
- The task splits into 3–7 ordered, named steps the user must work through in turn ("Connect source", "Map schema", "Review", "Publish")
- Each step is heavy enough to deserve its own surface (a form, a preview, a confirm) — too heavy to stack on one scroll
- The user needs to see the trail of progress and have a stable place to commit / step back / save for later from
- The flow has a clear terminal state — the last step's primary action commits the work
- The user benefits from a "Complete Later" escape route that preserves progress without committing

**Do not use when**
- The task is one-shot — a single form, a single confirm → use a **Form** page or **Dialog** directly
- The task is **only two steps** — collapse into a single Form (with a Divider / sectioned headings) or use two normal page transitions; the wizard chrome is overkill at that depth
- The task is a quick decision the user makes without leaving their current context → use **Dialog**
- The flow has **8 or more steps** — group adjacent steps under fewer parent steps, split into two sequential wizards, or redesign as a sectioned long-form page with a left-side rail
- The user picks one of N parallel views, not a sequence → use **Tabs** on a normal page
- The trail is hierarchical, not sequential → use a normal page with **Page Header** + **Breadcrumb** (Trail shape)
- The task can be completed inline without committing — autosave / live edit makes the wizard chrome (Back, Continue, Complete Later) noise

## 4. Contract

### Guarantees
- The page always renders inside the full app chrome — [App Top Header](../../components/composite/app-top-header/usage.md) on top, [App Side Bar](../../components/composite/app-side-bar/usage.md) on the left. The Wizard Step does **not** use [App Sub Navigation](../../components/composite/app-sub-navigation/usage.md) — the wizard *is* the user's current context, so a contextual sub-nav would compete with the Stepper.
- Inside the white main area, four regions stack top-to-bottom in fixed order: **Wizard header**, **Stepper**, **Step content**, **Footer**.
- The **Wizard header** is inline anatomy specific to this template — it is not a [Page Header](../../components/composite/page-header/usage.md). It carries an `h1` title (`typography.h1`) on the left and a close cross (Custom Library `XIcon` from `@alation/icons-neo`, falling back to lucide-react `X size={20}` inside an [Icon Button](../../components/base/icon-button/usage.md)) on the right. No breadcrumb, no Back-to-parent link, no tabs, no secondary actions.
- The Stepper is **horizontal**, **linear**, and uses **fixed gaps between steps** (it is *not* full-width). The whole Stepper is centred horizontally in the body's available width. The per-step contract is owned by [Stepper](../../components/composite/stepper/usage.md). The Wizard Step wires `activeStep` and renders only the active step's content panel below the Stepper.
- The Step content sits inside the white main area in one of the three **Body shape** variants (§5 Body shape) — `small-form` (≤ 480px), `standard-form` (≤ 720px), or `full-width` (no max). Width is centred in the main area; vertical scrolling is owned by the body, not by the page.
- The Footer is **sticky to the bottom of the white main area** when the body scrolls; it sits inside the page main area and respects the same horizontal padding as the body (`spacing.4` for `full-width`; `spacing.3` minimum otherwise).
- The Footer's button slots are **conditional** (see "Conditions" below). Buttons that are not applicable for the current step are **not rendered** — never disabled-but-visible. Specifically: Back is hidden on step 0; Complete Later is hidden until the user has entered enough data to make a meaningful draft; the only state in which a footer button is visible-and-disabled is **Confirm & Continue**, when the user has not yet provided the step's mandatory information.
- Step progression and exit semantics live in the surrounding state (URL or in-memory) — the page template does not hide them inside an opaque component.

### Prohibitions
- No [Page Header](../../components/composite/page-header/usage.md) inside the Wizard Step — the wizard header is its own inline shape with a different navigation pattern (close cross instead of breadcrumb / actions).
- No breadcrumb of any kind — Trail or Back-to-parent. The user is in a task, not a hierarchy. The close cross is the only exit affordance from the chrome.
- No vertical Stepper. Vertical Stepper exists for inline-content forms; Wizard Step promotes the active step's content into the page body, where the body-shape variants own width.
- **No full-width Stepper.** The Stepper is centred and uses fixed gaps between steps — connectors must not stretch to fill the available width. See [Stepper §6 Anatomy](../../components/composite/stepper/usage.md) and §6 Anatomy below.
- No "Cancel" button in the footer. The close cross at the top is the exit affordance; "Complete Later" is the deferred-save affordance. A separate "Cancel" duplicates one of these.
- No "Save" button in the footer that does the same thing as "Confirm & Continue" — pick one verb per slot.
- No more than three buttons in the footer. The slots are: (Back) · (Complete Later) · Confirm & Continue — Back and Complete Later are conditional; Confirm & Continue is always rendered.
- No primary action on the left of the footer. Primary always sits on the right; Back is the only left-side affordance.
- **No "Back" button on step 0.** Hide it entirely — do not render a disabled Back. The user has nowhere to step back to, and a disabled affordance is noise.
- **No "Complete Later" rendered as disabled** when the user has not yet made a meaningful draft. Hide it; bring it in when the data exists. The only legitimate visible-and-disabled footer state is **Confirm & Continue** while mandatory information is missing.
- "Complete Later" must use the **Blue secondary** named style (outlined blue: `variant="outlined" color="primary"`) — never the Text variant. The visual hierarchy is: Primary (filled) > Blue secondary (outlined blue) > Grey outlined (Back). Text-variant Complete Later flattens the secondary affordance into the page chrome and breaks the hierarchy.
- No `sx` overrides on the footer's surface tokens (background, border, padding, sticky offset) — those are page-template constants, not call-site decisions.
- No content rendered for inactive steps — the body shows the active step only; inactive steps live in component state, not in the DOM, until visited.
- No tabs inside a Wizard Step. Tabs and a Stepper compete for the same affordance.
- No nested Wizard Steps. If a step needs sub-steps, redesign as a parent Wizard with a sub-flow inside its step content (e.g. a sectioned form), not a Wizard inside a Wizard.
- No Wizard Step used as a primary navigation between top-level destinations — wizards are tasks, not routes.
- No exit without confirmation when the user has unsaved changes — see §7 Exit confirmation.
- No hard-coded hex / px / font values inside the page chrome.
- Nothing outside the Slots (§5) and Anatomy (§6) is valid.

### Conditions
- **App chrome.** The page is always rendered with the app chrome wrapping it. Page-template demos render the full chrome; production callers mount the page inside the workspace's `AlationLayout`.
- **Step count.** Wizard Step is right for **3–7 steps**. Two steps → it's a Form, not a wizard. Eight or more → group, split into two sequential wizards, or redesign as a sectioned page with a left-side rail (see §2).
- **Body shape — pick one per wizard.** The shape is set at wizard scope, not per step. If most steps are forms, use `standard-form`; if any step requires a wide surface (data grid, side-by-side preview), use `full-width` for the whole wizard so width does not jump between steps.
- **Wizard title.** `Typography variant="h1"`. Same variant Page Header uses for page titles — see [Page Header §4](../../components/composite/page-header/usage.md). Sentence case, ≤ 6 words, verb phrase that names the task ("Connect a data source", "Publish a data product"). The title sits at the wizard level — never per-step. Per-step titles, if needed, live inside the step's content as `h3`.
- **Close cross.** Closes the wizard. With unsaved changes, surfaces the exit-confirmation Dialog (§7). Without unsaved changes, returns the user to the parent context (e.g. the entity's index page, or wherever they came from).
- **Back button — conditional rendering.**
  - **Step 0 (first step):** **Not rendered.** The user has nowhere to retreat to.
  - **Steps ≥ 1:** Always rendered, always enabled. Validation does not run on Back — the user can retreat from any state.
- **Primary label.** "Confirm & Continue" on every step *except* the last. On the last step the label changes to the verb that commits the work (e.g. "Publish", "Create monitor", "Connect"). Sentence case, ≤ 3 words.
- **Confirm & Continue — disabled state.** Rendered as **disabled** when the active step has mandatory information that the user has not yet provided. As soon as the required fields are valid, the button enables. Disabled is the *only* visible-and-disabled footer state — Back and Complete Later are hidden when not applicable, not disabled.
- **Complete Later — conditional rendering.**
  - **Hidden** until the user has entered enough data on the active step to make a meaningful draft.
  - **Rendered (enabled)** once a draftable amount of data exists, and stays rendered across all subsequent steps.
- **Validation.** "Confirm & Continue" is the gate — it stays disabled until the active step is valid. Pressing it advances (or commits, on last). Server-side validation that fails after the press surfaces inline errors inside the step content; the footer does not surface global errors.
- **Persistence.** When the wizard is deep-linkable, wire `activeStep` to a URL param (`?step=2`) — see Stepper §7 *Persistence — URL-bound active step*. Otherwise, in-memory state is fine; on unmount the flow resets.
- **Exit confirmation.** When the user clicks the close cross with unsaved changes, surface a destructive-confirm [Dialog](../../components/composite/dialog/usage.md): title `"Discard your progress?"`, body explaining unsaved changes will be lost, primary `"Discard"` (destructive variant), secondary `"Keep editing"`. "Complete Later" never asks — it is the safe alternative.
- **Focus management.** When the active step changes (Back / Confirm & Continue), move focus to the step content's first interactive element so keyboard users land where they need to be.
- **Loading state.** When the primary action is async (server commit on the last step, validation that calls a backend), set the primary button's `loading` prop and disable Back + Complete Later for the duration. Never hide the close cross — the user always has an exit.
- **Error state.** If a server commit on the last step fails, restore the footer to its idle state, surface the error inline above the footer (not inside the footer), and keep the user on the last step until they retry.

## 5. Slots

Wizard Step has no visual variant axis on the chrome — every wizard renders the same header / stepper / footer shapes. The configurable axes are the **Body shape** (3 variants) and the four content slots. **Nothing outside this list is valid.**

### 5.1 Body shape — the primary axis

Pick one shape per wizard based on the *widest* step's content. The shape sets the body's `max-width`; the content centres horizontally inside the white main area.

| Shape | `max-width` | Horizontal padding | Use when |
|---|---|---|---|
| **Small form** | `480px` | `spacing.3` (24 px) on the body container; the form centres inside the available width | Single-column input with ≤ 6 fields per step — connect-by-key flows, simple onboarding, narrow choosers |
| **Standard form** | `720px` | `spacing.3` (24 px) on the body container; the form centres inside the available width | Multi-field forms, paired fields, fields with helper text, sectioned forms — the default for most wizards |
| **Full-width** | none (uses the full white main area) | `spacing.4` (32 px) left **and** right per [Layout §5.2 Page-body padding](../../foundations/layout/usage.md) | Steps that need a data grid, a [Table](../../components/composite/table/usage.md) selection, side-by-side previews, file uploaders with drop zones, or any visualisation that demands width |

The shape is set at wizard scope, not per step — width does not change as the user moves between steps. If most steps are `standard-form` and one step needs a grid, choose `full-width` and centre the form-shaped steps inside their own `max-width` wrapper.

### 5.2 Slot table

| Slot | Role | Accepts | Does NOT accept |
|---|---|---|---|
| **Wizard header** (inline) | Title + exit | An `h1` title (`Typography variant="h1"`) on the left + a close cross (`IconButton` with Custom Library `XIcon` — Lucide `X` as fallback) on the right | Page Header; breadcrumb; Back-to-parent link; tabs; secondary actions; status badges |
| **Stepper** | Progress indicator | One horizontal linear [Stepper](../../components/composite/stepper/usage.md) with **3–7 steps**, **centred** with **fixed gaps** between steps; default placement or `alternativeLabel` | Vertical Stepper; non-linear Stepper; full-width Stepper that stretches connectors; `<StepContent>` panels; pure progress bars |
| **Body** | Active step's surface | The active step only — within the body shape (§5.1). Each step typically pairs an `h3` step title + body description with a [Form](../../components/composite/form/usage.md), preview, [Table](../../components/composite/table/usage.md), or other content | Inactive steps' content (don't pre-render); a second nested Wizard; tabs that compete with the Stepper |
| **Footer** | Action row | Up to three buttons in fixed positions: **Back** (left, Grey outlined named style — *hidden on step 0*) · **Complete Later** (right, Blue secondary named style — *hidden until draftable data exists*) · **Confirm & Continue** (right, last, Primary named style — always rendered; disabled until step is valid) | Cancel; Save (use Complete Later); Reset; Help; any 4th button; primary on the left; non-Button affordances; Text-variant Complete Later; **a disabled-but-visible Back; a disabled-but-visible Complete Later** |

### 5.3 Step content shape

Each step's body contents follow a small, consistent shape:

- **Step title** — `Typography variant="h3"`, sentence case, ≤ 4 words, names the step ("Choose a connector", "Authenticate", "Map schema", "Review")
- **Step description** — `Typography variant="body1"`, one or two short sentences explaining what the step is for
- **Step content** — the form, table, preview, or other surface that the user interacts with. Inside the body's width.

This shape applies inside *all three* body-shape variants — the title and description always sit at the top of the body, the content fills below.

## 6. Anatomy

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Logo: Customer]                                          [Avatar]        │ ← App Top Header (navy, customer-customisable logo on the left)
├──┬─────────────────────────────────────────────────────────────────────────┤
│☰ │  ╔═══════════════════════════════════════════════════════════════════╗ │
│▢ │  ║  User flow (Wizard) name                                     ✕    ║ │ ← Wizard header (inline: h1 title + close cross)
│▢ │  ║  ────────────────────────────────────────────────────────────    ║ │
│▢ │  ║                                                                   ║ │
│▢ │  ║              ●─●─●─○─○                                            ║ │ ← Stepper (horizontal, linear, fixed gaps, centred)
│▢ │  ║         Step Step Step Step Step                                  ║ │
│▢ │  ║                                                                   ║ │
│▢ │  ║  ┌─────────────────────────────────────────┐                      ║ │
│  │  ║  │  Step title (h3)                        │  ← Body (within     ║ │
│  │  ║  │  Step description (body1)               │     shape variant)   ║ │
│  │  ║  │  {{ Form / preview / Table content }}   │                      ║ │
│▢ │  ║  └─────────────────────────────────────────┘                      ║ │
│  │  ║  ───────────────────────────────────────────────────────────────  ║ │
│  │  ║  ┌──────┐                  ┌────────────────┐ ┌────────────────┐  ║ │
│  │  ║  │ Back │                  │ Complete Later │ │ Confirm & Cont.│  ║ │ ← Footer (sticky; conditional buttons)
│  │  ║  └──────┘                  └────────────────┘ └────────────────┘  ║ │
│  │  ╚═══════════════════════════════════════════════════════════════════╝ │
└──┴─────────────────────────────────────────────────────────────────────────┘
   ↑ App Side Bar
```

- **App Top Header** (chrome) — the persistent top strip; same on every page; carries the customer-customisable logo on the left and the avatar on the right. Owned by the [App Top Header](../../components/composite/app-top-header/usage.md) reference.
- **App Side Bar** (chrome) — the persistent left rail. Same on every page. Owned by the [App Side Bar](../../components/composite/app-side-bar/usage.md) reference.
- **White main area** — the rounded white surface inside the navy chrome; the wizard fills it.
- **Wizard header region** (inline anatomy) — flex row with `justify-content: space-between`, `align-items: center`; paddings mirror [Page Header](../../components/composite/page-header/usage.md): `pt: 3` (24 px), `px: 3` (24 px), `pb: 2.5` (20 px); `borderBottom: 1px solid divider`. Left: `Typography variant="h1"` carrying the wizard title. Right: `IconButton` with Custom Library `XIcon` (Lucide `X size={20}` as fallback).
- **Stepper region** — flex row, `justify-content: center`. Padding `spacing.3 spacing.3 spacing.4 spacing.3`. The Stepper itself uses **fixed gaps** between steps; it does not stretch to fill the available width. Never has its own border.
- **Body region** — the active step's surface. Container has `flex: 1`, `overflow-y: auto`. Padding follows the body shape: `spacing.3` for `small-form` / `standard-form`, `spacing.4` (left and right) for `full-width` per [Layout](../../foundations/layout/usage.md). Content inside is centred horizontally with the body-shape `max-width`. Step content inside the body uses `h3` + `body1` + content.
- **Footer region** — sticky to the bottom of the white main area; carries a top border (`palette.divider`); horizontal padding matches the body region (`spacing.3` or `spacing.4`); flex row with `justify-content: space-between` (Back left when rendered, the right group with `gap: spacing.2`).

### Composed of

- [App Top Header](../../components/composite/app-top-header/usage.md) — chrome
- [App Side Bar](../../components/composite/app-side-bar/usage.md) — chrome
- [Stepper](../../components/composite/stepper/usage.md) — horizontal, linear, **centred with fixed gaps** (the per-step contract is owned by Stepper)
- [Button](../../components/base/button/usage.md) — Back (Grey outlined named style — with leading [Iconography](../../foundations/iconography/usage.md) `ChevronLeftIcon`), Complete Later (Blue secondary named style — `variant="outlined" color="primary"`), Confirm & Continue / commit verb (Primary named style)
- [Icon Button](../../components/base/icon-button/usage.md) — close cross in the wizard header (Custom Library `XIcon` from `@alation/icons-neo`; Lucide `X` as fallback)
- [Iconography](../../foundations/iconography/usage.md) — Custom Library first (`@alation/icons-neo`), Lucide as backfill — for the close cross, the Back chevron, the [Table](../../components/composite/table/usage.md) row affordances inside `full-width` step content
- [Table](../../components/composite/table/usage.md) — when a step needs a tabular selection inside `full-width`
- [Dialog](../../components/composite/dialog/usage.md) — surfaced for the unsaved-changes exit confirmation
- [Typography](../../foundations/typography/usage.md) — wizard title (`h1`), step title (`h3`), step description (`body1`), step labels (`body2`)

The wizard header and the footer button row are both **inline anatomy** — they have no standalone composite reference because no other element in the system consumes them. Their rules live in §4 Contract, §5 Slots, and §7 Flow rules below.

## 7. Flow rules

### Step progression

The page template owns the `activeStep` index; the Stepper paints from it; the Footer drives it. Only three transitions exist:

- **Forward** — Confirm & Continue is pressed; if the active step is valid, `activeStep` increments. The button itself is disabled until validity is reached, so a press always succeeds. On the last step the same button commits the work.
- **Backward** — Back is pressed; `activeStep` decrements. Validation does not run on Back (the user can always retreat, even from an invalid state).
- **Save & exit** — Complete Later is pressed; the page persists the draft (server-side or local) and routes the user back to the parent context. No validation gate; no Stepper change.

The Stepper itself is **never the navigation** — clicking a step on a horizontal linear Stepper does not advance the wizard. If a non-linear interaction model is needed, the wizard is the wrong template — use a sectioned page with a left-side rail.

### Wizard header rules

- **Layout.** Flex row, `justify-content: space-between`, `align-items: center`. Paddings mirror [Page Header](../../components/composite/page-header/usage.md): `pt: 3` (24 px) top, `px: 3` (24 px) horizontal, `pb: 2.5` (20 px) bottom. Bottom border `1px solid divider`.
- **Title.** `Typography variant="h1"` (same variant Page Header uses). Sentence case, ≤ 6 words, verb phrase that names the task ("Connect a data source", "Publish a data product").
- **Close cross.** [Icon Button](../../components/base/icon-button/usage.md) with `<XIcon />` from `@alation/icons-neo` (Custom Library) or, as a fallback, `<X size={20} />` from `lucide-react`. `aria-label="Close wizard"`. Behaviour: with unsaved changes → exit-confirmation Dialog; without unsaved changes → route back to parent context. **No** Back-to-parent breadcrumb, **no** chevron-left affordance — the close cross is the only exit, and it always sits on the right side of the wizard header.

### Stepper rules

- **Centred, fixed-gap.** The Stepper is wrapped in a flex container with `justify-content: center` and is **not** allowed to stretch to fill the body's width. Connectors between steps are fixed-width — see [Stepper §6 Anatomy](../../components/composite/stepper/usage.md) and §7 *Linear progress trail*.
- **Step count.** 3–7 steps. Fewer → not a wizard; more → group / split (see §2).
- **No `<StepContent>`.** Inactive steps live in component state until activated; the body region renders only the active step.

### Footer rules

- **Layout.** Flex row, `justify-content: space-between`. Back sits in a left flex item *when rendered*; Complete Later + Confirm & Continue sit in a right flex item with a `gap` between them (`spacing.2`).
- **Sticky behaviour.** The footer is `position: sticky; bottom: 0` inside the white main area; it carries a top border (`palette.divider`) and the `palette.background.paper` so the body scrolls *behind* it without bleeding through.
- **Padding.** Vertical: `spacing.2`. Horizontal: matches the body region (`spacing.3` for small / standard; `spacing.4` for full-width).
- **Back button.**
  - **Hidden on step 0** — do not render. Hiding is intentional: a disabled Back on the first step is noise, not affordance. The right-side group remains pinned to the right via `justify-content: space-between` even when the left slot is empty (use a placeholder `<Box />` with `flex: 0 0 auto` if needed to preserve geometry).
  - **Rendered on steps ≥ 1**, always enabled. Uses Button **Grey outlined** named style — neutral, low-emphasis. Carries a leading `ChevronLeftIcon` per Iconography.
  - Label is the literal word **"Back"** (sentence case). Never "Previous", never an icon-only chevron.
- **Complete Later.**
  - **Hidden until the user has entered enough data on the active step to make a meaningful draft.** Once it appears, it stays rendered across all subsequent steps. Never rendered as disabled-and-visible — the slot is empty until the data exists.
  - Uses Button **Blue secondary** named style — `variant="outlined" color="primary"`. **Never the Text variant.** This keeps the visual hierarchy explicit: Primary (filled) > Blue secondary (outlined blue) > Grey outlined (Back).
  - Label is **"Complete Later"** (sentence case). Verbatim — not "Save and exit", not "Save draft".
- **Confirm & Continue.**
  - Always rendered.
  - Uses Button **Primary** named style (`variant="contained"`).
  - Label is **"Confirm & Continue"** on every step except the last. On the last step, the label changes to the commit verb (e.g. "Publish", "Create monitor", "Connect"). Sentence case, ≤ 3 words.
  - **Disabled** until the active step's mandatory information is provided. The button enables as soon as the required fields are valid; pressing it then advances (or commits, on last). Server-side validation that fails after a press surfaces inline errors inside the step content; the button returns to its idle state.
  - For async commits, set `loading` and disable Back + Complete Later until resolved.

### Exit confirmation

The close cross in the wizard header is the only "leave the wizard without finishing" affordance. When clicked:

- **No unsaved changes** — route immediately to the parent context.
- **Unsaved changes** — surface a destructive-confirm [Dialog](../../components/composite/dialog/usage.md): title `"Discard your progress?"`, body explaining that unsaved changes will be lost, primary action `"Discard"` (destructive variant), secondary action `"Keep editing"`. If the user confirms, route to parent; otherwise stay.

"Complete Later" never asks — it is the safe alternative that persists the draft.

### Focus management

- **On step change** (Back or Confirm & Continue), move focus to the first interactive element inside the new step's content. This avoids a focus jump back to the page top and keeps keyboard flow smooth.
- **On exit-confirmation Dialog open**, focus moves to the Dialog's primary action per the Dialog contract.
- **On error**, focus moves to the first invalid field — owned by the Form / Field contract, not by the wizard.

### Persistence

- **In-memory** (default) — `activeStep` and step data live in component state. On unmount the flow resets. Right for short wizards inside a single session.
- **URL-bound** — `activeStep` reads from `searchParams.get('step')`; transitions write back. Right for deep-linkable wizards (the user can refresh / share / reopen a step).
- **Server-bound (drafts)** — Complete Later persists the partial state to the backend; reopening the wizard hydrates from the draft and lands the user on the step they left. Right for long, high-stakes flows where session loss is unacceptable.

Pick one mode per wizard; do not mix.

### A11y wiring rules

- The wizard title (`h1`) is the page's accessible name — required.
- The Stepper carries an `aria-label` describing the flow (see Stepper §7) — required.
- The close cross IconButton carries `aria-label="Close wizard"` — required.
- The Footer is a `<footer>` landmark with `aria-label` matching the flow ("Wizard actions: Connect a source"). One landmark per wizard.
- Confirm & Continue's `aria-label` includes the destination step on non-terminal steps when the visible label is generic ("Confirm & Continue, go to Map schema") — optional, used when screen-reader clarity beats brevity.
- When Back is rendered (steps ≥ 1), it is keyboard-focusable. On step 0 it is not in the DOM — there is nothing to focus, so no announcement of "back, disabled" is made; this is intentional.
- The exit-confirmation Dialog inherits the Dialog contract for focus trap, Escape close, and focus restoration.

## 8. Mock data content

Placeholder — fill with Alation-domain values when this template is used in a pilot. Candidates:

- **Connect a data source** (4 steps, `standard-form`) — `Choose connector` · `Authenticate` · `Map schema` · `Review`. Last-step commit: "Connect".
- **Publish a data product** (5 steps, `full-width` — needs a Table on Add datasets) — `Define product` · `Add datasets` · `Standards check` · `Review` · `Publish`. Last-step commit: "Publish".
- **Create monitor** (4 steps, `standard-form`) — `Pick target` · `Set conditions` · `Schedule` · `Notify`. Last-step commit: "Create monitor".
- **Build agent** (3 steps, `small-form`) — `Profile` · `Tools` · `Review`. Last-step commit: "Build agent".

## 10. UX Copy

| Element | Rule | Example |
|---|---|---|
| Wizard title (`h2`) | Sentence case; ≤ 6 words; verb phrase | "Connect a data source" · "Publish a data product" |
| Close cross `aria-label` | "Close wizard" | — |
| Stepper labels | Sentence case noun phrase; ≤ 3 words | "Map schema" · "Review" |
| Step title (`h3`) | Sentence case; ≤ 4 words; names the step | "Choose a connector" |
| Step description (`body1`) | One or two short sentences | "Pick the data source you'd like to register." |
| Back button | Literal word | "Back" |
| Complete Later button | Verbatim | "Complete Later" |
| Confirm & Continue (non-terminal) | Verbatim | "Confirm & Continue" |
| Confirm & Continue (last step) | Sentence case verb phrase; ≤ 3 words; commits the work | "Publish" · "Create monitor" · "Connect" |
| Stepper `aria-label` | Sentence case noun phrase that names the flow | "Source connection flow" |
| Footer `aria-label` | "Wizard actions: <flow name>" | "Wizard actions: Connect a source" |
| Discard-changes Dialog title | Question form; sentence case | "Discard your progress?" |
| Discard-changes Dialog primary | Destructive verb; sentence case | "Discard" |
| Discard-changes Dialog secondary | Sentence case; safe alternative | "Keep editing" |

## 11. Example

```tsx
<AlationLayout>
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, px: 3, pb: 2.5, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h1">Connect a data source</Typography>
      <IconButton aria-label="Close wizard" onClick={onClose}><XIcon /></IconButton>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 3 }}>
      <Stepper activeStep={activeStep} aria-label="Source connection flow">
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
    </Box>

    <Box component="main" sx={{ flex: 1, overflowY: 'auto', px: bodyShape === 'full' ? 4 : 3, pb: 3 }}>
      <Box sx={{ maxWidth: bodyShape === 'full' ? 'none' : 720, mx: 'auto' }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Authenticate</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter the credentials for the connector.
        </Typography>
        {renderStepContent(activeStep)}
      </Box>
    </Box>

    <Box component="footer" aria-label={`Wizard actions: ${flowName}`}
      sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', px: bodyShape === 'full' ? 4 : 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {activeStep > 0
        ? <Button variant="outlined" color="inherit" startIcon={<ChevronLeftIcon />} onClick={onBack}>Back</Button>
        : <Box />
      }
      <Stack direction="row" spacing={2}>
        {hasDraftableData && (
          <Button variant="outlined" color="primary" onClick={onCompleteLater}>
            Complete Later
          </Button>
        )}
        <Button variant="contained" onClick={onConfirmContinue} disabled={!isStepValid}>
          {isLastStep ? commitVerb : 'Confirm & Continue'}
        </Button>
      </Stack>
    </Box>
  </Box>
</AlationLayout>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — full chrome (App Top Header + App Side Bar) wrapping the wizard, three body-shape variants showcased across the steps, conditional footer buttons (Back hidden on step 0, Complete Later hidden until draftable data exists, Confirm & Continue disabled until the step is valid), and unsaved-changes exit confirmation.
