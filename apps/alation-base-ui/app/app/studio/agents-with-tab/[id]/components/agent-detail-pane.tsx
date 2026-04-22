"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import { getAgentById } from "../../agent-data";
import { CollapsibleSection } from "./collapsible-section";
import { GeneralSection } from "./general-section";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
import { SystemPromptSection } from "./system-prompt-section";
import { ToolsSection } from "./tools-section";

export function AgentDetailPane() {
  const theme = useTheme();
  const params = useParams();
  const agentId = params.id as string;
  const agent = getAgentById(agentId);

  if (!agent) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#FAFAFA",
      }}
    >
      {/* Content Container */}
      <Box
        sx={{
          maxWidth: "1280px",
          margin: "0 auto",
          px: "24px",
          py: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* General Section */}
        <CollapsibleSection title="General" defaultExpanded={true}>
          <GeneralSection agent={agent} />
        </CollapsibleSection>

        {/* Input Section */}
        <CollapsibleSection title="Input" defaultExpanded={true}>
          <InputSection agentName={agent.name} />
        </CollapsibleSection>

        {/* Output Section */}
        <CollapsibleSection title="Output" defaultExpanded={true}>
          <OutputSection />
        </CollapsibleSection>

        {/* System Prompt Section */}
        <CollapsibleSection title="System prompt" defaultExpanded={true}>
          <SystemPromptSection />
        </CollapsibleSection>

        {/* Tools Section */}
        <CollapsibleSection title="Tools" defaultExpanded={true}>
          <ToolsSection agent={agent} />
        </CollapsibleSection>
      </Box>
    </Box>
  );
}
