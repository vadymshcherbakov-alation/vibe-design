"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Link } from "@mui/material";

interface EtlJob {
  jobName: string;
  status: "Failed" | "Success" | "Running";
  created: string;
  errorMessage: string;
  loadId: number;
}

const mockData: EtlJob[] = [
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2026-02-07T11:20:36.036262Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 414,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2026-01-15T05:36:13.013344Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 723,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2026-01-01T15:00:14.014464Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 785,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-12-23T10:10:44.044465Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 756,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-12-02T15:04:45:04.046892Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 765,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-12-02T23:04:29.042042Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 723,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-12-02T11:00:04.004988Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 723,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-11-25T14:36:26.368431Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 723,
  },
  {
    jobName: "extract_alation_ds_assembly_result_job.Alation",
    status: "Failed",
    created: "2025-10-27T00:00:01.001932Z",
    errorMessage: "Exception in SnowflakeLoad.loadFile load for ba...",
    loadId: 632,
  },
];

const columns: ColumnDef<EtlJob>[] = [
  {
    accessorKey: "jobName",
    header: "Job Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        Failed: "error",
        Success: "success",
        Running: "info",
      } as const;
      return (
        <Chip
          label={row.original.status}
          size="small"
          color={statusColors[row.original.status]}
        />
      );
    },
  },
  {
    accessorKey: "created",
    header: "Created",
  },
  {
    accessorKey: "errorMessage",
    header: "Error Message",
  },
  {
    accessorKey: "loadId",
    header: "Load ID",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href="#"
        sx={{ fontSize: "14px", textDecoration: "none" }}
        onClick={(e) => {
          e.preventDefault();
          console.log("View details", row.original);
        }}
      >
        View Details
      </Link>
    ),
  },
];

export default function EtlStatusPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="ETL Status"
      breadcrumbs={[{ label: "Settings" }, { label: "Monitor" }]}
      pageActions={[
        {
          label: "Mark all as read",
          onClick: () => console.log("Mark all as read"),
          variant: "secondary",
        },
      ]}
      tableLevelAction={{
        label: "Refresh Table",
        onClick: () => console.log("Refresh table"),
      }}
      tableTitle="ETL Status"
      tableDescription="Monitor ETL job execution and errors"
      columns={columns}
      data={mockData}
      searchPlaceholder="Search jobs..."
    />
  );
}
