"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEditMode } from "../edit-mode-context";

export function OutputSection() {
  const theme = useTheme();
  const { isEditMode } = useEditMode();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {isEditMode && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" color="inherit">
            Add paramater
          </Button>
        </Box>
      )}
      <Typography
        variant="body1"
        sx={{ color: theme.palette.text.secondary }}
      >
        No output defined.
      </Typography>
    </Box>
  );
}
