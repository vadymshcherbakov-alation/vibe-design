import {CSSObject} from '@mui/material/styles';

import {colorPaletteOverrides} from './ColorPalette.overrides';
import {muiTypographyThemeOptions} from './MuiTypography.overrides';

export const muiTextAreaOverrides: CSSObject = {
  // 🔥 Important 🔥 - When adding styles here be carful as it will impact MuiTextField multiline component as well. Ensure no regression.
  textarea: {
    borderRadius: 6,
    border: `0.15rem solid ${colorPaletteOverrides?.palette?.background?.darken20}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fontSize: (muiTypographyThemeOptions?.typography as any).body0?.fontSize,
    backgroundColor: colorPaletteOverrides?.palette?.background?.default,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fontFamily: (muiTypographyThemeOptions?.typography as any).fontFamily,
    lineHeight: 1.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fontWeight: (muiTypographyThemeOptions?.typography as any).fontWeightLight,
    '&:hover': {
      borderColor: colorPaletteOverrides?.palette?.background?.darken50,
    },
    '&:disabled': {
      color: colorPaletteOverrides?.palette?.text?.disabled,
      borderColor: colorPaletteOverrides?.palette?.background?.darken10,
    },
    '&::placeholder': {
      color: colorPaletteOverrides?.palette?.text?.disabled,
    },
  },
};
