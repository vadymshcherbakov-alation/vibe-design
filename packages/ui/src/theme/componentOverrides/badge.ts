import { Components, Theme } from "@mui/material/styles";

export const badgeOverrides: Components<Theme> = {
  MuiBadge: {
    styleOverrides: {
      badge: ({ theme }) => ({
        outline: `2px solid ${theme.tokens.color.background.control.default}`,
      }),
      standard: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        lineHeight: 1,
      }),
      dot: {
        borderRadius: 5,
      },
    },
  },
};
