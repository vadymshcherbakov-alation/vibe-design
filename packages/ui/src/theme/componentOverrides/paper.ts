import { Components, Theme } from "@mui/material/styles";

export const paperOverrides: Components<Theme> = {
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: "none",
        "&.MuiPopover-paper": {
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
      rounded: ({ theme }) => ({
        borderRadius: 6,
      }),
    },
  },
};
