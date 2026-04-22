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

interface AgentData {
  name: string;
  description: string;
  type: "conversational" | "task" | "workflow";
}

interface Agent {
  id: string;
  name: string;
  type: "conversational" | "task" | "workflow";
  category: "native" | "custom";
  creator: string;
  access: ("mcp" | "rest")[];
  description: string;
  createdAt: string;
  status: "active" | "inactive" | "draft";
}

interface AddAgentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (agentData: AgentData) => void;
  agentToEdit?: Agent | null;
}

export function AddAgentModal({
  open,
  onClose,
  onSave,
  agentToEdit,
}: AddAgentModalProps) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"conversational" | "task" | "workflow">("conversational");

  useEffect(() => {
    if (open) {
      if (agentToEdit) {
        setName(agentToEdit.name);
        setDescription(agentToEdit.description);
        setType(agentToEdit.type);
      } else {
        // Reset to defaults
        setName("");
        setDescription("");
        setType("conversational");
      }
    }
  }, [open, agentToEdit]);

  const handleSave = () => {
    const agentData: AgentData = {
      name: name.trim(),
      description: description.trim(),
      type,
    };

    onSave(agentData);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setType("conversational");
    onClose();
  };

  const canSave = name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      {/* Dialog Header */}
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
          {agentToEdit ? "Edit agent" : "Build agent"}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ px: "24px", py: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Name Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "4px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Name your agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) {
                  handleSave();
                }
              }}
              size="small"
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

          {/* Type Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "8px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "conversational" | "task" | "workflow")
                }
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[300],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.neutral[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="conversational">Conversational</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="workflow">Workflow</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Description Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                mb: "4px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15px",
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe what this agent does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
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
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "24px",
          pb: "24px",
          pt: "24px",
          justifyContent: "flex-end",
          gap: "8px",
          minHeight: "84px",
          alignItems: "flex-end",
        }}
      >
        <Button
          onClick={handleClose}
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
              backgroundColor: theme.palette.blue[700],
            },
            "&:disabled": {
              backgroundColor: theme.palette.neutral[50],
              color: theme.palette.text.disabled,
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
