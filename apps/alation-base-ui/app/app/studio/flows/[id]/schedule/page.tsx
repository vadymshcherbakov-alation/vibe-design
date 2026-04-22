"use client";
import {
  Box,
  Typography,
  Chip,
  keyframes,
  IconButton,
  Button,
  Switch,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  Avatar,
  Popover,
} from "@mui/material";
import { DeleteConfirmationDialog } from "../../components/delete-flow-dialog";
import { CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  MoreVertical,
  Calendar,
  Info,
  Settings2,
  Code,
  AlertTriangle,
} from "lucide-react";
import { NewScheduleDialog } from "./components/new-schedule-dialog";
import { ScheduleEmptyState } from "./components/schedule-empty-state";
import { CURRENT_USER } from "../../../constants";
import { useFlowEditStore } from "../../store/useFlowEditStore";
import { FlowSettingsModal } from "../../components/flow-settings-modal";

// Extend ColumnMeta to include custom properties
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    flexible?: boolean;
  }
}

interface ScheduleItem {
  id: string;
  summary: string;
  runCount: number;
  lastRun: {
    status: "success" | "failed" | "queue";
    date: string;
  };
  created: string;
  enabled: boolean;
  creator: {
    initials: string;
    color: string;
    fullName: string;
  };
  parameters?: Record<string, string>;
}

// Demo data for schedules
const demoSchedules: ScheduleItem[] = [
  {
    id: "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789",
    summary: "Weekly on Monday and Friday at 19:00 PST",
    runCount: 24,
    lastRun: {
      status: "success",
      date: "Dec 29, 2024 07:00 PM",
    },
    created: "Nov 15, 2024",
    enabled: true,
    creator: {
      initials: "JD",
      color: "#4CAF50",
      fullName: "John Doe",
    },
    parameters: {
      query: "SELECT * FROM users WHERE active = true AND created_at > '2024-01-01'",
      maxResults: "100",
      enableCache: "true",
      filters: '{"status": "active", "role": "admin", "department": "engineering"}',
      timeout: "30",
    },
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890",
    summary: "Daily at 09:00 PST",
    runCount: 45,
    lastRun: {
      status: "failed",
      date: "Dec 29, 2024 09:00 AM",
    },
    created: "Oct 20, 2024",
    enabled: true,
    creator: {
      initials: "SM",
      color: "#2196F3",
      fullName: "Sarah Miller",
    },
    parameters: {
      query: "process_daily_reports",
      maxResults: "50",
      enableCache: "false",
      filters: '{"reportType": "daily_summary", "includeMetrics": true, "format": "json"}',
      timeout: "60",
    },
  },
  {
    id: "c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901",
    summary: "Every 6 hours",
    runCount: 12,
    lastRun: {
      status: "queue",
      date: "Dec 29, 2024 12:00 PM",
    },
    created: "Dec 10, 2024",
    enabled: false,
    creator: {
      initials: "AB",
      color: "#FF9800",
      fullName: "Alex Brown",
    },
    parameters: {
      query: "sync_data",
      maxResults: "200",
      enableCache: "true",
      filters: '{"source": "external_api", "endpoints": ["users", "orders", "products"], "batchSize": 50}',
      timeout: "45",
    },
  },
  {
    id: "d4e5f6a7-b8c9-4012-d345-e6f7a8b9c012",
    summary: "Monthly on the 1st at 00:00 PST",
    runCount: 3,
    lastRun: {
      status: "success",
      date: "Dec 1, 2024 12:00 AM",
    },
    created: "Nov 1, 2024",
    enabled: true,
    creator: {
      initials: "JD",
      color: "#4CAF50",
      fullName: "John Doe",
    },
    parameters: {
      query: "monthly_aggregation",
      maxResults: "1000",
      enableCache: "false",
      filters: '{"period": "monthly", "includeArchived": false, "metrics": ["revenue", "users", "conversions"], "dateRange": "2024-12"}',
      timeout: "120",
    },
  },
  {
    id: "e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123",
    summary: "Weekdays at 14:00 PST",
    runCount: 18,
    lastRun: {
      status: "success",
      date: "Dec 28, 2024 02:00 PM",
    },
    created: "Nov 25, 2024",
    enabled: true,
    creator: CURRENT_USER,
    parameters: {
      query: "afternoon_sync",
      maxResults: "75",
      enableCache: "true",
      filters: '{"syncType": "incremental", "tables": ["transactions", "analytics"], "lastSync": "2024-12-28T14:00:00Z"}',
      timeout: "30",
    },
  },
  {
    id: "f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234",
    summary: "Every 12 hours",
    runCount: 8,
    lastRun: {
      status: "success",
      date: "Dec 29, 2024 06:00 AM",
    },
    created: "Dec 5, 2024",
    enabled: true,
    creator: {
      initials: "SM",
      color: "#2196F3",
      fullName: "Sarah Miller",
    },
    // No parameters - shows empty state
  },
];

