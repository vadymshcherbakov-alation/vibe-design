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
  Checkbox,
  Chip,
  keyframes,
  Menu,
} from "@mui/material";
import {
  Search,
  Calendar,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  Workflow,
  X,
  Trash2,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import demoData from "../flows/demo-data.json";
import { useTheme } from "@mui/material/styles";
import { EmptySearchState } from "../flows/components/empty-search-state";

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

export default function AgentFlowsLandingPage() {
  const [flows] = useState<AgentFlow[]>(demoData as AgentFlow[]);
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFlowId, setMenuFlowId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const router = useRouter();

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
    // TODO: Implement delete functionality
    console.log("Delete flow:", menuFlowId);
    handleMenuClose();
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
        columnHelper.display({
          id: "select",
          header: ({ table }) => {
            const displayedFlows = table
              .getRowModel()
              .rows.map((row) => row.original);
            const allSelected =
              displayedFlows.length > 0 &&
              displayedFlows.every((flow) => selectedRows.has(flow.id));
            const someSelected =
              displayedFlows.some((flow) => selectedRows.has(flow.id)) &&
              !allSelected;

            const handleSelectAll = (checked: boolean) => {
              const newSelected = new Set(selectedRows);
              if (checked) {
                displayedFlows.forEach((flow) => newSelected.add(flow.id));
              } else {
                displayedFlows.forEach((flow) => newSelected.delete(flow.id));
              }
              setSelectedRows(newSelected);
            };

            return (
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                size="small"
              />
            );
          },
          size: 32,
          minSize: 32,

          cell: ({ row }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "32px",
              }}
            >
              <Checkbox
                checked={selectedRows.has(row.original.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedRows);
                  if (e.target.checked) {
                    newSelected.add(row.original.id);
                  } else {
                    newSelected.delete(row.original.id);
                  }
                  setSelectedRows(newSelected);
                }}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ),
        }),
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
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    backgroundColor: theme.palette.teal[200],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Workflow
                    size={20}
                    style={{ color: theme.palette.teal[600] }}
                  />
                </div>
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
                    {flow.name}
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
          cell: (info) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Calendar size={16} style={{ color: "#666" }} />
              <span>{info.getValue().total}</span>
            </div>
          ),
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
    [selectedRows]
  );

  const sortedAndDisplayedFlows = useMemo(() => {
    // First, filter by search term
    let filtered = [...flows];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = flows.filter((flow) => {
        return (
          flow.name.toLowerCase().includes(searchLower) ||
          flow.description.toLowerCase().includes(searchLower) ||
          flow.creator.initials.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by creator if not "all"
    if (creatorFilter !== "all") {
      filtered = filtered.filter((flow) => {
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

    // Then sort
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
              aValue = a.scheduled.total;
              bValue = b.scheduled.total;
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
  }, [flows, searchTerm, creatorFilter, statusFilter, sorting, itemsToShow]);

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

  const hasMoreItems = itemsToShow < flows.length;

  return (
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
          pl: "32px",
          pb: "4px",
          zIndex: 20,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h2">flows</Typography>

        <Button variant="contained" startIcon={<Plus size={16} />}>
          Create
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "24px",
          pl: "32px",
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

        {selectedRows.size > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setSelectedRows(new Set())}
              endIcon={<X size={16} />}
            >
              {selectedRows.size} selected
            </Button>
            <IconButton
              color="error"
              onClick={() => setSelectedRows(new Set())}
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Table Section or Empty State */}
      {table.getRowModel().rows.length === 0 && searchTerm ? (
        <EmptySearchState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
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
              // Hide checkbox by default, show if any row is selected
              "& td:first-of-type .MuiCheckbox-root": {
                opacity: selectedRows.size > 0 ? 1 : 0,
              },
              // Show checkbox on row hover
              "&:hover td:first-of-type .MuiCheckbox-root": {
                opacity: 1,
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
            // Hide header checkbox by default, show only when rows are selected
            "& table thead": {
              "& th:first-of-type .MuiCheckbox-root": {
                opacity: selectedRows.size > 0 ? 1 : 0,
              },
            },
            pr: "24px",
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
                  left: "32px",
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

                        ...(header.column.id === "select" && {
                          paddingLeft: "0",
                          paddingRight: "0",
                          borderTop: "none",
                          borderBottom: "none",
                        }),
                        ...(header.column.id !== "select" && {
                          borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }),

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
                          ...(header.column.id === "select" && {
                            gap: "0",
                            width: "100%",
                            justifyContent: "flex-end",
                          }),
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
                              <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                            )
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </Box>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const isLastRow =
                  rowIndex === table.getRowModel().rows.length - 1;
                const flow = row.original;
                return (
                  <tr
                    key={row.id}
                    onClick={(e) => {
                      // Don't navigate if clicking on checkbox, button, or icon button
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("input[type='checkbox']") ||
                        target.closest("button") ||
                        target.closest(".MuiCheckbox-root") ||
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
                          ...(cell.column.id === "select" && {
                            paddingLeft: "0",
                            paddingRight: "0",
                            borderBottom: "none",
                          }),
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
  );
}
