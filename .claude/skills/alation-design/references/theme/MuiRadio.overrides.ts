import {type Components, Theme} from '@mui/material/styles';

export const muiRadioOverrides: Components<Theme> = {
  MuiRadio: {
    styleOverrides: {
      root: ({theme}) => ({
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        '&.Mui-focusVisible': {
          outline: `0.2rem solid ${theme.palette.primary.dark}`,
          outlineOffset: '-0.2rem',
        },
        '&:hover': {
          background: 'transparent',
        },
      }),
      disabled: ({theme}) => ({
        color: theme.palette.text.disabled,
        '&:hover': {
          backgroundColor: theme.palette.text.secondary,
        },
      }),
      colorPrimary: ({theme}) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
};
