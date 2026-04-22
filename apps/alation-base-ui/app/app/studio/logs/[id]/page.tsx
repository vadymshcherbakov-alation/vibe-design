"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";
import { getLogById } from "../mock-logs";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";
import { SimpleResponseChat } from "./components/simple-response-chat";
import { FullConversationChat } from "./components/full-conversation-chat";

function isJsonObjectInput(input: string): boolean {
  try {
    const parsed = JSON.parse(input);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function getSourceLabel(source: string): string {
  if (source === "FLOW") {
    return "Flow (manual)";
  }
  if (source === "FLOW_SCHEDULED") {
    return "Flow (Scheduled)";
  }
  if (source === "AGENT_STUDIO") {
    return "Agent Studio";
  }
  if (source === "CHAT_WITH_DATA") {
    return "Chat with Data";
  }
  if (source === "REST_API" || source === "REST") {
    return "REST";
  }
  if (source === "MCP") {
    return "MCP";
  }
  if (source === "EVALUATION" || source === "EVAL") {
    return "Eval";
  }
  return source;
}

function getSourceRoute(source: string): string | null {
  if (source === "AGENT_STUDIO") {
    return "/app/studio/agents";
  }
  return null;
}

function getFlowSourceInfo(
  source: string,
): { name: string; href: string } | null {
  if (source === "FLOW" || source === "FLOW_SCHEDULED") {
    return {
      name: "Data Quality Validation Flow",
      href: "/app/studio/flows/1",
    };
  }
  return null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];

  if (!first) {
    return "U";
  }
  if (!second) {
    return first.slice(0, 1).toUpperCase();
  }
  return `${first.slice(0, 1)}${second.slice(0, 1)}`.toUpperCase();
}

export default function LogDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"response" | "full-conversation">(
    "response",
  );
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
  const inputType = isJsonObjectInput(log.input) ? "JSON" : "Message";
  const isSqlEnabled = log.functions.includes("sql_execution_tool");
  const sourceRoute = getSourceRoute(log.metadata);
  const flowSourceInfo = getFlowSourceInfo(log.metadata);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* New clean header for v2 rebuild */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          pt: "16px",
          pb: "8px",
          pl: "12px",
          pr: "24px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconButton
            size="small"
            onClick={() => router.push("/app/studio/logs")}
            sx={{ width: "28px", height: "28px" }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <ItemTypeIcon type={inputType} size={24} />
          <Typography variant="subtitle1">
            Log detail {log.responseId}
          </Typography>
        </Box>
        {isSqlEnabled && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Chip
              size="small"
              label="SQL-Enabled"
              sx={{
                height: "22px",
                "& .MuiChip-label": {
                  fontSize: "11px",
                },
                color: theme.palette.text.primary,
                backgroundColor:
                  theme.palette.neutral[100],
              }}
            />
            <Button size="small" variant="contained">
              Create eval
            </Button>
          </Box>
        )}
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
        {/* Main rebuild canvas */}
        <Allotment.Pane minSize={420} priority={LayoutPriority.High}>
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
              //backgroundColor: theme.palette.neutral[50],
              p: "24px",
            }}
          >
            {activeTab === "response" ? (
              <SimpleResponseChat />
            ) : (
              <FullConversationChat />
            )}
          </Box>
        </Allotment.Pane>

        {/* Restored metadata side panel */}
        <Allotment.Pane
          preferredSize={rightPanelSize}
          minSize={320}
          priority={LayoutPriority.Low}
          snap
        >
          <Box
            sx={{
              height: "100%",
              borderLeft: `1px solid ${"rgb(240, 240, 240)"}`,
              backgroundColor: theme.palette.neutral[50],
              overflowY: "auto",
            }}
          >
            {/* Properties section */}
            <Box sx={{ p: "20px", pb: "12px" }}>
              <Box
                sx={{
                  p: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.primary, mb: "12px" }}
                >
                  Properties
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Source
                  </Typography>
                  {flowSourceInfo ? (
                    <Box
                      onClick={() => router.push(flowSourceInfo.href)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        px: "6px",
                        py: "2px",
                        transition: `background-color ${"150ms"}`,
                        "&:hover": {
                          backgroundColor: theme.palette.neutral[100],
                        },
                      }}
                    >
                      <ItemTypeIcon type="Flow" size="small" />
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {flowSourceInfo.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip
                      size="small"
                      label={getSourceLabel(log.metadata)}
                      onClick={
                        sourceRoute ? () => router.push(sourceRoute) : undefined
                      }
                      sx={{
                        height: "22px",
                        "& .MuiChip-label": {
                          fontSize: "11px",
                        },
                        color: theme.palette.text.primary,
                        backgroundColor:
                          theme.palette.neutral[100],
                        cursor: sourceRoute ? "pointer" : "default",
                        transition: `background-color ${"150ms"}`,
                        ...(sourceRoute
                          ? {
                              "&:hover": {
                                backgroundColor: theme.palette.neutral[100],
                              },
                            }
                          : {}),
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Agent
                  </Typography>
                  <Box
                    onClick={() => router.push("/app/studio/agents")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      px: "6px",
                      py: "2px",
                      transition: `background-color ${"150ms"}`,
                      "&:hover": {
                        backgroundColor: theme.palette.neutral[100],
                      },
                    }}
                  >
                    <ItemTypeIcon type="Agent" size="small" />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {log.agent}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    User
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Avatar
                      sx={{
                        width: "22px",
                        height: "22px",
                        fontSize: "10px",
                        backgroundColor:
                          theme.palette.neutral[100],
                        color: theme.palette.text.primary,
                      }}
                    >
                      {getInitials(log.userName)}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {log.userName}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    LLM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {log.llm}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Timestamp
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
