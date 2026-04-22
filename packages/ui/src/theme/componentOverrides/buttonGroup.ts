import { Components, Theme } from "@mui/material/styles";

export const buttonGroupOverrides: Components<Theme> = {
  MuiButtonGroup: {
    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiDivider-root": {
          borderColor: theme.tokens.color.white,
        },
      }),
      outlined: ({ theme }) => ({
        "& .MuiIconButton-root": {
          border: `1px solid ${theme.tokens.color.border.default}`,
        },
        "& .MuiIconButton-root:not(:last-of-type)": {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRightColor: "transparent",
        },
        "& .MuiIconButton-root:not(:first-of-type)": {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          marginLeft: -1,
        },
      }),
    },
  },
};
