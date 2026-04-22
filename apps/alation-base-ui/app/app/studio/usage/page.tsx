"use client";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Calendar, Users } from "lucide-react";
import { SummaryCards } from "./components/summary-cards";
import { UsageChart } from "./components/usage-chart";
import { UsageByUsersChart } from "./components/usage-by-users-chart";
import { UsageTable, type UsageMetric } from "./components/usage-table";
import demoData from "./demo-usage-data.json";

type TimeGranularity = "hour" | "day" | "month";
type Duration = "24h" | "7d" | "30d" | "3m" | "12m" | "24m";
type MetricType = "agent" | "tool" | "action" | "all";
type Protocol = "http" | "mcp" | "all";
type TenantUserId = number | "all";

// Get available granularities based on duration
// Hourly data: kept for 30 days
// Daily data: kept for 26 weeks (half a year)
// Monthly data: kept forever
function getAvailableGranularities(duration: Duration): TimeGranularity[] {
  switch (duration) {
    case "24h":
      return ["hour"]; // hourly only
    case "7d":
      return ["hour", "day"]; // hourly or daily
    case "30d":
      return ["day"]; // daily only (too many bars for hourly)
    case "3m":
      return ["day", "month"]; // daily or monthly
    case "12m":
      return ["month"]; // monthly only
    case "24m":
      return ["month"]; // monthly only
    default:
      return ["day"];
  }
}

function getDefaultGranularity(duration: Duration): TimeGranularity {
  switch (duration) {
    case "24h":
    case "7d":
      return "hour"; // Default to hourly for shorter durations
    case "30d":
    case "3m":
      return "day"; // Default to daily
    case "12m":
    case "24m":
      return "month";
    default:
      return "day";
  }
}

interface UsageDataItem {
  tenant_user_id: number | null;
  metric_type: "agent" | "tool" | "action";
  metric_name: string;
  protocol: "http" | "mcp";
  product_area: string;
  count_map: {
    hour?:
      | Record<
          string,
          {
            count: number;
            unique_requests: number;
            free_count?: number;
            paid_count?: number;
          }
        >
      | {};
    day?:
      | Record<
          string,
          {
            count: number;
            unique_requests: number;
            free_count?: number;
            paid_count?: number;
          }
        >
      | {};
    month?:
      | Record<
          string,
          {
            count: number;
            unique_requests: number;
            free_count?: number;
            paid_count?: number;
          }
        >
      | {};
  };
}

interface ChartDataPoint {
  date: string;
  count: number;
  uniqueRequests: number;
  freeCount: number;
  paidCount: number;
}

interface MetricTypeData {
  type: string;
  count: number;
  uniqueRequests: number;
}

function formatTimestamp(
  timestamp: string,
  granularity: TimeGranularity
): Date | null {
  try {
    if (granularity === "hour") {
      // Format: 2025121705
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      const hour = timestamp.substring(8, 10);
      return new Date(`${year}-${month}-${day}T${hour}:00:00`);
    } else if (granularity === "day") {
      // Format: 20251217
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      return new Date(`${year}-${month}-${day}`);
    } else {
      // Format: 202512
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      return new Date(`${year}-${month}-01`);
    }
  } catch {
    return null;
  }
}

function generateDateRange(
  duration: Duration,
  timeGranularity: TimeGranularity
): string[] {
  const dates: string[] = [];
  const now = new Date("2026-01-06T17:00:00"); // Current date/time from system (5 PM)

  if (timeGranularity === "day") {
    let numDays = 7;
    if (duration === "24h") numDays = 1;
    else if (duration === "7d") numDays = 7;
    else if (duration === "30d") numDays = 30;
    else if (duration === "3m") numDays = 90;
    else if (duration === "12m") numDays = 365;
    else if (duration === "24m") numDays = 730;

    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dates.push(`${year}${month}${day}`);
    }
  } else if (timeGranularity === "hour") {
    // Calculate number of hours based on duration
    let numHours = 24;
    if (duration === "24h") numHours = 24;
    else if (duration === "7d") numHours = 7 * 24;
    else if (duration === "30d") numHours = 30 * 24;

    for (let i = numHours - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      dates.push(`${year}${month}${day}${hour}`);
    }
  } else if (timeGranularity === "month") {
    let numMonths = 3;
    if (duration === "3m") numMonths = 3;
    else if (duration === "12m") numMonths = 12;
    else if (duration === "24m") numMonths = 24;
    else numMonths = 3;

    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      dates.push(`${year}${month}`);
    }
  }

  return dates;
}

