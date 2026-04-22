"use client";

import { useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Popover,
  TextField,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { designTokens } from "@repo/ui/theme/tokens";
import { Users, Calendar } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  chartColors,
  chartMargin,
  chartAxisProps,
  chartGridProps,
  chartBarProps,
  chartLabelListProps,
  chartTooltipProps,
  ChartLegend,
  useChartLegend,
  ChartCardHeader,
  ChartDataTable,
  ChartCardWithSwitcher,
  TruncatedYAxisTick,
  computeYAxisWidth,
} from "@repo/ui/common/charts";

const CATALOG_VIEWS_KEYS = [
  "Other",
  "Documents",
  "Folders",
  "BI",
  "Schema",
  "Data Source",
  "Column",
  "Table",
  "Query",
] as const;

const catalogViewsData = [
  {
    month: "Aug",
    Other: 120,
    Documents: 340,
    Folders: 210,
    BI: 180,
    Schema: 290,
    "Data Source": 160,
    Column: 430,
    Table: 510,
    Query: 380,
  },
  {
    month: "Sep",
    Other: 135,
    Documents: 370,
    Folders: 225,
    BI: 195,
    Schema: 310,
    "Data Source": 175,
    Column: 460,
    Table: 540,
    Query: 410,
  },
  {
    month: "Oct",
    Other: 110,
    Documents: 300,
    Folders: 190,
    BI: 160,
    Schema: 270,
    "Data Source": 145,
    Column: 400,
    Table: 480,
    Query: 350,
  },
  {
    month: "Nov",
    Other: 150,
    Documents: 410,
    Folders: 250,
    BI: 220,
    Schema: 340,
    "Data Source": 190,
    Column: 500,
    Table: 590,
    Query: 440,
  },
  {
    month: "Dec",
    Other: 160,
    Documents: 430,
    Folders: 265,
    BI: 235,
    Schema: 360,
    "Data Source": 200,
    Column: 530,
    Table: 620,
    Query: 470,
  },
  {
    month: "Jan",
    Other: 175,
    Documents: 460,
    Folders: 280,
    BI: 250,
    Schema: 385,
    "Data Source": 215,
    Column: 560,
    Table: 660,
    Query: 500,
  },
  {
    month: "Feb",
    Other: 168,
    Documents: 445,
    Folders: 272,
    BI: 242,
    Schema: 372,
    "Data Source": 208,
    Column: 545,
    Table: 640,
    Query: 485,
  },
  {
    month: "Mar",
    Other: 185,
    Documents: 480,
    Folders: 295,
    BI: 263,
    Schema: 400,
    "Data Source": 225,
    Column: 585,
    Table: 690,
    Query: 520,
  },
  {
    month: "Apr",
    Other: 198,
    Documents: 510,
    Folders: 312,
    BI: 278,
    Schema: 425,
    "Data Source": 238,
    Column: 615,
    Table: 730,
    Query: 550,
  },
  {
    month: "May",
    Other: 210,
    Documents: 535,
    Folders: 328,
    BI: 293,
    Schema: 448,
    "Data Source": 252,
    Column: 645,
    Table: 765,
    Query: 578,
  },
  {
    month: "Jun",
    Other: 205,
    Documents: 520,
    Folders: 320,
    BI: 285,
    Schema: 436,
    "Data Source": 245,
    Column: 630,
    Table: 748,
    Query: 565,
  },
  {
    month: "Jul",
    Other: 225,
    Documents: 560,
    Folders: 345,
    BI: 310,
    Schema: 470,
    "Data Source": 265,
    Column: 675,
    Table: 800,
    Query: 605,
  },
];

const totalFlagsData = [
  { month: "Aug", Deprecations: 12, Warnings: 8, Endorsements: 5 },
  { month: "Sep", Deprecations: 15, Warnings: 10, Endorsements: 7 },
  { month: "Oct", Deprecations: 10, Warnings: 7, Endorsements: 4 },
  { month: "Nov", Deprecations: 18, Warnings: 13, Endorsements: 9 },
  { month: "Dec", Deprecations: 20, Warnings: 14, Endorsements: 11 },
  { month: "Jan", Deprecations: 22, Warnings: 16, Endorsements: 13 },
  { month: "Feb", Deprecations: 21, Warnings: 15, Endorsements: 12 },
  { month: "Mar", Deprecations: 25, Warnings: 18, Endorsements: 14 },
  { month: "Apr", Deprecations: 28, Warnings: 20, Endorsements: 16 },
  { month: "May", Deprecations: 30, Warnings: 22, Endorsements: 18 },
  { month: "Jun", Deprecations: 27, Warnings: 19, Endorsements: 15 },
  { month: "Jul", Deprecations: 32, Warnings: 24, Endorsements: 20 },
];

