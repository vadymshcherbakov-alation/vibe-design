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
} from "@mui/material";
import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { Search, X, ArrowUp, ArrowDown, ArrowUpDown, Plus, MoreVertical } from "lucide-react";
import { EmptyState } from "../mcp-servers/components/empty-state";
import { EmptySearchState } from "../mcp-servers/components/empty-search-state";
import { Hammer } from "lucide-react";
import { ItemTypeIcon } from "../flows/components/item-type-icon";
import { AddToolModal } from "./components/add-tool-modal";
import { AddToMcpServersModal } from "./components/add-to-mcp-servers-modal";
import { DeleteConfirmationDialog } from "../flows/components/delete-flow-dialog";

interface Tool {
  id: string;
  name: string;
  type: "native" | "rest" | "smtp";
  description: string;
  createdAt?: string; // Optional: native tools have no date
}

// Mock data for tools - individual tool entries used in flows
const generateMockTools = (): Tool[] => {
  const baseDate = new Date();
  const tools: Tool[] = [
    {
      id: "1",
      name: "analyze_catalog_question",
      type: "native",
      description:
        "Search over the entire Alation catalog to find data assets and objects. This is the main catalog search tool that allows you to find tables, schemas, columns, articles, glossary terms, and other catalog objects.",
    },
    {
      id: "2",
      name: "alation_context",
      type: "native",
      description: "Get context from Alation catalog.",
    },
    {
      id: "3",
      name: "bulk_retrieval",
      type: "native",
      description: "Retrieve data in bulk from the catalog.",
    },
    {
      id: "4",
      name: "get_data_sources",
      type: "native",
      description: "Get available data sources from the catalog.",
    },
    {
      id: "5",
      name: "bi_report_search",
      type: "native",
      description: "Search for BI reports in the catalog.",
    },
    {
      id: "6",
      name: "search_catalog",
      type: "native",
      description: "Search the catalog for various objects.",
    },
    {
      id: "7",
      name: "execute_query",
      type: "rest",
      description: "Execute SQL queries against PostgreSQL databases.",
      createdAt: new Date(
        baseDate.getTime() - 12 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "8",
      name: "send_message",
      type: "rest",
      description: "Send messages to Slack channels or users.",
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "9",
      name: "create_issue",
      type: "rest",
      description: "Create new issues in GitHub repositories.",
      createdAt: new Date(
        baseDate.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "10",
      name: "upload_file",
      type: "rest",
      description: "Upload files to S3 buckets.",
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "11",
      name: "list_buckets",
      type: "rest",
      description: "List all S3 buckets in the account.",
      createdAt: new Date(
        baseDate.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "12",
      name: "send_notification_email",
      type: "smtp",
      description: "Send notification emails via SMTP server.",
      createdAt: new Date(
        baseDate.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "13",
      name: "send_bulk_email",
      type: "smtp",
      description: "Send bulk emails to multiple recipients using SMTP.",
      createdAt: new Date(
        baseDate.getTime() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "14",
      name: "send_alert_email",
      type: "smtp",
      description: "Send alert emails for system notifications and warnings.",
      createdAt: new Date(
        baseDate.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "15",
      name: "send_welcome_email",
      type: "smtp",
      description: "Send welcome emails to new users upon registration.",
      createdAt: new Date(
        baseDate.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];
  return tools;
};

type SortField = "name" | "type" | "createdAt" | null;
type SortDirection = "asc" | "desc";

function ToolsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<Tool[]>(generateMockTools());
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "native" | "rest" | "smtp">(
    "all"
  );
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isAddToMcpServersModalOpen, setIsAddToMcpServersModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);
  const theme = useTheme();
  const isEmptyVariant = searchParams.get("variant") === "empty";
  const displayTools = isEmptyVariant ? [] : tools;

  // Check if any filter is active
  const hasActiveFilters = searchTerm.trim() !== "" || typeFilter !== "all";

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
  };

  // Handle menu open
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    toolId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedToolId(toolId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedToolId(null);
  };

  // Handle add to MCP servers
  const handleAddToMcpServers = () => {
    handleMenuClose();
    setIsAddToMcpServersModalOpen(true);
  };

  // Handle edit tool
  const handleEdit = () => {
    if (selectedToolId) {
      const tool = tools.find((t) => t.id === selectedToolId);
      if (tool) {
        setToolToEdit(tool);
        setIsAddToolModalOpen(true);
      }
    }
    handleMenuClose();
  };

  // Handle remove tool
  const handleRemove = () => {
    if (selectedToolId) {
      const tool = tools.find((t) => t.id === selectedToolId);
      if (tool) {
        setToolToDelete(tool);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  // Handle confirm remove
  const handleConfirmRemove = () => {
    if (toolToDelete) {
      setTools((prev) => prev.filter((tool) => tool.id !== toolToDelete.id));
    }
    setDeleteDialogOpen(false);
    setToolToDelete(null);
  };

  // Handle cancel remove
  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
    setToolToDelete(null);
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

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    // First filter by type
    let filtered = [...displayTools];
    if (typeFilter !== "all") {
      filtered = filtered.filter((tool) => tool.type === typeFilter);
    }

    // Then filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerSearch) ||
          tool.description.toLowerCase().includes(lowerSearch) ||
          tool.type.toLowerCase().includes(lowerSearch)
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
          case "type": {
            aValue = a.type.toLowerCase();
            bValue = b.type.toLowerCase();
            return sortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "createdAt": {
            // Native tools (no date) should be sorted last
            if (!a.createdAt && !b.createdAt) return 0;
            if (!a.createdAt) return 1; // a goes to end
            if (!b.createdAt) return -1; // b goes to end
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
  }, [displayTools, sortField, sortDirection, searchTerm, typeFilter]);

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
          pb: "4px",
          zIndex: 20,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">Tools</Typography>
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
        {displayTools.length > 0 && (
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
            <TextField
              placeholder="Search tools"
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
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "all" | "native" | "rest" | "smtp")
              }
              size="small"
              sx={{
                minWidth: "120px",
                ...(typeFilter !== "all" && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                }),
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="native">Native</MenuItem>
              <MenuItem value="rest">REST</MenuItem>
              <MenuItem value="smtp">SMTP</MenuItem>
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
                onClick={() => setIsAddToolModalOpen(true)}
              >
                Add tool
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
            pt: displayTools.length > 0 ? 0 : "24px",
          }}
        >
          {filteredAndSortedTools.length === 0 && searchTerm ? (
            <EmptySearchState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : filteredAndSortedTools.length === 0 ? (
            <EmptyState
              icon={Hammer}
              title="No tools"
              description="Available tools will appear here once they are added."
              button={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsAddToolModalOpen(true)}
                >
                  Add tool
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
                      onClick={() => handleSort("type")}
                      onMouseEnter={() => setHoveredHeaderId("type")}
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
                        Type
                        {sortField === "type" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "type" && (
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
                        Added date
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
                        width: "60px",
                        minWidth: "60px",
                        maxWidth: "60px",
                      }}
                    >
                    </th>
                  </tr>
                </Box>
                <tbody>
                  {filteredAndSortedTools.map((tool) => (
                    <tr
                      key={tool.id}
                      onClick={() =>
                        router.push(`/app/studio/tools/${tool.id}`)
                      }
                      onMouseEnter={() => setHoveredRowId(tool.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
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
                          <ItemTypeIcon type={tool.type} size={28} />
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
                              {tool.name}
                            </div>
                            {tool.description && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: theme.palette.text.secondary,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {tool.description}
                              </div>
                            )}
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
                        <Chip
                          label={tool.type.toUpperCase()}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            ...(tool.type === "rest" && {
                              backgroundColor: "rgba(33, 150, 243, 0.1)",
                              color: "rgb(33, 150, 243)",
                            }),
                            ...(tool.type === "smtp" && {
                              backgroundColor: "rgba(33, 150, 243, 0.1)",
                              color: "rgb(33, 150, 243)",
                            }),
                          }}
                        />
                      </td>
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
                        {tool.createdAt
                          ? new Date(tool.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
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
                        {(tool.type === "rest" || tool.type === "smtp") && (hoveredRowId === tool.id || selectedToolId === tool.id) && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, tool.id);
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

      {/* Add Tool Modal */}
      <AddToolModal
        open={isAddToolModalOpen}
        onClose={() => {
          setIsAddToolModalOpen(false);
          setToolToEdit(null);
        }}
        onSave={(toolData) => {
          if (toolToEdit) {
            // Update existing tool
            setTools((prev) =>
              prev.map((tool) =>
                tool.id === toolToEdit.id
                  ? {
                      ...tool,
                      name: toolData.name,
                      description: toolData.description,
                    }
                  : tool
              )
            );
          } else {
            // Add new tool
            // TODO: Implement add functionality
            console.log("Tool data:", toolData);
          }
          setIsAddToolModalOpen(false);
          setToolToEdit(null);
        }}
        toolToEdit={
          toolToEdit
            ? {
                id: toolToEdit.id,
                name: toolToEdit.name,
                description: toolToEdit.description,
                type: toolToEdit.type === "rest" ? "REST" : "SMTP",
              }
            : null
        }
      />

      {/* Add to MCP Servers Modal */}
      <AddToMcpServersModal
        open={isAddToMcpServersModalOpen}
        onClose={() => setIsAddToMcpServersModalOpen(false)}
        toolId={selectedToolId}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleAddToMcpServers}>
          Add to MCP Servers
        </MenuItem>
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          Remove
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove tool?"
        description={
          toolToDelete
            ? `Are you sure you want to remove "${toolToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to remove this tool? This action cannot be undone."
        }
        confirmButtonText="Remove"
        requireConfirmationText={toolToDelete ? toolToDelete.name : undefined}
      />
    </Box>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={null}>
      <ToolsPageContent />
    </Suspense>
  );
}
