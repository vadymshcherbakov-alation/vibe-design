import { Components, Theme } from "@mui/material/styles";

export const cssBaselineOverrides: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        fontSize: "62.5%",
      },
    },
  },
};
