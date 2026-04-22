"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function WorkflowConnector() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 2,
        height: 24,
        backgroundColor: theme.palette.neutral[300],
        my: 0.5,
      }}
    />
  );
}
