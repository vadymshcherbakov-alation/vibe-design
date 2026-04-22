"use client";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Calendar } from "lucide-react";

interface ScheduleEmptyStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

export function ScheduleEmptyState({
  title,
  description,
  ctaLabel,
  onCtaClick,
}: ScheduleEmptyStateProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        py: "64px",
        px: "24px",
        height: "100%",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <Calendar
          size={32}
          style={{
            color: theme.palette.text.secondary,
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
            mt: "8px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {description}
        </Typography>
      </Box>
      <Button variant="outlined" color="inherit" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    </Box>
  );
}
