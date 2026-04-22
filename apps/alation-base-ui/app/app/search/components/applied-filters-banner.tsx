"use client";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X } from "lucide-react";

interface AppliedFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

interface AppliedFiltersBannerProps {
  filters: AppliedFilter[];
  onClearAll: () => void;
}

export function AppliedFiltersBanner({ filters, onClearAll }: AppliedFiltersBannerProps) {
  const theme = useTheme();

  if (filters.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        px: "24px",
        py: "12px",
        backgroundColor: theme.palette.neutral[50],
        borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        flexWrap: "wrap",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.primary,
          flexShrink: 0,
        }}
      >
        {filters.length} {filters.length === 1 ? "filter" : "filters"} applied
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          flex: 1,
          alignItems: "center",
        }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            onDelete={filter.onRemove}
            deleteIcon={<X size={14} />}
            size="small"
            sx={{
              height: "24px",
              fontSize: "12px",
              backgroundColor: "#ffffff",
              border: `1px solid ${theme.palette.neutral[300]}`,
              "& .MuiChip-deleteIcon": {
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.text.primary,
                },
              },
            }}
          />
        ))}
      </Box>

      <Button
        onClick={onClearAll}
        size="small"
        variant="text"
        sx={{
          textTransform: "none",
          fontSize: "13px",
          flexShrink: 0,
        }}
      >
        Clear all
      </Button>
    </Box>
  );
}
