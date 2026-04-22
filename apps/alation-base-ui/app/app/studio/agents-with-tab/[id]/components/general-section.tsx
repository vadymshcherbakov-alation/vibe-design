"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Agent } from "../../agent-data";
import OpenAILogo from "../../../assets/openai-logo.svg";
import AnthropicLogo from "../../../assets/anthropic-logo.svg";
import GoogleLogo from "../../../assets/google-logo.svg";
import AzureLogo from "../../../assets/azure.svg";
import AWSBedrockLogo from "../../../assets/aws-bedrock.svg";

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

export function GeneralSection({ agent }: GeneralSectionProps) {
  const theme = useTheme();
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
        maxWidth: "768px",
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
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {agent.description || "No description provided."}
        </Typography>
      </Box>

      {/* Model Field */}
      {agent.model && (
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
        </Box>
      )}
    </Box>
  );
}
