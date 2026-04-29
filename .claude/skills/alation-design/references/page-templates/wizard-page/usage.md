---
name: wizard-page
title: Wizard Page
category: page-template
last_updated: 2026-04-28

description: >
  Full-page shape for multi-step ordered tasks (2–~6 steps). A wizard-shaped
  header (h2 title on the left, close cross on the right) sits over a Stepper,
  the active step's content fills the body in one of three width shapes
  (small form / standard form / full-width), and a sticky footer pins Back on
  the left with Complete Later and Confirm & Continue on the right. Renders
  inside the full Alation app chrome.
tags: [page-template, wizard, multi-step, flow]

figma_url: ""
code_reference: "block/Example.tsx — no production wrapper. Wizard Page is a composition contract; consumers assemble it from the App Top Header + App Side Bar chrome, plus an inline wizard header (title + close cross), Stepper, step content, and the inline footer described in §6/§7."
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
  - typography.h2
  - typography.body1
  - typography.body2
  - shape.borderRadius
depends_on_components:
  - AppTopHeader
  - AppSideBar
  - AppSubNavigation
  - Stepper
  - Button
  - IconButton
  - Box
  - Typography
---

# Wizard Page

## 1. Classification

- **Type:** Page template
- **MUI base:** none (composes design-system components into a fixed page shape inside the app chrome)
- **Figma:** Not yet — Wizard Page is code-first; the composition contract is captured in this reference
- **Code:** No shared `<WizardPage>` wrapper. The composition lives in `block/Example.tsx`; production callers assemble the four regions (wizard header, stepper, body, footer) inside the App Top Header + App Side Bar chrome.

## 2. Purpose

A **Wizard Page** is the canonical shape for a multi-step ordered task that does not fit on a single form. The user works through 2–~6 steps in sequence — each one heavy enough to deserve its own surface — with the trail of progress visible at the top and the same action row at the bottom on every step.

The shape is fixed: a wizard-shaped header carries an `h2` title on the left and a close cross on the right; a horizontal Stepper sits below it; the active step's content fills the body in one of three width shapes; and a sticky footer pins Back, Complete Later, and Confirm & Continue. The page renders inside the full Alation app chrome ([App Top Header](../../components/composite/app-top-header/usage.md) + [App Side Bar](../../components/composite/app-side-bar/usage.md)).

## 3. When to use / When not to use

**Use when**
- The task splits into 2–~6 ordered, named steps the user must work through in turn ("Connect source", "Map schema", "Review", "Publish")
- Each step is heavy enough to deserve its own surface (a form, a preview, a confirm) — too heavy to stack on one scroll
- The user needs to see the trail of progress and have a stable place to commit / step back / save for later from
- The flow has a clear terminal state — the last step's primary action commits the work
- The user benefits from a "Complete Later" escape route that preserves progress without committing

**Do not use when**
- The task is one-shot — a single form, a single confirm → use a **Form** page or **Dialog** directly
- The task is a quick decision the user makes without leaving their current context → use **Dialog**
- The flow has more than ~6 steps — split into a parent grouping, redesign as a long-form page, or move to a left-side rail
- The user picks one of N parallel views, not a sequence → use **Tabs** on a normal page
- The trail is hierarchical, not sequential → use a normal page with **Page Header** + **Breadcrumb** (Trail shape)
- The task can be completed inline without committing — autosave / live edit makes the wizard chrome (Back, Continue, Complete Later) noise

## 4. Contract

### Guarantees
- The page always renders inside the full app chrome — [App Top Header](../../components/composite/app-top-header/usage.md) on top, [App Side Bar](../../components/composite/app-side-bar/usage.md) on the left. The Wizard Page does **not** use [App Sub Navigation](../../components/composite/app-sub-navigation/usage.md) — the wizard *is* the user's current context, so a contextual sub-nav would compete with the Stepper.
- Inside the white main area, four regions stack top-to-bottom in fixed order: **Wizard header**, **Stepper**, **Step content**, **Footer**.
- The **Wizard header** is inline anatomy specific to this template — it is not a [Page Header](../../components/composite/page-header/usage.md). It carries an `h2` title (`typography.h2`) on the left and a close cross (lucide-react `X size={20}` inside an [Icon Button](../../components/base/icon-button/usage.md)) on the right. No breadcrumb, no Back-to-parent link, no tabs, no secondary actions.
- The Stepper is **horizontal**, **linear**, with the per-step contract owned by [Stepper](../../components/composite/stepper/usage.md). The Wizard Page wires `activeStep` and renders only the active step's content panel below the Stepper.
- The Step content sits inside the white main area in one of the three **Body shape** variants (§5 Body shape) — `small-form` (≤ 480px), `standard-form` (≤ 720px), or `full-width` (no max). Width is centred in the main area; vertical scrolling is owned by the body, not by the page.
- The Footer is **sticky to the bottom of the white main area** when the body scrolls; it sits inside the page main area and respects the same horizontal padding as the body (`spacing.3` minimum).
- The Footer always has three buttons in fixed positions: **Back** (left, [Button](../../components/base/button/usage.md) **Grey outlined** named style) · **Complete Later** (right, Button **Blue secondary** named style — `variant="outlined" color="primary"`) · **Confirm & Continue** (right, last, Button **Primary** named style). Same three slots render on every step — only Back's `disabled` state and the primary button's label vary.
- Step progression and exit semantics live in the surrounding state (URL or in-memory) — the page template does not hide them inside an opaque component.

