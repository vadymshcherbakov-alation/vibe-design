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
import { useState, useEffect } from "react";

interface CreateMcpServerModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (serverName: string) => void;
}

export function CreateMcpServerModal({
  open,
  onClose,
  onCreate,
}: CreateMcpServerModalProps) {
  const theme = useTheme();
  const [serverName, setServerName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (open) {
      setServerName("");
      setNameError("");
    }
  }, [open]);

  const handleNameChange = (value: string) => {
    setServerName(value);
    if (value.length > 64) {
      setNameError("Maximum 64 characters allowed");
    } else {
      setNameError("");
    }
  };

  const handleCreate = () => {
    const trimmedName = serverName.trim();
    if (!trimmedName) {
      setNameError("MCP server name is required");
      return;
    }
    if (trimmedName.length > 64) {
      setNameError("Maximum 64 characters allowed");
      return;
    }
    onCreate(trimmedName);
    setServerName("");
    setNameError("");
    onClose();
  };

  const handleClose = () => {
    setServerName("");
    setNameError("");
    onClose();
  };

  const canCreate = serverName.trim().length > 0 && serverName.trim().length <= 64;

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
          New MCP server
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* MCP server name field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
                fontWeight: "500",
              }}
            >
              MCP server name
            </Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="mcp-server-example-name-with-maximum-sixty-four-characters-xx123"
              value={serverName}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canCreate) {
                  handleCreate();
                }
              }}
              error={!!nameError}
              helperText={nameError || "Maximum 64 characters."}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: nameError
                      ? theme.palette.error.main
                      : theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: nameError
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.error.main,
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: 0,
                  marginTop: "4px",
                  fontSize: "12px",
                  color: nameError
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pb: "20px",
          pt: "12px",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        {/* Tool guide button (hidden for now, matching design) */}
        <Box sx={{ opacity: 0 }}>
          <Button variant="outlined" size="small" disabled>
            Tool guide
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          <Button onClick={handleClose} variant="text" color="inherit" size="small">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            size="small"
            disabled={!canCreate}
          >
            Create server
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
