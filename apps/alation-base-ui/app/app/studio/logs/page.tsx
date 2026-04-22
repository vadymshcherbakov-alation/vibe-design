"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, FileClock } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MOCK_ROWS } from "./mock-logs";
import { ItemTypeIcon } from "../flows/components/item-type-icon";
import { EmptyState } from "../mcp-servers/components/empty-state";

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];

  if (!first) {
    return "U";
  }
  if (!second) {
    return first.slice(0, 1).toUpperCase();
  }
  return `${first.slice(0, 1)}${second.slice(0, 1)}`.toUpperCase();
}

function isJsonObjectInput(input: string): boolean {
  try {
    const parsed = JSON.parse(input);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function formatJsonObjectInput(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

function getSourceLabel(source: string): string {
  if (source === "FLOW") {
    return "Flow (manual)";
  }
  if (source === "FLOW_SCHEDULED") {
    return "Flow (Scheduled)";
  }
  if (source === "AGENT_STUDIO") {
    return "Agent Studio";
  }
  if (source === "CHAT_WITH_DATA") {
    return "Chat with Data";
  }
  if (source === "REST_API" || source === "REST") {
    return "REST";
  }
  if (source === "MCP") {
    return "MCP";
  }
  if (source === "EVALUATION" || source === "EVAL") {
    return "Eval";
  }
  return source;
}

type DateRange = "all" | "24h" | "7d" | "30d";

function getQuickDateRangeStart(range: DateRange): number | null {
  if (range === "all") {
    return null;
  }
  const now = Date.now();
  if (range === "24h") {
    return now - 24 * 60 * 60 * 1000;
  }
  if (range === "7d") {
    return now - 7 * 24 * 60 * 60 * 1000;
  }
  return now - 30 * 24 * 60 * 60 * 1000;
}

export default function LogsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>("all");
  const [userFilter, setUserFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [llmFilter, setLlmFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [inputPopoverAnchorEl, setInputPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [inputPopoverContent, setInputPopoverContent] = useState("");

  const userOptions = useMemo(
    () => Array.from(new Set(MOCK_ROWS.map((row) => row.userName))),
    [],
  );
  const sourceOptions = useMemo(
    () => Array.from(new Set(MOCK_ROWS.map((row) => row.metadata))),
    [],
  );
  const llmOptions = useMemo(
    () => Array.from(new Set(MOCK_ROWS.map((row) => row.llm))),
    [],
  );
  const agentOptions = useMemo(
    () => Array.from(new Set(MOCK_ROWS.map((row) => row.agent))),
    [],
  );
  const getUserAvatarColors = (userName: string) => {
    const avatarColors = [
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
    for (let index = 0; index < userName.length; index += 1) {
      hash = userName.charCodeAt(index) + ((hash << 5) - hash);
    }

    return {
      backgroundColor: avatarColors[Math.abs(hash) % avatarColors.length],
      color: "#ffffff",
    };
  };

  const filteredRows = useMemo(() => {
    const quickRangeStartTs = getQuickDateRangeStart(dateRangeFilter);
    const searchText = searchTerm.trim().toLowerCase();

    return MOCK_ROWS.filter((row) => {
      if (userFilter !== "all" && row.userName !== userFilter) {
        return false;
      }
      if (sourceFilter !== "all" && row.metadata !== sourceFilter) {
        return false;
      }
      if (llmFilter !== "all" && row.llm !== llmFilter) {
        return false;
      }
      if (agentFilter !== "all" && row.agent !== agentFilter) {
        return false;
      }

      const rowTimestamp = new Date(row.timestamp).getTime();
      if (quickRangeStartTs && rowTimestamp < quickRangeStartTs) {
        return false;
      }

      if (!searchText) {
        return true;
      }

      const searchableContent =
        `${row.input} ${row.output} ${row.message} ${row.agent} ${row.llm}`.toLowerCase();
      return searchableContent.includes(searchText);
    });
  }, [
    agentFilter,
    dateRangeFilter,
    llmFilter,
    searchTerm,
    sourceFilter,
    userFilter,
  ]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    userFilter !== "all" ||
    sourceFilter !== "all" ||
    llmFilter !== "all" ||
    agentFilter !== "all" ||
    dateRangeFilter !== "all";

  const headerTypographySx = {
    color: theme.palette.text.secondary,
    fontWeight: "500",
  };

  const isInputPopoverOpen = Boolean(inputPopoverAnchorEl);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: "24px",
            pb: "4px",
            zIndex: 20,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h2">Logs</Typography>
        </Box>

        {/* Filter Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: "24px",
            pt: "20px",
            pb: "20px",
            gap: "8px",
            flexWrap: "wrap",
            position: "sticky",
            top: 0,
            backgroundColor: "#ffffff",
            zIndex: 20,
          }}
        >
          <TextField
            size="small"
            placeholder="Search logs"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{ minWidth: "260px" }}
          />
          <Select
            size="small"
            value={dateRangeFilter}
            onChange={(event) =>
              setDateRangeFilter(event.target.value as DateRange)
            }
            sx={{
              minWidth: "175px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingLeft: "12px",
              },
            }}
            renderValue={(value) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar
                  size={16}
                  style={{ color: theme.palette.text.primary }}
                />
                <Typography variant="body2">
                  {value === "all"
                    ? "All time"
                    : value === "24h"
                      ? "Last 24 hours"
                      : value === "7d"
                        ? "Last 7 days"
                        : "Last 30 days"}
                </Typography>
              </Box>
            )}
          >
            <MenuItem value="all">All time</MenuItem>
            <MenuItem value="24h">Last 24 hours</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
          </Select>
          <Select
            size="small"
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
            sx={{ minWidth: "160px" }}
          >
            <MenuItem value="all">All users</MenuItem>
            {userOptions.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value)}
            sx={{ minWidth: "140px" }}
          >
            <MenuItem value="all">All sources</MenuItem>
            {sourceOptions.map((source) => (
              <MenuItem key={source} value={source}>
                {getSourceLabel(source)}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={llmFilter}
            onChange={(event) => setLlmFilter(event.target.value)}
            sx={{ minWidth: "160px" }}
          >
            <MenuItem value="all">All LLMs</MenuItem>
            {llmOptions.map((llm) => (
              <MenuItem key={llm} value={llm}>
                {llm}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={agentFilter}
            onChange={(event) => setAgentFilter(event.target.value)}
            sx={{ minWidth: "170px" }}
          >
            <MenuItem value="all">All agents</MenuItem>
            {agentOptions.map((agent) => (
              <MenuItem key={agent} value={agent}>
                {agent}
              </MenuItem>
            ))}
          </Select>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              onClick={() => {
                setSearchTerm("");
                setDateRangeFilter("all");
                setUserFilter("all");
                setSourceFilter("all");
                setLlmFilter("all");
                setAgentFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{
              marginLeft: "auto",
              color: theme.palette.text.secondary,
            }}
          >
            {filteredRows.length} log{filteredRows.length === 1 ? "" : "s"}
          </Typography>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: "24px", pt: "0px" }}>
          {/* Logs Table */}
          <TableContainer
            sx={{
              borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
              borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
              overflowX: "auto",
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgb(252, 252, 252)",
              },
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 1200,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      Input
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      Output
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      Source
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      Agent
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      User
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      LLM
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      py: "12px",
                      px: "12px",
                      borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                    }}
                  >
                    <Typography variant="body2" sx={headerTypographySx}>
                      Timestamp
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: "40px", px: "12px" }}>
                      <EmptyState
                        icon={FileClock}
                        title="No logs found"
                        description="Try adjusting your search or filters."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => {
                    const rowInputIsJson = isJsonObjectInput(row.input);

                    return (
                      <TableRow
                        key={row.id}
                        onClick={() => router.push(`/app/studio/logs/${row.id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                      <TableCell
                        sx={{
                          maxWidth: "240px",
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Box
                          onMouseEnter={(event) => {
                            if (!rowInputIsJson) {
                              return;
                            }
                            setInputPopoverAnchorEl(event.currentTarget);
                            setInputPopoverContent(formatJsonObjectInput(row.input));
                          }}
                          onMouseLeave={() => {
                            setInputPopoverAnchorEl(null);
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Tooltip
                            title={rowInputIsJson ? "JSON" : "Message"}
                          >
                            <Box sx={{ display: "inline-flex" }}>
                              <ItemTypeIcon
                                type={rowInputIsJson ? "JSON" : "Message"}
                                size={24}
                              />
                            </Box>
                          </Tooltip>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.primary,
                              textAlign: "start",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.input}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "260px",
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.output}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Chip
                          size="small"
                          label={getSourceLabel(row.metadata)}
                          sx={{
                            height: "22px",
                            "& .MuiChip-label": {
                              fontSize: "11px",
                            },
                            color: theme.palette.text.primary,
                            backgroundColor:
                              theme.palette.neutral[100],
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "180px",
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        {/* Agent name and capability badge */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            minWidth: 0,
                          }}
                        >
                          <ItemTypeIcon type="Agent" size="small" />
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.primary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.agent}
                          </Typography>
                          {row.functions.includes("sql_execution_tool") && (
                            <Chip
                              size="small"
                              label="SQL-Enabled"
                              sx={{
                                height: "20px",
                                fontSize: "11px",
                                fontWeight: "500",
                                color: theme.palette.text.primary,
                                backgroundColor:
                                  theme.palette.neutral[100],
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "180px",
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        {/* User avatar */}
                        <Box sx={{ display: "inline-flex" }}>
                          <Avatar
                            sx={{
                              width: "22px",
                              height: "22px",
                              fontSize: "10px",
                              backgroundColor:
                                getUserAvatarColors(row.userName).backgroundColor,
                              color: getUserAvatarColors(row.userName).color,
                            }}
                          >
                            {getInitials(row.userName)}
                          </Avatar>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {row.llm}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: "12px",
                          px: "12px",
                          borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {formatTimestamp(row.timestamp)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Popover
        open={isInputPopoverOpen}
        anchorEl={inputPopoverAnchorEl}
        onClose={() => setInputPopoverAnchorEl(null)}
        disableRestoreFocus
        sx={{ pointerEvents: "none" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: "560px",
            maxWidth: "560px",
            p: "12px",
            borderRadius: "8px",
            border: `1px solid ${"rgb(240, 240, 240)"}`,
            backgroundColor: "#ffffff",
          },
        }}
      >
        <SyntaxHighlighter
          language="json"
          style={oneDark}
          wrapLongLines
          customStyle={{
            margin: 0,
            background: "transparent",
            color: theme.palette.text.primary,
            textShadow: "none",
            fontSize: "12px",
          }}
          codeTagProps={{ style: { fontFamily: "inherit", textShadow: "none" } }}
        >
          {inputPopoverContent}
        </SyntaxHighlighter>
      </Popover>
    </Box>
  );
}
