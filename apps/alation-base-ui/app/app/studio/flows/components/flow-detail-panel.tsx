"use client";
import { Box, Typography, IconButton } from "@mui/material";
import { Trash2, ChevronLeft } from "lucide-react";
import { FlowDetailPanelDefaultState } from "./flow-detail-panel-default-state";
import { FlowDetailPanelStartNode } from "./flow-detail-panel-start-node";
import { FlowDetailPanelStepNode } from "./flow-detail-panel-step-node";
import { FlowDetailPanelNoDetails } from "./flow-detail-panel-no-details";
import { useFlowEditStore } from "../store/useFlowEditStore";

interface FlowStep {
  id: string;
  name: string;
  type: "Tool" | "Agent";
  inputCount?: number;
  outputCount?: number;
}

interface StepDetails {
  description?: string;
  inputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  outputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

interface CustomParameter {
  id: string;
  name: string;
  type: string;
}

interface FlowDetailPanelProps {
  selectedNode: string | null;
  selectedStep: FlowStep | null;
  stepNumber: number | null;
  stepDetails: StepDetails | null;
  onDelete: () => void;
  onReplace: () => void;
  onBack: () => void;
  parameterValues: Record<string, string>;
  allParameterValues?: Record<string, Record<string, string>>;
  onParameterChange: (paramName: string, value: string) => void;
  customParameters?: CustomParameter[];
  onAddCustomParameter?: () => void;
  onUpdateCustomParameter?: (
    paramId: string,
    updates: Partial<CustomParameter>
  ) => void;
  onDeleteCustomParameter?: (paramId: string) => void;
}

export function FlowDetailPanel({
  selectedNode,
  selectedStep,
  stepNumber,
  stepDetails,
  onDelete,
  onReplace,
  onBack,
  parameterValues,
  allParameterValues,
  onParameterChange,
  customParameters = [],
  onAddCustomParameter,
  onUpdateCustomParameter,
  onDeleteCustomParameter,
}: FlowDetailPanelProps) {
  const { ui } = useFlowEditStore();
  const healthCheckResult = ui.healthCheckResult;

  // Get errors and issues for the selected node
  const nodeErrors = selectedNode
    ? healthCheckResult?.errorsByNode[selectedNode] || []
    : [];
  const nodeIssues = selectedNode
    ? healthCheckResult?.issuesByNode[selectedNode] || []
    : [];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Panel Header */}
      {selectedNode && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "12px",
            px: "20px",
            pb: "0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "8x" }}>
            <IconButton size="small" onClick={onBack} sx={{ ml: "-8px" }}>
              <ChevronLeft size={16} />
            </IconButton>
            <Typography variant="subtitle2">Step {stepNumber}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {selectedNode !== "start" && (
              <IconButton size="small" onClick={onDelete}>
                <Trash2 size={16} />
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      {/* Panel Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          p: "20px",
        }}
      >
        {!selectedNode ? (
          <FlowDetailPanelDefaultState
            allParameterValues={allParameterValues}
          />
        ) : selectedNode === "start" ? (
          <FlowDetailPanelStartNode
            stepDetails={stepDetails}
            parameterValues={parameterValues}
            onParameterChange={onParameterChange}
            customParameters={customParameters}
            onAddCustomParameter={onAddCustomParameter}
            onUpdateCustomParameter={onUpdateCustomParameter}
            onDeleteCustomParameter={onDeleteCustomParameter}
            currentNodeId={selectedNode}
            errors={nodeErrors}
            issues={nodeIssues}
          />
        ) : stepDetails ? (
          <FlowDetailPanelStepNode
            selectedStep={selectedStep}
            stepDetails={stepDetails}
            parameterValues={parameterValues}
            onParameterChange={onParameterChange}
            onReplace={onReplace}
            customParameters={customParameters}
            onAddCustomParameter={onAddCustomParameter}
            onUpdateCustomParameter={onUpdateCustomParameter}
            onDeleteCustomParameter={onDeleteCustomParameter}
            currentNodeId={selectedNode}
            errors={nodeErrors}
            issues={nodeIssues}
          />
        ) : (
          <FlowDetailPanelNoDetails />
        )}
      </Box>
    </Box>
  );
}
