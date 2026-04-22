"use client";
import { Box, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

interface TierUsageData {
  tier: "free" | "paid";
  count: number;
  uniqueRequests: number;
}

interface UsageByTierChartProps {
  data: TierUsageData[];
}

export function UsageByTierChart({ data }: UsageByTierChartProps) {
  const theme = useTheme();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Calculate total count for percentage-based bars
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
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
          Usages by tiers
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "13px",
          color: theme.palette.text.secondary,
          mb: "12px",
        }}
      >
        {data.length} {data.length === 1 ? "tier" : "tiers"}
      </Typography>
      <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
        {data.map((item) => {
          const isSelected = selectedTier === item.tier;
          const backgroundColor =
            item.tier === "paid"
              ? theme.palette.blue[200]
              : theme.palette.neutral[200];
          const textColor =
            item.tier === "paid"
              ? theme.palette.blue[600]
              : theme.palette.neutral[600];
          const displayName =
            item.tier.charAt(0).toUpperCase() + item.tier.slice(1);
          const barWidth = totalCount > 0 ? (item.count / totalCount) * 100 : 0;

          return (
            <Box
              key={item.tier}
              onClick={() => setSelectedTier(item.tier)}
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
                <Chip
                  label={displayName}
                  size="small"
                  sx={{
                    height: "24px",
                    fontSize: "12px",
                    backgroundColor: backgroundColor,
                    color: textColor,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                />
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
