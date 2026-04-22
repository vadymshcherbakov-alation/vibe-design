import { Components, Theme } from "@mui/material/styles";

export const tabsOverrides: Components<Theme> = {
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: "40px",
        position: "relative",
        "& .MuiTabs-indicator": {
          height: "2px",
          backgroundColor: theme.tokens.color.border.button.primary,
          bottom: "0px",
          zIndex: 2,
          transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }),
      flexContainer: ({ theme }) => ({
        alignItems: "flex-end",
        gap: 8,
        paddingLeft: 24,
        paddingRight: 24,
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: "40px",
        minWidth: "0",
        paddingTop: `${4}px`,
        paddingBottom: `${8}px`,
        paddingLeft: `${8}px`,
        paddingRight: `${8}px`,
        textTransform: "none",
        color: theme.tokens.color.text.secondary,
        ...theme.tokens.typography.button,
        lineHeight: "100%",
        letterSpacing: "0",
        "&.Mui-selected": {
          color: theme.tokens.color.text.button.primary,
        },
        "&:hover": {
          backgroundColor: theme.tokens.color.background.surface.secondary,
        },
        "&.Mui-selected:hover": {
          backgroundColor: "transparent",
        },
      }),
    },
  },
};


