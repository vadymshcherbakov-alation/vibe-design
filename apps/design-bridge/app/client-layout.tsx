"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { fabricThemeMorpheus } from "@alation/fabric-theme-morpheus";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={fabricThemeMorpheus}>
      <CssBaseline />
      <Box sx={{ overflow: "auto", minHeight: "100vh" }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
