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
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { X, ArrowLeft, Minus, Search, Trash2 } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import OpenAILogo from "../../assets/openai-logo.svg";
import AnthropicLogo from "../../assets/anthropic-logo.svg";
import GoogleLogo from "../../assets/google-logo.svg";
import AWSBedrockLogo from "../../assets/aws-bedrock.svg";
import AzureLogo from "../../assets/azure.svg";
import NavModelsIcon from "../../assets/nav-models.svg";
import { EmptyState } from "../../mcp-servers/components/empty-state";
import { ProviderIcon } from "./provider-icon";

export type ModelProvider =
  | "openai"
  | "anthropic"
  | "aws-bedrock"
  | "azure-openai"
  | "google"
  | "custom"
  | "custom-no-models";

interface ModelProviderData {
  provider: ModelProvider;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  description?: string;
  // AWS Bedrock
  region?: string;
  accessKeyId?: string;
  secretKey?: string;
  sessionToken?: string;
  // Azure OpenAI
  endpoint?: string;
  apiVersion?: string;
  azureAuthMethod?: "apiKey" | "servicePrincipal";
  azureApiKey?: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  // Google
  googleAuthMethod?: "apiKey" | "serviceAccount";
  googleApiKey?: string;
  projectId?: string;
  location?: string;
  serviceAccountJson?: string;
}

interface AddModelProviderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (providerData: ModelProviderData) => void;
}

export const providerDisplayNames: Record<ModelProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  "aws-bedrock": "AWS Bedrock",
  "azure-openai": "Azure OpenAI",
  google: "Google",
  custom: "Custom",
  "custom-no-models": "Custom (no models list flow)",
};

interface AIModel {
  id: string;
  name: string;
  type: string;
}

