"use client";

import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AgentIconSvg from "../../../assets/type-agent.svg";
import ToolIconSvg from "../../../assets/type-tool.svg";
import { useState } from "react";

interface InputSectionProps {
  agentName: string;
}

/**
 * Static mockup of the Input section matching the Figma design.
 * Shows a nested structure with tool chips and parameter rows.
 * Hover on children highlights the left border of that section.
 */
export function InputSection({ agentName }: InputSectionProps) {
  const theme = useTheme();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Check if hovering on the main group (message belongs to the outermost group)
  const isMainGroupHovered = hoveredSection === "message";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Agent chip at top level */}
      <HoverableSection
        id="message"
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        <AgentChip name={agentName} isHovered={isMainGroupHovered} />
      </HoverableSection>

      {/* Main container with left border */}
      <Box sx={{ pl: "8px" }}>
        <Box
          sx={{
            borderLeft: `1.5px solid ${
              isMainGroupHovered
                ? theme.palette.neutral[400]
                : theme.palette.neutral[300]
            }`,
            pl: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            transition: `border-color ${"150ms"}`,
          }}
        >
          {/* message parameter - belongs to outermost group */}
          <HoverableSection
            id="message"
            hoveredSection={hoveredSection}
            setHoveredSection={setHoveredSection}
          >
            <ParameterRow name="message" type="string" />
          </HoverableSection>

        {/* Data Product Search tool group */}
        <HoverableSection
          id="data-product-search"
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        >
          <ToolGroup
            toolNames={["Data Product Search"]}
            isHovered={hoveredSection === "data-product-search"}
          >
            <ParameterRow name="marketplace_id" type="string" />
          </ToolGroup>
        </HoverableSection>

        {/* Chat Generation tool group with multiple parameters */}
        <HoverableSection
          id="chat-generation"
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        >
          <ToolGroup
            toolNames={["Chat Generation"]}
            isHovered={hoveredSection === "chat-generation"}
          >
            <ParameterCard>
              <ParameterRow name="sql" type="string" isGrouped />
              <ParameterRow
                name="data_product_id"
                type="string"
                isGrouped
              />
            </ParameterCard>
          </ToolGroup>
        </HoverableSection>

        {/* Multiple tools sharing a parameter */}
        <HoverableSection
          id="multi-tools"
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        >
          <ToolGroup
            toolNames={["Chat Generation", "Get Data Schema", "SQL Execution"]}
            isHovered={hoveredSection === "multi-tools"}
          >
            <ParameterRow name="sql" type="Custom" />
          </ToolGroup>
        </HoverableSection>

        {/* BI Report Search tool group with default value */}
        <HoverableSection
          id="bi-report-search"
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        >
          <ToolGroup
            toolNames={["BI Report Search"]}
            isHovered={hoveredSection === "bi-report-search"}
          >
            <ParameterRow name="limit" type="integer" defaultValue="20" />
          </ToolGroup>
        </HoverableSection>
        </Box>
      </Box>
    </Box>
  );
}

interface AgentChipProps {
  name: string;
  isHovered?: boolean;
}

function AgentChip({ name, isHovered = false }: AgentChipProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        height: "24px",
        px: "8px",
        backgroundColor: isHovered
          ? theme.palette.neutral[100]
          : theme.palette.neutral[100],
        borderRadius: "120px",
        transition: `background-color ${"150ms"}`,
        width: "fit-content",
      }}
    >
      <AgentIconSvg
        width={12}
        height={12}
        style={{
          fill: theme.palette.purple[600],
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: isHovered
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          transition: `color ${"150ms"}`,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}

interface ParameterRowProps {
  name: string;
  type: string;
  defaultValue?: string;
  isGrouped?: boolean;
}

function ParameterRow({
  name,
  type,
  defaultValue,
  isGrouped = false,
}: ParameterRowProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "40px",
        px: "12px",
        backgroundColor: "#fafafa",
        border: isGrouped
          ? "none"
          : `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: isGrouped ? 0 : "6px",
        borderTop: isGrouped
          ? `1px solid ${theme.palette.neutral[200]}`
          : undefined,
        "&:first-of-type": isGrouped
          ? {
              borderTop: "none",
            }
          : {},
      }}
    >
      {/* Left side: name and type */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.text.primary }}
        >
          {name}
        </Typography>
        <Chip
          label={type}
          size="small"
          sx={{
            height: "20px",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
            backgroundColor: "transparent",
            color: theme.palette.neutral[600],
            "& .MuiChip-label": {
              px: "8px",
            },
          }}
        />
      </Box>

      {/* Right side: default value */}
      {defaultValue && (
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {defaultValue}
        </Typography>
      )}
    </Box>
  );
}

interface ToolChipProps {
  name: string;
  isHovered?: boolean;
}

function ToolChip({ name, isHovered = false }: ToolChipProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        height: "24px",
        px: "8px",
        backgroundColor: isHovered
          ? theme.palette.neutral[100]
          : theme.palette.neutral[100],
        borderRadius: "120px",
        transition: `background-color ${"150ms"}`,
      }}
    >
      <ToolIconSvg
        width={12}
        height={12}
        style={{
          fill: theme.palette.blue[600],
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: isHovered
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          transition: `color ${"150ms"}`,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}


interface ToolGroupProps {
  toolNames: string[];
  children: React.ReactNode;
  isHovered?: boolean;
}

function ToolGroup({ toolNames, children, isHovered = false }: ToolGroupProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pl: "16px",
      }}
    >
      {/* Tool chips row */}
      <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {toolNames.map((name) => (
          <ToolChip key={name} name={name} isHovered={isHovered} />
        ))}
      </Box>

      {/* Nested parameters with left border */}
      <Box sx={{ pl: "8px" }}>
        <Box
          sx={{
            borderLeft: `1.5px solid ${
              isHovered
                ? theme.palette.neutral[400]
                : theme.palette.neutral[300]
            }`,
            pl: "24px",
            transition: `border-color ${"150ms"}`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

interface HoverableSectionProps {
  id: string;
  hoveredSection: string | null;
  setHoveredSection: (id: string | null) => void;
  children: React.ReactNode;
}

function HoverableSection({
  id,
  setHoveredSection,
  children,
}: HoverableSectionProps) {
  return (
    <Box
      onMouseEnter={() => setHoveredSection(id)}
      onMouseLeave={() => setHoveredSection(null)}
    >
      {children}
    </Box>
  );
}

interface ParameterCardProps {
  children: React.ReactNode;
}

function ParameterCard({ children }: ParameterCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.neutral[50],
        border: `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}
