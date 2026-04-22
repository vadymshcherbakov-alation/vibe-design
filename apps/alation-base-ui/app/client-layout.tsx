"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { fabricThemeMorpheus } from "@alation/fabric-theme-morpheus";
import { AlationLayout } from "./components/layout/alation-layout";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={fabricThemeMorpheus}>
      <CssBaseline />
      <AlationLayout>{children}</AlationLayout>
    </ThemeProvider>
  );
}