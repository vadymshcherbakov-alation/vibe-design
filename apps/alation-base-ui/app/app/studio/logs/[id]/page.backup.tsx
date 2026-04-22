"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Check, ChevronLeft, Copy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";
import { getLogById, type LogEffortStep } from "../mock-logs";
import { CollapsibleSection } from "../../agents/[id]/components/collapsible-section";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";

function getEffortTypeLabel(type: LogEffortStep["type"]): string {
  if (type === "reasoning") {
    return "Reasoning";
  }
  if (type === "tool_call") {
    return "Tool call";
  }
  if (type === "tool_result") {
    return "Tool result";
  }
  return "Assistant result";
}

function isJsonObjectInput(input: string): boolean {
  try {
    const parsed = JSON.parse(input);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function formatJsonLikeContent(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function LogDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"response" | "full-conversation">(
    "response",
  );
  const [inputViewMode, setInputViewMode] = useState<"text" | "json">("text");
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputCopied, setIsInputCopied] = useState(false);
  const logId = params.id as string;
  const log = getLogById(logId);
  const rightPanelSize = 360;

  if (!log) {
    return (
      <Box sx={{ p: "24px" }}>
        <Typography variant="h6">Log not found</Typography>
      </Box>
    );
  }

  const parsedInputContent = (() => {
    if (inputViewMode === "text") {
      return log.input;
    }
    try {
      return JSON.stringify(JSON.parse(log.input), null, 2);
    } catch {
      return log.input;
    }
  })();
  const inputType = isJsonObjectInput(log.input) ? "JSON" : "Message";

  const handleCopyInput = () => {
    navigator.clipboard.writeText(parsedInputContent);
    setIsInputCopied(true);
    setTimeout(() => setIsInputCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Main canvas with split panes */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header section - unified detail header design */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: "16px",
            pb: "8px",
            pl: "12px",
            pr: "24px",
            backgroundColor: "white",
            gap: "8px",
          }}
        >
          {/* Left side - Back button and title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: 0,
              flex: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => router.push("/app/studio/logs")}
              sx={{
                width: "28px",
                height: "28px",
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <ItemTypeIcon type={inputType} size={24} />
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Log detail {log.responseId}
            </Typography>
          </Box>

          {/* Right side - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Chip
              size="small"
              label="SQL"
              sx={{
                height: "20px",
                fontSize: "11px",
                fontWeight: "500",
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.neutral[100],
              }}
            />
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => {
                // Placeholder action for upcoming eval flow.
              }}
              sx={{
                height: "36px",
                minWidth: "auto",
              }}
            >
              Add to Eval Case
            </Button>
          </Box>
        </Box>

        {/* Detail tabs */}
        <Box
          sx={{
            backgroundColor: "white",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: theme.palette.neutral[300],
              zIndex: 1,
            },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value: "response" | "full-conversation") =>
              setActiveTab(value)
            }
            sx={{
              position: "relative",
              "& .MuiTabs-indicator": {
                zIndex: 2,
              },
            }}
          >
            <Tab value="response" label="Response" />
            <Tab value="full-conversation" label="Full conversation" />
          </Tabs>
        </Box>

        <Allotment proportionalLayout={false}>
          {/* Timeline content pane */}
          <Allotment.Pane minSize={420} priority={LayoutPriority.High}>
            <Box
              sx={{
                height: "100%",
                overflowY: "auto",
                backgroundColor: theme.palette.neutral[50],
              }}
            >
              {activeTab === "response" ? (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "1280px",
                    margin: "0 auto",
                    px: "24px",
                    py: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <CollapsibleSection
                    title="Input"
                    defaultExpanded
                    hideHeaderRightWhenCollapsed
                    headerRightContent={
                      <ToggleButtonGroup
                        value={inputViewMode}
                        exclusive
                        size="small"
                        onChange={(event, newValue: "text" | "json" | null) => {
                          event.stopPropagation();
                          if (newValue !== null) {
                            setInputViewMode(newValue);
                          }
                        }}
                        sx={{
                          backgroundColor: theme.palette.neutral[100],
                          borderRadius: "6px",
                          p: "2px",
                          "& .MuiToggleButtonGroup-grouped": {
                            border: "none",
                            borderRadius: "4px",
                            px: "12px",
                            py: 0,
                            height: "24px",
                            textTransform: "none",
                            "&.Mui-selected": {
                              backgroundColor: "#ffffff",
                              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                              "&:hover": {
                                backgroundColor: "#ffffff",
                              },
                            },
                            "&:not(.Mui-selected)": {
                              backgroundColor: "transparent",
                              "&:hover": {
                                backgroundColor: theme.palette.neutral[100],
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton value="text" onClick={(event) => event.stopPropagation()}>
                          Text
                        </ToggleButton>
                        <ToggleButton value="json" onClick={(event) => event.stopPropagation()}>
                          JSON
                        </ToggleButton>
                      </ToggleButtonGroup>
                    }
                  >
                    <Box
                      onMouseEnter={() => setIsInputHovered(true)}
                      onMouseLeave={() => setIsInputHovered(false)}
                      sx={{
                        position: "relative",
                        p: "16px",
                        backgroundColor: theme.palette.neutral[50],
                        borderRadius: "6px",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={handleCopyInput}
                        sx={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "28px",
                          height: "28px",
                          opacity: isInputHovered || isInputCopied ? 1 : 0,
                          transition: `opacity ${"150ms"}`,
                          color: isInputCopied
                            ? theme.palette.success.main
                            : theme.palette.text.secondary,
                        }}
                      >
                        {isInputCopied ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.primary, whiteSpace: "pre-wrap" }}
                      >
                        {parsedInputContent}
                      </Typography>
                    </Box>
                  </CollapsibleSection>

                  <CollapsibleSection title="Output" defaultExpanded badgeCount={log.efforts.length}>
                    <Box sx={{ mx: "-16px", display: "flex", flexDirection: "column" }}>
                      {log.efforts.map((effort, index) => (
                        <Box key={effort.id} sx={{ px: "16px", py: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {effort.type === "assistant_result"
                              ? "Assistant"
                              : effort.type === "reasoning"
                                ? "Reasoning"
                                : `${getEffortTypeLabel(effort.type)}${"toolName" in effort ? `: ${effort.toolName}` : ""}`}
                          </Typography>

                          {effort.type === "reasoning" && (
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary, whiteSpace: "pre-wrap" }}
                            >
                              {effort.content}
                            </Typography>
                          )}

                          {effort.type === "tool_call" && (
                            <Box
                              sx={{
                                p: "16px",
                                borderRadius: "6px",
                                backgroundColor: theme.palette.neutral[50],
                              }}
                            >
                              <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                  m: 0,
                                  color: theme.palette.text.primary,
                                  whiteSpace: "pre-wrap",
                                  fontFamily: "inherit",
                                }}
                              >
                                {formatJsonLikeContent(effort.input)}
                              </Typography>
                            </Box>
                          )}

                          {effort.type === "tool_result" && (
                            <Box
                              sx={{
                                p: "16px",
                                borderRadius: "6px",
                                backgroundColor: theme.palette.neutral[50],
                              }}
                            >
                              <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                  m: 0,
                                  color: theme.palette.text.primary,
                                  whiteSpace: "pre-wrap",
                                  fontFamily: "inherit",
                                }}
                              >
                                {formatJsonLikeContent(effort.output)}
                              </Typography>
                            </Box>
                          )}

                          {effort.type === "assistant_result" && (
                            <Box
                              sx={{
                                p: "16px",
                                borderRadius: "6px",
                                backgroundColor: theme.palette.neutral[50],
                              }}
                            >
                              <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                  m: 0,
                                  color: theme.palette.text.primary,
                                  whiteSpace: "pre-wrap",
                                  fontFamily: "inherit",
                                }}
                              >
                                {formatJsonLikeContent(effort.content)}
                              </Typography>
                            </Box>
                          )}

                          {index < log.efforts.length - 1 && (
                            <Divider
                              sx={{
                                borderColor: "rgb(240, 240, 240)",
                                mt: "4px",
                                mx: "-16px",
                              }}
                            />
                          )}
                        </Box>
                      ))}
                    </Box>
                  </CollapsibleSection>
                </Box>
              ) : (
                <Box sx={{ p: "16px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        alignSelf: "flex-start",
                        maxWidth: "85%",
                        border: `1px solid ${theme.palette.neutral[300]}`,
                        borderRadius: "8px",
                        px: "10px",
                        py: "8px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        Request
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.primary,
                          mt: "4px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {formatJsonLikeContent(log.input)}
                      </Typography>
                    </Box>

                    {log.efforts.map((effort) => {
                      const role =
                        effort.type === "tool_call" || effort.type === "tool_result"
                          ? "tool"
                          : "assistant";
                      const label =
                        role === "tool"
                          ? "Tool"
                          : effort.type === "reasoning"
                            ? "Reasoning"
                            : "Response";
                      const content =
                        effort.type === "reasoning"
                          ? effort.content
                          : effort.type === "tool_call"
                            ? formatJsonLikeContent(effort.input)
                            : effort.type === "tool_result"
                              ? formatJsonLikeContent(effort.output)
                              : formatJsonLikeContent(effort.content);

                      return (
                        <Box
                          key={`conversation-${effort.id}`}
                          sx={{
                            alignSelf: role === "assistant" ? "flex-end" : "stretch",
                            maxWidth: role === "tool" ? "100%" : "85%",
                            border: `1px solid ${theme.palette.neutral[300]}`,
                            borderRadius: "8px",
                            px: "10px",
                            py: "8px",
                            backgroundColor:
                              role === "assistant"
                                ? theme.palette.neutral[100]
                                : "#ffffff",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {label}
                            {role === "tool" &&
                            (effort.type === "tool_call" || effort.type === "tool_result")
                              ? ` (${effort.toolName})`
                              : ""}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.primary,
                              mt: "4px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {content}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Allotment.Pane>

          {/* Metadata side panel pane */}
          <Allotment.Pane preferredSize={rightPanelSize} minSize={320} priority={LayoutPriority.Low} snap>
            <Box
              sx={{
                height: "100%",
                borderLeft: `1px solid ${"rgb(240, 240, 240)"}`,
                backgroundColor: "white",
                overflowY: "auto",
              }}
            >
              {/* Properties section */}
              <Box sx={{ p: "12px 14px" }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: "10px" }}>
                  Properties
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.responseId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Model
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.llm}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Tokens
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.tokens} total
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Efforts
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.efforts.length} steps
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Functions
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        textAlign: "right",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {log.functions}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Configuration
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.configuration}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Response
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.responseType}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Reasoning effort
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.reasoningEffort}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Reasoning summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.reasoningSummary}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Verbosity
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.verbosity}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Metadata section */}
              <Box sx={{ p: "12px 14px" }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, mb: "8px" }}>
                  Metadata
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  No metadata entries
                </Typography>
              </Box>
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </Box>
  );
}
