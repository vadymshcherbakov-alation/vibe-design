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
import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import OpenAILogo from "../assets/openai-logo.svg";
import AnthropicLogo from "../assets/anthropic-logo.svg";
import GoogleLogo from "../assets/google-logo.svg";
import AzureLogo from "../assets/azure.svg";
import AWSBedrockLogo from "../assets/aws-bedrock.svg";
import CustomModelLogo from "../assets/custom-model-logo.svg";

const providerLogos: Record<
  string,
  React.ComponentType<{ width?: number; height?: number }>
> = {
  OpenAI: OpenAILogo,
  Anthropic: AnthropicLogo,
  Google: GoogleLogo,
  Azure: AzureLogo,
  "AWS Bedrock": AWSBedrockLogo,
  Alation: CustomModelLogo,
};

const modelGroups = [
  {
    credential: "Alation Managed",
    provider: "Alation",
    models: [
      { id: "alation-bedrock-sonnet-4.5", name: "Bedrock Sonnet 4.5", displayName: "Bedrock Sonnet 4.5 (Alation)", iconProvider: "AWS Bedrock" },
      { id: "alation-openai-gpt-5", name: "GPT-5", displayName: "OpenAI GPT-5 (Alation)", iconProvider: "OpenAI" },
      { id: "alation-claude-sonnet", name: "Claude 3.5 Sonnet", displayName: "Claude 3.5 Sonnet (Alation)", iconProvider: "Anthropic" },
      { id: "alation-gemini-pro", name: "Gemini Pro", displayName: "Gemini Pro (Alation)", iconProvider: "Google" },
    ],
  },
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

const allModels = modelGroups.flatMap((group) =>
  group.models.map((model) => {
    const modelWithMeta = model as typeof model & { iconProvider?: string };
    return {
      ...modelWithMeta,
      provider: group.provider,
      credential: group.credential,
      iconProvider: modelWithMeta.iconProvider ?? group.provider,
    };
  })
);

export { allModels };

export interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  placeholder?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  sx?: object;
}

export function ModelSelector({
  value,
  onChange,
  placeholder = "Select a model...",
  size = "small",
  disabled = false,
  sx,
}: ModelSelectorProps) {
  const theme = useTheme();
  const [modelSearch, setModelSearch] = useState("");

  const filteredModelGroups = useMemo(
    () =>
      modelGroups
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
        .filter((group) => group.models.length > 0),
    [modelSearch]
  );

  return (
    <FormControl size={size} disabled={disabled} sx={{ minWidth: 280, maxWidth: 400, ...sx }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.disabled }}
              >
                {placeholder}
              </Typography>
            );
          }
          const option = allModels.find((m) => m.id === selected);
          if (option) {
            const iconProvider = option.iconProvider ?? option.provider;
            const OptionLogo = providerLogos[iconProvider] || OpenAILogo;
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
          return selected;
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
              "& .MuiListItemIcon-root": {
                display: "none",
              },
              "& .MuiMenuItem-root.Mui-selected::after": {
                display: "none",
              },
            },
          },
        }}
      >
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
              <Typography variant="subtitle2">
                {group.credential}
              </Typography>
            </ListSubheader>,
            ...group.models.map((model) => {
              const modelWithIcon = model as typeof model & { iconProvider?: string };
              const ModelLogo = (modelWithIcon.iconProvider
                ? providerLogos[modelWithIcon.iconProvider]
                : GroupLogo) || OpenAILogo;
              return (
                <MenuItem
                  key={model.id}
                  value={model.id}
                  sx={{ px: "12px", pl: "20px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "8px",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {value === model.id ? (
                        <Check
                          size={16}
                          style={{
                            color: theme.palette.text.primary,
                          }}
                        />
                      ) : null}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                        minWidth: 0,
                        gap: "8px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          minWidth: 0,
                        }}
                      >
                        <ModelLogo width={16} height={16} />
                        <Typography variant="body1" noWrap>
                          {model.displayName || model.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={model.name}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "12px",
                          flexShrink: 0,
                          backgroundColor:
                            theme.palette.neutral[100],
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </Box>
                  </Box>
                </MenuItem>
              );
            }),
          ];
        })}
      </Select>
    </FormControl>
  );
}
