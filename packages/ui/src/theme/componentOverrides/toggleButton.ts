import { Components, Theme } from "@mui/material/styles";

export const toggleButtonOverrides: Components<Theme> = {
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        display: "inline-flex",
        gap: `${4}px`,
        p: "2px",
        backgroundColor: theme.tokens.color.background.control.secondary,
        borderRadius: `${6}px`,
        "& .MuiToggleButtonGroup-grouped": {
          border: "none",
          borderRadius: `${4}px`,
          px: `${16}px`,
          py: 0,
          height: "32px",
          "&.Mui-selected": {
            backgroundColor: theme.tokens.color.background.control.default,
            boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
            "&:hover": {
              backgroundColor: theme.tokens.color.background.control.default,
            },
          },
          "&:not(.Mui-selected)": {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: theme.tokens.color.background.control.hover,
            },
          },
        },
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.body.base.size}px`,
        fontWeight: 500,
        color: theme.tokens.color.text.primary,
        textTransform: "none",
        transition: `background-color ${theme.tokens.transition.fast}, box-shadow ${theme.tokens.transition.fast}`,
      }),
    },
  },
};
