"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useFlowEditStore } from "../store";
import { useState, useEffect } from "react";
import { DeauthorizeConfirmationDialog } from "./deauthorize-confirmation-dialog";

interface FlowSettingsModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  hasExpiredAuth?: boolean;
}

export function FlowSettingsModal({
  open,
  onClose,
  title = "Flow settings",
  hasExpiredAuth = false,
}: FlowSettingsModalProps) {
  const theme = useTheme();
  const { scheduleAuthorized, setScheduleAuthorized } = useFlowEditStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<
    "validating" | "saving" | null
  >(null);
  const [deauthorizeDialogOpen, setDeauthorizeDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setLoadingStep(null);
    }
  }, [open]);

  const handleAuthorize = () => {
    setIsLoading(true);
    setLoadingStep("validating");

    // Step 1: Validating credential (5 seconds)
    setTimeout(() => {
      setLoadingStep("saving");

      // Step 2: Saving token (5 seconds)
      setTimeout(() => {
        setScheduleAuthorized(true);
        setIsLoading(false);
        setLoadingStep(null);
        setSnackbarMessage("Schedule authorization enabled successfully");
        setSnackbarOpen(true);
      }, 5000);
    }, 5000);
  };

  const handleDeauthorize = () => {
    setDeauthorizeDialogOpen(true);
  };

  const handleDeauthorizeConfirm = () => {
    setScheduleAuthorized(false);
    setDeauthorizeDialogOpen(false);
    setSnackbarMessage("Schedule authorization disabled");
    setSnackbarOpen(true);
  };

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
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Schedule run */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  Schedule run
                </Typography>
                {scheduleAuthorized && (
                  <Chip
                    label="Authorized"
                    size="small"
                    sx={{
                      height: "20px",
                      fontSize: "12px",
                      backgroundColor: theme.palette.green[200],
                      color: theme.palette.green[600],
                    }}
                  />
                )}
                {hasExpiredAuth && (
                  <Chip
                    label="Expired"
                    size="small"
                    sx={{
                      height: "20px",
                      fontSize: "12px",
                      backgroundColor: theme.palette.amber[200],
                      color: theme.palette.amber[600],
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "13px",
                }}
              >
                Allow this flow to run automatically on a schedule. A valid authorization is required.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={scheduleAuthorized ? handleDeauthorize : handleAuthorize}
              disabled={isLoading}
            >
              {scheduleAuthorized
                ? "Deauthorize"
                : hasExpiredAuth
                ? "Re-authorize"
                : "Authorizate"}
            </Button>
          </Box>

          {/* Loading Section */}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "12px",
                pt: "4px",
                pb: "4px",
              }}
            >
              <CircularProgress size={20} />
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                {loadingStep === "validating"
                  ? "Validating your credential"
                  : loadingStep === "saving"
                  ? "Save your authorization"
                  : ""}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Deauthorize Confirmation Dialog */}
      <DeauthorizeConfirmationDialog
        open={deauthorizeDialogOpen}
        onClose={() => setDeauthorizeDialogOpen(false)}
        onConfirm={handleDeauthorizeConfirm}
      />

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle2 size={20} />}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
