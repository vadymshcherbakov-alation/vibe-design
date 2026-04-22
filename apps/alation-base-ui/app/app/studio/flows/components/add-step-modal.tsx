"use client";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Hammer, Workflow, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { KeyboardShortcut } from "./keyboard-shortcut";

export type SelectableItem = {
  id: string;
  name: string;
  type: "Tool" | "Agent";
  description: string;
  args?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
};

type FilterTab = "All" | "Agents" | "Tools";

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
  hideTabs?: boolean;
};

type ItemTypeIconProps = {
  type: "Tool" | "Agent";
};

function ItemTypeIcon({ type }: ItemTypeIconProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "24px",
        height: "24px",
        borderRadius: "4px",
        backgroundColor:
          type === "Agent"
            ? theme.palette.purple[200]
            : theme.palette.blue[200],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {type === "Agent" ? (
        <Workflow
          size={16}
          style={{
            color: theme.palette.purple[600],
          }}
        />
      ) : (
        <Hammer
          size={16}
          style={{
            color: theme.palette.blue[600],
          }}
        />
      )}
    </Box>
  );
}

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  button?: React.ReactNode;
};

function EmptyState({ icon, title, description, button }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "36px",
        height: "100%",
        py: "72px",
      }}
    >
      {icon}
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
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: `${13}px`,
            color: theme.palette.text.secondary,
          }}
        >
          {description}
        </Typography>
      </Box>
      {button}
    </Box>
  );
}

