import { Components, Theme } from "@mui/material/styles";

export const breadcrumbsOverrides: Components<Theme> = {
  MuiBreadcrumbs: {
    defaultProps: {
      separator: "›",
    },
    styleOverrides: {
      separator: ({ theme }) => ({
        color: theme.tokens.color.text.secondary,
      }),
      li: ({ theme }) => ({
        "& > *": {
          color: theme.tokens.color.text.secondary,
          textDecoration: "none",
        },
        ".MuiTypography-root": {
          display: "flex",
          alignItems: "center",
          ".MuiSvgIcon-root": {
            marginRight: 6,
          },
        },
        a: {
          cursor: "pointer",
          display: "inline-block",
          borderRadius: 4,
        },
        "&:last-child *": {
          color: theme.tokens.color.text.primary,
          fontWeight: theme.tokens.typography.body.strong.weight,
        },
        "*:focus-visible": {
          outline: `2px solid ${theme.tokens.color.border.button.focus}`,
          outlineOffset: 1,
        },
        "& .MuiIconButton-root": {
          "&.ellipsis-item": {
            '&[aria-expanded="true"]': {
              backgroundColor: theme.tokens.palette.neutral[400],
            },
            borderRadius: 2,
            height: 24,
            padding: "4px 0",
            width: 16,
          },
        },
      }),
    },
  },
};
