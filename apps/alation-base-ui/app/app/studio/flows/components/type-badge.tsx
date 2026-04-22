"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface TypeBadgeProps {
  type: string;
  showTooltip?: boolean;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const theme = useTheme();

  const badgeContent = (
    <Box
      sx={{
        px: "4px",
        py: 0,
        backgroundColor: "#f9f9fb",
        borderRadius: "2px",
        flexShrink: 0,
      }}
    >
      <Typography variant="code">
        {type}
      </Typography>
    </Box>
  );

  return badgeContent;
}
