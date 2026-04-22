"use client";
import { Box, Typography } from "@mui/material";

export default function HomepageCustomizationPage() {
  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 4 }}>
        <Typography
          variant="h1"
        >
          Homepage Customization
        </Typography>
      </Box>
    </Box>
  );
}
