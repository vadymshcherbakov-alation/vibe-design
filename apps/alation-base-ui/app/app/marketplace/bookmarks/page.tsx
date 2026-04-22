"use client";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        gap: "12px",
      }}
    >
      <Bookmark size={32} color={theme.palette.text.disabled} strokeWidth={1.5} />
      <Typography sx={{ fontSize: "15px", color: theme.palette.text.disabled }}>
        Marketplace bookmarks here
      </Typography>
    </Box>
  );
}
