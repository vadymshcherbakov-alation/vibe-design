import { Components, Theme } from "@mui/material/styles";

export const buttonOverrides: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.tokens.typography.button,
        borderRadius: 6,
        boxShadow: "none",
        textTransform: "none",
        minWidth: "0",
        "&:hover": {
          boxShadow: "none",
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.focus}`,
          outlineOffset: "1px",
        },
      }),
      sizeSmall: ({ theme }) => ({
        height: 28,
        paddingLeft: theme.tokens.spacing.sm + 4, // 12px - between sm(8) and md(16)
        paddingRight: theme.tokens.spacing.sm + 4, // 12px
      }),
      sizeMedium: ({ theme }) => ({
        height: 36,
        paddingLeft: theme.tokens.spacing.md, // 16px - normal padding
        paddingRight: theme.tokens.spacing.md, // 16px
      }),

      contained: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.button.primary,
        "&:hover": {
          backgroundColor:
            theme.tokens.color.background.button["primary-hover"],
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.tokens.color.border.button.primary,
        color: theme.tokens.color.text.button.primary,
        backgroundColor: theme.tokens.color.background.control.default,
        "&:hover": {
          backgroundColor: theme.tokens.color.background.control.hover,
        },
      }),
      colorInherit: ({ theme }) => ({
        borderColor: theme.tokens.color.border.default,
        color: theme.tokens.color.text.primary,
      }),
      // Error button styles
      containedError: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.button.error,
        color: theme.tokens.color.white,
        "&:hover": {
          backgroundColor: theme.tokens.color.background.button["error-hover"],
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.error}`,
          outlineOffset: "1px",
        },
      }),
      outlinedError: ({ theme }) => ({
        borderColor: theme.tokens.color.border.button.error,
        color: theme.tokens.color.text.error,
        "&:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.error}`,
          outlineOffset: "1px",
        },
      }),
      textError: ({ theme }) => ({
        color: theme.tokens.color.text.error,
        "&:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.error}`,
          outlineOffset: "1px",
        },
      }),
    },
  },
};
