"use client";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Profile", href: "/app/account/profile" },
  { label: "Notifications", href: "/app/account/notifications" },
  { label: "Authentication", href: "/app/account/authentication" },
  { label: "DB connections", href: "/app/account/db-connections" },
  { label: "Other", href: "/app/account/other" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeIndex = TABS.findIndex((t) => pathname.startsWith(t.href));

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h1" sx={{ fontWeight: 600 }}>Account</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeIndex === -1 ? 0 : activeIndex}>
          {TABS.map((t) => (
            <Tab key={t.href} label={t.label} component={Link} href={t.href} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, backgroundColor: "#FAFAFA", overflow: "auto" }}>
        <Box sx={{ maxWidth: "1024px", margin: "0 auto", px: "24px", py: "24px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
