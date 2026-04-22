"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Minus,
} from "lucide-react";

type Trend = "up" | "down" | "flat";

const LISTING_ACTIVITY_ITEMS: { label: string; value: number; trend: Trend; trendValue: string }[] = [
  { label: "Listed", value: 48, trend: "flat", trendValue: "No change" },
  { label: "Pending approvals", value: 24, trend: "up", trendValue: "20%" },
  { label: "Unlisted recently", value: 8, trend: "down", trendValue: "16%" },
];

const BADGE_TAGS = ["Not Empty", "Owner", "Product Thinking", "+3"];

function getTrendIcon(trend: Trend) {
  return trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
}

interface StatCardProps {
  label: string;
  sublabel: string;
  value: number | string;
  trend: Trend;
  trendValue: string;
}

function StatCard({ label, sublabel, value, trend, trendValue }: StatCardProps) {
  const theme = useTheme();
  const trendColor =
    trend === "up"
      ? theme.palette.success.main
      : trend === "down"
      ? theme.palette.error.main
      : theme.palette.info.main;
  const TrendIcon = getTrendIcon(trend);

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
      }}
    >
      <Typography sx={{ fontSize: "13px", fontWeight: 500, color: theme.palette.text.primary }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
          {sublabel}
        </Typography>
        <Info size={12} color={theme.palette.text.secondary} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <TrendIcon size={14} color={trendColor} />
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: trendColor }}>
            {trendValue}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

interface SectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({ title, action, children }: SectionCardProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral[300]}`,
        borderRadius: "8px",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}

function MetaRow({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
      {label}
    </Typography>
  );
}

function IconRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {icon}
      <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function ManageMarketplacePage() {
  const theme = useTheme();
  const iconColor = theme.palette.text.secondary;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          px: "24px",
          pt: "20px",
          pb: 0,
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
          Manage Marketplace
        </Typography>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ ml: "-12px" }}>
          {["Overview", "Data products", "Insights", "Permissions"].map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>

      {activeTab !== 0 ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "15px", color: theme.palette.text.disabled }}>
            {["Overview", "Data products", "Insights", "Permissions"][activeTab]} content goes here
          </Typography>
        </Box>
      ) : (
      <Box sx={{ flex: 1, overflowY: "auto", p: "24px" }}>
      <Box sx={{ maxWidth: "860px", mx: "auto", display: "flex", flexDirection: "column", gap: "32px" }}>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
              Insights
            </Typography>
            <IconButton size="small" onClick={() => setActiveTab(2)} sx={{ color: iconColor }}>
              <ArrowRight size={18} />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", gap: "16px" }}>
            <StatCard label="Data products" sublabel="Actively used" value={8} trend="down" trendValue="16%" />
            <StatCard label="Consumers" sublabel="Daily active users" value={15} trend="up" trendValue="20%" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
              Listing Activity
            </Typography>
            <IconButton size="small" onClick={() => setActiveTab(1)} sx={{ color: iconColor }}>
              <ArrowRight size={18} />
            </IconButton>
          </Box>
          <Box
            sx={{
              border: `1px solid ${theme.palette.neutral[300]}`,
              borderRadius: "8px",
              p: "16px",
              display: "flex",
              gap: "0",
            }}
          >
            {LISTING_ACTIVITY_ITEMS.map((item) => {
              const trendColor =
                item.trend === "up"
                  ? theme.palette.success.main
                  : item.trend === "down"
                  ? theme.palette.error.main
                  : theme.palette.info.main;
              const TrendIcon = getTrendIcon(item.trend);
              return (
                <Box
                  key={item.label}
                  sx={{
                    flex: 1,
                    px: "16px",
                    "&:first-of-type": { pl: 0 },
                    "&:last-of-type": { pr: 0 },
                  }}
                >
                  <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary, mb: "4px" }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
                      {item.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      <TrendIcon size={14} color={trendColor} />
                      <Typography sx={{ fontSize: "12px", fontWeight: 500, color: trendColor }}>
                        {item.trendValue}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
            Marketplace details
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <SectionCard
              title="Marketplace info"
              action={<Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Update</Button>}
            >
              <MetaRow label="Name: 1Marketplace" />
              <MetaRow label="Banner: Configured" />
            </SectionCard>

            <SectionCard
              title="Permissions"
              action={
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Chip
                    icon={<Lock size={11} />}
                    label="Public"
                    size="small"
                    sx={{ height: "20px", fontSize: "12px", backgroundColor: theme.palette.neutral[200], "& .MuiChip-label": { px: "6px" }, "& .MuiChip-icon": { ml: "5px" } }}
                  />
                  <Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Manage</Button>
                </Box>
              }
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 500, color: theme.palette.text.primary }}>
                  Ryan McGinty
                </Typography>
                <Typography
                  component="a"
                  href="mailto:ryan.mcginty@alation.com"
                  sx={{ fontSize: "13px", color: theme.palette.info.main, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  ryan.mcginty@alation.com
                </Typography>
              </Box>
              <IconRow icon={<Users size={14} color={iconColor} />} label="20 additional admins" />
            </SectionCard>

            <SectionCard
              title="Badges"
              action={
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Chip label="6" size="small" sx={{ height: "20px", fontSize: "12px", backgroundColor: theme.palette.neutral[200], "& .MuiChip-label": { px: "6px" } }} />
                  <Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Manage</Button>
                </Box>
              }
            >
              <IconRow icon={<ShieldCheck size={14} color={iconColor} />} label="6 badges defined" />
              <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {BADGE_TAGS.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ height: "20px", fontSize: "12px", backgroundColor: theme.palette.neutral[200], color: theme.palette.text.secondary, "& .MuiChip-label": { px: "8px" } }}
                  />
                ))}
              </Box>
            </SectionCard>

            <SectionCard
              title="Catalog integration"
              action={<Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Manage</Button>}
            >
              <IconRow icon={<BookOpen size={14} color={iconColor} />} label="3 fields from catalog" />
            </SectionCard>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 600, color: theme.palette.text.primary }}>
              Listing Requirements
            </Typography>
            <Info size={16} color={iconColor} />
          </Box>
          <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Box sx={{ flex: "0 0 calc(50% - 8px)", minWidth: 0 }}>
              <SectionCard
                title="Standards"
                action={
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Chip label="3 defined" size="small" sx={{ height: "20px", fontSize: "12px", backgroundColor: theme.palette.neutral[200], "& .MuiChip-label": { px: "6px" } }} />
                    <Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Manage</Button>
                  </Box>
                }
              >
                <IconRow icon={<Mail size={14} color={iconColor} />} label="1/8 only warn data products owners" />
                <IconRow icon={<ShieldCheck size={14} color={iconColor} />} label="2/8 suspend data products" />
              </SectionCard>
            </Box>

            <Box sx={{ flex: "0 0 calc(50% - 8px)", minWidth: 0 }}>
              <SectionCard
                title="Marketplace approvals"
                action={<Button variant="outlined" size="small" sx={{ height: "28px", fontSize: "12px", textTransform: "none" }}>Manage</Button>}
              >
                <IconRow icon={<ShieldCheck size={14} color={iconColor} />} label="1 approval required" />
                <IconRow icon={<Users size={14} color={iconColor} />} label="All maintainers and admins can approve" />
              </SectionCard>
            </Box>
          </Box>
        </Box>

      </Box>
      </Box>
      )}
    </Box>
  );
}
