import { createTheme } from "@mui/material/styles";
import { designTokens } from "../tokens";

declare module "@mui/material/styles" {
  interface Theme {
    tokens: typeof designTokens;
  }
  interface ThemeOptions {
    tokens?: typeof designTokens;
  }
}

export const baseTheme = createTheme({
  spacing: (factor: number) => {
    // Map MUI spacing factors to design system spacing tokens
    const spacingMap: Record<number, number> = {
      0: 0,
      0.25: designTokens.spacing.xxs, // 2px
      0.5: designTokens.spacing.xs,   // 4px
      1: designTokens.spacing.sm,     // 8px
      1.5: 12,                        // 12px (interpolated)
      2: designTokens.spacing.md,     // 16px
      2.5: 20,                        // 20px (interpolated)
      3: designTokens.spacing.lg,     // 24px
      4: designTokens.spacing.xl,     // 32px
      5: 40,                          // 40px (interpolated)
      6: designTokens.spacing["2xl"], // 48px
      8: designTokens.spacing["3xl"], // 64px
    };

    // Return mapped value if it exists, otherwise calculate based on 8px base
    return spacingMap[factor] !== undefined
      ? `${spacingMap[factor]}px`
      : `${Math.round(factor * 8)}px`;
  },

  typography: {
    fontFamily: designTokens.typography.fontFamily,
    // Ensure MUI defaults are overridden
    h1: {
      fontSize: `${designTokens.typography.heading.h1.size}px`,
      fontWeight: designTokens.typography.heading.h1.weight,
      lineHeight: designTokens.typography.heading.h1.lineHeight,
    },
    h2: {
      fontSize: `${designTokens.typography.heading.h2.size}px`,
      fontWeight: designTokens.typography.heading.h2.weight,
      lineHeight: designTokens.typography.heading.h2.lineHeight,
    },
    h3: {
      fontSize: `${designTokens.typography.heading.h3.size}px`,
      fontWeight: designTokens.typography.heading.h3.weight,
      lineHeight: designTokens.typography.heading.h3.lineHeight,
    },
    body1: {
      fontSize: `${designTokens.typography.body.body1.size}px`,
      fontWeight: designTokens.typography.body.body1.weight,
      lineHeight: designTokens.typography.body.body1.lineHeight,
    },
    body2: {
      fontSize: `${designTokens.typography.body.body2.size}px`,
      fontWeight: designTokens.typography.body.body2.weight,
      lineHeight: designTokens.typography.body.body2.lineHeight,
    },
    subtitle1: {
      fontSize: `${designTokens.typography.subtitle1.size}px`,
      fontWeight: designTokens.typography.subtitle1.weight,
      lineHeight: designTokens.typography.subtitle1.lineHeight,
    },
    subtitle2: {
      fontSize: `${designTokens.typography.subtitle2.size}px`,
      fontWeight: designTokens.typography.subtitle2.weight,
      lineHeight: designTokens.typography.subtitle2.lineHeight,
    },
    button: {
      fontSize: `${designTokens.typography.button.fontSize}px`,
      fontWeight: designTokens.typography.button.fontWeight,
      lineHeight: designTokens.typography.button.lineHeight,
      letterSpacing: designTokens.typography.button.letterSpacing,
      textTransform: 'none' as const,
    },
  },

  tokens: designTokens,
});
