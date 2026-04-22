import type {Components, Theme} from '@mui/material/styles';

export const muiCircularProgressOverrides: Components<Theme> = {
  MuiCircularProgress: {
    defaultProps: {
      size: '5rem',
      thickness: 5,
    },
  },
};
