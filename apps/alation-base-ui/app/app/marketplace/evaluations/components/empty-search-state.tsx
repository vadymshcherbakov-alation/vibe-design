"use client";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HelpCircle, Play } from "lucide-react";

interface EmptySearchStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  type: "questions" | "runs";
}

export function EmptySearchState({
  searchTerm,
  onClearSearch,
  type,
}: EmptySearchStateProps) {
  const theme = useTheme();
  const Icon = type === "questions" ? HelpCircle : Play;
  const itemName = type === "questions" ? "questions" : "runs";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: "64px",
        px: "24px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "400px",
        }}
      >
        <Icon
          size={32}
          style={{
            color: theme.palette.text.secondary,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {`No ${itemName} matching "${searchTerm}"`}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Try a different search term.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onClearSearch}
          sx={{
            mt: "8px",
            textTransform: "none",
            borderColor: theme.palette.neutral[300],
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.neutral[400],
              backgroundColor: theme.palette.neutral[100],
            },
          }}
        >
          Clear search
        </Button>
      </Box>
    </Box>
  );
}
