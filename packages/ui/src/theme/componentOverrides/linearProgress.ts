import { Components, Theme } from "@mui/material/styles";

export const linearProgressOverrides: Components<Theme> = {
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 999,
      }),
    },
  },
};
