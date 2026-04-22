import { Components, Theme } from "@mui/material/styles";

export const skeletonOverrides: Components<Theme> = {
  MuiSkeleton: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.tokens.palette.neutral[300],
      }),
    },
  },
};
