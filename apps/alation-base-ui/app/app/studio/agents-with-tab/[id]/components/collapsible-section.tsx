"use client";

import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  defaultExpanded = true,
  children,
}: CollapsibleSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
      }}
    >
      {/* Section Header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "16px",
          py: "12px",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        <IconButton
          size="small"
          sx={{
            width: "28px",
            height: "28px",
            transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
            transition: `transform ${"150ms"}`,
          }}
        >
          <ChevronUp size={16} />
        </IconButton>
      </Box>

      {/* Section Content */}
      <Collapse in={expanded}>
        <Box
          sx={{
            px: "16px",
            pt: "8px",
            pb: "24px",
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
