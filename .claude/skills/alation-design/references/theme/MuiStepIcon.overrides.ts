import type {Components, Theme} from '@mui/material/styles';

/**
 * MuiStepIcon override — locks the step indicator at 24×24.
 *
 * Why this file exists:
 *   The base `MuiSvgIcon` override in morpheus (and most consumer
 *   workspaces that mirror it) sets `defaultProps.fontSize: 'inherit'`,
 *   which kills MUI's stock `1.5rem` for `<StepIcon>` (StepIcon ships as
 *   `<SvgIcon fontSize="inherit">`). Without an explicit `MuiStepIcon`
 *   override, the icon collapses to body2's 13px and inherits the parent
 *   <StepLabel>'s font size. This override restores the 24×24 contract
 *   globally so the canonical Stepper Example.tsx renders correctly with
 *   no call-site `sx`.
 *
 * Why px and not rem:
 *   Different morpheus consumers run different root font-sizes. Production
 *   morpheus sets `html { font-size: 62.5% }`, so 1rem = 10px under
 *   morpheus — `1.5rem` becomes 15px (visibly small) and the bug returns.
 *   Standard 16px-root consumers see 1.5rem = 24px (correct). The bundle
 *   ships in **px** so the same file works regardless of the consumer's
 *   root scheme. Consumers may convert to rem locally to match stylistic
 *   convention (1.5rem at 16px root, 2.4rem at 62.5% root) — see the
 *   bundle's `_index.md` "Consumer mirror protocol" §2 for the math.
 *
 * Why the compound `&.MuiSvgIcon-fontSizeInherit` selector is required:
 *   StepIcon renders as <svg> with BOTH `MuiStepIcon-root` AND
 *   `MuiSvgIcon-fontSizeInherit` classes on the same node. A plain
 *   `.MuiStepIcon-root { fontSize: 24px }` rule has the same 0,1,0
 *   specificity as `.MuiSvgIcon-fontSizeInherit { fontSize: inherit }`,
 *   and MUI emits SvgIcon's variants AFTER StepIcon's root — so the
 *   inherit rule wins by emission order and the icon collapses. The
 *   compound selector below produces
 *   `.MuiStepIcon-root.MuiSvgIcon-fontSizeInherit` at 0,2,0 specificity,
 *   which beats the SvgIcon rule regardless of cascade order. Strip this
 *   compound selector and the bug returns.
 *
 * Verification (any consumer):
 *   In the running app, inspect a `<StepIcon>` via DevTools and run
 *   `getComputedStyle(el)` — `fontSize`, `width`, `height` must all read
 *   "24px". 13px = override missing. 15px = override registered but rem
 *   unscaled for a 62.5% root. Anything else = wrong consumer wired.
 */
export const muiStepIconOverrides: Components<Theme> = {
  MuiStepIcon: {
    styleOverrides: {
      root: {
        fontSize: 24,
        width: 24,
        height: 24,
        // Beat the ambient MuiSvgIcon `fontSize: 'inherit'` default rule
        // that lands on the same DOM node. Without this compound selector,
        // both rules carry 0,1,0 specificity and inherit wins by emission.
        '&.MuiSvgIcon-fontSizeInherit': {
          fontSize: 24,
        },
      },
    },
  },
};
