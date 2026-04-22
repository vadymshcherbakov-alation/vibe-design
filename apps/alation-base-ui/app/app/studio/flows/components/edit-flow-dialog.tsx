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
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useFlowEditStore } from "../store";

interface EditFlowDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export function EditFlowDialog({ open, onClose, onSave }: EditFlowDialogProps) {
  const theme = useTheme();
  const {
    currentFlow,
    draftFlow,
    updateFlowName,
    updateFlowDescription,
    commitDraftToCurrent,
    setCurrentFlow,
  } = useFlowEditStore();

  // Get current values from store (draft takes precedence, fallback to current)
  const editedName = draftFlow?.name ?? currentFlow?.name ?? "";
  const editedDescription =
    draftFlow?.description ?? currentFlow?.description ?? "";

  // Initialize draft when dialog opens
  React.useEffect(() => {
    if (open && currentFlow) {
      // Initialize draft from current flow if not already set
      if (!draftFlow) {
        setCurrentFlow(currentFlow);
      }
    }
  }, [open, currentFlow, draftFlow, setCurrentFlow]);

  const handleSave = () => {
    if (editedName.trim()) {
      commitDraftToCurrent();
      onSave(editedName, editedDescription);
    }
  };

  const handleClose = () => {
    // Reset draft to current flow values on close
    if (currentFlow) {
      setCurrentFlow(currentFlow);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          Title and description
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ marginRight: "-8px" }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: "8px",
                color: theme.palette.text.primary,
              }}
            >
              Title
            </Typography>
            <TextField
              fullWidth
              value={editedName}
              onChange={(e) => updateFlowName(e.target.value)}
              placeholder="Enter flow name"
              size="small"
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: "8px",
                color: theme.palette.text.primary,
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => updateFlowDescription(e.target.value)}
              placeholder="Add a description for this flow (optional)"
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: "20px",
          pt: "12px",
          pb: "20px",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="text" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!editedName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
