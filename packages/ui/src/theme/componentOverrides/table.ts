import { Components, Theme } from "@mui/material/styles";

export const tableOverrides: Components<Theme> = {
  MuiTable: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        border: `1px solid ${theme.tokens.color.border.default}`,
        borderCollapse: "unset",
        borderRadius: 6,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
        borderTop: `1px solid ${theme.tokens.color.border.table}`,
        borderBottom: "none",
      }),
      head: ({ theme }) => ({
        fontSize: theme.tokens.typography.subtitle1.size,
        fontWeight: theme.tokens.typography.subtitle1.weight,
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      head: {
        ".MuiTableCell-head": {
          border: "none",
        },
      },
    },
  },
};
