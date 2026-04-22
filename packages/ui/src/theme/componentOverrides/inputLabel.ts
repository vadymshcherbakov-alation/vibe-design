import { Components, Theme } from "@mui/material/styles";

export const inputLabelOverrides: Components<Theme> = {
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        lineHeight: theme.tokens.typography.body.base.lineHeight,
        color: theme.tokens.color.text.secondary,
        letterSpacing: "0.015rem",
        transform: "none",
      }),
      sizeSmall: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
      }),
      shrink: {
        fontWeight: 500,
        lineHeight: 1,
        fontSize: 12,
        letterSpacing: "0.015rem",
      },
      formControl: {
        maxWidth: "calc(100% - 24px)",
        transform: "translate(12px, 8px) scale(1)",
        "&.MuiInputLabel-sizeSmall": {
          transform: "translate(12px, 5px) scale(1)",
          "&.MuiInputLabel-shrink": {
            transform: "translate(12px, -5px) scale(1)",
          },
        },
        "&.MuiInputLabel-shrink": {
          transform: "translate(12px, -6px) scale(1)",
        },
      },
    },
  },
};
