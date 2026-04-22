"use client";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

interface UserUsageData {
  userId: number | null;
  userName: string;
  count: number;
  uniqueRequests: number;
}

interface UsageByUsersChartProps {
  data: UserUsageData[];
  totalUsers: number;
}

const getUserAvatarColor = (userId: number | null): string => {
  if (userId === null) return "#949494"; // gray for null users
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

const getUserInitials = (userId: number | null): string => {
  if (userId === null) return "N/A";
  return `U${userId}`;
};

export function UsageByUsersChart({ data, totalUsers }: UsageByUsersChartProps) {
  const theme = useTheme();
  const [selectedUserId, setSelectedUserId] = useState<number | null | string>(null);

  // Calculate total count for percentage-based bars
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

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
          Usage by users
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "13px",
          color: theme.palette.text.secondary,
          mb: "12px",
        }}
      >
        {data.length} of {totalUsers} total {totalUsers === 1 ? "user" : "users"}
      </Typography>
      <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
        {data.map((item) => {
          const isSelected = selectedUserId === item.userId;
          const barWidth = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
          return (
            <Box
              key={item.userId ?? "null"}
              onClick={() => setSelectedUserId(item.userId)}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                mb: "4px",
                backgroundColor: "transparent",
                "&:hover::before": {
                  opacity: 0.7,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${barWidth}%`,
                  backgroundColor: theme.palette.neutral[100],
                  borderRadius: "6px",
                  zIndex: 0,
                  transition: "opacity 0.2s ease",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Avatar
                  sx={{
                    width: "20px",
                    height: "20px",
                    fontSize: "10px",
                    backgroundColor: getUserAvatarColor(item.userId),
                    flexShrink: 0,
                  }}
                >
                  {getUserInitials(item.userId)}
                </Avatar>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.userName}
                </Typography>
              </Box>
              <Typography
                sx={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  ml: "12px",
                }}
              >
                {item.count.toLocaleString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