function processUsageData(
  data: UsageDataItem[],
  timeGranularity: TimeGranularity,
  duration: Duration
): {
  chartData: ChartDataPoint[];
  tableData: UsageMetric[];
  metricTypeData: MetricTypeData[];
  userUsageData: Array<{
    userId: number | null;
    userName: string;
    count: number;
    uniqueRequests: number;
  }>;
  totals: { totalCount: number; uniqueRequests: number };
} {
  const timeKey = timeGranularity;
  const dateRange = generateDateRange(duration, timeGranularity);
  const dateSet = new Set(dateRange);

  // Initialize chart data map with all dates in range
  const chartDataMap = new Map<
    string,
    {
      count: number;
      uniqueRequests: number;
      freeCount: number;
      paidCount: number;
    }
  >();
  dateRange.forEach((date) => {
    chartDataMap.set(date, {
      count: 0,
      uniqueRequests: 0,
      freeCount: 0,
      paidCount: 0,
    });
  });
  const metricMap = new Map<string, UsageMetric>();
  const metricTypeMap = new Map<
    string,
    { count: number; uniqueRequests: number }
  >();
  const userUsageMap = new Map<
    number | null,
    { count: number; uniqueRequests: number }
  >();

  data.forEach((item) => {
    const timeData = item.count_map[timeKey];
    if (!timeData || Object.keys(timeData).length === 0) return;

    // Process chart data - only include data within the date range
    Object.entries(timeData).forEach(([timestamp, values]) => {
      if (!dateSet.has(timestamp)) return; // Skip if not in date range

      const existing = chartDataMap.get(timestamp) || {
        count: 0,
        uniqueRequests: 0,
        freeCount: 0,
        paidCount: 0,
      };

      // If free_count and paid_count are provided, use them
      // Otherwise, count goes to paid by default (for backwards compatibility)
      const freeCount = values.free_count ?? 0;
      const paidCount = values.paid_count ?? values.count;

      chartDataMap.set(timestamp, {
        count: existing.count + values.count,
        uniqueRequests: existing.uniqueRequests + values.unique_requests,
        freeCount: existing.freeCount + freeCount,
        paidCount: existing.paidCount + paidCount,
      });
    });

    // Process table data - only include data within the date range
    const metricKey = `${item.metric_name}_${item.metric_type}_${item.protocol}`;
    const existingMetric = metricMap.get(metricKey);
    let totalCount = 0;
    let totalUniqueRequests = 0;
    let lastUsed: string | null = null;

    Object.entries(timeData).forEach(([timestamp, values]) => {
      if (!dateSet.has(timestamp)) return; // Skip if not in date range
      totalCount += values.count;
      totalUniqueRequests += values.unique_requests;
      if (!lastUsed || timestamp > lastUsed) {
        lastUsed = timestamp;
      }
    });

    // Process user usage data
    const userData = userUsageMap.get(item.tenant_user_id) || {
      count: 0,
      uniqueRequests: 0,
    };
    userUsageMap.set(item.tenant_user_id, {
      count: userData.count + totalCount,
      uniqueRequests: userData.uniqueRequests + totalUniqueRequests,
    });

    if (existingMetric) {
      existingMetric.totalCount += totalCount;
      existingMetric.uniqueRequests += totalUniqueRequests;
      if (lastUsed !== null) {
        const currentLastUsed: string | null = existingMetric.lastUsed;
        if (
          currentLastUsed === null ||
          (lastUsed as string) > currentLastUsed
        ) {
          existingMetric.lastUsed = lastUsed;
        }
      }
    } else {
      metricMap.set(metricKey, {
        metric_name: item.metric_name,
        metric_type: item.metric_type,
        protocol: item.protocol,
        totalCount,
        uniqueRequests: totalUniqueRequests,
        lastUsed,
      });
    }

    // Process metric type data
    const typeData = metricTypeMap.get(item.metric_type) || {
      count: 0,
      uniqueRequests: 0,
    };
    metricTypeMap.set(item.metric_type, {
      count: typeData.count + totalCount,
      uniqueRequests: typeData.uniqueRequests + totalUniqueRequests,
    });
  });

  // Convert chart data to array and sort by date
  const chartData: ChartDataPoint[] = Array.from(chartDataMap.entries())
    .map(([date, values]) => ({
      date,
      count: values.count,
      uniqueRequests: values.uniqueRequests,
      freeCount: values.freeCount,
      paidCount: values.paidCount,
    }))
    .sort((a, b) => {
      const dateA = formatTimestamp(a.date, timeGranularity);
      const dateB = formatTimestamp(b.date, timeGranularity);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

  // Convert table data to array
  const tableData: UsageMetric[] = Array.from(metricMap.values());

  // Convert metric type data to array
  const metricTypeData: MetricTypeData[] = Array.from(
    metricTypeMap.entries()
  ).map(([type, values]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count: values.count,
    uniqueRequests: values.uniqueRequests,
  }));

  // Convert user usage data to array and get top 5 users
  const userUsageData = Array.from(userUsageMap.entries())
    .map(([userId, values]) => ({
      userId,
      userName: userId === null ? "Unknown user" : `User ${userId}`,
      count: values.count,
      uniqueRequests: values.uniqueRequests,
    }))
    .sort((a, b) => {
      // Sort null users last, then by count descending
      if (a.userId === null && b.userId !== null) return 1;
      if (a.userId !== null && b.userId === null) return -1;
      return b.count - a.count;
    })
    .slice(0, 5); // Get top 5 users

  // Calculate totals
  const totals = {
    totalCount: tableData.reduce((sum, item) => sum + item.totalCount, 0),
    uniqueRequests: tableData.reduce(
      (sum, item) => sum + item.uniqueRequests,
      0
    ),
  };

  return {
    chartData,
    tableData,
    metricTypeData,
    userUsageData,
    totals,
  };
}

function filterMetrics(
  data: UsageMetric[],
  searchTerm: string,
  metricType: MetricType,
  protocol: Protocol
): UsageMetric[] {
  return data.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.metric_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = metricType === "all" || item.metric_type === metricType;
    const matchesProtocol = protocol === "all" || item.protocol === protocol;

    return matchesSearch && matchesType && matchesProtocol;
  });
}

