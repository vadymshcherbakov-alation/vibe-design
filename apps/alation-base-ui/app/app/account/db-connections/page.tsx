"use client";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SectionCard } from "../_components";

const cached = [
  { uri: "databricks://adb-844304915765127...AuthMech=3;", username: "token", lastUsed: "Feb 6 at 8:37pm" },
  { uri: "databricks://adb-844304915765127...AuthMech=3;", username: "token", lastUsed: "Feb 6 at 11:38pm" },
  { uri: "databricks://adb-844304915765127...AuthMech=3;", username: "token", lastUsed: "Feb 8 at 7:12pm" },
  { uri: "mysql://al-182400-krupashank-mysql.alation-test.com:3306/alation", username: "mduser", lastUsed: "Sep 9 at 8:51am" },
];

export default function DbConnectionsPage() {
  const theme = useTheme();

  const thStyle: React.CSSProperties = {
    padding: "12px",
    borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 500,
    color: theme.palette.text.secondary,
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    fontSize: "13px",
    color: theme.palette.text.primary,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SectionCard title="Alation Analytics connection">
        <table style={{ borderCollapse: "collapse", width: "100%", whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              {["Data source", "URI", "Username", "Actions"].map((h, i, arr) => (
                <th key={i} style={{ ...thStyle, ...(i === arr.length - 1 && { textAlign: "right" }) }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Alation Analytics</td>
              <td style={tdStyle}>—</td>
              <td style={tdStyle}>admin@alation.com</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <Button size="small" variant="text">Update password</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Cached database connections">
        <table style={{ borderCollapse: "collapse", width: "100%", whiteSpace: "nowrap" }}>
          <thead>
            <tr>
              {["URI", "Username", "Last used", "Actions"].map((h, i, arr) => (
                <th key={h} style={{ ...thStyle, ...(i === arr.length - 1 && { textAlign: "right" }) }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cached.map((row, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, width: "100%", wordBreak: "break-all" }}>{row.uri}</td>
                <td style={tdStyle}>{row.username}</td>
                <td style={tdStyle}>{row.lastUsed}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <Button size="small" variant="text" color="error">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </Box>
  );
}
