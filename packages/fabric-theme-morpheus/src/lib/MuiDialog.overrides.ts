import type {Components, Theme} from '@mui/material/styles';

export const muiDialogOverrides: Components<Theme> = {
  MuiDialog: {
    styleOverrides: {
      root: ({theme}) => ({
        '.MuiDialog-titleButtonBox': {
          marginLeft: theme.spacing(2),
          textAlign: 'right',
          flexGrow: 1,
        },
        '.MuiDialog-titleIconBox': {
          marginRight: theme.spacing(2),
          display: 'flex',
        },
        '.MuiDialog-rightActions': {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1),
          },
        },
        '.MuiDialog-leftActions': {
          flexGrow: 1,
        },
      }),
      paper: ({theme}) => ({
        borderRadius: '1.2rem',
        padding: theme.spacing(3),
      }),
      paperFullScreen: {
        width: '97%',
        height: '97%',
        maxWidth: '97%',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.h1,
        padding: 0,
        marginBottom: theme.spacing(2),
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({theme}) => ({
        marginTop: theme.spacing(3),
        padding: 0,
      }),
    },
  },
};
