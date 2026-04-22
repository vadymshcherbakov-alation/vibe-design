"use client";
import { Box, Typography } from "@mui/material";

export default function CustomFieldPermissionsPage() {

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: `${"24px"}px` }}>
        <Typography
          variant="h1"
        >
          Custom Field Permissions
        </Typography>
      </Box>
    </Box>
  );
}
