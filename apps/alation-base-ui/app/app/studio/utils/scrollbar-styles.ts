import { Theme } from "@mui/material/styles";

/**
 * Reusable scrollbar styles for MUI Box components
 * Use this with the sx prop: sx={getScrollbarStyles(theme)}
 */
export const getScrollbarStyles = (theme: Theme) => ({
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.neutral[300],
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: theme.palette.neutral[400],
    },
  },
});
