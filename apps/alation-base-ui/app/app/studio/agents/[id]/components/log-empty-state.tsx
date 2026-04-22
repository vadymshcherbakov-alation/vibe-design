"use client";

import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface LogEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function LogEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: LogEmptyStateProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px dashed ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        px: "16px",
        py: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="outlined" size="small" color="inherit" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
