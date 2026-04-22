"use client";
import { Box, Typography, Button, IconButton, Chip, Menu, MenuItem, Link } from "@mui/material";
import { ChevronRight, Download, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Run, getStatusConfig, pulse } from "./types";

interface RunDetailHeaderProps {
  run: Run;
  onRenameClick: () => void;
}

export function RunDetailHeader({ run, onRenameClick }: RunDetailHeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const statusConfig = getStatusConfig(run.status, theme);

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download report for:", run.evalId);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRunAgain = () => {
    // TODO: Implement run again functionality
    console.log("Run again for:", run.evalId);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pt: "12px",
          pb: "8px",
          pl: "24px",
          pr: "24px",
        }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push("/app/marketplace")}
          sx={{
            color: theme.palette.text.secondary,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.text.primary,
            },
          }}
        >
          Data Marketplace
        </Link>
        <ChevronRight size={16} style={{ color: theme.palette.text.secondary }} />
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push("/app/marketplace/evaluations")}
          sx={{
            color: theme.palette.text.secondary,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.text.primary,
            },
          }}
        >
          Evaluations
        </Link>
        <ChevronRight size={16} style={{ color: theme.palette.text.secondary }} />
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {run.evalName}
        </Typography>
      </Box>

      {/* Header Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "8px",
          pb: "8px",
          pl: "24px",
          pr: "24px",
        }}
      >
        {/* Left side - Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography
            variant="h1"
            onClick={onRenameClick}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              px: "4px",
              py: "4px",
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: theme.palette.neutral[50],
              },
            }}
          >
            {run.evalName}
          </Typography>
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
                      backgroundColor: statusConfig.dotColor,
                      flexShrink: 0,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  />
                )}
                <span>{statusConfig.label}</span>
              </Box>
            }
            size="small"
            sx={{
              height: "20px",
              fontSize: "12px",
              backgroundColor: statusConfig.backgroundColor,
              color: statusConfig.color,
              width: "fit-content",
              border: "none",
              "&:hover": {
                backgroundColor: statusConfig.backgroundColor,
              },
            }}
          />
        </Box>

        {/* Right side - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleDownload}
            startIcon={<Download size={16} />}
            sx={{
              height: "28px",
              minWidth: "auto",
              textTransform: "none",
            }}
          >
            Download report
          </Button>
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
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleRunAgain}>Run again</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
