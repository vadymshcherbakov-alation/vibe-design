"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Button } from "@mui/material";

interface ActiveTask {
  taskName: string;
  status: "Queued" | "Running";
  numTasks: number;
  queue: string;
  startTime: string;
}

const mockData: ActiveTask[] = [
  {
    taskName: "dummy1",
    status: "Queued",
    numTasks: 1,
    queue: "Default",
    startTime: "n/a",
  },
  {
    taskName: "dummy2",
    status: "Queued",
    numTasks: 1,
    queue: "Default",
    startTime: "n/a",
  },
  {
    taskName: "check_running_queries",
    status: "Queued",
    numTasks: 1,
    queue: "Fastqueue",
    startTime: "n/a",
  },
  {
    taskName: "detect_agent_connectivity_status_change",
    status: "Queued",
    numTasks: 1,
    queue: "Fastqueue",
    startTime: "n/a",
  },
  {
    taskName: "write_metrics",
    status: "Queued",
    numTasks: 1,
    queue: "Metrics",
    startTime: "n/a",
  },
  {
    taskName: "compose_dll_execution_post_processing",
    status: "Queued",
    numTasks: 1,
    queue: "Parsing",
    startTime: "n/a",
  },
  {
    taskName: "update_search_index",
    status: "Queued",
    numTasks: 2,
    queue: "Search",
    startTime: "n/a",
  },
  {
    taskName: "recompute_conditional_catalog_sets_members",
    status: "Queued",
    numTasks: 1,
    queue: "Stewardship",
    startTime: "n/a",
  },
];

const columns: ColumnDef<ActiveTask>[] = [
  {
    accessorKey: "taskName",
    header: "Task Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Chip
        label={row.original.status}
        size="small"
        color={row.original.status === "Running" ? "success" : "default"}
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  {
    accessorKey: "numTasks",
    header: "Num Tasks",
  },
  {
    accessorKey: "queue",
    header: "Queue",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
];

export default function ActiveTasksPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Active Tasks"
      breadcrumbs={[{ label: "Settings" }, { label: "Monitor" }]}
      tableLevelAction={{
        label: "Refresh",
        onClick: () => console.log("Refresh tasks"),
      }}
      tableTitle="Active and Upcoming Tasks"
      tableDescription="Monitor currently running and queued background tasks"
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "Terminate",
          onClick: (row) => console.log("Terminate", row),
        },
        {
          label: "Pull List",
          onClick: (row) => console.log("Pull list", row),
        },
      ]}
      searchPlaceholder="Search tasks..."
    />
  );
}
