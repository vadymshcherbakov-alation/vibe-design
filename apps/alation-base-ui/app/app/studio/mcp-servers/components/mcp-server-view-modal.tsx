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
  TextField,
  InputAdornment,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import { X, Edit, Trash2, Copy, Check, Info, MoreVertical, ChevronLeft } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import NavMcpIcon from "../../assets/nav-mcp.svg";
import { DeleteConfirmationDialog } from "../../flows/components/delete-flow-dialog";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";
import { Chip } from "@mui/material";

interface McpServer {
  id: string;
  name: string;
  url: string;
  description?: string;
  createdAt: string;
  toolsCount: number;
}

interface McpTool {
  name: string;
  description: string;
}

interface McpServerViewModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRemove: () => void;
  server: McpServer | null;
  isPublished?: boolean; // Whether this is a published server
  onBack?: () => void; // Optional back button handler
}

// Generate mock tools
const generateMockTools = (): McpTool[] => {
  return [
    { name: "bulk_retrieval", description: "Retrieve multiple data objects in a single request" },
    { name: "catalog_search", description: "Search the data catalog for tables, columns, and metadata" },
    { name: "data_lineage", description: "Get lineage information for data assets" },
    { name: "schema_analysis", description: "Analyze database schema structure and relationships" },
    { name: "query_executor", description: "Execute SQL queries against connected databases" },
    { name: "table_metadata", description: "Get detailed metadata about database tables" },
    { name: "column_profiler", description: "Profile column statistics and data quality metrics" },
    { name: "data_quality_check", description: "Run data quality checks on specified datasets" },
    { name: "relationship_mapper", description: "Map relationships between data assets" },
    { name: "documentation_generator", description: "Generate documentation for data assets" },
    { name: "tag_manager", description: "Manage tags and classifications for data assets" },
    { name: "access_control", description: "Manage access control and permissions" },
    { name: "usage_analytics", description: "Get usage analytics and statistics" },
    { name: "performance_monitor", description: "Monitor query performance and optimization" },
    { name: "backup_manager", description: "Manage data backups and restore operations" },
    { name: "export_data", description: "Export data in various formats" },
    { name: "import_data", description: "Import data from external sources" },
    { name: "transform_pipeline", description: "Create and manage data transformation pipelines" },
    { name: "validation_rule", description: "Define and execute data validation rules" },
    { name: "notification_service", description: "Send notifications for data events and changes" },
  ];
};

