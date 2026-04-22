import { Components, Theme } from "@mui/material/styles";

export const inputOverrides: Components<Theme> = {
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        height: "0.1em",
      },
    },
  },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        fontWeight: 400,
        lineHeight: theme.tokens.typography.body.base.lineHeight,
        margin: 0,
        padding: 12,
        borderRadius: 6,
        border: `2px solid ${theme.tokens.color.border.default}`,
        color: theme.tokens.color.text.primary,
        backgroundColor: theme.tokens.color.background.control.default,
        input: {
          padding: 0,
        },
        fieldset: {
          border: `2px solid ${theme.tokens.color.border.default}`,
        },
        "&:not(.MuiInputBase-multiline)": {
          height: 36,
        },
        "&&:hover": {
          borderColor: theme.tokens.color.border.hover,
          "& fieldset": {
            borderColor: theme.tokens.color.border.hover,
          },
        },
        "&&.Mui-focused": {
          borderColor: theme.tokens.color.border.focused,
          borderWidth: 2,
          fieldset: {
            borderColor: theme.tokens.color.border.focused,
            borderWidth: 2,
          },
        },
        "&&.Mui-error": {
          borderColor: theme.tokens.color.border.error,
          fieldset: {
            borderColor: theme.tokens.color.border.error,
          },
          ".MuiInputAdornment-positionStart > *": {
            color: theme.tokens.color.text.error,
          },
        },
        "&&.Mui-disabled": {
          color: theme.tokens.color.text.disabled,
          borderColor: theme.tokens.color.border.disabled,
          fieldset: {
            color: theme.tokens.color.text.disabled,
            borderColor: theme.tokens.color.border.disabled,
          },
        },
      }),
      sizeSmall: ({ theme }) => ({
        "&:not(.MuiInputBase-multiline)": {
          height: 28,
        },
        padding: 10,
        fontSize: theme.tokens.typography.body.base.size,
      }),
    },
  },
};
