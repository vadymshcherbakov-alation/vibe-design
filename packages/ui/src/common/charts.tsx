// PROTOTYPE-ONLY: scaffolding for the vibe-design prototype. Not part of the design system.
import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Tooltip as MuiTooltip } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { colorPalette } from "../theme/tokens/palette";
import { semanticColorTokens } from "../theme/tokens/semanticTokens";
import { typographyTokens } from "../theme/tokens/typography";

// Allow callers to annotate columns with alignment/flexible layout hints
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    flexible?: boolean;
  }
}

const c = semanticColorTokens.color;
const fontFamily = typographyTokens.typography.fontFamily;

// ─── Chart config ────────────────────────────────────────────────────────────

/**
 * A categorical color sequence for chart series.
 * Drawn from the Alation palette in a visually distinct order.
 */
export const chartColors = [
  colorPalette.blue[600],
  colorPalette.teal[500],
  colorPalette.purple[500],
  colorPalette.amber[400],
  colorPalette.green[500],
  colorPalette.red[600],
  colorPalette.orange[500],
  colorPalette.cyan[600],
  colorPalette.pink[500],
  colorPalette.violet[500],
] as const;

/** Default chart margin passed to BarChart / LineChart / AreaChart etc. */
export const chartMargin = {
  top: 4,
  right: 16,
  bottom: 4,
  left: 0,
} as const;

/** Style object spread onto Recharts <XAxis tick={...} /> and <YAxis tick={...} /> */
export const chartAxisTickStyle = {
  fontSize: 12,
  fill: c.text.secondary,
  fontFamily,
} as const;

/** Common props shared by both axes */
export const chartAxisProps = {
  tick: chartAxisTickStyle,
  axisLine: false,
  tickLine: false,
} as const;

/** Props spread onto Recharts <CartesianGrid /> */
export const chartGridProps = {
  vertical: false,
  stroke: c.border.default,
} as const;

/** Default props for <Bar /> — no rounded corners */
export const chartBarProps = {
  radius: 0,
} as const;

/**
 * Props for <LabelList /> inside a stacked <Bar />.
 * Renders the series value centered inside each bar segment in white.
 * Pair with a formatter that returns "" for small values to avoid clutter:
 *   formatter={(v: number) => v > threshold ? v.toLocaleString() : ""}
 */
export const chartLabelListProps = {
  position: "center" as const,
  style: {
    fontSize: 11,
    fontWeight: 600,
    fill: "#ffffff",
    fontFamily,
  },
} as const;

// ─── Tooltip ─────────────────────────────────────────────────────────────────

// Matches the subset of Recharts' TooltipContentProps that we need
interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}

