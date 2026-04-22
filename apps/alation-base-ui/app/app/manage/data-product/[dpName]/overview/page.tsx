"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { DATA_PRODUCTS, toProductSlug } from "../../../../marketplace/data-products-data";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ChevronRight,
  ChevronUp,
  CircleDashed,
  ClipboardList,
  Columns2,
  Expand,
  ExternalLink,
  MessageSquare,
  Search,
  Sparkles,
  Plus,
  MoreVertical,
  SquareArrowOutUpRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  Table2,
  SquaresIntersect,
  Waypoints,
  Users,
} from "lucide-react";

interface Metric {
  name: string;
  description: string;
  expression: string;
  expressionType: string;
  source: string;
  sourceType: "dashboard" | "sql";
  updatedAt: string;
  createdAt: string;
}

const METRICS_DATA: Metric[] = [
  {
    name: "Annual Income Sum",
    description: "sum of annual_income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Calendar Year Sum",
    description: "sum of calendar_year",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Calendar Month Number",
    description: "average of annual_income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Customer Age Average",
    description: "maximum of annual_income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "SQL",
    sourceType: "sql",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Total Expenses Sum",
    description: "minimum of annual_income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Quarterly Revenue Sum",
    description: "count of annual_income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Weekly Transaction Count",
    description: "total expenses",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Customer Satisfaction Score",
    description: "net income",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Product Return Rate",
    description: "average monthly savings",
    expression: "SUM(e_annual_income)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Monthly Active Users",
    description: "count of active users",
    expression: "COUNT(active_users)",
    expressionType: "numeric",
    source: "SQL",
    sourceType: "sql",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Revenue Per User",
    description: "average revenue per user",
    expression: "AVG(revenue_per_user)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Churn Rate",
    description: "percentage of churned users",
    expression: "SUM(churned)/COUNT(*)",
    expressionType: "numeric",
    source: "SQL",
    sourceType: "sql",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
  {
    name: "Net Promoter Score",
    description: "customer satisfaction index",
    expression: "AVG(nps_score)",
    expressionType: "numeric",
    source: "Dashboard name",
    sourceType: "dashboard",
    updatedAt: "1/4/2025, 8:15:57 AM",
    createdAt: "12/5/2024, 1:57:43 PM",
  },
];

const PRIMARY_TABS = [
  "Overview",
  "Content",
  "Feedback",
  "Evaluations",
  "Permissions",
];
const CONTENT_SEGMENTS = [
  "Tables",
  "Metrics",
  "Joins",
  "Info",
  "Delivery Systems",
];

function SourceIcon({ type }: { type: "dashboard" | "sql" }) {
  const theme = useTheme();
  if (type === "sql") {
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: 0,
          backgroundColor: theme.palette.amber[400],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          S
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "2px",
        backgroundColor: theme.palette.amber[500],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        D
      </Typography>
    </Box>
  );
}

function ProductHeader({ productName }: { productName: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        pt: 3,
        pb: 1,
        px: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "8px",
            backgroundColor: theme.palette.yellow[400],
            flexShrink: 0,
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Breadcrumbs>
            <NextLink href="/app/marketplace/products" style={{ textDecoration: "none" }}>
              <Link
                component="span"
                underline="hover"
                sx={{
                  fontSize: 13,
                  color: theme.palette.text.secondary,
                  cursor: "pointer",
                }}
              >
                My Data Products
              </Link>
            </NextLink>
            <Typography variant="body2">
              {productName}
            </Typography>
          </Breadcrumbs>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="h1">
              {productName}
            </Typography>
            <Box
              sx={{
                height: 28,
                display: "flex",
                alignItems: "center",
                px: 1.5,
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: "6px",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ whiteSpace: "nowrap" }}
              >
                Version 1.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Button
          variant="outlined"
          color="inherit"
          size="medium"
          endIcon={<SquareArrowOutUpRight size={16} />}
        >
          Preview
        </Button>
        <Button variant="contained" size="medium">
          List in marketplace
        </Button>
        <IconButton variant="outlined" color="inherit" size="medium">
          <MoreVertical size={16} />
        </IconButton>
      </Box>
    </Box>
  );
}

function ContentToolbar({
  activeSegment,
  onSegmentChange,
}: {
  activeSegment: string;
  onSegmentChange: (segment: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <ToggleButtonGroup
        value={activeSegment}
        exclusive
        onChange={(_, val) => val && onSegmentChange(val)}
        sx={{ height: 36, p: 0.25 }}
      >
        {CONTENT_SEGMENTS.map((seg) => (
          <ToggleButton key={seg} value={seg}>
            {seg}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="outlined" color="inherit" size="small">
          <Expand size={16} />
        </IconButton>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<MessageSquare size={16} />}
        >
          Edit with co-pilot
        </Button>
      </Box>
    </Box>
  );
}

function MetricsToolbar() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
      <Typography variant="h3">
        Metrics
      </Typography>
      <Box
        sx={{ flex: 1, display: "flex", gap: 1, justifyContent: "flex-end" }}
      >
        <IconButton variant="outlined" color="inherit" size="small">
          <Search size={16} />
        </IconButton>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Sparkles size={16} />}
        >
          Generate metrics
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Plus size={16} />}
        >
          New metric
        </Button>
      </Box>
    </Box>
  );
}

