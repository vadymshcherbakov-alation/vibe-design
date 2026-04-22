"use client";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TriangleAlert } from "lucide-react";
import { ItemTypeIcon } from "./item-type-icon";
import { OutputParameterItem } from "./output-parameter-item";
import { InputParametersSection } from "./input-parameters-section";

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

interface FlowDetailPanelStepNodeProps {
  selectedStep: FlowStep | null;
  stepDetails: StepDetails;
  parameterValues: Record<string, string>;
  onParameterChange: (paramName: string, value: string) => void;
  onReplace: () => void;
  customParameters?: CustomParameter[];
  onAddCustomParameter?: () => void;
  onUpdateCustomParameter?: (
    paramId: string,
    updates: Partial<CustomParameter>
  ) => void;
  onDeleteCustomParameter?: (paramId: string) => void;
  currentNodeId?: string;
  errors?: string[];
  issues?: string[];
}

export function FlowDetailPanelStepNode({
  selectedStep,
  stepDetails,
  parameterValues,
  onParameterChange,
  onReplace,
  customParameters = [],
  onAddCustomParameter,
  onUpdateCustomParameter,
  onDeleteCustomParameter,
  currentNodeId,
  errors = [],
  issues = [],
}: FlowDetailPanelStepNodeProps) {
  const theme = useTheme();
  const [isToolBoxHovered, setIsToolBoxHovered] = useState(false);
  const hasErrors = errors.length > 0;
  const hasIssues = issues.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {selectedStep?.type === "Tool" ? "Tool" : "Agent"}
        </Typography>
        {/* Tool/Agent Item Box */}
        <Box
          onMouseEnter={() => setIsToolBoxHovered(true)}
          onMouseLeave={() => setIsToolBoxHovered(false)}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "12px",
            borderRadius: "6px",
            border: `1px solid ${theme.palette.neutral[200]}`,
          }}
        >
          {/* Item Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Icon */}
            {selectedStep?.type ? (
              <ItemTypeIcon type={selectedStep.type} size={24} />
            ) : null}
            {/* Name */}
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedStep?.name || ""}
            </Typography>
          </Box>

          {/* Replace Button - appears on hover */}
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={onReplace}
            sx={{
              opacity: isToolBoxHovered ? 1 : 0,
              transition: `opacity ${"150ms"}`,
              minWidth: "auto",
              px: "8px",
              py: "4px",
              fontSize: `${13}px`,
            }}
          >
            Replace
          </Button>
        </Box>
      </Box>
      {/* Errors and Issues Section */}
      {(hasErrors || hasIssues) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            p: "12px",
            borderRadius: "6px",
            backgroundColor: theme.palette.neutral[50],
            border: `1px solid ${theme.palette.neutral[200]}`,
          }}
        >
          {hasErrors && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TriangleAlert
                  size={16}
                  style={{ color: theme.palette.error.main }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.error.main }}
                >
                  Errors
                </Typography>
              </Box>
              {errors.map((error, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    pl: "24px",
                  }}
                >
                  {error}
                </Typography>
              ))}
            </Box>
          )}
          {hasIssues && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TriangleAlert
                  size={16}
                  style={{ color: theme.palette.error.main }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.error.main }}
                >
                  Issues
                </Typography>
              </Box>
              {issues.map((issue, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    pl: "24px",
                  }}
                >
                  {issue}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Input Parameters */}
      <InputParametersSection
        inputParameters={stepDetails.inputParameters}
        customParameters={[]}
        parameterValues={parameterValues}
        onParameterChange={onParameterChange}
        currentNodeId={currentNodeId}
        isStartNode={false}
      />

      {/* Output Parameters */}
      {stepDetails.outputParameters &&
        stepDetails.outputParameters.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Outputs
            </Typography>
            <Box
              sx={{
                gap: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {stepDetails.outputParameters.map((param) => (
                <OutputParameterItem
                  key={param.name}
                  name={param.name}
                  type={param.type}
                  description={param.description}
                />
              ))}
            </Box>
          </Box>
        )}
    </Box>
  );
}
