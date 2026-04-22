"use client";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";
import {
  List,
  Grid3x3,
  FileText,
  Database,
  Table2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { AppliedFiltersBanner } from "./applied-filters-banner";

interface SearchResult {
  id: string;
  type: "glossary" | "document" | "prompt" | "data_source" | "table";
  title: string;
  description: string;
  metadata: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  tags?: string[];
  verified?: boolean;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "glossary",
    title: "Data Privacy Glossary",
    description:
      "This glossary includes terminology that is particular to data privacy policies that Alationauts need to follow. Note that some of these terms may be used in oth...",
    metadata: [
      { label: "DATA PRIVACY", value: "DATA PRIVACY" },
      { label: "in", value: "Data @ Alation", icon: <Database size={14} /> },
      { label: "", value: "Data Privacy", icon: <FileText size={14} /> },
    ],
    verified: true,
  },
  {
    id: "2",
    type: "document",
    title: "FDE Enhanced Connectors",
    description:
      "This is FDE's Enhanced OCF Connectors Page. The Forward Deployed Engineering team design, develop, document, maintain and support enhanced connectors in-house...",
    metadata: [
      { label: "DOCUMENT", value: "DOCUMENT" },
      { label: "in", value: "Product and Engineering Documents", icon: <FileText size={14} /> },
      { label: "", value: "Forward Deployed Engineering", icon: <FileText size={14} /> },
    ],
    verified: true,
  },
  {
    id: "3",
    type: "glossary",
    title: "Fiscal Period Quarter",
    description:
      "A fiscal quarter is a three-month period in which the financial results are reported. Here at Alation, we have the following Quarters - Q1 - February, March, Ap...",
    metadata: [
      { label: "TERM", value: "TERM" },
      { label: "in", value: "Glossaries", icon: <FileText size={14} /> },
      { label: "", value: "Data Terms @ Alation", icon: <FileText size={14} /> },
    ],
    verified: true,
  },
  {
    id: "4",
    type: "prompt",
    title: "A@A Data Product File Builder",
    description:
      "Launch the Data Product File Builder Gem. Upload the JSON data dictionary files. Include the name of your data product, a description, and a summary of the data...",
    metadata: [
      { label: "PROMPT", value: "PROMPT" },
      { label: "in", value: "Alation AI Marketplace", icon: <Sparkles size={14} /> },
      { label: "", value: ":", icon: <></> },
      { label: "", value: "Data and A@A", icon: <FileText size={14} /> },
    ],
    verified: true,
  },
  {
    id: "5",
    type: "data_source",
    title: "Rosemeta on JIDB",
    description:
      "This data source exposes all internal tables in use by Alation, based on the internal Postgres database used by JIDB. The user will send data collection ...",
    metadata: [
      { label: "DATA SOURCE", value: "DATA SOURCE" },
    ],
    verified: true,
  },
];

