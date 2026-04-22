import { Components, Theme } from "@mui/material/styles";

export const backdropOverrides: Components<Theme> = {
  MuiBackdrop: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.surface.modal.backdrop,
      }),
      invisible: {
        backgroundColor: "transparent",
      },
    },
  },
};
