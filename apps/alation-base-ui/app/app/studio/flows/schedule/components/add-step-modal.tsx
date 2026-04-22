"use client";
import { Box, Typography, TextField, Chip, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X, Hammer } from "lucide-react";
import { useState, useMemo } from "react";

export type SelectableItem = {
  id: string;
  name: string;
  type: "Tool" | "Agent" | "Use Case";
  description: string;
  args?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
};

// Sample data - replace with actual data source
const sampleItems: SelectableItem[] = [
  {
    id: "1",
    name: "analyze_catalog_question",
    type: "Tool",
    description:
      "Search over the entire Alation catalog to find data assets and objects. This is the main catalog search tool that allows you to find tables, schemas, columns, articles, glossary terms, and other catalog objects. You can filter results by object types and apply custom field filters to narrow down results.",
    args: [
      {
        name: "search_term",
        type: "string",
        description: "Search term to filter data assets by name.",
      },
      {
        name: "object_types",
        type: "string",
        description:
          'Optional list of object types to search over. Common types include: "table", "column", "schema", "article", "glossary_term", "datasource". Leave empty to search all object types.',
      },
    ],
  },
  {
    id: "2",
    name: "alation_context",
    type: "Tool",
    description: "Get context from Alation catalog.",
  },
  {
    id: "3",
    name: "Query Flow Agent",
    type: "Agent",
    description: "An agent that helps with query flow operations.",
  },
  {
    id: "4",
    name: "bulk_retrieval",
    type: "Tool",
    description: "Retrieve data in bulk from the catalog.",
  },
  {
    id: "5",
    name: "get_data_sources",
    type: "Tool",
    description: "Get available data sources from the catalog.",
  },
  {
    id: "6",
    name: "bi_report_search",
    type: "Tool",
    description: "Search for BI reports in the catalog.",
  },
  {
    id: "7",
    name: "get_signature_creation_instructions",
    type: "Tool",
    description: "Get instructions for creating signatures.",
  },
  {
    id: "8",
    name: "search_catalog",
    type: "Tool",
    description: "Search the catalog for various objects.",
  },
  {
    id: "9",
    name: "search_filter_fields",
    type: "Tool",
    description: "Search and filter fields in the catalog.",
  },
  {
    id: "10",
    name: "search_filter_values",
    type: "Tool",
    description: "Search and filter values in the catalog.",
  },
];

type AddStepModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: SelectableItem) => void;
};

export function AddStepModal({ open, onClose, onSelect }: AddStepModalProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return sampleItems;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return sampleItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.type.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const handleItemClick = (item: SelectableItem) => {
    onSelect(item);
    onClose();
    setSearchTerm("");
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  if (!open) return null;

  return (
    <Box
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(39, 39, 42, 0.700)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "90%",
          maxWidth: "672px", // max-w-2xl = 672px
          height: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Header with Search */}
        <Box
          sx={{
            px: "24px",
            pt: "24px",
            pb: `${12 * 2}px`,
            borderBottom: `1px solid ${theme.palette.neutral[300]}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tool, agent or use case..."
              autoFocus
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  height: "auto",
                  fontSize: "18px",
                  fontWeight: 500,
                  border: "none",
                  boxShadow: "none",
                  p: 0,
                  "& input": {
                    p: 0,
                    color: theme.palette.text.primary,
                  },
                  "& input::placeholder": {
                    color: theme.palette.text.disabled,
                    opacity: 1,
                  },
                  "& fieldset": {
                    display: "none",
                  },
                  "&:hover fieldset": {
                    display: "none",
                  },
                  "&.Mui-focused fieldset": {
                    display: "none",
                  },
                },
              }}
            />
            {searchTerm && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClear}
                sx={{
                  height: "28px",
                  px: "12px",
                  fontSize: `${13}px`,
                  fontWeight: 500,
                  minWidth: "auto",
                  flexShrink: 0,
                }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* Tool List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.neutral[300],
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: theme.palette.neutral[400],
              },
            },
          }}
        >
          {filteredItems.length === 0 && searchTerm ? (
            // Empty state
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: `${24 * 1.5}px`,
                height: "100%",
                py: `${24 * 3}px`,
              }}
            >
              <Hammer
                size={32}
                style={{
                  color: theme.palette.text.secondary,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  alignItems: "center",
                  textAlign: "center",
                  maxWidth: "480px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                  }}
                >
                  No tools matching &ldquo;{searchTerm}&rdquo;
                </Typography>
                <Typography
                  sx={{
                    fontSize: `${13}px`,
                    color: theme.palette.text.secondary,
                  }}
                >
                  Try a different search term or request a related tool.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  height: `${24}px`,
                  fontSize: `${13}px`,
                }}
              >
                Clear search
              </Button>
            </Box>
          ) : (
            <>
              {/* Tool count */}
              <Box
                sx={{
                  px: "24px",
                  py: "12px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "tool" : "tools"}
                  {searchTerm && " found"}
                </Typography>
              </Box>

              {/* Item List */}
              <Box
                sx={{
                  px: "12px",
                  py: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {filteredItems.map((item) => (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => handleItemClick(item)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: `${12 * 2}px`,
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.neutral[100],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${24 + 4}px`,
                          height: `${24 + 4}px`,
                          borderRadius:
                            item.type === "Agent"
                              ? "4px"
                              : "6px",
                          backgroundColor:
                            item.type === "Agent"
                              ? theme.palette.orange[200]
                              : theme.palette.blue[200],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Hammer
                          size={16}
                          style={{
                            color:
                              item.type === "Tool"
                                ? theme.palette.blue[600]
                                : "#f16923",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: `${13}px`,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.type}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "12px",
                        fontWeight: 500,
                        px: "4px",
                        py: 0,
                        borderRadius: "999px",
                        backgroundColor:
                          item.type === "Tool"
                            ? theme.palette.blue[200]
                            : theme.palette.purple[200],
                        color:
                          item.type === "Tool"
                            ? theme.palette.blue[600]
                            : theme.palette.purple[600],
                        border: "none",
                        "& .MuiChip-label": {
                          px: "4px",
                          py: 0,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
