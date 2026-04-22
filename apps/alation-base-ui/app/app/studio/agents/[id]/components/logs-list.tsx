"use client";

import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { AgentExecutionLogListItem } from "../logs/mock-logs-data";
import { LogListItem } from "./log-list-item";
import { LogEmptyState } from "./log-empty-state";

interface LogsListProps {
  logs: AgentExecutionLogListItem[];
  selectedLogId: string | null;
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  visibleCount: number;
  onSelect: (logId: string) => void;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function LogsList({
  logs,
  selectedLogId,
  isLoading,
  isError,
  hasFilters,
  visibleCount,
  onSelect,
  onRetry,
  onLoadMore,
}: LogsListProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton variant="rounded" height={112} />
        <Skeleton variant="rounded" height={112} />
        <Skeleton variant="rounded" height={112} />
      </Box>
    );
  }

  if (isError) {
    return (
      <LogEmptyState
        title="Could not load logs"
        description="Something went wrong while loading execution logs."
        actionLabel="Retry"
        onAction={onRetry}
      />
    );
  }

  if (logs.length === 0) {
    return hasFilters ? (
      <LogEmptyState
        title="No logs match current filters"
        description="Try adjusting source, status, or date range."
      />
    ) : (
      <LogEmptyState
        title="No logs yet"
        description="Agent execution logs will appear here after runs complete."
      />
    );
  }

  const visibleLogs = logs.slice(0, visibleCount);
  const hasMore = visibleCount < logs.length;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        p: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* List Header */}
      <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
        Logs ({logs.length})
      </Typography>

      {/* List Content */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {visibleLogs.map((log) => (
          <LogListItem
            key={log.id}
            log={log}
            isSelected={selectedLogId === log.id}
            onClick={() => onSelect(log.id)}
          />
        ))}
      </Box>

      {/* Pagination Action */}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: "4px" }}>
          <Button variant="outlined" size="small" color="inherit" onClick={onLoadMore}>
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
