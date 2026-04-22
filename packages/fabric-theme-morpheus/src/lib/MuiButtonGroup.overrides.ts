import type {Components, Theme} from '@mui/material/styles';

export const muiButtonGroupOverrides: Components<Theme> = {
  MuiButtonGroup: {
    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({theme}) => ({
        '& .MuiDivider-root': {
          borderColor: theme.palette.common.white,
        },
      }),
      outlined: ({theme}) => ({
        '& .MuiIconButton-root': {
          border: `0.1rem solid ${theme.palette.grey[500]}`,
        },
        '& .MuiIconButton-root:not(:last-of-type)': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRightColor: 'transparent',
        },
        '& .MuiIconButton-root:not(:first-of-type)': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          marginLeft: '-0.1rem',
        },
      }),
    },
  },
};