function MetricsTable({ metrics }: { metrics: Metric[] }) {
  const theme = useTheme();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Expression</TableCell>
            <TableCell>Expression Type</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Updated at</TableCell>
            <TableCell>Created at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric.name} hover>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUp
                    size={16}
                    color={theme.palette.info.main}
                  />
                  <Link
                    underline="none"
                    sx={{
                      color: theme.palette.info.main,
                      fontSize: 13,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {metric.name}
                  </Link>
                </Box>
              </TableCell>
              <TableCell>{metric.description}</TableCell>
              <TableCell>
                <Typography variant="machineBody0">
                  {metric.expression}
                </Typography>
              </TableCell>
              <TableCell>{metric.expressionType}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SourceIcon type={metric.sourceType} />
                  <Link
                    underline="none"
                    sx={{
                      color: theme.palette.info.main,
                      fontSize: 13,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {metric.source}
                  </Link>
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {metric.updatedAt}
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {metric.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PaginationFooter({
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rpp: number) => void;
}) {
  const theme = useTheme();
  const totalPages = Math.ceil(total / rowsPerPage);
  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, total);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="body1">
          Show Rows
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(e.target.value as number);
            onPageChange(0);
          }}
          size="small"
          sx={{
            minWidth: 60,
            "& .MuiSelect-select": {
              py: 0.75,
              fontSize: 13,
            },
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body1">
          {start}-{end} of {total}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => onPageChange(0)}
          >
            <ChevronsLeft size={20} />
          </IconButton>
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            size="small"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={20} />
          </IconButton>
          <IconButton
            size="small"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(totalPages - 1)}
          >
            <ChevronsRight size={20} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function StatRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {icon}
      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
        {label}
      </Typography>
    </Box>
  );
}

function InfoCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: "1 1 calc(50% - 8px)",
        minWidth: "280px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}

function OverviewTab() {
  const theme = useTheme();
  const iconProps = { size: 16, color: theme.palette.text.secondary };

  return (
    <Box sx={{ p: "24px", display: "flex", flexDirection: "column", gap: "32px", maxWidth: "816px", mx: "auto", width: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
          Data product details
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <InfoCard title="Data assets">
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <StatRow icon={<Table2 {...iconProps} />} label="4 tables" />
                <StatRow icon={<Columns2 {...iconProps} />} label="130 columns" />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <StatRow icon={<SquaresIntersect {...iconProps} />} label="5 joins" />
                <StatRow icon={<Waypoints {...iconProps} />} label="19 metrics" />
              </Box>
            </Box>
          </InfoCard>

          <InfoCard title="Contact info">
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 500, color: theme.palette.text.primary }}>
                Bob Belcher
              </Typography>
              <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                bob.belcher@bobsburgers.com
              </Typography>
            </Box>
            <StatRow icon={<Users {...iconProps} />} label="4 additional admins" />
          </InfoCard>

          <InfoCard title="Latest evaluation">
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.success.main }}>
                90% (18/20)
              </Typography>
              <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                Run on November 13, 2025 at 3:05pm
              </Typography>
            </Box>
          </InfoCard>

          <InfoCard
            title="Marketplace status"
            action={<ClipboardList size={20} color={theme.palette.text.secondary} />}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Version 4.0</Typography>
                <Chip label="Listed" color="success" sx={{ height: "20px", fontSize: "12px", "& .MuiChip-label": { px: "8px" } }} />
                <ExternalLink size={14} color={theme.palette.text.secondary} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Version 5.0</Typography>
                <Chip label="Active draft (Unlisted)" color="info" sx={{ height: "20px", fontSize: "12px", "& .MuiChip-label": { px: "8px" } }} />
              </Box>
            </Box>
          </InfoCard>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
          For you
        </Typography>
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "8px",
              height: "36px",
              borderBottom: `1px solid ${theme.palette.neutral[300]}`,
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: theme.palette.text.primary }}>
              Improve accuracy
            </Typography>
            <IconButton size="small" sx={{ width: 28, height: 28, color: theme.palette.text.secondary }}>
              <ChevronUp size={16} />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "12px", py: "10px" }}>
            <CircleDashed size={16} color={theme.palette.text.secondary} />
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: theme.palette.text.primary, flex: 1 }}>
              Recommend improvements to data product based on your evaluation performance
            </Typography>
            <Button variant="contained" size="small" sx={{ height: "28px", fontSize: "13px", whiteSpace: "nowrap" }}>
              Initiate
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function DataProductDetailPage() {
  const theme = useTheme();
  const params = useParams();
  const dpName = params.dpName as string;
  const product = DATA_PRODUCTS.find((p) => toProductSlug(p.name) === dpName);
  const productName = product?.name ?? "Data Product";
  const [activeTab, setActiveTab] = useState(0);
  const [activeSegment, setActiveSegment] = useState("Metrics");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedMetrics = METRICS_DATA.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: 0,
        overflow: "auto",
      }}
    >
      <ProductHeader productName={productName} />

      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          {PRIMARY_TABS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <OverviewTab />
      ) : activeTab === 1 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
          <ContentToolbar
            activeSegment={activeSegment}
            onSegmentChange={setActiveSegment}
          />

          {activeSegment === "Metrics" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MetricsToolbar />
              <MetricsTable metrics={paginatedMetrics} />
              <PaginationFooter
                page={page}
                rowsPerPage={rowsPerPage}
                total={METRICS_DATA.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
              />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {activeSegment} content goes here.
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {PRIMARY_TABS[activeTab]} content goes here.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
