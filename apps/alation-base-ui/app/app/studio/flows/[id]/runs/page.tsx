"use client";
import { Box, Typography, Chip, keyframes, IconButton } from "@mui/material";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Calendar,
  Play,
  Code,
  X,
} from "lucide-react";

// Extend ColumnMeta to include custom properties
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    flexible?: boolean;
  }
}

interface RunHistoryItem {
  id: string;
  runAt: string;
  status: "success" | "failed" | "queue";
  type: "scheduled" | "manual" | "api";
  toolCalls: number;
  durationMs: number;
}

// Demo data for run history
const demoRunHistory: RunHistoryItem[] = [
  {
    id: "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789",
    runAt: "Dec 29, 2024 10:30 AM",
    status: "success",
    type: "scheduled",
    toolCalls: 12,
    durationMs: 135000,
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890",
    runAt: "Dec 29, 2024 09:15 AM",
    status: "success",
    type: "manual",
    toolCalls: 8,
    durationMs: 82000,
  },
  {
    id: "c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901",
    runAt: "Dec 28, 2024 11:45 PM",
    status: "failed",
    type: "api",
    toolCalls: 3,
    durationMs: 45000,
  },
  {
    id: "d4e5f6a7-b8c9-4012-d345-e6f7a8b9c012",
    runAt: "Dec 28, 2024 06:00 PM",
    status: "success",
    type: "scheduled",
    toolCalls: 15,
    durationMs: 198000,
  },
  {
    id: "e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123",
    runAt: "Dec 28, 2024 03:30 PM",
    status: "queue",
    type: "manual",
    toolCalls: 0,
    durationMs: 0,
  },
  {
    id: "f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234",
    runAt: "Dec 28, 2024 12:00 PM",
    status: "success",
    type: "scheduled",
    toolCalls: 6,
    durationMs: 67000,
  },
  {
    id: "a7b8c9d0-e1f2-4345-a678-b9c0d1e2f345",
    runAt: "Dec 27, 2024 09:00 AM",
    status: "failed",
    type: "api",
    toolCalls: 2,
    durationMs: 23000,
  },
  {
    id: "b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456",
    runAt: "Dec 27, 2024 06:00 AM",
    status: "success",
    type: "scheduled",
    toolCalls: 10,
    durationMs: 112000,
  },
  {
    id: "c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567",
    runAt: "Dec 26, 2024 10:30 PM",
    status: "success",
    type: "manual",
    toolCalls: 4,
    durationMs: 58000,
  },
  {
    id: "d0e1f2a3-b4c5-4678-d901-e2f3a4b5c678",
    runAt: "Dec 26, 2024 02:15 PM",
    status: "success",
    type: "scheduled",
    toolCalls: 7,
    durationMs: 91000,
  },
];

const columnHelper = createColumnHelper<RunHistoryItem>();

const pulse = keyframes`
  0%, 100% {
    background-color: #F5F5F5;
  }
  50% {
    background-color: #EEEEEE;
  }
`;

export default function RunsPage() {
  const [runs] = useState<RunHistoryItem[]>(demoRunHistory);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [selectedRun, setSelectedRun] = useState<RunHistoryItem | null>(null);
  const theme = useTheme();

  // Base cell styles applied to all table cells
  const baseCellStyles: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    textAlign: "left",
    fontSize: "13px",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const columns = useMemo(
    () =>
      [
        /* ID Column */
        columnHelper.accessor("id", {
          header: "ID",
          size: 150,
          minSize: 150,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {info.getValue()}
            </Typography>
          ),
        }),
        /* Run At Column */
        columnHelper.accessor("runAt", {
          header: "Run at",
          enableSorting: true,
          meta: {
            align: "left",
            flexible: true,
          },
          cell: (info) => info.getValue(),
        }),
        /* Status Column */
        columnHelper.accessor("status", {
          header: "Status",
          size: 120,
          minSize: 120,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const status = info.getValue();
            const statusConfig = {
              success: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#80CBC4",
                label: "Success",
              },
              failed: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#EF5350",
                label: "Failed",
              },
              queue: {
                backgroundColor: "#F5F5F5",
                color: "#616161",
                dotColor: "#9E9E9E",
                label: "Queue",
              },
            };
            const config = statusConfig[status];
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
                        ...(status === "queue" && {
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }),
                      }}
                    />
                    <span>{config.label}</span>
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
                }}
              />
            );
          },
        }),
        /* Trigger Column */
        columnHelper.accessor("type", {
          header: "Trigger",
          size: 140,
          minSize: 140,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const type = info.getValue();
            const typeConfig = {
              scheduled: {
                icon: Calendar,
                label: "Scheduled",
                backgroundColor: "#E3F2FD",
                color: "#1976D2",
              },
              manual: {
                icon: Play,
                label: "Manual",
                backgroundColor: "#F5F5F5",
                color: "#616161",
              },
              api: {
                icon: Code,
                label: "API call",
                backgroundColor: "#FFF3E0",
                color: "#E65100",
              },
            };
            const config = typeConfig[type];
            const IconComponent = config.icon;
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
                    <IconComponent size={14} />
                    <span>{config.label}</span>
                  </Box>
                }
                size="small"
                sx={{
                  height: "20px",
                  fontSize: "12px",
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  border: "none",
                  "&:hover": {
                    backgroundColor: config.backgroundColor,
                  },
                }}
              />
            );
          },
        }),
        /* Tool calls Column */
        columnHelper.accessor("toolCalls", {
          header: "Tool calls",
          size: 100,
          minSize: 100,
          enableSorting: true,
          meta: {
            align: "right",
          },
          cell: (info) => (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {info.getValue()}
            </Typography>
          ),
        }),
        /* Duration Column */
        columnHelper.accessor("durationMs", {
          header: "Duration",
          size: 100,
          minSize: 100,
          enableSorting: true,
          meta: {
            align: "right",
          },
          cell: (info) => {
            const ms = info.getValue();
            if (ms === 0) return "—";
            const seconds = Math.floor(ms / 1000) % 60;
            const minutes = Math.floor(ms / 60000);
            const parts = [];
            if (minutes > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);
            return (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {parts.join(" ")}
              </Typography>
            );
          },
        }),
      ] as ColumnDef<RunHistoryItem>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: runs,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        overflow: "hidden",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          backgroundColor: "white",
          transition: `margin-right ${"150ms"}`,
          marginRight: selectedRun ? "400px" : "0",
        }}
      >
        {/* Runs Count */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: "24px",
            py: "16px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {runs.length} runs
          </Typography>
        </Box>

        {/* Table Section */}
        <Box
          sx={{
            px: "24px",
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
            }}
          >
            {/* Table Header */}
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
                              <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                            )
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </Box>
            {/* Table Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const run = row.original;
                return (
                  <tr key={row.id} onClick={() => setSelectedRun(run)}>
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
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Box>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Slide-in Right Panel */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "400px",
          backgroundColor: "#ffffff",
          borderLeft: `1px solid ${theme.palette.neutral[300]}`,
          display: "flex",
          flexDirection: "column",
          transform: selectedRun ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${"150ms"}`,
          zIndex: 100,
        }}
      >
        {/* Panel Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "20px",
          }}
        >
          <Typography variant="subtitle1">Run Details</Typography>
          <IconButton size="small" onClick={() => setSelectedRun(null)}>
            <X size={16} />
          </IconButton>
        </Box>

        {/* Panel Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: "20px",
          }}
        >
          {/* Empty content for now */}
        </Box>
      </Box>
    </Box>
  );
}
