import {buttonBaseClasses, buttonClasses, iconButtonClasses} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

export const muiAppBarOverrides: Components<Theme> = {
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({theme}) => ({
        [`& .${buttonBaseClasses.root}`]: {
          [`&.${buttonClasses.outlined}`]: {
            borderColor: theme.palette.background.lighten30,
          },
          [`&.${iconButtonClasses.root}`]: {
            '&.active': {
              backgroundColor: theme.palette.brand.main,
            },
            '&.MuiIconButton-text:not(.default-color)': {
              color: theme.palette.text.primary,
            },
          },
        },
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        '@media (min-width: 600px)': {
          minHeight: '5.6rem',
        },
      },
    },
  },
};
