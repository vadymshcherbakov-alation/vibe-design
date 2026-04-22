import { Components, Theme } from "@mui/material/styles";

export const checkboxOverrides: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        padding: "1px", // Figma spec: 1px padding around 18x18 icon = 20x20 total
        flexShrink: 0,
        color: theme.tokens.color.border.default,
        width: ownerState.size === "small" ? "20px" : "24px",
        height: ownerState.size === "small" ? "20px" : "24px",
        "& .MuiSvgIcon-root": {
          borderRadius: "4px", // Figma spec: cornerRadius: 4
          fontSize: ownerState.size === "small" ? "18px" : "22px", // Figma spec: 18x18 inner
        },
        "& svg": {
          "& > path:first-of-type": {
            // This targets the checkbox background/border shape
            rx: 4,
            ry: 4,
          },
        },
        "&:hover": {
          backgroundColor: "transparent",
          color: theme.tokens.color.border.hover,
        },
        "&.Mui-focusVisible": {
          outline: `2px solid ${theme.tokens.color.border.button.focus}`,
          outlineOffset: 2,
        },
        "&.Mui-disabled": {
          color: theme.tokens.color.border.disabled,
        },
        "&.Mui-checked": {
          color: theme.tokens.color.background.button.primary, // Figma: rgb(0, 115, 221)
          "&:hover": {
            backgroundColor: "transparent",
            color: theme.tokens.color.background.button["primary-hover"],
          },
          "&.Mui-disabled": {
            color: theme.tokens.color.text.disabled,
          },
        },
        "&.MuiCheckbox-indeterminate": {
          color: theme.tokens.color.background.button.primary,
          "&:hover": {
            backgroundColor: "transparent",
            color: theme.tokens.color.background.button["primary-hover"],
          },
        },
      }),
      colorPrimary: ({ theme }) => ({
        "&.Mui-checked": {
          color: theme.tokens.color.background.button.primary,
        },
      }),
    },
  },
};