export function AddStepModal({
  open,
  onClose,
  onSelect,
  hideTabs = false,
}: AddStepModalProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [highlightedItem, setHighlightedItem] = useState<SelectableItem | null>(
    null
  );
  const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionRef = useRef<"keyboard" | "mouse">("mouse");
  const searchInputRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    let items = sampleItems;

    // Filter by tab
    if (activeTab === "Agents") {
      items = items.filter((item) => item.type === "Agent");
    } else if (activeTab === "Tools") {
      items = items.filter((item) => item.type === "Tool");
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.type.toLowerCase().includes(lowerSearch) ||
          item.description.toLowerCase().includes(lowerSearch)
      );
    }

    return items;
  }, [searchTerm, activeTab]);

  // Auto-highlight first item when modal opens or list changes
  useEffect(() => {
    if (open && filteredItems.length > 0) {
      const firstItem = filteredItems[0];
      if (firstItem) {
        setHighlightedItem(firstItem);
      }
    } else if (filteredItems.length === 0) {
      setHighlightedItem(null);
    }
  }, [open, filteredItems]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedItem && itemRefs.current[highlightedItem.id]) {
      const element = itemRefs.current[highlightedItem.id];
      if (element && listContainerRef.current) {
        const container = listContainerRef.current;
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // Scroll if element is above or below visible area
        if (elementTop < containerTop) {
          container.scrollTo({
            top: elementTop - 8, // Add small padding
            behavior: "smooth",
          });
        } else if (elementBottom > containerBottom) {
          container.scrollTo({
            top: elementBottom - container.clientHeight + 8, // Add small padding
            behavior: "smooth",
          });
        }
      }
    }
  }, [highlightedItem]);

  const handleItemClick = useCallback(
    (item: SelectableItem) => {
      onSelect(item);
      onClose();
      setSearchTerm("");
      setActiveTab("All");
      setHighlightedItem(null);
    },
    [onSelect, onClose]
  );

  const handleClose = useCallback(() => {
    onClose();
    setSearchTerm("");
    setActiveTab("All");
    setHighlightedItem(null);
  }, [onClose]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredItems.length === 0) return;

      const currentIndex = highlightedItem
        ? filteredItems.findIndex((item) => item.id === highlightedItem.id)
        : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        lastInteractionRef.current = "keyboard";
        const nextIndex =
          currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
        const nextItem = filteredItems[nextIndex];
        if (nextItem) {
          setHighlightedItem(nextItem);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        lastInteractionRef.current = "keyboard";
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
        const prevItem = filteredItems[prevIndex];
        if (prevItem) {
          setHighlightedItem(prevItem);
        }
      } else if (e.key === "Enter" && highlightedItem) {
        e.preventDefault();
        handleItemClick(highlightedItem);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, filteredItems, highlightedItem, handleItemClick, handleClose]);

  const tabs: FilterTab[] = ["All", "Agents", "Tools"];

  // Calculate counts for each tab (based on search term only, not active tab)
  const tabCounts = useMemo(() => {
    let allItems = sampleItems;

    // Filter by search term if present
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      allItems = sampleItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.type.toLowerCase().includes(lowerSearch) ||
          item.description.toLowerCase().includes(lowerSearch)
      );
    }

    return {
      All: allItems.length,
      Agents: allItems.filter((item) => item.type === "Agent").length,
      Tools: allItems.filter((item) => item.type === "Tool").length,
    };
  }, [searchTerm]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      disableAutoFocus
      TransitionProps={{
        onEntered: () => {
          const input = searchInputRef.current?.querySelector("input");
          if (input) {
            input.focus();
            input.select();
          }
        },
      }}
      PaperProps={{
        sx: {
          width: "90%",
          maxWidth: "960px",
          height: "600px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Header with Search and Tabs */}
        <Box
          sx={{
            //px: "24px",
            pt: "24px",
            //pb: "12px",
            borderBottom: `1px solid ${theme.palette.neutral[300]}`,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              top: "16px",
              right: "16px",
            }}
          >
            <X size={16} />
          </IconButton>
          <Box
            sx={{
              px: "24px",
              pr: "56px",
            }}
          >
            <TextField
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                // Handle Enter key to select highlighted item
                if (e.key === "Enter" && highlightedItem) {
                  e.preventDefault();
                  handleItemClick(highlightedItem);
                }
              }}
              placeholder="Search tool, agent or use case..."
              autoFocus
              sx={{
                width: "100%",
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
          </Box>
          {/* Content Switcher Tabs */}
          {!hideTabs && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: "24px",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => {
                  setActiveTab(newValue);
                }}
                aria-label="content filter tabs"
              >
                {tabs.map((tab) => (
                  <Tab key={tab} label={tab} value={tab} />
                ))}
              </Tabs>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {activeTab === "All"
                  ? `${tabCounts.All} agents and tools`
                  : activeTab === "Agents"
                    ? `${tabCounts.Agents} agents`
                    : `${tabCounts.Tools} tools`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Area: List + Detail Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* Left Side: List */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Item List */}
            <Box
              ref={listContainerRef}
              sx={{
                flex: 1,
              }}
            >
              {filteredItems.length === 0 ? (
                /* Empty State */
                <EmptyState
                  icon={
                    <Hammer
                      size={32}
                      style={{
                        color: theme.palette.text.secondary,
                      }}
                    />
                  }
                  title={
                    searchTerm
                      ? `No items matching "${searchTerm}"`
                      : `No ${activeTab === "All" ? "items" : activeTab.toLowerCase()} available`
                  }
                  description="Try a different search term or filter."
                  button={
                    searchTerm ? (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <Box
                  sx={{
                    pl: "12px",
                    pr: "12px",
                    py: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  {filteredItems.map((item) => (
                    <Box
                      key={item.id}
                      ref={(el: HTMLButtonElement | null) => {
                        itemRefs.current[item.id] = el;
                      }}
                      component="button"
                      type="button"
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => {
                        lastInteractionRef.current = "mouse";
                        setHighlightedItem(item);
                      }}
                      onMouseMove={() => {
                        lastInteractionRef.current = "mouse";
                      }}
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: "12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor:
                          highlightedItem?.id === item.id
                            ? theme.palette.neutral[100]
                            : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: `background-color ${"150ms"}`,
                      }}
                    >
                      {/* Item Info */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Icon */}
                        <ItemTypeIcon type={item.type} />
                        {/* Name */}
                        <Typography
                          sx={{
                            color: theme.palette.text.primary,
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>

                      {/* Type Chip */}
                      <Chip
                        label={item.type}
                        size="small"
                        sx={{
                          backgroundColor:
                            item.type === "Agent"
                              ? theme.palette.purple[200]
                              : theme.palette.blue[200],
                          color:
                            item.type === "Agent"
                              ? theme.palette.purple[600]
                              : theme.palette.blue[600],
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Side: Detail Panel */}
          <Box
            sx={{
              width: "320px",
              flexShrink: 0,
              backgroundColor: theme.palette.neutral[50],
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {highlightedItem ? (
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Title */}
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {highlightedItem.name}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: `${13}px`,
                    lineHeight: "20px",
                    color: theme.palette.text.primary,
                  }}
                >
                  {highlightedItem.description}
                </Typography>

                {/* Args Section */}
                {highlightedItem.args && highlightedItem.args.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Args
                    </Typography>

                    {highlightedItem.args.map((arg, index) => (
                      <Box
                        key={arg.name}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          pt: index === 0 ? 0 : "12px",
                          borderTop:
                            index === 0
                              ? "none"
                              : `1px solid ${theme.palette.neutral[300]}`,
                        }}
                      >
                        {/* Arg Name + Type */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {/* Arg Name - Monospace */}
                          <Typography variant="code">
                            {arg.name}
                          </Typography>
                          {/* Type Badge */}
                          <Box
                            sx={{
                              px: "4px",
                              py: 0,
                              backgroundColor: "#f9f9fb",
                              border: "1px solid #f1f4f6",
                              borderRadius: "6px",
                            }}
                          >
                            <Typography variant="code">
                              {arg.type}
                            </Typography>
                          </Box>
                        </Box>
                        {/* Arg Description */}
                        <Typography
                          sx={{
                            fontSize: `${13}px`,
                            lineHeight: "20px",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {arg.description}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            ) : (
              /* Empty state for detail panel */
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: "24px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: `${13}px`,
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Hover over an item to see details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer with Keyboard Shortcuts */}
        <Box
          sx={{
            px: "24px",
            py: "12px",
            borderTop: `1px solid ${theme.palette.neutral[300]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left side - Add agent/tool shortcut */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {highlightedItem && <KeyboardShortcut mac="↵" windows="Enter" />}
            <Typography variant="subtitle2">
              {highlightedItem && `Add ${highlightedItem.type.toLowerCase()}`}
            </Typography>
          </Box>

          {/* Right side - Navigate and Close shortcuts */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Navigate */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: `${13}px`,
                  color: theme.palette.text.secondary,
                }}
              >
                Navigate:
              </Typography>
              <KeyboardShortcut mac="↑" windows="↑" />
              <Typography
                sx={{
                  fontSize: `${13}px`,
                  color: theme.palette.text.secondary,
                  mx: "2px",
                }}
              >
                /
              </Typography>
              <KeyboardShortcut mac="↓" windows="↓" />
            </Box>

            {/* Close */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: `${13}px`,
                  color: theme.palette.text.secondary,
                }}
              >
                Close:
              </Typography>
              <KeyboardShortcut mac="Esc" windows="Esc" />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
