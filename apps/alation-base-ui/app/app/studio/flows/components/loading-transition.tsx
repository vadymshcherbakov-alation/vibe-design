"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface LoadingTransitionProps {
  message?: string;
}

export function LoadingTransition({
  message = "Loading flow...",
}: LoadingTransitionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.neutral[50],
        gap: "12px",
      }}
    >
      {/* Loading Spinner */}
      <CircularProgress
        size={20}
        enableTrackSlot
        sx={{ color: theme.palette.text.secondary }}
      />
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        {message}
      </Typography>
    </Box>
  );
}
