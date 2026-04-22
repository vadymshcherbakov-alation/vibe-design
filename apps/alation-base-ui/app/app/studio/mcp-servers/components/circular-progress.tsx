"use client";
import { Box, CircularProgress as MuiCircularProgress } from "@mui/material";

interface CircularProgressProps {
  value: number; // Percentage value (0-100)
  size?: number; // Size of the circle in pixels
  strokeWidth?: number; // Width of the background stroke (not used with MUI, kept for API compatibility)
  progressColor?: string; // Color of the progress arc
  backgroundColor?: string; // Color of the background circle
}

export function CircularProgress({
  value,
  size = 16,
  progressColor = "#52525C",
  backgroundColor = "#E7E7E7",
}: CircularProgressProps) {
  // Normalize value to 0-100 range
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        flexShrink: 0,
      }}
    >
      {/* Background circle using MUI CircularProgress with 0 value */}
      <MuiCircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={2}
        sx={{
          position: "absolute",
          color: backgroundColor,
          // Rotate to start from top (12 o'clock)
          transform: "rotate(-90deg)",
        }}
      />
      {/* Progress arc */}
      {normalizedValue > 0 && (
        <MuiCircularProgress
          variant="determinate"
          value={normalizedValue}
          size={size}
          thickness={4}
          sx={{
            position: "absolute",
            color: progressColor,
            // Rotate to start from top (12 o'clock)
            transform: "rotate(-90deg)",
            // Ensure smooth rendering
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      )}
    </Box>
  );
}
