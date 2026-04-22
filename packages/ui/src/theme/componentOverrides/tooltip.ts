import { Components, Theme } from "@mui/material/styles";

export const tooltipOverrides: Components<Theme> = {
  MuiTooltip: {
    defaultProps: {
      arrow: false,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.inverted,
        color: theme.tokens.color.text.inverted,
        fontSize: `${theme.tokens.typography.size.xs}px`,
        fontWeight: theme.tokens.typography.body.base.weight,
        lineHeight: theme.tokens.typography.body.base.lineHeight,
        padding: `${4} ${8}`,
        borderRadius: 6,
        opacity: 0.9,
        boxShadow:
          "0px 16px 24px -8px rgba(0,0,0,0.06), 0px 4px 8px -4px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
      }),
      arrow: ({ theme }) => ({
        color: theme.tokens.color.background.control.inverted,
        "&::before": {
          opacity: 0.9,
        },
      }),
    },
  },
};
