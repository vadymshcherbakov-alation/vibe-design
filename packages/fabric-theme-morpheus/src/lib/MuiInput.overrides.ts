import type {Components, CSSObject, Theme} from '@mui/material/styles';

export const muiInputOverrides: Components<Theme> = {
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        height: '0.1em',
      },
    },
  },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: ({theme}): CSSObject => ({
        ...(theme.typography.body0 as CSSObject),
        margin: 0,
        padding: theme.spacing(1.5),
        borderRadius: theme.shape.borderRadius,
        border: `0.15rem solid ${theme.palette.background.darken20}`,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        fontWeight: theme.typography.fontWeightLight,
        input: {
          padding: 0,
        },
        fieldset: {
          border: `0.15rem solid ${theme.palette.background.darken20}`,
        },
        ':not(.MuiInputBase-multiline)': {
          height: '3.6rem',
        },
        '&&:hover': {
          borderColor: theme.palette.background.darken50,
          '& fieldset': {
            borderColor: theme.palette.background.darken50,
          },
          ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
          }),
        },
        '&&.Mui-focused': {
          borderColor: theme.palette.primary.main,
          borderWidth: '0.2rem',
          fieldset: {
            borderColor: theme.palette.primary.main,
            borderWidth: '0.2rem',
          },
        },
        '&&.Mui-error': {
          borderColor: theme.palette.error.main,
          fieldset: {
            borderColor: theme.palette.error.main,
          },
          // All elements under start input adornment should have same color as error
          '.MuiInputAdornment-positionStart > *': {
            color: theme.palette.error.main,
          },
        },
        '&&.Mui-disabled': {
          color: theme.palette.text.disabled,
          borderColor: theme.palette.background.darken10,
          fieldset: {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.background.darken10,
          },
          ...theme.applyStyles('dark', {
            borderColor: theme.palette.divider,
          }),
        },
        ...theme.applyStyles('dark', {
          border: `0.15rem solid ${theme.palette.divider}`,
        }),
      }),
      disabled: {},
      sizeSmall: ({theme}) => ({
        ':not(.MuiInputBase-multiline)': {
          height: '2.8rem',
        },
        padding: theme.spacing(1.25),
        ...theme.typography.body1,
      }),
    },
  },
};
