"use client";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react";
import { useState, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
}

export interface SettingsSingleTablePageProps<T> {
  // Page header
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
  pageActions?: PageAction[];
  showMoreMenu?: boolean;
  onMoreMenuClick?: () => void;

  // Table section
  tableTitle: string;
  tableDescription?: string;
  tableLevelAction?: {
    label: string;
    onClick: () => void;
  };

  // Table data
  columns: ColumnDef<T, any>[];
  data: T[];
  rowActions?: RowAction<T>[];

  // Row click
  onRowClick?: (row: T) => void;

  // Search
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
}

function RowActionsCell<T>({
  row,
  rowActions,
}: {
  row: T;
  rowActions: RowAction<T>[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          padding: "4px",
          color: "text.secondary",
        }}
      >
        <MoreVertical size={16} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: { mt: "4px" },
          },
        }}
      >
        {rowActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick(row);
              setAnchorEl(null);
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export function SettingsSingleTablePage<T>({
  pageTitle,
  breadcrumbs,
  pageActions = [],
  showMoreMenu = false,
  onMoreMenuClick,
  tableTitle,
  tableDescription,
  tableLevelAction,
  columns: baseColumns,
  data,
  onRowClick,
  rowActions = [],
  searchPlaceholder = "Search...",
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
}: SettingsSingleTablePageProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Add actions column if row actions are provided
  const columns = rowActions.length > 0
    ? [
        ...baseColumns,
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <RowActionsCell row={row.original} rowActions={rowActions} />
          ),
          enableSorting: false,
          size: 100,
        } as ColumnDef<T, any>,
      ]
    : baseColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {breadcrumbs.map((crumb, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {index > 0 && (
                <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>
                  &gt;
                </Typography>
              )}
              <Typography
                sx={{
                  color: index === breadcrumbs.length - 1 ? "text.primary" : "text.secondary",
                  fontSize: "14px",
                  fontWeight: index === breadcrumbs.length - 1 ? 500 : 400,
                }}
              >
                {crumb.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            pb: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h1"
          >
            {pageTitle}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {pageActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === "primary" ? "contained" : "outlined"}
                onClick={action.onClick}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {action.label}
              </Button>
            ))}
            {showMoreMenu && (
              <IconButton onClick={onMoreMenuClick} size="small">
                <MoreVertical size={20} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Table Section */}
        <Box>
          {/* Table Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  mb: 0.5,
                }}
              >
                {tableTitle}
              </Typography>
              {tableDescription && (
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "14px",
                  }}
                >
                  {tableDescription}
                </Typography>
              )}
            </Box>

            {tableLevelAction && (
              <Button
                variant="outlined"
                onClick={tableLevelAction.onClick}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {tableLevelAction.label}
              </Button>
            )}
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          {/* Table */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                "& thead": {
                  backgroundColor: "grey.50",
                },
                "& th": {
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "text.primary",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& td": {
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "text.primary",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& tbody tr:last-child td": {
                  borderBottom: "none",
                },
                "& tbody tr:hover": {
                  backgroundColor: "grey.50",
                },
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    style={onRowClick ? { cursor: "pointer" } : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                Show Rows
              </Typography>
              <FormControl size="small">
                <Select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  sx={{
                    fontSize: "14px",
                    "& .MuiSelect-select": {
                      padding: "4px 8px",
                    },
                  }}
                >
                  {pageSizeOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  size="small"
                >
                  <ChevronsLeft size={16} />
                </IconButton>
                <IconButton
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  size="small"
                >
                  <ChevronLeft size={16} />
                </IconButton>
                <IconButton
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  size="small"
                >
                  <ChevronRight size={16} />
                </IconButton>
                <IconButton
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  size="small"
                >
                  <ChevronsRight size={16} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}
