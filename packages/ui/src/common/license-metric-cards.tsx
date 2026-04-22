"use client";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Infinity, AlertTriangle } from "lucide-react";
import { UserRolesModal } from "./user-roles-modal";
import { ObjectBreakdownModal } from "./object-breakdown-modal";
import { useState } from "react";

export interface LicenseMetric {
  id: string;
  name: string;
  type: "unlimited" | "limited";
  category: "core" | "data-products" | "automation" | "users";
  current?: number;
  allocated?: number;
  unit: string;
  description?: string;
}

interface LicenseMetricCardsProps {
  metrics: LicenseMetric[];
}

export function LicenseMetricCards({ metrics }: LicenseMetricCardsProps) {
  const theme = useTheme();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [breakdownType, setBreakdownType] = useState<"standard-objects" | "data-quality">("standard-objects");

  const renderUnlimitedCard = (metric: LicenseMetric) => {
    // Special rendering for Pack Purchases empty state
    if (metric.id === "pack-purchases" && (!metric.current || metric.current === 0)) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            border: `1px solid ${theme.tokens.color.border.default}`,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: theme.tokens.color.text.primary,
              fontWeight: 600,
            }}
          >
            {metric.name}
          </Typography>

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.tokens.color.text.secondary,
                lineHeight: 1.4,
              }}
            >
              No packs purchased yet. Packs expand your AI Action allotment.
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          border: `1px solid ${theme.tokens.color.border.default}`,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: theme.tokens.color.text.primary,
              fontWeight: 600,
            }}
          >
            {metric.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Infinity size={14} color="#6B7280" />
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#6B7280",
              }}
            >
              Unlimited
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: theme.tokens.color.text.primary,
              lineHeight: 1.2,
            }}
          >
            {metric.current?.toLocaleString() || "—"}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.tokens.color.text.secondary,
            }}
          >
            {metric.current ? `${metric.unit}` : `no usage yet`}
          </Typography>
        </Box>

        {/* Show description for user licenses to bridge understanding */}
        {metric.category === "users" && metric.description && (
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.tokens.color.text.secondary,
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            {metric.description}
          </Typography>
        )}

        {(metric.id === "standard-objects" || metric.id === "data-quality") && (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => {
              setBreakdownType(metric.id as "standard-objects" | "data-quality");
              setBreakdownModalOpen(true);
            }}
            sx={{
              alignSelf: "flex-start",
              fontSize: "12px",
              textTransform: "none",
              padding: "4px 12px",
              marginTop: "auto",
              borderColor: "rgba(0, 0, 0, 0.23)",
              color: "text.secondary",
              "&:hover": {
                borderColor: "rgba(0, 0, 0, 0.5)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            View breakdown
          </Button>
        )}
      </Box>
    );
  };

  const renderLimitedCard = (metric: LicenseMetric) => {
    const percentage = metric.current && metric.allocated
      ? (metric.current / metric.allocated) * 100
      : 0;

    // Determine status based on usage thresholds (only critical at 95%+)
    const getActualStatus = () => {
      if (percentage >= 95) return "critical";
      return "healthy";
    };

    const actualStatus = getActualStatus();

    const getProgressBarColor = () => {
      if (actualStatus === "critical") return "#F04438"; // Red
      return "#0072DD"; // Primary blue
    };

    const getPercentageTextColor = () => {
      if (actualStatus === "critical") return "#F04438"; // Red
      return "text.primary"; // Primary text color
    };

    const getStatusLabel = () => {
      if (actualStatus === "critical") return "Critical";
      return "Healthy";
    };

    return (
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          border: `1px solid ${theme.tokens.color.border.default}`,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: theme.tokens.color.text.primary,
              fontWeight: 600,
            }}
          >
            {metric.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: theme.tokens.color.text.primary,
                lineHeight: 1.2,
              }}
            >
              {metric.current?.toLocaleString() || "0"}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.tokens.color.text.secondary,
              }}
            >
              of {metric.allocated?.toLocaleString()} {metric.unit}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {actualStatus === "critical" && (
              <AlertTriangle size={14} color="#F04438" />
            )}
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: getPercentageTextColor(),
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>

        <Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "#F2F4F7",
              "& .MuiLinearProgress-bar": {
                backgroundColor: getProgressBarColor(),
                borderRadius: 3,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.tokens.color.text.secondary,
              marginTop: "6px",
            }}
          >
            {metric.allocated && metric.current
              ? `${(metric.allocated - metric.current).toLocaleString()} remaining`
              : "No usage yet"}
          </Typography>
        </Box>

        {/* Show description for user licenses to bridge understanding */}
        {metric.category === "users" && metric.description && (
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.tokens.color.text.secondary,
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            {metric.description}
          </Typography>
        )}

        {(metric.id === "standard-objects" || metric.id === "data-quality") && (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => {
              setBreakdownType(metric.id as "standard-objects" | "data-quality");
              setBreakdownModalOpen(true);
            }}
            sx={{
              alignSelf: "flex-start",
              fontSize: "12px",
              textTransform: "none",
              padding: "4px 12px",
              marginTop: "auto",
              borderColor: "rgba(0, 0, 0, 0.23)",
              color: "text.secondary",
              "&:hover": {
                borderColor: "rgba(0, 0, 0, 0.5)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            View breakdown
          </Button>
        )}
      </Box>
    );
  };

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, LicenseMetric[]>);

  const categoryLabels = {
    core: "Data Catalog",
    "data-products": "Data Products Starter",
    automation: "Curation Automation",
    users: "User Licenses",
  };

  return (
    <Box>
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <Box key={category} sx={{ mb: "32px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <Box>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#667085",
                  marginBottom: category === "users" ? "4px" : 0,
                }}
              >
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </Typography>
              {category === "users" && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: theme.tokens.color.text.secondary,
                    lineHeight: 1.4,
                  }}
                >
                  Licenses purchased determine access tiers. Users are then assigned specific roles within their license tier.
                </Typography>
              )}
            </Box>
            {category === "users" && (
              <Box sx={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "4px 12px",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                  }}
                  onClick={() => setRoleModalOpen(true)}
                >
                  Compare User Roles
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "4px 12px",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                  }}
                  onClick={() => console.log("Manage Users")}
                >
                  Manage Users
                </Button>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {categoryMetrics.map((metric) => (
              <Box key={metric.id}>
                {metric.type === "unlimited"
                  ? renderUnlimitedCard(metric)
                  : renderLimitedCard(metric)}
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <UserRolesModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      <ObjectBreakdownModal
        open={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        type={breakdownType}
      />
    </Box>
  );
}