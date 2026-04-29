---
name: theme-bundle
title: Theme bundle
category: meta
last_updated: 2026-04-28

description: >
  Runtime prerequisite for the alation-design skill. Every override file a
  `usage.md` attributes to "the morpheus theme" has its canonical mirror in
  this folder. Consumer prototype workspaces (vibe-design,
  design-playground) mirror these files into their own `componentOverrides`
  barrel so the call-site code in `Example.tsx` renders correctly.
tags: [meta, theme, runtime, prerequisite]
---

# Theme bundle — runtime prerequisite

The `references/` folder contains three artefacts per element:

- `usage.md` — the rule book.
- `Example.tsx` — call-site code (what a developer writes on a page).
- `preview.html` — static visual preview.

For ~24 of 30 elements, none of those three files alone makes the element
render correctly. They depend on a **theme override** registered globally
via MUI's `createTheme({ components: { MuiX: { ... } } })`. Production
ships those overrides in `@alation/fabric-theme-morpheus`. **This folder is
the canonical mirror of those overrides** so the skill is self-contained.

## Mapping rule

When a `usage.md` says *"owned by the morpheus theme"* or its
`code_reference:` frontmatter cites `MuiX.overrides.ts/tsx`, the file at
the same basename lives in this folder.

| usage.md cites | Bundled file |
|---|---|
| `MuiButton.overrides.ts` | `references/theme/MuiButton.overrides.ts` |
| `MuiChip.overrides.ts` | `references/theme/MuiChip.overrides.ts` |
| `ColorPalette.overrides.ts` | `references/theme/ColorPalette.overrides.ts` |
| `MuiStepIcon.overrides.ts` | `references/theme/MuiStepIcon.overrides.ts` ← authored here, see notes |
| (any other `MuiX.overrides.ts/tsx`) | `references/theme/MuiX.overrides.ts/tsx` |

If a `usage.md` cites an override file that is **not** in this folder, see
"Known gaps" below. Do not fabricate one.

## Bundled files (26)

| File | Source | Used by |
|---|---|---|
| `ColorPalette.overrides.ts` | morpheus mirror | colours, every component that uses palette tokens |
| `MuiAccordion.overrides.ts` | morpheus mirror | accordion |
| `MuiAlert.overrides.tsx` | morpheus mirror | alert |
| `MuiBreadcrumbs.overrides.tsx` | morpheus mirror | breadcrumb |
| `MuiButton.overrides.ts` | morpheus mirror | button |
| `MuiCard.overrides.ts` | morpheus mirror | card-wrapper |
| `MuiCheckbox.overrides.tsx` | morpheus mirror | checkbox |
| `MuiChip.overrides.ts` | morpheus mirror | chip |
| `MuiDataGrid.overrides.tsx` | morpheus mirror | table |
| `MuiDialog.overrides.ts` | morpheus mirror | dialog |
| `MuiFormControlLabel.overrides.ts` | morpheus mirror | checkbox, radio, switch, form-field |
| `MuiFormHelperText.overrides.ts` | morpheus mirror | form-field |
| `MuiIconButton.overrides.ts` | morpheus mirror | icon-button |
| `MuiInputLabel.overrides.ts` | morpheus mirror | form-field |
| `MuiMenu.overrides.ts` | morpheus mirror | select-input dropdown surface |
| `MuiOutlinedInput.overrides.ts` | morpheus mirror | basic-text-field, multiline-text-area, select-input, form-field |
| `MuiPaper.overrides.ts` | morpheus mirror | card-wrapper |
| `MuiRadio.overrides.ts` | morpheus mirror | radio |
| `MuiSelect.overrides.tsx` | morpheus mirror | select-input |
| `MuiStepIcon.overrides.ts` | **authored here** (see note 1) | stepper |
| `MuiSvgIcon.overrides.ts` | morpheus mirror | iconography (foundational; affects every icon) |
| `MuiSwitch.overrides.tsx` | morpheus mirror | switch |
| `MuiTabs.overrides.ts` | morpheus mirror | tabs |
| `MuiTextField.overrides.ts` | morpheus mirror | basic-text-field, multiline-text-area, select-input, form-field |
| `MuiTooltip.overrides.ts` | morpheus mirror | tooltip |
| `MuiTypography.overrides.ts` | morpheus mirror | typography (foundational; registers `body0`, `hero*`, `machine*` variants used everywhere) |

