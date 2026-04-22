import { Components, Theme } from "@mui/material/styles";

export const tablePaginationOverrides: Components<Theme> = {
  MuiTablePagination: {
    defaultProps: {
      slotProps: {
        select: {
          variant: "outlined",
        },
      },
      labelRowsPerPage: "Show rows",
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    styleOverrides: {
      selectLabel: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
      }),
      selectRoot: {
        marginRight: 16,
      },
      displayedRows: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
      }),
    },
  },
};
