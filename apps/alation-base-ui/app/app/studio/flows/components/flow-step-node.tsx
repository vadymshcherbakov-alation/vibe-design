"use client";
import { Box, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TriangleAlert } from "lucide-react";
import { ItemTypeIcon } from "./item-type-icon";

interface FlowStepNodeProps {
  stepNumber: number;
  name: string;
  type: "Tool" | "Agent" | "Start";
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  inputCount?: number;
  outputCount?: number;
  hasIssue?: boolean;
}

export function FlowStepNode({
  stepNumber,
  name,
  type,
  isSelected,
  onClick,
  inputCount,
  outputCount,
  hasIssue = false,
}: FlowStepNodeProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* Step Number */}
      <Box
        sx={{
          width: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.text.disabled,
          }}
        >
          {stepNumber}
        </Typography>
      </Box>

      {/* Step Card */}
      <Box
        onClick={onClick}
        sx={{
          position: "relative",
          width: "480px",
          minWidth: "280px",
          backgroundColor: "#ffffff",
          border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.neutral[300]}`,
          borderRadius: "6px",
          overflow: "hidden",
          cursor: "pointer",
          transition: `border-color ${"150ms"}, box-shadow ${"150ms"}`,
          "&:hover": {
            borderColor: isSelected
              ? theme.palette.primary.main
              : theme.palette.neutral[400],
            boxShadow: isSelected ? "none" : "rgba(87, 84, 91, 0.06) 0px 0px 0px 2px",
          },
        }}
      >
        {/* Top Section - Icon and Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            p: "12px",
          }}
        >
          {/* Tool Icon */}
          <ItemTypeIcon type={type} size={32} />
          <Typography variant="subtitle2">{name}</Typography>
        </Box>

        {/* Bottom Section - Input/Output Indicators */}
        {(inputCount !== undefined && inputCount > 0) ||
        (outputCount !== undefined && outputCount > 0) ||
        hasIssue ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "12px",
              pb: "12px",
              pt: "12px",
              backgroundColor: theme.palette.neutral[50],
            }}
          >
            {/* Left: Input/Output Indicators */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Input Indicator */}
              {inputCount !== undefined && inputCount > 0 && (
                <Tooltip
                  title={
                    type === "Start"
                      ? `Runtime inputs: ${inputCount}`
                      : `Inputs: ${inputCount}`
                  }
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 7.99983H9.99967M9.99967 7.99983L7.99967 9.99983M9.99967 7.99983L7.99967 5.99983M3.66632 3.66652C4.52338 2.80946 5.61533 2.2258 6.8041 1.98934C7.99287 1.75288 9.22507 1.87424 10.3449 2.33807C11.4647 2.80191 12.4218 3.58738 13.0952 4.59517C13.7685 5.60297 14.128 6.78781 14.128 7.99986C14.128 9.21192 13.7685 10.3968 13.0952 11.4046C12.4218 12.4123 11.4647 13.1978 10.3449 13.6617C9.22507 14.1255 7.99287 14.2469 6.8041 14.0104C5.61533 13.7739 4.52338 13.1903 3.66632 12.3332"
                        stroke={theme.palette.text.secondary}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {inputCount}
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              {/* Output Indicator */}
              {outputCount !== undefined && outputCount > 0 && (
                <Tooltip title={`output: ${outputCount}`} arrow placement="top">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.3337 12.3332C11.4767 13.1903 10.3847 13.774 9.19593 14.0104C8.00716 14.2469 6.77497 14.1255 5.65517 13.6617C4.53537 13.1978 3.57826 12.4124 2.90487 11.4046C2.23149 10.3968 1.87207 9.21194 1.87207 7.99988C1.87207 6.78782 2.23149 5.60297 2.90487 4.59518C3.57826 3.58739 4.53537 2.80191 5.65517 2.33807C6.77497 1.87424 8.00716 1.75288 9.19593 1.98934C10.3847 2.2258 11.4767 2.80946 12.3337 3.66652M6.66703 7.99983H13.3337M13.3337 7.99983L11.3337 9.99983M13.3337 7.99983L11.3337 5.99983"
                        stroke={theme.palette.text.secondary}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {outputCount}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>

            {/* Right: Issue Icon */}
            {hasIssue && (
              <Tooltip
                title="This node has health check issues"
                arrow
                placement="top"
              >
                <TriangleAlert
                  size={16}
                  style={{ color: theme.palette.warning.main }}
                />
              </Tooltip>
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
