"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { LogTraceMessage } from "../logs/mock-logs-data";

interface LogMiniChatProps {
  messages: LogTraceMessage[];
}

function bubbleLabel(kind: LogTraceMessage["kind"], role: LogTraceMessage["role"]): string {
  if (role === "tool") {
    return "Tool";
  }
  if (kind === "request") {
    return "Request";
  }
  return "Response";
}

export function LogMiniChat({ messages }: LogMiniChatProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {messages.map((message, index) => (
        <Box
          key={`${message.kind}-${index}`}
          sx={{
            alignSelf:
              message.role === "assistant"
                ? "flex-end"
                : message.role === "tool"
                  ? "stretch"
                  : "flex-start",
            maxWidth: message.role === "tool" ? "100%" : "85%",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            px: "10px",
            py: "8px",
            backgroundColor:
              message.role === "assistant"
                ? theme.palette.neutral[100]
                : "#ffffff",
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {bubbleLabel(message.kind, message.role)}
          </Typography>
          {message.parts.map((part, partIndex) => (
            <Typography
              key={`${part.part_kind}-${partIndex}`}
              variant="body2"
              sx={{ color: theme.palette.text.primary, mt: "4px", whiteSpace: "pre-wrap" }}
            >
              {part.part_kind === "tool-call" || part.part_kind === "tool-return"
                ? `${part.part_kind} ${part.tool_name ?? "tool"}: ${part.content}`
                : part.content}
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
}
