"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function OutputSection() {
  const theme = useTheme();

  return (
    <Typography
      variant="body1"
      sx={{ color: theme.palette.text.secondary }}
    >
      No output defined.
    </Typography>
  );
}
