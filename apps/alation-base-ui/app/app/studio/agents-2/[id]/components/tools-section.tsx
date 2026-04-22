"use client";

import { Box, Typography, Popover, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import type { Agent } from "../../../agents/agent-data";
import { ItemTypeIcon } from "../../../flows/components/item-type-icon";
import { Trash2, Plus } from "lucide-react";
import { useEditMode } from "../edit-mode-context";
import { AddStepModal } from "../../../flows/components/add-step-modal";
import { DeleteConfirmationDialog } from "../../../flows/components/delete-flow-dialog";

interface ToolsSectionProps {
  agent: Agent;
}

export function ToolsSection({ agent }: ToolsSectionProps) {
  const theme = useTheme();
  const { isEditMode } = useEditMode();
  const hasTools = agent.tools && agent.tools.length > 0;
  const [addToolOpen, setAddToolOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverTool, setPopoverTool] = useState<ToolCardProps["tool"] | null>(
    null,
  );
  const [toolPendingDelete, setToolPendingDelete] = useState<
    ToolCardProps["tool"] | null
  >(null);

  if (!hasTools) {
    return (
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        No tools configured.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Edit Mode Actions */}
      {isEditMode && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => setAddToolOpen(true)}
            startIcon={<Plus size={14} />}
          >
            Add tool
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {agent.tools!.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isEditMode={isEditMode}
            onHover={(event) => {
              setPopoverAnchor(event.currentTarget);
              setPopoverTool(tool);
            }}
            onHoverEnd={() => {
              setPopoverAnchor(null);
              setPopoverTool(null);
            }}
            onDeleteClick={(toolToDelete) => {
              setToolPendingDelete(toolToDelete);
            }}
          />
        ))}
      </Box>

      {/* Tool Details Popover */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => {
          setPopoverAnchor(null);
          setPopoverTool(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        sx={{
          pointerEvents: "none",
          "& .MuiPopover-paper": {
            pointerEvents: "auto",
            marginTop: "8px",
            maxWidth: 320,
          },
        }}
        onMouseLeave={() => {
          setPopoverAnchor(null);
          setPopoverTool(null);
        }}
      >
        {popoverTool && (
          <Box sx={{ p: "12px" }}>
            <Typography variant="subtitle2" sx={{ color: "inherit" }}>
              {popoverTool.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "inherit", opacity: 0.72 }}
            >
              Mock description: This tool supports agent workflows by executing
              tasks and returning structured results.
            </Typography>
          </Box>
        )}
      </Popover>

      {/* Add Tool Modal */}
      <AddStepModal
        open={addToolOpen}
        onClose={() => setAddToolOpen(false)}
        onSelect={() => setAddToolOpen(false)}
        hideTabs={isEditMode}
      />

      <DeleteConfirmationDialog
        open={Boolean(toolPendingDelete)}
        onClose={() => setToolPendingDelete(null)}
        onConfirm={() => setToolPendingDelete(null)}
        title="Remove tool?"
        description={
          <>
            Removing <strong>{toolPendingDelete?.name}</strong> will also remove
            all previously defined parameters for this tool.
          </>
        }
        confirmButtonText="Remove tool"
        showWarning={false}
      />
    </Box>
  );
}

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    type: "Tool" | "Agent";
  };
  isEditMode?: boolean;
  onHover?: (event: React.MouseEvent<HTMLElement>) => void;
  onHoverEnd?: () => void;
  onDeleteClick?: (tool: ToolCardProps["tool"]) => void;
}

function ToolCard({
  tool,
  isEditMode,
  onHover,
  onHoverEnd,
  onDeleteClick,
}: ToolCardProps) {
  const theme = useTheme();

  const showDelete = isEditMode;

  return (
    <Box
      onMouseEnter={(event) => {
        onHover?.(event);
      }}
      onMouseLeave={() => {
        onHoverEnd?.();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        p: "8px",
        flex: "0 0 auto",
        width: "fit-content",
        backgroundColor: theme.palette.neutral[100],
        borderRadius: "8px",
        cursor: "pointer",
        //border: `1px solid ${theme.palette.neutral[300]}`,
        transition: `all ${"150ms"}`,
      }}
    >
      {/* Tool/Agent Icon */}
      <ItemTypeIcon type={tool.type} size="small" />

      {/* Tool Name */}
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.primary,
        }}
      >
        {tool.name}
      </Typography>

      {/* Tool Action */}
      <Box sx={{ marginLeft: "auto" }}>
        {showDelete && (
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteClick?.(tool);
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
