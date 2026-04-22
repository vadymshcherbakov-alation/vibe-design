import { Components, Theme } from "@mui/material/styles";
import { layoutTokens } from "../tokens/layout";

// Extract numeric value from token (e.g., "150ms" -> 150)
const exitDuration = parseInt(layoutTokens.transition.fast, 10);

export const dialogOverrides: Components<Theme> = {
  MuiDialog: {
    defaultProps: {
      // Appear immediately (0ms), but animate on close (150ms)
      transitionDuration: {
        enter: 0,
        exit: exitDuration,
      },
    },
    styleOverrides: {
      paper: {
        borderRadius: "12px",
        boxShadow:
          "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
      },
    },
  },
};