**Note 1 — `MuiStepIcon.overrides.ts`.** This file does not exist in
production morpheus today. It is authored here from the contract documented
in `references/components/composite/stepper/usage.md` §7 ("Why the override
exists"). Without this file, `<StepIcon>` collapses to body2's 13px because
of the global `MuiSvgIcon { fontSize: 'inherit' }` rule. See the file's
header comment for the full rationale. Mirroring the bundle into a
consumer fixes the tiny-circle bug on contact.

## Known gaps (referenced but not bundled)

| Cited in | File | Why not bundled | Behaviour |
|---|---|---|---|
| `divider/usage.md` | `MuiDivider.overrides.ts` | Does not exist in production morpheus | `<Divider>` uses MUI defaults + `theme.palette.divider`. No size / colour drift expected. |
| `card-wrapper/usage.md` | `MuiCardContent.overrides.ts` | Does not exist as a separate file | CardContent styling lives inside `MuiCard.overrides.ts`. |
| `select-input/usage.md` | `MuiMenuItem.overrides.ts` | Does not exist as a separate file | MenuItem styling is owned by `MuiMenu.overrides.ts`. |

If you are extending the bundle and find a usage.md citing a file not
listed in either table, **ask before authoring**. The skill's "do not
improvise" rule applies: prefer adding the override to morpheus first, then
mirroring; do not invent overrides inside the bundle from scratch.

## Foundational config (NOT in this folder)

A few foundations are not override files — they are top-level
`createTheme()` options. Consumers must wire them at theme creation time,
not via the `components:` map:

| Foundation | Where it lives in morpheus | What to mirror |
|---|---|---|
| `spacing` | `fabric-theme-morpheus/src/index.ts` | The `spacing` value passed to `createTheme()` |
| `shape` | `fabric-theme-morpheus/src/index.ts` | The `shape.borderRadius` value passed to `createTheme()` |
| `typography` config | `fabric-theme-morpheus/src/index.ts` (alongside `MuiTypography.overrides.ts`) | The base typography config + the `muiTypographyThemeOptions` export |

These are documented in `references/foundations/{shape,spacing,typography}/usage.md`
and are out of scope for per-component overrides. A complete consumer
theme imports and merges all bundled overrides PLUS sets these top-level
options.

## Consumer mirror protocol

The bundle is the contract; the consumer's REAL theme is whatever
`<ThemeProvider theme={...}>` imports. To mirror correctly, you must
find the *real* destination, not the apparent one. Mirroring into the
wrong barrel is **silent** — the wiring looks fine, MUI never sees the
override, and the bug remains. Always trace the import.

### Step 1 — Discover the real theme (mandatory)

In the consumer app, find the `<ThemeProvider>` at the top of the React
tree. Typical paths: `app/layout.tsx`, `app/client-layout.tsx`,
`src/main.tsx`, or wherever the App root is defined. Trace the `theme`
prop's import. Three cases:

#### a) Imports a published package
```tsx
import { fabricThemeMorpheus } from "@alation/fabric-theme-morpheus";
<ThemeProvider theme={fabricThemeMorpheus}>
```
→ Consumer is **production-shape**. Override files live in that
package's `src/lib/Mui*.overrides.{ts,tsx}`. To mirror: copy the bundle
file there AND wire it into the package's `src/index.ts` `components`
map (alongside the other `mui*Overrides` imports). This is what
**alation-ui itself** does today.

#### b) Imports a workspace package (vendored copy of morpheus)
```tsx
import { fabricThemeMorpheus } from "@alation/fabric-theme-morpheus";
// resolves to packages/fabric-theme-morpheus/ in the same monorepo
<ThemeProvider theme={fabricThemeMorpheus}>
```
→ Consumer is **production-shape with a vendored theme**. Same as (a),
but the file you edit is local to the repo. This is what **vibe-design**
and **design-playground** both do today. Mirror the bundle file into
`packages/fabric-theme-morpheus/src/lib/MuiX.overrides.{ts,tsx}` and
wire it into that package's `src/index.ts`.

#### c) Imports a hand-rolled simplified theme
```tsx
import { theme } from "@repo/ui/theme";   // or local theme/ folder
<ThemeProvider theme={theme}>
```
→ Consumer is **simplified-prototype**. Override files live in that
theme's `componentOverrides/` barrel (typically
`packages/ui/src/theme/componentOverrides/<element>.ts`). Mirror there
and wire into the barrel index.

