"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Avatar, Box, Typography } from "@mui/material";

interface OnlineUser {
  name: string;
  avatar?: string;
  status: "Active";
}

const mockData: OnlineUser[] = [
  {
    name: "server admin",
    status: "Active",
  },
];

const columns: ColumnDef<OnlineUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: "12px",
            backgroundColor: "primary.main",
          }}
        >
          {row.original.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ fontSize: "14px", color: "primary.main", fontWeight: 500 }}>
          {row.original.name}
        </Typography>
      </Box>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Chip label={row.original.status} size="small" color="success" />
    ),
  },
];

export default function OnlineUsersPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Online Users"
      breadcrumbs={[{ label: "Settings" }, { label: "Monitor" }]}
      tableTitle="Online Users"
      tableDescription="View currently active users in the system"
      columns={columns}
      data={mockData}
      searchPlaceholder="Search users..."
    />
  );
}
