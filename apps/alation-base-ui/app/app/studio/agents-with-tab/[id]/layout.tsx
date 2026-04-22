"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { ChevronLeft, ExternalLink, Info, MoreVertical } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { use, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { getAgentById } from "../agent-data";
import { ItemTypeIcon } from "../../flows/components/item-type-icon";
import { AddAgentModal } from "../components/add-agent-modal";
import { DeleteConfirmationDialog } from "../../flows/components/delete-flow-dialog";
import { useState } from "react";

type TabId = "details" | "agent-access";

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: "details", label: "Agent details", path: "" },
  { id: "agent-access", label: "Agent access", path: "/agent-access" },
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Update active tab from pathname
  const activeTab: TabId = pathname?.endsWith("/agent-access")
    ? "agent-access"
    : "details";

  const basePath = `/app/studio/agents-with-tab/${resolvedParams.id}`;

  useEffect(() => {
    if (!agent) {
      router.push("/app/studio/agents-with-tab");
    }
  }, [agent, router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setIsEditModalOpen(true);
  };

  const handleRemove = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    setDeleteDialogOpen(false);
    router.push("/app/studio/agents-with-tab");
  };

  const handleCancelRemove = () => {
    setDeleteDialogOpen(false);
  };

  const handleSaveEdit = () => {
    setIsEditModalOpen(false);
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
            onClick={() => router.push("/app/studio/agents-with-tab")}
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
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {agent.name}
            </Typography>
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

          {/* Edit Agent - Primary Button */}
          <Button
            variant="contained"
            size="small"
            onClick={handleEdit}
            sx={{
              height: "36px",
              minWidth: "auto",
            }}
          >
            Edit agent
          </Button>

          {/* Agent Access - Outlined Button */}
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            component={Link}
            href={`${basePath}/agent-access`}
            sx={{
              height: "36px",
              minWidth: "auto",
            }}
          >
            Agent access
          </Button>

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

      {/* Sub Navigation Tabs - same design as flow detail page */}
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
        {children}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
          Remove
        </MenuItem>
      </Menu>

      {/* Edit Agent Modal */}
      <AddAgentModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        agentToEdit={agent}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove agent?"
        description={`Are you sure you want to remove "${agent.name}"? This action cannot be undone.`}
        confirmButtonText="Remove"
        requireConfirmationText={agent.name}
      />
    </Box>
  );
}
