"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function FlowDetailPanelNoDetails() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
        }}
      >
        Step details not available.
      </Typography>
    </Box>
  );
}