const queryExecutionsData = [
  { month: "Aug", value: 420 },
  { month: "Sep", value: 510 },
  { month: "Oct", value: 380 },
  { month: "Nov", value: 620 },
  { month: "Dec", value: 580 },
  { month: "Jan", value: 710 },
  { month: "Feb", value: 670 },
  { month: "Mar", value: 760 },
  { month: "Apr", value: 830 },
  { month: "May", value: 910 },
  { month: "Jun", value: 875 },
  { month: "Jul", value: 960 },
];

const activeUsersData = [
  { month: "Aug", value: 1240 },
  { month: "Sep", value: 1380 },
  { month: "Oct", value: 1150 },
  { month: "Nov", value: 1520 },
  { month: "Dec", value: 1690 },
  { month: "Jan", value: 1830 },
  { month: "Feb", value: 1760 },
  { month: "Mar", value: 1950 },
  { month: "Apr", value: 2080 },
  { month: "May", value: 2210 },
  { month: "Jun", value: 2140 },
  { month: "Jul", value: 2350 },
];

const popularQueriesData = [
  { name: "SELECT * FROM customers", count: 1240, uniqueUsers: 890 },
  { name: "JOIN orders ON user_id", count: 980, uniqueUsers: 740 },
  { name: "SELECT revenue BY month", count: 870, uniqueUsers: 620 },
  { name: "UPDATE customers SET ...", count: 720, uniqueUsers: 510 },
  { name: "SELECT COUNT(*) FROM ...", count: 650, uniqueUsers: 480 },
  { name: "INSERT INTO event_logs", count: 540, uniqueUsers: 390 },
  { name: "SELECT product_id, sku", count: 430, uniqueUsers: 310 },
  { name: "DELETE FROM sessions ...", count: 370, uniqueUsers: 260 },
  { name: "SELECT AVG(revenue) ...", count: 310, uniqueUsers: 220 },
  { name: "CREATE INDEX ON users", count: 260, uniqueUsers: 180 },
];

const popularTablesData = [
  { name: "customers", count: 3420, composeMentions: 1840 },
  { name: "orders", count: 2980, composeMentions: 1560 },
  { name: "products", count: 2540, composeMentions: 1290 },
  { name: "transactions", count: 2210, composeMentions: 980 },
  { name: "users", count: 1980, composeMentions: 870 },
  { name: "inventory", count: 1650, composeMentions: 720 },
  { name: "analytics_events", count: 1320, composeMentions: 540 },
  { name: "sessions", count: 1090, composeMentions: 430 },
  { name: "page_views", count: 870, composeMentions: 310 },
  { name: "revenue_summary", count: 640, composeMentions: 220 },
];

const topSearchTermsData = [
  { name: "customer", count: 890 },
  { name: "revenue", count: 760 },
  { name: "orders", count: 680 },
  { name: "sales", count: 590 },
  { name: "users", count: 520 },
  { name: "product", count: 450 },
  { name: "monthly report", count: 380 },
];

const popularDocumentsData = [
  { name: "Q4 Revenue Analysis", visits: 0.92, uniqueVisitors: 0.78 },
  { name: "Customer Segmentation", visits: 0.85, uniqueVisitors: 0.71 },
  { name: "Product Roadmap 2026", visits: 0.76, uniqueVisitors: 0.64 },
  { name: "Sales Performance", visits: 0.68, uniqueVisitors: 0.55 },
  { name: "Marketing Overview", visits: 0.61, uniqueVisitors: 0.48 },
  { name: "Data Governance Policy", visits: 0.54, uniqueVisitors: 0.42 },
  { name: "Engineering Metrics", visits: 0.47, uniqueVisitors: 0.38 },
  { name: "Compliance Handbook", visits: 0.41, uniqueVisitors: 0.33 },
  { name: "Onboarding Guide", visits: 0.35, uniqueVisitors: 0.28 },
  { name: "API Reference v2", visits: 0.29, uniqueVisitors: 0.22 },
];

