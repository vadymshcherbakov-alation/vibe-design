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
import { useState } from "react";

interface DeauthorizeConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CONFIRMATION_TEXT = "DEAUTHORIZE";

export function DeauthorizeConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: DeauthorizeConfirmationDialogProps) {
  const theme = useTheme();
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmed = confirmationText === CONFIRMATION_TEXT;

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
          Deauthorize schedule?
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
            You are about to remove your authorization token in the workspace. All
            existing flow schedules will be disabled and unable to run.
          </Typography>

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

          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "13px",
              }}
            >
              Type <strong>{CONFIRMATION_TEXT}</strong> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
              size="small"
              autoFocus
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
          color="error"
          onClick={handleConfirm}
          disabled={!isConfirmed}
        >
          Deauthorize
        </Button>
      </DialogActions>
    </Dialog>
  );
}