const mockOpenAIModels: AIModel[] = [
  { id: "gpt-4o", name: "GPT-4o", type: "Chat" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", type: "Chat" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", type: "Chat" },
  { id: "gpt-4", name: "GPT-4", type: "Chat" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", type: "Chat" },
  { id: "gpt-3.5-turbo-instruct", name: "GPT-3.5 Turbo Instruct", type: "Chat" },
  { id: "o1-preview", name: "O1 Preview", type: "Chat" },
  { id: "o1-mini", name: "O1 Mini", type: "Chat" },
  { id: "gpt-4o-audio", name: "GPT-4o Audio", type: "Chat" },
  { id: "gpt-4o-image", name: "GPT-4o Image", type: "Chat" },
  { id: "text-embedding-3-large", name: "Text Embedding 3 Large", type: "Embedding" },
  { id: "text-embedding-3-small", name: "Text Embedding 3 Small", type: "Embedding" },
  { id: "text-embedding-ada-002", name: "Text Embedding Ada 002", type: "Embedding" },
  { id: "dall-e-3", name: "DALL-E 3", type: "Image" },
  { id: "dall-e-2", name: "DALL-E 2", type: "Image" },
  { id: "whisper-1", name: "Whisper", type: "Audio" },
  { id: "tts-1", name: "TTS-1", type: "Audio" },
  { id: "tts-1-hd", name: "TTS-1 HD", type: "Audio" },
  { id: "gpt-4-32k", name: "GPT-4 32K", type: "Chat" },
  { id: "gpt-4-vision", name: "GPT-4 Vision", type: "Chat" },
  { id: "gpt-4-nano", name: "GPT-4 Nano", type: "Chat" },
  { id: "gpt-4-micro", name: "GPT-4 Micro", type: "Chat" },
  { id: "gpt-5-preview", name: "GPT-5 Preview", type: "Chat" },
  { id: "gpt-5-turbo", name: "GPT-5 Turbo", type: "Chat" },
  { id: "claude-3-opus", name: "Claude 3 Opus", type: "Chat" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", type: "Chat" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", type: "Chat" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", type: "Chat" },
  { id: "gemini-pro", name: "Gemini Pro", type: "Chat" },
  { id: "gemini-pro-vision", name: "Gemini Pro Vision", type: "Chat" },
  { id: "gemini-ultra", name: "Gemini Ultra", type: "Chat" },
  { id: "llama-3-70b", name: "Llama 3 70B", type: "Chat" },
  { id: "llama-3-8b", name: "Llama 3 8B", type: "Chat" },
  { id: "mistral-large", name: "Mistral Large", type: "Chat" },
  { id: "mistral-small", name: "Mistral Small", type: "Chat" },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", type: "Chat" },
  { id: "codellama-34b", name: "Code Llama 34B", type: "Chat" },
  { id: "deepseek-coder", name: "DeepSeek Coder", type: "Chat" },
  { id: "qwen-72b", name: "Qwen 72B", type: "Chat" },
  { id: "command-r-plus", name: "Command R+", type: "Chat" },
];

export function AddModelProviderModal({
  open,
  onClose,
  onSave,
}: AddModelProviderModalProps) {
  const theme = useTheme();
  const [provider, setProvider] = useState<ModelProvider>("openai");
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [region, setRegion] = useState("us-west-2");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [azureEndpoint, setAzureEndpoint] = useState("");
  const [azureApiVersion, setAzureApiVersion] = useState("2024-02-01");
  const [azureAuthMethod, setAzureAuthMethod] = useState<
    "apiKey" | "servicePrincipal"
  >("apiKey");
  const [azureApiKey, setAzureApiKey] = useState("");
  const [azureTenantId, setAzureTenantId] = useState("");
  const [azureClientId, setAzureClientId] = useState("");
  const [azureClientSecret, setAzureClientSecret] = useState("");
  const [googleAuthMethod, setGoogleAuthMethod] = useState<
    "apiKey" | "serviceAccount"
  >("apiKey");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [googleProjectId, setGoogleProjectId] = useState("");
  const [googleLocation, setGoogleLocation] = useState("us-central1");
  const [googleServiceAccountJson, setGoogleServiceAccountJson] = useState("");
  const googleJsonInputRef = useRef<HTMLInputElement>(null);
  const nameManuallyEdited = useRef(false);
  const previousProvider = useRef<ModelProvider>("openai");
  const [isValidating, setIsValidating] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelDisplayNames, setModelDisplayNames] = useState<
    Record<string, string>
  >({});
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [addedCustomModelIds, setAddedCustomModelIds] = useState<string[]>([]);
  const [customModelDisplayNames, setCustomModelDisplayNames] = useState<
    Record<string, string>
  >({});

  const getDefaultName = (p: ModelProvider) =>
    `${providerDisplayNames[p]} Account`;

  useEffect(() => {
    if (open) {
      // Reset to defaults
      setProvider("openai");
      setName(getDefaultName("openai"));
      setApiKey("");
      setBaseUrl("");
      setRegion("us-west-2");
      setAccessKeyId("");
      setSecretKey("");
      setSessionToken("");
      setAzureEndpoint("");
      setAzureApiVersion("2024-02-01");
      setAzureAuthMethod("apiKey");
      setAzureApiKey("");
      setAzureTenantId("");
      setAzureClientId("");
      setAzureClientSecret("");
      setGoogleAuthMethod("apiKey");
      setGoogleApiKey("");
      setGoogleProjectId("");
      setGoogleLocation("us-central1");
      setGoogleServiceAccountJson("");
      setShowSecondModal(false);
      setShowThirdModal(false);
      setSelectedModels([]);
      setModelDisplayNames({});
      setModelSearchTerm("");
      setAddedCustomModelIds([]);
      setCustomModelDisplayNames({});
      nameManuallyEdited.current = false;
      previousProvider.current = "openai";
    }
  }, [open]);

  // Pre-fill display names when entering step 3: "Model Name -1", "Model Name -2", etc.
  useEffect(() => {
    if (showThirdModal && selectedModels.length > 0) {
      const selected = mockOpenAIModels.filter((m) =>
        selectedModels.includes(m.id)
      );
      setModelDisplayNames((prev) => {
        const next = { ...prev };
        selected.forEach((model, index) => {
          next[model.id] = `${model.name} -${index + 1}`;
        });
        return next;
      });
    }
  }, [showThirdModal, selectedModels]);

  // Auto-fill name based on provider selection (e.g. "OpenAI Account")
  // Only update if name hasn't been manually edited or if it matches the previous provider's default name
  useEffect(() => {
    const defaultName = getDefaultName(provider);
    const prevProvider = previousProvider.current;
    const previousDefaultName = getDefaultName(prevProvider);

    if (
      !nameManuallyEdited.current &&
      (!name || name === previousDefaultName)
    ) {
      setName(defaultName);
    }
    previousProvider.current = provider;
  }, [provider]);

  const providersWithApiKeyAndBaseUrl: ModelProvider[] = [
    "openai",
    "anthropic",
    "custom",
    "custom-no-models",
  ];

  const buildProviderData = (): ModelProviderData => ({
    provider,
    name: name.trim() || provider,
    ...(providersWithApiKeyAndBaseUrl.includes(provider) && apiKey.trim()
      ? { apiKey: apiKey.trim() }
      : {}),
    ...((providersWithApiKeyAndBaseUrl.includes(provider) ||
      provider === "custom" ||
      provider === "custom-no-models") &&
    baseUrl.trim()
      ? { baseUrl: baseUrl.trim() }
      : {}),
    ...(provider === "aws-bedrock" && {
      region: region.trim() || "us-west-2",
      accessKeyId: accessKeyId.trim(),
      secretKey: secretKey.trim(),
      ...(sessionToken.trim() ? { sessionToken: sessionToken.trim() } : {}),
    }),
    ...(provider === "azure-openai" && {
      endpoint: azureEndpoint.trim(),
      apiVersion: azureApiVersion,
      azureAuthMethod,
      ...(azureAuthMethod === "apiKey"
        ? { azureApiKey: azureApiKey.trim() }
        : {
            tenantId: azureTenantId.trim(),
            clientId: azureClientId.trim(),
            clientSecret: azureClientSecret.trim(),
          }),
    }),
    ...(provider === "google" && {
      googleAuthMethod,
      ...(googleAuthMethod === "apiKey"
        ? { googleApiKey: googleApiKey.trim() }
        : {
            projectId: googleProjectId.trim(),
            location: googleLocation,
            serviceAccountJson:
              googleServiceAccountJson.trim() || undefined,
          }),
    }),
  });

  const handleValidateAndContinue = () => {
    if (provider === "custom-no-models") {
      setShowSecondModal(true);
      return;
    }
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setShowSecondModal(true);
    }, 3000);
  };

  const handleFinish = () => {
    onSave(buildProviderData());
    handleClose();
  };

  const handleSearchAndAddCustomModel = () => {
    const id = modelSearchTerm.trim();
    if (!id) return;
    if (addedCustomModelIds.includes(id)) return;
    setAddedCustomModelIds((prev) => [...prev, id]);
    setModelSearchTerm("");
  };

  const handleRemoveCustomModel = (modelId: string) => {
    setAddedCustomModelIds((prev) => prev.filter((id) => id !== modelId));
    setCustomModelDisplayNames((prev) => {
      const next = { ...prev };
      delete next[modelId];
      return next;
    });
  };

  const handleClose = () => {
    setProvider("openai");
    setName("");
    setApiKey("");
    setBaseUrl("");
    setRegion("us-west-2");
    setAccessKeyId("");
    setSecretKey("");
    setSessionToken("");
    setAzureEndpoint("");
    setAzureApiVersion("2024-02-01");
    setAzureAuthMethod("apiKey");
    setAzureApiKey("");
    setAzureTenantId("");
    setAzureClientId("");
    setAzureClientSecret("");
    setGoogleAuthMethod("apiKey");
    setGoogleApiKey("");
    setGoogleProjectId("");
    setGoogleLocation("us-central1");
    setGoogleServiceAccountJson("");
    onClose();
  };

  const handleGoogleJsonFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setGoogleServiceAccountJson(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const canSave =
    name.trim().length > 0 &&
    (!providersWithApiKeyAndBaseUrl.includes(provider) ||
      apiKey.trim().length > 0) &&
    (provider !== "aws-bedrock" ||
      (accessKeyId.trim().length > 0 && secretKey.trim().length > 0)) &&
    (provider !== "azure-openai" ||
      (azureEndpoint.trim().length > 0 &&
        (azureAuthMethod === "apiKey"
          ? azureApiKey.trim().length > 0
          : azureTenantId.trim().length > 0 &&
            azureClientId.trim().length > 0 &&
            azureClientSecret.trim().length > 0))) &&
    (provider !== "google" ||
      (googleAuthMethod === "apiKey"
        ? googleApiKey.trim().length > 0
        : googleProjectId.trim().length > 0 && googleServiceAccountJson.trim().length > 0));

  const handleCloseCurrentStep = () => {
    if (showThirdModal) {
      setShowThirdModal(false);
    } else if (showSecondModal) {
      setShowSecondModal(false);
      onClose();
    } else {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseCurrentStep}
      PaperProps={{
        sx: {
          width: "600px",
          maxWidth: "600px",
          ...(showSecondModal && {
            minHeight: "384px",
            display: "flex",
            flexDirection: "column",
            ...(provider === "custom-no-models"
              ? {
                  height: "384px",
                  maxHeight: "90vh",
                }
              : {
                  height: "720px",
                  maxHeight: "720px",
                }),
          }),
          ...(showThirdModal && {
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            maxHeight: "90vh",
          }),
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
        },
      }}
    >
      {/* Dialog Header - changes by step */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(showSecondModal || showThirdModal) && (
            <IconButton
              onClick={() =>
                showThirdModal ? setShowThirdModal(false) : setShowSecondModal(false)
              }
              size="small"
              sx={{ marginLeft: "-8px" }}
            >
              <ArrowLeft size={16} />
            </IconButton>
          )}
          <Typography variant="h2" component="span">
            {showThirdModal
              ? "Display names"
              : showSecondModal
                ? provider === "custom-no-models"
                  ? "Search models"
                  : "Select models"
                : "Add model provider"}
          </Typography>
        </Box>
        <IconButton onClick={handleCloseCurrentStep} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Step 1: Provider and credentials form */}
      {!showSecondModal && (
      <>
      <DialogContent sx={{ px: "20px", py: "12px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Provider Type */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Provider
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ModelProvider)}
                renderValue={(selected) => {
                  const selectedProvider = selected as ModelProvider;
                  const getIcon = () => {
                    switch (selectedProvider) {
                      case "openai":
                        return <OpenAILogo width={16} height={16} />;
                      case "anthropic":
                        return <AnthropicLogo width={16} height={16} />;
                      case "aws-bedrock":
                        return <AWSBedrockLogo width={16} height={16} />;
                      case "azure-openai":
                        return <AzureLogo width={16} height={16} />;
                      case "google":
                        return <GoogleLogo width={16} height={16} />;
                      case "custom":
                        return <NavModelsIcon width={16} height={16} />;
                      case "custom-no-models":
                        return <NavModelsIcon width={16} height={16} />;
                    }
                  };
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {getIcon()}
                      <span>
                        {providerDisplayNames[selectedProvider]}
                      </span>
                    </Box>
                  );
                }}
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
                <MenuItem value="openai">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <OpenAILogo width={16} height={16} />
                    <span>OpenAI</span>
                  </Box>
                </MenuItem>
                <MenuItem value="anthropic">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AnthropicLogo width={16} height={16} />
                    <span>Anthropic</span>
                  </Box>
                </MenuItem>
                <MenuItem value="aws-bedrock">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AWSBedrockLogo width={16} height={16} />
                    <span>AWS Bedrock</span>
                  </Box>
                </MenuItem>
                <MenuItem value="azure-openai">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AzureLogo width={16} height={16} />
                    <span>Azure OpenAI</span>
                  </Box>
                </MenuItem>
                <MenuItem value="google">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <GoogleLogo width={16} height={16} />
                    <span>Google</span>
                  </Box>
                </MenuItem>
                <MenuItem value="custom">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <NavModelsIcon width={16} height={16} />
                    <span>Custom</span>
                  </Box>
                </MenuItem>
                <MenuItem value="custom-no-models">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <NavModelsIcon width={16} height={16} />
                    <span>Custom (no models list flow)</span>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: "4px",
              }}
            >
              Configuration options below will vary by provider.
            </Typography>
          </Box>

          {/* Name */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
              }}
            >
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Provider name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                nameManuallyEdited.current = true;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) {
                  handleValidateAndContinue();
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

          {/* Provider config section title */}
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              mt: "8px",
              mb: "4px",
            }}
          >
            {providerDisplayNames[provider]} config
          </Typography>

          {/* OpenAI / Anthropic / Custom config: API Key (required), Base URL */}
          {(provider === "openai" ||
            provider === "anthropic" ||
            provider === "custom" ||
            provider === "custom-no-models") && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  API Key
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: theme.palette.error.main, ml: "2px" }}
                  >
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter API key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSave) {
                      handleValidateAndContinue();
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
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Base URL
                </Typography>
                <TextField
                  fullWidth
                  placeholder="https://api.openai.com/v1"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
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
            </>
          )}

          {/* AWS Bedrock config: Region, Access Key ID, Secret Key, Session Token */}
          {provider === "aws-bedrock" && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Region
                </Typography>
                <TextField
                  fullWidth
                  placeholder="us-west-2"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
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
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Access Key ID
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: theme.palette.error.main, ml: "2px" }}
                  >
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter access key ID"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
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
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Secret Key
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: theme.palette.error.main, ml: "2px" }}
                  >
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter secret key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
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
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Session Token
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter session token (optional)"
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
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
            </>
          )}

          {/* Azure OpenAI config: Endpoint, API Version, Auth Method */}
          {provider === "azure-openai" && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Endpoint
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: theme.palette.error.main,
                      ml: "2px",
                    }}
                  >
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="https://myresource.openai.azure.com"
                  value={azureEndpoint}
                  onChange={(e) => setAzureEndpoint(e.target.value)}
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
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  API Version
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: theme.palette.error.main,
                      ml: "2px",
                    }}
                  >
                    *
                  </Typography>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={azureApiVersion}
                    onChange={(e) => setAzureApiVersion(e.target.value)}
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
                    <MenuItem value="2024-02-01">2024-02-01</MenuItem>
                    <MenuItem value="2024-08-01-preview">2024-08-01-preview</MenuItem>
                    <MenuItem value="2024-06-01">2024-06-01</MenuItem>
                    <MenuItem value="2023-12-01-preview">
                      2023-12-01-preview
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Auth Method */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Auth Method
                </Typography>
                <ToggleButtonGroup
                  value={azureAuthMethod}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setAzureAuthMethod(newValue);
                    }
                  }}
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.neutral[100],
                    borderRadius: "6px",
                    padding: "2px",
                    gap: "2px",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "none",
                      "&:not(:first-of-type)": {
                        borderRadius: "4px",
                        marginLeft: "0px",
                      },
                      "&:first-of-type": {
                        borderRadius: "4px",
                      },
                    },
                    "& .MuiToggleButton-root": {
                      padding: "4px 12px",
                      fontSize: "13px",
                      fontWeight: 500,
                      textTransform: "none",
                      border: "none",
                      color: theme.palette.text.primary,
                      borderRadius: "4px",
                      "&.Mui-selected": {
                        backgroundColor:
                          "#ffffff",
                        color: theme.palette.text.primary,
                        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                        "&:hover": {
                          backgroundColor:
                            "#ffffff",
                        },
                      },
                      "&:not(.Mui-selected):hover": {
                        backgroundColor:
                          theme.palette.neutral[100],
                      },
                    },
                  }}
                >
                  <ToggleButton value="apiKey">API Key</ToggleButton>
                  <ToggleButton value="servicePrincipal">
                    Service Principal
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* API Key fields */}
                {azureAuthMethod === "apiKey" && (
                  <Box sx={{ mt: "16px" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.primary,
                        mb: "8px",
                      }}
                    >
                      API Key
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: theme.palette.error.main,
                          ml: "2px",
                        }}
                      >
                        *
                      </Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter API key"
                      type="password"
                      value={azureApiKey}
                      onChange={(e) => setAzureApiKey(e.target.value)}
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
                )}

                {/* Service Principal fields */}
                {azureAuthMethod === "servicePrincipal" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      mt: "16px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Tenant ID
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={azureTenantId}
                        onChange={(e) => setAzureTenantId(e.target.value)}
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
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Client ID
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={azureClientId}
                        onChange={(e) => setAzureClientId(e.target.value)}
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
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Client Secret
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter client secret"
                        type="password"
                        value={azureClientSecret}
                        onChange={(e) =>
                          setAzureClientSecret(e.target.value)
                        }
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
                )}
              </Box>
            </>
          )}

          {/* Google config: Auth Method (API Key | Service Account) */}
          {provider === "google" && (
            <>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: "8px",
                  }}
                >
                  Auth Method
                </Typography>
                <ToggleButtonGroup
                  value={googleAuthMethod}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      setGoogleAuthMethod(newValue);
                    }
                  }}
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.neutral[100],
                    borderRadius: "6px",
                    padding: "2px",
                    gap: "2px",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "none",
                      "&:not(:first-of-type)": {
                        borderRadius: "4px",
                        marginLeft: "0px",
                      },
                      "&:first-of-type": {
                        borderRadius: "4px",
                      },
                    },
                    "& .MuiToggleButton-root": {
                      padding: "4px 12px",
                      fontSize: "13px",
                      fontWeight: 500,
                      textTransform: "none",
                      border: "none",
                      color: theme.palette.text.primary,
                      borderRadius: "4px",
                      "&.Mui-selected": {
                        backgroundColor:
                          "#ffffff",
                        color: theme.palette.text.primary,
                        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                        "&:hover": {
                          backgroundColor:
                            "#ffffff",
                        },
                      },
                      "&:not(.Mui-selected):hover": {
                        backgroundColor:
                          theme.palette.neutral[100],
                      },
                    },
                  }}
                >
                  <ToggleButton value="apiKey">API Key</ToggleButton>
                  <ToggleButton value="serviceAccount">
                    Service Account
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* API Key */}
                {googleAuthMethod === "apiKey" && (
                  <Box sx={{ mt: "16px" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.primary,
                        mb: "8px",
                      }}
                    >
                      API Key
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: theme.palette.error.main,
                          ml: "2px",
                        }}
                      >
                        *
                      </Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="AIza••••••••••••••••"
                      type="password"
                      value={googleApiKey}
                      onChange={(e) => setGoogleApiKey(e.target.value)}
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
                )}

                {/* Service Account */}
                {googleAuthMethod === "serviceAccount" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      mt: "16px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Project ID
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="my-gcp-project"
                        value={googleProjectId}
                        onChange={(e) => setGoogleProjectId(e.target.value)}
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
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Location
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={googleLocation}
                          onChange={(e) =>
                            setGoogleLocation(e.target.value)
                          }
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                theme.palette.neutral[300],
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                theme.palette.neutral[400],
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                theme.palette.primary.main,
                            },
                          }}
                        >
                          <MenuItem value="us-central1">us-central1</MenuItem>
                          <MenuItem value="us-east1">us-east1</MenuItem>
                          <MenuItem value="us-west1">us-west1</MenuItem>
                          <MenuItem value="europe-west1">europe-west1</MenuItem>
                          <MenuItem value="europe-west4">europe-west4</MenuItem>
                          <MenuItem value="asia-northeast1">
                            asia-northeast1
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: theme.palette.text.primary,
                          mb: "8px",
                        }}
                      >
                        Service Account JSON
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.error.main,
                            ml: "2px",
                          }}
                        >
                          *
                        </Typography>
                      </Typography>
                      <Box sx={{ display: "flex", gap: "8px", mb: "8px" }}>
                        <input
                          ref={googleJsonInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleGoogleJsonFileChange}
                          style={{ display: "none" }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            googleJsonInputRef.current?.click()
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: "13px",
                          }}
                        >
                          Upload file
                        </Button>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            alignSelf: "center",
                          }}
                        >
                          or paste JSON below
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder='{"type": "service_account", ...}'
                        value={googleServiceAccountJson}
                        onChange={(e) =>
                          setGoogleServiceAccountJson(e.target.value)
                        }
                        multiline
                        rows={4}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                theme.palette.neutral[400],
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          )}

        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pb: "20px",
          pt: "12px",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
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
          Cancel
        </Button>
        <Button
          onClick={handleValidateAndContinue}
          variant="contained"
          disabled={!canSave || isValidating}
          startIcon={
            isValidating ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
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
          {isValidating ? "Validating..." : "Validate & continue"}
        </Button>
      </DialogActions>
      </>
      )}

      {/* Step 2: Select models (or search-only for custom-no-models) */}
      {showSecondModal && !showThirdModal && (
        <>
        <DialogContent
          sx={{
            px: 0,
            py: "12px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Search Input and Search and add button - same row for custom-no-models */}
          <Box
            sx={{
              px: "20px",
              py: "8px",
              ...(provider === "custom-no-models"
                ? {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }
                : {}),
            }}
          >
            <TextField
              size="small"
              placeholder="Search models..."
              value={modelSearchTerm}
              onChange={(e) => setModelSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search
                    size={16}
                    style={{
                      marginRight: "8px",
                      color: theme.palette.text.secondary,
                    }}
                  />
                ),
              }}
              sx={{
                width: provider === "custom-no-models" ? undefined : "100%",
                flex: provider === "custom-no-models" ? 1 : undefined,
                minWidth: 0,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  height: "32px",
                },
              }}
            />
            {provider === "custom-no-models" && (
              <Button
                onClick={handleSearchAndAddCustomModel}
                variant="outlined"
                color="inherit"
                disabled={!modelSearchTerm.trim()}
                sx={{
                  flexShrink: 0,
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
                Search and add
              </Button>
            )}
          </Box>
          {/* No model found message - when user typed something other than the example */}
          {provider === "custom-no-models" &&
            modelSearchTerm.trim() !== "" &&
            modelSearchTerm.trim() !== "ft:gpt-4o:my-org:custom:abc123" && (
              <Box sx={{ px: "20px", pb: "8px" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.error.main }}
                >
                  No model found, please try another name.
                </Typography>
              </Box>
            )}
          {/* Added models list or Empty View - only for custom-no-models (Search models flow) */}
          {provider === "custom-no-models" && (
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {addedCustomModelIds.length > 0 ? (
                <Box
                  sx={{
                    px: "20px",
                    py: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  {addedCustomModelIds.map((modelId) => (
                    <Box
                      key={modelId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <ProviderIcon provider={provider} size={24} />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {modelId}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCustomModel(modelId)}
                        aria-label={`Remove ${modelId}`}
                        sx={{
                          flexShrink: 0,
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            color: theme.palette.error.main,
                            backgroundColor: theme.palette.neutral[100],
                          },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <EmptyState
                  icon={NavModelsIcon}
                  title="No model listing"
                  description='Search to add a model (e.g. ft:gpt-4o:my-org:custom:abc123).'
                />
              )}
            </Box>
          )}
          {/* Model List - only for providers with models list */}
          {provider !== "custom-no-models" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                {(() => {
                  const filteredModels = mockOpenAIModels.filter((model) =>
                    modelSearchTerm.trim() === ""
                      ? true
                      : model.id.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
                        model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
                  );

                  if (filteredModels.length === 0) {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                          gap: "12px",
                          py: "40px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          No models found
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.text.disabled,
                          }}
                        >
                          No models matching &quot;{modelSearchTerm}&quot;
                        </Typography>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={() => setModelSearchTerm("")}
                          sx={{
                            textTransform: "none",
                            fontSize: "13px",
                            mt: "8px",
                          }}
                        >
                          Clear search
                        </Button>
                      </Box>
                    );
                  }

                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        px: "8px",
                        py: "8px",
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                      }}
                    >
                      {filteredModels.map((model) => (
                        <Box
                          key={model.id}
                          onClick={() => {
                            setSelectedModels((prev) =>
                              prev.includes(model.id)
                                ? prev.filter((id) => id !== model.id)
                                : [...prev, model.id]
                            );
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            p: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: theme.palette.neutral[100],
                            },
                            transition: `background-color ${"150ms"}`,
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked={selectedModels.includes(model.id)}
                            sx={{ p: 0 }}
                          />
                          <ProviderIcon provider={provider} size={24} />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              flex: 1,
                            }}
                          >
                            {model.id}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  );
                })()}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: "20px",
            pb: "20px",
            pt: "12px",
            justifyContent: provider === "custom-no-models" ? "flex-end" : "space-between",
          }}
        >
          {provider === "custom-no-models" ? (
            <Button
              onClick={() => setShowThirdModal(true)}
              variant="contained"
              disabled={addedCustomModelIds.length === 0}
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
              Continue
            </Button>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "12px",
                }}
              >
                {selectedModels.length} of {mockOpenAIModels.length} models selected
              </Typography>
              <Button
                onClick={() => setShowThirdModal(true)}
                variant="contained"
                disabled={selectedModels.length === 0}
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
                Continue
              </Button>
            </>
          )}
        </DialogActions>
        </>
      )}

      {/* Step 3: Display names for selected models */}
      {showThirdModal && (
        <>
        <DialogContent
          sx={{
            px: "20px",
            py: "12px",
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "13px",
              mb: "16px",
            }}
          >
            Give a display name for each selected model. Leave blank to use the model ID.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {provider === "custom-no-models"
              ? addedCustomModelIds.map((modelId) => (
                  <Box
                    key={modelId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <ProviderIcon provider={provider} size={24} />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                        minWidth: "180px",
                        flexShrink: 0,
                      }}
                    >
                      {modelId}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={modelId}
                      value={customModelDisplayNames[modelId] ?? ""}
                      onChange={(e) =>
                        setCustomModelDisplayNames((prev) => ({
                          ...prev,
                          [modelId]: e.target.value,
                        }))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
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
                ))
              : mockOpenAIModels
                  .filter((m) => selectedModels.includes(m.id))
                  .map((model) => (
                    <Box
                      key={model.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <ProviderIcon provider={provider} size={24} />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                          minWidth: "180px",
                          flexShrink: 0,
                        }}
                      >
                        {model.id}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={model.id}
                        value={modelDisplayNames[model.id] ?? ""}
                        onChange={(e) =>
                          setModelDisplayNames((prev) => ({
                            ...prev,
                            [model.id]: e.target.value,
                          }))
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "13px",
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
                  ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            flexShrink: 0,
            px: "20px",
            pb: "20px",
            pt: "12px",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button
            onClick={() => setShowThirdModal(false)}
            variant="outlined"
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
            Back
          </Button>
          <Button
            onClick={handleFinish}
            variant="contained"
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
            }}
          >
            Validate and add
          </Button>
        </DialogActions>
        </>
      )}
    </Dialog>
  );
}
