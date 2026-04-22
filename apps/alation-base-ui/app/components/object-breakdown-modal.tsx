"use client";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { useTheme } from "@mui/material/styles";

interface ObjectBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  type: "standard-objects" | "data-quality";
}

const standardObjectsData = [
  { name: "Article Groups", count: 4 },
  { name: "Articles", count: 8812 },
  { name: "BI: Connection Columns", count: 137643 },
  { name: "BI: Connections", count: 11673 },
  { name: "BI: Datasource Columns", count: 361914 },
  { name: "BI: Datasources", count: 3680 },
  { name: "BI: Folder", count: 3832 },
  { name: "BI: Report Columns", count: 374656 },
  { name: "BI: Reports", count: 15550 },
  { name: "BI: Servers", count: 66 },
  { name: "Business Policies", count: 269 },
  { name: "Domains", count: 122 },
  { name: "File Systems", count: 16 },
  { name: "File Systems: Directories", count: 541 },
  { name: "File Systems: Files", count: 2353 },
  { name: "Glossaries", count: 89 },
  { name: "Glossary Terms", count: 40281 },
  { name: "NoSQL: Collections", count: 0 },
  { name: "NoSQL: Folders", count: 0 },
  { name: "NoSQL: Schemas", count: 0 },
  { name: "Policies", count: 10316 },
  { name: "Policy Groups", count: 13 },
  { name: "Queries", count: 8029 },
];

const dataQualityData = [
  { name: "Tables", count: 5 },
  { name: "Columns", count: 3 },
];

export function ObjectBreakdownModal({ open, onClose, type }: ObjectBreakdownModalProps) {
  const theme = useTheme();

  const data = type === "standard-objects" ? standardObjectsData : dataQualityData;
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const title = type === "standard-objects"
    ? "Standard Objects — Usage by Type"
    : "Data Quality Starter — Object Breakdown";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "80vh",
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 600, fontSize: "20px" }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead">
              <Box component="tr">
                <Box
                  component="th"
                  sx={{
                    textAlign: "left",
                    p: 1.5,
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "text.secondary",
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Object Type
                </Box>
                <Box
                  component="th"
                  sx={{
                    textAlign: "right",
                    p: 1.5,
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "text.secondary",
                    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Count
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {data
                .sort((a, b) => b.count - a.count) // Sort by count descending
                .map((item, idx) => (
                <Box
                  key={item.name}
                  component="tr"
                  sx={{
                    "&:hover": { backgroundColor: "grey.50" },
                    borderBottom: idx === data.length - 1 ? "none" : `1px solid ${"rgb(240, 240, 240)"}`,
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      p: 1.5,
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    {item.name}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      textAlign: "right",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {item.count.toLocaleString()}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Total */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `2px solid ${theme.palette.neutral[300]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "text.secondary" }}>
            {type === "standard-objects" ? "Total Objects" : "Total Objects with DQ"}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "text.primary" }}>
            {totalCount.toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}