"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip } from "@mui/material";

interface Agent {
  name: string;
  version: string;
  status: "connected" | "disconnected" | "error";
  lastHeartbeat: string;
  host: string;
}

const mockData: Agent[] = [
  {
    name: "Production Agent",
    version: "2.4.1",
    status: "connected",
    lastHeartbeat: "2024-03-20 10:45",
    host: "prod-agent-01.example.com",
  },
  {
    name: "Staging Agent",
    version: "2.4.1",
    status: "connected",
    lastHeartbeat: "2024-03-20 10:44",
    host: "staging-agent-01.example.com",
  },
  {
    name: "Development Agent",
    version: "2.3.8",
    status: "disconnected",
    lastHeartbeat: "2024-03-19 16:30",
    host: "dev-agent-01.example.com",
  },
  {
    name: "Analytics Agent",
    version: "2.4.1",
    status: "connected",
    lastHeartbeat: "2024-03-20 10:45",
    host: "analytics-agent-01.example.com",
  },
  {
    name: "Legacy Agent",
    version: "2.2.5",
    status: "error",
    lastHeartbeat: "2024-03-18 08:15",
    host: "legacy-agent-01.example.com",
  },
];

const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
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
        connected: "success",
        disconnected: "default",
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
    accessorKey: "lastHeartbeat",
    header: "Last Heartbeat",
  },
  {
    accessorKey: "host",
    header: "Host",
  },
];

export default function AgentsPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Agents"
      breadcrumbs={[{ label: "Integration" }, { label: "Agents" }]}
      pageActions={[
        {
          label: "Register Agent",
          onClick: () => console.log("Register agent"),
          variant: "primary",
        },
      ]}
      tableTitle="Alation Agents"
      tableDescription="Monitor and manage Alation agents for data source connections"
      tableLevelAction={{
        label: "Refresh Status",
        onClick: () => console.log("Refresh status"),
      }}
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "View Details",
          onClick: (row) => console.log("View details", row),
        },
        {
          label: "Update",
          onClick: (row) => console.log("Update", row),
        },
        {
          label: "Restart",
          onClick: (row) => console.log("Restart", row),
        },
        {
          label: "Remove",
          onClick: (row) => console.log("Remove", row),
        },
      ]}
      searchPlaceholder="Search agents..."
    />
  );
}
