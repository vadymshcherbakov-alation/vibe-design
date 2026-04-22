"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Wrench, Bot } from "lucide-react";
import type { Agent } from "../../agent-data";

interface ToolsSectionProps {
  agent: Agent;
}

export function ToolsSection({ agent }: ToolsSectionProps) {
  const theme = useTheme();
  const hasTools = agent.tools && agent.tools.length > 0;

  if (!hasTools) {
    return (
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        No tools configured.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {agent.tools!.map((tool) => (
        <Box
          key={tool.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            py: "8px",
            px: "12px",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          {/* Tool Icon */}
          {tool.type === "Tool" ? (
            <Wrench size={16} color={theme.palette.info.main} />
          ) : (
            <Bot size={16} color={theme.palette.success.main} />
          )}

          {/* Tool Name */}
          <Typography
            variant="body2"
            sx={{
              color:
                tool.type === "Tool"
                  ? theme.palette.info.main
                  : theme.palette.success.main,
            }}
          >
            {tool.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
