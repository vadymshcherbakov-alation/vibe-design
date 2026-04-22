"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ItemTypeIcon } from "../../../../../studio/flows/components/item-type-icon";

interface Metric {
  label: string;
  value: string;
}

interface MetricCardsProps {
  metrics: Metric[];
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: "24px",
        pb: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {metrics.map((metric, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px",
              border: `1px solid ${theme.palette.neutral[300]}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: "180px",
              flex: 1,
              maxWidth: "220px",
            }}
          >
            {/* Metric Label */}
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {metric.label}
            </Typography>

            {/* Metric Value */}
            {metric.label === "Agent" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ItemTypeIcon type="Agent" size={20} />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {metric.value}
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                }}
              >
                {metric.value}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
