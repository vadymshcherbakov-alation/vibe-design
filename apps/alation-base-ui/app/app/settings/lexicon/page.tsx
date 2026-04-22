"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";
import { Chip, LinearProgress, Box, Typography } from "@mui/material";

interface LexiconEntry {
  abbreviation: string;
  expandsTo: string;
  status: "Confirmed" | "Unconfirmed";
  frequency: number; // 0-100 percentage
}

const mockData: LexiconEntry[] = [
  { abbreviation: "a", expandsTo: "a", status: "Unconfirmed", frequency: 85 },
  { abbreviation: "aa", expandsTo: "attached", status: "Unconfirmed", frequency: 75 },
  { abbreviation: "aa", expandsTo: "available", status: "Unconfirmed", frequency: 90 },
  { abbreviation: "aa", expandsTo: "an article", status: "Unconfirmed", frequency: 70 },
  { abbreviation: "aa", expandsTo: "alation analytics", status: "Unconfirmed", frequency: 88 },
  { abbreviation: "aa", expandsTo: "affordable", status: "Unconfirmed", frequency: 65 },
  { abbreviation: "aa", expandsTo: "attendance", status: "Unconfirmed", frequency: 92 },
  { abbreviation: "aa", expandsTo: "appear as", status: "Unconfirmed", frequency: 78 },
  { abbreviation: "aa", expandsTo: "aav2", status: "Unconfirmed", frequency: 82 },
  { abbreviation: "aa", expandsTo: "additional", status: "Unconfirmed", frequency: 95 },
  { abbreviation: "aaecount", expandsTo: "aaecount", status: "Unconfirmed", frequency: 45 },
  { abbreviation: "aaengai", expandsTo: "aaengai", status: "Unconfirmed", frequency: 50 },
  { abbreviation: "aav", expandsTo: "aav", status: "Unconfirmed", frequency: 55 },
  { abbreviation: "ab", expandsTo: "about", status: "Unconfirmed", frequency: 85 },
  { abbreviation: "ab", expandsTo: "aby", status: "Unconfirmed", frequency: 72 },
  { abbreviation: "ab", expandsTo: "ability", status: "Unconfirmed", frequency: 88 },
  { abbreviation: "ab", expandsTo: "able", status: "Unconfirmed", frequency: 91 },
  { abbreviation: "ab", expandsTo: "abbreviation", status: "Unconfirmed", frequency: 68 },
  { abbreviation: "ab", expandsTo: "ab", status: "Unconfirmed", frequency: 76 },
  { abbreviation: "ab", expandsTo: "absolute", status: "Unconfirmed", frequency: 83 },
  { abbreviation: "ab", expandsTo: "alation base", status: "Unconfirmed", frequency: 79 },
  { abbreviation: "ab", expandsTo: "abuser", status: "Unconfirmed", frequency: 65 },
  { abbreviation: "ab", expandsTo: "abate", status: "Unconfirmed", frequency: 58 },
  { abbreviation: "abab", expandsTo: "abab", status: "Unconfirmed", frequency: 42 },
  { abbreviation: "abac", expandsTo: "abac", status: "Unconfirmed", frequency: 15 },
];

const columns: ColumnDef<LexiconEntry>[] = [
  {
    accessorKey: "abbreviation",
    header: "Abbreviation",
  },
  {
    accessorKey: "expandsTo",
    header: "Expands to",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
        {row.original.status}
      </Typography>
    ),
  },
  {
    id: "frequency",
    header: "Abbreviation Frequency",
    cell: ({ row }) => (
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={row.original.frequency}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "grey.500",
            },
          }}
        />
      </Box>
    ),
  },
];

export default function LexiconPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Lexicon"
      breadcrumbs={[{ label: "Lexicon" }]}
      showMoreMenu={true}
      onMoreMenuClick={() => console.log("Settings menu")}
      tableTitle="Suggested Expansions"
      tableDescription="Filter: All | Confirmed | Unconfirmed | @Add New"
      columns={columns}
      data={mockData}
      searchPlaceholder="Filter table"
      pageSize={25}
      pageSizeOptions={[25, 50, 100]}
    />
  );
}
