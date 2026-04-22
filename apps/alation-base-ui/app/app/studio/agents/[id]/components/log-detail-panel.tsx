"use client";

import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import type { AgentExecutionLogDetail } from "../logs/mock-logs-data";
import { LogMiniChat } from "./log-mini-chat";
import { LogEmptyState } from "./log-empty-state";

interface LogDetailPanelProps {
  log: AgentExecutionLogDetail | null;
  canAddToEvalCase: boolean;
  onAddToEvalCase: (log: AgentExecutionLogDetail) => void;
}

function prettyJson(value: unknown): string {
  if (value == null) {
    return "-";
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 2);
}

export function LogDetailPanel({
  log,
  canAddToEvalCase,
  onAddToEvalCase,
}: LogDetailPanelProps) {
  const theme = useTheme();

  if (!log) {
    return (
      <LogEmptyState
        title="Select a log entry"
        description="Choose a log from the list to inspect execution details and trace."
      />
    );
  }

  const canViewChat = Boolean(log.chat_deep_link);

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
        minHeight: "560px",
      }}
    >
      {/* Detail Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Execution detail
        </Typography>
        <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip size="small" label={log.execution_source} />
          <Chip size="small" label={log.status} />
          <Chip size="small" label={log.auth_type} />
        </Box>
      </Box>

      {/* Detail Actions */}
      <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {canViewChat ? (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            component={Link}
            href={log.chat_deep_link ?? "#"}
          >
            View in Chat
          </Button>
        ) : (
          <Tooltip title="Chat no longer available">
            <span>
              <Button variant="outlined" size="small" color="inherit" disabled>
                View in Chat
              </Button>
            </span>
          </Tooltip>
        )}
        {canAddToEvalCase && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onAddToEvalCase(log)}
          >
            Add to Eval Case
          </Button>
        )}
      </Box>

      {/* Input and Output Payloads */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
          Input
        </Typography>
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            p: "10px",
            backgroundColor: theme.palette.neutral[100],
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, whiteSpace: "pre-wrap" }}>
            {prettyJson(log.input_payload)}
          </Typography>
        </Box>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
          Output
        </Typography>
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            p: "10px",
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, whiteSpace: "pre-wrap" }}>
            {prettyJson(log.output_payload)}
          </Typography>
        </Box>
      </Box>

      {/* Message Trace */}
      <Box
        sx={{
          mt: "4px",
          borderTop: `1px solid ${theme.palette.neutral[300]}`,
          pt: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
          Message trace
        </Typography>
        <Box sx={{ overflowY: "auto", pr: "4px", maxHeight: "360px" }}>
          <LogMiniChat messages={log.message_trace} />
        </Box>
      </Box>
    </Box>
  );
}
