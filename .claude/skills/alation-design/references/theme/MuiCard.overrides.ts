import {avatarClasses, Components, Theme} from '@mui/material';

export const muiCardOverrides: Components<Theme> = {
  MuiCardHeader: {
    defaultProps: {
      subheaderTypographyProps: {
        color: 'text.secondary',
        variant: 'body1',
      },
      titleTypographyProps: {variant: 'h3'},
    },
    styleOverrides: {
      avatar: ({theme}) => ({
        marginRight: theme.spacing(1),
      }),
      root: {
        [`& .${avatarClasses.root}`]: {
          height: '4rem',
          width: '4rem',
          '& svg': {height: '2.4rem', width: '2.4rem'},
        },
        padding: 0,
      },
    },
  },
};
