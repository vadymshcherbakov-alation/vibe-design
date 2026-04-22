"use client";

import { Box, Snackbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAgentById } from "../../agent-data";
import { LogDetailPanel } from "../components/log-detail-panel";
import { LogsFilters } from "../components/logs-filters";
import { LogsList } from "../components/logs-list";
import {
  DEFAULT_LOGS_FILTERS,
  getMockAgentLogs,
  type AgentExecutionLogDetail,
  type LogsFiltersValue,
} from "./mock-logs-data";

const PAGE_SIZE = 3;

function toDayStartTimestamp(value: string): number | null {
  if (!value) {
    return null;
  }
  return new Date(`${value}T00:00:00`).getTime();
}

function toDayEndTimestamp(value: string): number | null {
  if (!value) {
    return null;
  }
  return new Date(`${value}T23:59:59`).getTime();
}

export default function AgentLogsPage() {
  const params = useParams();
  const theme = useTheme();
  const agentId = params.id as string;
  const agent = getAgentById(agentId);

  const [filters, setFilters] = useState<LogsFiltersValue>(DEFAULT_LOGS_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [allLogs, setAllLogs] = useState<AgentExecutionLogDetail[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [retrySeed, setRetrySeed] = useState(0);
  const [evalToastOpen, setEvalToastOpen] = useState(false);

  const canAddToEvalCase = useMemo(
    () => Boolean(agent?.tools?.some((tool) => /sql/i.test(tool.name))),
    [agent?.tools],
  );

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }
      try {
        setAllLogs(getMockAgentLogs(agentId));
      } catch (_error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [agentId, retrySeed]);

  const filteredLogs = useMemo(() => {
    const createdAfterTs = toDayStartTimestamp(filters.createdAfter);
    const createdBeforeTs = toDayEndTimestamp(filters.createdBefore);

    return allLogs.filter((log) => {
      if (filters.executionSource !== "all" && log.execution_source !== filters.executionSource) {
        return false;
      }
      if (filters.status !== "all" && log.status !== filters.status) {
        return false;
      }

      const createdAtTs = new Date(log.created_at).getTime();
      if (createdAfterTs && createdAtTs < createdAfterTs) {
        return false;
      }
      if (createdBeforeTs && createdAtTs > createdBeforeTs) {
        return false;
      }

      return true;
    });
  }, [allLogs, filters]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  useEffect(() => {
    if (filteredLogs.length === 0) {
      setSelectedLogId(null);
      return;
    }

    const stillSelected = selectedLogId
      ? filteredLogs.some((log) => log.id === selectedLogId)
      : false;

    if (!stillSelected) {
      const firstLog = filteredLogs[0];
      if (firstLog) {
        setSelectedLogId(firstLog.id);
      }
    }
  }, [filteredLogs, selectedLogId]);

  const selectedLog = useMemo(
    () => filteredLogs.find((log) => log.id === selectedLogId) ?? null,
    [filteredLogs, selectedLogId],
  );

  const hasFilters = useMemo(
    () =>
      filters.executionSource !== "all" ||
      filters.status !== "all" ||
      Boolean(filters.createdAfter) ||
      Boolean(filters.createdBefore),
    [filters],
  );

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
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Logs Module Header */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Logs
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Audit execution traces from all sources. Logs are retained for 30 days.
            {filteredLogs.length > 0 ? ` Showing ${filteredLogs.length} result(s).` : ""}
          </Typography>
        </Box>

        {/* Logs Filters */}
        <LogsFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_LOGS_FILTERS)}
        />

        {/* Logs List and Detail Panel */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 1fr" },
            gap: "16px",
            alignItems: "start",
          }}
        >
          <LogsList
            logs={filteredLogs}
            selectedLogId={selectedLogId}
            isLoading={isLoading}
            isError={isError}
            hasFilters={hasFilters}
            visibleCount={visibleCount}
            onSelect={setSelectedLogId}
            onRetry={() => setRetrySeed((seed) => seed + 1)}
            onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
          />
          <LogDetailPanel
            log={selectedLog}
            canAddToEvalCase={canAddToEvalCase}
            onAddToEvalCase={() => setEvalToastOpen(true)}
          />
        </Box>
      </Box>

      <Snackbar
        open={evalToastOpen}
        autoHideDuration={2500}
        onClose={() => setEvalToastOpen(false)}
        message="Eval case prefill is ready (prototype stub)."
      />
    </Box>
  );
}
