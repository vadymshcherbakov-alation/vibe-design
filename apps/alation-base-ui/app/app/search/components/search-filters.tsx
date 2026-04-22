"use client";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import React from "react";
import { SearchFilterAccordion } from "./search-filter-accordion";
import { FilterCheckboxList } from "./filter-checkbox-list";
import { TreeFilter, TreeNode } from "./tree-filter";

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

interface SearchFiltersProps {
  selections: Record<string, Set<string>>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>;
}

export function SearchFilters({ selections, setSelections }: SearchFiltersProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

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

  const handleRemoveFilter = (sectionId: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[sectionId];
      return newSelections;
    });
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          mb: 0,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: theme.palette.neutral[50],
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            minHeight: "48px",
            width: "100%",
            "& .MuiTab-root": {
              minHeight: "48px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Filters" />
          <Tab label="Saved searches" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ px: 0, pb: 0 }}>
          <Box sx={{ px: 3, pt: 3, pb: 3 }}>
            {filterSections.map((section, index) => (
              <SearchFilterAccordion
                key={section.id}
                title={section.title}
                uniqueId={section.id}
                selectedCount={selections[section.id]?.size || 0}
                onRemoveItem={() => handleRemoveFilter(section.id)}
                defaultExpanded={index === 0}
              >
                <FilterCheckboxList
                  options={section.options}
                  selectedValues={selections[section.id] || new Set()}
                  onChange={(value) => handleFilterChange(section.id, value)}
                  searchPlaceholder={`Search ${section.title}`}
                />
              </SearchFilterAccordion>
            ))}

            {/* Domains Tree Filter */}
            <SearchFilterAccordion
              title="Domains"
              uniqueId="domains"
              selectedCount={selections.domains?.size || 0}
              onRemoveItem={() => handleRemoveFilter("domains")}
              defaultExpanded={false}
            >
              <TreeFilter
                nodes={domainTreeData}
                selectedIds={selections.domains || new Set()}
                onSelectionChange={(newSelection) => {
                  setSelections((prev) => ({
                    ...prev,
                    domains: newSelection,
                  }));
                }}
              />
            </SearchFilterAccordion>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: "center", py: 3 }}>
            No saved searches
          </Typography>
        </Box>
      )}
    </Box>
  );
}
