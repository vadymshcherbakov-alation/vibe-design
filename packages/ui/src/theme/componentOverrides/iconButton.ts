import { Components, Theme } from "@mui/material/styles";

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "text" | "contained" | "outlined";
  }
}

export const iconButtonOverrides: Components<Theme> = {
  MuiIconButton: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 6,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: theme.tokens.color.background.control.hover,
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.focus}`,
          outlineOffset: "1px",
        },
      }),
      sizeSmall: ({ theme }) => ({
        width: 28,
        height: 28,
        padding: 4,
      }),
      sizeMedium: ({ theme }) => ({
        width: 36,
        height: 36,
        padding: 8,
      }),
      sizeLarge: ({ theme }) => ({
        width: 48,
        height: 48,
        padding: 12,
      }),
    },
    variants: [
      // Contained variant
      {
        props: { variant: "contained", color: "primary" },
        style: ({ theme }) => ({
          backgroundColor: theme.tokens.color.background.button.primary,
          color: theme.tokens.color.white,
          "&:hover": {
            backgroundColor:
              theme.tokens.color.background.button["primary-hover"],
          },
        }),
      },
      {
        props: { variant: "contained", color: "error" },
        style: ({ theme }) => ({
          backgroundColor: theme.tokens.color.background.button.error,
          color: theme.tokens.color.white,
          "&:hover": {
            backgroundColor:
              theme.tokens.color.background.button["error-hover"],
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.tokens.color.border.button.error}`,
            outlineOffset: "1px",
          },
        }),
      },
      // Outlined variant
      {
        props: { variant: "outlined" },
        style: ({ theme }) => ({
          border: `1px solid ${theme.tokens.color.border.button.primary}`,
          backgroundColor: theme.tokens.color.background.control.default,
          "&:hover": {
            backgroundColor: theme.tokens.color.background.control.hover,
          },
        }),
      },
      {
        props: { variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          borderColor: theme.tokens.color.border.button.primary,
          color: theme.tokens.color.text.button.primary,
        }),
      },
      {
        props: { variant: "outlined", color: "error" },
        style: ({ theme }) => ({
          borderColor: theme.tokens.color.border.button.error,
          color: theme.tokens.color.text.error,
          "&:focus-visible": {
            outline: `2px solid ${theme.tokens.color.border.button.error}`,
            outlineOffset: "1px",
          },
        }),
      },
      {
        props: { variant: "outlined", color: "inherit" },
        style: ({ theme }) => ({
          borderColor: theme.tokens.color.border.default,
          color: theme.tokens.color.text.primary,
        }),
      },
    ],
  },
};
