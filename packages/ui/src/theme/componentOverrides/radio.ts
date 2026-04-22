import { Components, Theme } from "@mui/material/styles";

export const radioOverrides: Components<Theme> = {
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingTop: 4,
        paddingBottom: 4,
        "&.Mui-focusVisible": {
          outline: `2px solid ${theme.tokens.color.border.button.focus}`,
          outlineOffset: -2,
        },
        "&:hover": {
          background: "transparent",
        },
      }),
      colorPrimary: ({ theme }) => ({
        color: theme.tokens.color.text.secondary,
      }),
    },
  },
};
