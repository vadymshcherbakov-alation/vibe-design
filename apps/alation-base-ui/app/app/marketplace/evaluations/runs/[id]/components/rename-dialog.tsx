"use client";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editedName: string;
  onNameChange: (name: string) => void;
}

export function RenameDialog({
  open,
  onClose,
  onSave,
  editedName,
  onNameChange,
}: RenameDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
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
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Typography variant="h2">Rename evaluation run</Typography>
        <IconButton
          onClick={onClose}
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
              Name
            </Typography>
            <TextField
              fullWidth
              value={editedName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter evaluation run name"
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
        <Button variant="text" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!editedName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
