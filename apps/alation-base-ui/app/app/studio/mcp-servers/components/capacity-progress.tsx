"use client";
import { Box, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "./circular-progress";

interface CapacityProgressProps {
  value: number; // Percentage value (0-100)
}

export function CapacityProgress({ value }: CapacityProgressProps) {
  const theme = useTheme();
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const isWarning = normalizedValue > 70;
  
  // Use warning color if capacity is above 70%
  const progressColor = isWarning
    ? theme.palette.amber[600]
    : "#52525C";
  const textColor = isWarning
    ? theme.palette.warning.dark
    : theme.palette.text.secondary;

  // Tooltip content
  const tooltipContent = (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.neutral[50],
          fontSize: "12px",
          lineHeight: "16px",
          mb: "4px",
        }}
      >
        {normalizedValue}% recommended context
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.neutral[400],
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        {isWarning ? "Possible slowdown" : "Good performance"}
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "help",
        }}
      >
        {/* Circular Progress Indicator */}
        <CircularProgress
          value={normalizedValue}
          size={16}
          progressColor={progressColor}
        />
        
        {/* Percentage Text */}
        <Box
          component="span"
          sx={{
            fontSize: "13px",
            color: textColor,
            lineHeight: "16px",
          }}
        >
          {normalizedValue}%
        </Box>
      </Box>
    </Tooltip>
  );
}
