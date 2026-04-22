import { Components, Theme } from "@mui/material/styles";

export const textFieldOverrides: Components<Theme> = {
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-root": {
          fontSize: theme.tokens.typography.size.sm,
          borderRadius: 6,
          backgroundColor: theme.tokens.color.background.control.default,
          "& fieldset": {
            borderColor: theme.tokens.color.border.default,
          },
          "&:hover fieldset": {
            borderColor: theme.tokens.color.border.hover,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.tokens.color.border.focused,
          },
          "&.Mui-disabled fieldset": {
            borderColor: theme.tokens.color.border.disabled,
          },
          "& input": {
            paddingLeft: "12px",
            paddingRight: "12px",
          },
          // Multiline/textarea specific overrides - remove padding from root container
          "&.MuiInputBase-multiline": {
            padding: "0 !important",
            "& textarea": {
              paddingTop: "8.5px !important",
              paddingBottom: "8.5px !important",
              paddingLeft: "12px !important",
              paddingRight: "12px !important",
            },
          },
          "& textarea": {
            paddingTop: "8.5px !important",
            paddingBottom: "8.5px !important",
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
          },
          "& .MuiInputBase-inputMultiline": {
            paddingTop: "8.5px !important",
            paddingBottom: "8.5px !important",
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
          },
          // Only add extra padding when there's a start adornment (for search input)
          "& .MuiInputAdornment-root": {},
          "& .MuiInputAdornment-positionStart": {
            marginRight: "0",
          },
          "& .MuiInputBase-inputAdornedStart": {
            paddingLeft: "12px",
          },
        },
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 6,
        backgroundColor: theme.tokens.color.background.control.secondary,
      }),
      inputMultiline: {
        paddingTop: "8.5px !important",
        paddingBottom: "8.5px !important",
        paddingLeft: "12px !important",
        paddingRight: "12px !important",
      },
    },
  },
};