const columnHelper = createColumnHelper<ScheduleItem>();

const pulse = keyframes`
  0%, 100% {
    background-color: #F5F5F5;
  }
  50% {
    background-color: #EEEEEE;
  }
`;

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(demoSchedules);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuScheduleId, setMenuScheduleId] = useState<string | null>(null);
  const [newScheduleDialogOpen, setNewScheduleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleItem | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [parametersPopoverAnchor, setParametersPopoverAnchor] = useState<HTMLElement | null>(null);
  const [parametersPopoverScheduleId, setParametersPopoverScheduleId] = useState<string | null>(null);
  const theme = useTheme();
  const { scheduleAuthorized } = useFlowEditStore();
  const searchParams = useSearchParams();

  // Check route parameter for expired auth demo
  const hasExpiredAuth = searchParams.get("authExpired") === "true";
  const emptyStateVariant = searchParams.get("emptyState");
  const forceEmptyState =
    emptyStateVariant === "new-schedule" || emptyStateVariant === "authorize";
  const effectiveSchedules = forceEmptyState ? [] : schedules;
  const showEmptyState = effectiveSchedules.length === 0;

  const emptyStateContent =
    emptyStateVariant === "authorize"
      ? {
          title: "Authorization required",
          description:
            "A valid authorization is required before you can create and manage scheduled runs.",
          ctaLabel: "Authorize",
          onCtaClick: () => setSettingsModalOpen(true),
        }
      : {
          title: "No schedules yet",
          description: "Create a schedule to run this flow automatically.",
          ctaLabel: "New schedule",
          onCtaClick: () => setNewScheduleDialogOpen(true),
        };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    scheduleId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuScheduleId(scheduleId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuScheduleId(null);
  };

  const handleDeleteClick = () => {
    const schedule = schedules.find((s) => s.id === menuScheduleId);
    if (schedule) {
      setScheduleToDelete(schedule);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (scheduleToDelete) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete.id));
      setSnackbarMessage("Schedule deleted successfully");
      setSnackbarOpen(true);
      setScheduleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setScheduleToDelete(null);
  };

  const handleToggleEnabled = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const handleSaveNewSchedule = (scheduleData: {
    frequency: string;
    time: string;
    timezone: string;
    enabled: boolean;
    selectedDays?: string[];
    selectedDayOfMonth?: number;
    parameters: Record<string, string>;
  }) => {
    // Generate a summary based on the schedule data
    const generateSummary = () => {
      if (scheduleData.frequency === "daily") {
        return `Every day at ${scheduleData.time} ${scheduleData.timezone}`;
      } else if (scheduleData.frequency === "weekly") {
        if (scheduleData.selectedDays && scheduleData.selectedDays.length > 0) {
          const dayFullNames = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const dayIndices = scheduleData.selectedDays.map((day) =>
            dayNames.indexOf(day)
          );
          const sortedDays = dayIndices
            .sort((a, b) => a - b)
            .map((idx) => dayFullNames[idx]);
          if (sortedDays.length === 1) {
            return `Weekly on ${sortedDays[0]} at ${scheduleData.time} ${scheduleData.timezone}`;
          } else if (sortedDays.length === 2) {
            return `Weekly on ${sortedDays[0]} and ${sortedDays[1]} at ${scheduleData.time} ${scheduleData.timezone}`;
          } else {
            const lastDay = sortedDays.pop();
            return `Weekly on ${sortedDays.join(", ")}, and ${lastDay} at ${scheduleData.time} ${scheduleData.timezone}`;
          }
        }
        return `Weekly at ${scheduleData.time} ${scheduleData.timezone}`;
      } else if (scheduleData.frequency === "monthly") {
        if (scheduleData.selectedDayOfMonth) {
          const daySuffix =
            scheduleData.selectedDayOfMonth === 1
              ? "st"
              : scheduleData.selectedDayOfMonth === 2
              ? "nd"
              : scheduleData.selectedDayOfMonth === 3
              ? "rd"
              : "th";
          return `Monthly on the ${scheduleData.selectedDayOfMonth}${daySuffix} at ${scheduleData.time} ${scheduleData.timezone}`;
        }
        return `Monthly on the 1st at ${scheduleData.time} ${scheduleData.timezone}`;
      }
      return "";
    };

    const newSchedule: ScheduleItem = {
      id: crypto.randomUUID(),
      summary: generateSummary(),
      runCount: 0,
      lastRun: {
        status: "success",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + " " + scheduleData.time + " " + scheduleData.timezone,
      },
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      enabled: scheduleData.enabled,
      creator: CURRENT_USER,
      parameters: scheduleData.parameters,
    };

    setSchedules((prev) => [...prev, newSchedule]);
  };

  // Base cell styles applied to all table cells
  const baseCellStyles: React.CSSProperties = {
    padding: "12px",
    borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
    textAlign: "left",
    fontSize: "13px",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const columns = useMemo(
    () =>
      [
        /* ID Column */
        columnHelper.accessor("id", {
          header: "ID",
          size: 200,
          minSize: 200,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const uuid = info.getValue();
            return (
              <Tooltip title={uuid} arrow placement="top">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "default",
                  }}
                >
                  {uuid}
                </Typography>
              </Tooltip>
            );
          },
        }),
        /* Summary Column */
        columnHelper.accessor("summary", {
          header: "Summary",
          enableSorting: true,
          meta: {
            align: "left",
            flexible: true,
          },
          cell: (info) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Calendar
                size={16}
                style={{
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                {info.getValue()}
              </Typography>
            </Box>
          ),
        }),
        /* Run Count Column */
        columnHelper.accessor("runCount", {
          header: "Run",
          size: 100,
          minSize: 100,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => (
            <Typography variant="body2">
              {info.getValue()}
            </Typography>
          ),
        }),
        /* Last Run Status Column */
        columnHelper.accessor("lastRun.status", {
          header: "Last Run",
          size: 140,
          minSize: 140,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => {
            const status = info.getValue();
            const statusConfig = {
              success: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#80CBC4",
                label: "Success",
              },
              failed: {
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
                dotColor: "#EF5350",
                label: "Failed",
              },
              queue: {
                backgroundColor: "#F5F5F5",
                color: "#616161",
                dotColor: "#9E9E9E",
                label: "Queue",
              },
            };
            const config = statusConfig[status];
            return (
              <Chip
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: config.dotColor,
                        flexShrink: 0,
                        ...(status === "queue" && {
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }),
                      }}
                    />
                    <span>{config.label}</span>
                  </Box>
                }
                size="small"
                sx={{
                  height: "20px",
                  fontSize: "12px",
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  width: "fit-content",
                  ...(config.backgroundColor === "transparent" && {
                    border: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }),
                }}
              />
            );
          },
        }),
        /* Last Run Date Column */
        columnHelper.accessor("lastRun.date", {
          header: "Last Run Date",
          size: 180,
          minSize: 180,
          enableSorting: true,
          sortingFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.lastRun.date).getTime();
            const dateB = new Date(rowB.original.lastRun.date).getTime();
            return dateA - dateB;
          },
          meta: {
            align: "left",
          },
          cell: (info) => (
            <Typography variant="body2">
              {info.getValue()}
            </Typography>
          ),
        }),
        /* Created Column */
        columnHelper.accessor("created", {
          header: "Created",
          size: 150,
          minSize: 150,
          enableSorting: true,
          meta: {
            align: "left",
          },
          cell: (info) => info.getValue(),
        }),
        /* Creator Column */
        columnHelper.accessor("creator", {
          header: "Creator",
          size: 96,
          minSize: 96,
          enableSorting: true,
          meta: {
            align: "left",
          },
          sortingFn: (rowA, rowB) => {
            return rowA.original.creator.initials.localeCompare(
              rowB.original.creator.initials
            );
          },
          cell: (info) => {
            const creator = info.getValue();
            const isCurrentUser = creator.initials === CURRENT_USER.initials;
            const tooltipText = isCurrentUser
              ? `${creator.fullName} (You)`
              : creator.fullName;
            return (
              <Tooltip title={tooltipText} arrow placement="top">
                <Avatar
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: creator.color,
                  }}
                >
                  {creator.initials}
                </Avatar>
              </Tooltip>
            );
          },
        }),
        /* Parameters Column */
        columnHelper.display({
          id: "parameters",
          header: "Parameters",
          size: 100,
          minSize: 100,
          meta: {
            align: "center",
          },
          cell: (info) => {
            const schedule = info.row.original;
            const parameters = schedule.parameters || {};
            const hasParameters = Object.keys(parameters).length > 0;
            
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {hasParameters ? (
                  <Chip
                    icon={<Code size={14} />}
                    label=""
                    size="small"
                    variant="outlined"
                    onMouseEnter={(e) => {
                      setParametersPopoverAnchor(e.currentTarget);
                      setParametersPopoverScheduleId(schedule.id);
                    }}
                    onMouseLeave={() => {
                      setParametersPopoverAnchor(null);
                      setParametersPopoverScheduleId(null);
                    }}
                    sx={{
                      height: "20px",
                      width: "20px",
                      minWidth: "20px",
                      fontSize: "11px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      "& .MuiChip-label": {
                        display: "none",
                      },
                      "& .MuiChip-icon": {
                        margin: 0,
                        marginLeft: 0,
                        marginRight: 0,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.disabled,
                      fontSize: "12px",
                    }}
                  >
                    —
                  </Typography>
                )}
              </Box>
            );
          },
        }),
        /* Enabled Column */
        columnHelper.accessor("enabled", {
          header: "Enable",
          size: 100,
          minSize: 100,
          enableSorting: true,
          meta: {
            align: "center",
          },
          cell: (info) => {
            const schedule = info.row.original;
            const isCurrentUser = schedule.creator.initials === CURRENT_USER.initials;
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Switch
                  checked={schedule.enabled}
                  onChange={() => handleToggleEnabled(schedule.id)}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  disabled={!isCurrentUser}
                />
              </Box>
            );
          },
        }),
        /* Action Column */
        columnHelper.display({
          id: "actions",
          header: "Action",
          size: 80,
          minSize: 80,
          meta: {
            align: "center",
          },
          cell: (info) => {
            const schedule = info.row.original;
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, schedule.id)}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <MoreVertical size={16} />
                </IconButton>
              </Box>
            );
          },
        }),
      ] as ColumnDef<ScheduleItem>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schedules]
  );

  const table = useReactTable({
    data: effectiveSchedules,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Header Section with New Schedule Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "24px",
          py: "16px",
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {effectiveSchedules.length} schedules
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconButton
            size="medium"
            variant="outlined"
            color="inherit"
            onClick={() => setSettingsModalOpen(true)}
          >
            <Settings2 size={18} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setNewScheduleDialogOpen(true)}
            disabled={!scheduleAuthorized && emptyStateVariant !== "new-schedule"}
          >
            New schedule
          </Button>
        </Box>
      </Box>

      {/* Authorization Alert */}
      {!scheduleAuthorized &&
        !hasExpiredAuth &&
        emptyStateVariant !== "new-schedule" &&
        emptyStateVariant !== "authorize" && (
        <Box sx={{ px: "24px", pb: "16px" }}>
          <Alert
            severity="info"
            icon={<Info size={16} />}
            action={
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => setSettingsModalOpen(true)}
              >
                Authorize
              </Button>
            }
            sx={{
              "& .MuiAlert-message": {
                flex: 1,
              },
            }}
          >
            Allow this flow to run automatically on a schedule. A saved authorization is required.
          </Alert>
        </Box>
      )}

      {/* Expired Auth Warning */}
      {hasExpiredAuth && (
        <Box sx={{ px: "24px", pb: "16px" }}>
          <Alert
            severity="warning"
            icon={<AlertTriangle size={16} />}
            action={
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => setSettingsModalOpen(true)}
              >
                Re-authorize
              </Button>
            }
            sx={{
              "& .MuiAlert-message": {
                flex: 1,
              },
            }}
          >
            Authorization has expired for one or more schedules. Please re-authorize to continue running schedules automatically.
          </Alert>
        </Box>
      )}

      {/* Table Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: "24px",
          "& table tbody tr": {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgb(252, 252, 252)",
            },
          },
        }}
      >
        {showEmptyState ? (
          <ScheduleEmptyState
            title={emptyStateContent.title}
            description={emptyStateContent.description}
            ctaLabel={emptyStateContent.ctaLabel}
            onCtaClick={emptyStateContent.onCtaClick}
          />
        ) : (
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            {/* Table Header */}
            <Box
              component="thead"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
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
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        ...(header.column.columnDef.meta?.flexible
                          ? {}
                          : {
                              width: `${header.column.getSize()}px`,
                              minWidth: `${header.column.getSize()}px`,
                              maxWidth: `${header.column.getSize()}px`,
                            }),
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                        userSelect: "none",
                        padding: "12px",
                        borderTop: `1px solid ${"rgb(240, 240, 240)"}`,
                        borderBottom: `1px solid ${"rgb(240, 240, 240)"}`,
                        textAlign:
                          (header.column.columnDef.meta?.align as
                            | "left"
                            | "center"
                            | "right") || "left",
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                      onMouseEnter={() =>
                        header.column.getCanSort() &&
                        setHoveredHeaderId(header.id)
                      }
                      onMouseLeave={() => setHoveredHeaderId(null)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            (header.column.columnDef.meta?.align as
                              | "left"
                              | "center"
                              | "right") === "center"
                              ? "center"
                              : "flex-start",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: theme.palette.text.secondary,
                          gap: "8px",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() &&
                          (header.column.getIsSorted() ? (
                            <>
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )}
                            </>
                          ) : (
                            hoveredHeaderId === header.id && (
                              <ArrowUpDown
                                size={16}
                                style={{ opacity: 0.5 }}
                              />
                            )
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </Box>
            {/* Table Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          ...baseCellStyles,
                          ...(cell.column.columnDef.meta?.flexible
                            ? {}
                            : {
                                width: `${cell.column.getSize()}px`,
                                minWidth: `${cell.column.getSize()}px`,
                                maxWidth: `${cell.column.getSize()}px`,
                              }),
                          ...(cell.column.columnDef.meta?.align && {
                            textAlign: cell.column.columnDef.meta.align as
                              | "left"
                              | "center"
                              | "right",
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Box>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {(() => {
          const schedule = schedules.find((s) => s.id === menuScheduleId);
          const isCurrentUser = schedule?.creator.initials === CURRENT_USER.initials;
          return (
            <>
              <MenuItem onClick={handleMenuClose} disabled={!isCurrentUser}>
                Edit
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
              <MenuItem
                onClick={handleDeleteClick}
                disabled={!isCurrentUser}
                sx={{ color: "error.main" }}
              >
                Delete
              </MenuItem>
            </>
          );
        })()}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete schedule?"
        description={
          scheduleToDelete
            ? `This will permanently delete the schedule "${scheduleToDelete.summary}".`
            : "This will permanently delete the schedule."
        }
        confirmButtonText="Delete schedule"
      />

      {/* New Schedule Dialog */}
      <NewScheduleDialog
        open={newScheduleDialogOpen}
        onClose={() => setNewScheduleDialogOpen(false)}
        onSave={handleSaveNewSchedule}
      />

      {/* Flow Settings Modal */}
      <FlowSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="Schedule settings"
        hasExpiredAuth={hasExpiredAuth}
      />

      {/* Parameters Popover */}
      <Popover
        open={Boolean(parametersPopoverAnchor)}
        anchorEl={parametersPopoverAnchor}
        onClose={() => {
          setParametersPopoverAnchor(null);
          setParametersPopoverScheduleId(null);
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
          setParametersPopoverAnchor(null);
          setParametersPopoverScheduleId(null);
        }}
      >
        {parametersPopoverScheduleId && (() => {
          const schedule = schedules.find((s) => s.id === parametersPopoverScheduleId);
          const parameters = schedule?.parameters || {};
          return (
            <Box
              sx={{
                p: "12px",
                maxHeight: "300px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {Object.entries(parameters).map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      fontFamily: "monospace",
                    }}
                  >
                    {key}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      pl: "8px",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          );
        })()}
      </Popover>

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle2 size={20} />}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
