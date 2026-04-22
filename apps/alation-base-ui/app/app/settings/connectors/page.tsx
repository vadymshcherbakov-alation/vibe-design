"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip } from "@mui/material";

interface Connector {
  name: string;
  type: string;
  version: string;
  status: "active" | "inactive" | "error";
  lastSync: string;
}

const mockData: Connector[] = [
  {
    name: "Snowflake Production",
    type: "Snowflake",
    version: "3.2.1",
    status: "active",
    lastSync: "2024-03-20 09:30",
  },
  {
    name: "PostgreSQL Analytics",
    type: "PostgreSQL",
    version: "2.8.4",
    status: "active",
    lastSync: "2024-03-20 08:45",
  },
  {
    name: "MySQL Legacy",
    type: "MySQL",
    version: "2.5.6",
    status: "inactive",
    lastSync: "2024-03-15 14:20",
  },
  {
    name: "Oracle ERP",
    type: "Oracle",
    version: "3.0.2",
    status: "active",
    lastSync: "2024-03-20 10:00",
  },
  {
    name: "MongoDB Staging",
    type: "MongoDB",
    version: "2.9.1",
    status: "error",
    lastSync: "2024-03-19 22:15",
  },
];

const columns: ColumnDef<Connector>[] = [
  {
    accessorKey: "name",
    header: "Connector Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        active: "success",
        inactive: "default",
        error: "error",
      } as const;
      return (
        <Chip
          label={row.original.status}
          size="small"
          color={statusColors[row.original.status]}
          sx={{ textTransform: "capitalize" }}
        />
      );
    },
  },
  {
    accessorKey: "lastSync",
    header: "Last Sync",
  },
];

export default function ConnectorsPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Connectors"
      breadcrumbs={[{ label: "Integration" }, { label: "Connectors" }]}
      pageActions={[
        {
          label: "Add Connector",
          onClick: () => console.log("Add connector"),
          variant: "primary",
        },
      ]}
      tableTitle="Data Source Connectors"
      tableDescription="Manage connections to your data sources"
      tableLevelAction={{
        label: "Sync All",
        onClick: () => console.log("Sync all connectors"),
      }}
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "Configure",
          onClick: (row) => console.log("Configure", row),
        },
        {
          label: "Sync Now",
          onClick: (row) => console.log("Sync", row),
        },
        {
          label: "View Logs",
          onClick: (row) => console.log("View logs", row),
        },
        {
          label: "Disable",
          onClick: (row) => console.log("Disable", row),
        },
      ]}
      searchPlaceholder="Search connectors..."
    />
  );
}