function ResultCard({ result }: { result: SearchResult }) {
  const theme = useTheme();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "glossary":
        return theme.palette.purple[500];
      case "document":
        return theme.palette.blue[500];
      case "prompt":
        return theme.palette.green[500];
      case "data_source":
        return theme.palette.orange[500];
      default:
        return theme.palette.neutral[500];
    }
  };

  return (
    <Box
      sx={{
        p: "16px 8px",
        cursor: "pointer",
        maxWidth: "700px",
        "&:hover": {
          backgroundColor: theme.palette.neutral[100],
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "4px" }}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.blue[600],
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {result.title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "8px", flexWrap: "wrap" }}>
            {result.metadata.map((meta, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {index === 0 && meta.label && (
                  <Chip
                    label={meta.label}
                    size="small"
                    sx={{
                      height: "20px",
                      fontSize: "11px",
                      fontWeight: 500,
                      backgroundColor: theme.palette.neutral[100],
                      color: theme.palette.text.secondary,
                    }}
                  />
                )}
                {index === 1 && (
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
                  >
                    in
                  </Typography>
                )}
                {index > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {meta.icon && (
                      <Box sx={{ display: "flex", alignItems: "center", color: theme.palette.text.secondary }}>
                        {meta.icon}
                      </Box>
                    )}
                    {meta.value && (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
                      >
                        {meta.value}
                      </Typography>
                    )}
                    {index < result.metadata.length - 1 && (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
                      >
                        &gt;
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {result.description}
          </Typography>
        </Box>

        {result.verified && (
          <Box
            sx={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: theme.palette.green[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              flexShrink: 0,
            }}
          >
            ✓
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface SearchResultsProps {
  selections: Record<string, Set<string>>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>;
}

const filterSections = [
  {
    id: "objectType",
    title: "Object Type",
    options: [
      { value: "table", label: "Table" },
      { value: "column", label: "Column" },
      { value: "schema", label: "Schema" },
      { value: "article", label: "Article" },
      { value: "glossary", label: "Glossary Term" },
      { value: "bi_report", label: "BI Report" },
    ],
  },
  {
    id: "documentFolder",
    title: "Document Folder",
    options: [
      { value: "policies", label: "Policies" },
      { value: "guidelines", label: "Guidelines" },
      { value: "best_practices", label: "Best Practices" },
      { value: "tutorials", label: "Tutorials" },
    ],
  },
  {
    id: "database",
    title: "Database",
    options: [
      { value: "postgresql", label: "PostgreSQL" },
      { value: "mysql", label: "MySQL" },
      { value: "oracle", label: "Oracle" },
      { value: "mongodb", label: "MongoDB" },
      { value: "snowflake", label: "Snowflake" },
    ],
  },
  {
    id: "source",
    title: "Source",
    options: [
      { value: "production", label: "Production" },
      { value: "staging", label: "Staging" },
      { value: "development", label: "Development" },
      { value: "analytics", label: "Analytics" },
    ],
  },
  {
    id: "schema",
    title: "Schema",
    options: [
      { value: "public", label: "public" },
      { value: "analytics", label: "analytics" },
      { value: "reporting", label: "reporting" },
      { value: "staging", label: "staging" },
    ],
  },
  {
    id: "flags",
    title: "Flags",
    options: [
      { value: "deprecated", label: "Deprecated" },
      { value: "sensitive", label: "Sensitive" },
      { value: "verified", label: "Verified" },
      { value: "popular", label: "Popular" },
    ],
  },
];

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const domainTreeData: TreeNode[] = [
  {
    id: "finance",
    label: "Finance",
    children: [
      { id: "finance-accounting", label: "Accounting" },
      { id: "finance-budget", label: "Budget & Planning" },
      {
        id: "finance-reporting",
        label: "Financial Reporting",
        children: [
          { id: "finance-reporting-quarterly", label: "Quarterly Reports" },
          { id: "finance-reporting-annual", label: "Annual Reports" },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    children: [
      { id: "marketing-campaigns", label: "Campaigns" },
      { id: "marketing-analytics", label: "Marketing Analytics" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    children: [
      { id: "sales-leads", label: "Leads" },
      { id: "sales-opportunities", label: "Opportunities" },
      { id: "sales-accounts", label: "Accounts" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    children: [
      { id: "engineering-dev", label: "Development" },
      { id: "engineering-qa", label: "Quality Assurance" },
    ],
  },
  { id: "hr", label: "Human Resources" },
];

export function SearchResults({ selections, setSelections }: SearchResultsProps) {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleFilterChange = (sectionId: string, value: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev };
      const currentSet = new Set(prev[sectionId] || []);

      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }

      newSelections[sectionId] = currentSet;
      return newSelections;
    });
  };

  const getTreeNodeLabel = (nodeId: string, nodes: TreeNode[]): string | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node.label;
      if (node.children) {
        const label = getTreeNodeLabel(nodeId, node.children);
        if (label) return label;
      }
    }
    return null;
  };

  const appliedFilters = Object.entries(selections).flatMap(([sectionId, values]) => {
    if (sectionId === "domains") {
      return Array.from(values).map((value) => {
        const label = getTreeNodeLabel(value, domainTreeData);
        return {
          id: `${sectionId}-${value}`,
          label: `${label || value}`,
          onRemove: () => handleFilterChange(sectionId, value),
        };
      });
    }

    const section = filterSections.find((s) => s.id === sectionId);
    if (!section) return [];

    return Array.from(values).map((value) => {
      const option = section.options.find((o) => o.value === value);
      return {
        id: `${sectionId}-${value}`,
        label: `${option?.label || value}`,
        onRemove: () => handleFilterChange(sectionId, value),
      };
    });
  });

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: "24px",
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${theme.palette.neutral[300]}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "16px",
          }}
        >
          <Typography variant="h1">Search results</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            204,987 results
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button variant="outlined" size="small">
              Perform bulk actions
            </Button>
            <Box
              sx={{
                display: "flex",
                border: `1px solid ${theme.palette.neutral[300]}`,
                borderRadius: "4px",
              }}
            >
              <IconButton
                size="small"
                onClick={() => setViewMode("list")}
                sx={{
                  borderRadius: "4px 0 0 4px",
                  backgroundColor: viewMode === "list" ? theme.palette.neutral[100] : "transparent",
                }}
              >
                <List size={18} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode("grid")}
                sx={{
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: viewMode === "grid" ? theme.palette.neutral[100] : "transparent",
                }}
              >
                <Grid3x3 size={18} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <AppliedFiltersBanner
        filters={appliedFilters}
        onClearAll={() => setSelections({})}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#ffffff",
          px: "16px",
        }}
      >
        {mockResults.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </Box>
    </Box>
  );
}
