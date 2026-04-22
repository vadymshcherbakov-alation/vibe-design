"use client";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  Popover,
  Snackbar,
  Alert,
  Tooltip,
  Avatar,
  keyframes,
} from "@mui/material";
import { ItemTypeIcon } from "../../studio/flows/components/item-type-icon";
import { EmptySearchState } from "./components/empty-search-state";
import { CreateEvalRunModal } from "./components/create-eval-run-modal";
import { Search, X, ArrowUp, ArrowDown, ArrowUpDown, Code, CheckCircle, Clock, XCircle, Download, ExternalLink } from "lucide-react";
import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import questionsData from "./questions-data.json";
import dataProducts from "./data-products.json";
import runsData from "./runs-data.json";
import agentsData from "./agents-data.json";

type TabId = "questions" | "runs";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
`;

interface DataProduct {
  id: string;
  name: string;
}

interface Question {
  id: string;
  question: string;
  dataProductId: string;
  sql: string;
  createdDate: string;
  agentId: string;
  creator: string;
}

interface Run {
  evalId: string;
  evalName: string;
  runAt: string;
  status: "completed" | "running" | "failed" | "pending";
  accuracy: number | null;
  averageDuration: number | null;
  numberOfQuestions: number;
  passedQuestions: number | null;
  agentId: string;
  createdBy: string;
}

type SortField = "question" | "dataProductId" | "createdDate" | null;
type SortDirection = "asc" | "desc";
type RunSortField = "evalId" | "evalName" | "runAt" | "status" | "accuracy" | "averageDuration" | "numberOfQuestions" | "agentId" | "createdBy" | null;

function EvaluationsPageContent() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("runs");
  const [questions] = useState<Question[]>(questionsData as Question[]);
  const [runs] = useState<Run[]>(runsData as Run[]);
  const [dataProductsList] = useState<DataProduct[]>(dataProducts as DataProduct[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [runsSearchTerm, setRunsSearchTerm] = useState("");
  const [selectedRunsStatuses, setSelectedRunsStatuses] = useState<string[]>([]);
  const [selectedAccuracyThresholds, setSelectedAccuracyThresholds] = useState<string[]>([]);
  const [selectedDataProducts, setSelectedDataProducts] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("createdDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [runsSortField, setRunsSortField] = useState<RunSortField>("runAt");
  const [runsSortDirection, setRunsSortDirection] = useState<SortDirection>("desc");
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredRunsHeaderId, setHoveredRunsHeaderId] = useState<string | null>(null);
  const [hoveredRunsRowId, setHoveredRunsRowId] = useState<string | null>(null);
  const [itemsToShow, setItemsToShow] = useState(25);
  const [runsItemsToShow, setRunsItemsToShow] = useState(25);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sqlPopoverAnchor, setSqlPopoverAnchor] = useState<HTMLElement | null>(null);
  const [sqlPopoverQuestionId, setSqlPopoverQuestionId] = useState<string | null>(null);
  const [createEvalRunModalOpen, setCreateEvalRunModalOpen] = useState(false);
  const [evalRunToastOpen, setEvalRunToastOpen] = useState(false);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const [searchSectionHeight, setSearchSectionHeight] = useState(0);
  const stickyOverlapPx = 1;
  const tableHeaderOffsetPx = 6;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Agent data from JSON
  const availableAgents = (agentsData as Array<{
    id: string;
    name: string;
    type: string;
    description: string;
  }>).map((agent) => ({
    ...agent,
    type: agent.type as "Agent",
  }));
  // Reset pagination when search term changes
  useEffect(() => {
    setItemsToShow(25);
  }, [searchTerm]);

  // Reset runs pagination when search term or filters change
  useEffect(() => {
    setRunsItemsToShow(25);
  }, [runsSearchTerm, selectedRunsStatuses, selectedAccuracyThresholds]);

  // Create a lookup map for data products
  const dataProductsMap = useMemo(() => {
    const map = new Map<string, string>();
    dataProductsList.forEach((dp) => {
      map.set(dp.id, dp.name);
    });
    return map;
  }, [dataProductsList]);

  // Helper function to get data product name
  const getDataProductName = (id: string) => {
    return dataProductsMap.get(id) || id;
  };

  // Get unique list of creators from questions
  const creatorsList = useMemo(() => {
    const uniqueCreators = Array.from(new Set(questions.map((q) => q.creator)));
    return uniqueCreators.sort();
  }, [questions]);

  // Helper function to format date and time separately
  const formatDateAndTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Los_Angeles",
    });
    return {
      date: dateFormatter.format(date),
      time: timeFormatter.format(date),
      timezone: "PST",
    };
  };

  // Handle header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle runs header click for sorting
  const handleRunsSort = (field: RunSortField) => {
    if (runsSortField === field) {
      // Toggle direction if clicking the same field
      setRunsSortDirection(runsSortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default ascending
      setRunsSortField(field);
      setRunsSortDirection("asc");
    }
  };

  // Filter and sort questions
  const filteredAndSortedQuestions = useMemo(() => {
    // First filter by search term
    let filtered = [...questions];
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(lowerSearch) ||
          (dataProductsMap.get(q.dataProductId) || q.dataProductId).toLowerCase().includes(lowerSearch) ||
          q.sql.toLowerCase().includes(lowerSearch) ||
          q.creator.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by selected data products
    if (selectedDataProducts.length > 0) {
      filtered = filtered.filter((q) => selectedDataProducts.includes(q.dataProductId));
    }

    // Filter by selected creators
    if (selectedCreators.length > 0) {
      filtered = filtered.filter((q) => selectedCreators.includes(q.creator));
    }

    // Then sort
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string;
        let bValue: string;

        switch (sortField) {
          case "question": {
            aValue = a.question.toLowerCase();
            bValue = b.question.toLowerCase();
            return sortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "dataProductId": {
            aValue = (dataProductsMap.get(a.dataProductId) || a.dataProductId).toLowerCase();
            bValue = (dataProductsMap.get(b.dataProductId) || b.dataProductId).toLowerCase();
            return sortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "createdDate": {
            const aDate = new Date(a.createdDate).getTime();
            const bDate = new Date(b.createdDate).getTime();
            return sortDirection === "desc" ? bDate - aDate : aDate - bDate;
          }
          default:
            return 0;
        }
      });
    }
    return filtered;
  }, [questions, sortField, sortDirection, searchTerm, selectedDataProducts, selectedCreators, dataProductsMap]);

  // Calculate displayed questions (with pagination)
  const displayedQuestions = useMemo(() => {
    return filteredAndSortedQuestions.slice(0, itemsToShow);
  }, [filteredAndSortedQuestions, itemsToShow]);

  const hasMoreItems = itemsToShow < filteredAndSortedQuestions.length;

  // Filter and sort runs
  const filteredAndSortedRuns = useMemo(() => {
    // First filter by search term
    let filtered = [...runs];
    if (runsSearchTerm.trim()) {
      const lowerSearch = runsSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.evalId.toLowerCase().includes(lowerSearch) ||
          r.evalName.toLowerCase().includes(lowerSearch) ||
          r.status.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by status
    if (selectedRunsStatuses.length > 0) {
      filtered = filtered.filter((r) => selectedRunsStatuses.includes(r.status));
    }

    // Filter by accuracy threshold
    if (selectedAccuracyThresholds.length > 0) {
      filtered = filtered.filter((r) => {
        if (r.accuracy === null) return false;
        return selectedAccuracyThresholds.some((threshold) => {
          switch (threshold) {
            case "above80":
              return r.accuracy! > 80;
            case "50to80":
              return r.accuracy! >= 50 && r.accuracy! <= 80;
            case "30to50":
              return r.accuracy! >= 30 && r.accuracy! < 50;
            case "below30":
              return r.accuracy! < 30;
            default:
              return false;
          }
        });
      });
    }

    // Then sort
    if (runsSortField) {
      filtered.sort((a, b) => {
        let aValue: string | number | null;
        let bValue: string | number | null;

        switch (runsSortField) {
          case "evalId": {
            aValue = a.evalId.toLowerCase();
            bValue = b.evalId.toLowerCase();
            return runsSortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "evalName": {
            aValue = a.evalName.toLowerCase();
            bValue = b.evalName.toLowerCase();
            return runsSortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "runAt": {
            const aDate = new Date(a.runAt).getTime();
            const bDate = new Date(b.runAt).getTime();
            return runsSortDirection === "desc" ? bDate - aDate : aDate - bDate;
          }
          case "status": {
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            return runsSortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "accuracy": {
            aValue = a.accuracy ?? -1;
            bValue = b.accuracy ?? -1;
            return runsSortDirection === "desc" ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
          }
          case "averageDuration": {
            aValue = a.averageDuration ?? -1;
            bValue = b.averageDuration ?? -1;
            return runsSortDirection === "desc" ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
          }
          case "numberOfQuestions": {
            aValue = a.numberOfQuestions;
            bValue = b.numberOfQuestions;
            return runsSortDirection === "desc" ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number);
          }
          case "agentId": {
            const aAgent = availableAgents.find((agent) => agent.id === a.agentId);
            const bAgent = availableAgents.find((agent) => agent.id === b.agentId);
            aValue = aAgent?.name.toLowerCase() ?? "";
            bValue = bAgent?.name.toLowerCase() ?? "";
            return runsSortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          case "createdBy": {
            aValue = a.createdBy.toLowerCase();
            bValue = b.createdBy.toLowerCase();
            return runsSortDirection === "desc"
              ? String(bValue).localeCompare(String(aValue))
              : String(aValue).localeCompare(String(bValue));
          }
          default:
            return 0;
        }
      });
    }
    return filtered;
  }, [runs, runsSortField, runsSortDirection, runsSearchTerm, selectedRunsStatuses, selectedAccuracyThresholds, availableAgents]);

  // Calculate displayed runs (with pagination)
  const displayedRuns = useMemo(() => {
    return filteredAndSortedRuns.slice(0, runsItemsToShow);
  }, [filteredAndSortedRuns, runsItemsToShow]);

  const hasMoreRunsItems = runsItemsToShow < filteredAndSortedRuns.length;

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(25);
  }, [searchTerm, selectedDataProducts, selectedCreators]);

  // Handle scroll detection for back to top button and compact nav
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollThreshold = 300; // Show button after scrolling 300px
      const compactNavEnable = 80; // Switch to compact nav after 80px
      const compactNavDisable = 40; // Switch back after 40px
      const scrollTop = scrollContainer.scrollTop;

      setShowBackToTop(scrollTop > scrollThreshold);
      setIsScrolled((prev) => {
        if (prev) {
          return scrollTop > compactNavDisable;
        }
        return scrollTop > compactNavEnable;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Track sticky header height for table header offsets
  useEffect(() => {
    const headerNode = stickyHeaderRef.current;
    if (!headerNode) return;

    const updateHeaderHeight = () => {
      setStickyHeaderHeight(Math.ceil(headerNode.getBoundingClientRect().height));
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(headerNode);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [activeTab, isScrolled]);

  // Track search section height for table header offsets
  useEffect(() => {
    const searchNode = searchSectionRef.current;
    if (!searchNode) {
      setSearchSectionHeight(0);
      return;
    }

    const updateSearchHeight = () => {
      setSearchSectionHeight(Math.ceil(searchNode.getBoundingClientRect().height));
    };

    updateSearchHeight();
    const observer = new ResizeObserver(updateSearchHeight);
    observer.observe(searchNode);
    window.addEventListener("resize", updateSearchHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSearchHeight);
    };
  }, [activeTab, isScrolled]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 25);
  };

  const handleRunsLoadMore = () => {
    setRunsItemsToShow((prev) => prev + 25);
  };

  // Helper function to format duration
  const formatDuration = (ms: number | null) => {
    if (ms === null) return "-";
    const seconds = ms / 1000;
    // Use 2 decimal places for values < 1s, 1 decimal place for values >= 1s
    if (seconds < 1) {
      return `${seconds.toFixed(2)}s`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  // Helper function to get accuracy color
  const getAccuracyColor = (accuracy: number | null) => {
    if (accuracy === null) return theme.palette.text.secondary;
    if (accuracy > 80) return "#4caf50"; // green
    if (accuracy >= 50) return "#2196f3"; // blue
    if (accuracy >= 30) return "#ff9800"; // amber
    return "#f44336"; // red
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "??";
    const parts = trimmed.split(" ").filter((p) => p.length > 0);
    if (parts.length >= 2) {
      const first = parts[0]?.[0];
      const last = parts[parts.length - 1]?.[0];
      if (first && last) {
        return `${first}${last}`.toUpperCase();
      }
    }
    return trimmed.substring(0, 2).toUpperCase();
  };

  // Helper function to get color for user (consistent color based on name)
  const getUserColor = (name: string) => {
    const colors = [
      "#1976D2", // blue
      "#388E3C", // green
      "#F57C00", // orange
      "#7B1FA2", // purple
      "#C2185B", // pink
      "#00796B", // teal
      "#5D4037", // brown
      "#455A64", // blue grey
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper function to get status config
  const getStatusConfig = (status: Run["status"]) => {
    const statusConfig = {
      completed: {
        backgroundColor: theme.palette.green[200],
        color: theme.palette.success.main,
        dotColor: "#80CBC4",
        label: "Completed",
      },
      running: {
        backgroundColor: theme.palette.blue[200],
        color: theme.palette.info.main,
        dotColor: "#2196F3",
        label: "Running",
      },
      failed: {
        backgroundColor: theme.palette.red[200],
        color: theme.palette.error.main,
        dotColor: "#EF5350",
        label: "Failed",
      },
      pending: {
        backgroundColor: theme.palette.neutral[200],
        color: theme.palette.text.secondary,
        dotColor: "#9E9E9E",
        label: "Pending",
      },
    };
    return statusConfig[status];
  };

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Sticky Header Area - Contains Title + Nav Cards */}
      <Box
        ref={stickyHeaderRef}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: "24px",
            pb: "4px",
          }}
        >
          <Typography variant="h2">Evaluations</Typography>
        </Box>

        {/* Navigation - Large Cards (default) or Compact Segmented Control (scrolled) */}
        <Box
          sx={{
            px: "24px",
            pt: isScrolled ? "12px" : "24px",
            pb: isScrolled ? "12px" : 0,
            transition: "padding 200ms ease-out, height 200ms ease-out",
            position: "relative",
            height: isScrolled ? "40px" : "92px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Compact Segmented Control - fades in when scrolled */}
          <Box
            sx={{
              position: "absolute",
              top: isScrolled ? "12px" : "24px",
              left: "24px",
              right: "24px",
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 200ms ease-out, transform 200ms ease-out, top 200ms ease-out",
              pointerEvents: isScrolled ? "auto" : "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                borderRadius: "6px",
                overflow: "hidden",
                width: "fit-content",
                backgroundColor: theme.palette.neutral[100],
                padding: "2px",
                gap: "2px",
              }}
            >
            <Box
              component="button"
              type="button"
              onClick={() => setActiveTab("runs")}
              sx={{
                backgroundColor: activeTab === "runs" ? "white" : "transparent",
                padding: "6px 16px",
                border: "none",
                borderRadius: "4px",
                boxShadow: activeTab === "runs" 
                  ? "0px 1px 2px rgba(0, 0, 0, 0.1)"
                  : "none",
                cursor: "pointer",
                transition: `background-color ${"150ms"}, box-shadow ${"150ms"}`,
                "&:hover": {
                  backgroundColor: activeTab === "runs" ? "white" : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: activeTab === "runs" 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary,
                }}
              >
                Runs
              </Typography>
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => setActiveTab("questions")}
              sx={{
                backgroundColor: activeTab === "questions" ? "white" : "transparent",
                padding: "6px 16px",
                border: "none",
                borderRadius: "4px",
                boxShadow: activeTab === "questions" 
                  ? "0px 1px 2px rgba(0, 0, 0, 0.1)"
                  : "none",
                cursor: "pointer",
                transition: `background-color ${"150ms"}, box-shadow ${"150ms"}`,
                "&:hover": {
                  backgroundColor: activeTab === "questions" ? "white" : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: activeTab === "questions" 
                    ? theme.palette.text.primary 
                    : theme.palette.text.secondary,
                }}
              >
                Questions
              </Typography>
            </Box>
            </Box>
            {/* Create eval run button - compact view */}
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                setCreateEvalRunModalOpen(true);
              }}
              sx={{
                opacity: isScrolled ? 1 : 0,
                pointerEvents: isScrolled ? "auto" : "none",
                transition: "opacity 200ms ease-out",
              }}
            >
              Create eval run
            </Button>
          </Box>

          {/* Large Card Navigation - fades out when scrolled */}
          <Box
            sx={{
              opacity: isScrolled ? 0 : 1,
              transform: isScrolled ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 200ms ease-out, transform 200ms ease-out",
              pointerEvents: isScrolled ? "none" : "auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                borderRadius: "8px",
                overflow: "hidden",
                width: "fit-content",
                backgroundColor: theme.palette.neutral[100],
                padding: "2px",
                gap: "2px",
              }}
            >
            {/* Runs Card */}
            <Box
              component="button"
              type="button"
              onClick={() => setActiveTab("runs")}
              sx={{
                backgroundColor: activeTab === "runs" ? "white" : "transparent",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                boxShadow: activeTab === "runs" 
                  ? "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)"
                  : "none",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "320px",
                flexShrink: 0,
                cursor: "pointer",
                textAlign: "left",
                transition: `background-color ${"150ms"}, box-shadow ${"150ms"}`,
                "&:hover": {
                  backgroundColor: activeTab === "runs" ? "white" : theme.palette.neutral[100],
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                }}
              >
                Runs
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  50
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <CheckCircle size={14} color="#4caf50" />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      40
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock size={14} color="#2196f3" />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      2
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <XCircle size={14} color="#f44336" />
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                      }}
                    >
                      8
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Questions Card */}
            <Box
              component="button"
              type="button"
              onClick={() => setActiveTab("questions")}
              sx={{
                backgroundColor: activeTab === "questions" ? "white" : "transparent",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                boxShadow: activeTab === "questions" 
                  ? "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)"
                  : "none",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "320px",
                flexShrink: 0,
                cursor: "pointer",
                textAlign: "left",
                transition: `background-color ${"150ms"}, box-shadow ${"150ms"}`,
                "&:hover": {
                  backgroundColor: activeTab === "questions" ? "white" : theme.palette.neutral[100],
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                }}
              >
                Questions
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  100
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                    fontWeight: 400,
                  }}
                >
                  {dataProductsList.length} data products
                </Typography>
              </Box>
            </Box>
            </Box>
            {/* Create eval run button - large card view */}
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                setCreateEvalRunModalOpen(true);
              }}
              sx={{
                opacity: isScrolled ? 0 : 1,
                pointerEvents: isScrolled ? "none" : "auto",
                transition: "opacity 200ms ease-out",
              }}
            >
              Create eval run
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content area */}
      <Box
        ref={contentScrollRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeTab === "questions" && (
          <>
            {/* Search Section */}
            {questions.length > 0 && (
              <Box
                ref={searchSectionRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "24px",
                  pt: "20px",
                  pb: "8px",
                  gap: "8px",
                  flexWrap: "wrap",
                  position: "sticky",
                  top: Math.max(0, stickyHeaderHeight - stickyOverlapPx),
                  backgroundColor: "#ffffff",
                  zIndex: 20,
                  transition: "top 200ms ease-out",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                <TextField
                  placeholder="Search questions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#666",
                        }}
                      >
                        <Search size={18} />
                      </Box>
                    ),
                    endAdornment: searchTerm ? (
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                        sx={{ padding: "4px" }}
                      >
                        <X size={16} />
                      </IconButton>
                    ) : undefined,
                  }}
                  sx={{
                    minWidth: "280px",
                    "& .MuiOutlinedInput-root": {
                      ...(searchTerm && {
                        paddingRight: "4px",
                        "& input": {
                          paddingRight: "0px",
                        },
                        "& .MuiInputBase-inputAdornedEnd": {
                          paddingRight: "0px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                      }),
                    },
                  }}
                />

                {/* Data Product Multi-Select Filter */}
                <Select
                  multiple
                  value={selectedDataProducts}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDataProducts(typeof value === "string" ? value.split(",") : value);
                  }}
                  size="small"
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return "All data products";
                    }
                    if (selected.length === 1) {
                      return getDataProductName(selected[0] as string);
                    }
                    return `${selected.length} data products`;
                  }}
                  sx={{
                    minWidth: "200px",
                    ...(selectedDataProducts.length > 0 && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                    }),
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: "400px",
                        "& .MuiMenuItem-root .MuiListItemIcon-root": {
                          display: "none !important",
                        },
                        "& .MuiMenuItem-root .MuiListItemSecondaryAction-root": {
                          display: "none !important",
                        },
                        "& .MuiMenuItem-root[aria-selected='true']::after": {
                          display: "none !important",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "white",
                      minHeight: "40px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "13px",
                      }}
                    >
                      {selectedDataProducts.length === 0
                        ? `${dataProductsList.length} data products`
                        : `${selectedDataProducts.length} selected`}
                    </Typography>
                    {selectedDataProducts.length > 0 && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDataProducts([]);
                        }}
                        sx={{
                          minWidth: "auto",
                          padding: "4px 8px",
                          textTransform: "none",
                          color: theme.palette.text.secondary,
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>
                  {dataProductsList.map((dp) => (
                    <MenuItem
                      key={dp.id}
                      value={dp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedDataProducts.includes(dp.id) ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedDataProducts.includes(dp.id)}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      {dp.name}
                    </MenuItem>
                  ))}
                </Select>

                {/* Creator Multi-Select Filter */}
                <Select
                  multiple
                  value={selectedCreators}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCreators(typeof value === "string" ? value.split(",") : value);
                  }}
                  size="small"
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return "All creators";
                    }
                    if (selected.length === 1) {
                      return selected[0] as string;
                    }
                    return `${selected.length} creators`;
                  }}
                  sx={{
                    minWidth: "200px",
                    ...(selectedCreators.length > 0 && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.primary.main} !important`,
                      },
                    }),
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: "400px",
                        "& .MuiMenuItem-root .MuiListItemIcon-root": {
                          display: "none !important",
                        },
                        "& .MuiMenuItem-root .MuiListItemSecondaryAction-root": {
                          display: "none !important",
                        },
                        "& .MuiMenuItem-root[aria-selected='true']::after": {
                          display: "none !important",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "white",
                      minHeight: "40px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "13px",
                      }}
                    >
                      {selectedCreators.length === 0
                        ? `${creatorsList.length} creators`
                        : `${selectedCreators.length} selected`}
                    </Typography>
                    {selectedCreators.length > 0 && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCreators([]);
                        }}
                        sx={{
                          minWidth: "auto",
                          padding: "4px 8px",
                          textTransform: "none",
                          color: theme.palette.text.secondary,
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>
                  {creatorsList.map((creator) => (
                    <MenuItem
                      key={creator}
                      value={creator}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedCreators.includes(creator) ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedCreators.includes(creator)}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      <Avatar
                        sx={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: getUserColor(creator),
                          fontSize: "10px",
                          fontWeight: 500,
                        }}
                      >
                        {getInitials(creator)}
                      </Avatar>
                      {creator}
                    </MenuItem>
                  ))}
                </Select>

                {/* Clear filters button */}
                {(searchTerm || selectedDataProducts.length > 0 || selectedCreators.length > 0) && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDataProducts([]);
                      setSelectedCreators([]);
                    }}
                    sx={{
                      minWidth: "auto",
                      padding: "6px 12px",
                      textTransform: "none",
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Clear filters
                  </Button>
                )}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                pt: questions.length > 0 ? 0 : "24px",
              }}
            >
              {filteredAndSortedQuestions.length === 0 ? (
                (searchTerm || selectedDataProducts.length > 0 || selectedCreators.length > 0) ? (
                  <EmptySearchState
                    type="questions"
                    searchTerm={searchTerm || "your filters"}
                    onClearSearch={() => {
                      setSearchTerm("");
                      setSelectedDataProducts([]);
                      setSelectedCreators([]);
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    No questions
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    borderRadius: "8px",
                    "& table tbody tr": {
                      "&:hover": {
                        backgroundColor: "rgb(252, 252, 252)",
                      },
                    },
                  }}
                >
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <Box
                      component="thead"
                      sx={{
                        position: "sticky",
                        top: Math.max(0, stickyHeaderHeight + searchSectionHeight - stickyOverlapPx - tableHeaderOffsetPx),
                        zIndex: 10,
                        transition: "top 200ms ease-out",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: "0",
                          right: 0,
                          bottom: 0,
                          height: "1px",
                          backgroundColor: "rgb(240, 240, 240)",
                          pointerEvents: "none",
                        },
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                          onClick={() => handleSort("question")}
                          onMouseEnter={() => setHoveredHeaderId("question")}
                          onMouseLeave={() => setHoveredHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Question
                            {sortField === "question" ? (
                              sortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredHeaderId === "question" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            SQL
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "250px",
                            minWidth: "250px",
                            maxWidth: "250px",
                          }}
                          onClick={() => handleSort("dataProductId")}
                          onMouseEnter={() => setHoveredHeaderId("dataProductId")}
                          onMouseLeave={() => setHoveredHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Data Product
                            {sortField === "dataProductId" ? (
                              sortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredHeaderId === "dataProductId" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            width: "180px",
                            minWidth: "180px",
                            maxWidth: "180px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            Creator
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "240px",
                            minWidth: "240px",
                            maxWidth: "240px",
                          }}
                          onClick={() => handleSort("createdDate")}
                          onMouseEnter={() => setHoveredHeaderId("createdDate")}
                          onMouseLeave={() => setHoveredHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Created
                            {sortField === "createdDate" ? (
                              sortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredHeaderId === "createdDate" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                      </tr>
                    </Box>
                    <tbody>
                      {displayedQuestions.map((question) => (
                        <tr
                          key={question.id}
                          onMouseEnter={() => setHoveredRowId(question.id)}
                          onMouseLeave={() => setHoveredRowId(null)}
                        >
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                minWidth: 0,
                              }}
                            >
                              {question.question}
                            </div>
                            {hoveredRowId === question.id && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="inherit"
                                endIcon={<ExternalLink size={14} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Navigate to question detail page
                                }}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  right: "12px",
                                  transform: "translateY(-50%)",
                                  textTransform: "none",
                                  fontSize: "12px",
                                  "& .MuiButton-endIcon": {
                                    marginLeft: "4px",
                                    marginRight: 0,
                                  },
                                }}
                              >
                                View question
                              </Button>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              width: "100px",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            <Chip
                              icon={<Code size={14} />}
                              label="SQL"
                              variant="outlined"
                              size="small"
                              onMouseEnter={(e) => {
                                setSqlPopoverAnchor(e.currentTarget);
                                setSqlPopoverQuestionId(question.id);
                              }}
                              onMouseLeave={() => {
                                setSqlPopoverAnchor(null);
                                setSqlPopoverQuestionId(null);
                              }}
                              sx={{
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: "500",
                                backgroundColor: "white",
                                color: theme.palette.text.secondary,
                                borderColor: theme.palette.neutral[300],
                                cursor: "pointer",
                                "& .MuiChip-icon": {
                                  color: "inherit",
                                  marginLeft: "8px",
                                },
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "250px",
                              minWidth: "250px",
                              maxWidth: "250px",
                            }}
                          >
                            <Chip
                              label={getDataProductName(question.dataProductId)}
                              size="small"
                              sx={{
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: "500",
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                                color: theme.palette.text.secondary,
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "180px",
                              minWidth: "180px",
                              maxWidth: "180px",
                            }}
                          >
                            <Tooltip title={question.creator} arrow>
                              <Avatar
                                sx={{
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor: getUserColor(question.creator),
                                  fontSize: "11px",
                                  fontWeight: 500,
                                }}
                              >
                                {getInitials(question.creator)}
                              </Avatar>
                            </Tooltip>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "240px",
                              minWidth: "240px",
                              maxWidth: "240px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "8px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {formatDateAndTime(question.createdDate).date}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {formatDateAndTime(question.createdDate).time}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "400",
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                pst
                              </Typography>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}

              {/* Load More Button */}
              {hasMoreItems && !searchTerm && (
                <Box
                  sx={{
                    p: "24px",
                    pt: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ width: "320px" }}
                    onClick={handleLoadMore}
                  >
                    Load more
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
        {activeTab === "runs" && (
          <>
            {/* Search Section */}
            {runs.length > 0 && (
              <Box
                ref={searchSectionRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "24px",
                  pt: "20px",
                  pb: "8px",
                  gap: "8px",
                  flexWrap: "wrap",
                  position: "sticky",
                  top: Math.max(0, stickyHeaderHeight - stickyOverlapPx),
                  backgroundColor: "#ffffff",
                  zIndex: 20,
                  transition: "top 200ms ease-out",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    placeholder="Search runs"
                    value={runsSearchTerm}
                    onChange={(e) => setRunsSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#666",
                          }}
                        >
                          <Search size={18} />
                        </Box>
                      ),
                      endAdornment: runsSearchTerm ? (
                        <IconButton
                          size="small"
                          onClick={() => setRunsSearchTerm("")}
                          sx={{ padding: "4px" }}
                        >
                          <X size={16} />
                        </IconButton>
                      ) : undefined,
                    }}
                    sx={{
                      minWidth: "280px",
                      "& .MuiOutlinedInput-root": {
                        ...(runsSearchTerm && {
                          paddingRight: "4px",
                          "& input": {
                            paddingRight: "0px",
                          },
                          "& .MuiInputBase-inputAdornedEnd": {
                            paddingRight: "0px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${theme.palette.primary.main} !important`,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${theme.palette.primary.main} !important`,
                          },
                        }),
                      },
                    }}
                  />

                  {/* Status Filter */}
                  <Select
                    multiple
                    value={selectedRunsStatuses}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedRunsStatuses(typeof value === "string" ? value.split(",") : value);
                    }}
                    size="small"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return "All statuses";
                      }
                      if (selected.length === 1 && selected[0]) {
                        return selected[0].charAt(0).toUpperCase() + selected[0].slice(1);
                      }
                      return `${selected.length} statuses`;
                    }}
                    sx={{
                      minWidth: "160px",
                      ...(selectedRunsStatuses.length > 0 && {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                      }),
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: "400px",
                          "& .MuiMenuItem-root .MuiListItemIcon-root": {
                            display: "none !important",
                          },
                          "& .MuiMenuItem-root .MuiListItemSecondaryAction-root": {
                            display: "none !important",
                          },
                          "& .MuiMenuItem-root[aria-selected='true']::after": {
                            display: "none !important",
                          },
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        minHeight: "40px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "13px",
                        }}
                      >
                        {selectedRunsStatuses.length === 0
                          ? "4 statuses"
                          : `${selectedRunsStatuses.length} selected`}
                      </Typography>
                      {selectedRunsStatuses.length > 0 && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRunsStatuses([]);
                          }}
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
                            textTransform: "none",
                            color: theme.palette.text.secondary,
                            fontSize: "13px",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </Box>
                    {["completed", "running", "failed", "pending"].map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          backgroundColor: selectedRunsStatuses.includes(status) ? "rgba(0, 0, 0, 0.04)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        <Checkbox
                          checked={selectedRunsStatuses.includes(status)}
                          size="small"
                          sx={{ padding: "4px" }}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Accuracy Threshold Filter */}
                  <Select
                    multiple
                    value={selectedAccuracyThresholds}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedAccuracyThresholds(typeof value === "string" ? value.split(",") : value);
                    }}
                    size="small"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return "All accuracy";
                      }
                      if (selected.length === 1 && selected[0]) {
                        const getThresholdConfig = (value: string) => {
                          switch (value) {
                            case "above80":
                              return { label: "Above 80%", color: "#4caf50" };
                            case "50to80":
                              return { label: "50% - 80%", color: "#2196f3" };
                            case "30to50":
                              return { label: "30% - 50%", color: "#ff9800" };
                            case "below30":
                              return { label: "Below 30%", color: "#f44336" };
                            default:
                              return { label: "", color: "" };
                          }
                        };
                        const config = getThresholdConfig(selected[0]);
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Box
                              sx={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: config.color,
                                flexShrink: 0,
                              }}
                            />
                            <span>{config.label}</span>
                          </Box>
                        );
                      }
                      return `${selected.length} thresholds`;
                    }}
                    sx={{
                      minWidth: "160px",
                      ...(selectedAccuracyThresholds.length > 0 && {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: `${theme.palette.primary.main} !important`,
                        },
                      }),
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: "400px",
                          "& .MuiMenuItem-root .MuiListItemIcon-root": {
                            display: "none !important",
                          },
                          "& .MuiMenuItem-root .MuiListItemSecondaryAction-root": {
                            display: "none !important",
                          },
                          "& .MuiMenuItem-root[aria-selected='true']::after": {
                            display: "none !important",
                          },
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        minHeight: "40px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "13px",
                        }}
                      >
                        {selectedAccuracyThresholds.length === 0
                          ? "4 thresholds"
                          : `${selectedAccuracyThresholds.length} selected`}
                      </Typography>
                      {selectedAccuracyThresholds.length > 0 && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccuracyThresholds([]);
                          }}
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
                            textTransform: "none",
                            color: theme.palette.text.secondary,
                            fontSize: "13px",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </Box>
                    <MenuItem
                      value="above80"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedAccuracyThresholds.includes("above80") ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedAccuracyThresholds.includes("above80")}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box
                          sx={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#4caf50",
                            flexShrink: 0,
                          }}
                        />
                        <span>Above 80%</span>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      value="50to80"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedAccuracyThresholds.includes("50to80") ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedAccuracyThresholds.includes("50to80")}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box
                          sx={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#2196f3",
                            flexShrink: 0,
                          }}
                        />
                        <span>50% - 80%</span>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      value="30to50"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedAccuracyThresholds.includes("30to50") ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedAccuracyThresholds.includes("30to50")}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box
                          sx={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#ff9800",
                            flexShrink: 0,
                          }}
                        />
                        <span>30% - 50%</span>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      value="below30"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: selectedAccuracyThresholds.includes("below30") ? "rgba(0, 0, 0, 0.04)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={selectedAccuracyThresholds.includes("below30")}
                        size="small"
                        sx={{ padding: "4px" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box
                          sx={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                            flexShrink: 0,
                          }}
                        />
                        <span>Below 30%</span>
                      </Box>
                    </MenuItem>
                  </Select>

                  {/* Clear filters button */}
                  {(runsSearchTerm || selectedRunsStatuses.length > 0 || selectedAccuracyThresholds.length > 0) && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setRunsSearchTerm("");
                        setSelectedRunsStatuses([]);
                        setSelectedAccuracyThresholds([]);
                      }}
                      sx={{
                        minWidth: "auto",
                        padding: "6px 12px",
                        textTransform: "none",
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </Box>

                {/* Count */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {filteredAndSortedRuns.length} {filteredAndSortedRuns.length === 1 ? "run" : "runs"}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "24px",
                pt: runs.length > 0 ? 0 : "24px",
              }}
            >
              {filteredAndSortedRuns.length === 0 ? (
                (runsSearchTerm || selectedRunsStatuses.length > 0 || selectedAccuracyThresholds.length > 0) ? (
                  <EmptySearchState
                    type="runs"
                    searchTerm={runsSearchTerm || "your filters"}
                    onClearSearch={() => {
                      setRunsSearchTerm("");
                      setSelectedRunsStatuses([]);
                      setSelectedAccuracyThresholds([]);
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    No runs
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    borderRadius: "8px",
                    "& table tbody tr": {
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgb(252, 252, 252)",
                      },
                    },
                  }}
                >
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                    }}
                  >
                    <Box
                      component="thead"
                      sx={{
                        position: "sticky",
                        top: Math.max(0, stickyHeaderHeight + searchSectionHeight - stickyOverlapPx - tableHeaderOffsetPx),
                        zIndex: 10,
                        transition: "top 200ms ease-out",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: "0",
                          right: 0,
                          bottom: 0,
                          height: "1px",
                          backgroundColor: "rgb(240, 240, 240)",
                          pointerEvents: "none",
                        },
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                          }}
                          onClick={() => handleRunsSort("evalId")}
                          onMouseEnter={() => setHoveredRunsHeaderId("evalId")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Eval id
                            {runsSortField === "evalId" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "evalId" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "100%",
                          }}
                          onClick={() => handleRunsSort("evalName")}
                          onMouseEnter={() => setHoveredRunsHeaderId("evalName")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Eval name
                            {runsSortField === "evalName" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "evalName" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "200px",
                            minWidth: "200px",
                            maxWidth: "200px",
                          }}
                          onClick={() => handleRunsSort("agentId")}
                          onMouseEnter={() => setHoveredRunsHeaderId("agentId")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Agent
                            {runsSortField === "agentId" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "agentId" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "right",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "60px",
                            minWidth: "60px",
                            maxWidth: "60px",
                          }}
                          onClick={() => handleRunsSort("numberOfQuestions")}
                          onMouseEnter={() => setHoveredRunsHeaderId("numberOfQuestions")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            {runsSortField === "numberOfQuestions" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "numberOfQuestions" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                            Qs
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "180px",
                            minWidth: "180px",
                            maxWidth: "180px",
                          }}
                          onClick={() => handleRunsSort("runAt")}
                          onMouseEnter={() => setHoveredRunsHeaderId("runAt")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Run at
                            {runsSortField === "runAt" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "runAt" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "100px",
                            minWidth: "100px",
                            maxWidth: "100px",
                          }}
                          onClick={() => handleRunsSort("status")}
                          onMouseEnter={() => setHoveredRunsHeaderId("status")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Status
                            {runsSortField === "status" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "status" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "right",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "140px",
                            minWidth: "140px",
                            maxWidth: "140px",
                          }}
                          onClick={() => handleRunsSort("accuracy")}
                          onMouseEnter={() => setHoveredRunsHeaderId("accuracy")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            {runsSortField === "accuracy" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "accuracy" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                            Accuracy
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "right",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "80px",
                            minWidth: "80px",
                            maxWidth: "80px",
                          }}
                          onClick={() => handleRunsSort("averageDuration")}
                          onMouseEnter={() => setHoveredRunsHeaderId("averageDuration")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            {runsSortField === "averageDuration" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "averageDuration" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                            Average duration
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "left",
                            cursor: "pointer",
                            userSelect: "none",
                            width: "auto",
                          }}
                          onClick={() => handleRunsSort("createdBy")}
                          onMouseEnter={() => setHoveredRunsHeaderId("createdBy")}
                          onMouseLeave={() => setHoveredRunsHeaderId(null)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: theme.palette.text.secondary,
                              gap: "8px",
                            }}
                          >
                            Creator
                            {runsSortField === "createdBy" ? (
                              runsSortDirection === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )
                            ) : (
                              hoveredRunsHeaderId === "createdBy" && (
                                <ArrowUpDown size={16} style={{ opacity: 0.5 }} />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                            borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                            textAlign: "center",
                            width: "48px",
                            minWidth: "48px",
                            maxWidth: "48px",
                          }}
                        >
                        </th>
                      </tr>
                    </Box>
                    <tbody>
                      {displayedRuns.map((run) => (
                        <tr
                          key={run.evalId}
                          onMouseEnter={() => setHoveredRunsRowId(run.evalId)}
                          onMouseLeave={() => setHoveredRunsRowId(null)}
                          onClick={() => router.push(`/app/marketplace/evaluations/runs/${run.evalId}`)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              width: "100px",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                              }}
                            >
                              {run.evalId}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              width: "100%",
                              maxWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {run.evalName}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              width: "200px",
                              minWidth: "200px",
                              maxWidth: "200px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <ItemTypeIcon type="Agent" size={20} />
                              {(() => {
                                const agent = availableAgents.find((a) => a.id === run.agentId);
                                return agent ? agent.name : run.agentId;
                              })()}
                            </Box>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              width: "60px",
                              minWidth: "60px",
                              maxWidth: "60px",
                              textAlign: "right",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                textAlign: "right",
                              }}
                            >
                              {run.numberOfQuestions}
                            </Typography>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "180px",
                              minWidth: "180px",
                              maxWidth: "180px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: theme.palette.text.secondary,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatDateAndTime(run.runAt).date} {formatDateAndTime(run.runAt).time} {formatDateAndTime(run.runAt).timezone}
                            </Typography>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              width: "100px",
                              minWidth: "100px",
                              maxWidth: "100px",
                            }}
                          >
                            <Chip
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  {run.status === "running" && (
                                    <Box
                                      sx={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        backgroundColor: getStatusConfig(run.status).dotColor,
                                        flexShrink: 0,
                                        animation: `${pulse} 2s ease-in-out infinite`,
                                      }}
                                    />
                                  )}
                                  <span>{getStatusConfig(run.status).label}</span>
                                </Box>
                              }
                              size="small"
                              sx={{
                                height: "20px",
                                fontSize: "12px",
                                backgroundColor: getStatusConfig(run.status).backgroundColor,
                                color: getStatusConfig(run.status).color,
                                width: "fit-content",
                                border: "none",
                                "&:hover": {
                                  backgroundColor: getStatusConfig(run.status).backgroundColor,
                                },
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "140px",
                              minWidth: "140px",
                              maxWidth: "140px",
                              textAlign: "right",
                            }}
                          >
                            {run.accuracy !== null && run.passedQuestions !== null ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: getAccuracyColor(run.accuracy),
                                  textAlign: "right",
                                }}
                              >
                                {run.accuracy.toFixed(2)}% ({run.passedQuestions}/{run.numberOfQuestions})
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: theme.palette.text.secondary,
                                  textAlign: "right",
                                }}
                              >
                                -
                              </Typography>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                              width: "80px",
                              minWidth: "80px",
                              maxWidth: "80px",
                              textAlign: "right",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                textAlign: "right",
                              }}
                            >
                              {formatDuration(run.averageDuration)}
                            </Typography>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                              width: "auto",
                            }}
                          >
                            <Tooltip title={run.createdBy} arrow>
                              <Avatar
                                sx={{
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor: getUserColor(run.createdBy),
                                  fontSize: "11px",
                                  fontWeight: 500,
                                }}
                              >
                                {getInitials(run.createdBy)}
                              </Avatar>
                            </Tooltip>
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                              fontSize: "13px",
                              width: "48px",
                              minWidth: "48px",
                              maxWidth: "48px",
                              textAlign: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: hoveredRunsRowId === run.evalId ? 1 : 0,
                                transition: "opacity 0.15s ease",
                              }}
                            >
                              <Tooltip title="Download report" arrow>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle download report
                                    console.log("Download report for:", run.evalId);
                                  }}
                                  sx={{
                                    padding: "4px",
                                    "&:hover": {
                                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                                    },
                                  }}
                                >
                                  <Download size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}

              {/* Load More Button */}
              {hasMoreRunsItems && !runsSearchTerm && selectedRunsStatuses.length === 0 && selectedAccuracyThresholds.length === 0 && (
                <Box
                  sx={{
                    p: "24px",
                    pt: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ width: "320px" }}
                    onClick={handleRunsLoadMore}
                  >
                    Load more
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* SQL Popover */}
      <Popover
        open={Boolean(sqlPopoverAnchor)}
        anchorEl={sqlPopoverAnchor}
        onClose={() => {
          setSqlPopoverAnchor(null);
          setSqlPopoverQuestionId(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: "none",
          "& .MuiPopover-paper": {
            pointerEvents: "auto",
            marginTop: "8px",
            maxWidth: "500px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
        onMouseEnter={() => {
          // Keep popover open when hovering over it
        }}
        onMouseLeave={() => {
          setSqlPopoverAnchor(null);
          setSqlPopoverQuestionId(null);
        }}
      >
        {sqlPopoverQuestionId && (
          <Box
            sx={{
              p: "12px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: "1.5",
                color: theme.palette.text.primary,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {questions.find((q) => q.id === sqlPopoverQuestionId)?.sql || ""}
            </Typography>
          </Box>
        )}
      </Popover>

      {/* Create Eval Run Modal – full 4-step flow (Select agent → Select questions → Eval details → Validate and confirm) */}
      <CreateEvalRunModal
        open={createEvalRunModalOpen}
        onClose={() => setCreateEvalRunModalOpen(false)}
        agents={availableAgents}
        questions={questions}
        dataProducts={dataProductsList}
        runs={runs}
        onSuccess={() => setEvalRunToastOpen(true)}
      />


      {/* Eval Run Success Toast */}
      <Snackbar
        open={evalRunToastOpen}
        autoHideDuration={6000}
        onClose={() => setEvalRunToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setEvalRunToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Eval scheduled successfully
        </Alert>
      </Snackbar>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        variant="contained"
        startIcon={<ArrowUp size={16} />}
        sx={{
          position: "fixed",
          bottom: "24px",
          right: "40px",
          boxShadow: "none",
          zIndex: 1000,
          opacity: showBackToTop ? 1 : 0,
          pointerEvents: showBackToTop ? "auto" : "none",
          transition: "opacity 0.15s ease, transform 0.15s ease",
        }}
      >
        Back to top
      </Button>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EvaluationsPageContent />
    </Suspense>
  );
}
