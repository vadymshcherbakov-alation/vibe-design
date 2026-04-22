"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip } from "@mui/material";

interface ScheduledQuery {
  queryTitle: string;
  dataSource: string;
  owner: string;
  ownerStatus: string;
  schedule: string;
}

const mockData: ScheduledQuery[] = [
  {
    queryTitle: "18 34",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Saturday at 12:00pm (PST)",
  },
  {
    queryTitle: "18 31",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Saturday at 12:00pm (PST)",
  },
  {
    queryTitle: "Alation OxEdIT",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "SLA - Query Count Jill",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "Data Format For Sara 1",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "filter",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "Explain Query",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "new weekly scheduled",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "Sahil Galera",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Runs Weekly on Sunday at 12:00pm (PST)",
  },
  {
    queryTitle: "new - Mostly to schedule",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Every 1 minute; runs once every 10 (PST)",
  },
  {
    queryTitle: "Run Faster Test",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Every 1 minute; runs once every 10 (PST)",
  },
  {
    queryTitle: "new - repeat in 5 minute to Snowflake Connection",
    dataSource: "Alation Analytics",
    owner: "server admin",
    ownerStatus: "Can run queries",
    schedule: "Every 5 minutes; runs once every 40 (PST)",
  },
];

const columns: ColumnDef<ScheduledQuery>[] = [
  {
    accessorKey: "queryTitle",
    header: "Query Title",
  },
  {
    accessorKey: "dataSource",
    header: "Data Source",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "ownerStatus",
    header: "Owner Status",
    cell: ({ row }) => (
      <Chip
        label={row.original.ownerStatus}
        size="small"
        color="success"
        sx={{ fontSize: "12px" }}
      />
    ),
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
  },
];

export default function ScheduledQueryDashboardPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Scheduled Query Dashboard"
      breadcrumbs={[{ label: "Settings" }, { label: "Monitor" }]}
      tableLevelAction={{
        label: "Refresh",
        onClick: () => console.log("Refresh"),
      }}
      tableTitle="Scheduled Query Dashboard"
      tableDescription="Monitor and manage scheduled queries"
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "View Query",
          onClick: (row) => console.log("View query", row),
        },
        {
          label: "Edit Schedule",
          onClick: (row) => console.log("Edit schedule", row),
        },
        {
          label: "Disable",
          onClick: (row) => console.log("Disable", row),
        },
      ]}
      searchPlaceholder="Search queries..."
    />
  );
}
