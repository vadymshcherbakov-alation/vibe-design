"use client";

import { Box, Typography, IconButton, Collapse, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronUp, SquarePen, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface CollapsibleSectionProps {
  sectionId?: string;
  title: string;
  defaultExpanded?: boolean;
  badgeCount?: number;
  /** When true, expands the section (e.g. when entering edit mode to open all at once). */
  forceExpandedWhen?: boolean;
  /** Optional handler for section-level edit action. */
  onEditClick?: () => void;
  /** Optional handler for moving to next section while editing. */
  onNextSectionClick?: () => void;
  /** Optional handler for moving to previous section while editing. */
  onPreviousSectionClick?: () => void;
  /** When true, prevents collapse/expand toggling via header and chevron. */
  disableCollapse?: boolean;
  /** When true, applies edit-mode visual treatment to section container. */
  isEditing?: boolean;
  /** When false, hides the section-level edit/exit action button. */
  showEditButton?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  sectionId,
  title,
  defaultExpanded = true,
  badgeCount,
  forceExpandedWhen,
  onEditClick,
  onNextSectionClick,
  onPreviousSectionClick,
  disableCollapse = false,
  isEditing = false,
  showEditButton = true,
  children,
}: CollapsibleSectionProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // When forceExpandedWhen becomes true (e.g. edit mode), expand this section
  useEffect(() => {
    if (forceExpandedWhen) {
      setExpanded(true);
    }
  }, [forceExpandedWhen]);

  return (
    <Box
      id={sectionId}
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${
          isEditing
            ? theme.palette.neutral[600]
            : theme.palette.neutral[300]
        }`,
        borderRadius: "8px",
        boxShadow: isEditing
          ? "rgba(20, 20, 20, 0.15) 0px 4px 8px 0px"
          : "none",
        "&:hover": {
          //borderC: `1px solid ${theme.palette.neutral[300]}`,
          borderColor: isEditing
            ? theme.palette.neutral[600]
            : theme.palette.neutral[400],
          boxShadow: "rgba(20, 20, 20, 0.15) 0px 4px 8px 0px",
        },
        "&:hover .section-edit-button": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      {/* Section Header */}
      <Box
        onClick={() => {
          if (!disableCollapse) {
            setExpanded(!expanded);
          }
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "16px",
          py: "12px",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          {badgeCount !== undefined && (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "2px",
                backgroundColor:
                  theme.palette.neutral[100],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {badgeCount}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {showEditButton && !isEditing && (
            <Button
              className="section-edit-button"
              variant="outlined"
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                onEditClick?.();
              }}
              startIcon={<SquarePen size={14} />}
              sx={{
                minWidth: "auto",
                opacity: 0,
                pointerEvents: "none",
                transition: `opacity ${"150ms"}`,
              }}
            >
              Edit
            </Button>
          )}
          {isEditing ? (
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onEditClick?.();
              }}
              sx={{
                width: "28px",
                height: "28px",
              }}
            >
              <X size={16} />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              disabled={disableCollapse}
              sx={{
                width: "28px",
                height: "28px",
                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                transition: `transform ${"150ms"}`,
              }}
            >
              <ChevronUp size={16} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Section Content */}
      <Collapse in={expanded}>
        <Box
          sx={{
            pt: "8px",
          }}
        >
          <Box sx={{ px: "16px", pb: "20px" }}>{children}</Box>
          {isEditing && (
            <Box
              sx={{
                px: "16px",
                mt: "16px",
                pt: "16px",
                pb: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: `1px solid ${theme.palette.neutral[300]}`,

                borderRadius: "0 0 6px 6px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: theme.palette.text.secondary,
                }}
              >
                <Check size={14} />
                <Typography variant="body2">changes saved</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditClick?.();
                  }}
                >
                  Close
                </Button>
                {onPreviousSectionClick && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ChevronLeft size={16} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      onPreviousSectionClick();
                    }}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<ChevronRight size={16} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNextSectionClick?.();
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
