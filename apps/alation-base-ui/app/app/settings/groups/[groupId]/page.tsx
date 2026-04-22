"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Menu,
  FormControl,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { getGroupById, GroupMember } from "../group-data";

type TabValue = "members" | "object-references" | "article-references";

const objectReferences = [
  {
    id: 1,
    name: "A",
    objectType: "Data Source",
    description: "Primary analytics source",
  },
  {
    id: 2,
    name: "AAA Jira datasource",
    objectType: "Data Source",
    description: "Jira integration datasource",
  },
  {
    id: 3,
    name: "Alation Analytics",
    objectType: "Data Source",
    description: "Alation internal analytics",
  },
  {
    id: 4,
    name: "Alation_EDW GBQ Retail & Technology",
    objectType: "Data Source",
    description: "Google BigQuery retail dataset",
  },
  {
    id: 5,
    name: "Alation_EDW Redshift Healthcare & Insurance",
    objectType: "Data Source",
    description: "Redshift healthcare dataset",
  },
  {
    id: 6,
    name: "Agent Smoke Check Snowflake",
    objectType: "Data Source",
    description: "Snowflake test datasource",
  },
  {
    id: 7,
    name: "Ammar Snowflake",
    objectType: "Data Source",
    description: "Ammar's Snowflake instance",
  },
];

const articleReferences = [
  {
    id: 1,
    name: "Alation Analytics ERD",
    articleType: "Documentation",
    lastUpdated: "2024-12-15",
  },
  {
    id: 2,
    name: "Introduction to Alation Analytics",
    articleType: "Guide",
    lastUpdated: "2024-11-20",
  },
  {
    id: 3,
    name: "Determining Popularity Using Alation Analytics",
    articleType: "Guide",
    lastUpdated: "2024-10-08",
  },
];

function getInitials(name: string): string {
  const parts = name.split(/[\s@]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "#1976d2",
    "#388e3c",
    "#d32f2f",
    "#7b1fa2",
    "#f57c00",
    "#0097a7",
    "#5d4037",
    "#455a64",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const theme = useTheme();
  const group = getGroupById(resolvedParams.groupId);
  const [activeTab, setActiveTab] = useState<TabValue>("members");
  const [memberFilter, setMemberFilter] = useState("");
  const [objectFilter, setObjectFilter] = useState("");
  const [articleFilter, setArticleFilter] = useState("");

  if (!group) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Group not found.</Typography>
        <Button onClick={() => router.push("/app/settings/groups")}>
          Back to Groups
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {[
            { label: "User Management" },
            {
              label: "Groups",
              onClick: () => router.push("/app/settings/groups"),
            },
            { label: group.name },
          ].map((crumb, index, arr) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {index > 0 && (
                <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>
                  &gt;
                </Typography>
              )}
              <Typography
                onClick={crumb.onClick}
                sx={{
                  color:
                    index === arr.length - 1 ? "text.primary" : "text.secondary",
                  fontSize: "14px",
                  fontWeight: index === arr.length - 1 ? 500 : 400,
                  cursor: crumb.onClick ? "pointer" : "default",
                  "&:hover": crumb.onClick
                    ? { textDecoration: "underline" }
                    : {},
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
            mb: 0,
            pb: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, fontSize: "28px" }}
            >
              {group.name}
            </Typography>
            <Chip
              label={group.type}
              color={group.type === "Built-in" ? "secondary" : "primary"}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => console.log("Add member")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            Add Member
          </Button>
        </Box>

        {group.description && (
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "14px",
              mt: 1,
              mb: 2,
            }}
          >
            {group.description}
          </Typography>
        )}

        {/* Tabs */}
        <Box
          sx={{
            position: "relative",
            mt: 2,
            mb: 3,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              backgroundColor: theme.palette.neutral[300],
              zIndex: 1,
            },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            aria-label="group detail tabs"
            sx={{
              "& .MuiTabs-indicator": { zIndex: 2 },
              "& .MuiTabs-flexContainer": { paddingLeft: 0 },
            }}
          >
            <Tab label="Members" value="members" />
            <Tab label="Object References" value="object-references" />
            <Tab label="Article References" value="article-references" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === "members" && (
          <MembersTab
            members={group.members}
            filter={memberFilter}
            onFilterChange={setMemberFilter}
          />
        )}
        {activeTab === "object-references" && (
          <ObjectReferencesTab
            references={objectReferences}
            filter={objectFilter}
            onFilterChange={setObjectFilter}
          />
        )}
        {activeTab === "article-references" && (
          <ArticleReferencesTab
            references={articleReferences}
            filter={articleFilter}
            onFilterChange={setArticleFilter}
          />
        )}
      </Box>
    </Box>
  );
}