### Prohibitions
- No [Page Header](../../components/composite/page-header/usage.md) inside the Wizard Page — the wizard header is its own inline shape with a different navigation pattern (close cross instead of breadcrumb / actions).
- No breadcrumb of any kind — Trail or Back-to-parent. The user is in a task, not a hierarchy. The close cross is the only exit affordance from the chrome.
- No vertical Stepper. Vertical Stepper exists for inline-content forms; Wizard Page promotes the active step's content into the page body, where the body-shape variants own width.
- No "Cancel" button in the footer. The close cross at the top is the exit affordance; "Complete Later" is the deferred-save affordance. A separate "Cancel" duplicates one of these.
- No "Save" button in the footer that does the same thing as "Confirm & Continue" — pick one verb per slot.
- No more than three buttons in the footer. The slots are fixed: Back · (gap) · Complete Later · Confirm & Continue.
- No primary action on the left of the footer. Primary always sits on the right; Back is the only left-side affordance.
- "Complete Later" must use the **Blue secondary** named style (outlined blue: `variant="outlined" color="primary"`) — never the Text variant. The visual hierarchy is: Primary (filled) > Blue secondary (outlined blue) > Grey outlined (Back). Text-variant Complete Later flattens the secondary affordance into the page chrome and breaks the hierarchy.
- No `sx` overrides on the footer's surface tokens (background, border, padding, sticky offset) — those are page-template constants, not call-site decisions.
- No content rendered for inactive steps — the body shows the active step only; inactive steps live in component state, not in the DOM, until visited.
- No tabs inside a Wizard Page. Tabs and a Stepper compete for the same affordance.
- No nested Wizard Pages. If a step needs sub-steps, redesign as a parent Wizard with a sub-flow inside its step content (e.g. a sectioned form), not a Wizard inside a Wizard.
- No Wizard Page used as a primary navigation between top-level destinations — wizards are tasks, not routes.
- No exit without confirmation when the user has unsaved changes — see §7 Exit confirmation.
- No hard-coded hex / px / font values inside the page chrome.
- Nothing outside the Slots (§5) and Anatomy (§6) is valid.

