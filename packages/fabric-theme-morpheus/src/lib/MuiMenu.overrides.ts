import type {Components, CSSObject, Theme} from '@mui/material/styles';
import {merge} from 'lodash';

/**
 * Spec: https://www.figma.com/file/KOwS8lv2lJjRUGDduXuR9v/%5BWIP%5D-NEO-Fabric-Design-System?node-id=48%3A8153
 */

export const getMenuStyles = (theme: Theme): CSSObject => {
  return {
    minWidth: 0,
    padding: theme.spacing(0.5),
    '& .MuiMenuItem-root': {
      ...theme.typography.body1,
      borderRadius: theme.borderRadiusToRem(4),
      margin: theme.spacing(0.25, 0),
      minHeight: 0,
      padding: theme.spacing(0.5, 1.5),
      '&:first-of-type': {
        marginTop: 0,
      },
      '&:last-child': {
        marginBottom: 0,
      },
      '&:hover, &.Mui-focusVisible': {
        backgroundColor: theme.palette.background.darken10,
      },
      '&.Mui-disabled': {
        color: theme.palette.text.disabled,
      },
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.iconSmall.fontSize,
        '&:first-of-type': {
          marginRight: theme.spacing(1.25),
        },
      },
    },
  } as const;
};

export const muiMenuOverrides: Components<Theme> = {
  MuiMenu: {
    styleOverrides: {
      list: ({theme}) => ({
        ...getMenuStyles(theme),
      }),
      paper: ({theme}) => ({
        boxShadow: theme.shadows[1],
      }),
    },
  },
};

export const muiMenuShellOverrides = merge<Components<Theme>, Components<Theme>, Components<Theme>>(
  {},
  muiMenuOverrides,
  {
    MuiMenu: {
      styleOverrides: {
        root: ({theme}) => ({
          '& .MuiListItemIcon-root, & .MuiMenuItem-root': {
            color: theme.palette.common.black,

            ...theme.applyStyles('dark', {
              color: theme.palette.text.primary,
            }),
          },
        }),
      },
    },
  },
);
