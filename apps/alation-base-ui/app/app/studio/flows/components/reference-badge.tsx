"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ReferenceBadgeProps {
  referenceText: string;
}

export function ReferenceBadge({ referenceText }: ReferenceBadgeProps) {
  const theme = useTheme();

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        px: "4px",
        height: "24px",
        lineHeight: "20px",
        backgroundColor: theme.palette.green[100],
        borderRadius: "4px",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          color: theme.palette.green[600],
        }}
      >
        {referenceText}
      </Typography>
    </Box>
  );
}
