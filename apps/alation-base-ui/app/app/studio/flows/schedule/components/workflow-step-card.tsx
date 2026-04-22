"use client";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Trash2 } from "lucide-react";
import { WorkflowStep } from "./types";

type WorkflowStepCardProps = {
  step: WorkflowStep;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function WorkflowStepCard({
  step,
  onDuplicate,
  onDelete,
}: WorkflowStepCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "320px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.neutral[300]}`,
        overflow: "hidden",

        "&:hover": {
          cursor: "pointer",
          borderColor: theme.palette.neutral[400],
          "& .delete-button": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Delete Button - appears on hover */}
      <IconButton
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(step.id);
        }}
        sx={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: `${20}px`,
          height: `${20}px`,
          opacity: 0,
          transition: "opacity 0.2s",
          backgroundColor: "#ffffff",
          color: theme.palette.text.secondary,
          zIndex: 1,
          "&:hover": {
            backgroundColor: theme.palette.neutral[100],
            color: theme.palette.text.primary,
          },
        }}
      >
        <Trash2 size={16} />
      </IconButton>

      {/* Top Section */}
      <Box
        sx={{
          p: 12,
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {step.label}
        </Typography>
      </Box>

      {/* Bottom Section */}
      {step.secondaryText && (
        <Box
          sx={{
            p: 12,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.disabled,
            }}
          >
            {step.secondaryText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