const linkedDocumentsData = [
  {
    name: "Q4 Revenue Analysis",
    type: "Report",
    owner: "finance_team",
    visits: 0.92,
    uniqueVisitors: 0.78,
  },
  {
    name: "Customer Segmentation",
    type: "Analysis",
    owner: "marketing_team",
    visits: 0.85,
    uniqueVisitors: 0.71,
  },
  {
    name: "Product Roadmap 2026",
    type: "Roadmap",
    owner: "product_team",
    visits: 0.76,
    uniqueVisitors: 0.64,
  },
  {
    name: "Sales Performance",
    type: "Report",
    owner: "sales_team",
    visits: 0.68,
    uniqueVisitors: 0.55,
  },
  {
    name: "Marketing Overview",
    type: "Overview",
    owner: "marketing_team",
    visits: 0.61,
    uniqueVisitors: 0.48,
  },
  {
    name: "Data Governance Policy",
    type: "Policy",
    owner: "data_governance",
    visits: 0.54,
    uniqueVisitors: 0.42,
  },
  {
    name: "Engineering Metrics",
    type: "Dashboard",
    owner: "engineering",
    visits: 0.47,
    uniqueVisitors: 0.38,
  },
  {
    name: "Compliance Handbook",
    type: "Policy",
    owner: "legal_team",
    visits: 0.41,
    uniqueVisitors: 0.33,
  },
  {
    name: "Onboarding Guide",
    type: "Guide",
    owner: "hr_team",
    visits: 0.35,
    uniqueVisitors: 0.28,
  },
  {
    name: "API Reference v2",
    type: "Reference",
    owner: "engineering",
    visits: 0.29,
    uniqueVisitors: 0.22,
  },
];

type LinkedDocument = {
  name: string;
  type: string;
  owner: string;
  visits: number;
  uniqueVisitors: number;
};

const linkedDocsColumnHelper = createColumnHelper<LinkedDocument>();

