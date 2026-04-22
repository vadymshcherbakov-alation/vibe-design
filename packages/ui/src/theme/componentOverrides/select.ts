import { Components, Theme } from "@mui/material/styles";

export const selectOverrides: Components<Theme> = {
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 6,
        fontSize: theme.tokens.typography.size.sm,
        backgroundColor: theme.tokens.color.background.control.default,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.tokens.color.border.default,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.tokens.color.border.hover,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.tokens.color.border.focused,
        },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.tokens.color.border.disabled,
        },
      }),
      select: {
        paddingLeft: "12px",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 6,
        backgroundColor: theme.tokens.color.background.control.secondary,
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
      }),
      input: {
        paddingLeft: "12px",
      },
      inputSizeSmall: {
        paddingLeft: "12px",
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.tokens.typography.size.sm,
        padding: `${8} ${12}`,
        position: "relative",
        "&:hover": {
          backgroundColor: theme.tokens.color.background.control.hover,
        },
        "&.Mui-selected": {
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: theme.tokens.color.background.control.hover,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(theme.tokens.color.text.primary)}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          },
        },
      }),
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: 6,
        border: `1px solid ${theme.tokens.color.border.default}`,
        boxShadow:
          "0px 8px 16px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)",
        padding: "0",
        marginTop: "0",
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: 6,
        border: `1px solid ${theme.tokens.color.border.default}`,
        boxShadow:
          "0px 8px 16px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)",
        padding: "4px 0",
        marginTop: "4px",
        maxHeight: "300px",
      }),
      list: {
        padding: "0",
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        "&.MuiMenu-list": {
          padding: "4px 0",
        },
      },
    },
  },
};
