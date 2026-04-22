"use client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  keyframes,
  Menu,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  Workflow,
  X,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import demoData from "./demo-data.json";
import { useTheme } from "@mui/material/styles";
import { EmptyState } from "../mcp-servers/components/empty-state";
import { EmptySearchState } from "./components/empty-search-state";
import { DeleteFlowDialog } from "./components/delete-flow-dialog";
import { FlowSettingsModal } from "./components/flow-settings-modal";
import { ItemTypeIcon } from "./components/item-type-icon";

// Extend ColumnMeta to include custom properties
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    flexible?: boolean; // If true, column takes remaining space
  }
}

interface AgentFlow {
  id: string;
  name: string;
  description: string;
  isDraft?: boolean;
  steps: number;
  scheduled: {
    total: number;
    active: number;
  };
  lastRun: {
    status: "success" | "failed" | "queue" | "running";
    text: string;
  };
  lastModified: string;
  creator: {
    initials: string;
    color: string;
  };
}

const columnHelper = createColumnHelper<AgentFlow>();

const pulse = keyframes`
  0%, 100% {
    background-color: #E3F2FD;
  }
  50% {
    background-color: #BBDEFB;
  }
`;

const generateDraftFlows = (): AgentFlow[] => {
  const baseDate = new Date();
  const owner = {
    initials: "CL",
    color: "#00796B",
  };

  return Array.from({ length: 10 }, (_, index) => ({
    id: `draft-flow-${index + 1}`,
    name: `Draft Flow ${index + 1}`,
    description: "Draft flow for internal iteration and review.",
    isDraft: true,
    steps: 2 + (index % 4),
    scheduled: {
      total: 0,
      active: 0,
    },
    lastRun: {
      status: "queue",
      text: "Not run",
    },
    lastModified: new Date(
      baseDate.getTime() - (index + 1) * 4 * 60 * 60 * 1000
    ).toISOString(),
    creator: owner,
  }));
};

function SearchParamsHandler({
  onDeleted,
}: {
  onDeleted: (flowName: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const deleted = searchParams.get("deleted");
    const flowName = searchParams.get("flowName");
    if (deleted === "true") {
      onDeleted(flowName);
      // Clean up URL by removing query params
      router.replace("/app/studio/flows");
    }
  }, [searchParams, router, onDeleted]);

  return null;
}

