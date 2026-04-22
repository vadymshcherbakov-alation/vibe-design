import type {Components, Theme} from '@mui/material/styles';

export const muiTableOverrides: Components<Theme> = {
  MuiTable: {
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.body1,
        border: `0.1rem solid ${theme.palette.grey[500]}`,
        borderCollapse: 'unset',
        borderRadius: theme.borderRadiusToRem(6),
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.body1,
        borderTop: `0.1rem solid ${theme.palette.grey[400]}`,
        borderBottom: 'none',
      }),
      head: ({theme}) => ({
        ...theme.typography.subtitle2,
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      head: {
        '.MuiTableCell-head': {
          border: 'none',
        },
      },
    },
  },
};
