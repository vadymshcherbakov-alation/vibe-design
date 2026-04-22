"use client";
import { useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CheckCircle2, TriangleAlert, Info, BookOpen } from "lucide-react";
import { useFlowEditStore } from "../store/useFlowEditStore";

function performHealthCheck(
  steps: Array<{
    id: string;
    label: string;
    inputParameters?: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  }>,
  startNodeInputs: Array<{ name: string; type: string }> = [],
  parameterValues: Record<string, Record<string, string>> = {}
): {
  checkedAt: Date;
  hasError: boolean;
  hasIssues: boolean;
  errorsByNode: Record<string, string[]>;
  issuesByNode: Record<string, string[]>;
  snapshot: {
    steps: Array<{ id: string; label: string }>;
    startNodeInputs: Array<{ name: string; type: string }>;
  };
} {
  const errorsByNode: Record<string, string[]> = {};
  const issuesByNode: Record<string, string[]> = {};

  // Check 1: Only start node exists (error) - this is a flow-level error
  if (steps.length === 0) {
    errorsByNode["flow"] = [
      "Flow contains only the start node. Add at least one step to create a valid flow.",
    ];
  }

  // Check 2: Check if start node runtime inputs are filled (error)
  if (startNodeInputs.length > 0) {
    const startNodeParamValues = parameterValues["start"] || {};
    const missingStartInputs: string[] = [];

    startNodeInputs.forEach((input) => {
      const value = startNodeParamValues[input.name];
      if (!value || value.trim() === "") {
        missingStartInputs.push(input.name);
      }
    });

    if (missingStartInputs.length > 0) {
      if (!errorsByNode["start"]) {
        errorsByNode["start"] = [];
      }
      errorsByNode["start"]!.push(
        `Unfilled runtime inputs: ${missingStartInputs.join(", ")}`
      );
    }
  }

  // Check 3: If there are other nodes, check if all inputs are filled
  if (steps.length > 0) {
    steps.forEach((step) => {
      if (step.inputParameters && step.inputParameters.length > 0) {
        const stepParamValues = parameterValues[step.id] || {};
        const missingInputs: string[] = [];

        step.inputParameters.forEach((param) => {
          const value = stepParamValues[param.name];
          if (!value || value.trim() === "") {
            missingInputs.push(param.name);
          }
        });

        if (missingInputs.length > 0) {
          if (!issuesByNode[step.id]) {
            issuesByNode[step.id] = [];
          }
          issuesByNode[step.id]!.push(
            `Unfilled inputs: ${missingInputs.join(", ")}`
          );
        }
      }
    });
  }

  const hasError = Object.keys(errorsByNode).length > 0;
  const hasIssues = Object.keys(issuesByNode).length > 0;

  return {
    checkedAt: new Date(),
    hasError,
    hasIssues,
    errorsByNode,
    issuesByNode,
    snapshot: {
      steps: steps.map((step) => ({ id: step.id, label: step.label })),
      startNodeInputs: startNodeInputs.map((input) => ({
        name: input.name,
        type: input.type,
      })),
    },
  };
}

function isReportStale(
  currentSteps: Array<{ id: string; label: string }>,
  currentStartNodeInputs: Array<{ name: string; type: string }>,
  snapshot: {
    steps: Array<{ id: string; label: string }>;
    startNodeInputs: Array<{ name: string; type: string }>;
  }
): boolean {
  // Compare steps
  if (currentSteps.length !== snapshot.steps.length) {
    return true;
  }

  for (let i = 0; i < currentSteps.length; i++) {
    const current = currentSteps[i]!;
    const snap = snapshot.steps[i];
    if (!snap || current.id !== snap.id || current.label !== snap.label) {
      return true;
    }
  }

  // Compare start node inputs
  if (currentStartNodeInputs.length !== snapshot.startNodeInputs.length) {
    return true;
  }

  for (let i = 0; i < currentStartNodeInputs.length; i++) {
    const current = currentStartNodeInputs[i]!;
    const snap = snapshot.startNodeInputs[i];
    if (!snap || current.name !== snap.name || current.type !== snap.type) {
      return true;
    }
  }

  return false;
}

