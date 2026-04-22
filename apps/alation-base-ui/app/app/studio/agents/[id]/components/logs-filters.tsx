"use client";

import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
  ExecutionSource,
  ExecutionStatus,
  LogsFiltersValue,
} from "../logs/mock-logs-data";

interface LogsFiltersProps {
  value: LogsFiltersValue;
  onChange: (next: LogsFiltersValue) => void;
  onReset: () => void;
}

const SOURCE_OPTIONS: { value: ExecutionSource | "all"; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "agent_studio", label: "Agent Studio" },
  { value: "chat_with_data", label: "Chat With Data" },
  { value: "rest_api", label: "REST API" },
  { value: "mcp", label: "MCP" },
  { value: "flow", label: "Flow" },
  { value: "flow_scheduled", label: "Flow Scheduled" },
  { value: "evaluation", label: "Evaluation" },
];

const STATUS_OPTIONS: { value: ExecutionStatus | "all"; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
];

export function LogsFilters({ value, onChange, onReset }: LogsFiltersProps) {
  const theme = useTheme();

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
      }}
    >
      {/* Filter Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
          Filters
        </Typography>
        <Button variant="text" size="small" color="inherit" onClick={onReset}>
          Reset
        </Button>
      </Box>

      {/* Filter Inputs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(180px, 1fr))",
            md: "repeat(4, minmax(180px, 1fr))",
          },
          gap: "12px",
        }}
      >
        <TextField
          select
          size="small"
          label="Source"
          value={value.executionSource}
          onChange={(event) =>
            onChange({
              ...value,
              executionSource: event.target.value as ExecutionSource | "all",
            })
          }
        >
          {SOURCE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={value.status}
          onChange={(event) =>
            onChange({
              ...value,
              status: event.target.value as ExecutionStatus | "all",
            })
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label="Created after"
          type="date"
          value={value.createdAfter}
          onChange={(event) =>
            onChange({
              ...value,
              createdAfter: event.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          label="Created before"
          type="date"
          value={value.createdBefore}
          onChange={(event) =>
            onChange({
              ...value,
              createdBefore: event.target.value,
            })
          }
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </Box>
  );
}
