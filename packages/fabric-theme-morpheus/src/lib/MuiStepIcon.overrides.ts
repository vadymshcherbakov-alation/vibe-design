import type {Components, Theme} from '@mui/material/styles';

/**
 * MuiStepIcon override — locks the step indicator at 24×24.
 *
 * Mirrored from the alation-design skill bundle:
 *   .claude/skills/alation-design/references/theme/MuiStepIcon.overrides.ts
 *
 * Local adaptation: morpheus sets `html { font-size: 62.5% }`, so 1rem = 10px
 * in this theme. The bundle's `1.5rem` (= 24px at the standard 16px root)
 * becomes 15px here — visibly too small. Use `2.4rem` to hit the same
 * 24×24 contract in morpheus's root-size scheme.
 *
 * Why this file exists:
 *   The base `MuiSvgIcon` override in morpheus sets
 *   `defaultProps.fontSize: 'inherit'`, which kills MUI's stock `1.5rem`
 *   for `<StepIcon>` (StepIcon ships as `<SvgIcon fontSize="inherit">`).
 *   Without an explicit `MuiStepIcon` override, the icon collapses to
 *   body2's 13px and inherits the parent <StepLabel>'s font size.
 *
 * Why the compound `&.MuiSvgIcon-fontSizeInherit` selector is required:
 *   StepIcon renders as <svg> with BOTH `MuiStepIcon-root` AND
 *   `MuiSvgIcon-fontSizeInherit` classes on the same node. A plain
 *   `.MuiStepIcon-root { fontSize: 1.5rem }` rule has the same 0,1,0
 *   specificity as `.MuiSvgIcon-fontSizeInherit { fontSize: inherit }`,
 *   and MUI emits SvgIcon's variants AFTER StepIcon's root — so the
 *   inherit rule wins by emission order. The compound selector below
 *   produces `.MuiStepIcon-root.MuiSvgIcon-fontSizeInherit` at 0,2,0
 *   specificity, which beats the SvgIcon rule regardless of cascade order.
 */
export const muiStepIconOverrides: Components<Theme> = {
  MuiStepIcon: {
    styleOverrides: {
      root: {
        fontSize: '2.4rem',
        width: '2.4rem',
        height: '2.4rem',
        '&.MuiSvgIcon-fontSizeInherit': {
          fontSize: '2.4rem',
        },
      },
    },
  },
};
