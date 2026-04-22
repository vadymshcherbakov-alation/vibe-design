"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import { getAgentById } from "../../../agents/agent-data";

export default function AgentAccessPage() {
  const params = useParams();
  const theme = useTheme();
  const agentId = params.id as string;
  const agent = getAgentById(agentId);

  if (!agent) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1540px",
          p: "24px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Agent access
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          Manage who can access this agent. Content coming soon.
        </Typography>
      </Box>
    </Box>
  );
}
