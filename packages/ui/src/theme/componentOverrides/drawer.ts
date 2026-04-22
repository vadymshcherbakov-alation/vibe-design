import { Components, Theme } from "@mui/material/styles";

export const drawerOverrides: Components<Theme> = {
  MuiDrawer: {
    styleOverrides: {
      paperAnchorLeft: ({ theme }) => ({
        borderRight: `2px solid ${theme.tokens.color.border.default}`,
      }),
      paperAnchorRight: ({ theme }) => ({
        borderLeft: `2px solid ${theme.tokens.color.border.default}`,
      }),
      paperAnchorTop: ({ theme }) => ({
        borderBottom: `2px solid ${theme.tokens.color.border.default}`,
      }),
      paperAnchorBottom: ({ theme }) => ({
        borderTop: `2px solid ${theme.tokens.color.border.default}`,
      }),
    },
  },
};
