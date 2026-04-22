import type {Components, Theme} from '@mui/material/styles';
import {merge} from 'lodash';

import {getMenuStyles} from './MuiMenu.overrides';
import {extendComponentOverrides} from './overrideHelpers';

/**
 * Spec: https://www.figma.com/file/hpCXXKmFnH53j0koyBb7Nn/Design-System?node-id=2423%3A48802
 */

export const muiListOverrides: Components<Theme> = {
  MuiListItemAvatar: {
    styleOverrides: {
      root: ({theme}) => ({
        marginRight: theme.spacing(1),
        minWidth: 0,
        height: '1.6rem',
        width: '1.6rem',
        '& .MuiAvatar-root': {
          backgroundColor: theme.palette.grey[400],
          height: 'inherit',
          width: 'inherit',
          '& .MuiSvgIcon-root': {
            color: theme.palette.text.primary,
          },
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({theme}) => ({
        paddingLeft: theme.spacing(1),
        borderRadius: theme.borderRadiusToRem(4),
        '&:hover, &.Mui-focusVisible': {
          backgroundColor: theme.palette.background.darken10,
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.lighten10,
          }),
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({theme}) => ({
        color: theme.palette.text.primary,
        fontSize: theme.typography.iconSmall.fontSize,
        marginRight: theme.spacing(1),
        minWidth: 0,
        '& .MuiCheckbox-root': {
          padding: theme.spacing(0, 0.5, 0, 1),
        },
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({theme}) => ({
        borderRadius: theme.borderRadiusToRem(4),
        margin: theme.spacing(0.5, 0),
        '&:first-of-type': {
          marginTop: 0,
        },
        '&:last-child': {
          marginBottom: 0,
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
        '&:hover, &:focus, .MuiListItemButton-root': {
          '& .MuiListItemSecondaryAction-root': {
            '& svg': {
              opacity: 1,
            },
          },
        },
        '& .MuiListItemButton-root': {
          marginLeft: theme.spacing(-1),
        },
        '& .MuiIconButton-root': {
          padding: theme.spacing(0.25),
          '.MuiIconButton-text.MuiIconButton-defaultText': {
            '& .Mui-focusVisible': {
              outlineOffset: 0,
            },
          },
        },
      }),
      gutters: ({theme}) => ({
        paddingLeft: theme.spacing(1),
      }),
      dense: ({theme}) => ({
        margin: theme.spacing(0.25, 0),
        '& .MuiIconButton-root': {
          fontSize: theme.typography.iconSmall.fontSize,
        },
      }),
    },
  },
  MuiListItemSecondaryAction: {
    styleOverrides: {
      root: {
        '& svg': {
          opacity: 0,
        },
        '& .MuiIconButton-root.Mui-focusVisible': {
          '& svg': {
            opacity: 1,
          },
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: ({theme}) => ({
        margin: 0,
        '& + .MuiSvgIcon-root': {
          color: theme.palette.text.primary,
          fontSize: theme.typography.iconMedium.fontSize,
        },
      }),
      dense: ({theme}) => ({
        '&& .MuiListItemText-primary': {
          ...theme.typography.body1,
        },
        '& + .MuiSvgIcon-root': {
          fontSize: theme.typography.iconSmall.fontSize,
        },
      }),
      inset: ({theme}) => ({
        paddingLeft: theme.spacing(2),
      }),
      secondary: ({theme}) => ({
        ...theme.typography.body1,
      }),
    },
  },
  MuiList: {
    styleOverrides: {
      root: ({theme}) => ({
        // backgroundColor: theme.palette.grey[100],
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(0.5, 0.5),
        '&.MuiList-subheader': {
          paddingTop: 0,
        },
        '& .MuiListSubheader-root': {
          ...theme.typography.h6,
          padding: theme.spacing(1.5, 1, 1),
        },
        '& .MuiDivider-root': {
          margin: theme.spacing(0.25, 0.75),
        },
        // Style overrides for MuiMenuList component
        '&[role="menu"]': {
          ...getMenuStyles(theme),
          borderRadius: theme.shape.borderRadius,
          overflowY: 'auto',
        },
      }),
    },
  },
};

export const muiListShellOverrides: Components<Theme> = merge({}, muiListOverrides, {
  MuiList: {
    styleOverrides: {
      root: ({theme}) => ({
        ...extendComponentOverrides(
          muiListOverrides.MuiList?.styleOverrides?.root,
          {
            backgroundColor: 'transparent',
          },
          theme,
        ),
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({theme}) => ({
        ...extendComponentOverrides(
          muiListOverrides.MuiListItem?.styleOverrides?.root,
          {
            '&:hover, &.Mui-focusVisible, & .MuiListItemButton-root.Mui-selected': {
              backgroundColor: theme.palette.background.lighten10,
              '& .MuiListItemButton-root': {
                backgroundColor: 'transparent',
              },
            },
          },
          theme,
        ),
      }),
    },
  },
} satisfies Components<Theme>);
