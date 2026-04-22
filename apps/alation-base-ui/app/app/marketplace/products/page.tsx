"use client";
import { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Plus,
  SquarePen,
  Ellipsis,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { DATA_PRODUCTS, toProductSlug } from "../data-products-data";

function HeaderCell({
  label,
  width,
}: {
  label: string;
  width?: number | string;
}) {
  const theme = useTheme();
  return (
    <TableCell
      sx={{
        width,
        py: "10px",
        px: "12px",
        fontWeight: 500,
        fontSize: "13px",
        color: theme.palette.text.primary,
        borderRight: `1px solid #D4DDE2`,
        whiteSpace: "nowrap",
        "&:last-child": { borderRight: "none" },
      }}
    >
      {label}
    </TableCell>
  );
}

export default function MyDataProductsPage() {
  const theme = useTheme();
  const [rowsPerPage] = useState("10");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "24px",
          py: "20px",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: "22px", fontWeight: 700, color: theme.palette.text.primary }}>
          Manage My Data Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={14} />}
          sx={{ height: "36px", fontSize: "13px", fontWeight: 500 }}
        >
          New data product
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: "24px" }}>
        <Typography
          sx={{ fontSize: "16px", fontWeight: 600, color: theme.palette.text.primary, mb: "12px" }}
        >
          Data products
        </Typography>

        <Box
          sx={{
            border: `1px solid ${theme.palette.neutral[300]}`,
            borderRadius: "6px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Table sx={{ width: "100%", border: "none", borderRadius: 0 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.neutral[50] }}>
                <HeaderCell label="Data product" />
                <HeaderCell label="Listed" />
                <HeaderCell label="Contact" />
                <HeaderCell label="Contact Email" />
                <HeaderCell label="Last updated" />
                <HeaderCell label="Chat" />
                <TableCell
                  sx={{
                    py: "10px",
                    px: "12px",
                    borderRight: "none",
                    width: "140px",
                  }}
                />
              </TableRow>
            </TableHead>

            <TableBody>
              {DATA_PRODUCTS.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": { backgroundColor: theme.palette.neutral[100] },
                  }}
                >
                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <NextLink
                        href={`/app/manage/data-product/${toProductSlug(row.name)}/overview`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.info.main,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {row.name}
                        </Typography>
                      </NextLink>
                      {row.isDraft && (
                        <Chip
                          label="Draft"
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: theme.palette.neutral[200],
                            color: theme.palette.neutral[600],
                            "& .MuiChip-label": { px: "8px" },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: row.listed
                          ? theme.palette.text.primary
                          : theme.palette.text.disabled,
                      }}
                    >
                      {row.listed ? "Yes" : "No"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {row.contact}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {row.email}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {row.lastUpdated}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: row.chat
                          ? theme.palette.text.primary
                          : theme.palette.text.disabled,
                      }}
                    >
                      {row.chat ? "On" : "Off"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ px: "12px", py: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SquarePen size={13} />}
                        sx={{
                          height: "28px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          borderColor: theme.palette.neutral[300],
                          textTransform: "none",
                          px: "8px",
                          "&:hover": {
                            borderColor: theme.palette.neutral[400],
                            backgroundColor: theme.palette.neutral[100],
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          color: theme.palette.text.secondary,
                          "&:hover": { backgroundColor: theme.palette.neutral[100] },
                        }}
                      >
                        <Ellipsis size={14} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination footer */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: "12px",
              py: "8px",
              borderTop: `1px solid ${theme.palette.neutral[300]}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, whiteSpace: "nowrap" }}>
                Show rows
              </Typography>
              <FormControl size="small">
                <Select
                  value={rowsPerPage}
                  sx={{ width: "64px", fontSize: "13px", height: "32px" }}
                >
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="25">25</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                1–10 of 32
              </Typography>
              <Box sx={{ display: "flex", gap: "2px" }}>
                {[
                  { icon: <ChevronsLeft size={14} />, label: "First" },
                  { icon: <ChevronLeft size={14} />, label: "Previous" },
                  { icon: <ChevronRight size={14} />, label: "Next" },
                  { icon: <ChevronsRight size={14} />, label: "Last" },
                ].map(({ icon, label }) => (
                  <IconButton
                    key={label}
                    size="small"
                    aria-label={label}
                    sx={{
                      width: 28,
                      height: 28,
                      color: theme.palette.text.secondary,
                      "&:hover": { backgroundColor: theme.palette.neutral[100] },
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
