"use client";

import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { AgentExecutionLogListItem } from "../logs/mock-logs-data";

interface LogListItemProps {
  log: AgentExecutionLogListItem;
  isSelected: boolean;
  onClick: () => void;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString();
}

function formatDuration(durationMs: number | null): string {
  if (!durationMs) {
    return "-";
  }
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  }
  return `${durationMs}ms`;
}

export function LogListItem({ log, isSelected, onClick }: LogListItemProps) {
  const theme = useTheme();

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        p: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: isSelected
          ? theme.palette.neutral[100]
          : "#ffffff",
        cursor: "pointer",
        transition: `border-color ${"150ms"}`,
        "&:hover": {
          borderColor: theme.palette.neutral[400],
        },
      }}
    >
      {/* Log Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
          {formatDateTime(log.created_at)}
        </Typography>
        <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Chip size="small" label={log.execution_source} />
          <Chip size="small" label={log.status} />
          <Chip size="small" label={log.auth_type} />
        </Box>
      </Box>

      {/* Log Summary */}
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        Duration: {formatDuration(log.duration_ms)} | Tools: {log.tool_calls_count}
      </Typography>
      {log.error_message ? (
        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
          Error: {log.error_message}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Output: {String(log.output_payload ?? "-")}
        </Typography>
      )}
    </Box>
  );
}
