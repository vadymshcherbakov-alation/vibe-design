import {type Components, Theme} from '@mui/material/styles';

export const muiSkeletonOverrides: Components<Theme> = {
  MuiSkeleton: {
    styleOverrides: {
      root: ({theme}) => ({
        backgroundColor: theme.palette.grey[400],
      }),
    },
  },
};