> **Common trap — mixed-shape repos.** A single repo may contain BOTH
> shapes (vibe-design has `packages/ui` with its own `componentOverrides/`
> AND `packages/fabric-theme-morpheus` with its own `Mui*.overrides`).
> But only **one is wired to `<ThemeProvider>`**. The other is dead
> scaffolding from an earlier prototype shape. Mirroring into the dead
> one is silent. **Never assume from folder structure — always trace the
> import.**

### Step 2 — Choose your override file's units

The bundle ships values in **px** (`fontSize: 24`, `width: 24`,
`height: 24`) so the file is root-font-size agnostic. You have two
options when mirroring:

| Option | Use when | Example |
|---|---|---|
| Keep px from the bundle | Always safe. Recommended. Works regardless of the consumer's `html` font-size. | `fontSize: 24` |
| Convert to rem to match consumer convention | The target theme uses rem throughout for stylistic consistency, and you want the override to fit. Document the conversion in the file header. | 16px root: `1.5rem` · **62.5% root** (morpheus): `2.4rem` |

> **Morpheus consumers** — production morpheus sets
> `html { font-size: 62.5% }`, so 1rem = 10px in this theme. The
> bundle's `1.5rem` (= 24px at the standard 16px root) becomes 15px in
> morpheus — visibly small but easy to miss in code review. **If you
> ship rem in a morpheus consumer, the right value is `2.4rem`, not
> `1.5rem`.** Px from the bundle avoids the conversion entirely.

### Step 3 — Verify at runtime (mandatory)

Mirroring into the wrong theme is silent — TypeScript compiles, the dev
server runs, no errors anywhere. The only reliable check is computed
style. After wiring:

1. Open the running app in a browser.
2. Open DevTools → Elements → inspect a rendered instance of the
   target component (e.g. `.MuiStepIcon-root`).
3. In the Console, run:

   ```js
   const el = document.querySelector('.MuiStepIcon-root');
   const { fontSize, width, height } = getComputedStyle(el);
   console.log({ fontSize, width, height });
   ```

4. Check the values against the contract.

For `MuiStepIcon` the expected output is `{ fontSize: "24px",
width: "24px", height: "24px" }`. Common deviations and what they mean:

| Computed value | Meaning |
|---|---|
| `24px` (all three) | ✅ Override is wired to the right theme and the units are correct. |
| `13px` | ❌ Override is missing entirely from the wired theme. Re-check Step 1 — you mirrored into the wrong barrel. |
| `15px` | ❌ Override is registered, but rem values weren't scaled for a 62.5% root. Use px (recommended) or convert to `2.4rem`. |
| `~38px` (`2.4rem` × 16px) | ❌ Override is registered with `2.4rem` in a 16px-root theme. Use px or convert to `1.5rem`. |
| Something else | ❌ Two overrides are competing (specificity bug) or the consumer set their own per-call-site `sx`. Check DevTools "Computed" pane to see which rule wins. |

Do not move on until the computed values match the contract.

### What NOT to do

- **Don't bulk-mirror** the entire 26-file bundle into any consumer.
  Mirror only what the Contract Audit surfaces as a missing prerequisite.
  Bulk replacement risks breaking working overrides.
- **Don't edit a bundled file** to fix a per-consumer issue. Fix in
  production morpheus first, re-mirror to the bundle, then re-mirror to
  consumers.
- **Don't author a call-site `sx` workaround** to compensate for a
  missing or wrongly-mirrored override. That violates the prohibition
  the override exists to enforce. Re-trace the ThemeProvider import,
  fix the mirror, re-verify.
- **Don't trust folder structure as a signal** of what theme is wired.
  `packages/ui/componentOverrides/` may be dead code if the app actually
  imports from `packages/fabric-theme-morpheus/`. Trace, don't assume.

The bundle itself is **append-only**, with one authored file
(`MuiStepIcon.overrides.ts`) that exists because production morpheus
does not yet ship a `MuiStepIcon` override — its contract is fully
specified in `stepper/usage.md` §7. All other files mirror morpheus
verbatim.
