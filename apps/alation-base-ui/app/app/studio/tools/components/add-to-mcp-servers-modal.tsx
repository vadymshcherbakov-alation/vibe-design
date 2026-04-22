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
  Checkbox,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import { X, Bolt, ChevronRight } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import NavMcpIcon from "../../assets/nav-mcp.svg";
import { McpServerPublishedModal } from "../../mcp-servers/components/mcp-server-published-modal";
import { getScrollbarStyles } from "../../utils/scrollbar-styles";

interface McpServer {
  id: string;
  name: string;
  url: string;
  description?: string;
  createdAt: string;
  toolsCount: number;
  capacity?: number; // Percentage for published servers
}

interface AddToMcpServersModalProps {
  open: boolean;
  onClose: () => void;
  toolId?: string | null;
  onApply?: (selectedServerIds: string[]) => void;
  onNewServer?: () => void;
  onServerClick?: (server: McpServer) => void;
}

// Mock data for MCP servers - in production, this would come from props or API
const generateMockServers = (): McpServer[] => {
  const baseDate = new Date();
  return [
    {
      id: "1",
      name: "Alation Default",
      url: "https://master-uat-use1.mtqa.alationcloud.com/ai/mcp",
      description: "Data catalog and governance platform MCP server",
      createdAt: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 5,
    },
    {
      id: "2",
      name: "Business Unit A MCP Server",
      url: "https://mcp.businessunit-a.example.com/v1",
      description: "Business unit specific tools and integrations",
      createdAt: new Date(
        baseDate.getTime() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 50,
    },
    {
      id: "3",
      name: "Production Data Catalog",
      url: "https://prod.alationcloud.com/ai/mcp",
      description: "Production environment MCP server",
      createdAt: new Date(
        baseDate.getTime() - 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 25,
    },
    {
      id: "4",
      name: "Analytics Platform Server",
      url: "https://analytics.company.com/mcp",
      description: "Analytics and reporting tools",
      createdAt: new Date(
        baseDate.getTime() - 35 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 18,
    },
    {
      id: "5",
      name: "Customer Data Hub",
      url: "https://customer-data.example.com/mcp",
      createdAt: new Date(
        baseDate.getTime() - 28 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 32,
    },
    {
      id: "6",
      name: "Internal Tools Server",
      url: "https://internal.tools.com/mcp",
      description: "Internal development and operations tools",
      createdAt: new Date(
        baseDate.getTime() - 22 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 14,
    },
    {
      id: "7",
      name: "PostgreSQL Connector",
      url: "https://mcp.postgres.example.com/v1",
      description: "Connect to PostgreSQL databases and execute queries",
      createdAt: new Date(
        baseDate.getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 8,
    },
    {
      id: "8",
      name: "Slack Integration",
      url: "https://mcp.slack.com/api",
      description: "Send messages and manage Slack workspaces",
      createdAt: new Date(
        baseDate.getTime() - 18 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 12,
    },
    {
      id: "9",
      name: "GitHub Actions MCP",
      url: "https://api.github.com/mcp",
      createdAt: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 6,
    },
    {
      id: "10",
      name: "AWS S3 Server",
      url: "https://s3-mcp.us-east-1.amazonaws.com",
      description: "Access and manage S3 buckets and objects",
      createdAt: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 10,
    },
    {
      id: "11",
      name: "Jira MCP Server",
      url: "https://company.atlassian.net/mcp",
      description: "Manage Jira issues and projects",
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 9,
    },
    {
      id: "12",
      name: "MongoDB Connector",
      url: "https://mcp.mongodb.com/v1",
      description: "Query and manage MongoDB databases",
      createdAt: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 7,
    },
    {
      id: "13",
      name: "Salesforce Integration",
      url: "https://api.salesforce.com/mcp",
      description: "Access Salesforce data and operations",
      createdAt: new Date(
        baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 14,
    },
    {
      id: "14",
      name: "Stripe Payment MCP",
      url: "https://api.stripe.com/v1/mcp",
      description: "Process payments and manage Stripe accounts",
      createdAt: new Date(
        baseDate.getTime() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 11,
    },
    {
      id: "15",
      name: "OpenAI API Server",
      url: "https://api.openai.com/v1/mcp",
      description: "Access OpenAI models and services",
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 5,
    },
    {
      id: "16",
      name: "Redis Cache Server",
      url: "https://redis-mcp.example.com/v1",
      description: "Manage Redis cache operations",
      createdAt: new Date(
        baseDate.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 8,
    },
    {
      id: "17",
      name: "Kubernetes Cluster MCP",
      url: "https://k8s-mcp.example.com/api",
      description: "Manage Kubernetes clusters and deployments",
      createdAt: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 15,
    },
    {
      id: "18",
      name: "Docker Registry Server",
      url: "https://docker-registry.example.com/mcp",
      description: "Manage Docker images and containers",
      createdAt: new Date(
        baseDate.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 9,
    },
    {
      id: "19",
      name: "Elasticsearch Connector",
      url: "https://elastic-mcp.example.com/v1",
      description: "Search and index data with Elasticsearch",
      createdAt: new Date(
        baseDate.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 12,
    },
    {
      id: "20",
      name: "Datadog Monitoring MCP",
      url: "https://api.datadoghq.com/mcp",
      description: "Monitor applications and infrastructure",
      createdAt: new Date(
        baseDate.getTime() - 0.5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 16,
    },
  ];
};

export function AddToMcpServersModal({
  open,
  onClose,
  toolId,
  onApply,
  onNewServer,
  onServerClick,
}: AddToMcpServersModalProps) {
  const theme = useTheme();
  const [servers] = useState<McpServer[]>(generateMockServers());
  const [selectedServerIds, setSelectedServerIds] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedServerForDetail, setSelectedServerForDetail] = useState<McpServer | null>(null);

  useEffect(() => {
    if (open) {
      // Reset selections when modal opens
      setSelectedServerIds(new Set());
      setHasChanges(false);
      setIsDetailModalOpen(false);
      setSelectedServerForDetail(null);
    }
  }, [open]);

  const handleToggleServer = (serverId: string) => {
    setSelectedServerIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      setHasChanges(newSet.size > 0);
      return newSet;
    });
  };

  const handleApply = () => {
    if (onApply && selectedServerIds.size > 0) {
      onApply(Array.from(selectedServerIds));
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedServerIds(new Set());
    setHasChanges(false);
    onClose();
  };

  const handleNewServer = () => {
    if (onNewServer) {
      onNewServer();
    }
  };

  const handleServerClick = (server: McpServer) => {
    setSelectedServerForDetail(server);
    setIsDetailModalOpen(true);
    // Also call the optional onServerClick prop if provided
    if (onServerClick) {
      onServerClick(server);
    }
  };

  const handleBackFromDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedServerForDetail(null);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedServerForDetail(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "768px",
          maxWidth: "768px",
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
        },
      }}
    >
      {/* Dialog Header */}
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
        <Typography
          variant="h2"
          component="span"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "100%",
            color: theme.palette.text.primary,
          }}
        >
          MCP server assignment
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            marginRight: "-8px",
            padding: "4px",
            width: "28px",
            height: "28px",
            "&:hover": {
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          px: "8px",
          py: "8px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "8px",
            marginRight: "-8px",
            ...getScrollbarStyles(theme),
          }}
        >
          {servers.map((server) => {
            const isSelected = selectedServerIds.has(server.id);
            return (
              <Box
                key={server.id}
                onClick={() => handleToggleServer(server.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  p: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.neutral[50],
                  },
                }}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleToggleServer(server.id)}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  sx={{
                    padding: "1px",
                    "& .MuiSvgIcon-root": {
                      fontSize: "18px",
                    },
                    "&.Mui-checked": {
                      color: theme.palette.blue[600],
                    },
                  }}
                />

                {/* Server Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {/* Server Icon */}
                    <Box
                      sx={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "4px",
                        backgroundColor: theme.palette.neutral[100],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <NavMcpIcon
                        width={20}
                        height={20}
                        style={{ color: theme.palette.neutral[600] }}
                      />
                    </Box>

                    {/* Server Name */}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        lineHeight: "normal",
                        color: theme.palette.text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {server.name}
                    </Typography>
                  </Box>

                  {/* Tools Count and Chevron */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {/* Tools Count */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: "40px",
                      }}
                    >
                      <Bolt
                        size={16}
                        style={{ color: theme.palette.text.secondary }}
                      />
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 400,
                          lineHeight: "100%",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {server.toolsCount}
                      </Typography>
                    </Box>

                    {/* Chevron */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServerClick(server);
                      }}
                      sx={{
                        padding: "4px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.palette.neutral[100],
                        },
                      }}
                    >
                      <ChevronRight
                        size={16}
                        style={{ color: theme.palette.text.secondary }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pb: "16px",
          pt: "16px",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* New MCP Server Button */}
          <Button
            onClick={handleNewServer}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 500,
              height: "36px",
              px: "16px",
              borderColor: theme.palette.neutral[300],
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.neutral[400],
                backgroundColor: theme.palette.neutral[100],
              },
            }}
          >
            New MCP server
          </Button>

          {/* Info Message */}
          {selectedServerIds.size > 0 && (
            <Tooltip
              title={`Publish tool to ${selectedServerIds.size} server${selectedServerIds.size === 1 ? "" : "s"}`}
              arrow
              placement="top"
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: theme.palette.text.secondary,
                  cursor: "help",
                }}
              >
                Publish tool to {selectedServerIds.size} server{selectedServerIds.size === 1 ? "" : "s"}
              </Typography>
            </Tooltip>
          )}
        </Box>

        {/* Cancel and Apply Buttons */}
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 500,
              height: "36px",
              px: "16px",
              borderColor: theme.palette.neutral[300],
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.neutral[400],
                backgroundColor: theme.palette.neutral[100],
              },
            }}
          >
            cancel
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={!hasChanges}
            sx={{
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 500,
              height: "36px",
              px: "16px",
              backgroundColor: hasChanges
                ? theme.palette.blue[600]
                : theme.palette.neutral[50],
              color: hasChanges
                ? "#ffffff"
                : theme.palette.text.disabled,
              "&:hover": {
                backgroundColor: hasChanges
                  ? theme.palette.blue[700]
                  : theme.palette.neutral[50],
              },
              "&:disabled": {
                backgroundColor: theme.palette.neutral[50],
                color: theme.palette.text.disabled,
              },
            }}
          >
            Apply Changes
          </Button>
        </Box>
      </DialogActions>

      {/* MCP Server Detail Modal */}
      <McpServerPublishedModal
        open={isDetailModalOpen}
        onClose={handleDetailModalClose}
        onEdit={() => {
          // TODO: Handle edit
          console.log("Edit server:", selectedServerForDetail);
        }}
        onRemove={() => {
          // TODO: Handle remove
          console.log("Remove server:", selectedServerForDetail);
        }}
        server={selectedServerForDetail}
        onBack={handleBackFromDetail}
      />
    </Dialog>
  );
}
