import { Components, Theme } from "@mui/material/styles";

type ChipColorKey =
  | "gray"
  | "blue"
  | "red"
  | "amber"
  | "green"
  | "teal"
  | "purple"
  | "pink"
  | "orange";

const chipColors: ChipColorKey[] = [
  "gray",
  "blue",
  "red",
  "amber",
  "green",
  "teal",
  "purple",
  "pink",
  "orange",
];

function buildFilledColorVariants(theme: Theme) {
  const variants: Record<string, object> = {};
  for (const color of chipColors) {
    const bgKey = color as keyof typeof theme.tokens.color.background.chip;
    const textKey = color as keyof typeof theme.tokens.color.text.chip;
    const strongBgKey =
      `${color}-strong` as keyof typeof theme.tokens.color.background.chip;

    variants[`&.MuiChip-color${capitalize(color)}`] = {
      backgroundColor: theme.tokens.color.background.chip[bgKey],
      color: theme.tokens.color.text.chip[textKey],
      "& .MuiChip-icon, & .MuiChip-label": {
        color: theme.tokens.color.text.chip[textKey],
      },
    };
    if (strongBgKey in theme.tokens.color.background.chip) {
      variants[`&.MuiChip-colorStrong${capitalize(color)}`] = {
        backgroundColor: theme.tokens.color.background.chip[strongBgKey],
        color: theme.tokens.color.white,
      };
    }
  }
  return variants;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const chipOverrides: Components<Theme> = {
  MuiChip: {
    defaultProps: {
      clickable: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        lineHeight: "normal",
        "&:not(.MuiChip-clickable)": {
          pointerEvents: "none",
        },
      }),
      filled: ({ theme }) => ({
        ...buildFilledColorVariants(theme),
        "&.MuiChip-colorDefault": {
          backgroundColor: theme.tokens.color.background.chip.gray,
          "& .MuiChip-icon, & .MuiChip-label": {
            color: theme.tokens.color.text.primary,
          },
          "&:hover": {
            backgroundColor: theme.tokens.palette.neutral[400],
          },
        },
        "&.Mui-disabled": {
          backgroundColor: theme.tokens.palette.neutral[300],
          opacity: 1,
          "& .MuiChip-icon": {
            color: theme.tokens.color.text.disabled,
          },
          "& .MuiChip-label": {
            color: theme.tokens.color.text.disabled,
          },
        },
      }),
      labelMedium: ({ theme }) => ({
        padding: "0 8px",
        fontSize: `${theme.tokens.typography.body.base.size}px`,
      }),
      labelSmall: ({ theme }) => ({
        padding: "0 8px",
        fontSize: `${theme.tokens.typography.body.base.size}px`,
      }),
      sizeMedium: {
        padding: 3,
        height: 28,
      },
      sizeSmall: {
        padding: "2px 3px",
        height: 24,
      },
      avatar: ({ theme }) => ({
        fontSize: theme.tokens.typography.size.xs,
        margin: 0,
      }),
      deleteIconMedium: {
        fontSize: 20,
        margin: "0 2px",
      },
      deleteIconSmall: {
        margin: "0 1px",
      },
      icon: {
        fontSize: 16,
      },
      iconMedium: {
        margin: "0 -2px 0 8px",
      },
      iconSmall: {
        margin: "0 -2px 0 6px",
      },
    },
  },
};
