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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

interface AddGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: {
    name: string;
    description: string;
    mappedRole: string;
    definedIn: "Alation" | "Alation Cloud";
  }) => void;
}

const ROLES = [
  "Server Admin",
  "Catalog Admin",
  "Composer",
  "Explorer",
  "Source Admin",
  "Steward",
  "Viewer",
];

export function AddGroupModal({ open, onClose, onSave }: AddGroupModalProps) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mappedRole, setMappedRole] = useState("");
  const [definedIn, setDefinedIn] = useState<"Alation" | "Alation Cloud">(
    "Alation"
  );

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setMappedRole("");
      setDefinedIn("Alation");
    }
  }, [open]);

  const handleSave = () => {
    onSave({
      name: name.trim(),
      description: description.trim(),
      mappedRole,
      definedIn,
    });
    onClose();
  };

  const canSave = name.trim().length > 0;

  const fieldLabelSx = {
    color: theme.palette.text.secondary,
    mb: "4px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.15px",
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.neutral[400],
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  const selectSx = {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.neutral[300],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.neutral[400],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
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
          Add Group
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: "24px", py: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Group Name */}
          <Box>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              Group Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) handleSave();
              }}
              size="small"
              sx={inputSx}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe the purpose of this group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
              sx={inputSx}
            />
          </Box>

          {/* Mapped To (Role) */}
          <Box>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              Mapped To
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={mappedRole}
                onChange={(e) => setMappedRole(e.target.value)}
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Defined In */}
          <Box>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              Defined In
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={definedIn}
                onChange={(e) =>
                  setDefinedIn(e.target.value as "Alation" | "Alation Cloud")
                }
                sx={selectSx}
              >
                <MenuItem value="Alation">Alation</MenuItem>
                <MenuItem value="Alation Cloud">Alation Cloud</MenuItem>
              </Select>
            </FormControl>
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
          disabled={!canSave}
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
            backgroundColor: theme.palette.blue[600],
            color: "#ffffff",
            "&:hover": {
              backgroundColor:
                theme.palette.blue[700],
            },
            "&:disabled": {
              backgroundColor: theme.palette.neutral[50],
              color: theme.palette.text.disabled,
            },
          }}
        >
          Add Group
        </Button>
      </DialogActions>
    </Dialog>
  );
}
