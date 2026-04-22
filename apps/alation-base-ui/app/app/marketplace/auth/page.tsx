"use client";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Filter,
  Link2Off,
  KeyRound,
} from "lucide-react";

interface Connection {
  id: number;
  type: string;
  url: string;
  status: "not-connected" | "connected";
  logoColor: string;
  logoLabel: string;
}

const CONNECTIONS: Connection[] = [
  { id: 1, type: "Database", url: "redshift:iam://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#6B7280", logoLabel: "DB" },
  { id: 2, type: "Snowflake", url: "snowflake://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#29B5E8", logoLabel: "SF" },
  { id: 3, type: "Redshift", url: "redshift://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#205B99", logoLabel: "RS" },
  { id: 4, type: "Database", url: "redshift:iam://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#6B7280", logoLabel: "DB" },
  { id: 5, type: "Redshift", url: "redshift://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#205B99", logoLabel: "RS" },
  { id: 6, type: "Snowflake", url: "snowflake://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#29B5E8", logoLabel: "SF" },
  { id: 7, type: "Database", url: "redshift:iam://alation-partner.us-east-1.snowflakecomputing.com:443/?warehouse=LOAD_WH&db=DPM_TESTSET", status: "not-connected", logoColor: "#6B7280", logoLabel: "DB" },
];

function ConnectionLogo({ color, label }: { color: string; label: string }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "8px",
        backgroundColor: color + "20",
        border: `1px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: "11px", fontWeight: 700, color }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function ManageAuthenticationPage() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: "24px",
          py: "20px",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          flexShrink: 0,
          gap: "4px",
        }}
      >
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
          Manage Authentication
        </Typography>
        <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
          Your credentials are stored securely, never shared, and used only for chatting with data, running evaluations, and creating or running agents.
        </Typography>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Toolbar row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronDown size={14} />}
            startIcon={<Filter size={14} />}
            sx={{
              height: "32px",
              fontSize: "13px",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              borderColor: theme.palette.neutral[300],
              textTransform: "none",
              px: "10px",
              "&:hover": {
                borderColor: theme.palette.neutral[400],
                backgroundColor: theme.palette.neutral[100],
              },
            }}
          >
            Filter
          </Button>
          <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>
            251 connections
          </Typography>
        </Box>

        {/* Connection list */}
        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {CONNECTIONS.map((conn, index) => (
            <Box
              key={conn.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                px: "16px",
                py: "14px",
                borderBottom: index < CONNECTIONS.length - 1
                  ? `1px solid ${theme.palette.neutral[300]}`
                  : "none",
                "&:hover": { backgroundColor: theme.palette.neutral[100] },
              }}
            >
              <ConnectionLogo color={conn.logoColor} label={conn.logoLabel} />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 600, color: theme.palette.text.primary, mb: "2px" }}>
                  {conn.type}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <KeyRound size={12} color={theme.palette.text.secondary} />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conn.url}
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<Link2Off size={14} />}
                label="Not connected to data"
                color="warning"
                sx={{ flexShrink: 0, fontSize: "13px" }}
              />

              <IconButton
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                  "&:hover": { backgroundColor: theme.palette.neutral[100] },
                }}
              >
                <Copy size={14} />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                  "&:hover": { backgroundColor: theme.palette.neutral[100] },
                }}
              >
                <ChevronRight size={14} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
