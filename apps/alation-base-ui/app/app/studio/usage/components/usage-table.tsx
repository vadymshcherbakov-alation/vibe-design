"use client";
import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";

// Extend ColumnMeta to include custom properties
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    flexible?: boolean;
  }
}

export interface UsageMetric {
  metric_name: string;
  metric_type: "agent" | "tool" | "action";
  protocol: "http" | "mcp";
  totalCount: number;
  uniqueRequests: number;
  lastUsed: string | null;
}

const columnHelper = createColumnHelper<UsageMetric>();

interface UsageTableProps {
  data: UsageMetric[];
}

export function UsageTable({ data }: UsageTableProps) {
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "totalCount",
      desc: true,
    },
  ]);
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);

  const getItemTypeIconType = (type: string): "Tool" | "Agent" => {
    if (type === "agent") {
      return "Agent";
    }
    // For "tool" and "action", use "Tool"
    return "Tool";
  };

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("metric_name", {
          header: "Tool name",
          enableSorting: true,
          meta: {
            align: "left",
            flexible: true,
          },
          cell: (info) => {
            const metric = info.row.original;
            return (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <ItemTypeIcon
                  type={getItemTypeIconType(metric.metric_type)}
                  size={28}
                />
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
                    {metric.metric_name}
                  </div>
                </div>
              </div>
            );
          },
        }),
        columnHelper.accessor("protocol", {
          header: "Protocol",
          size: 100,
          minSize: 100,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const protocol = info.getValue();
            const getChipColor = () => {
              if (protocol === "http") {
                return {
                  backgroundColor: theme.palette.blue[200],
                  color: theme.palette.blue[600],
                };
              } else {
                // mcp
                return {
                  backgroundColor: theme.palette.purple[200],
                  color: theme.palette.purple[600],
                };
              }
            };
            const chipColors = getChipColor();
            return (
              <Chip
                label={protocol.toUpperCase()}
                size="small"
                sx={{
                  height: "24px",
                  fontSize: "12px",
                  backgroundColor: chipColors.backgroundColor,
                  color: chipColors.color,
                  fontWeight: 500,
                }}
              />
            );
          },
        }),
        columnHelper.accessor("totalCount", {
          header: "Total count",
          size: 120,
          minSize: 120,
          enableSorting: true,
          meta: {
            align: "right",
          },
          cell: (info) => (
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              {info.getValue().toLocaleString()}
            </Typography>
          ),
        }),
        columnHelper.accessor("uniqueRequests", {
          header: "Unique requests",
          size: 140,
          minSize: 140,
          enableSorting: true,
          meta: {
            align: "right",
          },
          cell: (info) => (
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              {info.getValue().toLocaleString()}
            </Typography>
          ),
        }),
        columnHelper.accessor("lastUsed", {
          header: "Last used",
          size: 200,
          minSize: 200,
          enableSorting: true,
          meta: {
            align: "left",
          },
          sortingFn: (rowA, rowB) => {
            const dateA = rowA.original.lastUsed
              ? new Date(rowA.original.lastUsed).getTime()
              : 0;
            const dateB = rowB.original.lastUsed
              ? new Date(rowB.original.lastUsed).getTime()
              : 0;
            return dateA - dateB;
          },
          cell: (info) => {
            const lastUsed = info.getValue();
            if (!lastUsed) return <span>-</span>;
            // Format timestamp based on length:
            // Hour: 2025121814 (10 chars) -> Dec 18, 2025, 14:00:00
            // Day: 20251218 (8 chars) -> Dec 18, 2025, 00:00:00
            // Month: 202512 (6 chars) -> Dec 2025
            try {
              const year = lastUsed.substring(0, 4);
              const month = lastUsed.substring(4, 6);
              
              if (lastUsed.length === 6) {
                // Month format
                const date = new Date(`${year}-${month}-01`);
                return (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                );
              }
              
              const day = lastUsed.substring(6, 8);
              const hour = lastUsed.length >= 10 ? lastUsed.substring(8, 10) : "00";
              const date = new Date(`${year}-${month}-${day}T${hour}:00:00`);
              
              return (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}, {date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </Typography>
              );
            } catch {
              return <span>-</span>;
            }
          },
        }),
      ] as ColumnDef<UsageMetric>[],
    [theme]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const baseCellStyles: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    textAlign: "left",
    fontSize: "13px",
    color: theme.palette.text.secondary,
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        pr: "24px",
        overflowX: "hidden",
        border: `1px solid ${theme.palette.neutral[300]}`,
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
        <Box
          component="thead"
          sx={{
            backgroundColor: "#ffffff",
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
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                    padding: "12px",
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textAlign:
                      (header.column.columnDef.meta?.align as
                        | "left"
                        | "center"
                        | "right") || "left",
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                  onMouseEnter={() =>
                    header.column.getCanSort() && setHoveredHeaderId(header.id)
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
