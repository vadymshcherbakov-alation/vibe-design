import type {Components, Theme} from '@mui/material/styles';
import {alpha} from '@mui/system';

export const muiBackdropOverrides: Components<Theme> = {
  MuiBackdrop: {
    styleOverrides: {
      root: ({theme}) => ({
        backgroundColor: alpha(theme.palette.common.black, 0.25),
      }),
      invisible: {
        backgroundColor: 'transparent',
      },
    },
  },
};