### Conditions
- **App chrome.** The page is always rendered with the app chrome wrapping it. Page-template demos render the full chrome; production callers mount the page inside the workspace's `AlationLayout`.
- **Step count.** Wizard Page is right for 2–~6 steps. Fewer than two → it's a Form, not a wizard. More than six → split or rethink.
- **Body shape — pick one per wizard.** The shape is set at wizard scope, not per step. If most steps are forms, use `standard-form`; if any step requires a wide surface (data grid, side-by-side preview), use `full-width` for the whole wizard so width does not jump between steps.
- **Wizard title.** `Typography variant="h2"`. Sentence case, ≤ 6 words, verb phrase that names the task ("Connect a data source", "Publish a data product"). The title sits at the wizard level — never per-step. Per-step titles, if needed, live inside the step's content as `h3`.
- **Close cross.** Closes the wizard. With unsaved changes, surfaces the exit-confirmation Dialog (§7). Without unsaved changes, returns the user to the parent context (e.g. the entity's index page, or wherever they came from).
- **Back button.** Visible on every step. **Disabled** on step 0 (the first step) — never hidden, so the footer's geometry is stable across steps. Re-enabled on step ≥ 1.
- **Primary label.** "Confirm & Continue" on every step *except* the last. On the last step the label changes to the verb that commits the work (e.g. "Publish", "Create monitor", "Connect"). Sentence case, ≤ 3 words.
- **Complete Later.** Visible on every step. Disabled on step 0 until the user has entered enough data to make a meaningful draft; once enabled, stays enabled across all subsequent steps. Never hidden — the slot is always rendered so the layout is stable.
- **Validation.** "Confirm & Continue" is the gate — pressing it validates the active step and only advances on success. Failed validation surfaces inline errors inside the step content; the footer does not surface global errors.
- **Persistence.** When the wizard is deep-linkable, wire `activeStep` to a URL param (`?step=2`) — see Stepper §7 *Persistence — URL-bound active step*. Otherwise, in-memory state is fine; on unmount the flow resets.
- **Exit confirmation.** When the user clicks the close cross with unsaved changes, surface a destructive-confirm [Dialog](../../components/composite/dialog/usage.md): title `"Discard your progress?"`, body explaining unsaved changes will be lost, primary `"Discard"` (destructive variant), secondary `"Keep editing"`. "Complete Later" never asks — it is the safe alternative.
- **Focus management.** When the active step changes (Back / Confirm & Continue), move focus to the step content's first interactive element so keyboard users land where they need to be.
- **Loading state.** When the primary action is async (server commit on the last step, validation that calls a backend), set the primary button's `loading` prop and disable Back + Complete Later for the duration. Never hide the close cross — the user always has an exit.
- **Error state.** If a server commit on the last step fails, restore the footer to its idle state, surface the error inline above the footer (not inside the footer), and keep the user on the last step until they retry.

## 5. Slots

Wizard Page has no visual variant axis on the chrome — every wizard renders the same header / stepper / footer shapes. The configurable axes are the **Body shape** (3 variants) and the four content slots. **Nothing outside this list is valid.**

### 5.1 Body shape — the primary axis

Pick one shape per wizard based on the *widest* step's content. The shape sets the body's `max-width`; the content centres horizontally inside the white main area.

| Shape | `max-width` | Use when |
|---|---|---|
| **Small form** | `480px` | Single-column input with ≤ 6 fields per step — connect-by-key flows, simple onboarding, narrow choosers |
| **Standard form** | `720px` | Multi-field forms, paired fields, fields with helper text, sectioned forms — the default for most wizards |
| **Full-width** | none (uses the full white main area, with `spacing.3` horizontal padding) | Steps that need a data grid, a Table selection, side-by-side previews, file uploaders with drop zones, or any visualisation that demands width |

The shape is set at wizard scope, not per step — width does not change as the user moves between steps. If most steps are `standard-form` and one step needs a grid, choose `full-width` and centre the form-shaped steps inside their own `max-width` wrapper.

### 5.2 Slot table

| Slot | Role | Accepts | Does NOT accept |
|---|---|---|---|
| **Wizard header** (inline) | Title + exit | An `h2` title (`Typography variant="h2"`) on the left + a close cross (`IconButton` with lucide `X`) on the right | Page Header; breadcrumb; Back-to-parent link; tabs; secondary actions; status badges |
| **Stepper** | Progress indicator | One horizontal linear [Stepper](../../components/composite/stepper/usage.md) with 2–~6 steps; default placement or `alternativeLabel` | Vertical Stepper; non-linear Stepper; `<StepContent>` panels; pure progress bars |
| **Body** | Active step's surface | The active step only — within the body shape (§5.1). Each step typically pairs an `h3` step title + body description with a [Form](../../components/composite/form/usage.md), preview, [Table](../../components/composite/table/usage.md), or other content | Inactive steps' content (don't pre-render); a second nested Wizard; tabs that compete with the Stepper |
| **Footer** | Action row | Three buttons in fixed positions: **Back** (left, Grey outlined named style) · **Complete Later** (right, Blue secondary named style — `variant="outlined" color="primary"`) · **Confirm & Continue** (right, last, Primary named style) | Cancel; Save (use Complete Later); Reset; Help; any 4th button; primary on the left; non-Button affordances; Text-variant Complete Later |

### 5.3 Step content shape

Each step's body contents follow a small, consistent shape:

- **Step title** — `Typography variant="h3"`, sentence case, ≤ 4 words, names the step ("Choose a connector", "Authenticate", "Map schema", "Review")
- **Step description** — `Typography variant="body1"`, one or two short sentences explaining what the step is for
- **Step content** — the form, table, preview, or other surface that the user interacts with. Inside the body's width.

This shape applies inside *all three* body-shape variants — the title and description always sit at the top of the body, the content fills below.

## 6. Anatomy

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Logo]   ┌────────┐                          [Settings] [Avatar]          │ ← App Top Header (navy, customer-customisable logo)
│           │ Search │                                                       │
│           └────────┘                                                       │
├──┬─────────────────────────────────────────────────────────────────────────┤
│☰ │  ╔═══════════════════════════════════════════════════════════════════╗ │
│▢ │  ║                                                                   ║ │
│▢ │  ║  Connect a data source                                       ✕    ║ │ ← Wizard header (inline: h2 title + close)
│▢ │  ║  ────────────────────────────────────────────────────────────    ║ │
│▢ │  ║  ●─────────●─────────○─────────○                                  ║ │ ← Stepper (horizontal, linear)
│▢ │  ║  Choose     Authent.   Map        Review                          ║ │
│▢ │  ║                                                                   ║ │
│▢ │  ║  ┌─────────────────────────────────────────┐                      ║ │
│▢ │  ║  │  Step title (h3)                        │  ← Body (within     ║ │
│  │  ║  │  Step description (body1)               │     shape variant)   ║ │
│  │  ║  │                                         │                      ║ │
│  │  ║  │  {{ Form / preview / grid content }}    │                      ║ │
│  │  ║  └─────────────────────────────────────────┘                      ║ │
│▢ │  ║                                                                   ║ │
│  │  ║  ───────────────────────────────────────────────────────────────  ║ │
│  │  ║  ┌──────┐                  ┌────────────────┐ ┌────────────────┐  ║ │
│  │  ║  │ Back │                  │ Complete Later │ │ Confirm & Cont.│  ║ │ ← Footer (sticky)
│  │  ║  └──────┘                  └────────────────┘ └────────────────┘  ║ │
│  │  ╚═══════════════════════════════════════════════════════════════════╝ │
└──┴─────────────────────────────────────────────────────────────────────────┘
   ↑ App Side Bar
```

- **App Top Header** (chrome) — the persistent top strip; same on every page. Owned by the [App Top Header](../../components/composite/app-top-header/usage.md) reference.
- **App Side Bar** (chrome) — the persistent left rail. Owned by the [App Side Bar](../../components/composite/app-side-bar/usage.md) reference.
- **White main area** — the rounded white surface inside the navy chrome; the wizard fills it.
- **Wizard header region** (inline anatomy) — flex row with `justify-content: space-between`, `align-items: center`; padding `spacing.3` horizontal, `spacing.2.5` vertical; `borderBottom: 1px solid divider`. Left: `Typography variant="h2"` carrying the wizard title. Right: `IconButton` with `X size={20}` from lucide-react.
- **Stepper region** — horizontal trail; `padding: spacing.3 spacing.3 spacing.4 spacing.3`; never has its own border.
- **Body region** — the active step's surface. Container has `flex: 1`, `overflow-y: auto`, `padding: spacing.3`. Content inside is centred horizontally with the body-shape `max-width`. Step content inside the body uses `h3` + `body1` + content.
- **Footer region** — sticky to the bottom of the white main area; carries a top border (`palette.divider`); horizontal padding matches the body container (`spacing.3`); flex row with `justify-content: space-between` (Back left, the two right buttons grouped with `gap: spacing.2`).

### Composed of

- [App Top Header](../../components/composite/app-top-header/usage.md) — chrome
- [App Side Bar](../../components/composite/app-side-bar/usage.md) — chrome
- [Stepper](../../components/composite/stepper/usage.md) — horizontal, linear; per-step contract owned by Stepper, not by this template
- [Button](../../components/base/button/usage.md) — Back (Grey outlined named style), Complete Later (Blue secondary named style — `variant="outlined" color="primary"`), Confirm & Continue / commit verb (Primary named style)
- [Icon Button](../../components/base/icon-button/usage.md) — close cross in the wizard header
- [Dialog](../../components/composite/dialog/usage.md) — surfaced for the unsaved-changes exit confirmation
- [Typography](../../foundations/typography/usage.md) — wizard title (`h2`), step title (`h3`), step description (`body1`), step labels (`body2`)

The wizard header and the footer button row are both **inline anatomy** — they have no standalone composite reference because no other element in the system consumes them. Their rules live in §4 Contract, §5 Slots, and §7 Flow rules below.

## 7. Flow rules

### Step progression

The page template owns the `activeStep` index; the Stepper paints from it; the Footer drives it. Only three transitions exist:

- **Forward** — Confirm & Continue is pressed; if validation passes, `activeStep` increments. On the last step the same button commits the work.
- **Backward** — Back is pressed; `activeStep` decrements. Validation does not run on Back (the user can always retreat, even from an invalid state).
- **Save & exit** — Complete Later is pressed; the page persists the draft (server-side or local) and routes the user back to the parent context. No validation gate; no Stepper change.

The Stepper itself is **never the navigation** — clicking a step on a horizontal linear Stepper does not advance the wizard. If a non-linear interaction model is needed, the wizard is the wrong template — use a sectioned page with a left-side rail.

### Wizard header rules

- **Layout.** Flex row, `justify-content: space-between`, `align-items: center`. Padding `spacing.3` horizontal, `spacing.2.5` vertical. Bottom border `1px solid divider`.
- **Title.** `Typography variant="h2"`. Sentence case, ≤ 6 words, verb phrase that names the task ("Connect a data source", "Publish a data product").
- **Close cross.** [Icon Button](../../components/base/icon-button/usage.md) with `<X size={20} />` from lucide-react. `aria-label="Close wizard"`. Behaviour: with unsaved changes → exit-confirmation Dialog; without unsaved changes → route back to parent context. **No** Back-to-parent breadcrumb, **no** chevron-left affordance — the close cross is the only exit, and it always sits on the right side of the wizard header.

### Footer rules

- **Layout.** Flex row, `justify-content: space-between`. Back sits in a left flex item; Complete Later + Confirm & Continue sit in a right flex item with a `gap` between them (`spacing.2`).
- **Sticky behaviour.** The footer is `position: sticky; bottom: 0` inside the white main area; it carries a top border (`palette.divider`) and the `palette.background.paper` so the body scrolls *behind* it without bleeding through.
- **Padding.** Vertical: `spacing.2`. Horizontal: matches the body region (`spacing.3`).
- **Back button.**
  - Always rendered.
  - **Disabled** on step 0 (first step) — never hidden. Hiding would shift Complete Later / Confirm & Continue into the left flex item, breaking the layout's stability across steps.
  - Uses Button **Grey outlined** named style — neutral, low-emphasis.
  - Label is the literal word **"Back"** (sentence case). Never "Previous", never an icon-only chevron.
- **Complete Later.**
  - Always rendered.
  - Uses Button **Blue secondary** named style — `variant="outlined" color="primary"`. **Never the Text variant.** This keeps the visual hierarchy explicit: Primary (filled) > Blue secondary (outlined blue) > Grey outlined (Back).
  - Label is **"Complete Later"** (sentence case). Verbatim — not "Save and exit", not "Save draft".
  - Disabled until the user has entered enough data on step 0 to make a meaningful draft. Once enabled, stays enabled across all subsequent steps.
- **Confirm & Continue.**
  - Always rendered.
  - Uses Button **Primary** named style (`variant="contained"`).
  - Label is **"Confirm & Continue"** on every step except the last. On the last step, the label changes to the commit verb (e.g. "Publish", "Create monitor", "Connect"). Sentence case, ≤ 3 words.
  - Pressing it validates the active step. On success: advance (or commit, on last). On failure: surface inline errors inside the step content; the button returns to its idle state.
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

- The wizard title (`h2`) is the page's accessible name — required.
- The Stepper carries an `aria-label` describing the flow (see Stepper §7) — required.
- The close cross IconButton carries `aria-label="Close wizard"` — required.
- The Footer is a `<footer>` landmark with `aria-label` matching the flow ("Wizard actions: Connect a source"). One landmark per wizard.
- Confirm & Continue's `aria-label` includes the destination step on non-terminal steps when the visible label is generic ("Confirm & Continue, go to Map schema") — optional, used when screen-reader clarity beats brevity.
- The Back button is keyboard-focusable on every step, including step 0 where it is disabled (so its presence is announced).
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h2">Connect a data source</Typography>
      <IconButton aria-label="Close wizard" onClick={onClose}><X size={20} /></IconButton>
    </Box>

    <Box sx={{ px: 3, py: 3 }}>
      <Stepper activeStep={activeStep} aria-label="Source connection flow">
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
    </Box>

    <Box component="main" sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 3 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>  {/* standard-form body shape */}
        <Typography variant="h3" sx={{ mb: 1 }}>Authenticate</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter the credentials for the connector.
        </Typography>
        {renderStepContent(activeStep)}
      </Box>
    </Box>

    <Box component="footer" aria-label={`Wizard actions: ${flowName}`}
      sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={onBack}>Back</Button>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" color="primary" onClick={onCompleteLater} disabled={!hasDraftableData}>
          Complete Later
        </Button>
        <Button variant="contained" onClick={onConfirmContinue}>
          {isLastStep ? commitVerb : 'Confirm & Continue'}
        </Button>
      </Stack>
    </Box>
  </Box>
</AlationLayout>
```

See [`Example.tsx`](./Example.tsx) for the canonical, runnable source — full chrome (App Top Header + App Side Bar) wrapping the wizard, three body-shape variants showcased across the steps, footer state changes across steps, and unsaved-changes exit confirmation.