/**
 * Custom Recharts tooltip.
 * Two-column layout: [swatch + label] [value]
 * Text is always in the default color; no ":" separator.
 * Cursor uses the dropdown list hover background.
 */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: c.background.surface.default,
        borderRadius: 6,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
        padding: "8px 12px",
        fontSize: 12,
        fontFamily,
        minWidth: 160,
      }}
    >
      {label && (
        <div
          style={{
            marginBottom: 6,
            fontWeight: 500,
            fontSize: 12,
            color: c.text.secondary,
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          columnGap: 16,
          rowGap: 4,
          alignItems: "center",
        }}
      >
        {[...payload].reverse().map((entry, i) => (
          <React.Fragment key={i}>
            {/* Left: swatch + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: entry.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: c.text.primary }}>{entry.name}</span>
            </div>

            {/* Right: value */}
            <div
              style={{
                textAlign: "right",
                fontWeight: 500,
                color: c.text.primary,
              }}
            >
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Props spread onto Recharts <Tooltip /> */
export const chartTooltipProps = {
  content: ChartTooltip,
  // Matches MuiMenuItem hover background
  cursor: { fill: c.background.control.hover },
} as const;

// ─── Legend ──────────────────────────────────────────────────────────────────

export interface ChartLegendItem {
  label: string;
  color: string;
}

/**
 * Manages which series are visible in a chart.
 * Enforces that at least one series always remains active.
 * Returns `activeKeys` (for filtering <Bar> components) and `onToggle`
 * to spread directly onto <ChartLegend>.
 */
export function useChartLegend(initialKeys: string[]) {
  const [activeKeys, setActiveKeys] = useState<string[]>(initialKeys);

  const onToggle = (label: string) => {
    setActiveKeys((prev) => {
      if (prev.includes(label)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((k) => k !== label);
      }
      return [...prev, label];
    });
  };

  return { activeKeys, onToggle };
}

interface ChartLegendProps {
  items: ChartLegendItem[];
  /** Labels of currently visible series. All items are active when omitted. */
  activeKeys?: string[];
  /** Called with the toggled label. The caller must enforce the "at least one active" rule. */
  onToggle?: (label: string) => void;
}

/**
 * Interactive horizontal legend rendered above a chart.
 * Click an item to toggle its series. At least one item must remain active —
 * enforce this in the parent's toggle handler.
 */
export function ChartLegend({ items, activeKeys, onToggle }: ChartLegendProps) {
  const isActive = (label: string) =>
    activeKeys === undefined || activeKeys.includes(label);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: "12px",
        marginBottom: "12px",
        marginTop: 0,
      }}
    >
      {items.map((item) => {
        const active = isActive(item.label);
        return (
          <div
            key={item.label}
            onClick={() => onToggle?.(item.label)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: active ? 1 : 0.35,
              cursor: onToggle ? "pointer" : "default",
              userSelect: "none",
              transition: "opacity 0.15s",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 400, fontFamily, color: c.text.secondary }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Chart card header ────────────────────────────────────────────────────────

function ComposeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5804 2.0399C21.687 2.0399 21.7669 2.0798 21.8202 2.1596C21.8735 2.2128 21.9134 2.2926 21.9401 2.399C22.02 2.798 22.02 3.1837 21.9401 3.5561C21.8601 3.9285 21.7403 4.2876 21.5804 4.6334C21.4206 4.9792 21.2474 5.325 21.0609 5.6708C20.8745 6.0166 20.7013 6.3358 20.5415 6.6284C19.2095 6.5752 18.2371 6.7215 17.6244 7.0673C17.0117 7.4131 16.7053 7.586 16.7053 7.586C16.9983 7.4264 17.4779 7.3333 18.1439 7.3067C18.8365 7.2801 19.4892 7.32 20.1019 7.4264C19.9421 7.719 19.7689 8.0116 19.5824 8.3042C19.3959 8.5702 19.2095 8.83619 19.023 9.10219C18.9963 9.18199 18.9431 9.27509 18.8631 9.38149C18.8099 9.46129 18.7566 9.54109 18.7033 9.62089C17.0516 9.46129 15.9194 9.55439 15.3067 9.90019L14.3876 10.4588C14.6274 10.3258 15.1202 10.2061 15.8661 10.0997C16.6121 9.96669 17.4246 10.0199 18.3037 10.2593C18.0639 10.5785 17.8109 10.911 17.5445 11.2568C17.3047 11.576 17.0649 11.8952 16.8252 12.2144C15.6797 12.1346 14.6407 12.2277 13.7083 12.4937C12.8025 12.7597 12.3497 12.8927 12.3497 12.8927C12.696 12.8129 13.2288 12.8129 13.9481 12.8927C14.6673 12.9725 15.3733 13.0789 16.0659 13.2119C16.0659 13.2385 16.0526 13.2651 16.026 13.2917L15.9461 13.3715C15.5198 13.9035 15.0936 14.4355 14.6673 14.9675C14.2411 15.4729 13.8015 15.965 13.3487 16.4438C13.0823 16.7364 12.8159 17.029 12.5494 17.3216C12.283 17.5876 12.0033 17.8536 11.7103 18.1196C11.4705 18.3058 11.2308 18.5053 10.991 18.7181C10.7512 18.9043 10.4848 19.0506 10.1918 19.157C10.032 19.2368 9.85881 19.29 9.67233 19.3166C9.51249 19.3698 9.32601 19.3831 9.11289 19.3565C8.89977 19.3565 8.67333 19.3299 8.43357 19.2767C8.22045 19.2235 7.99401 19.157 7.75425 19.0772C7.59441 19.024 7.43457 18.9575 7.27472 18.8777C7.11488 18.7979 6.96836 18.7048 6.83516 18.5984C6.75524 18.5452 6.68864 18.5319 6.63536 18.5585C6.58208 18.5851 6.54212 18.6117 6.51548 18.6383L5.75624 19.3964C5.70296 19.4496 5.64968 19.5028 5.5964 19.556C5.54312 19.6092 5.48984 19.6624 5.43656 19.7156C5.38328 19.7688 5.33 19.8087 5.27672 19.8353C5.25008 19.8885 5.21012 19.9417 5.15684 19.9949C5.10356 20.0481 5.05028 20.1013 4.997 20.1545C4.94372 20.2077 4.8638 20.2875 4.75724 20.3939C4.65068 20.5003 4.54412 20.5934 4.43756 20.6732C4.35764 20.7796 4.27772 20.8727 4.1978 20.9525L3.35864 21.7904L3.1988 21.8702C3.14552 21.8968 3.09224 21.9101 3.03896 21.9101H2.67932H2.27972C2.17316 21.9101 2.09324 21.8835 2.03996 21.8303C2.01332 21.8037 2 21.7372 2 21.6308V21.2717V20.9126C2 20.8328 2.01332 20.7397 2.03996 20.6333C2.09324 20.5535 2.15984 20.487 2.23976 20.4338L3.95804 18.7181L5.67632 17.0024C6.10256 16.5768 6.5288 16.1645 6.95504 15.7655C7.38129 15.3665 7.80753 14.9542 8.23377 14.5286C8.63337 14.1562 9.01965 13.7705 9.39261 13.3715C9.79221 12.9725 10.1918 12.5735 10.5914 12.1745L12.03 10.6982C13.0157 9.71399 13.5085 9.22189 13.5085 9.22189C13.9614 8.7963 14.4009 8.3707 14.8272 7.9451C15.2801 7.4929 15.7196 7.0407 16.1459 6.5885L16.2657 6.4688C16.319 6.4422 16.3723 6.4156 16.4256 6.389L16.3856 6.3491C16.3323 6.3491 16.2924 6.3757 16.2657 6.4289C16.2391 6.4555 16.1991 6.4821 16.1459 6.5087C15.7463 6.8013 15.3467 7.1205 14.9471 7.4663C14.5475 7.7855 14.1479 8.118 13.7483 8.4638C13.1355 8.916 12.5361 9.39479 11.95 9.90019C11.364 10.379 10.7779 10.8711 10.1918 11.3765C9.41925 11.9883 8.67333 12.6001 7.95405 13.2119C7.23477 13.8237 6.48884 14.4222 5.71628 15.0074C5.60972 15.1138 5.47652 15.2335 5.31668 15.3665C5.18348 15.4729 5.0636 15.5793 4.95704 15.6857C4.87712 15.7655 4.81052 15.7921 4.75724 15.7655C4.7306 15.7389 4.71728 15.6857 4.71728 15.6059C4.664 15.4463 4.62404 15.2867 4.5974 15.1271C4.57076 14.9675 4.55744 14.8079 4.55744 14.6483C4.5308 14.4621 4.54412 14.2892 4.5974 14.1296C4.65068 13.97 4.7306 13.8104 4.83716 13.6508C5.07692 13.1986 5.35664 12.7863 5.67632 12.4139C6.02264 12.0415 6.38228 11.6824 6.75524 11.3366C7.28804 10.8046 7.83417 10.2992 8.39361 9.82039C8.95305 9.31499 9.53913 8.83619 10.1518 8.384C10.6047 7.985 11.0709 7.6126 11.5504 7.2668C12.0566 6.8944 12.5494 6.5486 13.029 6.2294C13.8282 5.6176 14.6407 5.0457 15.4665 4.5137C16.2924 3.9817 17.1582 3.4896 18.0639 3.0374C18.4103 2.8512 18.7433 2.6916 19.0629 2.5586C19.4093 2.399 19.7689 2.2527 20.1419 2.1197C20.2751 2.0665 20.4216 2.0399 20.5814 2.0399C20.7679 2.0133 20.9411 2 21.1009 2H21.3806C21.4339 2 21.5005 2.0133 21.5804 2.0399Z" fill="currentColor" />
    </svg>
  );
}

const chartCardIconButtonSx = {
  color: c.icon.secondary,
  "&:hover": { backgroundColor: c.background.control.hover },
  "&:focus-visible": {
    outline: `2px solid ${c.border.button.focus}`,
    outlineOffset: "1px",
  },
} as const;

/**
 * Title bar rendered at the top of every chart card.
 * Includes a "Open in Compose" icon button and a download menu (SVG / PNG / CSV).
 */
function ChartCardDownloadMenu() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <MuiTooltip title="Open new query in Compose" placement="top">
        <IconButton size="small" sx={chartCardIconButtonSx}>
          <ComposeIcon size={15} />
        </IconButton>
      </MuiTooltip>
      <IconButton size="small" sx={chartCardIconButtonSx} onClick={(e) => setMenuAnchor(e.currentTarget)}>
        <MoreHorizontal size={15} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>Download SVG</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Download PNG</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Download CSV</MenuItem>
      </Menu>
    </Box>
  );
}

export function ChartCardHeader({ title }: { title: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="subtitle1">{title}</Typography>
      <ChartCardDownloadMenu />
    </Box>
  );
}

// ─── Chart data table ─────────────────────────────────────────────────────────

/**
 * Sortable companion table rendered alongside a chart.
 * Manages its own sorting and header-hover state internally.
 * Pass `data` and TanStack `columns`; the component handles the rest.
 */
export function ChartDataTable<T extends object>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T, unknown>[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const cellBase: React.CSSProperties = {
    padding: "6px 12px",
    borderBottom: "1px solid rgb(240, 240, 240)",
    fontSize: 13,
  };

  return (
    <Box sx={{ width: "100%", height: "100%", "& tbody tr": { cursor: "pointer", "&:hover": { backgroundColor: "rgb(252, 252, 252)" } } }}>
      <table style={{ borderCollapse: "collapse", width: "100%", height: "100%" }}>
        <Box component="thead">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const align = (header.column.columnDef.meta?.align ?? "left") as "left" | "center" | "right";
                return (
                  <th
                    key={header.id}
                    style={{
                      ...(header.column.columnDef.meta?.flexible ? {} : { width: header.column.getSize(), minWidth: header.column.getSize() }),
                      ...cellBase,
                      textAlign: align,
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                      userSelect: "none",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    onMouseEnter={() => header.column.getCanSort() && setHoveredHeader(header.id)}
                    onMouseLeave={() => setHoveredHeader(null)}
                  >
                    <div style={{ display: "flex", alignItems: "center", fontWeight: 500, color: c.text.secondary, gap: 8, justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        header.column.getIsSorted() === "asc" ? <ArrowUp size={16} /> :
                        header.column.getIsSorted() === "desc" ? <ArrowDown size={16} /> :
                        hoveredHeader === header.id ? <ArrowUpDown size={16} style={{ opacity: 0.5 }} /> : null
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </Box>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const align = (cell.column.columnDef.meta?.align ?? "left") as "left" | "center" | "right";
                return (
                  <td
                    key={cell.id}
                    style={{
                      ...(cell.column.columnDef.meta?.flexible ? {} : { width: cell.column.getSize(), minWidth: cell.column.getSize() }),
                      ...cellBase,
                      color: c.text.secondary,
                      textAlign: align,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

// ─── Chart card with chart/table switcher ────────────────────────────────────

const switcherButtonSx = (active: boolean) => ({
  px: 1.5,
  py: 0.5,
  fontSize: "13px",
  fontWeight: 500,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor: active ? c.background.surface.raised : "transparent",
  color: active ? c.text.primary : c.text.secondary,
  transition: "background-color 0.15s",
  "&:hover": {
    backgroundColor: active ? c.background.surface.raised : c.background.surface.overlay,
  },
});

/**
 * Card with a chart/table context switcher rendered in the header row.
 * The switcher appears to the right of the title. Chart view is shown by default.
 * Pass `legend` separately — it is rendered below the chart, centered.
 *
 * Usage:
 *   <ChartCardWithSwitcher
 *     title="Popular documents"
 *     legend={<ChartLegend items={...} {...legendHook} />}
 *     chart={<ResponsiveContainer>...</ResponsiveContainer>}
 *     table={<ChartDataTable data={rows} columns={cols} />}
 *   />
 */
export function ChartCardWithSwitcher({
  title,
  legend,
  chart,
  table,
}: {
  title: string;
  legend?: React.ReactNode;
  chart: React.ReactNode;
  table: React.ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <Box sx={{ p: 3, border: `1px solid ${c.border.default}`, borderRadius: 2, backgroundColor: c.background.surface.default }}>
      {/* Header row: title + switcher + download menu */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>{title}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            border: `1px solid ${c.border.default}`,
            borderRadius: "8px",
            p: 0.5,
            mr: 1,
          }}
        >
          <Box
            component="button"
            onClick={() => setView("chart")}
            sx={switcherButtonSx(view === "chart")}
          >
            Chart
          </Box>
          <Box
            component="button"
            onClick={() => setView("table")}
            sx={switcherButtonSx(view === "table")}
          >
            Table
          </Box>
        </Box>
        <ChartCardDownloadMenu />
      </Box>

      {view === "chart" ? (
        <>
          {chart}
          {legend && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
              {legend}
            </Box>
          )}
        </>
      ) : table}
    </Box>
  );
}

// ─── Y-axis label utilities ───────────────────────────────────────────────────

const yAxisFont = fontFamily;

function measureTextWidth(text: string, fontSize = 12): number {
  if (typeof document === "undefined") return text.length * 6.5;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 6.5;
  ctx.font = `${fontSize}px ${yAxisFont}`;
  return ctx.measureText(text).width;
}

function truncateToWidth(text: string, maxPx: number): string {
  if (measureTextWidth(text) <= maxPx) return text;
  let s = text;
  while (s.length > 0 && measureTextWidth(s + "…") > maxPx) {
    s = s.slice(0, -1);
  }
  return s + "…";
}

/**
 * Returns the YAxis width needed to fit the longest label, capped at maxWidth.
 * Adds 8px of right padding so text doesn't sit flush against the bars.
 */
export function computeYAxisWidth(labels: string[], maxWidth = 150): number {
  const widest = labels.reduce((w, l) => Math.max(w, measureTextWidth(l)), 0);
  return Math.min(Math.ceil(widest) + 8, maxWidth);
}

/**
 * Custom Recharts YAxis tick that truncates long labels to a pixel budget.
 * Shows the full text as a native SVG tooltip on hover when truncated.
 * Pair with computeYAxisWidth to size the YAxis width to fit the labels.
 *
 * Usage:
 *   const w = computeYAxisWidth(data.map(d => d.name));
 *   <YAxis width={w} tick={<TruncatedYAxisTick maxWidth={w - 4} />} />
 */
export function TruncatedYAxisTick({
  x = 0,
  y = 0,
  payload,
  maxWidth = 146,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  maxWidth?: number;
}) {
  const rawText = payload?.value ?? "";
  const text = truncateToWidth(rawText, maxWidth);
  const isTruncated = text !== rawText;
  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      dominantBaseline="middle"
      fill={c.text.secondary}
      fontSize={12}
      fontFamily={yAxisFont}
    >
      {isTruncated && <title>{rawText}</title>}
      {text}
    </text>
  );
}
