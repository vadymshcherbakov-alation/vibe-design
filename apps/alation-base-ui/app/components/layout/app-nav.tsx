"use client";
import { Box } from "@mui/material";
import { NavButton } from "./nav-button";
import { usePathname } from "next/navigation";
import NavMenuIcon from "./assets/icon/nav-menu.svg";
import NavCatalogIcon from "./assets/icon/nav-catalog.svg";
import NavComposeIcon from "./assets/icon/nav-compose.svg";
import NavCurateAndGovernIcon from "./assets/icon/nav-govern.svg";
import NavAlationAnalyticsIcon from "./assets/icon/nav-analytics.svg";
import NavDataProductsIcon from "./assets/icon/nav-data-marketplace.svg";
import NavDataQualityIcon from "./assets/icon/nav-data-quality.svg";
import NavCDEManagerIcon from "./assets/icon/nav-cde.svg";
import NavAgentStudioIcon from "./assets/icon/nav-agent-studio.svg";
import NavAddOnIcon from "./assets/icon/nav-add-on.svg";

const navigationItems = [
  { id: 1, name: "Menu", icon: NavMenuIcon },
  {
    id: 2,
    name: "Catalog",
    icon: NavCatalogIcon,
    href: "/app",
    activeMatchExact: true,
  },
  { id: 3, name: "Compose", icon: NavComposeIcon, href: "/app/compose" },
  {
    id: 4,
    name: "Curate and Govern",
    icon: NavCurateAndGovernIcon,
    href: "/app/governance",
  },
  {
    id: 5,
    name: "Alation Analytics",
    icon: NavAlationAnalyticsIcon,
    href: "/app/analytics",
  },
  {
    id: 6,
    name: "Data Products",
    icon: NavDataProductsIcon,
    href: "/app/marketplace",
  },
  {
    id: 7,
    name: "Data Quality",
    icon: NavDataQualityIcon,
    href: "/app/data_quality",
  },
  { id: 8, name: "CDE Manager", icon: NavCDEManagerIcon, href: "/app/cde-hub" },
  {
    id: 9,
    name: "Agent Studio",
    icon: NavAgentStudioIcon,
    href: "/app/studio/agents",
    activeMatchPrefix: "/app/studio",
  },
];

type AppSidebarProps = {
  className?: string;
  onMenuClick?: () => void;
};

export function AppSidebar({ className, onMenuClick }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Box
      className={className}
      sx={{
        px: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          py: "10px",
        }}
      >
        {navigationItems.map((item) => {
          const activePath = item.activeMatchPrefix ?? item.href;
          const isActive = item.activeMatchExact
            ? pathname === item.href
            : Boolean(
                activePath &&
                (pathname === activePath ||
                  pathname?.startsWith(activePath + "/")),
              );
          return (
            <NavButton
              key={item.id}
              name={item.name}
              icon={item.icon}
              href={item.href}
              isActive={item.id === 1 ? false : isActive}
              onClick={item.id === 1 ? onMenuClick : undefined}
            />
          );
        })}
      </Box>

      <Box
        sx={{
          pb: "10px",
        }}
      >
        <NavButton
          name="Add-Ons"
          icon={NavAddOnIcon}
          href="/app/add-ons"
          isActive={
            pathname === "/app/add-ons" ||
            Boolean(pathname?.startsWith("/app/add-ons/"))
          }
        />
      </Box>
    </Box>
  );
}
