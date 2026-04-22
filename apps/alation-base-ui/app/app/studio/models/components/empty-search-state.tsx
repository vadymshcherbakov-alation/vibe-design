"use client";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NavModelsIcon from "../../assets/nav-models.svg";

interface EmptySearchStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function EmptySearchState({
  searchTerm,
  onClearSearch,
}: EmptySearchStateProps) {
  const theme = useTheme();

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
        <NavModelsIcon
          width={32}
          height={32}
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
            {`No models matching "${searchTerm}"`}
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
