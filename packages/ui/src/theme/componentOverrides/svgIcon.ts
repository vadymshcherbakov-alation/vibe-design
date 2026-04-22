import { Components, Theme } from "@mui/material/styles";

export const svgIconOverrides: Components<Theme> = {
  MuiSvgIcon: {
    defaultProps: {
      fontSize: "inherit",
    },
    styleOverrides: {
      fontSizeSmall: ({ theme }) => ({
        fontSize: theme.tokens.typography.iconSize.sm,
      }),
      fontSizeMedium: ({ theme }) => ({
        fontSize: theme.tokens.typography.iconSize.md,
      }),
      fontSizeLarge: ({ theme }) => ({
        fontSize: theme.tokens.typography.iconSize.lg,
      }),
    },
  },
};
