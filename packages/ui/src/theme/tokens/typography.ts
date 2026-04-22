export const typographyTokens = {
  typography: {
    button: {
      fontFamily:
        '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeight: 500,
      fontSize: 13,
      lineHeight: 1.5,
      letterSpacing: "0",
    },
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    monoFontFamily:
      '"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace',
    heading: {
      h1: { size: 22, weight: 600, lineHeight: 1.21 }, // From design system
      h2: { size: 18, weight: 600, lineHeight: 1.21 }, // From design system
      h3: { size: 16, weight: 500, lineHeight: 1.21 }, // From design system
    },
    subtitle1: {
      size: 14,
      weight: 500,
      lineHeight: 1.21,
    },
    subtitle2: {
      size: 13,
      weight: 500,
      lineHeight: 1.21,
    },
    body: {
      body1: { size: 13, weight: 400, lineHeight: 1.54 }, // lineHeight: 20px / 13px = 1.54
      body2: { size: 12, weight: 400, lineHeight: 1.21 },
      base: { size: 13, weight: 400, lineHeight: 1.54 }, // Keep for compatibility
      strong: { size: 13, weight: 600, lineHeight: 1.54 }, // Keep for compatibility
    },
    size: {
      xs: 12,
      sm: 13,
      md: 14,
      lg: 16,
      xl: 18,
      "2xl": 22,
    },
    iconSize: {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
    },
  },
} as const;
