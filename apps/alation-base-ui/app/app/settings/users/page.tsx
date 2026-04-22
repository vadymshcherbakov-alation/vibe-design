"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip } from "@mui/material";

interface User {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const mockData: User[] = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Server Admin",
    status: "active",
    lastLogin: "2024-03-19",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Catalog Admin",
    status: "active",
    lastLogin: "2024-03-18",
  },
  {
    name: "Mike Chen",
    email: "mike.chen@example.com",
    role: "Steward",
    status: "active",
    lastLogin: "2024-03-15",
  },
  {
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "Composer",
    status: "inactive",
    lastLogin: "2024-02-28",
  },
  {
    name: "Alex Turner",
    email: "alex.turner@example.com",
    role: "Viewer",
    status: "active",
    lastLogin: "2024-03-19",
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Chip
        label={row.original.status}
        size="small"
        color={row.original.status === "active" ? "success" : "default"}
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
  },
];

export default function UsersPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Users"
      breadcrumbs={[{ label: "User Management" }, { label: "Users" }]}
      pageActions={[
        {
          label: "Invite User",
          onClick: () => console.log("Invite user"),
          variant: "primary",
        },
        {
          label: "Import Users",
          onClick: () => console.log("Import users"),
          variant: "secondary",
        },
      ]}
      tableTitle="User List"
      tableDescription="Manage user accounts and permissions"
      tableLevelAction={{
        label: "Export Users",
        onClick: () => console.log("Export users"),
      }}
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "Edit",
          onClick: (row) => console.log("Edit", row),
        },
        {
          label: "Change Role",
          onClick: (row) => console.log("Change role", row),
        },
        {
          label: "Deactivate",
          onClick: (row) => console.log("Deactivate", row),
        },
        {
          label: "Delete",
          onClick: (row) => console.log("Delete", row),
        },
      ]}
      searchPlaceholder="Search users..."
    />
  );
}
