"use client";

import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  badgeCount?: number;
  headerRightContent?: React.ReactNode;
  hideHeaderRightWhenCollapsed?: boolean;
  /** When true, expands the section (e.g. when entering edit mode to open all at once). */
  forceExpandedWhen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  defaultExpanded = true,
  badgeCount,
  headerRightContent,
  hideHeaderRightWhenCollapsed = false,
  forceExpandedWhen,
  children,
}: CollapsibleSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // When forceExpandedWhen becomes true (e.g. edit mode), expand this section
  useEffect(() => {
    if (forceExpandedWhen) {
      setExpanded(true);
    }
  }, [forceExpandedWhen]);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        "&:hover": {
          borderColor: theme.palette.neutral[400],
          boxShadow: "rgba(20, 20, 20, 0.15) 0px 4px 8px 0px",
        },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          {badgeCount !== undefined && (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "2px",
                backgroundColor: theme.palette.neutral[100],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {badgeCount}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(!hideHeaderRightWhenCollapsed || expanded) && headerRightContent}
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