interface HealthCheckSectionProps {
  allParameterValues?: Record<string, Record<string, string>>;
}

export function HealthCheckSection({
  allParameterValues = {},
}: HealthCheckSectionProps = {}) {
  const theme = useTheme();
  const {
    ui,
    setHealthCheckLoading,
    setHealthCheckResult,
    draftFlow,
    currentFlow,
  } = useFlowEditStore();
  const isLoading = ui.healthCheckLoading;
  const result = ui.healthCheckResult;

  // Get steps from store
  const steps = useMemo(() => {
    return draftFlow?.steps || currentFlow?.steps || [];
  }, [draftFlow?.steps, currentFlow?.steps]);

  // Get start node inputs from store
  const startNodeInputs = useMemo(() => {
    return draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];
  }, [draftFlow?.startNodeInputs, currentFlow?.startNodeInputs]);

  // Use provided parameter values or empty object
  const parameterValues = allParameterValues;

  // Check if report is stale
  const isStale = useMemo(() => {
    if (!result) return false;
    const currentSteps = steps.map((step) => ({
      id: step.id,
      label: step.label,
    }));
    const currentStartNodeInputs = startNodeInputs.map((input) => ({
      name: input.name,
      type: input.type,
    }));
    return isReportStale(currentSteps, currentStartNodeInputs, result.snapshot);
  }, [result, steps, startNodeInputs]);

  const handleCheckNow = () => {
    setHealthCheckLoading(true);
    // Simulate health check - in real implementation, this would be an API call
    setTimeout(() => {
      const checkResult = performHealthCheck(
        steps,
        startNodeInputs,
        parameterValues
      );
      setHealthCheckResult(checkResult);
      setHealthCheckLoading(false);
    }, 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.text.primary }}
        >
          Flow status
        </Typography>
        <Tooltip
          title="Check for errors and issues in your flow configuration before running."
          arrow
          placement="top"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: theme.palette.text.secondary,
            }}
          >
            <Info size={14} />
          </Box>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <CircularProgress
              size={20}
              enableTrackSlot
              sx={{ color: theme.palette.text.secondary }}
            />
          </Box>
        ) : result ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {/* Date */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: isStale
                    ? theme.palette.warning.dark
                    : theme.palette.info.main,
                }}
              >
                {isStale && "Report stale. "}Last checked on{" "}
                {result.checkedAt.toLocaleString()}
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={handleCheckNow}
                sx={{
                  color: theme.palette.info.main,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Rerun
              </Link>
            </Box>

            {result.hasError || result.hasIssues ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Errors by Node */}
                {result.hasError &&
                  Object.entries(result.errorsByNode).map(
                    ([nodeId, errors]) => (
                      <Box
                        key={nodeId}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          p: "12px",
                          borderBottom: `1px solid ${theme.palette.neutral[200]}`,
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
                            {nodeId === "flow"
                              ? "Flow"
                              : nodeId === "start"
                                ? "Start Node"
                                : `Node: ${nodeId}`}
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
                    )
                  )}

                {/* Issues by Node */}
                {result.hasIssues &&
                  Object.entries(result.issuesByNode).map(
                    ([nodeId, issues]) => {
                      const step = steps.find((s) => s.id === nodeId);
                      const nodeLabel = step?.label || nodeId;
                      return (
                        <Box
                          key={nodeId}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            p: "12px",
                            borderBottom: `1px solid ${theme.palette.neutral[200]}`,
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
                              Node: {nodeLabel}
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
                      );
                    }
                  )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle2
                  size={24}
                  style={{ color: theme.palette.success.main }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  All checks passed
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            No check yet, run your flow to see the status.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
