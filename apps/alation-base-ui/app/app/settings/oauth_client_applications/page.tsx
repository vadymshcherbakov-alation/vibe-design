"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";

interface OAuthApplication {
  name: string;
  clientId: string;
  createdBy: string;
  createdAt: string;
}

const mockData: OAuthApplication[] = [
  {
    name: "Data Integration Service",
    clientId: "oauth_client_abc123",
    createdBy: "admin@example.com",
    createdAt: "2024-01-15",
  },
  {
    name: "Analytics Dashboard",
    clientId: "oauth_client_def456",
    createdBy: "user@example.com",
    createdAt: "2024-02-20",
  },
  {
    name: "Mobile App",
    clientId: "oauth_client_ghi789",
    createdBy: "developer@example.com",
    createdAt: "2024-03-10",
  },
];

const columns: ColumnDef<OAuthApplication>[] = [
  {
    accessorKey: "name",
    header: "Application Name",
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

export default function OAuthClientApplicationsPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="OAuth Client Applications"
      breadcrumbs={[
        { label: "Authentication" },
        { label: "OAuth Client Applications" },
      ]}
      pageActions={[
        {
          label: "Create Application",
          onClick: () => console.log("Create application"),
          variant: "primary",
        },
      ]}
      tableTitle="OAuth Applications"
      tableDescription="Manage OAuth client applications for API access"
      columns={columns}
      data={mockData}
      rowActions={[
        {
          label: "Edit",
          onClick: (row) => console.log("Edit", row),
        },
        {
          label: "View Credentials",
          onClick: (row) => console.log("View credentials", row),
        },
        {
          label: "Delete",
          onClick: (row) => console.log("Delete", row),
        },
      ]}
      searchPlaceholder="Search applications..."
    />
  );
}
