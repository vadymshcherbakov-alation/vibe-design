"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { X, Trash2 } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  type ModelProvider,
  providerDisplayNames,
} from "./add-model-provider-modal";
import { ProviderIcon } from "./provider-icon";
import { DeleteConfirmationDialog } from "../../flows/components/delete-flow-dialog";

interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  authorized: boolean;
  modelsCount: number;
  createdAt: string;
}

interface ModelCredentials {
  name: string;
  apiKey: string;
}

interface EditModelCredentialsModalProps {
  open: boolean;
  onClose: () => void;
  model: Model | null;
  onSave: (modelId: string, credentials: ModelCredentials) => void;
  onDelete?: (modelId: string) => void;
}

function getModelBrand(modelId: string): ModelProvider {
  const id = modelId.toLowerCase();
  if (
    id.startsWith("gpt-") ||
    id.startsWith("o1-") ||
    id.startsWith("o3-") ||
    id.startsWith("dall-e") ||
    id.startsWith("whisper") ||
    id.startsWith("tts-") ||
    id.startsWith("text-embedding-")
  )
    return "openai";
  if (id.startsWith("claude-")) return "anthropic";
  if (id.startsWith("gemini-") || id.startsWith("palm-")) return "google";
  return "custom";
}

// Mock models under this provider (30 items to demonstrate scrollbar)
const MOCK_PROVIDER_MODELS = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-3.5-turbo-instruct", name: "GPT-3.5 Turbo Instruct" },
  { id: "o1-preview", name: "O1 Preview" },
  { id: "o1-mini", name: "O1 Mini" },
  { id: "gpt-4o-audio", name: "GPT-4o Audio" },
  { id: "gpt-4o-image", name: "GPT-4o Image" },
  { id: "gpt-4-32k", name: "GPT-4 32K" },
  { id: "gpt-4-vision", name: "GPT-4 Vision" },
  { id: "gpt-4-nano", name: "GPT-4 Nano" },
  { id: "gpt-4-micro", name: "GPT-4 Micro" },
  { id: "text-embedding-3-large", name: "Text Embedding 3 Large" },
  { id: "text-embedding-3-small", name: "Text Embedding 3 Small" },
  { id: "text-embedding-ada-002", name: "Text Embedding Ada 002" },
  { id: "dall-e-3", name: "DALL-E 3" },
  { id: "dall-e-2", name: "DALL-E 2" },
  { id: "whisper-1", name: "Whisper" },
  { id: "tts-1", name: "TTS-1" },
  { id: "tts-1-hd", name: "TTS-1 HD" },
  { id: "gpt-5-preview", name: "GPT-5 Preview" },
  { id: "gpt-5-turbo", name: "GPT-5 Turbo" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "gemini-pro", name: "Gemini Pro" },
  { id: "gemini-ultra", name: "Gemini Ultra" },
];

export function EditModelCredentialsModal({
  open,
  onClose,
  model,
  onSave,
  onDelete,
}: EditModelCredentialsModalProps) {
  const theme = useTheme();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete?.(model!.id);
    setDeleteConfirmOpen(false);
    handleClose();
  };

  if (!model) return null;

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "480px",
          maxWidth: "480px",
          maxHeight: "720px",
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
          display: "flex",
          flexDirection: "column",
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
          flexShrink: 0,
        }}
      >
        <Typography variant="h2" component="span">
          Model provider
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ marginRight: "-8px" }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 0,
          py: "12px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Provider + Name as text with icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
            mb: "16px",
            px: "20px",
          }}
        >
          <ProviderIcon provider={model.provider} size={28} />
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "12px",
                lineHeight: 1.2,
              }}
            >
              {providerDisplayNames[model.provider]}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {model.name}
            </Typography>
          </Box>
        </Box>

        {/* Scroll section: models under this provider – full width so scrollbar at edge */}
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.primary,
            mb: "8px",
            flexShrink: 0,
            px: "20px",
          }}
        >
          Models
        </Typography>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {MOCK_PROVIDER_MODELS.map((m, index) => (
            <Box key={m.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  py: "8px",
                  px: "20px",
                }}
              >
                <ProviderIcon provider={getModelBrand(m.id)} size={24} />
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.primary,
                    flex: 1,
                  }}
                >
                  {m.name}
                </Typography>
                <Chip
                  label={m.id}
                  size="small"
                  sx={{
                    height: "22px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor: theme.palette.neutral[100],
                    color: theme.palette.text.secondary,
                    border: "none",
                    "& .MuiChip-label": {
                      px: "8px",
                    },
                  }}
                />
              </Box>
              {index < MOCK_PROVIDER_MODELS.length - 1 && (
                <Divider sx={{ borderColor: theme.palette.neutral[300] }} />
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>

      {/* Footer with Remove provider on the left */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: "20px",
          pb: "20px",
          pt: "12px",
          flexShrink: 0,
          borderTop: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Button
          onClick={handleDeleteClick}
          variant="text"
          color="error"
          startIcon={<Trash2 size={16} />}
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            height: "36px",
            px: "16px",
            "&:hover": {
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          Remove provider
        </Button>
      </Box>

    </Dialog>

    {/* Delete confirmation – same dialog as context menu Remove */}
    <DeleteConfirmationDialog
      open={deleteConfirmOpen}
      onClose={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Remove model provider?"
      description={`Are you sure you want to remove "${model.name}"? This action cannot be undone.`}
      confirmButtonText="Remove"
    />
    </>
  );
}