function AgentFlowsPageContent() {
  const [flows] = useState<AgentFlow[]>(demoData as AgentFlow[]);
  const [contentFilter, setContentFilter] = useState<"all" | "drafts">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemsToShow, setItemsToShow] = useState(15);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "lastModified",
      desc: true,
    },
  ]);
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFlowId, setMenuFlowId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<AgentFlow | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmptyVariant = searchParams.get("variant") === "empty";
  const draftFlows = useMemo(() => generateDraftFlows(), []);
  const allFlows = useMemo(
    () => (contentFilter === "drafts" ? draftFlows : flows),
    [contentFilter, draftFlows, flows]
  );
  const displayFlows = isEmptyVariant ? [] : allFlows;

  // Check for deleted query param to show toast
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDeleted = useCallback((flowName: string | null) => {
    setSnackbarMessage(
      flowName ? `Flow "${flowName}" has been deleted` : "Flow has been deleted"
    );
    setSnackbarOpen(true);
  }, []);

  // Handle scroll detection for back to top button
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollThreshold = 300; // Show button after scrolling 300px
      setShowBackToTop(scrollContainer.scrollTop > scrollThreshold);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    flowId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuFlowId(flowId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuFlowId(null);
  };

  const handleEdit = () => {
    if (menuFlowId) {
      router.push(`/app/studio/flows/${menuFlowId}`);
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate flow:", menuFlowId);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuFlowId) {
      const flow = flows.find((f) => f.id === menuFlowId);
      if (flow) {
        setFlowToDelete(flow);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (flowToDelete) {
      // TODO: Implement actual delete API call
      console.log("Deleting flow:", flowToDelete.id);
      // Show toast notification
      setSnackbarMessage(`Flow "${flowToDelete.name}" has been deleted`);
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setFlowToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFlowToDelete(null);
  };

  // Base cell styles applied to all table cells
  const baseCellStyles: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    textAlign: "left",
    fontSize: "13px",
    color: theme.palette.text.secondary,
  };

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Name",
          // No size specified - this column will take remaining space
          enableSorting: true,
          meta: {
            align: "left",
            flexible: true, // Mark as flexible column
          },
          cell: (info) => {
            const flow = info.row.original;
            return (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {/* Flow Icon */}
                <ItemTypeIcon type="Flow" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "4px",
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "500",
                        color: theme.palette.text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                      }}
                    >
                      {flow.name}
                    </span>
                    {flow.isDraft && (
                      <Chip
                        label="Draft"
                        size="small"
                        sx={{
                          height: "18px",
                          fontSize: "11px",
                          fontWeight: "500",
                          flexShrink: 0,
                          backgroundColor: theme.palette.neutral[200],
                          color: theme.palette.neutral[700],
                          "& .MuiChip-label": { px: "6px" },
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      color: theme.palette.text.secondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {flow.description}
                  </div>
                </div>
              </div>
            );
          },
        }),
        columnHelper.accessor("steps", {
          header: "Steps",
          size: 120,
          minSize: 120,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("scheduled", {
          header: "Scheduled",
          size: 120,
          minSize: 120,
          enableSorting: true,
          meta: {
            align: "left",
          },
          sortingFn: (rowA, rowB) => {
            return (
              rowA.original.scheduled.active - rowB.original.scheduled.active
            );
          },
          cell: (info) => {
            const scheduled = info.getValue();
            const { total, active } = scheduled;
            const hasActive = active > 0;
            const allActive = active === total && total > 0;

            // Green color for active
            const greenColor = theme.palette.teal[500];
            // Gray color for inactive
            const grayColor = theme.palette.text.disabled;

            const tooltipContent = (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: greenColor,
                      flexShrink: 0,
                    }}
                  />
                  <span>{active} active</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: grayColor,
                      flexShrink: 0,
                    }}
                  />
                  <span>{total} total</span>
                </Box>
              </Box>
            );

            return (
              <Tooltip
                title={tooltipContent}
                arrow
                placement="top"
                disableInteractive
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "default",
                  }}
                >
                  {/* Status dot */}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: hasActive ? greenColor : grayColor,
                      flexShrink: 0,
                    }}
                  />
                  {/* Count display */}
                  <span
                    style={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {allActive
                      ? // All active: just show total
                        total
                      : // Partial or none: show active/total
                        `${active}/${total}`}
                  </span>
                </div>
              </Tooltip>
            );
          },
        }),
        columnHelper.accessor("lastRun", {
          header: "Last run",
          size: 150,
          minSize: 150,
          enableSorting: false,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const lastRun = info.getValue();
            const statusConfig = {
              success: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#80CBC4",
              },
              failed: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#EF5350",
              },
              queue: {
                backgroundColor: "#F5F5F5",
                color: "#616161",
                dotColor: "#9E9E9E",
              },
              running: {
                backgroundColor: "#E3F2FD",
                color: "#1976D2",
                dotColor: "#42A5F5",
              },
            };
            const config = statusConfig[lastRun.status];
            return (
              <Chip
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: config.dotColor,
                        flexShrink: 0,
                      }}
                    />
                    <span>{lastRun.text}</span>
                  </Box>
                }
                size="small"
                sx={{
                  height: "20px",
                  fontSize: "12px",
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  ...(config.backgroundColor === "transparent" && {
                    border: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }),
                  ...(lastRun.status === "running" && {
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }),
                }}
              />
            );
          },
        }),
        columnHelper.accessor("lastModified", {
          header: "Last modified",
          size: 150,
          minSize: 150,
          enableSorting: true,
          meta: {
            align: "left",
          },
          sortingFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.lastModified).getTime();
            const dateB = new Date(rowB.original.lastModified).getTime();
            return dateA - dateB;
          },
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("creator", {
          header: "Creator",
          size: 96,
          minSize: 96,
          enableSorting: true,
          meta: {
            align: "left",
          },
          sortingFn: (rowA, rowB) => {
            return rowA.original.creator.initials.localeCompare(
              rowB.original.creator.initials
            );
          },
          cell: (info) => {
            const creator = info.getValue();
            return (
              <Avatar
                sx={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: creator.color,
                }}
              >
                {creator.initials}
              </Avatar>
            );
          },
        }),
        columnHelper.display({
          id: "actions",
          header: "",
          size: 52,
          minSize: 52,
          meta: {
            align: "left",
          },
          cell: ({ row }) => (
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, row.original.id)}
              sx={{
                margin: "0 auto",
                display: "block",
              }}
            >
              <MoreVertical size={18} />
            </IconButton>
          ),
        }),
      ] as ColumnDef<AgentFlow>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme tokens are stable
    []
  );

  // Calculate filtered flows (before pagination)
  const filteredFlows = useMemo(() => {
    let filtered = [...displayFlows];

    if (contentFilter === "drafts") {
      filtered = filtered.filter((flow) => flow.isDraft);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((flow) => {
        return (
          flow.name.toLowerCase().includes(searchLower) ||
          flow.description.toLowerCase().includes(searchLower) ||
          flow.creator.initials.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by creator if not "all"
    if (creatorFilter !== "all") {
      filtered = filtered.filter(() => {
        // Assuming "me" means current user - you may need to adjust this logic
        return creatorFilter === "me";
      });
    }

    // Filter by status if not "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter((flow) => {
        return flow.lastRun.status === statusFilter;
      });
    }

    return filtered;
  }, [displayFlows, contentFilter, searchTerm, creatorFilter, statusFilter]);

  const sortedAndDisplayedFlows = useMemo(() => {
    const filtered = [...filteredFlows];

    // Sort
    if (sorting.length > 0) {
      const sort = sorting[0];
      if (sort) {
        filtered.sort((a, b) => {
          let aValue: string | number;
          let bValue: string | number;

          switch (sort.id) {
            case "name": {
              aValue = a.name;
              bValue = b.name;
              return sort.desc
                ? String(bValue).localeCompare(String(aValue))
                : String(aValue).localeCompare(String(bValue));
            }
            case "steps": {
              aValue = a.steps;
              bValue = b.steps;
              return sort.desc ? bValue - aValue : aValue - bValue;
            }
            case "scheduled": {
              aValue = a.scheduled.active;
              bValue = b.scheduled.active;
              return sort.desc ? bValue - aValue : aValue - bValue;
            }
            case "lastRun": {
              const statusOrder = {
                success: 0,
                running: 1,
                queue: 2,
                failed: 3,
              };
              aValue = statusOrder[a.lastRun.status];
              bValue = statusOrder[b.lastRun.status];
              return sort.desc ? bValue - aValue : aValue - bValue;
            }
            case "lastModified": {
              aValue = new Date(a.lastModified).getTime();
              bValue = new Date(b.lastModified).getTime();
              return sort.desc ? bValue - aValue : aValue - bValue;
            }
            case "creator": {
              aValue = a.creator.initials;
              bValue = b.creator.initials;
              return sort.desc
                ? String(bValue).localeCompare(String(aValue))
                : String(aValue).localeCompare(String(bValue));
            }
            default:
              return 0;
          }
        });
      }
    }

    return filtered.slice(0, itemsToShow);
  }, [filteredFlows, sorting, itemsToShow]);

  // Check if any filter is active
  const isFilterActive =
    contentFilter !== "all" ||
    searchTerm.trim() !== "" ||
    creatorFilter !== "all" ||
    statusFilter !== "all";

  // Handle clear filters
  const handleClearFilters = () => {
    setContentFilter("all");
    setSearchTerm("");
    setCreatorFilter("all");
    setStatusFilter("all");
  };

  const table = useReactTable({
    data: sortedAndDisplayedFlows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 25);
  };

  const hasMoreItems = itemsToShow < filteredFlows.length;

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler onDeleted={handleDeleted} />
      </Suspense>
      <Box
        ref={scrollContainerRef}
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
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            p: "24px",

            pb: "4px",
            zIndex: 20,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h2">Flows</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => {
                const newId = crypto.randomUUID();
                router.push(`/app/studio/flows/${newId}`);
              }}
            >
              Create
            </Button>
          </Box>
        </Box>

        {displayFlows.length > 0 && (
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
            <ToggleButtonGroup
              value={contentFilter}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setContentFilter(newValue as "all" | "drafts");
                }
              }}
              size="small"
              sx={{
                backgroundColor: theme.palette.neutral[100],
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
                    backgroundColor: "#ffffff",
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
                      backgroundColor: theme.palette.neutral[100],
                    },
                  },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="drafts">Drafts</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              placeholder="Search flows"
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
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
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
                minWidth: "150px",
              }}
            >
              <MenuItem value="all">All creators</MenuItem>
              <MenuItem value="me">Me</MenuItem>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: "150px",
                ...(statusFilter !== "all" && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${theme.palette.primary.main} !important`,
                  },
                }),
              }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="success">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#80CBC4",
                      flexShrink: 0,
                    }}
                  />
                  <span>Success</span>
                </Box>
              </MenuItem>
              <MenuItem value="failed">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#EF5350",
                      flexShrink: 0,
                    }}
                  />
                  <span>Failed</span>
                </Box>
              </MenuItem>
              <MenuItem value="queue">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#9E9E9E",
                      flexShrink: 0,
                    }}
                  />
                  <span>Queue</span>
                </Box>
              </MenuItem>
              <MenuItem value="running">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#42A5F5",
                      flexShrink: 0,
                    }}
                  />
                  <span>Running</span>
                </Box>
              </MenuItem>
            </Select>

            {isFilterActive && (
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

            <Typography
              variant="body1"
              sx={{
                marginLeft: "auto",
                color: theme.palette.text.secondary,
              }}
            >
              {isFilterActive
                ? `${filteredFlows.length} of ${displayFlows.length} flows`
                : `${displayFlows.length} flows`}
            </Typography>
          </Box>
        )}

        {/* Table Section or Empty State */}
        {table.getRowModel().rows.length === 0 && searchTerm ? (
          <EmptySearchState
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
          />
        ) : table.getRowModel().rows.length === 0 ? (
          <Box sx={{ px: "24px" }}>
            <EmptyState
              icon={Workflow}
              title="No flows"
              description="Create a flow to orchestrate steps and automate work."
              button={
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => {
                    const newId = crypto.randomUUID();
                    router.push(`/app/studio/flows/${newId}`);
                  }}
                >
                  Create flow
                </Button>
              }
            />
          </Box>
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
              px: "24px",
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          ...(header.column.columnDef.meta?.flexible
                            ? {}
                            : {
                                width: `${header.column.getSize()}px`,
                                minWidth: `${header.column.getSize()}px`,
                                maxWidth: `${header.column.getSize()}px`,
                              }),
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                          userSelect: "none",
                          padding: "12px",
                          borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,

                          textAlign:
                            (header.column.columnDef.meta?.align as
                              | "left"
                              | "center"
                              | "right") || "left",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                        onMouseEnter={() =>
                          header.column.getCanSort() &&
                          setHoveredHeaderId(header.id)
                        }
                        onMouseLeave={() => setHoveredHeaderId(null)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              (header.column.columnDef.meta?.align as
                                | "left"
                                | "center"
                                | "right") === "center"
                                ? "center"
                                : "flex-start",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: theme.palette.text.secondary,
                            gap: "8px",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.getCanSort() &&
                            (header.column.getIsSorted() ? (
                              <>
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp size={16} />
                                ) : (
                                  <ArrowDown size={16} />
                                )}
                              </>
                            ) : (
                              hoveredHeaderId === header.id && (
                                <ArrowUpDown
                                  size={16}
                                  style={{ opacity: 0.5 }}
                                />
                              )
                            ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </Box>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const flow = row.original;
                  return (
                    <tr
                      key={row.id}
                      onClick={(e) => {
                        // Don't navigate if clicking on button or icon button
                        const target = e.target as HTMLElement;
                        if (
                          target.closest("button") ||
                          target.closest(".MuiIconButton-root")
                        ) {
                          return;
                        }
                        router.push(`/app/studio/flows/${flow.id}`);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            ...baseCellStyles,
                            ...(cell.column.columnDef.meta?.flexible
                              ? {}
                              : {
                                  width: `${cell.column.getSize()}px`,
                                  minWidth: `${cell.column.getSize()}px`,
                                  maxWidth: `${cell.column.getSize()}px`,
                                }),
                            ...(cell.column.columnDef.meta?.align && {
                              textAlign: cell.column.columnDef.meta.align as
                                | "left"
                                | "center"
                                | "right",
                            }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <DeleteFlowDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          flowName={flowToDelete?.name}
        />

        {/* Flow Settings Modal */}
        <FlowSettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
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

        {/* Load More Button */}
        {hasMoreItems && !searchTerm && (
          <Box
            sx={{
              p: "24px",
              pt: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              sx={{ width: "320px" }}
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          </Box>
        )}

        {/* Back to Top Button */}
        <Button
          onClick={scrollToTop}
          variant="contained"
          startIcon={<ArrowUp size={16} />}
          sx={{
            position: "fixed",
            bottom: "24px",
            right: "40px",
            boxShadow: "none",
            zIndex: 1000,
            opacity: showBackToTop ? 1 : 0,
            pointerEvents: showBackToTop ? "auto" : "none",
            //transform: showBackToTop ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.15s ease, transform 0.15s ease",
          }}
        >
          Back to top
        </Button>
      </Box>
    </>
  );
}

export default function AgentFlowsPage() {
  return (
    <Suspense fallback={null}>
      <AgentFlowsPageContent />
    </Suspense>
  );
}
