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
  Switch,
} from "@mui/material";
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

interface ConfigureGroupsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConfigureGroupsModal({
  open,
  onClose,
}: ConfigureGroupsModalProps) {
  const theme = useTheme();
  const [autoSuspendEnabled, setAutoSuspendEnabled] = useState(false);
  const [roleAssignmentEnabled, setRoleAssignmentEnabled] = useState(false);

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "560px",
          maxWidth: "560px",
          borderRadius: "16px",
          boxShadow:
            "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "22px",
          pb: "16px",
          px: "24px",
        }}
      >
        <Typography variant="h2" component="span">
          Configure Groups
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: "24px", py: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Auto-suspend toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: "4px",
                }}
              >
                Auto-suspend users without role group
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                }}
              >
                Automatically suspend users who are not assigned to any role
                group. This helps maintain security by ensuring all active users
                have defined roles.
              </Typography>
            </Box>
            <Switch
              checked={autoSuspendEnabled}
              onChange={(e) => setAutoSuspendEnabled(e.target.checked)}
            />
          </Box>

          {/* Role assignment toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: "4px",
                }}
              >
                Enable group role assignment
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                }}
              >
                Allow roles to be assigned through group membership. When
                enabled, users inherit the role of the group they belong to.
              </Typography>
            </Box>
            <Switch
              checked={roleAssignmentEnabled}
              onChange={(e) => setRoleAssignmentEnabled(e.target.checked)}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: "24px",
          pb: "24px",
          pt: "24px",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
            color: "inherit",
            "&:hover": {
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
