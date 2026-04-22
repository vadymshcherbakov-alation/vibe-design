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
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.text.primary }}
      >
        Chat
      </Typography>
    </Box>
  );
}
