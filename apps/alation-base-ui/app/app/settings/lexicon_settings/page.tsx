"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, Link } from "@mui/material";

interface LexiconJob {
  started: string;
  status: "N/A" | "Failed" | "Completed";
  runtime: string;
  errors: number;
  statusMessage: string;
}

const mockData: LexiconJob[] = [
  {
    started: "Last Run at 7:00am",
    status: "N/A",
    runtime: "running",
    errors: 0,
    statusMessage: "Computing expansions...",
  },
  {
    started: "Feb 1 at 7:00am",
    status: "N/A",
    runtime: "running",
    errors: 0,
    statusMessage: "Computing expansions...",
  },
  {
    started: "Jan 29 at 7:00am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Jan 18 at 7:00am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Jan 15 at 7:00am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Jan 4 at 7:01am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Dec 28 at 7:00am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Dec 21 at 7:01am",
    status: "Failed",
    runtime: "11 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Dec 14 at 7:00am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
  {
    started: "Dec 7 at 7:01am",
    status: "Failed",
    runtime: "12 hours",
    errors: 1,
    statusMessage: "Job is not running. It might have been killed or crashed...",
  },
];

const columns: ColumnDef<LexiconJob>[] = [
  {
    accessorKey: "started",
    header: "Started",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        "N/A": "default",
        Failed: "error",
        Completed: "success",
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
    accessorKey: "runtime",
    header: "Runtime",
  },
  {
    accessorKey: "errors",
    header: "Errors",
  },
  {
    accessorKey: "statusMessage",
    header: "Status Message",
  },
  {
    id: "details",
    header: "Details",
    cell: () => (
      <Link
        href="#"
        sx={{ fontSize: "14px", textDecoration: "none" }}
        onClick={(e) => {
          e.preventDefault();
          console.log("View details");
        }}
      >
        View Details
      </Link>
    ),
  },
];

export default function LexiconSettingsPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Lexicon Settings"
      breadcrumbs={[{ label: "Lexicon Settings" }]}
      pageActions={[
        {
          label: "Run Lexicon Now",
          onClick: () => console.log("Run lexicon now"),
          variant: "primary",
        },
      ]}
      tableTitle="Lexicon Job Status"
      columns={columns}
      data={mockData}
      searchPlaceholder="Search jobs..."
    />
  );
}
