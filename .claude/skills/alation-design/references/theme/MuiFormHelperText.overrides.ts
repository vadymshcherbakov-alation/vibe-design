import {type Components, Theme} from '@mui/material/styles';

export const muiFormHelperTextOverrides: Components<Theme> = {
  MuiFormHelperText: {
    styleOverrides: {
      root: ({theme}) => ({
        color: theme.palette.text.secondary,
        margin: theme.spacing(0.5, 0),
        fontSize: '1.1rem',
        lineHeight: 1.45,
        fontWeight: theme.typography.fontWeightLight,
        position: 'relative',
        '&.Mui-error': {
          '&:before': {
            marginRight: theme.spacing(0.7),
            verticalAlign: '-20%',
            display: 'inline-block',
            width: '1.33rem',
            height: '1.33rem',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.99992 0.333374C3.31992 0.333374 0.333252 3.32004 0.333252 7.00004C0.333252 10.68 3.31992 13.6667 6.99992 13.6667C10.6799 13.6667 13.6666 10.68 13.6666 7.00004C13.6666 3.32004 10.6799 0.333374 6.99992 0.333374ZM7.66659 10.3334H6.33325V9.00004H7.66659V10.3334ZM7.66659 7.66671H6.33325V3.66671H7.66659V7.66671Z' fill='%23E02655'/%3E%3C/svg%3E%0A\")",
            content: '""',
          },
        },
        '&.Mui-disabled': {
          color: theme.palette.text.secondary,
        },
      }),
    },
  },
};
