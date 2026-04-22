"use client";
import { Box } from "@mui/material";
import { Plus } from "lucide-react";
import { useTheme } from "@mui/material/styles";

type AddStepButtonProps = {
  onClick: () => void;
};

export function AddStepButton({ onClick }: AddStepButtonProps) {
  const theme = useTheme();

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        mt: 2,
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: theme.palette.blue[600],
        color: theme.palette.neutral[50],
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor:
            theme.palette.blue[700],
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          transform: "scale(1.05)",
        },
        "&:active": {
          transform: "scale(0.95)",
        },
      }}
    >
      <Plus size={24} />
    </Box>
  );
}
