"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OpenAILogo from "../../assets/openai-logo.svg";
import AnthropicLogo from "../../assets/anthropic-logo.svg";
import GoogleLogo from "../../assets/google-logo.svg";
import AWSBedrockLogo from "../../assets/aws-bedrock.svg";
import AzureLogo from "../../assets/azure.svg";
import NavModelsIcon from "../../assets/nav-models.svg";
import type { ModelProvider } from "./add-model-provider-modal";

interface ProviderIconProps {
  provider: ModelProvider;
  size?: number;
}

export function ProviderIcon({ provider, size = 28 }: ProviderIconProps) {
  const theme = useTheme();
  const iconSize = size === 28 ? 20 : size === 24 ? 16 : 20;

  const getIcon = () => {
    switch (provider) {
      case "openai":
        return <OpenAILogo width={iconSize} height={iconSize} />;
      case "anthropic":
        return <AnthropicLogo width={iconSize} height={iconSize} />;
      case "google":
        return <GoogleLogo width={iconSize} height={iconSize} />;
      case "aws-bedrock":
        return <AWSBedrockLogo width={iconSize} height={iconSize} />;
      case "azure-openai":
        return <AzureLogo width={iconSize} height={iconSize} />;
      case "custom":
      case "custom-no-models":
        return <NavModelsIcon width={iconSize} height={iconSize} />;
    }
  };

  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "4px",
        backgroundColor: theme.palette.neutral[50],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {getIcon()}
    </Box>
  );
}
