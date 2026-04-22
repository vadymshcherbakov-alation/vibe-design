"use client";
import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-nav";
import { SubNav } from "./sub-nav";
import type { SubNavConfig } from "./sub-nav";
import { defaultSubNavConfigs } from "./sub-nav-configs";

interface AlationLayoutProps {
  children: React.ReactNode;
  subNavConfigs?: Record<string, SubNavConfig>;
}

function findSubNavConfig(
  pathname: string | null,
  configs: Record<string, SubNavConfig>
): SubNavConfig | undefined {
  if (!pathname) return undefined;
  let bestMatch: { prefix: string; config: SubNavConfig } | undefined;
  for (const [prefix, config] of Object.entries(configs)) {
    if (
      (pathname === prefix || pathname.startsWith(prefix + "/")) &&
      (!bestMatch || prefix.length > bestMatch.prefix.length)
    ) {
      bestMatch = { prefix, config };
    }
  }
  return bestMatch?.config;
}

export function AlationLayout({
  children,
  subNavConfigs = defaultSubNavConfigs,
}: AlationLayoutProps) {
  const [isSubNavVisible, setIsSubNavVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only use pathname after component has mounted to avoid hydration mismatch
  const activeSubNav = isMounted ? findSubNavConfig(pathname, subNavConfigs) : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.tokens.palette.neutral[800],
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <AppSidebar
          onMenuClick={() => setIsSubNavVisible((previous) => !previous)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          gap: "8px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <AppHeader />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "visible",
            position: "relative",
          }}
        >
          {isSubNavVisible && activeSubNav && (
            <SubNav config={activeSubNav} />
          )}
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              minHeight: 0,
              minWidth: 0,
              backgroundColor: "white",
              borderTopLeftRadius: "8px",
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
