"use client";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  Plus,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";
import NavMcpIcon from "../assets/nav-mcp.svg";
import { EmptyState } from "./components/empty-state";
import { EmptySearchState } from "./components/empty-search-state";
import { AddMcpServerModal } from "./components/add-mcp-server-modal";
import { McpServerPublishedModal } from "./components/mcp-server-published-modal";
import { McpServerImportedModal } from "./components/mcp-server-imported-modal";
import { DeleteConfirmationDialog } from "../flows/components/delete-flow-dialog";
import { CapacityProgress } from "./components/capacity-progress";
import { CreateMcpServerModal } from "./components/create-mcp-server-modal";

type TabValue = "imported" | "published";

interface BasicAuth {
  username: string;
  password: string;
}

interface McpServer {
  id: string;
  name: string;
  url: string;
  description?: string;
  basicAuth?: BasicAuth;
  createdAt: string;
  toolsCount: number;
  capacity?: number; // Percentage for published servers
}

// Mock data for MCP servers
const generateMockServers = (): McpServer[] => {
  const baseDate = new Date();
  const servers: McpServer[] = [
    {
      id: "1",
      name: "Alation MCP Server",
      url: "https://master-uat-use1.mtqa.alationcloud.com/ai/mcp",
      description: "Data catalog and governance platform MCP server",
      createdAt: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 15,
    },
    {
      id: "2",
      name: "PostgreSQL Connector",
      url: "https://mcp.postgres.example.com/v1",
      description: "Connect to PostgreSQL databases and execute queries",
      createdAt: new Date(
        baseDate.getTime() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 8,
    },
    {
      id: "3",
      name: "Slack Integration",
      url: "https://mcp.slack.com/api",
      description: "Send messages and manage Slack workspaces",
      createdAt: new Date(
        baseDate.getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 12,
    },
    {
      id: "4",
      name: "GitHub Actions MCP",
      url: "https://api.github.com/mcp",
      createdAt: new Date(
        baseDate.getTime() - 18 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 6,
    },
    {
      id: "5",
      name: "AWS S3 Server",
      url: "https://s3-mcp.us-east-1.amazonaws.com",
      description: "Access and manage S3 buckets and objects",
      createdAt: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 10,
    },
    {
      id: "6",
      name: "Jira MCP Server",
      url: "https://company.atlassian.net/mcp",
      createdAt: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 9,
    },
    {
      id: "7",
      name: "MongoDB Connector",
      url: "https://mcp.mongodb.com/v1",
      description: "Query and manage MongoDB databases",
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 7,
    },
    {
      id: "8",
      name: "Salesforce Integration",
      url: "https://api.salesforce.com/mcp",
      createdAt: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 14,
    },
    {
      id: "9",
      name: "Stripe Payment MCP",
      url: "https://api.stripe.com/v1/mcp",
      description: "Process payments and manage Stripe accounts",
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 11,
    },
    {
      id: "10",
      name: "OpenAI API Server",
      url: "https://api.openai.com/v1/mcp",
      createdAt: new Date(
        baseDate.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      toolsCount: 5,
    },
  ];
  return servers;
};

type SortField = "name" | "toolsCount" | "capacity" | "createdAt" | null;
type SortDirection = "asc" | "desc";

function McpServersPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>("imported");
  const [modalOpen, setModalOpen] = useState(false);
  const [importedServers, setImportedServers] = useState<McpServer[]>(
    generateMockServers()
  );
  // Mock data for published servers
  const generateMockPublishedServers = (): McpServer[] => {
    const baseDate = new Date();
    const servers: McpServer[] = [
      {
        id: "p1",
        name: "Production Data Catalog",
        url: "https://prod.alationcloud.com/ai/mcp",
        description: "Production environment MCP server",
        createdAt: new Date(
          baseDate.getTime() - 45 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 25,
        capacity: 75,
      },
      {
        id: "p2",
        name: "Analytics Platform Server",
        url: "https://analytics.company.com/mcp",
        description: "Analytics and reporting tools",
        createdAt: new Date(
          baseDate.getTime() - 35 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 18,
        capacity: 60,
      },
      {
        id: "p3",
        name: "Customer Data Hub",
        url: "https://customer-data.example.com/mcp",
        createdAt: new Date(
          baseDate.getTime() - 28 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 32,
        capacity: 90,
      },
      {
        id: "p4",
        name: "Internal Tools Server",
        url: "https://internal.tools.com/mcp",
        description: "Internal development and operations tools",
        createdAt: new Date(
          baseDate.getTime() - 22 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 14,
        capacity: 45,
      },
      {
        id: "p5",
        name: "External API Gateway",
        url: "https://api-gateway.company.com/mcp",
        createdAt: new Date(
          baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 21,
        capacity: 55,
      },
      {
        id: "p6",
        name: "Data Warehouse Connector",
        url: "https://warehouse.company.com/mcp",
        description: "Connector for data warehouse operations",
        createdAt: new Date(
          baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        toolsCount: 28,
        capacity: 85,
      },
    ];
    return servers;
  };

  const [publishedServers, setPublishedServers] = useState<McpServer[]>(
    generateMockPublishedServers()
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serverToEdit, setServerToEdit] = useState<McpServer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [serverToView, setServerToView] = useState<McpServer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<McpServer | null>(null);
  const [createServerModalOpen, setCreateServerModalOpen] = useState(false);
  const theme = useTheme();
  const isEmptyVariant = searchParams.get("variant") === "empty";
  const displayImportedServers = isEmptyVariant ? [] : importedServers;
  const displayPublishedServers = isEmptyVariant ? [] : publishedServers;

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: TabValue
  ) => {
    setActiveTab(newValue);
  };

  const handleAddServer = (serverData: {
    name: string;
    url: string;
    description?: string;
    basicAuth?: BasicAuth;
  }) => {
    if (serverToEdit) {
      // Update existing server
      const updatedServer: McpServer = {
        ...serverToEdit,
        name: serverData.name,
        url: serverData.url,
        description: serverData.description,
        basicAuth: serverData.basicAuth,
      };

      if (activeTab === "imported") {
        setImportedServers((prev) =>
          prev.map((server) =>
            server.id === serverToEdit.id ? updatedServer : server
          )
        );
      } else {
        setPublishedServers((prev) =>
          prev.map((server) =>
            server.id === serverToEdit.id ? updatedServer : server
          )
        );
      }
      setServerToEdit(null);
    } else {
      // Add new server
      const newServer: McpServer = {
        id: crypto.randomUUID(),
        name: serverData.name,
        url: serverData.url,
        description: serverData.description,
        basicAuth: serverData.basicAuth,
        createdAt: new Date().toISOString(),
        toolsCount: 0,
      };

      if (activeTab === "imported") {
        setImportedServers((prev) => [...prev, newServer]);
      } else {
        setPublishedServers((prev) => [...prev, newServer]);
      }
    }
  };

  const handleRowClick = (server: McpServer, e: React.MouseEvent) => {
    // Don't open modal if clicking on button or icon button
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".MuiIconButton-root") ||
      target.closest("th")
    ) {
      return;
    }
    setServerToView(server);
    setViewModalOpen(true);
  };

  const handleEditFromView = () => {
    if (serverToView) {
      setServerToEdit(serverToView);
      setViewModalOpen(false);
      setModalOpen(true);
    }
  };

  const currentServersRaw =
    activeTab === "imported" ? displayImportedServers : displayPublishedServers;

  // Handle header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter and sort servers
  const currentServers = useMemo(() => {
    // First filter by search term
    let filtered = [...currentServersRaw];
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (server) =>
          server.name.toLowerCase().includes(lowerSearch) ||
          server.url.toLowerCase().includes(lowerSearch)
      );
    }

    // Then sort
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortField) {
          case "name": {
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            return sortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "toolsCount": {
            aValue = a.toolsCount;
            bValue = b.toolsCount;
            return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
          }
          case "capacity": {
            aValue = a.capacity ?? 0;
            bValue = b.capacity ?? 0;
            return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
          }
          case "createdAt": {
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
          }
          default:
            return 0;
        }
      });
    }
    return filtered;
  }, [currentServersRaw, sortField, sortDirection, searchTerm]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    serverId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedServerId(serverId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedServerId(null);
  };

  const handleRemove = () => {
    if (selectedServerId) {
      const server = currentServersRaw.find((s) => s.id === selectedServerId);
      if (server) {
        setServerToDelete(server);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  const handleConfirmRemove = () => {
    if (serverToDelete) {
      if (activeTab === "imported") {
        setImportedServers((prev) =>
          prev.filter((server) => server.id !== serverToDelete.id)
        );
      } else {
        setPublishedServers((prev) =>
          prev.filter((server) => server.id !== serverToDelete.id)
        );
      }
    }
    setDeleteDialogOpen(false);
    setServerToDelete(null);
  };

  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
    setServerToDelete(null);
  };

  const handleCreateServer = (serverName: string) => {
    const baseDate = new Date();
    const newServer: McpServer = {
      id: crypto.randomUUID(),
      name: serverName,
      url: "", // Will be set when tools are added
      createdAt: new Date().toISOString(),
      toolsCount: 0,
      capacity: 0,
    };
    setPublishedServers((prev) => [...prev, newServer]);
  };

  const handleRemoveFromView = () => {
    if (serverToView) {
      if (activeTab === "imported") {
        setImportedServers((prev) =>
          prev.filter((server) => server.id !== serverToView.id)
        );
      } else {
        setPublishedServers((prev) =>
          prev.filter((server) => server.id !== serverToView.id)
        );
      }
      setServerToView(null);
      setViewModalOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "24px",
          pt: "16px",
          pb: "8px",
          zIndex: 20,

          flexShrink: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">
          MCP servers
        </Typography>
      </Box>

      {/* Tabs Section */}
      <Box
        sx={{
          backgroundColor: "white",
          position: "relative",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          overflow: "visible",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="MCP servers tabs"
        >
          <Tab label="Imported servers" value="imported" />
          <Tab label="Published servers" value="published" />
        </Tabs>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search and Add Section */}
        {currentServersRaw.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: "24px",
              pt: "20px",
              pb: "20px",
              gap: "8px",
              flexWrap: "wrap",
              position: "sticky",
              top: 0,
              backgroundColor: "#ffffff",
              zIndex: 20,
            }}
          >
            <TextField
              placeholder="Search servers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#666",
                    }}
                  >
                    <Search size={18} />
                  </Box>
                ),
                endAdornment: searchTerm ? (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    sx={{ padding: "4px" }}
                  >
                    <X size={16} />
                  </IconButton>
                ) : undefined,
              }}
              sx={{
                minWidth: "280px",
                "& .MuiOutlinedInput-root": {
                  ...(searchTerm && {
                    paddingRight: "4px",
                    "& input": {
                      paddingRight: "0px",
                    },
                    "& .MuiInputBase-inputAdornedEnd": {
                      paddingRight: "0px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${theme.palette.primary.main} !important`,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${theme.palette.primary.main} !important`,
                    },
                  }),
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => {
                if (activeTab === "published") {
                  setCreateServerModalOpen(true);
                } else {
                  setServerToEdit(null);
                  setModalOpen(true);
                }
              }}
            >
              {activeTab === "published"
                ? "Create MCP Server"
                : "Add new server"}
            </Button>
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            pt: currentServersRaw.length > 0 ? 0 : "24px",
          }}
        >
          {currentServers.length === 0 && searchTerm ? (
            <EmptySearchState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : currentServers.length === 0 ? (
            <EmptyState
              icon={NavMcpIcon}
              title={
                activeTab === "imported"
                  ? "No imported servers"
                  : "No published servers"
              }
              description={
                activeTab === "imported"
                  ? "Import MCP servers to get started. Servers you import will appear here."
                  : "Published servers will appear here once you publish them."
              }
              button={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => {
                    if (activeTab === "published") {
                      setCreateServerModalOpen(true);
                    } else {
                      setServerToEdit(null);
                      setModalOpen(true);
                    }
                  }}
                >
                  {activeTab === "published"
                    ? "Create MCP Server"
                    : "Add MCP server"}
                </Button>
              }
            />
          ) : (
            <Box
              sx={{
                borderRadius: "8px",
                "& table tbody tr": {
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgb(252, 252, 252)",
                  },
                  // Hide actions column by default
                  "& td:last-of-type .MuiIconButton-root": {
                    opacity: 0,
                  },
                  // Show actions column on row hover
                  "&:hover td:last-of-type .MuiIconButton-root": {
                    opacity: 1,
                  },
                },
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <Box
                  component="thead"
                  sx={{
                    position: "sticky",
                    top: "75px",
                    zIndex: 10,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: "0",
                      right: 0,
                      bottom: 0,
                      height: "1px",
                      backgroundColor: "rgb(240, 240, 240)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleSort("name")}
                      onMouseEnter={() => setHoveredHeaderId("name")}
                      onMouseLeave={() => setHoveredHeaderId(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                          gap: "8px",
                        }}
                      >
                        Name
                        {sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "name" && (
                            <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                          )
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        cursor: "pointer",
                        userSelect: "none",
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                      }}
                      onClick={() => handleSort("toolsCount")}
                      onMouseEnter={() => setHoveredHeaderId("toolsCount")}
                      onMouseLeave={() => setHoveredHeaderId(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                          gap: "8px",
                        }}
                      >
                        Tools
                        {sortField === "toolsCount" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "toolsCount" && (
                            <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                          )
                        )}
                      </div>
                    </th>
                    {activeTab === "published" && (
                      <th
                        style={{
                          padding: "12px",
                          borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          textAlign: "left",
                          cursor: "pointer",
                          userSelect: "none",
                          width: "120px",
                          minWidth: "120px",
                          maxWidth: "120px",
                        }}
                        onClick={() => handleSort("capacity")}
                        onMouseEnter={() => setHoveredHeaderId("capacity")}
                        onMouseLeave={() => setHoveredHeaderId(null)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: theme.palette.text.secondary,
                            gap: "8px",
                          }}
                        >
                          Capacity
                          {sortField === "capacity" ? (
                            sortDirection === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            hoveredHeaderId === "capacity" && (
                              <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                            )
                          )}
                        </div>
                      </th>
                    )}
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        cursor: "pointer",
                        userSelect: "none",
                        width: "140px",
                        minWidth: "140px",
                        maxWidth: "140px",
                      }}
                      onClick={() => handleSort("createdAt")}
                      onMouseEnter={() => setHoveredHeaderId("createdAt")}
                      onMouseLeave={() => setHoveredHeaderId(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                          gap: "8px",
                        }}
                      >
                        {activeTab === "published" ? "Created date" : "Added date"}
                        {sortField === "createdAt" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "createdAt" && (
                            <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                          )
                        )}
                      </div>
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        width: "48px",
                      }}
                    ></th>
                  </tr>
                </Box>
                <tbody>
                  {currentServers.map((server) => (
                    <tr
                      key={server.id}
                      onClick={(e) => handleRowClick(server, e)}
                    >
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "4px",
                              backgroundColor: theme.palette.neutral[200],
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
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {server.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.secondary,
                          width: "100px",
                          minWidth: "100px",
                          maxWidth: "100px",
                        }}
                      >
                        {server.toolsCount}
                      </td>
                      {activeTab === "published" && (
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            fontSize: "13px",
                            color: theme.palette.text.secondary,
                            width: "120px",
                            minWidth: "120px",
                            maxWidth: "120px",
                          }}
                        >
                          {server.capacity !== undefined ? (
                            <CapacityProgress value={server.capacity} />
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.secondary,
                          width: "140px",
                          minWidth: "140px",
                          maxWidth: "140px",
                        }}
                      >
                        {new Date(server.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, server.id)}
                          sx={{
                            padding: "4px",
                          }}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      </Box>

      {/* MCP Server View Modal */}
      {activeTab === "published" ? (
        <McpServerPublishedModal
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setServerToView(null);
          }}
          onEdit={handleEditFromView}
          onRemove={handleRemoveFromView}
          server={serverToView}
        />
      ) : (
        <McpServerImportedModal
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setServerToView(null);
          }}
          onEdit={handleEditFromView}
          onRemove={handleRemoveFromView}
          server={serverToView}
        />
      )}

      {/* Add/Edit MCP Server Modal */}
      <AddMcpServerModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setServerToEdit(null);
        }}
        onAdd={handleAddServer}
        serverToEdit={serverToEdit}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          Remove
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove MCP server?"
        description={
          serverToDelete
            ? `Are you sure you want to remove "${serverToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to remove this server? This action cannot be undone."
        }
        confirmButtonText="Remove"
      />

      {/* Create MCP Server Modal (for published servers) */}
      <CreateMcpServerModal
        open={createServerModalOpen}
        onClose={() => setCreateServerModalOpen(false)}
        onCreate={handleCreateServer}
      />
    </Box>
  );
}

export default function McpServersPage() {
  return (
    <Suspense fallback={null}>
      <McpServersPageContent />
    </Suspense>
  );
}
