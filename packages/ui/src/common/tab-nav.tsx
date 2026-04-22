"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import React from "react";

export interface TabNavItem {
  id: string;
  label: string;
  path: string;
}

interface TabNavProps {
  tabs: TabNavItem[];
  activeTabId: string;
  basePath: string;
}

export function TabNav({ tabs, activeTabId, basePath }: TabNavProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        height: "40px",
        px: "24px",
        backgroundColor: "white",
        borderBottom: `1px solid ${theme.tokens.color.border.default}`,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const href = `${basePath}${tab.path}`;
        return (
          <Link key={tab.id} href={href} style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                px: "8px",
                pt: "4px",
                pb: "8px",
                cursor: "pointer",
                borderBottom: isActive
                  ? `2px solid ${theme.tokens.color.border.button.primary}`
                  : "2px solid transparent",
                "&:hover": {
                  backgroundColor: isActive
                    ? "transparent"
                    : theme.tokens.color.background.surface.secondary,
                },
              }}
            >
              <Typography
                variant="button"
                sx={{
                  color: isActive
                    ? theme.tokens.color.text.button.primary
                    : theme.tokens.color.text.secondary,
                  textTransform: "none",
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          </Link>
        );
      })}
    </Box>
  );
}


