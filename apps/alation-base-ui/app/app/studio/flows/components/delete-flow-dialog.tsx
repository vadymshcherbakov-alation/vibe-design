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
import { X, TriangleAlert } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { ReactNode, useState, useEffect } from "react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmButtonText: string;
  showWarning?: boolean;
  requireConfirmationText?: string;
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  showWarning = true,
  requireConfirmationText,
}: DeleteConfirmationDialogProps) {
  const theme = useTheme();
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmed = requireConfirmationText
    ? confirmationText === requireConfirmationText
    : true;

  useEffect(() => {
    if (!open) {
      setConfirmationText("");
    }
  }, [open]);

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      setConfirmationText("");
      onConfirm();
    }
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
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {description}
          </Typography>
          {showWarning && (
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                p: "8px",
                backgroundColor: theme.palette.red[100],
                border: `1px solid ${theme.palette.red[500]}`,
                borderRadius: "6px",
              }}
            >
              <Box sx={{ pt: "1px" }}>
                <TriangleAlert size={16} stroke={theme.palette.red[500]} />
              </Box>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                This action cannot be undone.
              </Typography>
            </Box>
          )}
          {requireConfirmationText && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "13px",
                }}
              >
                Type <strong>{requireConfirmationText}</strong> to confirm:
              </Typography>
              <TextField
                fullWidth
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={requireConfirmationText}
                size="small"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.neutral[400],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>
          )}
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
          color="error"
          onClick={handleConfirm}
          disabled={!isConfirmed}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Backward compatibility wrapper for DeleteFlowDialog
interface DeleteFlowDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flowName?: string;
}

export function DeleteFlowDialog({
  open,
  onClose,
  onConfirm,
  flowName,
}: DeleteFlowDialogProps) {
  return (
    <DeleteConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete flow?"
      description={
        <>
          This will permanently delete the flow
          {flowName ? ` "${flowName}"` : ""} and all corresponding scheduled
          runs.
        </>
      }
      confirmButtonText="Delete flow"
    />
  );
}
