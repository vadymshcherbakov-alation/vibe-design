"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionCard } from "../_components";

function StatusBadge({ status }: { status: string }) {
  const theme = useTheme();
  const styles: Record<string, { bg: string; color: string }> = {
    Active: { bg: theme.palette.green[100], color: theme.palette.green[700] },
    Expired: { bg: theme.palette.red[100], color: theme.palette.red[700] },
  };
  const s = styles[status] ?? { bg: theme.palette.neutral[100], color: theme.palette.text.secondary };
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: "8px",
        py: "2px",
        borderRadius: "12px",
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.5,
      }}
    >
      {status}
    </Box>
  );
}

const tokens = [
  { name: "MyRefreshToken", created: "Today at 10:25 am", status: "Active", expires: "Jun 6, 2025 at 10:25 am", apiStatus: "Active", flow: "Manual" },
  { name: "oauth-alation-anywhere-internal-dM1O", created: "Today at 3:29 am", status: "Active", expires: "Oct 4, 2025 at 3:29 am", apiStatus: "Expired", flow: "OAuth" },
  { name: "MyRefreshToken", created: "Today at 3:28 am", status: "Active", expires: "Jun 6, 2025 at 3:28 am", apiStatus: "Active", flow: "Manual" },
  { name: "prod-api-key-dashboard", created: "Mar 12 at 9:14 am", status: "Active", expires: "Sep 12, 2025 at 9:14 am", apiStatus: "Active", flow: "OAuth" },
  { name: "ci-pipeline-token", created: "Mar 8 at 2:00 pm", status: "Active", expires: "Sep 8, 2025 at 2:00 pm", apiStatus: "Expired", flow: "Manual" },
  { name: "data-catalog-sync", created: "Feb 28 at 11:45 am", status: "Active", expires: "Aug 28, 2025 at 11:45 am", apiStatus: "Active", flow: "OAuth" },
  { name: "reporting-service-token", created: "Feb 20 at 8:30 am", status: "Active", expires: "Aug 20, 2025 at 8:30 am", apiStatus: "Active", flow: "Manual" },
  { name: "oauth-alation-studio-internal", created: "Feb 14 at 5:17 pm", status: "Active", expires: "Aug 14, 2025 at 5:17 pm", apiStatus: "Expired", flow: "OAuth" },
  { name: "admin-backup-token", created: "Jan 30 at 10:00 am", status: "Active", expires: "Jul 30, 2025 at 10:00 am", apiStatus: "Active", flow: "Manual" },
  { name: "lineage-api-connector", created: "Jan 15 at 3:45 pm", status: "Active", expires: "Jul 15, 2025 at 3:45 pm", apiStatus: "Active", flow: "OAuth" },
];

export default function AuthenticationPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const totalItems = 23000;
  const totalPages = Math.ceil(totalItems / perPage);
  const rangeStart = (page - 1) * perPage + 1;
  const rangeEnd = Math.min(page * perPage, totalItems);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SectionCard title="Access tokens">
        <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
          Creating tokens to access Alation APIs is a two step process. First, create one or more{" "}
          <strong>Refresh Tokens</strong>. Refresh Tokens are active for 60 day(s). From a Refresh Token, create an{" "}
          <strong>API Access Token</strong> that can be used to authorize your interactions with Alation APIs. These tokens are valid for 24 hour(s).
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search token name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 280 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="outlined">Create refresh token</Button>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              {["Refresh token name", "Created", "Refresh token status", "Refresh token expires on", "API access token status", "Creation flow", "Actions"].map((h, i, arr) => (
                <th
                  key={h}
                  style={{
                    padding: "12px",
                    borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    ...(i === arr.length - 1 && {
                      position: "sticky",
                      right: 0,
                      backgroundColor: "#ffffff",
                      boxShadow: `-2px 0 4px rgba(0,0,0,0.06)`,
                    }),
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())).map((t, i) => (
              <tr key={i}>
                {[t.name, t.created, t.status, t.expires, t.apiStatus, t.flow].map((val, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                      fontSize: "13px",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {(j === 2 || j === 4) ? <StatusBadge status={val} /> : val}
                  </td>
                ))}
                <td style={{
                  padding: "12px",
                  borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                  fontSize: "13px",
                  position: "sticky",
                  right: 0,
                  backgroundColor: "#ffffff",
                  boxShadow: `-2px 0 4px rgba(0,0,0,0.06)`,
                }}>
                  <Button size="small" variant="text">Regenerate API</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, fontSize: "13px", color: theme.palette.text.secondary }}>
          <Typography variant="body2" color="text.secondary">
            {perPage} per page &nbsp;·&nbsp; {rangeStart} to {rangeEnd} of {totalItems.toLocaleString()}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Page {page} of {totalPages.toLocaleString()}
            </Typography>
            <IconButton size="small" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={16} />
            </IconButton>
          </Box>
        </Box>
      </SectionCard>
    </Box>
  );
}
