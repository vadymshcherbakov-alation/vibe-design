"use client";

import { type ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────
type Severity = "Critical" | "High" | "Medium" | "Low";
type Risk = "High" | "Medium" | "Low";
type IssueStatus = "Open" | "Investigating" | "Resolved";

interface DataQualityIssue {
  id: string;
  issue: string;
  description: string;
  asset: string;
  rule: string;
  severity: Severity;
  risk: Risk;
  status: IssueStatus;
  detectedAt: string;
}

const issues: DataQualityIssue[] = [
  {
    id: "1",
    issue: "Null values in primary key",
    description: "12.4% of rows have null values in customers.customer_id",
    asset: "finance_prod.customers",
    rule: "PK completeness",
    severity: "Critical",
    risk: "High",
    status: "Open",
    detectedAt: "2026-04-26",
  },
  {
    id: "2",
    issue: "Schema drift detected",
    description: "Column orders.shipping_zip changed type from VARCHAR to INT",
    asset: "finance_prod.orders",
    rule: "Schema stability",
    severity: "High",
    risk: "High",
    status: "Investigating",
    detectedAt: "2026-04-25",
  },
  {
    id: "3",
    issue: "Freshness SLA breached",
    description: "Last update 36h ago — SLA is 24h",
    asset: "marketing.campaign_events",
    rule: "Daily freshness",
    severity: "High",
    risk: "Medium",
    status: "Open",
    detectedAt: "2026-04-25",
  },
  {
    id: "4",
    issue: "Duplicate records",
    description: "1,284 duplicate rows on (account_id, event_ts)",
    asset: "product.user_events",
    rule: "Uniqueness check",
    severity: "Medium",
    risk: "Medium",
    status: "Open",
    detectedAt: "2026-04-24",
  },
  {
    id: "5",
    issue: "Out-of-range values",
    description: "Negative values found in transactions.amount",
    asset: "finance_prod.transactions",
    rule: "Range validity",
    severity: "Medium",
    risk: "Low",
    status: "Investigating",
    detectedAt: "2026-04-23",
  },
  {
    id: "6",
    issue: "Referential integrity",
    description: "412 orphan rows in order_items missing parent order",
    asset: "finance_prod.order_items",
    rule: "FK integrity",
    severity: "Low",
    risk: "Low",
    status: "Open",
    detectedAt: "2026-04-22",
  },
  {
    id: "7",
    issue: "Pattern mismatch",
    description: "Email field has 0.8% invalid format",
    asset: "crm.contacts",
    rule: "Email regex",
    severity: "Low",
    risk: "Low",
    status: "Resolved",
    detectedAt: "2026-04-21",
  },
];

const severityChipColor: Record<Severity, "error" | "warning" | "default"> = {
  Critical: "error",
  High: "error",
  Medium: "warning",
  Low: "default",
};

const severityChipVariant: Record<Severity, "filled" | "filledLight"> = {
  Critical: "filled",
  High: "filledLight",
  Medium: "filledLight",
  Low: "filledLight",
};

function PageHeaderSection({
  children,
  hideBorder,
  sx,
}: {
  children: ReactNode;
  hideBorder?: boolean;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        px: 3,
        py: 2.5,
        borderBottom: hideBorder ? "none" : 1,
        borderColor: "divider",
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}

function SummaryRow() {
  const open = issues.filter((i) => i.status !== "Resolved").length;
  const critical = issues.filter((i) => i.severity === "Critical").length;
  const highRisk = issues.filter((i) => i.risk === "High").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  return (
    <Stack direction="row" spacing={4} sx={{ px: 3, py: 2.5 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Open issues
        </Typography>
        <Typography variant="h2">{open}</Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Critical
        </Typography>
        <Typography variant="h2">{critical}</Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          High risk
        </Typography>
        <Typography variant="h2">{highRisk}</Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Resolved (7d)
        </Typography>
        <Typography variant="h2">{resolved}</Typography>
      </Stack>
    </Stack>
  );
}

export default function DataQualityPage() {
  const theme = useTheme();
  const router = useRouter();

  const columns: GridColDef<DataQualityIssue>[] = [
    {
      field: "issue",
      headerName: "Issue",
      flex: 1.6,
      minWidth: 280,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
            height: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.issue}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: "asset",
      headerName: "Asset",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.asset}
        </Typography>
      ),
    },
    {
      field: "severity",
      headerName: "Severity",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.severity}
          color={severityChipColor[params.row.severity]}
          variant={severityChipVariant[params.row.severity]}
          size="xsmall"
        />
      ),
    },
    {
      field: "risk",
      headerName: "Risk",
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.risk}
        </Typography>
      ),
    },
    {
      field: "rule",
      headerName: "Rule",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.rule}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: "detectedAt",
      headerName: "Detected",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.detectedAt}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title={`Actions for ${params.row.issue}`}>
          <IconButton
            size="small"
            aria-label={`Actions for ${params.row.issue}`}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "background.paper",
      }}
    >
      <PageHeaderSection>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h1">Data quality</Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => router.push("/app/data_quality/rules/new")}
          >
            New rule
          </Button>
        </Box>
      </PageHeaderSection>

      <SummaryRow />

      <Box sx={{ px: 3, pb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h2">Issues</Typography>
          <Typography variant="body2" color="text.secondary">
            {issues.length} issues
          </Typography>
        </Stack>

        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[200]}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={issues}
            columns={columns}
            rowHeight={56}
            hideFooter
            autoHeight
            disableRowSelectionOnClick
            sx={{
              border: "none",
              boxShadow: "none",
              "& .MuiDataGrid-main": {
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
              },
              "& .MuiDataGrid-main:only-child": { borderBottom: "none" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.grey[50],
              },
              "& .MuiDataGrid-cell": { px: "10px" },
              "& .MuiDataGrid-columnHeader": { px: "10px" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.neutral[50],
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Show rows
            </Typography>
            <Box
              component="select"
              defaultValue={10}
              sx={{
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: 1,
                px: 1,
                py: 0.375,
                fontSize: theme.typography.body2.fontSize,
                fontFamily: "inherit",
                bgcolor: "transparent",
                cursor: "default",
                outline: "none",
              }}
            >
              {[5, 10, 25].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              1–{issues.length} of {issues.length}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton size="small" disabled aria-label="First page">
                <ChevronsLeft size={16} />
              </IconButton>
              <IconButton size="small" disabled aria-label="Previous page">
                <ChevronLeft size={16} />
              </IconButton>
              <IconButton size="small" disabled aria-label="Next page">
                <ChevronRight size={16} />
              </IconButton>
              <IconButton size="small" disabled aria-label="Last page">
                <ChevronsRight size={16} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
