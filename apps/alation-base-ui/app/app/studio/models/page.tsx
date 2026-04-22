"use client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  Menu,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { EmptyState } from "../mcp-servers/components/empty-state";
import { EmptySearchState } from "./components/empty-search-state";
import {
  AddModelProviderModal,
  type ModelProvider,
  providerDisplayNames,
} from "./components/add-model-provider-modal";
import { EditModelCredentialsModal } from "./components/edit-model-credentials-modal";
import { ProviderIcon } from "./components/provider-icon";
import { DeleteConfirmationDialog } from "../flows/components/delete-flow-dialog";
import NavModelsIcon from "../assets/nav-models.svg";

interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  authorized: boolean;
  modelsCount: number;
  createdAt: string;
}

// Mock data for models
const generateMockModels = (): Model[] => {
  const baseDate = new Date();
  const models: Model[] = [
    {
      id: "1",
      name: "My OpenAI Account",
      provider: "openai",
      authorized: true,
      modelsCount: 5,
      createdAt: new Date(
        baseDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "2",
      name: "Production Anthropic",
      provider: "anthropic",
      authorized: false,
      modelsCount: 3,
      createdAt: new Date(
        baseDate.getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "3",
      name: "My AWS Bedrock",
      provider: "aws-bedrock",
      authorized: true,
      modelsCount: 8,
      createdAt: new Date(
        baseDate.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "4",
      name: "Azure Dev Environment",
      provider: "azure-openai",
      authorized: true,
      modelsCount: 4,
      createdAt: new Date(
        baseDate.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "5",
      name: "GCP Vertex Production",
      provider: "google",
      authorized: false,
      modelsCount: 6,
      createdAt: new Date(
        baseDate.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];
  return models;
};

type SortField = "name" | "authorized" | "modelsCount" | "createdAt" | null;
type SortDirection = "asc" | "desc";

function ModelsPageContent() {
  const searchParams = useSearchParams();
  const [models, setModels] = useState<Model[]>(generateMockModels());
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState<
    "all" | ModelProvider
  >("all");
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [isEditCredentialsModalOpen, setIsEditCredentialsModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<Model | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();
  const isEmptyVariant = searchParams.get("variant") === "empty";
  const displayModels = isEmptyVariant ? [] : models;

  // Check if any filter is active
  const hasActiveFilters = searchTerm.trim() !== "" || providerFilter !== "all";

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setProviderFilter("all");
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

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    // First filter by provider
    let filtered = [...displayModels];
    if (providerFilter !== "all") {
      filtered = filtered.filter((model) => model.provider === providerFilter);
    }

    // Then filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(lowerSearch) ||
          model.provider.toLowerCase().includes(lowerSearch)
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
          case "authorized": {
            aValue = a.authorized ? 1 : 0;
            bValue = b.authorized ? 1 : 0;
            return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
          }
          case "modelsCount": {
            aValue = a.modelsCount;
            bValue = b.modelsCount;
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
  }, [displayModels, sortField, sortDirection, searchTerm, providerFilter]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    modelId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedModelId(modelId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedModelId(null);
  };

  const handleRemove = () => {
    if (selectedModelId) {
      const model = models.find((m) => m.id === selectedModelId);
      if (model) {
        setModelToDelete(model);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  const handleConfirmRemove = () => {
    if (modelToDelete) {
      setModels((prev) =>
        prev.filter((model) => model.id !== modelToDelete.id)
      );
    }
    setDeleteDialogOpen(false);
    setModelToDelete(null);
  };

  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
    setModelToDelete(null);
  };

  const handleRowClick = (model: Model, e: React.MouseEvent<HTMLTableRowElement>) => {
    // Don't navigate if clicking on button or icon button
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".MuiIconButton-root")
    ) {
      return;
    }
    // Open edit credentials modal
    setModelToEdit(model);
    setIsEditCredentialsModalOpen(true);
  };

  const handleSaveCredentials = (modelId: string, credentials: { name: string; apiKey: string; description?: string }) => {
    // In a real app, you would save the credentials to the backend here
    // For now, we'll update the name and authorized status
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId
          ? { 
              ...model, 
              name: credentials.name,
              authorized: credentials.apiKey.trim().length > 0 
            }
          : model
      )
    );

    // Show success toast
    setSnackbarMessage(
      `Credentials for "${credentials.name}" have been updated`
    );
    setSnackbarOpen(true);
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
          pb: "4px",
          zIndex: 20,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">Models</Typography>
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
        {displayModels.length > 0 && (
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
              placeholder="Search models"
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
              value={providerFilter}
              onChange={(e) =>
                setProviderFilter(e.target.value as "all" | ModelProvider)
              }
              size="small"
              sx={{
                minWidth: "150px",
                ...(providerFilter !== "all" && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                }),
              }}
            >
              <MenuItem value="all">All providers</MenuItem>
              <MenuItem value="openai">OpenAI</MenuItem>
              <MenuItem value="anthropic">Anthropic</MenuItem>
              <MenuItem value="aws-bedrock">AWS Bedrock</MenuItem>
              <MenuItem value="azure-openai">Azure OpenAI</MenuItem>
              <MenuItem value="google">Google</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
              <MenuItem value="custom-no-models">
                {providerDisplayNames["custom-no-models"]}
              </MenuItem>
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
                onClick={() => setIsAddProviderModalOpen(true)}
              >
                Add model provider
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
            pt: displayModels.length > 0 ? 0 : "24px",
          }}
        >
          {filteredAndSortedModels.length === 0 && searchTerm ? (
            <EmptySearchState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : filteredAndSortedModels.length === 0 ? (
            <EmptyState
              icon={NavModelsIcon}
              title="No models"
              description="Available models will appear here once they are added."
              button={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsAddProviderModalOpen(true)}
                >
                  Add model provider
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
                        width: "120px",
                        minWidth: "120px",
                        maxWidth: "120px",
                      }}
                      onClick={() => handleSort("authorized")}
                      onMouseEnter={() => setHoveredHeaderId("authorized")}
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
                        Provider
                        {sortField === "authorized" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "authorized" && (
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
                      onClick={() => handleSort("modelsCount")}
                      onMouseEnter={() => setHoveredHeaderId("modelsCount")}
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
                        Models
                        {sortField === "modelsCount" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          hoveredHeaderId === "modelsCount" && (
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
                        width: "48px",
                      }}
                    ></th>
                  </tr>
                </Box>
                <tbody>
                  {filteredAndSortedModels.map((model) => (
                    <tr
                      key={model.id}
                      onClick={(e) => handleRowClick(model, e)}
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
                          <ProviderIcon provider={model.provider} size={28} />
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
                              {model.name}
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
                          width: "120px",
                          minWidth: "120px",
                          maxWidth: "120px",
                        }}
                      >
                        <Chip
                          label={providerDisplayNames[model.provider]}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor:
                              theme.palette.neutral[100],
                            color: theme.palette.text.primary,
                          }}
                        />
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
                        {model.modelsCount}
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
                        {new Date(model.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, model.id)}
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

      {/* Add Model Provider Modal */}
      <AddModelProviderModal
        open={isAddProviderModalOpen}
        onClose={() => setIsAddProviderModalOpen(false)}
        onSave={(providerData) => {
          // Add new provider to models list
          const newModel: Model = {
            id: crypto.randomUUID(),
            name: providerData.name,
            provider: providerData.provider,
            authorized: false, // New providers start as not authorized
            modelsCount: 0, // New providers start with 0 models
            createdAt: new Date().toISOString(),
          };
          setModels((prev) => [...prev, newModel]);
          setIsAddProviderModalOpen(false);

          // Show success toast
          setSnackbarMessage(
            `Model provider "${providerData.name}" has been added`
          );
          setSnackbarOpen(true);
        }}
      />

      {/* Edit Model Credentials Modal */}
      <EditModelCredentialsModal
        open={isEditCredentialsModalOpen}
        onClose={() => {
          setIsEditCredentialsModalOpen(false);
          setModelToEdit(null);
        }}
        model={modelToEdit}
        onSave={handleSaveCredentials}
        onDelete={(modelId) => {
          setModels((prev) => prev.filter((model) => model.id !== modelId));
          setIsEditCredentialsModalOpen(false);
          setModelToEdit(null);
        }}
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
        title="Remove model provider?"
        description={
          modelToDelete
            ? `Are you sure you want to remove "${modelToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to remove this model provider? This action cannot be undone."
        }
        confirmButtonText="Remove"
      />

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle2 size={20} />}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={null}>
      <ModelsPageContent />
    </Suspense>
  );
}