const getDurationLabel = (duration: Duration): string => {
  const labels: Record<Duration, string> = {
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "3m": "Last 3 months",
    "12m": "Last 12 months",
    "24m": "Last 24 months",
  };
  return labels[duration];
};

const getUserAvatarColor = (userId: number): string => {
  const colors = [
    "#0072dd", // blue[600]
    "#00cab6", // teal[500]
    "#7c56d5", // purple[600]
    "#488800", // green[600]
    "#e19900", // amber[500]
    "#ca334a", // red[600]
  ] as const;
  const index = userId % colors.length;
  return colors[index] as string;
};

const getUserInitials = (userId: number): string => {
  return `U${userId}`;
};

export default function UsagePage() {
  const theme = useTheme();
  const [duration, setDuration] = useState<Duration>("7d");
  const [timeGranularity, setTimeGranularity] =
    useState<TimeGranularity>("day");
  const [tenantUserIdFilter, setTenantUserIdFilter] =
    useState<TenantUserId>("all");
  const [protocolFilter, setProtocolFilter] = useState<Protocol>("all");

  // Get available granularities based on current duration
  const availableGranularities = useMemo(
    () => getAvailableGranularities(duration),
    [duration]
  );

  // Handle duration change - update granularity if needed
  const handleDurationChange = (newDuration: Duration) => {
    setDuration(newDuration);
    const newAvailableGranularities = getAvailableGranularities(newDuration);
    // If current granularity is not available, set to default
    if (!newAvailableGranularities.includes(timeGranularity)) {
      setTimeGranularity(getDefaultGranularity(newDuration));
    }
  };

  // Get unique tenant_user_ids from data
  const uniqueTenantUserIds = useMemo(() => {
    const ids = new Set<number>();
    (demoData as unknown as UsageDataItem[]).forEach((item) => {
      if (item.tenant_user_id !== null) {
        ids.add(item.tenant_user_id);
      }
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, []);

  // Filter raw data by tenant_user_id
  const filteredRawData = useMemo(() => {
    if (tenantUserIdFilter === "all") {
      return demoData as unknown as UsageDataItem[];
    }
    return (demoData as unknown as UsageDataItem[]).filter(
      (item) => item.tenant_user_id === tenantUserIdFilter
    );
  }, [tenantUserIdFilter]);

  // Process raw data
  const processedData = useMemo(
    () => processUsageData(filteredRawData, timeGranularity, duration),
    [filteredRawData, timeGranularity, duration]
  );

  // Filter data
  const filteredData = useMemo(
    () => filterMetrics(processedData.tableData, "", "all", protocolFilter),
    [processedData.tableData, protocolFilter]
  );

  // Calculate summary stats from filtered data
  const summaryStats = useMemo(() => {
    const totalCount = filteredData.reduce(
      (sum, item) => sum + item.totalCount,
      0
    );
    const uniqueRequests = filteredData.reduce(
      (sum, item) => sum + item.uniqueRequests,
      0
    );

    return {
      totalCount,
      uniqueRequests,
    };
  }, [filteredData]);

  const handleClearFilters = () => {
    setDuration("7d");
    setTenantUserIdFilter("all");
    setProtocolFilter("all");
  };

  const hasActiveFilters =
    tenantUserIdFilter !== "all" || protocolFilter !== "all";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: "24px",
            pb: "4px",
            zIndex: 20,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h2">Usage</Typography>
        </Box>

        {/* Filter Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: "24px",
            pt: "20px",
            pb: "20px",
            gap: "8px",
            flexWrap: "wrap",
            position: "sticky",
            top: 0,
            backgroundColor: "#ffffff",
            zIndex: 20,
          }}
        >
          {/* Duration Filter */}
          <Select
            value={duration}
            onChange={(e) => handleDurationChange(e.target.value as Duration)}
            size="small"
            sx={{
              minWidth: "160px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingLeft: "12px",
              },
            }}
            renderValue={(value) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Calendar
                  size={16}
                  style={{ color: theme.palette.text.primary }}
                />
                <Typography variant="body2">
                  {getDurationLabel(value as Duration)}
                </Typography>
              </Box>
            )}
          >
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="3m">Last 3 months</MenuItem>
            <MenuItem value="12m">Last 12 months</MenuItem>
            <MenuItem value="24m">Last 24 months</MenuItem>
          </Select>

          {/* Granularity Toggle - only show if multiple options available */}
          {availableGranularities.length > 1 && (
            <ToggleButtonGroup
              value={timeGranularity}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setTimeGranularity(newValue as TimeGranularity);
                }
              }}
              size="small"
              sx={{
                backgroundColor: "#f4f4f5",
                borderRadius: "6px",
                padding: "2px",
                gap: "2px",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "none",
                  "&:not(:first-of-type)": {
                    borderRadius: "4px",
                    marginLeft: "0px",
                  },
                  "&:first-of-type": {
                    borderRadius: "4px",
                  },
                },
                "& .MuiToggleButton-root": {
                  padding: "4px 12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  border: "none",
                  color: theme.palette.text.primary,
                  borderRadius: "4px",
                  "&.Mui-selected": {
                    backgroundColor: "#ffffff",
                    color: theme.palette.text.primary,
                    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.33)",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            >
              {availableGranularities.includes("hour") && (
                <ToggleButton value="hour">Hourly</ToggleButton>
              )}
              {availableGranularities.includes("day") && (
                <ToggleButton value="day">Daily</ToggleButton>
              )}
              {availableGranularities.includes("month") && (
                <ToggleButton value="month">Monthly</ToggleButton>
              )}
            </ToggleButtonGroup>
          )}

          <Select
            value={tenantUserIdFilter}
            onChange={(e) =>
              setTenantUserIdFilter(
                e.target.value === "all"
                  ? "all"
                  : (Number(e.target.value) as TenantUserId)
              )
            }
            size="small"
            sx={{
              minWidth: "150px",
              ...(tenantUserIdFilter !== "all" && {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${theme.palette.primary.main} !important`,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${theme.palette.primary.main} !important`,
                },
              }),
            }}
          >
            <MenuItem value="all">
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users
                  size={16}
                  style={{ color: theme.palette.text.secondary }}
                />
                <Typography>All users</Typography>
              </Box>
            </MenuItem>
            {uniqueTenantUserIds.map((id) => (
              <MenuItem key={id} value={id.toString()}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Avatar
                    sx={{
                      width: "20px",
                      height: "20px",
                      fontSize: "10px",
                      backgroundColor: getUserAvatarColor(id),
                    }}
                  >
                    {getUserInitials(id)}
                  </Avatar>
                  <Typography>User {id}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>

          <Select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value as Protocol)}
            size="small"
            sx={{
              minWidth: "120px",
              ...(protocolFilter !== "all" && {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${theme.palette.primary.main} !important`,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${theme.palette.primary.main} !important`,
                },
              }),
            }}
          >
            <MenuItem value="all">All protocols</MenuItem>
            <MenuItem value="http">HTTP</MenuItem>
            <MenuItem value="mcp">MCP</MenuItem>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              sx={{
                height: "36px",
                fontSize: "13px",
              }}
            >
              Clear filters
            </Button>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ p: "24px", pt: "0px" }}>
          {/* Summary Cards */}
          <SummaryCards
            totalCount={summaryStats.totalCount}
            uniqueRequests={summaryStats.uniqueRequests}
          />

          {/* Charts */}
          {/* First row: Total tool calls over time (full width) */}
          <Box
            sx={{
              mb: "24px",
              height: "340px",
            }}
          >
            <UsageChart
              data={processedData.chartData}
              timeGranularity={timeGranularity}
              metric="count"
              title="Total tool calls over time"
            />
          </Box>

          {/* Second row: Unique requests and Usage by users (side by side) */}
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              mb: "24px",
              height: "340px",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <UsageChart
                data={processedData.chartData}
                timeGranularity={timeGranularity}
                metric="uniqueRequests"
                title="Unique requests over time"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UsageByUsersChart
                data={processedData.userUsageData}
                totalUsers={uniqueTenantUserIds.length}
              />
            </Box>
          </Box>

          {/* Table */}
          <UsageTable data={filteredData} />
        </Box>
      </Box>
    </Box>
  );
}
