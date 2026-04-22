import type {Components, Theme} from '@mui/material/styles';

export const muiSnackbarOverrides: Components<Theme> = {
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        horizontal: 'center',
        vertical: 'bottom',
      },
      autoHideDuration: 5 * 1000, // 5 seconds,
      ClickAwayListenerProps: {
        // Prevent closing snackbar via backdrop click
        onClickAway: () => null,
      },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: ({theme}) => ({
        backgroundColor: theme.palette.grey[800],
        padding: theme.spacing(1, 2),
      }),
      action: ({theme}) => ({
        '.MuiButtonBase-root + .MuiButtonBase-root': {
          marginLeft: theme.spacing(1),
        },
        '.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.background.lighten10,
        },
      }),
      message: ({theme}) => ({
        ...theme.typography.body1,
        lineHeight: theme.typography.button.lineHeight,
      }),
    },
  },
};
