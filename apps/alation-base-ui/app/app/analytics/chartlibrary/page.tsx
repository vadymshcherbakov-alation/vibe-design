"use client";

import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { designTokens } from "@repo/ui/theme/tokens";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { LabelList } from "recharts";
import {
  chartColors, chartMargin, chartAxisProps, chartGridProps, chartBarProps,
  chartLabelListProps, chartTooltipProps,
  ChartLegend, useChartLegend, ChartCardHeader,
  TruncatedYAxisTick, computeYAxisWidth,
} from "@repo/ui/common/charts";

// ─── Intro reference data ─────────────────────────────────────────────────────

// ─── Chart color palette ──────────────────────────────────────────────────────

const monoHueTokens: { hex: string; token: string }[] = [
  { hex: designTokens.palette.blue[100], token: "palette.blue[100]" },
  { hex: designTokens.palette.blue[300], token: "palette.blue[300]" },
  { hex: designTokens.palette.blue[500], token: "palette.blue[500]" },
  { hex: designTokens.palette.blue[700], token: "palette.blue[700]" },
  { hex: designTokens.palette.blue[900], token: "palette.blue[900]" },
];

const chartColorTokens: { hex: string; token: string }[] = [
  { hex: chartColors[0], token: "palette.blue[600]" },
  { hex: chartColors[1], token: "palette.teal[500]" },
  { hex: chartColors[2], token: "palette.purple[500]" },
  { hex: chartColors[3], token: "palette.amber[400]" },
  { hex: chartColors[4], token: "palette.green[500]" },
  { hex: chartColors[5], token: "palette.red[600]" },
  { hex: chartColors[6], token: "palette.orange[500]" },
  { hex: chartColors[7], token: "palette.cyan[600]" },
  { hex: chartColors[8], token: "palette.pink[500]" },
  { hex: chartColors[9], token: "palette.violet[500]" },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const verticalData = [
  { month: "Feb", value: 1820 },
  { month: "Mar", value: 2140 },
  { month: "Apr", value: 1960 },
  { month: "May", value: 2380 },
  { month: "Jun", value: 2210 },
  { month: "Jul", value: 2490 },
];

const stackedData = [
  { month: "Feb", Documents: 445, Folders: 272, BI: 242, Schema: 372, Column: 545, Table: 640, Query: 485 },
  { month: "Mar", Documents: 480, Folders: 295, BI: 263, Schema: 400, Column: 585, Table: 690, Query: 520 },
  { month: "Apr", Documents: 510, Folders: 312, BI: 278, Schema: 425, Column: 615, Table: 730, Query: 550 },
  { month: "May", Documents: 535, Folders: 328, BI: 293, Schema: 448, Column: 645, Table: 765, Query: 578 },
  { month: "Jun", Documents: 520, Folders: 320, BI: 285, Schema: 436, Column: 630, Table: 748, Query: 565 },
  { month: "Jul", Documents: 560, Folders: 345, BI: 310, Schema: 470, Column: 675, Table: 800, Query: 605 },
];
const STACKED_KEYS = ["Documents", "Folders", "BI", "Schema", "Column", "Table", "Query"];

const horizontalData = [
  { name: "Customer data warehouse", count: 980 },
  { name: "Orders pipeline",         count: 820 },
  { name: "Product catalog",         count: 670 },
  { name: "User analytics",          count: 540 },
  { name: "Revenue summary",         count: 430 },
  { name: "Session logs",            count: 310 },
  { name: "Inventory tracking",      count: 240 },
];

// ─── Customization summary data ───────────────────────────────────────────────

const customComponents = [
  {
    name: "ChartLegend",
    description: "Clickable interactive legend row. Each item toggles its series on/off. Inactive items fade to 35% opacity. At least one series always stays visible — enforced by useChartLegend.",
  },
  {
    name: "useChartLegend",
    description: "Hook that manages which series are visible. Call with the initial key array; returns activeKeys (filter your Bar/Line components against this) and onToggle to spread onto ChartLegend.",
  },
  {
    name: "ChartCardHeader",
    description: "Title bar for standalone chart cards. Renders the chart title with an Open in Compose icon button and a Download menu (SVG, PNG, CSV) on the right.",
  },
  {
    name: "ChartCardWithSwitcher",
    description: "Card wrapper with a chart / table toggle in the header. Pass title, chart, legend, and table as props. Chart view is the default. Includes ChartCardHeader internally.",
  },
  {
    name: "ChartDataTable",
    description: "Sortable companion table for chart data powered by TanStack Table. Define columns with createColumnHelper; use meta.align for cell alignment and meta.flexible: true on the label column.",
  },
  {
    name: "TruncatedYAxisTick",
    description: "Custom SVG Y-axis tick for horizontal bar charts. Truncates labels that exceed maxWidth and shows the full text as a native tooltip on hover. Pair with computeYAxisWidth to auto-size the axis.",
  },
];

const customizations = [
  {
    element: "Axes",
    prop: "chartAxisProps",
    description: "Axis lines and tick lines removed. Tick text uses Alation secondary text color, font family, and 12px size.",
  },
  {
    element: "Grid",
    prop: "chartGridProps",
    description: "Vertical grid lines removed (horizontal lines only). Stroke color uses the design token border color.",
  },
  {
    element: "Bars",
    prop: "chartBarProps",
    description: "Radius set to 0 for flat corners on all bar segments.",
  },
  {
    element: "Tooltip",
    prop: "ChartTooltip",
    description: "Fully custom component. Two-column grid layout: color swatch + label on the left, formatted number on the right. Styled with design tokens and Alation font. Stacked entries are reversed so the topmost segment appears first. Cursor hover fill uses the control hover token.",
  },
  {
    element: "Label list",
    prop: "chartLabelListProps",
    description: "Centered inside stacked bar segments. White text, 11px, semibold, Alation font. Values below a threshold are hidden to avoid clutter.",
  },
  {
    element: "Legend",
    prop: "ChartLegend",
    description: "Fully custom component. Click any item to toggle its series — at least one series always stays visible. Inactive items fade to 35% opacity with a transition. Color swatches are rounded squares instead of Recharts' default lines or circles.",
  },
  {
    element: "Y-axis tick",
    prop: "TruncatedYAxisTick",
    description: "Custom SVG tick for horizontal bar charts. Measures label width via the Canvas API and truncates long labels with an ellipsis. Shows full text as a native SVG tooltip on hover. Pair with computeYAxisWidth to auto-size the axis.",
  },
  {
    element: "Card header",
    prop: "ChartCardHeader",
    description: "Title bar rendered above every chart. Includes an 'Open in Compose' shortcut button and a download menu (SVG, PNG, CSV).",
  },
];

export default function ComponentShowcasePage() {
  const [tab, setTab] = useState(0);

  const verticalLegend   = useChartLegend(["Active users"]);
  const stackedLegend    = useChartLegend(STACKED_KEYS);
  const horizontalLegend = useChartLegend(["Count"]);

  const hBarWidth = computeYAxisWidth(horizontalData.map((d) => d.name));

  return (
    <Box sx={{ px: 4, py: 4, width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2">Chart Library (for engg)</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: `1px solid ${designTokens.color.border.default}` }}>
        <Tab label="Chart types" />
        <Tab label="Recharts customizations" />
        <Tab label="Color palette" />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Vertical bar chart */}
          <Box sx={{ p: 3, border: `1px solid ${designTokens.color.border.default}`, borderRadius: 2, backgroundColor: designTokens.color.background.surface.default }}>
            <ChartCardHeader title="Vertical bar chart" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={verticalData} margin={chartMargin}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="month" {...chartAxisProps} />
                <YAxis {...chartAxisProps} width={48} />
                <Tooltip {...chartTooltipProps} />
                {verticalLegend.activeKeys.includes("Active users") && (
                  <Bar dataKey="value" name="Active users" fill={chartColors[0]} {...chartBarProps} />
                )}
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
              <ChartLegend items={[{ label: "Active users", color: chartColors[0] }]} {...verticalLegend} />
            </Box>
          </Box>

          {/* Stacked bar chart */}
          <Box sx={{ p: 3, border: `1px solid ${designTokens.color.border.default}`, borderRadius: 2, backgroundColor: designTokens.color.background.surface.default }}>
            <ChartCardHeader title="Stacked bar chart" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stackedData} margin={chartMargin}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="month" {...chartAxisProps} />
                <YAxis {...chartAxisProps} width={48} />
                <Tooltip {...chartTooltipProps} />
                {STACKED_KEYS.filter((k) => stackedLegend.activeKeys.includes(k)).map((key, i) => (
                  <Bar key={key} dataKey={key} name={key} stackId="s" fill={chartColors[i % chartColors.length]} {...chartBarProps}>
                    <LabelList {...chartLabelListProps} formatter={(v: unknown) => Number(v) > 100 ? Number(v).toLocaleString() : ""} />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
              <ChartLegend items={STACKED_KEYS.map((k, i) => ({ label: k, color: chartColors[i % chartColors.length] }))} {...stackedLegend} />
            </Box>
          </Box>

          {/* Horizontal bar chart */}
          <Box sx={{ p: 3, border: `1px solid ${designTokens.color.border.default}`, borderRadius: 2, backgroundColor: designTokens.color.background.surface.default }}>
            <ChartCardHeader title="Horizontal bar chart" />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={horizontalData} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid vertical horizontal={false} stroke={designTokens.color.border.default} />
                <XAxis type="number" {...chartAxisProps} />
                <YAxis type="category" dataKey="name" width={hBarWidth} tick={<TruncatedYAxisTick maxWidth={hBarWidth - 4} />} />
                <Tooltip {...chartTooltipProps} cursor={{ fill: "transparent" }} />
                {horizontalLegend.activeKeys.includes("Count") && (
                  <Bar dataKey="count" name="Count" fill={chartColors[0]} {...chartBarProps} />
                )}
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
              <ChartLegend items={[{ label: "Count", color: chartColors[0] }]} {...horizontalLegend} />
            </Box>
          </Box>

        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Import */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Import</Typography>
            <Box
              sx={{
                backgroundColor: designTokens.color.background.surface.overlay,
                border: `1px solid ${designTokens.color.border.default}`,
                borderRadius: 2,
                p: 2,
                fontFamily: "monospace",
                fontSize: "12px",
                overflowX: "auto",
                whiteSpace: "pre",
                color: designTokens.color.text.primary,
                lineHeight: 1.7,
              }}
            >{`import {
  chartColors,
  chartMargin, chartAxisProps, chartGridProps, chartBarProps,
  chartLabelListProps, chartTooltipProps,
  useChartLegend, ChartLegend,
  ChartCardHeader, ChartCardWithSwitcher, ChartDataTable,
  computeYAxisWidth, TruncatedYAxisTick,
} from "@repo/ui/common/charts";`}</Box>
          </Box>

          {/* Custom components */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Custom components</Typography>
            <Box
              sx={{
                border: `1px solid ${designTokens.color.border.default}`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  px: 2,
                  py: 1,
                  backgroundColor: designTokens.color.background.surface.overlay,
                  borderBottom: `1px solid ${designTokens.color.border.default}`,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">Component</Typography>
                <Typography variant="subtitle2" color="text.secondary">What it does</Typography>
              </Box>
              {customComponents.map((row, i) => (
                <Box
                  key={row.name}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    px: 2,
                    py: 1.5,
                    borderBottom: i < customComponents.length - 1 ? `1px solid ${designTokens.color.border.default}` : "none",
                    alignItems: "start",
                    "&:hover": { backgroundColor: designTokens.color.background.surface.overlay },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      backgroundColor: designTokens.color.background.surface.overlay,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    {row.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{row.description}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Style customizations */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Style customizations</Typography>
            <Box
              sx={{
                border: `1px solid ${designTokens.color.border.default}`,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "140px 200px 1fr",
                  px: 2,
                  py: 1,
                  backgroundColor: designTokens.color.background.surface.overlay,
                  borderBottom: `1px solid ${designTokens.color.border.default}`,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">Element</Typography>
                <Typography variant="subtitle2" color="text.secondary">Prop / component</Typography>
                <Typography variant="subtitle2" color="text.secondary">What changed</Typography>
              </Box>
              {customizations.map((row, i) => (
                <Box
                  key={row.prop}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "140px 200px 1fr",
                    px: 2,
                    py: 1.5,
                    borderBottom: i < customizations.length - 1 ? `1px solid ${designTokens.color.border.default}` : "none",
                    alignItems: "start",
                    "&:hover": { backgroundColor: designTokens.color.background.surface.overlay },
                  }}
                >
                  <Typography variant="body2">{row.element}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      color: designTokens.color.text.secondary,
                      backgroundColor: designTokens.color.background.surface.overlay,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    {row.prop}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{row.description}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

        </Box>
      )}

      {tab === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* Multi-hue */}
          <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Multi-hue</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Use when a chart encodes multiple distinct categories — e.g. grouped bar charts, pie/donut charts,
              multi-series line charts. Each series gets a visually distinct color drawn from{" "}
              <Box component="span" sx={{ fontFamily: "monospace", fontSize: "12px" }}>chartColors</Box>{" "}
              from <Box component="span" sx={{ fontFamily: "monospace", fontSize: "12px" }}>@repo/ui/common/charts</Box>.
            </Typography>
          </Box>

          {/* Swatch grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
              gap: 1,
            }}
          >
            {chartColorTokens.map(({ hex, token }, i) => (
              <Box
                key={i}
                sx={{
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ height: 80, backgroundColor: hex }} />
                <Box sx={{ p: 1 }}>
                  <Typography variant="caption" sx={{ display: "block" }}>
                    {i + 1}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={token}
                  >
                    {token}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {hex}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          </Box>

          {/* Mono-hue */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Mono-hue</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Use when a chart encodes a single variable across categories — e.g. a simple bar chart where bar height
              represents one metric. Darker shades represent higher values; lighter shades represent values closer to
              zero. Pick a single hue from the Alation palette and use exactly the 100, 300, 500, 700, 900 stops.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
              gap: 1,
            }}
          >
            {monoHueTokens.map(({ hex, token }, i) => (
              <Box
                key={i}
                sx={{
                  border: `1px solid ${designTokens.color.border.default}`,
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ height: 80, backgroundColor: hex }} />
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={token}
                  >
                    {token}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {hex}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      )}

      <Box sx={{ pb: 4 }} />
    </Box>
  );
}
