import type {Components, Theme} from '@mui/material/styles';

export const muiLinearProgressOverrides: Components<Theme> = {
  MuiLinearProgress: {
    styleOverrides: {
      root: ({theme}) => ({
        borderRadius: theme.borderRadiusToRem(50),
      }),
    },
  },
};
