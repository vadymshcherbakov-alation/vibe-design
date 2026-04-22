"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

interface KeyboardShortcutProps {
  mac?: string;
  windows?: string;
  variant?: "light" | "dark";
}

export function KeyboardShortcut({
  mac = "⌘/",
  windows = "Ctrl+/",
  variant = "light",
}: KeyboardShortcutProps) {
  const theme = useTheme();
  const [isMac, setIsMac] = useState(false);

  // Detect platform for keyboard shortcut display
  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = navigator.platform.toUpperCase();
      const isMacPlatform =
        platform.indexOf("MAC") >= 0 ||
        navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
      setIsMac(isMacPlatform);
    }
  }, []);

  const isDark = variant === "dark";

  return (
    <Box
      component="span"
      sx={{
        px: "4px",
        py: "2px",
        fontSize: "11px",
        fontWeight: 400,
        color: isDark
          ? theme.palette.neutral[50]
          : theme.palette.text.secondary,
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.12)"
          : theme.palette.neutral[100],
        borderRadius: "4px",
      }}
    >
      {isMac ? mac : windows}
    </Box>
  );
}
