"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Variable, Copy } from "lucide-react";
import { TypeBadge } from "./type-badge";

interface OutputParameterItemProps {
  name: string;
  type: string;
  description: string;
  nodeId?: string;
}

export function OutputParameterItem({
  name,
  type,
  description,
  nodeId,
}: OutputParameterItemProps) {
  const theme = useTheme();
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [copyToast, setCopyToast] = useState<{
    open: boolean;
    message: string;
    reference?: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const reference = nodeId ? `{{${nodeId}.${name}}}` : `{{${name}}}`;
    navigator.clipboard.writeText(reference);
    setCopyToast({
      open: true,
      message: "copied",
      reference: reference,
      severity: "success",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "fit-content",
        borderRadius: "6px",
        position: "relative",
      }}
    >
      {/* Parameter Name + Type */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Variable Icon (Copy on hover) */}
        <Tooltip
          title="Copy reference"
          arrow
          placement="top"
          disableInteractive
        >
          <IconButton
            size="small"
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
            onClick={handleCopy}
            sx={{
              width: "24px",
              height: "24px",
              p: 0,
            }}
          >
            {isIconHovered ? (
              <Copy size={16} />
            ) : (
              <Variable size={16} color={theme.palette.text.secondary} />
            )}
          </IconButton>
        </Tooltip>
        {/* Parameter Name - Monospace */}
        {description ? (
          <Tooltip
            title={description}
            placement="top"
            disableInteractive
            enterDelay={300}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.primary,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  height: "1px",
                  backgroundImage: `repeating-linear-gradient(to right, ${theme.palette.text.disabled} 0, ${theme.palette.text.disabled} 1px, transparent 1px, transparent 3px, ${theme.palette.text.disabled} 3px, ${theme.palette.text.disabled} 4px)`,
                  backgroundPosition: "center center",
                  backgroundSize: "4px 1px",
                },
              }}
            >
              {name}
            </Typography>
          </Tooltip>
        ) : (
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.primary }}
          >
            {name}
          </Typography>
        )}
        {/* Type Badge */}
        <TypeBadge type={type} />
      </Box>

      {/* Copy Toast */}
      <Snackbar
        open={copyToast.open}
        autoHideDuration={2000}
        onClose={() => setCopyToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopyToast((prev) => ({ ...prev, open: false }))}
          severity={copyToast.severity}
          variant="filled"
        >
          {copyToast.reference ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Box
                component="span"
                sx={{
                  color: theme.palette.green[300],
                  fontWeight: 500,
                }}
              >
                {copyToast.reference}
              </Box>
              <span>{copyToast.message}</span>
            </Box>
          ) : (
            copyToast.message
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
