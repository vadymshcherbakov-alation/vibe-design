"use client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Select,
  MenuItem,
  Menu,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  MoreVertical,
} from "lucide-react";
import { EmptyState } from "../mcp-servers/components/empty-state";
import { EmptySearchState } from "../mcp-servers/components/empty-search-state";
import { DeleteConfirmationDialog } from "../flows/components/delete-flow-dialog";
import { AddAgentModal } from "./components/add-agent-modal";
import { ItemTypeIcon } from "../flows/components/item-type-icon";
import { GettingStarted } from "./components/getting-started";
import AgentIcon from "@/app/app/studio/assets/type-agent.svg";

interface Agent {
  id: string;
  name: string;
  type: "conversational" | "task" | "workflow";
  category: "native" | "custom";
  creator: string;
  access: ("mcp" | "rest")[];
  description: string;
  createdAt: string;
  status: "active" | "inactive" | "draft";
}

// Mock data for agents
const generateMockAgents = (): Agent[] => {
  const baseDate = new Date();
  const agents: Agent[] = [
    {
      id: "1",
      name: "Data Analyst Agent",
      type: "conversational",
      category: "native",
      creator: "Alation",
      access: ["mcp", "rest"],
      description:
        "An AI agent specialized in analyzing data catalogs and providing insights about data assets, lineage, and quality.",
      createdAt: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "2",
      name: "Query Assistant",
      type: "task",
      category: "native",
      creator: "Alation",
      access: ["mcp"],
      description:
        "Helps users write and optimize SQL queries based on catalog metadata.",
      createdAt: new Date(
        baseDate.getTime() - 25 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "3",
      name: "Documentation Bot",
      type: "conversational",
      category: "native",
      creator: "Alation",
      access: ["rest"],
      description:
        "Automatically generates documentation for data assets and maintains metadata.",
      createdAt: new Date(
        baseDate.getTime() - 20 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "4",
      name: "Data Quality Monitor",
      type: "workflow",
      category: "native",
      creator: "Alation",
      access: ["mcp", "rest"],
      description:
        "Monitors data quality metrics and alerts users about anomalies.",
      createdAt: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "inactive",
    },
    {
      id: "5",
      name: "Governance Assistant",
      type: "task",
      category: "custom",
      creator: "John Smith",
      access: ["mcp"],
      description:
        "Assists with data governance tasks like access requests and policy enforcement.",
      createdAt: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "6",
      name: "Lineage Explorer",
      type: "conversational",
      category: "custom",
      creator: "Sarah Johnson",
      access: ["rest"],
      description:
        "Helps users understand data lineage and trace data flows across systems.",
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "draft",
    },
    {
      id: "7",
      name: "Report Generator",
      type: "workflow",
      category: "custom",
      creator: "Michael Chen",
      access: ["mcp", "rest"],
      description:
        "Generates automated reports based on data catalog information.",
      createdAt: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "8",
      name: "Metadata Enricher",
      type: "task",
      category: "custom",
      creator: "Emily Davis",
      access: ["mcp"],
      description: "Enriches catalog metadata using AI-powered suggestions.",
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "9",
      name: "Search Optimizer",
      type: "workflow",
      category: "custom",
      creator: "John Smith",
      access: ["rest"],
      description:
        "Optimizes catalog search results based on user behavior and relevance.",
      createdAt: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "inactive",
    },
    {
      id: "10",
      name: "Compliance Checker",
      type: "task",
      category: "custom",
      creator: "Sarah Johnson",
      access: ["mcp", "rest"],
      description:
        "Validates data assets against compliance requirements and policies.",
      createdAt: new Date(
        baseDate.getTime() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "draft",
    },
  ];
  return agents;
};

// Helper function to get initials from a name
const getInitials = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  const parts = trimmed.split(" ").filter((p) => p.length > 0);
  if (parts.length >= 2) {
    const first = parts[0]?.[0];
    const last = parts[parts.length - 1]?.[0];
    if (first && last) {
      return `${first}${last}`.toUpperCase();
    }
  }
  return trimmed.slice(0, 2).toUpperCase();
};

// Helper function to get a consistent color for a user name
const getUserColor = (name: string) => {
  const colors = [
    "#1976D2", // blue
    "#388E3C", // green
    "#F57C00", // orange
    "#7B1FA2", // purple
    "#C2185B", // pink
    "#00796B", // teal
    "#5D4037", // brown
    "#455A64", // blue grey
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

type SortField = "name" | "creator" | "createdAt" | null;
type SortDirection = "asc" | "desc";

function AgentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<Agent[]>(generateMockAgents());
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "native" | "custom"
  >("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("all");
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const theme = useTheme();
  const isEmptyVariant = searchParams.get("variant") === "empty";
  const displayAgents = isEmptyVariant ? [] : agents;

  // Get unique creators for filter dropdown
  const uniqueCreators = useMemo(() => {
    const creators = new Set(displayAgents.map((agent) => agent.creator));
    return Array.from(creators).sort();
  }, [displayAgents]);

  // Check if any filter is active
  const hasActiveFilters = searchTerm.trim() !== "" || creatorFilter !== "all";

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCreatorFilter("all");
    setCategoryFilter("all");
  };

  // Handle menu open
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    agentId: string,
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedAgentId(agentId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAgentId(null);
  };

  // Handle edit agent
  const handleEdit = () => {
    if (selectedAgentId) {
      const agent = agents.find((a) => a.id === selectedAgentId);
      if (agent) {
        setAgentToEdit(agent);
        setIsAddAgentModalOpen(true);
      }
    }
    handleMenuClose();
  };

  // Handle remove agent
  const handleRemove = () => {
    if (selectedAgentId) {
      const agent = agents.find((a) => a.id === selectedAgentId);
      if (agent) {
        setAgentToDelete(agent);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  // Handle confirm remove
  const handleConfirmRemove = () => {
    if (agentToDelete) {
      setAgents((prev) =>
        prev.filter((agent) => agent.id !== agentToDelete.id),
      );
    }
    setDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

  // Handle cancel remove
  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

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

  // Filter and sort agents
  const filteredAndSortedAgents = useMemo(() => {
    // First filter by category
    let filtered = [...displayAgents];
    if (categoryFilter !== "all") {
      filtered = filtered.filter((agent) => agent.category === categoryFilter);
    }

    // Then filter by creator
    if (creatorFilter !== "all") {
      filtered = filtered.filter((agent) => agent.creator === creatorFilter);
    }

    // Then filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(lowerSearch) ||
          agent.description.toLowerCase().includes(lowerSearch) ||
          agent.creator.toLowerCase().includes(lowerSearch),
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
          case "creator": {
            aValue = a.creator.toLowerCase();
            bValue = b.creator.toLowerCase();
            return sortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
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
  }, [
    displayAgents,
    sortField,
    sortDirection,
    searchTerm,
    categoryFilter,
    creatorFilter,
  ]);

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
      {/* Getting Started Section */}
      {displayAgents.length > 0 && <GettingStarted />}

      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "24px",
          pb: "0px",
          zIndex: 20,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">Browse agents</Typography>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search and Filter Section */}
        {displayAgents.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
            {/* Category Toggle */}
            <ToggleButtonGroup
              value={categoryFilter}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setCategoryFilter(newValue as "all" | "native" | "custom");
                }
              }}
              size="small"
              sx={{
                backgroundColor:
                  theme.palette.neutral[100],
                borderRadius: "6px",
                p: "2px",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "none",
                  borderRadius: "4px",
                  px: "12px",
                  py: 0,
                  height: "32px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&.Mui-selected": {
                    backgroundColor:
                      "#ffffff",
                    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor:
                        "#ffffff",
                    },
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "transparent",
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.neutral[100],
                    },
                  },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="native">Native</ToggleButton>
              <ToggleButton value="custom">Custom</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              placeholder="Search agents"
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

            <Select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: "140px",
                ...(creatorFilter !== "all" && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                }),
              }}
            >
              <MenuItem value="all">All creators</MenuItem>
              {uniqueCreators.map((creator) => (
                <MenuItem key={creator} value={creator}>
                  {creator}
                </MenuItem>
              ))}
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                sx={{
                  height: "36px",
                  fontSize: "13px",
                }}
              >
                Clear filters
              </Button>
            )}

            <Box sx={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setIsAddAgentModalOpen(true)}
              >
                Build agent
              </Button>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            pt: displayAgents.length > 0 ? 0 : "24px",
          }}
        >
          {filteredAndSortedAgents.length === 0 && searchTerm ? (
            <EmptySearchState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
              icon={AgentIcon}
              entityName="agents"
            />
          ) : filteredAndSortedAgents.length === 0 ? (
            <EmptyState
              icon={AgentIcon}
              title="No agents"
              description="Available agents will appear here once they are added."
              button={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsAddAgentModalOpen(true)}
                >
                  Build agent
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
                },
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  tableLayout: "fixed",
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
                    {/* Name Column */}
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
                    {/* Access Column */}
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        width: "140px",
                        minWidth: "140px",
                        maxWidth: "140px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Access
                      </div>
                    </th>
                    {/* Type Column */}
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        Type
                      </div>
                    </th>
                    {/* Created At Column */}
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
                        Created date
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
                    {/* Creator Column */}
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        cursor: "pointer",
                        userSelect: "none",
                        width: "60px",
                        minWidth: "60px",
                        maxWidth: "60px",
                      }}
                      onClick={() => handleSort("creator")}
                      onMouseEnter={() => setHoveredHeaderId("creator")}
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
                        Creator
                        {sortField === "creator" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "creator" && (
                            <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                          )
                        )}
                      </div>
                    </th>
                    {/* Actions Column */}
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
                        width: "60px",
                        minWidth: "60px",
                        maxWidth: "60px",
                      }}
                    ></th>
                  </tr>
                </Box>
                <tbody>
                  {filteredAndSortedAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      onClick={() =>
                        router.push(`/app/studio/agents-with-tab/${agent.id}`)
                      }
                      onMouseEnter={() => setHoveredRowId(agent.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      {/* Name Cell */}
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                          minWidth: 0,
                          width: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {/* Agent Icon */}
                          <ItemTypeIcon type="Agent" size={28} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                marginBottom: "4px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {agent.name}
                            </div>
                            {agent.description && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: theme.palette.text.secondary,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {agent.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Access Cell */}
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
                        <Box sx={{ display: "flex", gap: "4px" }}>
                          {agent.access.map((accessType) => (
                            <Chip
                              key={accessType}
                              label={accessType.toUpperCase()}
                              size="small"
                              sx={{
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: "500",
                                backgroundColor: theme.palette.neutral[100],
                                color: theme.palette.neutral[600],
                              }}
                            />
                          ))}
                        </Box>
                      </td>
                      {/* Type Cell */}
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
                        <Chip
                          label={
                            agent.category === "native" ? "Native" : "Custom"
                          }
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor:
                              agent.category === "native"
                                ? theme.palette.blue[100]
                                : theme.palette.neutral[100],
                            color:
                              agent.category === "native"
                                ? theme.palette.blue[600]
                                : theme.palette.neutral[600],
                          }}
                        />
                      </td>
                      {/* Created At Cell */}
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
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </td>
                      {/* Creator Cell */}
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          width: "60px",
                          minWidth: "60px",
                          maxWidth: "60px",
                        }}
                      >
                        <Tooltip title={agent.creator} arrow>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: getUserColor(agent.creator),
                              fontSize: "11px",
                              fontWeight: 500,
                            }}
                          >
                            {getInitials(agent.creator)}
                          </Avatar>
                        </Tooltip>
                      </td>
                      {/* Actions Cell */}
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          width: "60px",
                          minWidth: "60px",
                          maxWidth: "60px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(hoveredRowId === agent.id ||
                          selectedAgentId === agent.id) && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, agent.id);
                            }}
                            sx={{
                              padding: "4px",
                            }}
                          >
                            <MoreVertical size={18} />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Agent Modal */}
      <AddAgentModal
        open={isAddAgentModalOpen}
        onClose={() => {
          setIsAddAgentModalOpen(false);
          setAgentToEdit(null);
        }}
        onSave={(agentData) => {
          if (agentToEdit) {
            // Update existing agent
            setAgents((prev) =>
              prev.map((agent) =>
                agent.id === agentToEdit.id
                  ? {
                      ...agent,
                      name: agentData.name,
                      description: agentData.description,
                      type: agentData.type,
                    }
                  : agent,
              ),
            );
          } else {
            // Add new agent (custom category by default)
            const newAgent: Agent = {
              id: String(Date.now()),
              name: agentData.name,
              description: agentData.description,
              type: agentData.type,
              category: "custom",
              creator: "You",
              access: [],
              createdAt: new Date().toISOString(),
              status: "draft",
            };
            setAgents((prev) => [newAgent, ...prev]);
          }
          setIsAddAgentModalOpen(false);
          setAgentToEdit(null);
        }}
        agentToEdit={agentToEdit}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove agent?"
        description={
          agentToDelete
            ? `Are you sure you want to remove "${agentToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to remove this agent? This action cannot be undone."
        }
        confirmButtonText="Remove"
        requireConfirmationText={agentToDelete ? agentToDelete.name : undefined}
      />
    </Box>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={null}>
      <AgentsPageContent />
    </Suspense>
  );
}
