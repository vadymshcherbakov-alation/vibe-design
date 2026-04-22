"use client";

import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChevronLeft, ExternalLink, Info, MoreVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { getAgentById } from "../../agents/agent-data";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";
import { DeleteConfirmationDialog } from "../../flows/components/delete-flow-dialog";
import { useState } from "react";
import { EditModeContext } from "./edit-mode-context";

type TabId = "details" | "agent-access" | "logs";

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: "details", label: "Agent details", path: "" },
  { id: "agent-access", label: "Agent access", path: "/agent-access" },
  { id: "logs", label: "Logs", path: "/logs" },
];

export default function AgentDetailLayout({
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
  const agent = getAgentById(resolvedParams.id);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishToastOpen, setPublishToastOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");

  const activeTab: TabId = pathname?.endsWith("/agent-access")
    ? "agent-access"
    : pathname?.endsWith("/logs")
      ? "logs"
      : "details";
  const basePath = `/app/studio/agents-2/${resolvedParams.id}`;

  useEffect(() => {
    if (!agent) {
      router.push("/app/studio/agents");
      return;
    }
    setDisplayName(agent.name);
    setRenameDraft(agent.name);
  }, [agent, router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRemove = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    setDeleteDialogOpen(false);
    router.push("/app/studio/agents");
  };

  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
  };

  const handleOpenRenameDialog = () => {
    setRenameDraft(displayName);
    setIsRenameDialogOpen(true);
  };

  const handleCloseRenameDialog = () => {
    setIsRenameDialogOpen(false);
    setRenameDraft(displayName);
  };

  const handleSaveRename = () => {
    const trimmedName = renameDraft.trim();
    if (!trimmedName) {
      return;
    }
    setDisplayName(trimmedName);
    setIsRenameDialogOpen(false);
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

  const handleUnpublish = () => {
    setIsPublished(false);
    handleMenuClose();
  };

  if (!agent) {
    return null;
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
      {/* Header Section - same design as flow detail page */}
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
            onClick={() => router.push("/app/studio/agents")}
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minWidth: 0,
              maxWidth: "60ch",
            }}
          >
            <ItemTypeIcon type="Agent" size={24} />
            <Typography
              variant="subtitle1"
              onClick={handleOpenRenameDialog}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {displayName}
            </Typography>
            <Chip label="SQL-Enabled" size="small" />
          </Box>
        </Box>

        {/* Right side - Action buttons and menu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Info Icon Button */}
          <IconButton
            size="small"
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
            }}
          >
            <Info size={16} />
          </IconButton>

          {/* Edit Mode Buttons */}
          {isEditMode && (
            <>
              {/* Save Changes Button */}
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  // TODO: Save changes
                  setIsEditMode(false);
                }}
                sx={{
                  height: "36px",
                  minWidth: "auto",
                }}
              >
                Save changes
              </Button>
              {/* Cancel Button */}
              <Button
                variant="text"
                size="small"
                color="inherit"
                onClick={() => setIsEditMode(false)}
                sx={{
                  height: "36px",
                  minWidth: "auto",
                }}
              >
                Cancel
              </Button>
            </>
          )}

          {/* Draft status badge */}
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

          {/* Publish - Primary Button */}
          {!isPublished && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleOpenPublishDialog}
              sx={{
                height: "36px",
                minWidth: "auto",
              }}
            >
              Publish
            </Button>
          )}

          {/* Evaluate - Outlined Button with Icon */}
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            endIcon={<ExternalLink size={16} />}
            sx={{
              height: "36px",
              minWidth: "auto",
            }}
          >
            Evaluate
          </Button>

          {/* More Options Menu */}
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              width: "28px",
              height: "28px",
              flexShrink: 0,
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
          aria-label="agent navigation tabs"
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
        <EditModeContext.Provider value={{ isEditMode, setIsEditMode }}>
          {children}
        </EditModeContext.Provider>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {isPublished && <MenuItem onClick={handleUnpublish}>Unpublish</MenuItem>}
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Delete agent?"
        description={`Are you sure you want to delete "${displayName}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        requireConfirmationText={displayName}
      />

      <Dialog
        open={isRenameDialogOpen}
        onClose={handleCloseRenameDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename agent</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Agent name"
            value={renameDraft}
            onChange={(event) => setRenameDraft(event.target.value)}
            sx={{ mt: "8px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseRenameDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveRename}
            disabled={!renameDraft.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isPublishDialogOpen} onClose={handleClosePublishDialog}>
        <DialogTitle>Publish agent?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            This will publish &quot;{displayName}&quot; and make it available to
            all users in your organization.
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
          Agent published successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
