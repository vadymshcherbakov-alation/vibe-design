// PROTOTYPE-ONLY: scaffolding for the vibe-design prototype. Not part of the design system.
"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface LicenseSummaryCardsProps {
  contractStatus: "active" | "expiring" | "expired";
  expirationDate: string;
  daysRemaining: number;
  atRiskFeatures: number;
}

export function LicenseSummaryCards({
  contractStatus,
  expirationDate,
  daysRemaining,
  atRiskFeatures,
}: LicenseSummaryCardsProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#027A48";
      case "expiring":
        return "#B54708";
      case "expired":
        return "#B42318";
      default:
        return "#667085";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "24px",
        mb: "32px",
        padding: "20px 24px",
        backgroundColor: "white",
        border: `1px solid ${theme.tokens.color.border.default}`,
        borderRadius: "8px",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flex: "1", minWidth: "200px" }}>
        <Box
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: getStatusColor(contractStatus),
          }}
        />
        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: theme.tokens.color.text.primary,
              textTransform: "capitalize",
            }}
          >
            License {contractStatus}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.tokens.color.text.secondary,
            }}
          >
            Expires {expirationDate}
          </Typography>
        </Box>
      </Box>

      {atRiskFeatures > 0 && (
        <Box sx={{ textAlign: "center", flex: "0 0 auto", minWidth: "120px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#F79009",
            }}
          >
            {atRiskFeatures}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#B54708",
            }}
          >
            approaching limit
          </Typography>
        </Box>
      )}
    </Box>
  );
}