function MemberActionsCell({ member }: { member: GroupMember }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        sx={{ padding: "4px", color: "text.secondary" }}
      >
        <MoreVertical size={16} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: "4px" } } }}
      >
        <MenuItem onClick={() => { console.log("Edit", member); setAnchorEl(null); }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { console.log("Change role", member); setAnchorEl(null); }}>
          Change Role
        </MenuItem>
        <MenuItem
          onClick={() => { console.log("Remove", member); setAnchorEl(null); }}
          sx={{ color: "error.main" }}
        >
          Remove from Group
        </MenuItem>
      </Menu>
    </Box>
  );
}

function MembersTab({
  members,
  filter,
  onFilterChange,
}: {
  members: GroupMember[];
  filter: string;
  onFilterChange: (v: string) => void;
}) {
  const columns: ColumnDef<GroupMember>[] = [
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "12px",
              fontWeight: 600,
              bgcolor: getAvatarColor(row.original.displayName),
            }}
          >
            {getInitials(row.original.displayName)}
          </Avatar>
          <Typography sx={{ fontSize: "14px" }}>
            {row.original.displayName}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <MemberActionsCell member={row.original} />,
      enableSorting: false,
      size: 80,
    },
  ];

  return (
    <TableSection
      columns={columns}
      data={members}
      filter={filter}
      onFilterChange={onFilterChange}
      searchPlaceholder="Search members..."
      emptyMessage="No members in this group"
    />
  );
}

function ObjectReferencesTab({
  references,
  filter,
  onFilterChange,
}: {
  references: typeof objectReferences;
  filter: string;
  onFilterChange: (v: string) => void;
}) {
  const columns: ColumnDef<(typeof objectReferences)[0]>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "objectType", header: "Object Type" },
    { accessorKey: "description", header: "Description" },
  ];

  return (
    <TableSection
      columns={columns}
      data={references}
      filter={filter}
      onFilterChange={onFilterChange}
      searchPlaceholder="Search object references..."
      emptyMessage="No object references"
    />
  );
}

function ArticleReferencesTab({
  references,
  filter,
  onFilterChange,
}: {
  references: typeof articleReferences;
  filter: string;
  onFilterChange: (v: string) => void;
}) {
  const columns: ColumnDef<(typeof articleReferences)[0]>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "articleType", header: "Type" },
    { accessorKey: "lastUpdated", header: "Last Updated" },
  ];

  return (
    <TableSection
      columns={columns}
      data={references}
      filter={filter}
      onFilterChange={onFilterChange}
      searchPlaceholder="Search article references..."
      emptyMessage="No article references"
    />
  );
}

function TableSection<T>({
  columns,
  data,
  filter,
  onFilterChange,
  searchPlaceholder,
  emptyMessage,
}: {
  columns: ColumnDef<T, any>[];
  data: T[];
  filter: string;
  onFilterChange: (v: string) => void;
  searchPlaceholder: string;
  emptyMessage: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter: filter },
    onGlobalFilterChange: onFilterChange,
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <Box>
      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder={searchPlaceholder}
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
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
            "& .MuiOutlinedInput-root": { fontSize: "14px" },
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
            "& thead": { backgroundColor: "grey.50" },
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
            "& tbody tr:last-child td": { borderBottom: "none" },
            "& tbody tr:hover": { backgroundColor: "grey.50" },
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: "center", padding: "32px 16px" }}
                >
                  <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>
                    {emptyMessage}
                  </Typography>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
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
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              sx={{
                fontSize: "14px",
                "& .MuiSelect-select": { padding: "4px 8px" },
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            {table.getFilteredRowModel().rows.length === 0
              ? "0 of 0"
              : `${
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                }-${Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} of ${table.getFilteredRowModel().rows.length}`}
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
  );
}
