export const layoutTokens = {
  radius: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 12,
    xlarge: 24,
    full: 999,
  },
  spacing: {
    // Design system spacing hierarchy
    // 2px, 4px: spacing within a component or between icons and related text
    xxs: 2,  // 2px - micro spacing within components
    xs: 4,   // 4px - small spacing within components
    // 8px: separate related elements and for small padding
    sm: 8,   // 8px - related elements, small padding
    // 16px: separate unrelated elements or groups and for normal padding
    md: 16,  // 16px - unrelated elements, normal padding
    // 24px: separate sub-sections of content
    lg: 24,  // 24px - sub-sections of content
    // 32px: separate sections of content
    xl: 32,  // 32px - sections of content
    // Additional larger spacing for major layout sections
    "2xl": 48, // 48px - major layout sections
    "3xl": 64, // 64px - page-level sections
  },
  size: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 36,
    6: 48,
  },
  transition: {
    fast: "150ms",
  },
  shadow: {
    hover: "rgba(87, 84, 91, 0.06) 0px 0px 0px 2px",
  },
} as const;
