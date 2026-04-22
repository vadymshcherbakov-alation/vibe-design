import type {Components, CSSObject, Theme} from '@mui/material/styles';

export const muiInputLabelOverrides: Components<Theme> = {
  MuiInputLabel: {
    styleOverrides: {
      root: ({theme}) => ({
        ...(theme.typography.body0 as CSSObject),
        color: theme.palette.text.secondary,
        letterSpacing: '0.015rem',
        transform: 'none',
      }),
      sizeSmall: ({theme}) => ({
        ...theme.typography.body1,
      }),
      shrink: ({theme}) => ({
        fontWeight: theme.typography.fontWeightMedium,
        lineHeight: 1,
        fontSize: '1.2rem',
        letterSpacing: '0.015rem',
      }),
      formControl: {
        maxWidth: 'calc(100% - 2.4rem)',
        transform: 'translate(1.2rem, 0.8rem) scale(1)',
        '&.MuiInputLabel-sizeSmall': {
          transform: 'translate(1.2rem, 0.5rem) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(1.2rem, -0.5rem) scale(1)',
          },
        },
        '&.MuiInputLabel-shrink': {
          transform: 'translate(1.2rem, -0.6rem) scale(1)',
        },
      },
    },
  },
};