export function McpServerViewModal({
  open,
  onClose,
  onEdit,
  onRemove,
  server,
  isPublished = false,
  onBack,
}: McpServerViewModalProps) {
  const theme = useTheme();
  const tools = useMemo(() => generateMockTools(), []);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [hoveredToolIndex, setHoveredToolIndex] = useState<number | null>(null);
  const [toolMenuAnchorEl, setToolMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedToolIndex, setSelectedToolIndex] = useState<number | null>(null);

  if (!server) return null;

  const handleRemoveClick = () => {
    setConfirmRemoveOpen(true);
  };

  const handleConfirmRemove = () => {
    onRemove();
    setConfirmRemoveOpen(false);
    onClose();
  };

  const handleCancelRemove = () => {
    setConfirmRemoveOpen(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(server.url);
      setUrlCopied(true);
      // Reset the check icon after 2 seconds
      setTimeout(() => {
        setUrlCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "720px",
          maxWidth: "720px",
          borderRadius: "12px",
          boxShadow:
            "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                marginLeft: "-8px",
                padding: "4px",
                width: "28px",
                height: "28px",
                "&:hover": {
                  backgroundColor: theme.palette.neutral[100],
                },
              }}
            >
              <ChevronLeft size={16} />
            </IconButton>
          )}
          <Box
            sx={{
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
          </Box>
          <Typography variant="h2" component="span">
            {server.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ marginRight: "-8px" }}>
          <X size={16} />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          px: "20px",
          py: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Information Callout - Only show for published servers */}
        {isPublished && (
          <Alert
            severity="info"
            icon={<Info size={16} />}
            sx={{
              mb: "16px",
              backgroundColor: theme.palette.blue[200],
              color: theme.palette.text.primary,
              "& .MuiAlert-icon": {
                color: theme.palette.info.main,
              },
              "& .MuiAlert-message": {
                fontSize: "13px",
                lineHeight: "20px",
              },
            }}
          >
            To add tools to this server, go to Agent and export from Agent Access
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* MCP server URL */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                mb: "8px",
                fontWeight: "500",
              }}
            >
              MCP server URL
            </Typography>
            <TextField
              value={server.url}
              fullWidth
              size="small"
              disabled
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleCopyUrl}
                      edge="end"
                      sx={{
                        padding: "4px",
                      }}
                    >
                      {urlCopied ? (
                        <Check size={16} style={{ color: theme.palette.success.main }} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.neutral[300],
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.neutral[300],
                  },
                  "&.Mui-disabled fieldset": {
                    borderColor: theme.palette.neutral[300],
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                    color: theme.palette.text.primary,
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Tools Section */}
        <Box sx={{ mt: "24px", display: "flex", flexDirection: "column" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              mb: "12px",
            }}
          >
            Tools ({tools.length})
          </Typography>
          {isPublished ? (
            // Card-based design for published servers
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "400px",
                overflowY: "auto",
                marginRight: "-20px",
                paddingRight: "20px",
              }}
            >
              {tools.map((tool, index) => {
                // Determine if tool is an Agent (for now, all are tools, but can be extended)
                const toolType: "Tool" | "Agent" = "Tool";
                const isHovered = hoveredToolIndex === index;

                return (
                  <Box
                    key={index}
                    onMouseEnter={() => setHoveredToolIndex(index)}
                    onMouseLeave={() => setHoveredToolIndex(null)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "12px",
                      borderRadius: "6px",
                      backgroundColor: isHovered
                        ? theme.palette.neutral[100]
                        : "#ffffff",
                      transition: `background-color ${"150ms"}`,
                    }}
                  >
                    {/* Tool Info */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {/* Tool Icon */}
                      <ItemTypeIcon type={toolType} size={24} />
                      {/* Tool Name */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {tool.name}
                      </Typography>
                    </Box>
                    {/* Tool Type Chip and Menu */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Chip
                        label={toolType}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "12px",
                          fontWeight: "normal",
                          backgroundColor: theme.palette.blue[200],
                          color: theme.palette.blue[600],
                          "& .MuiChip-label": {
                            px: "8px",
                          },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToolMenuAnchorEl(e.currentTarget);
                          setSelectedToolIndex(index);
                        }}
                        sx={{
                          padding: "4px",
                          width: "28px",
                          height: "28px",
                        }}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            // Table design for imported servers
            <Box
              sx={{
                borderRadius: "8px",
                maxHeight: "400px",
                overflowY: "auto",
                marginRight: "-20px",
                paddingRight: "20px",
                "& table tbody tr": {
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
                }}
              >
                <Box
                  component="thead"
                  sx={{
                    position: "sticky",
                    top: 0,
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
                          gap: "8px",
                        }}
                      >
                        Tool
                      </div>
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign: "left",
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
                          gap: "8px",
                        }}
                      >
                        Description
                      </div>
                    </th>
                  </tr>
                </Box>
                <tbody>
                  {tools.map((tool, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {tool.name}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                          fontSize: "13px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {tool.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: "20px",
          pb: "20px",
          pt: "12px",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Button
          onClick={handleRemoveClick}
          variant="text"
          color="error"
          startIcon={<Trash2 size={16} />}
        >
          Delete MCP server
        </Button>
        <Button onClick={onClose} variant="text" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Confirmation Dialog */}
    <DeleteConfirmationDialog
      open={confirmRemoveOpen}
      onClose={handleCancelRemove}
      onConfirm={handleConfirmRemove}
      title="Remove MCP server"
      description={`Are you sure you want to remove "${server.name}"?`}
      confirmButtonText="Remove"
    />

    {/* Tool Menu */}
    <Menu
      anchorEl={toolMenuAnchorEl}
      open={Boolean(toolMenuAnchorEl)}
      onClose={() => {
        setToolMenuAnchorEl(null);
        setSelectedToolIndex(null);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        onClick={() => {
          // TODO: Handle tool removal
          console.log("Remove tool at index:", selectedToolIndex);
          setToolMenuAnchorEl(null);
          setSelectedToolIndex(null);
        }}
        sx={{ color: "error.main" }}
      >
        Remove from this server
      </MenuItem>
    </Menu>
  </>
  );
}

