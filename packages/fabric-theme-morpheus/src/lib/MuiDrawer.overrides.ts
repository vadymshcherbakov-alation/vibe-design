import type {Components, Theme} from '@mui/material/styles';
import {merge} from 'lodash';

import {getShellDrawerColor} from '@alation/util';

export const muiDrawerOverrides = {
  MuiDrawer: {
    styleOverrides: {
      paperAnchorLeft: ({theme}) => ({
        borderRight: `0.2rem solid ${theme.palette.grey[500]}`,
      }),
      paperAnchorRight: ({theme}) => ({
        borderLeft: `0.2rem solid ${theme.palette.grey[500]}`,
      }),
      paperAnchorTop: ({theme}) => ({
        borderBottom: `0.2rem solid ${theme.palette.grey[500]}`,
      }),
      paperAnchorBottom: ({theme}) => ({
        borderTop: `0.2rem solid ${theme.palette.grey[500]}`,
      }),
    },
  },
} satisfies Components<Theme>;

export const muiDrawerShellOverrides = merge<Components<Theme>, Components<Theme>, Components<Theme>>(
  {},
  muiDrawerOverrides,
  {
    MuiDrawer: {
      styleOverrides: {
        paper: ({theme}) => {
          return {
            backgroundColor: theme.palette.brand.dark,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.background.lighten20,
            }),
          };
        },
        root: ({theme}) => {
          const drawerColor = getShellDrawerColor(theme.palette.background.default);
          return {
            backgroundColor: theme.palette.secondary.main,
            '&.pageSideDrawer': {
              '.MuiDrawer-paperAnchorLeft': {
                backgroundColor: drawerColor,
                borderRightColor: drawerColor,
              },
            },
            '&.pageSideGutter': {
              '.MuiDrawer-paperAnchorLeft': {
                borderRightColor: theme.palette.background.lighten20,
                borderRightWidth: '0.1rem',
                borderRightStyle: 'solid',
              },
            },
          };
        },
      },
    },
  },
);
