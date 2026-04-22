import {type Components, Theme} from '@mui/material/styles';

export const muiPopoverOverrides: Components<Theme> = {
  MuiPopover: {
    styleOverrides: {
      paper: ({theme}) => ({
        backgroundColor: theme.palette.background.paper,
        border: theme.palette.grey[400],
        borderRadius: theme.borderRadiusToRem(6),
        boxShadow: theme.shadows[2],
      }),
    },
  },
};
