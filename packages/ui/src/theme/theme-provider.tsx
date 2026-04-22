"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { useEffect } from "react";
import { baseTheme } from "./baseTheme";
import { injectCSSVariables } from "./baseTheme";

type ThemeProviderProps = {
  children: React.ReactNode;
  themeOverrides?: ThemeOptions;
  injectCSSVars?: boolean;
  cssBaseline?: boolean;
};

export function ThemeProvider({
  children,
  themeOverrides,
  injectCSSVars = false,
  cssBaseline = true,
}: ThemeProviderProps) {
  const theme = themeOverrides
    ? createTheme(baseTheme, themeOverrides)
    : baseTheme;

  useEffect(() => {
    if (injectCSSVars) {
      injectCSSVariables();
    }
  }, [injectCSSVars]);

  return (
    <MuiThemeProvider theme={theme}>
      {cssBaseline && <CssBaseline />}
      {children}
    </MuiThemeProvider>
  );
}
