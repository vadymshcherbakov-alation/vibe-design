"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface SummaryCardsProps {
  totalCount: number;
  uniqueRequests: number;
}

export function SummaryCards({
  totalCount,
  uniqueRequests,
}: SummaryCardsProps) {
  const theme = useTheme();

  const cards = [
    {
      label: "Total tool calls",
      value: totalCount.toLocaleString(),
    },
    {
      label: "Unique requests",
      value: uniqueRequests.toLocaleString(),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        mb: "24px",
      }}
    >
      {cards.map((card, index) => {
        return (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${theme.palette.neutral[300]}`,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "320px",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

