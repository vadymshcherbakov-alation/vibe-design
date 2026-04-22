import {type LabelDisplayedRowsArgs} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';
import {type ReactNode} from 'react';

function getLabelDisplayedRows({from, to, count}: LabelDisplayedRowsArgs): ReactNode {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`} items`;
}

export const muiTablePaginationOverrides: Components<Theme> = {
  MuiTablePagination: {
    defaultProps: {
      slotProps: {
        select: {
          variant: 'outlined',
        },
      },
      labelDisplayedRows: getLabelDisplayedRows,
      labelRowsPerPage: 'Show rows',
      rowsPerPageOptions: [5, 10, 25, 50, 100],
      backIconButtonProps: {
        size: 'large',
      },
      nextIconButtonProps: {
        size: 'large',
      },
    },
    styleOverrides: {
      selectLabel: ({theme}) => ({
        fontSize: theme.typography.body1.fontSize,
      }),
      selectRoot: ({theme}) => ({
        marginRight: theme.spacing(2),
      }),
      displayedRows: ({theme}) => ({
        fontSize: theme.typography.body1.fontSize,
      }),
    },
  },
};
