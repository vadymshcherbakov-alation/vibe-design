import { Components, Theme } from "@mui/material/styles";

export const snackbarOverrides: Components<Theme> = {
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        horizontal: "center",
        vertical: "bottom",
      },
      autoHideDuration: 5000,
      ClickAwayListenerProps: {
        onClickAway: () => null,
      },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.inverted,
        padding: "8px 16px",
      }),
      action: {
        ".MuiButtonBase-root + .MuiButtonBase-root": {
          marginLeft: 8,
        },
      },
      message: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        lineHeight: theme.tokens.typography.button.lineHeight,
      }),
    },
  },
};
