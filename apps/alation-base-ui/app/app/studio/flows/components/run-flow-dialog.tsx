"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { X, Play } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useFlowEditStore } from "../store";
import { TypeBadge } from "./type-badge";

interface RunFlowDialogProps {
  open: boolean;
  onClose: () => void;
  onRun: (inputValues: Record<string, string>) => void;
}

export function RunFlowDialog({ open, onClose, onRun }: RunFlowDialogProps) {
  const theme = useTheme();
  const { currentFlow, draftFlow } = useFlowEditStore();

  // Get start node inputs
  const startNodeInputs =
    draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];

  // Local state for input values
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Reset input values when dialog opens
  useEffect(() => {
    if (open) {
      const initialValues: Record<string, string> = {};
      startNodeInputs.forEach((input) => {
        initialValues[input.name] = "";
      });
      setInputValues(initialValues);
    }
  }, [open, startNodeInputs]);

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRun = () => {
    onRun(inputValues);
    onClose();
  };

  // Check if all required inputs are filled
  const allInputsFilled = startNodeInputs.every(
    (input) => inputValues[input.name]?.trim() !== ""
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "480px",
          maxWidth: "480px",
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "20px",
          pb: "12px",
          px: "20px",
        }}
      >
        <Typography variant="h2" component="span">
          Run flow
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Description */}
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            Provide values for the input parameters to run this flow.
          </Typography>

          {/* Input Fields */}
          {startNodeInputs.map((input) => (
            <Box key={input.name}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  mb: "8px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {input.name}
                </Typography>
                <TypeBadge type={input.type} />
              </Box>
              {input.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: "8px",
                  }}
                >
                  {input.description}
                </Typography>
              )}
              <TextField
                fullWidth
                value={inputValues[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={`Enter ${input.name}`}
                size="small"
                multiline={input.type === "object"}
                rows={input.type === "object" ? 3 : 1}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pt: "12px",
          pb: "20px",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="text" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleRun}
          disabled={!allInputsFilled}
          startIcon={<Play size={16} />}
        >
          Run
        </Button>
      </DialogActions>
    </Dialog>
  );
}
