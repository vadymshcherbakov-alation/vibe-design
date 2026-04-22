import { Components, Theme } from "@mui/material/styles";

export const avatarOverrides: Components<Theme> = {
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontSize: "12px",
        fontWeight: 500,
      },
    },
  },
};
