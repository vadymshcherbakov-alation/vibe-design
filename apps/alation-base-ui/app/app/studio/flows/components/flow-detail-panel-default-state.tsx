"use client";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ItemTypeIcon } from "./item-type-icon";
import { useFlowEditStore } from "../store/useFlowEditStore";
import demoData from "../demo-data.json";
import { HealthCheckSection } from "./health-check-section";

interface FlowDetailPanelDefaultStateProps {
  runsCount?: number;
  scheduleActive?: number;
  scheduleTotal?: number;
  allParameterValues?: Record<string, Record<string, string>>;
}

export function FlowDetailPanelDefaultState({
  runsCount: propRunsCount,
  scheduleActive: propScheduleActive,
  scheduleTotal: propScheduleTotal,
  allParameterValues,
}: FlowDetailPanelDefaultStateProps = {}) {
  const theme = useTheme();
  const { currentFlow, draftFlow, setEditDialogOpen } = useFlowEditStore();
  const workflowName = currentFlow?.name ?? "Untitled sequence";
  const description = draftFlow?.description ?? currentFlow?.description ?? "";

  // Calculate steps count from flow data
  const stepsCount = useMemo(() => {
    const steps = draftFlow?.steps || currentFlow?.steps || [];
    return steps.length;
  }, [draftFlow?.steps, currentFlow?.steps]);

  // Get summary data from demoData if flow exists, otherwise use props or defaults
  const summaryData = useMemo(() => {
    if (currentFlow?.id) {
      const flowData = (
        demoData as Array<{
          id: string;
          scheduled?: { active?: number; total?: number };
        }>
      ).find((f) => f.id === currentFlow.id);
      if (flowData) {
        return {
          runsCount: propRunsCount ?? 0, // Runs count not in demo data, use prop or default
          scheduleActive: propScheduleActive ?? flowData.scheduled?.active ?? 0,
          scheduleTotal: propScheduleTotal ?? flowData.scheduled?.total ?? 0,
        };
      }
    }
    return {
      runsCount: propRunsCount ?? 0,
      scheduleActive: propScheduleActive ?? 0,
      scheduleTotal: propScheduleTotal ?? 0,
    };
  }, [currentFlow?.id, propRunsCount, propScheduleActive, propScheduleTotal]);

  const handleOpenEditModal = () => {
    setEditDialogOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "100%",
      }}
    >
      <Box
        onClick={handleOpenEditModal}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: "6px",
          p: "4px",
          m: "-4px",
          width: "fit-content",
          "&:hover": {
            backgroundColor: theme.palette.neutral[50],
          },
        }}
      >
        <ItemTypeIcon type="Flow" size={32} />
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {workflowName}
        </Typography>
      </Box>
      <Box
        onClick={handleOpenEditModal}
        sx={{
          cursor: "pointer",
          borderRadius: "6px",
          p: "4px",
          m: "-4px",
          width: "fit-content",
          "&:hover": {
            backgroundColor: theme.palette.neutral[50],
          },
        }}
      >
        {description ? (
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {description}
          </Typography>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.disabled,
            }}
          >
            Add description
          </Typography>
        )}
      </Box>
      {/* Summary Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          pt: "16px",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Runs */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            Runs
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: theme.palette.text.primary }}
          >
            {summaryData.runsCount}
          </Typography>
        </Box>
        {/* Steps */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            Steps
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: theme.palette.text.primary }}
          >
            {stepsCount}
          </Typography>
        </Box>
        {/* Schedule */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            Schedule
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: theme.palette.text.primary }}
          >
            {summaryData.scheduleActive}/{summaryData.scheduleTotal}
          </Typography>
        </Box>
      </Box>
      {/* Health Check Section */}
      <Box
        sx={{
          pt: "16px",
        }}
      >
        <HealthCheckSection allParameterValues={allParameterValues} />
      </Box>
    </Box>
  );
}
