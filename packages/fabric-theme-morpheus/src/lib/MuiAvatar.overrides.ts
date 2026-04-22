import type {Components, Theme} from '@mui/material/styles';

export const muiAvatarOverrides: Components<Theme> = {
  MuiAvatar: {
    styleOverrides: {
      root: ({theme}) => ({
        fontSize: theme.typography.body0.fontSize,
        height: '3.2rem',
        width: '3.2rem',
        svg: {
          height: '75%',
          width: '75%',
        },
      }),
      colorDefault: ({theme}) => ({
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
};
