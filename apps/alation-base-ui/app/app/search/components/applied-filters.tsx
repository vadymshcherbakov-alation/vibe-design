"use client";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X } from "lucide-react";

interface AppliedFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

interface AppliedFiltersProps {
  filters: AppliedFilter[];
  onClearAll: () => void;
}

export function AppliedFilters({ filters, onClearAll }: AppliedFiltersProps) {
  const theme = useTheme();

  if (filters.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 2,
        px: 3,
        pt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="body1">Applied filters</Typography>
        <Button
          onClick={onClearAll}
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "13px",
          }}
        >
          Clear all
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            onDelete={filter.onRemove}
            deleteIcon={<X size={14} />}
            color="primary"
            size="small"
            sx={{
              height: "24px",
              fontSize: "12px",
              mr: 0.5,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
