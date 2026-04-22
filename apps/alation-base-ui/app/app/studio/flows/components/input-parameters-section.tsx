"use client";
import { Box, Typography, Button, Tooltip, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Plus, Info, BookOpen, ExternalLink } from "lucide-react";
import { ParameterInputField } from "./parameter-input-field";
import { AddableParameterField } from "./addable-parameter-field";
import { TypeBadge } from "./type-badge";

interface InputParameter {
  name: string;
  type: string;
  description: string;
}

interface CustomParameter {
  id: string;
  name: string;
  type: string;
}

interface InputParametersSectionProps {
  inputParameters?: InputParameter[];
  customParameters?: CustomParameter[];
  parameterValues: Record<string, string>;
  onParameterChange: (paramName: string, value: string) => void;
  onAddCustomParameter?: () => void;
  onUpdateCustomParameter?: (
    paramId: string,
    updates: Partial<CustomParameter>
  ) => void;
  onDeleteCustomParameter?: (paramId: string) => void;
  currentNodeId?: string;
  isStartNode?: boolean;
}

export function InputParametersSection({
  inputParameters = [],
  customParameters = [],
  parameterValues,
  onParameterChange,
  onAddCustomParameter,
  onUpdateCustomParameter,
  onDeleteCustomParameter,
  currentNodeId,
  isStartNode = false,
}: InputParametersSectionProps) {
  const theme = useTheme();

  const hasParameters =
    (inputParameters && inputParameters.length > 0) ||
    (customParameters && customParameters.length > 0);

  // Only allow adding custom parameters for start node
  const canAddCustomParameter = isStartNode && onAddCustomParameter;

  if (!hasParameters && !canAddCustomParameter) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Typography
            variant="subtitle1"
            sx={{ color: theme.palette.text.primary }}
          >
            {isStartNode ? "Runtime inputs" : "Input"}
          </Typography>
          {isStartNode && (
            <Tooltip
              title="Pass dynamic values like id or name before running."
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
          )}
        </Box>
        {canAddCustomParameter && (
          <Button
            size="small"
            variant="text"
            color="inherit"
            startIcon={<Plus size={16} />}
            onClick={onAddCustomParameter}
          >
            Add
          </Button>
        )}
      </Box>
      <Box
        sx={{
          gap: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Empty State - Onboarding Tip */}
        {!hasParameters && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              p: "12px",
              borderRadius: "8px",
              backgroundColor: theme.palette.neutral[50],
            }}
          >
            <Box
              sx={{
                color: theme.palette.text.secondary,
                flexShrink: 0,
                mt: "2px",
              }}
            >
              <BookOpen size={16} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
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
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Pass dynamic values like
                </Typography>
                <TypeBadge type="id" />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  or
                </Typography>
                <TypeBadge type="name" />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  before running.
                </Typography>
              </Box>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add learn more action
                }}
                sx={{
                  fontSize: "14px",
                  color: theme.palette.info.main,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Learn more
                <ExternalLink size={14} />
              </Link>
            </Box>
          </Box>
        )}

        {/* Predefined Parameters */}
        {inputParameters &&
          inputParameters.length > 0 &&
          inputParameters.map((param) => (
            <Box key={param.name}>
              <ParameterInputField
                name={param.name}
                type={param.type}
                value={parameterValues[param.name] || ""}
                onChange={(value) => {
                  onParameterChange(param.name, value);
                }}
                placeholder={`Enter ${param.name}`}
                description={param.description}
                currentNodeId={currentNodeId}
              />
            </Box>
          ))}
        {/* Custom Parameters */}
        {customParameters.map((param) => (
          <AddableParameterField
            key={param.id}
            paramId={param.id}
            name={param.name}
            type={param.type}
            value={parameterValues[param.id] || ""}
            onNameChange={(paramId, name) => {
              onUpdateCustomParameter?.(paramId, { name });
            }}
            onTypeChange={(paramId, type) => {
              onUpdateCustomParameter?.(paramId, { type });
            }}
            onValueChange={(paramId, value) => {
              onParameterChange(paramId, value);
            }}
            onDelete={onDeleteCustomParameter || (() => {})}
            currentNodeId={currentNodeId}
          />
        ))}
      </Box>
    </Box>
  );
}
