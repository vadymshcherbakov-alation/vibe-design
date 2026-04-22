import {type Components, Theme} from '@mui/material/styles';

export const muiLinkShellOverrides: Components<Theme> = {
  MuiLink: {
    styleOverrides: {
      root: ({theme}) => ({
        color: theme.palette.text.primary,
      }),
    },
  },
};

export const muiLinkDarkOverrides: Components<Theme> = {
  MuiLink: {
    styleOverrides: {
      root: ({theme}) => ({
        color: theme.palette.primary.dark,
      }),
    },
  },
};
