"use client";

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  ListSubheader,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Agent } from "../../agent-data";
import OpenAILogo from "../../../assets/openai-logo.svg";
import AnthropicLogo from "../../../assets/anthropic-logo.svg";
import GoogleLogo from "../../../assets/google-logo.svg";
import AzureLogo from "../../../assets/azure.svg";
import AWSBedrockLogo from "../../../assets/aws-bedrock.svg";
import { useEditMode } from "../edit-mode-context";

interface GeneralSectionProps {
  agent: Agent;
}

// Map provider names to their logo components
const providerLogos: Record<
  string,
  React.ComponentType<{ width?: number; height?: number }>
> = {
  OpenAI: OpenAILogo,
  Anthropic: AnthropicLogo,
  Google: GoogleLogo,
  Azure: AzureLogo,
  "AWS Bedrock": AWSBedrockLogo,
};

// Mock model options grouped by credential
const modelGroups = [
  {
    credential: "My OpenAI 1",
    provider: "OpenAI",
    models: [
      { id: "gpt-4", name: "GPT-4", displayName: "My Custom GPT 4" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", displayName: "Fast GPT" },
      { id: "gpt-4o", name: "GPT-4o", displayName: "Omni Model" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      { id: "o1-preview", name: "o1-preview", displayName: "Reasoning Model" },
      { id: "o1-mini", name: "o1-mini" },
    ],
  },
  {
    credential: "Google Cred 1",
    provider: "Google",
    models: [
      { id: "gemini-pro", name: "Gemini Pro", displayName: "My Gemini" },
      { id: "gemini-ultra", name: "Gemini Ultra" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", displayName: "Latest Gemini" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    ],
  },
  {
    credential: "Google Cred 2",
    provider: "Google",
    models: [
      { id: "gemini-pro-2", name: "Gemini Pro", displayName: "Backup Gemini" },
      { id: "gemini-ultra-2", name: "Gemini Ultra" },
    ],
  },
  {
    credential: "Anthropic Production",
    provider: "Anthropic",
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus", displayName: "Best Claude" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", displayName: "Fast Claude" },
      { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", displayName: "Latest Sonnet" },
    ],
  },
  {
    credential: "Azure OpenAI",
    provider: "Azure",
    models: [
      { id: "azure-gpt-4", name: "GPT-4", displayName: "Azure GPT-4" },
      { id: "azure-gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "azure-gpt-35", name: "GPT-3.5 Turbo" },
    ],
  },
];

// Flatten for easy lookup
const allModels = modelGroups.flatMap((group) =>
  group.models.map((model) => ({
    ...model,
    provider: group.provider,
    credential: group.credential,
  }))
);

export function GeneralSection({ agent }: GeneralSectionProps) {
  const theme = useTheme();
  const { isEditMode } = useEditMode();
  const [description, setDescription] = useState(agent.description || "");
  const [selectedModel, setSelectedModel] = useState(
    agent.model ? `${agent.model.provider}-${agent.model.name}` : ""
  );
  const [modelSearch, setModelSearch] = useState("");

  // Filter model groups based on search
  const filteredModelGroups = modelGroups
    .map((group) => ({
      ...group,
      models: group.models.filter(
        (model) =>
          model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
          (model.displayName &&
            model.displayName.toLowerCase().includes(modelSearch.toLowerCase())) ||
          group.credential.toLowerCase().includes(modelSearch.toLowerCase())
      ),
    }))
    .filter((group) => group.models.length > 0);

  // Default to OpenAI logo for mockup if provider not found
  const LogoComponent = agent.model
    ? providerLogos[agent.model.provider] || OpenAILogo
    : OpenAILogo;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Description Field */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          Description
        </Typography>
        {isEditMode ? (
          <>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Enter description..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              }}
            />
            {/* Help Text Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Appears in the UI to describe your agent.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {description.length}/500
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {agent.description || "No description provided."}
          </Typography>
        )}
      </Box>

      {/* Model Field */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          Model
        </Typography>
        {isEditMode ? (
          <FormControl size="small" sx={{ maxWidth: "400px" }}>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              displayEmpty
              renderValue={(value) => {
                if (!value) {
                  return (
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      Select a model...
                    </Typography>
                  );
                }
                const option = allModels.find((m) => m.id === value);
                if (option) {
                  const OptionLogo = providerLogos[option.provider] || OpenAILogo;
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "8px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <OptionLogo width={20} height={20} />
                        <Typography variant="body1">
                          {option.displayName || option.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={option.name}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "12px",
                          backgroundColor: theme.palette.neutral[100],
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </Box>
                  );
                }
                // Fallback for agent's current model (not in options list)
                if (agent.model) {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "8px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LogoComponent width={20} height={20} />
                        <Typography variant="body1">My Custom GPT 5</Typography>
                      </Box>
                      <Chip
                        label={`${agent.model.provider} ${agent.model.name}`}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "12px",
                          backgroundColor: theme.palette.neutral[100],
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </Box>
                  );
                }
                return value;
              }}
              sx={{
                backgroundColor: "#ffffff",
              }}
              onClose={() => setModelSearch("")}
              MenuProps={{
                autoFocus: false,
                PaperProps: {
                  sx: {
                    maxHeight: "400px",
                  },
                },
                MenuListProps: {
                  sx: {
                    pt: 0,
                  },
                },
              }}
            >
              {/* Search Input */}
              <ListSubheader
                sx={{
                  backgroundColor: "white",
                  px: "12px",
                  pt: "12px",
                  pb: "4px",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search models..."
                  fullWidth
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    },
                  }}
                />
              </ListSubheader>
              {filteredModelGroups.map((group, groupIndex) => {
                const GroupLogo = providerLogos[group.provider] || OpenAILogo;
                return [
                  <ListSubheader
                    key={group.credential}
                    sx={{
                      backgroundColor: "white",
                      lineHeight: "32px",
                      px: "12px",
                      mt: groupIndex > 0 ? "12px" : "8px",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {group.credential}
                    </Typography>
                  </ListSubheader>,
                  ...group.models.map((model) => (
                    <MenuItem
                      key={model.id}
                      value={model.id}
                      sx={{ px: "12px", pl: "20px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          gap: "8px",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                          <GroupLogo width={16} height={16} />
                          <Typography variant="body1">
                            {model.displayName || model.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={model.name}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "12px",
                            backgroundColor:
                              theme.palette.neutral[100],
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                    </MenuItem>
                  )),
                ];
              })}
            </Select>
          </FormControl>
        ) : agent.model ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LogoComponent width={20} height={20} />
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              My Custom GPT 5 ({agent.model.provider} {agent.model.name})
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            No model selected.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