const linkedDocsColumns: ColumnDef<LinkedDocument>[] = [
  linkedDocsColumnHelper.accessor("name", {
    header: "Document",
    enableSorting: true,
    meta: { align: "left", flexible: true },
    cell: (info) => (
      <a
        href="#"
        style={{
          fontWeight: 500,
          color: designTokens.palette.blue[600],
          textDecoration: "none",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {info.getValue()}
      </a>
    ),
  }),
  linkedDocsColumnHelper.accessor("visits", {
    header: "Ranking",
    size: 100,
    minSize: 100,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toFixed(2),
  }),
  linkedDocsColumnHelper.accessor("visits", {
    id: "visitsCount",
    header: "Visits",
    size: 90,
    minSize: 90,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toFixed(2),
  }),
  linkedDocsColumnHelper.accessor("uniqueVisitors", {
    header: "Unique visitors",
    size: 130,
    minSize: 130,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toFixed(2),
  }),
] as ColumnDef<LinkedDocument>[];

type NameCountRow = { name: string; count: number };
const nameCountColumnHelper = createColumnHelper<NameCountRow>();

function makeNameCountColumns(
  nameHeader: string,
  countHeader: string,
): ColumnDef<NameCountRow>[] {
  return [
    nameCountColumnHelper.accessor("name", {
      header: nameHeader,
      enableSorting: true,
      meta: { align: "left", flexible: true },
      cell: (info) => (
        <a
          href="#"
          style={{
            fontWeight: 500,
            color: designTokens.palette.blue[600],
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          {info.getValue()}
        </a>
      ),
    }),
    nameCountColumnHelper.accessor("count", {
      header: countHeader,
      size: 120,
      minSize: 120,
      enableSorting: true,
      meta: { align: "right" },
      cell: (info) => info.getValue().toLocaleString(),
    }),
  ] as ColumnDef<NameCountRow>[];
}

type QueryRow = { name: string; count: number; uniqueUsers: number };
const queryColHelper = createColumnHelper<QueryRow>();
const popularQueriesColumns: ColumnDef<QueryRow>[] = [
  queryColHelper.accessor("name", {
    header: "Query",
    enableSorting: true,
    meta: { align: "left", flexible: true },
    cell: (info) => (
      <a
        href="#"
        style={{
          fontWeight: 500,
          color: designTokens.palette.blue[600],
          textDecoration: "none",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {info.getValue()}
      </a>
    ),
  }),
  queryColHelper.accessor("count", {
    header: "Ranking",
    size: 100,
    minSize: 100,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
  queryColHelper.accessor("count", {
    id: "executions",
    header: "Executions",
    size: 110,
    minSize: 110,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
  queryColHelper.accessor("uniqueUsers", {
    header: "Unique users",
    size: 120,
    minSize: 120,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
] as ColumnDef<QueryRow>[];

type TableRow = { name: string; count: number; composeMentions: number };
const tableColHelper = createColumnHelper<TableRow>();
const popularTablesColumns: ColumnDef<TableRow>[] = [
  tableColHelper.accessor("name", {
    header: "Table",
    enableSorting: true,
    meta: { align: "left", flexible: true },
    cell: (info) => (
      <a
        href="#"
        style={{
          fontWeight: 500,
          color: designTokens.palette.blue[600],
          textDecoration: "none",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {info.getValue()}
      </a>
    ),
  }),
  tableColHelper.accessor("count", {
    header: "Ranking",
    size: 100,
    minSize: 100,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
  tableColHelper.accessor("count", {
    id: "visits",
    header: "Visits",
    size: 90,
    minSize: 90,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
  tableColHelper.accessor("composeMentions", {
    header: "Compose mentions",
    size: 155,
    minSize: 155,
    enableSorting: true,
    meta: { align: "right" },
    cell: (info) => info.getValue().toLocaleString(),
  }),
] as ColumnDef<TableRow>[];

interface Contributor {
  id: number;
  name: string;
  email: string;
  flagsPopulated: number;
  queriesPublished: number;
  tagsCreated: number;
  datasourcesCurated: number;
  biCurated: number;
  foldersCreated: number;
  documentsCreated: number;
  total: number;
}

const topContributorsData: Contributor[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    flagsPopulated: 0,
    queriesPublished: 13,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 0,
    total: 13,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    flagsPopulated: 0,
    queriesPublished: 4,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 1,
    total: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    email: "priya.patel@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 0,
    datasourcesCurated: 3,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 1,
    total: 4,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 2,
    documentsCreated: 2,
    total: 4,
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.w@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 1,
    datasourcesCurated: 0,
    biCurated: 1,
    foldersCreated: 0,
    documentsCreated: 1,
    total: 4,
  },
  {
    id: 6,
    name: "James O'Brien",
    email: "james.obrien@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 0,
    datasourcesCurated: 2,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 2,
    total: 4,
  },
  {
    id: 7,
    name: "Aisha Okonkwo",
    email: "aisha.o@company.com",
    flagsPopulated: 0,
    queriesPublished: 4,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 0,
    total: 4,
  },
  {
    id: 8,
    name: "Lucas Ferreira",
    email: "lucas.f@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 1,
    documentsCreated: 3,
    total: 4,
  },
  {
    id: 9,
    name: "Mei Tanaka",
    email: "mei.tanaka@company.com",
    flagsPopulated: 0,
    queriesPublished: 0,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 2,
    foldersCreated: 0,
    documentsCreated: 1,
    total: 3,
  },
  {
    id: 10,
    name: "Ryan Hoffman",
    email: "ryan.h@company.com",
    flagsPopulated: 0,
    queriesPublished: 2,
    tagsCreated: 0,
    datasourcesCurated: 0,
    biCurated: 0,
    foldersCreated: 0,
    documentsCreated: 1,
    total: 3,
  },
];

const numCol = (
  field: keyof Contributor,
  headerName: string,
  width = 120,
): GridColDef<Contributor> => ({
  field,
  headerName,
  width,
  align: "left",
  headerAlign: "left",
});

const topContributorColumns: GridColDef<Contributor>[] = [
  {
    field: "id",
    headerName: "Ranking",
    width: 90,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "Contributor",
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: "12px",
            bgcolor: "primary.main",
          }}
        >
          {params.row.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      </Box>
    ),
  },
  numCol("flagsPopulated", "Flags populated"),
  numCol("queriesPublished", "Queries published", 140),
  numCol("tagsCreated", "Tags created"),
  numCol("datasourcesCurated", "Datasources curated", 160),
  numCol("biCurated", "BI curated"),
  numCol("foldersCreated", "Folders created", 130),
  numCol("documentsCreated", "Documents created", 150),
  numCol("total", "Total", 80),
];

const DATE_RANGE_OPTIONS = [
  { label: "1 month", value: "1m", months: 1 },
  { label: "2 months", value: "2m", months: 2 },
  { label: "3 months", value: "3m", months: 3 },
  { label: "6 months", value: "6m", months: 6 },
  { label: "1 year", value: "1y", months: 12 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Date range state
  const [selectedRangeValue, setSelectedRangeValue] = useState("1m");
  const [selectedRange, setSelectedRange] = useState("1 month");
  const [selectedMonths, setSelectedMonths] = useState(1);

  // Custom range popover — Overview tab
  const dateRangeSelectRef = useRef<HTMLDivElement>(null);
  const [customAnchor, setCustomAnchor] = useState<null | HTMLElement>(null);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Built In tab — extra state
  const builtInDateRangeSelectRef = useRef<HTMLDivElement>(null);
  const [builtInCustomAnchor, setBuiltInCustomAnchor] =
    useState<null | HTMLElement>(null);
  const [includeSuspended, setIncludeSuspended] = useState(false);

  // YAxis widths — computed from actual label text, capped at 150px
  const docsYAxisWidth = computeYAxisWidth(
    popularDocumentsData.map((d) => d.name),
  );
  const queriesYAxisWidth = computeYAxisWidth(
    popularQueriesData.map((d) => d.name),
  );
  const tablesYAxisWidth = computeYAxisWidth(
    popularTablesData.map((d) => d.name),
  );
  const searchTermsYAxisWidth = computeYAxisWidth(
    topSearchTermsData.map((d) => d.name),
  );

  // Legend filter state — managed by useChartLegend (at least one key stays active)
  const usersLegend = useChartLegend(["Unique active users"]);
  const catalogLegend = useChartLegend([...CATALOG_VIEWS_KEYS]);
  const flagsLegend = useChartLegend([
    "Deprecations",
    "Warnings",
    "Endorsements",
  ]);
  const queryLegend = useChartLegend(["Executions"]);
  const docsLegend = useChartLegend(["Visits", "Unique Visitors"]);
  const popularQueriesLegend = useChartLegend(["Executions", "Unique users"]);
  const popularTablesLegend = useChartLegend(["Visits", "Compose mentions"]);
  const searchTermsLegend = useChartLegend(["Searches"]);

  const handleDateRangeSelect = (
    label: string,
    months: number,
    value: string,
  ) => {
    setSelectedRange(label);
    setSelectedMonths(months);
    setSelectedRangeValue(value);
  };

  // Slice the last (selectedMonths + 1) data points
  const visibleChartData = useMemo(
    () => activeUsersData.slice(-(selectedMonths + 1)),
    [selectedMonths],
  );

  const visibleCatalogData = useMemo(
    () => catalogViewsData.slice(-(selectedMonths + 1)),
    [selectedMonths],
  );

  const visibleFlagsData = useMemo(
    () => totalFlagsData.slice(-(selectedMonths + 1)),
    [selectedMonths],
  );

  const visibleQueryData = useMemo(
    () => queryExecutionsData.slice(-(selectedMonths + 1)),
    [selectedMonths],
  );

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setSelectedRange(`${customStart} – ${customEnd}`);
      setSelectedRangeValue("custom");
    }
    setCustomAnchor(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        <Typography variant="h2">Alation Analytics Dashboard</Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: `1px solid ${designTokens.color.border.default}`,
          px: 4,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": {
              backgroundColor: designTokens.color.border.button.primary,
            },
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              px: 1,
              py: 0,
              color: designTokens.color.text.secondary,
              "&.Mui-selected": {
                color: designTokens.color.text.button.primary,
              },
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Built In" />
          <Tab label="Custom" />
        </Tabs>
      </Box>

      {/* Tab content */}
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {activeTab === 0 && (
          <>
            {/* Filter row — outside chart container */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Users filter */}
              <Select
                value="catalog_admin1"
                sx={{ minWidth: "160px" }}
                renderValue={() => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Users size={16} />
                    <Typography variant="body2">catalog_admin1</Typography>
                  </Box>
                )}
              >
                <MenuItem value="catalog_admin1">catalog_admin1</MenuItem>
              </Select>

              {/* Date range filter */}
              <Select
                ref={dateRangeSelectRef}
                value={selectedRangeValue}
                sx={{ minWidth: "160px" }}
                renderValue={() => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar size={16} />
                    <Typography variant="body2">{selectedRange}</Typography>
                  </Box>
                )}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "custom") {
                    setCustomAnchor(dateRangeSelectRef.current);
                  } else {
                    const opt = DATE_RANGE_OPTIONS.find((o) => o.value === val);
                    if (opt)
                      handleDateRangeSelect(opt.label, opt.months, opt.value);
                  }
                }}
              >
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="custom">Custom range…</MenuItem>
              </Select>

              <Popover
                open={Boolean(customAnchor)}
                anchorEl={customAnchor}
                onClose={() => setCustomAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 280,
                  }}
                >
                  <Typography variant="subtitle2">Custom range</Typography>
                  <TextField
                    label="Start date"
                    type="date"
                    size="small"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="End date"
                    type="date"
                    size="small"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Button size="small" onClick={() => setCustomAnchor(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleCustomApply}
                      disabled={!customStart || !customEnd}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>

            {/* Charts grid */}
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              {/* Unique active users */}
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: 2,
                  backgroundColor:
                    designTokens.color.background.surface.default,
                }}
              >
                <ChartCardHeader title="Unique active users" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visibleChartData} margin={chartMargin}>
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="month" {...chartAxisProps} />
                    <YAxis {...chartAxisProps} width={48} />
                    <Tooltip {...chartTooltipProps} />
                    {usersLegend.activeKeys.includes("Unique active users") && (
                      <Bar
                        dataKey="value"
                        name="Unique active users"
                        stackId="a"
                        fill={chartColors[0]}
                        {...chartBarProps}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
                >
                  <ChartLegend
                    items={[
                      { label: "Unique active users", color: chartColors[0] },
                    ]}
                    {...usersLegend}
                  />
                </Box>
              </Box>

              {/* Total catalog views */}
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: 2,
                  backgroundColor:
                    designTokens.color.background.surface.default,
                }}
              >
                <ChartCardHeader title="Total catalog views" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visibleCatalogData} margin={chartMargin}>
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="month" {...chartAxisProps} />
                    <YAxis {...chartAxisProps} width={48} />
                    <Tooltip {...chartTooltipProps} />
                    {CATALOG_VIEWS_KEYS.filter((k) =>
                      catalogLegend.activeKeys.includes(k),
                    ).map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={key}
                        stackId="a"
                        fill={chartColors[CATALOG_VIEWS_KEYS.indexOf(key)]}
                        {...chartBarProps}
                      >
                        <LabelList
                          {...chartLabelListProps}
                          formatter={(v: unknown) =>
                            Number(v) > 50 ? Number(v).toLocaleString() : ""
                          }
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
                >
                  <ChartLegend
                    items={CATALOG_VIEWS_KEYS.map((key, i) => ({
                      label: key,
                      color: chartColors[i],
                    }))}
                    {...catalogLegend}
                  />
                </Box>
              </Box>

              {/* Total flags */}
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: 2,
                  backgroundColor:
                    designTokens.color.background.surface.default,
                }}
              >
                <ChartCardHeader title="Total flags" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visibleFlagsData} margin={chartMargin}>
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="month" {...chartAxisProps} />
                    <YAxis {...chartAxisProps} width={48} />
                    <Tooltip {...chartTooltipProps} />
                    {flagsLegend.activeKeys.includes("Deprecations") && (
                      <Bar
                        dataKey="Deprecations"
                        stackId="a"
                        fill={designTokens.palette.red[500]}
                        {...chartBarProps}
                      >
                        <LabelList
                          {...chartLabelListProps}
                          formatter={(v: unknown) =>
                            Number(v) > 5 ? String(Number(v)) : ""
                          }
                        />
                      </Bar>
                    )}
                    {flagsLegend.activeKeys.includes("Warnings") && (
                      <Bar
                        dataKey="Warnings"
                        stackId="a"
                        fill={designTokens.palette.amber[400]}
                        {...chartBarProps}
                      >
                        <LabelList
                          {...chartLabelListProps}
                          formatter={(v: unknown) =>
                            Number(v) > 5 ? String(Number(v)) : ""
                          }
                        />
                      </Bar>
                    )}
                    {flagsLegend.activeKeys.includes("Endorsements") && (
                      <Bar
                        dataKey="Endorsements"
                        stackId="a"
                        fill={designTokens.palette.green[500]}
                        {...chartBarProps}
                      >
                        <LabelList
                          {...chartLabelListProps}
                          formatter={(v: unknown) =>
                            Number(v) > 5 ? String(Number(v)) : ""
                          }
                        />
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
                >
                  <ChartLegend
                    items={[
                      {
                        label: "Deprecations",
                        color: designTokens.palette.red[500],
                      },
                      {
                        label: "Warnings",
                        color: designTokens.palette.amber[400],
                      },
                      {
                        label: "Endorsements",
                        color: designTokens.palette.green[500],
                      },
                    ]}
                    {...flagsLegend}
                  />
                </Box>
              </Box>

              {/* Compose query executions */}
              <Box
                sx={{
                  p: 3,
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: 2,
                  backgroundColor:
                    designTokens.color.background.surface.default,
                }}
              >
                <ChartCardHeader title="Compose query executions" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visibleQueryData} margin={chartMargin}>
                    <CartesianGrid {...chartGridProps} />
                    <XAxis dataKey="month" {...chartAxisProps} />
                    <YAxis {...chartAxisProps} width={48} />
                    <Tooltip {...chartTooltipProps} />
                    {queryLegend.activeKeys.includes("Executions") && (
                      <Bar
                        dataKey="value"
                        name="Executions"
                        fill={chartColors[2]}
                        {...chartBarProps}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
                >
                  <ChartLegend
                    items={[{ label: "Executions", color: chartColors[2] }]}
                    {...queryLegend}
                  />
                </Box>
              </Box>

              {/* Popular Documents */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <ChartCardWithSwitcher
                  title="Popular documents"
                  legend={
                    <ChartLegend
                      items={[
                        { label: "Visits", color: chartColors[0] },
                        { label: "Unique Visitors", color: chartColors[1] },
                      ]}
                      {...docsLegend}
                    />
                  }
                  chart={
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        layout="vertical"
                        data={popularDocumentsData}
                        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                      >
                        <CartesianGrid
                          vertical={true}
                          horizontal={false}
                          stroke={designTokens.color.border.default}
                        />
                        <XAxis
                          type="number"
                          domain={[0, 1]}
                          ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                          tickFormatter={(v: number) => v.toFixed(1)}
                          {...chartAxisProps}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={docsYAxisWidth}
                          tick={
                            <TruncatedYAxisTick maxWidth={docsYAxisWidth - 4} />
                          }
                        />
                        <Tooltip
                          {...chartTooltipProps}
                          cursor={{ fill: "transparent" }}
                        />
                        {docsLegend.activeKeys.includes("Visits") && (
                          <Bar
                            dataKey="visits"
                            name="Visits"
                            fill={chartColors[0]}
                            {...chartBarProps}
                          />
                        )}
                        {docsLegend.activeKeys.includes("Unique Visitors") && (
                          <Bar
                            dataKey="uniqueVisitors"
                            name="Unique Visitors"
                            fill={chartColors[1]}
                            {...chartBarProps}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  }
                  table={
                    <ChartDataTable
                      data={linkedDocumentsData}
                      columns={
                        linkedDocsColumns as ColumnDef<
                          (typeof linkedDocumentsData)[0],
                          unknown
                        >[]
                      }
                    />
                  }
                />
              </Box>

              {/* Popular Queries */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <ChartCardWithSwitcher
                  title="Popular queries"
                  legend={
                    <ChartLegend
                      items={[
                        { label: "Executions", color: chartColors[0] },
                        { label: "Unique users", color: chartColors[1] },
                      ]}
                      {...popularQueriesLegend}
                    />
                  }
                  chart={
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        layout="vertical"
                        data={popularQueriesData}
                        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                      >
                        <CartesianGrid
                          vertical={true}
                          horizontal={false}
                          stroke={designTokens.color.border.default}
                        />
                        <XAxis type="number" {...chartAxisProps} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={queriesYAxisWidth}
                          tick={
                            <TruncatedYAxisTick
                              maxWidth={queriesYAxisWidth - 4}
                            />
                          }
                        />
                        <Tooltip
                          {...chartTooltipProps}
                          cursor={{ fill: "transparent" }}
                        />
                        {popularQueriesLegend.activeKeys.includes(
                          "Executions",
                        ) && (
                          <Bar
                            dataKey="count"
                            name="Executions"
                            fill={chartColors[0]}
                            {...chartBarProps}
                          />
                        )}
                        {popularQueriesLegend.activeKeys.includes(
                          "Unique users",
                        ) && (
                          <Bar
                            dataKey="uniqueUsers"
                            name="Unique users"
                            fill={chartColors[1]}
                            {...chartBarProps}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  }
                  table={
                    <ChartDataTable
                      data={popularQueriesData}
                      columns={
                        popularQueriesColumns as ColumnDef<QueryRow, unknown>[]
                      }
                    />
                  }
                />
              </Box>

              {/* Popular Tables */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <ChartCardWithSwitcher
                  title="Popular tables"
                  legend={
                    <ChartLegend
                      items={[
                        { label: "Visits", color: chartColors[1] },
                        { label: "Compose mentions", color: chartColors[2] },
                      ]}
                      {...popularTablesLegend}
                    />
                  }
                  chart={
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        layout="vertical"
                        data={popularTablesData}
                        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                      >
                        <CartesianGrid
                          vertical={true}
                          horizontal={false}
                          stroke={designTokens.color.border.default}
                        />
                        <XAxis type="number" {...chartAxisProps} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={tablesYAxisWidth}
                          tick={
                            <TruncatedYAxisTick
                              maxWidth={tablesYAxisWidth - 4}
                            />
                          }
                        />
                        <Tooltip
                          {...chartTooltipProps}
                          cursor={{ fill: "transparent" }}
                        />
                        {popularTablesLegend.activeKeys.includes("Visits") && (
                          <Bar
                            dataKey="count"
                            name="Visits"
                            fill={chartColors[1]}
                            {...chartBarProps}
                          />
                        )}
                        {popularTablesLegend.activeKeys.includes(
                          "Compose mentions",
                        ) && (
                          <Bar
                            dataKey="composeMentions"
                            name="Compose mentions"
                            fill={chartColors[2]}
                            {...chartBarProps}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  }
                  table={
                    <ChartDataTable
                      data={popularTablesData}
                      columns={
                        popularTablesColumns as ColumnDef<TableRow, unknown>[]
                      }
                    />
                  }
                />
              </Box>

              {/* Top Search Terms — full width */}
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  p: 3,
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: 2,
                  backgroundColor:
                    designTokens.color.background.surface.default,
                }}
              >
                <ChartCardHeader title="Top search terms" />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    layout="vertical"
                    data={topSearchTermsData}
                    margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid
                      vertical={true}
                      horizontal={false}
                      stroke={designTokens.color.border.default}
                    />
                    <XAxis type="number" {...chartAxisProps} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={searchTermsYAxisWidth}
                      tick={
                        <TruncatedYAxisTick
                          maxWidth={searchTermsYAxisWidth - 4}
                        />
                      }
                    />
                    <Tooltip
                      {...chartTooltipProps}
                      cursor={{ fill: "transparent" }}
                    />
                    {searchTermsLegend.activeKeys.includes("Searches") && (
                      <Bar
                        dataKey="count"
                        name="Searches"
                        fill={chartColors[2]}
                        {...chartBarProps}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
                <Box
                  sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
                >
                  <ChartLegend
                    items={[{ label: "Searches", color: chartColors[2] }]}
                    {...searchTermsLegend}
                  />
                </Box>
              </Box>
            </Box>
            {/* end charts grid */}
          </>
        )}
        {activeTab === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {/* Data grid header row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h3">Top contributor</Typography>

              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {/* Users filter */}
                <Select
                  value="catalog_admin1"
                  sx={{ minWidth: "160px" }}
                  renderValue={() => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Users size={16} />
                      <Typography variant="body2">catalog_admin1</Typography>
                    </Box>
                  )}
                >
                  <MenuItem value="catalog_admin1">catalog_admin1</MenuItem>
                </Select>

                {/* Date range filter */}
                <Select
                  ref={builtInDateRangeSelectRef}
                  value={selectedRangeValue}
                  sx={{ minWidth: "160px" }}
                  renderValue={() => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Calendar size={16} />
                      <Typography variant="body2">{selectedRange}</Typography>
                    </Box>
                  )}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") {
                      setBuiltInCustomAnchor(builtInDateRangeSelectRef.current);
                    } else {
                      const opt = DATE_RANGE_OPTIONS.find(
                        (o) => o.value === val,
                      );
                      if (opt)
                        handleDateRangeSelect(opt.label, opt.months, opt.value);
                    }
                  }}
                >
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem value="custom">Custom range…</MenuItem>
                </Select>

                <Button variant="outlined" size="medium">
                  Open new query in Compose
                </Button>

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={includeSuspended}
                      onChange={(e) => setIncludeSuspended(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Include suspended users
                    </Typography>
                  }
                  sx={{ m: 0, gap: "8px" }}
                />
              </Box>
            </Box>

            <Popover
              open={Boolean(builtInCustomAnchor)}
              anchorEl={builtInCustomAnchor}
              onClose={() => setBuiltInCustomAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 280,
                }}
              >
                <Typography variant="subtitle2">Custom range</Typography>
                <TextField
                  label="Start date"
                  type="date"
                  size="small"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="End date"
                  type="date"
                  size="small"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    size="small"
                    onClick={() => setBuiltInCustomAnchor(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      if (customStart && customEnd) {
                        setSelectedRange(`${customStart} – ${customEnd}`);
                        setSelectedRangeValue("custom");
                      }
                      setBuiltInCustomAnchor(null);
                    }}
                    disabled={!customStart || !customEnd}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Popover>

            {/* Data grid — grid wrapper constrains width on resize; overflow:hidden clips border-radius */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                overflow: "hidden",
              }}
            >
              <DataGrid
                rows={topContributorsData}
                columns={topContributorColumns}
                rowHeight={56}
                autoHeight
                disableRowSelectionOnClick
                hideFooter
                sx={{
                  border: "none",
                  borderRadius: 0,
                  "& .MuiDataGrid-cell": {
                    fontSize: "13px",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: "13px",
                    fontWeight: 500,
                    color: designTokens.color.text.secondary,
                  },
                }}
              />
            </Box>
          </Box>
        )}
        {activeTab === 2 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No custom visualizations enabled.{" "}
              <a
                href="http://localhost:4200/app/settings/alation_analytics_settings"
                style={{
                  color: designTokens.palette.blue[600],
                  textDecoration: "none",
                }}
              >
                Customize in Admin Settings
              </a>
              .
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
