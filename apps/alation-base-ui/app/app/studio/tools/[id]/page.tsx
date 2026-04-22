"use client";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  TextField,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { ChevronLeft, Play, Copy, Check, MoreVertical } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";
import { AddToolModal } from "../components/add-tool-modal";
import { AddToMcpServersModal } from "../components/add-to-mcp-servers-modal";
import { DeleteConfirmationDialog } from "../../flows/components/delete-flow-dialog";

// Tool interface matching the tools listing page
interface Tool {
  id: string;
  name: string;
  type: "native" | "rest" | "smtp";
  description: string;
  createdAt?: string;
}

// Mock tools data - should match the tools listing page
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

// Get tool by ID from mock data
const getToolById = (id: string): Tool | null => {
  const tools = generateMockTools();
  return tools.find((tool) => tool.id === id) || null;
};

// Mock tool detail data - parameters, response, etc. (kept as mockup)
const getMockToolDetail = () => {
  return {
    method: "POST",
    endpoint: "/v1/catalog/search",
    parameters: [
      {
        name: "search_term",
        type: "string",
        description: "Search term to filter data assets by name.",
        required: true,
        example: "customer_data",
      },
      {
        name: "object_types",
        type: "array",
        items: "string",
        description:
          'Optional list of object types to search over. Common types include: "table", "column", "schema", "article", "glossary_term", "datasource". Leave empty to search all object types.',
        required: false,
        example: '["table", "column"]',
      },
      {
        name: "limit",
        type: "integer",
        description: "Maximum number of results to return. Default is 50.",
        required: false,
        example: "50",
      },
      {
        name: "offset",
        type: "integer",
        description: "Number of results to skip for pagination. Default is 0.",
        required: false,
        example: "0",
      },
    ],
    response: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              type: { type: "string" },
              description: { type: "string" },
            },
          },
        },
        total: { type: "integer" },
        limit: { type: "integer" },
        offset: { type: "integer" },
      },
    },
    exampleRequest: {
      search_term: "customer_data",
      object_types: ["table", "column"],
      limit: 50,
      offset: 0,
    },
    exampleResponse: {
      results: [
        {
          id: "12345",
          name: "customer_data",
          type: "table",
          description: "Main customer data table",
        },
        {
          id: "12346",
          name: "customer_id",
          type: "column",
          description: "Unique customer identifier",
        },
      ],
      total: 2,
      limit: 50,
      offset: 0,
    },
  };
};

