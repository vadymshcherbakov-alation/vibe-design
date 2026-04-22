"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function AgentChatPane() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        p: "24px",
        backgroundColor: "#FDFDFD",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.text.secondary }}
      >
        Chat interaction has no change, this is placeholder Maintain chat panel
        width to 387, until user resize it
      </Typography>
    </Box>
  );
}
