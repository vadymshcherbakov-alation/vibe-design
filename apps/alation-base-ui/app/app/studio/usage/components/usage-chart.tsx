"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

interface ChartDataPoint {
  date: string;
  count: number;
  uniqueRequests: number;
  freeCount: number;
  paidCount: number;
}

interface UsageChartProps {
  data: ChartDataPoint[];
  timeGranularity: "hour" | "day" | "month";
  metric?: "count" | "uniqueRequests";
  title?: string;
}

export function UsageChart({ 
  data, 
  timeGranularity, 
  metric, 
  title,
}: UsageChartProps) {
  const theme = useTheme();

  const formatDate = (dateStr: string) => {
    if (timeGranularity === "hour") {
      // Format: 2025121705 -> 05
      const hour = dateStr.substring(8, 10);
      return hour;
    } else if (timeGranularity === "day") {
      // Format: 20251217 -> Dec 17
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      // Format: 202512 -> Dec 2025
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const date = new Date(`${year}-${month}-01`);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  };

  // Format date for tooltip (full date with time)
  const formatTooltipDate = (dateStr: string) => {
    if (timeGranularity === "hour") {
      // Format: 2025121705 -> Dec 17, 05:00
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(8, 10);
      const date = new Date(`${year}-${month}-${day}T${hour}:00:00`);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) + ", " + date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (timeGranularity === "day") {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const date = new Date(`${year}-${month}-01`);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  };

  const formattedData = data.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date),
    tooltipDate: formatTooltipDate(point.date),
  }));

  // Determine which metric to show
  const chartTitle = title || (metric === "uniqueRequests" ? "Unique requests over time" : "Total tool calls over time");
  
  // Check if we're showing the count metric (which has free/paid tier data)
  const isCountMetric = metric === "count" || !metric;

  // Colors for tiers
  const FREE_TIER_COLOR = "#c4c4c4";
  const PAID_TIER_COLOR = "#0072dd";
  const FREE_TIER_DAYS = 4; // First 4 bars with data are free tier

  // Find indices of bars that have data and determine which are free tier
  const indicesWithData: number[] = [];
  formattedData.forEach((point, idx) => {
    const value = isCountMetric ? point.count : point.uniqueRequests;
    if (value > 0) {
      indicesWithData.push(idx);
    }
  });

  // Create a set of indices that should be gray (free tier)
  const freeTierIndices = new Set(indicesWithData.slice(0, FREE_TIER_DAYS));

  // Function to get bar color based on index
  const getBarColor = (index: number) => {
    if (!isCountMetric) return PAID_TIER_COLOR; // Unique requests chart is all blue
    return freeTierIndices.has(index) ? FREE_TIER_COLOR : PAID_TIER_COLOR;
  };

  // Custom tooltip
  const tooltipLabel = isCountMetric ? "Total tool calls" : "Unique requests";
  
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string; payload?: { tooltipDate?: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value || 0;
      const tooltipDate = payload[0]?.payload?.tooltipDate || "";
      return (
        <Box
          sx={{
            backgroundColor: "white",
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
            padding: "8px 12px",
            boxShadow: "rgba(87, 84, 91, 0.06) 0px 0px 0px 2px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: "13px",
              fontWeight: 500,
              mb: "4px",
            }}
          >
            {tooltipDate}
          </Typography>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "13px",
            }}
          >
            {tooltipLabel}: {value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
        border: `1px solid ${theme.palette.neutral[300]}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {chartTitle}
        </Typography>
        {/* Legend - only show for count metric */}
        {isCountMetric && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: FREE_TIER_COLOR,
                  borderRadius: "2px",
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                Free tier
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: PAID_TIER_COLOR,
                  borderRadius: "2px",
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                Paid tier
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barCategoryGap="40%"
          >
            <CartesianGrid
              stroke={"rgb(240, 240, 240)"}
              strokeDasharray="0"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="formattedDate"
              stroke={theme.palette.text.secondary}
              style={{ fontSize: "13px" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={{ fontSize: "13px" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey={isCountMetric ? "count" : "uniqueRequests"}
              fill={PAID_TIER_COLOR}
              isAnimationActive={false}
            >
              {formattedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
