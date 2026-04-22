"use client";
import { Box, Typography, Chip } from "@mui/material";
import { LicenseMetricCards, LicenseMetric } from "../../../components/license-metric-cards";

const mockLicenseData: LicenseMetric[] = [
  // Core Catalog - Mixed
  {
    id: "standard-objects",
    name: "Standard Objects",
    type: "limited" as const,
    category: "core" as const,
    current: 21265450,
    allocated: 25000000,
    unit: "objects",
  },
  {
    id: "suggested-descriptions",
    name: "Suggested Descriptions (AI)",
    type: "unlimited" as const,
    category: "core" as const,
    current: 1247,
    unit: "generated",
  },
  {
    id: "data-quality",
    name: "Data Quality Starter",
    type: "limited" as const,
    category: "core" as const,
    current: 24,
    allocated: 25,
    unit: "checks active",
  },
  // Data Products - Mixed
  {
    id: "data-products",
    name: "Data Products",
    type: "unlimited" as const,
    category: "data-products" as const,
    current: 346,
    unit: "products",
  },
  {
    id: "chat-enabled-products",
    name: "Chat Enabled Data Products",
    type: "limited" as const,
    category: "data-products" as const,
    current: 73,
    allocated: 100,
    unit: "enabled",
  },
  {
    id: "chat-messages",
    name: "Monthly Conversations",
    type: "unlimited" as const,
    category: "data-products" as const,
    current: 408,
    unit: "messages",
  },
  // Automation - Mixed
  {
    id: "ai-actions",
    name: "AI Actions",
    type: "limited" as const,
    category: "automation" as const,
    current: 206,
    allocated: 100000,
    unit: "actions",
  },
  {
    id: "pack-purchases",
    name: "Pack Purchases",
    type: "unlimited" as const,
    category: "automation" as const,
    current: 0,
    unit: "packs purchased",
  },
  // Users - Mixed
  {
    id: "creator-users",
    name: "Creator Licenses",
    type: "unlimited" as const,
    category: "users" as const,
    current: 271,
    unit: "users assigned",
    description: "For admin and content creation roles: Server Admin, Catalog Admin, Source Admin, Steward, Composer",
  },
  {
    id: "explorer-users",
    name: "Explorer Licenses",
    type: "limited" as const,
    category: "users" as const,
    current: 47,
    allocated: 50,
    unit: "users assigned",
    description: "For analysis roles: Explorer (run query forms, analyze data)",
  },
  {
    id: "viewer-users",
    name: "Viewer Licenses",
    type: "unlimited" as const,
    category: "users" as const,
    current: 91,
    unit: "users assigned",
    description: "For read-only access: Viewer (browse, search, participate in conversations)",
  },
];

export default function LicensesPage() {
  // Calculate at-risk features based on actual thresholds (95%+)
  const atRiskFeatures = mockLicenseData.filter(metric => {
    if (metric.type === "unlimited") return false;
    const percentage = metric.current && metric.allocated
      ? (metric.current / metric.allocated) * 100
      : 0;
    return percentage >= 95;
  }).length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Fixed Header Section */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid",
            borderColor: "divider",
            p: "24px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography
              variant="h1"
            >
              License Overview
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#16A34A",
                  }}
                />
                <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                  Contract: Mar 12, 2026 - Mar 11, 2027
                </Typography>
              </Box>
              <Chip
                label="5 months remaining"
                size="small"
                sx={{
                  backgroundColor: "#FEF3C7",
                  color: "#92400E",
                  fontSize: "12px",
                  fontWeight: 500,
                  height: "24px",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            p: "24px",
            pt: "24px",
            width: "100%",
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* License Metrics */}
            <LicenseMetricCards
              metrics={mockLicenseData}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}