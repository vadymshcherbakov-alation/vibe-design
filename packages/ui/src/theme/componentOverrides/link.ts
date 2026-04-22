import { Components, Theme } from "@mui/material/styles";

export const linkOverrides: Components<Theme> = {
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.tokens.color.text.primary,
      }),
    },
  },
};
