"use client";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ChevronLeft, Play, Info, MoreVertical } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import demoData from "../demo-data.json";
import { DeleteFlowDialog } from "../components/delete-flow-dialog";
import { EditFlowDialog } from "../components/edit-flow-dialog";
import { RunFlowDialog } from "../components/run-flow-dialog";
import { LoadingTransition } from "../components/loading-transition";
import { useFlowEditStore } from "../store";
import Link from "next/link";

type TabId = "flow" | "runs" | "schedule" | "access";

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: "flow", label: "Flow", path: "" },
  { id: "runs", label: "Runs", path: "/runs" },
  { id: "schedule", label: "Schedule", path: "/schedule" },
  { id: "access", label: "Access", path: "/access" },
];

interface AgentFlow {
  id: string;
  name: string;
  description: string;
  steps: number;
  scheduled: {
    total: number;
    active: number;
  };
  lastRun: {
    status: "success" | "failed" | "queue" | "running";
    text: string;
  };
  lastModified: string;
  creator: {
    initials: string;
    color: string;
  };
}

export default function FlowDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  // Prototype loading state - simulate 2 second loading delay
  const [isLoading, setIsLoading] = useState(true);

  // Run flow toast state
  const [runToast, setRunToast] = useState<{
    open: boolean;
    message: string;
    severity: "info" | "error" | "success";
  }>({ open: false, message: "", severity: "info" });
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishToastOpen, setPublishToastOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Store hooks
  const {
    currentFlow,
    draftFlow,
    ui,
    setCurrentFlow,
    setEditDialogOpen,
    setDeleteDialogOpen,
    setRunDialogOpen,
    setMenuAnchorEl,
    setActiveTab,
    setHealthCheckLoading,
    setHealthCheckResult,
  } = useFlowEditStore();

  // Find existing flow or create a new one
  const existingFlow = (demoData as AgentFlow[]).find(
    (f) => f.id === resolvedParams.id
  );

  const isNewFlow = !existingFlow;

  // Initialize store with flow data when params change
  useEffect(() => {
    if (existingFlow) {
      setCurrentFlow({
        id: existingFlow.id,
        name: existingFlow.name,
        description: existingFlow.description,
        steps: [], // Initialize with empty steps array, can be loaded separately
      });
    } else {
      // New flow
      setCurrentFlow({
        id: resolvedParams.id,
        name: "Untitled sequence",
        description: "",
        steps: [],
      });
    }
  }, [resolvedParams.id, existingFlow, setCurrentFlow]);

  // Update active tab when pathname changes
  useEffect(() => {
    if (pathname?.endsWith("/runs")) {
      setActiveTab("runs");
    } else if (pathname?.endsWith("/schedule")) {
      setActiveTab("schedule");
    } else if (pathname?.endsWith("/access")) {
      setActiveTab("access");
    } else {
      setActiveTab("flow");
    }
  }, [pathname, setActiveTab]);

  // Get flow name from store (only show current, not draft - draft only applies after save)
  const flowName = currentFlow?.name ?? "Untitled sequence";

  // Format tooltip content
  const formatTooltipContent = () => {
    if (!existingFlow) return "";

    // Format date: convert "Dec 15, 2025" to "December 15, 2025 at 23:00"
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // If parsing fails, try to parse the format "Dec 15, 2025"
        const months: { [key: string]: string } = {
          Jan: "January",
          Feb: "February",
          Mar: "March",
          Apr: "April",
          May: "May",
          Jun: "June",
          Jul: "July",
          Aug: "August",
          Sep: "September",
          Oct: "October",
          Nov: "November",
          Dec: "December",
        };
        const parts = dateStr.split(" ");
        const monthAbbr = parts[0];
        const dayStr = parts[1];
        const yearStr = parts[2];
        if (parts.length >= 3 && monthAbbr && dayStr && yearStr) {
          const month = months[monthAbbr] || monthAbbr;
          const day = dayStr.replace(",", "");
          const year = yearStr;
          return `${month} ${day}, ${year} at 23:00`;
        }
        return dateStr;
      }
      const month = date.toLocaleString("en-US", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${month} ${day}, ${year} at ${hours}:${minutes}`;
    };

    // Get creator name - using initials for now since demo data only has initials
    // In a real app, this would come from user data
    const creatorName = existingFlow.creator.initials || "Unknown";

    return (
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Box component="span">
          Last updated: {formatDate(existingFlow.lastModified)}
        </Box>
        <Box component="span">Created by: {creatorName}</Box>
      </Box>
    );
  };

  const activeTab = ui.activeTab;
  const basePath = `/app/studio/flows/${resolvedParams.id}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log("Duplicate flow:", resolvedParams.id);
    handleMenuClose();
  };

  const handleUnpublish = () => {
    setIsPublished(false);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete API call
    console.log("Deleting flow:", resolvedParams.id);
    setDeleteDialogOpen(false);
    // Redirect with query param to show toast on listing page
    router.push(
      `/app/studio/flows?deleted=true&flowName=${encodeURIComponent(flowName)}`
    );
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  // Get start node inputs
  const startNodeInputs =
    draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];

  const handleRunClick = () => {
    // Show preparing toast
    setRunToast({
      open: true,
      message: "Preparing flow to run...",
      severity: "info",
    });

    // Perform health check before running
    const steps = draftFlow?.steps || currentFlow?.steps || [];
    const currentStartNodeInputs =
      draftFlow?.startNodeInputs || currentFlow?.startNodeInputs || [];

    // Simulate health check delay
    setTimeout(() => {
      // Build health check result
      const errorsByNode: Record<string, string[]> = {};
      const issuesByNode: Record<string, string[]> = {};

      // Check if there are no steps (flow-level error)
      if (steps.length === 0) {
        errorsByNode["flow"] = [
          "Flow contains only the start node. Add at least one step to create a valid flow.",
        ];
      }

      // Check if start node runtime inputs are filled (error)
      // Note: Parameter values would need to be passed from FlowEditingCanvas
      // For now, this check is handled in the performHealthCheck function
      // when parameterValues are available

      const hasErrors = Object.keys(errorsByNode).length > 0;
      const hasIssues = Object.keys(issuesByNode).length > 0;

      if (hasErrors || hasIssues) {
        // Set health check result to show in the section
        const checkResult = {
          checkedAt: new Date(),
          hasError: hasErrors,
          hasIssues: hasIssues,
          errorsByNode,
          issuesByNode,
          snapshot: {
            steps: steps.map((step) => ({
              id: step.id,
              label: step.label,
            })),
            startNodeInputs: currentStartNodeInputs.map((input) => ({
              name: input.name,
              type: input.type,
            })),
          },
        };
        setHealthCheckResult(checkResult);

        // Show error toast and stop
        setRunToast({
          open: true,
          message: "There is an issue, please verify the flow",
          severity: "error",
        });
        return;
      }

      // Close the preparing toast
      setRunToast((prev) => ({ ...prev, open: false }));

      // If there are start node inputs defined, show the dialog
      if (startNodeInputs.length > 0) {
        setRunDialogOpen(true);
      } else {
        // No inputs needed, run directly
        handleRunFlow({});
      }
    }, 1500);
  };

  const handleRunDialogClose = () => {
    setRunDialogOpen(false);
  };

  const handleRunFlow = (inputValues: Record<string, string>) => {
    // TODO: Implement actual run API call
    console.log("Running flow with inputs:", inputValues);
    setRunDialogOpen(false);
  };

  const handleEditSave = (name: string, description: string) => {
    // TODO: Implement actual save API call
    console.log("Saving flow:", {
      name,
      description,
    });
    setEditDialogOpen(false);
    // Store state is already updated via commitDraftToCurrent in the dialog
  };

  const handleOpenPublishDialog = () => {
    setIsPublishDialogOpen(true);
  };

  const handleClosePublishDialog = () => {
    setIsPublishDialogOpen(false);
  };

  const handleConfirmPublish = () => {
    // TODO: Wire to publish API
    setIsPublished(true);
    setPublishToastOpen(true);
    setIsPublishDialogOpen(false);
  };

  // Show loading spinner during prototype delay
  if (isLoading) {
    return <LoadingTransition />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.neutral[50],
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "16px",
          pb: "8px",
          pl: "12px",
          pr: "24px",
          backgroundColor: "white",
        }}
      >
        {/* Left side - Back button and title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 0,
            flex: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => router.push("/app/studio/flows")}
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Box
            onClick={handleEditDialogOpen}
            sx={{
              px: "4px",
              py: "4px",
              borderRadius: "6px",
              cursor: "pointer",
              minWidth: 0,
              maxWidth: "60ch",
              "&:hover": {
                backgroundColor:
                  theme.palette.neutral[50],
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {flowName}
            </Typography>
          </Box>
        </Box>

        {/* Right side - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Saving Indicator */}
          {ui.savingState !== "idle" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                mr: "4px",
              }}
            >
              {ui.savingState === "saving" && (
                <>
                  <CircularProgress
                    size={20}
                    enableTrackSlot
                    sx={{ color: theme.palette.text.secondary }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Saving...
                  </Typography>
                </>
              )}
              {ui.savingState === "saved" && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Saved
                </Typography>
              )}
            </Box>
          )}
          {isPublished ? (
            <Chip
              label="Published"
              size="small"
              sx={{
                backgroundColor: theme.palette.teal[200],
                color: theme.palette.teal[700],
              }}
            />
          ) : (
            <Chip label="Draft" size="small" />
          )}
          {!isPublished && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleOpenPublishDialog}
              sx={{
                height: "28px",
                minWidth: "auto",
              }}
            >
              Publish
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleRunClick}
            startIcon={<Play size={16} />}
            sx={{
              height: "28px",
              minWidth: "auto",
            }}
          >
            Run
          </Button>
          <Tooltip
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Box component="span">
                  Last updated: December 15, 2025 at 23:00
                </Box>
                <Box component="span">Created by: Ines</Box>
              </Box>
            }
            arrow
            placement="bottom"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                color: theme.palette.text.secondary,
                cursor: "pointer",
              }}
            >
              <Info size={16} />
            </Box>
          </Tooltip>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              width: "28px",
              height: "28px",
            }}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Sub Navigation Tabs */}
      <Box
        sx={{
          backgroundColor: "white",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: theme.palette.neutral[300],
            zIndex: 1,
          },
        }}
      >
        <Tabs
          value={activeTab}
          aria-label="flow navigation tabs"
          sx={{
            position: "relative",
            "& .MuiTabs-indicator": {
              zIndex: 2,
            },
          }}
        >
          {TABS.map((tab) => {
            const href = `${basePath}${tab.path}`;
            return (
              <Tab
                key={tab.id}
                label={tab.label}
                value={tab.id}
                component={Link}
                href={href}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Content area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {children}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={ui.menuAnchorEl}
        open={Boolean(ui.menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {isPublished && <MenuItem onClick={handleUnpublish}>Unpublish</MenuItem>}
        <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteFlowDialog
        open={ui.deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        flowName={existingFlow?.name}
      />

      {/* Edit Title and Description Dialog */}
      <EditFlowDialog
        open={ui.editDialogOpen}
        onClose={handleEditDialogClose}
        onSave={handleEditSave}
      />

      {/* Run Flow Dialog */}
      <RunFlowDialog
        open={ui.runDialogOpen}
        onClose={handleRunDialogClose}
        onRun={handleRunFlow}
      />

      <Dialog open={isPublishDialogOpen} onClose={handleClosePublishDialog}>
        <DialogTitle>Publish flow?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            This will publish &quot;{flowName}&quot; and make it available to all
            users in your organization.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClosePublishDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmPublish}>
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Run Flow Toast */}
      <Snackbar
        open={runToast.open}
        autoHideDuration={runToast.severity === "error" ? 3000 : null}
        onClose={() => setRunToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setRunToast((prev) => ({ ...prev, open: false }))}
          severity={runToast.severity}
          variant="filled"
          sx={{
            ...(runToast.severity === "info" && {
              backgroundColor: theme.palette.neutral[800],
              color: theme.palette.neutral[50],
              "& .MuiAlert-icon": {
                color: theme.palette.neutral[50],
              },
              "& .MuiAlert-message": {
                color: theme.palette.neutral[50],
              },
              "& .MuiAlert-action": {
                color: theme.palette.neutral[50],
              },
            }),
          }}
        >
          {runToast.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={publishToastOpen}
        autoHideDuration={3000}
        onClose={() => setPublishToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setPublishToastOpen(false)}
          severity="success"
          variant="filled"
        >
          Flow published successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
