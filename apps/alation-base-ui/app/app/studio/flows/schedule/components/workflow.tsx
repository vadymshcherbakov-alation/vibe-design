"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { WorkflowStep } from "./types";
import { WorkflowStepCard } from "./workflow-step-card";
import { WorkflowConnector } from "./workflow-connector";
import { AddStepButton } from "./add-step-button";

type WorkflowProps = {
  steps: WorkflowStep[];
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAddStep: () => void;
};

export function Workflow({
  steps,
  onDuplicate,
  onDelete,
  onAddStep,
}: WorkflowProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: theme.palette.neutral[50],
        overflow: "hidden",
        overflowY: "auto",
        scrollbarGutter: "stable",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: "100%",
          maxWidth: "600px",
          p: "40px",
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={step.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <WorkflowStepCard
              step={step}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
            {index < steps.length - 1 && <WorkflowConnector />}
          </Box>
        ))}
        <AddStepButton onClick={onAddStep} />
      </Box>
    </Box>
  );
}