export default function ToolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const toolId = params.id as string;
  
  // Get actual tool data (name, type, description)
  const tool = getToolById(toolId);
  
  // Get mock detail data (parameters, response, etc.)
  const toolDetail = getMockToolDetail();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddToMcpServersModalOpen, setIsAddToMcpServersModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Initialize parameter values with default/example values
  const initialValues = toolDetail.parameters.reduce(
    (acc, param) => {
      acc[param.name] = param.example || "";
      return acc;
    },
    {} as Record<string, string>
  );

  const [parameterValues, setParameterValues] =
    useState<Record<string, string>>(initialValues);

  const hasChangedValues = toolDetail.parameters.some(
    (param) => parameterValues[param.name] !== (param.example || "")
  );

  const handleParameterChange = (name: string, value: string) => {
    setParameterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetDefaults = () => {
    setParameterValues(initialValues);
  };

  const handleRunTool = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 4000);
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle edit
  const handleEdit = () => {
    handleMenuClose();
    setIsEditModalOpen(true);
  };

  // Handle add to MCP servers
  const handleAddToMcpServers = () => {
    handleMenuClose();
    setIsAddToMcpServersModalOpen(true);
  };

  // Handle remove
  const handleRemove = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  // Handle confirm remove
  const handleConfirmRemove = () => {
    // TODO: Implement actual removal
    setDeleteDialogOpen(false);
    router.push("/app/studio/tools");
  };

  // Handle cancel remove
  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
  };

  // Handle save edit
  const handleSaveEdit = (toolData: any) => {
    // TODO: Implement actual save
    console.log("Tool data:", toolData);
    setIsEditModalOpen(false);
  };

  // Check if tool can be edited/removed (only REST and SMTP, not native)
  const canEditOrRemove = tool?.type === "rest" || tool?.type === "smtp";

  // If tool not found, redirect to tools list
  useEffect(() => {
    if (!tool) {
      router.push("/app/studio/tools");
    }
  }, [tool, router]);

  // Don't render if tool not found
  if (!tool) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.neutral[50],
      }}
    >
      {/* Header Section */}
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
            onClick={() => router.push("/app/studio/tools")}
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              flex: 1,
            }}
          >
            <ItemTypeIcon type={tool.type} size={24} />
            <Typography
              variant="subtitle1"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tool.name}
            </Typography>
          </Box>
        </Box>
        {/* Right side - Menu button (only for REST and SMTP tools) */}
        {canEditOrRemove && (
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          >
            <MoreVertical size={18} />
          </IconButton>
        )}
      </Box>

      {/* Content Section - Documentation Style Layout */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1540px",
            display: "flex",
            gap: "48px",
            flexDirection: "column",
            p: "24px",
          }}
        >
          {/* Title Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
              >
                {tool.name}
              </Typography>
            </Box>
            <Chip
              label={
                tool.type === "native"
                  ? "Native tool"
                  : tool.type === "rest"
                  ? "REST tool"
                  : "SMTP tool"
              }
              size="small"
              sx={{
                backgroundColor: "rgba(33, 150, 243, 0.1)",
                color: "rgb(33, 150, 243)",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              maxWidth: "1540px",
              display: "flex",
              gap: "48px",
            }}
          >
            {/* Left Side - Documentation */}
            <Box
              sx={{
                flex: 1,

                flexDirection: "column",
                display: "flex",
                gap: "32px",
              }}
            >
              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {tool.description}
              </Typography>

              <Divider />

              {/* Parameters Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: "24px",
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  Parameters
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {toolDetail.parameters.map((param, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          mb: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="codeStrong">
                          {param.name}
                        </Typography>
                        <Typography
                          variant="code"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {param.type}
                          {param.items && `<${param.items}>`}
                        </Typography>
                        {param.required && (
                          <Chip
                            label="Required"
                            size="small"
                            sx={{
                              height: "20px",
                              fontSize: "11px",
                              backgroundColor: "rgba(244, 67, 54, 0.1)",
                              color: "rgb(244, 67, 54)",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "13px",
                          lineHeight: 1.5,
                          mb: "24px",
                        }}
                      >
                        {param.description}
                      </Typography>
                      {index < toolDetail.parameters.length - 1 && (
                        <Divider sx={{ mb: "24px" }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Right Side - Test Tool */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Top Section - Parameter Input */}
              <Box
                sx={{
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.neutral[300]}`,
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",

                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "36px",
                    px: "12px",
                    py: "12px",
                    backgroundColor: "#fafafa",
                    borderBottom: `1px solid ${theme.palette.neutral[300]}`,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.primary,
                      fontWeight: 400,
                    }}
                  >
                    Parameters
                  </Typography>
                </Box>

                {/* Parameters */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    p: "12px",
                    backgroundColor: "white",
                  }}
                >
                  {toolDetail.parameters.map((param) => (
                    <Box
                      key={param.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minHeight: "28px",
                      }}
                    >
                      <Chip
                        label={param.name}
                        size="small"
                        sx={{
                          height: "24px",
                          fontSize: "13px",
                          backgroundColor:
                            theme.palette.neutral[50],
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      />
                      <TextField
                        value={parameterValues[param.name] || ""}
                        onChange={(e) =>
                          handleParameterChange(param.name, e.target.value)
                        }
                        placeholder={param.example || ""}
                        size="small"
                        sx={{
                          flex: 1,
                          "& .MuiOutlinedInput-root": {
                            height: "28px",
                            fontSize: "13px",
                            backgroundColor: "transparent",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Run Button Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "12px",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={
                        isRunning ? (
                          <CircularProgress size={14} sx={{ color: "white" }} />
                        ) : (
                          <Play size={16} />
                        )
                      }
                      onClick={handleRunTool}
                      disabled={isRunning}
                      sx={{
                        height: "28px",
                        fontSize: "13px",
                        fontWeight: 500,
                        px: "12px",
                        py: 0,
                      }}
                    >
                      Test tool
                    </Button>
                    {hasChangedValues && (
                      <Button
                        variant="text"
                        onClick={handleResetDefaults}
                        sx={{
                          height: "28px",
                          fontSize: "13px",
                          fontWeight: 500,
                          px: "12px",
                          py: 0,
                          color: "inherit",
                          border: "none",
                          "&:hover": {
                            border: "none",
                          },
                          "&:focus": {
                            outline: "none",
                          },
                        }}
                      >
                        Reset values
                      </Button>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      width: "28px",
                      height: "28px",
                    }}
                  >
                    <Copy size={16} />
                  </IconButton>
                </Box>
              </Box>

              {/* Bottom Section - Response */}
              <Box
                sx={{
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.neutral[300]}`,
                  borderRadius: "6px",
                  height: "520px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "36px",
                    px: "12px",
                    py: "12px",
                    borderBottom: `1px solid ${theme.palette.neutral[300]}`,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {!isRunning && (
                      <Chip
                        label="200"
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "11px",
                          fontFamily: "monospace",
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          color: "rgb(34, 197, 94)",
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                        fontWeight: 400,
                      }}
                    >
                      Response
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{
                      width: "28px",
                      height: "28px",
                    }}
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </IconButton>
                </Box>

                {/* Code Content */}
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    px: "16px",
                    py: "8px",
                    display: "flex",
                    alignItems: isRunning ? "center" : "flex-start",
                    justifyContent: isRunning ? "center" : "flex-start",
                  }}
                >
                  {isRunning ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Box
                      component="pre"
                      sx={{
                        margin: 0,
                        fontFamily: "monospace",
                        fontSize: "13px",
                        lineHeight: "18px",
                        color: theme.palette.text.secondary,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {`{
  "id": "setatt_1ErTsH2eZvKYlo2CI7ukcoF7",
  "object": "setup_attempt",
  "application": null,
  "created": 1562004309,
  "customer": {
    "id": "cus_1234567890",
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    }
  },
  "flow_directions": [
    {
      "step": 1,
      "action": "verify_identity",
      "status": "completed",
      "timestamp": 1562004310
    },
    {
      "step": 2,
      "action": "collect_payment",
      "status": "completed",
      "timestamp": 1562004320
    },
    {
      "step": 3,
      "action": "confirm_setup",
      "status": "pending",
      "timestamp": null
    }
  ],
  "livemode": false,
  "on_behalf_of": null,
  "payment_method": "pm_1ErTsG2eZvKYlo2CH0DNen59",
  "payment_method_details": {
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025,
      "country": "US"
    }
  },
  "metadata": {
    "order_id": "order_12345",
    "user_id": "user_67890",
    "session_id": "sess_abcdef",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  "status": "succeeded",
  "amount": 10000,
  "currency": "usd",
  "description": "Setup payment for subscription",
  "receipt_email": "customer@example.com",
  "shipping": {
    "name": "John Doe",
    "address": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "phone": "+1234567890"
  },
  "items": [
    {
      "id": "item_1",
      "description": "Premium Subscription",
      "quantity": 1,
      "price": 10000,
      "currency": "usd"
    },
    {
      "id": "item_2",
      "description": "Setup Fee",
      "quantity": 1,
      "price": 0,
      "currency": "usd"
    }
  ],
  "discounts": [],
  "taxes": [
    {
      "rate": 0.08,
      "amount": 800,
      "description": "Sales Tax"
    }
  ],
  "total": 10800,
  "refunded": false,
  "refunded_amount": 0,
  "charge": "ch_1ErTsH2eZvKYlo2CI7ukcoF7",
  "invoice": "in_1ErTsH2eZvKYlo2CI7ukcoF7",
  "subscription": "sub_1ErTsH2eZvKYlo2CI7ukcoF7",
  "created_at": "2023-12-01T12:00:00Z",
  "updated_at": "2023-12-01T12:05:00Z"
`}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Edit Tool Modal */}
      <AddToolModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        toolToEdit={
          canEditOrRemove
            ? {
                id: tool.id,
                name: tool.name,
                description: tool.description,
                type: tool.type === "rest" ? "REST" : "SMTP",
              }
            : null
        }
      />

      {/* Add to MCP Servers Modal */}
      <AddToMcpServersModal
        open={isAddToMcpServersModalOpen}
        onClose={() => setIsAddToMcpServersModalOpen(false)}
        toolId={tool.id}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
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
          `Are you sure you want to remove "${tool.name}"? This action cannot be undone.`
        }
        confirmButtonText="Remove"
        requireConfirmationText={tool.name}
      />
    </Box>
  );
}
