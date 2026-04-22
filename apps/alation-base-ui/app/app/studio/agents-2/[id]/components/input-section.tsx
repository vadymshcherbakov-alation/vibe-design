"use client";

import {
  Box,
  Typography,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Copy, Trash2, RotateCcw, Plus } from "lucide-react";
import AgentIconSvg from "../../../assets/type-agent.svg";
import ToolIconSvg from "../../../assets/type-tool.svg";
import { useState } from "react";
import { useEditMode } from "../edit-mode-context";

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
  const { isEditMode } = useEditMode();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [messageInputRemoved, setMessageInputRemoved] = useState(false);
  const [extraParams, setExtraParams] = useState<
    Array<{
      id: string;
      name: string;
      type: string;
      defaultValue: string;
      removed?: boolean;
    }>
  >([]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <AgentChip name={agentName} isHovered={isMainGroupHovered} />
          {isEditMode && agentName === "Compliance Checker" && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Plus size={14} />}
              onClick={() =>
                setExtraParams((prev) => [
                  ...prev,
                  {
                    id: `param-${Date.now()}`,
                    name: "",
                    type: "string",
                    defaultValue: "",
                  },
                ])
              }
              color="inherit"
            >
              Add parameter
            </Button>
          )}
        </Box>
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
          {isEditMode ? (
            <>
              {/* message parameter - belongs to outermost group */}
              <HoverableSection
                id="message"
                hoveredSection={hoveredSection}
                setHoveredSection={setHoveredSection}
              >
                <ParameterRow
                  name="message"
                  type="string"
                  removed={messageInputRemoved}
                  onRemove={() => setMessageInputRemoved(true)}
                  onRestore={() => setMessageInputRemoved(false)}
                />
                {extraParams.map((param) => (
                  <ParameterRow
                    key={param.id}
                    name={param.name}
                    type={param.type}
                    defaultValue={param.defaultValue}
                    removed={param.removed}
                    onChange={(next) => {
                      setExtraParams((prev) =>
                        prev.map((item) =>
                          item.id === param.id ? { ...item, ...next } : item,
                        ),
                      );
                    }}
                    onRemove={() =>
                      setExtraParams((prev) =>
                        prev.map((item) =>
                          item.id === param.id
                            ? { ...item, removed: true }
                            : item,
                        ),
                      )
                    }
                    onRestore={() =>
                      setExtraParams((prev) =>
                        prev.map((item) =>
                          item.id === param.id
                            ? { ...item, removed: false }
                            : item,
                        ),
                      )
                    }
                  />
                ))}
              </HoverableSection>
            </>
          ) : extraParams.length > 0 ? (
            <ParameterCard>
              {!messageInputRemoved && (
                <HoverableSection
                  id="message"
                  hoveredSection={hoveredSection}
                  setHoveredSection={setHoveredSection}
                >
                  <ParameterRow
                    name="message"
                    type="string"
                    isGrouped
                    removed={messageInputRemoved}
                  />
                </HoverableSection>
              )}
              {extraParams.map((param) => (
                <HoverableSection
                  key={param.id}
                  id={param.id}
                  hoveredSection={hoveredSection}
                  setHoveredSection={setHoveredSection}
                >
                  <ParameterRow
                    name={param.name || "parameter"}
                    type={param.type || "string"}
                    defaultValue={param.defaultValue}
                    isGrouped
                    removed={param.removed}
                  />
                </HoverableSection>
              ))}
            </ParameterCard>
          ) : (
            <HoverableSection
              id="message"
              hoveredSection={hoveredSection}
              setHoveredSection={setHoveredSection}
            >
              <ParameterRow
                name="message"
                type="string"
                removed={messageInputRemoved}
              />
            </HoverableSection>
          )}

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
                <ParameterRow name="data_product_id" type="string" isGrouped />
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
              toolNames={[
                "Chat Generation",
                "Get Data Schema",
                "SQL Execution",
              ]}
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
  removed?: boolean;
  onChange?: (next: {
    name: string;
    type: string;
    defaultValue: string;
  }) => void;
  onRemove?: () => void;
  onRestore?: () => void;
}

function ParameterRow({
  name,
  type,
  defaultValue,
  isGrouped = false,
  removed = false,
  onChange,
  onRemove,
  onRestore,
}: ParameterRowProps) {
  const theme = useTheme();
  const { isEditMode } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);

  if (isEditMode) {
    if (removed) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            minHeight: "40px",
            py: "8px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {name === "message"
              ? "Message input is removed from this agent"
              : "This input is removed from this agent"}
          </Typography>
          <Button
            size="small"
            startIcon={<RotateCcw size={14} />}
            onClick={onRestore}
            color="inherit"
            sx={{ flexShrink: 0 }}
          >
            Restore
          </Button>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          height: "40px",
        }}
      >
        {/* Type Select */}
        <Select
          size="small"
          value={type || "string"}
          disabled={name === "message"}
          onChange={(event) =>
            onChange?.({
              name,
              type: event.target.value,
              defaultValue: defaultValue ?? "",
            })
          }
          sx={{ minWidth: "120px" }}
          startAdornment={
            <InputAdornment position="start">
              <Typography variant="body2">T</Typography>
            </InputAdornment>
          }
        >
          <MenuItem value="string">String</MenuItem>
          <MenuItem value="integer">Integer</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>
        </Select>

        {/* Parameter Name */}
        <TextField
          size="small"
          value={name}
          disabled={name === "message"}
          onChange={(event) =>
            onChange?.({
              name: event.target.value,
              type: type || "string",
              defaultValue: defaultValue ?? "",
            })
          }
          placeholder="parameter_name"
          sx={{ flex: 1 }}
        />

        {/* Default Value */}
        <TextField
          size="small"
          value={defaultValue ?? ""}
          onChange={(event) =>
            onChange?.({
              name,
              type: type || "string",
              defaultValue: event.target.value,
            })
          }
          placeholder="default value"
          sx={{ flex: 1 }}
        />

        {/* Trash */}
        <IconButton
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={onRemove}
          aria-label="Remove input"
        >
          <Trash2 size={16} />
        </IconButton>
      </Box>
    );
  }

  if (removed) {
    return null;
  }

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        borderTop: isGrouped ? "none" : undefined,
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

      {/* Right side: default value, hover text, and copy button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {(defaultValue || isHovered) && (
          <Typography
            variant="body1"
            sx={{
              color: defaultValue
                ? theme.palette.text.secondary
                : theme.palette.text.disabled,
            }}
          >
            {defaultValue || "no default value"}
          </Typography>
        )}
        {isHovered && defaultValue && (
          <IconButton
            size="small"
            onClick={() => navigator.clipboard.writeText(defaultValue)}
            sx={{
              width: "24px",
              height: "24px",
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.neutral[100],
              },
            }}
          >
            <Copy size={14} />
          </IconButton>
        )}
      </Box>
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
  const { isEditMode } = useEditMode();

  return (
    <Box
      sx={{
        backgroundColor: isEditMode
          ? "transparent"
          : theme.palette.neutral[50],
        border: isEditMode
          ? "none"
          : `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: isEditMode ? 0 : "6px",
        overflow: isEditMode ? "visible" : "hidden",
        ...(isEditMode
          ? {}
          : {
              "& > *:not(:last-child)": {
                borderBottom: `1px solid ${theme.palette.neutral[200]}`,
              },
            }),
      }}
    >
      {children}
    </Box>
  );
}
