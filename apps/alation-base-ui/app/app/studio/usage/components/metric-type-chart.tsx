"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricTypeData {
  type: string;
  count: number;
  uniqueRequests: number;
}

interface MetricTypeChartProps {
  data: MetricTypeData[];
}

export function MetricTypeChart({ data }: MetricTypeChartProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
        border: `1px solid ${theme.palette.neutral[300]}`,
        mb: "24px",
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: "20px",
        }}
      >
        Usage by metric type
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.neutral[300]}
          />
          <XAxis
            dataKey="type"
            stroke={theme.palette.text.secondary}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: `1px solid ${theme.palette.neutral[300]}`,
              borderRadius: "6px",
            }}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill={theme.palette.teal[500]}
            name="Total count"
          />
          <Bar
            dataKey="uniqueRequests"
            fill={theme.palette.blue[500]}
            name="Unique requests"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

