import type {Components, Theme} from '@mui/material/styles';

import {fabricClasses} from '@alation/fabric-types';

export const muiToggleButtonOverrides: Components<Theme> = {
  MuiToggleButtonGroup: {
    styleOverrides: {
      grouped: ({theme}) => ({
        '&:not(:last-of-type)': {
          borderRadius: theme.borderRadiusToRem(6),
        },
        '&:not(:first-of-type)': {
          borderRadius: theme.borderRadiusToRem(6),
        },
      }),
      groupedHorizontal: {
        [`&.${fabricClasses.toggleButtonOutlined}`]: {
          '&:not(:last-of-type)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          '&:not(:first-of-type)': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        },
      },
      groupedVertical: {
        [`&.${fabricClasses.toggleButtonOutlined}`]: {
          '&:not(:last-of-type)': {
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          },
          '&:not(:first-of-type)': {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({theme}) => ({
        borderRadius: theme.borderRadiusToRem(6),
        border: 'none',
        color: theme.palette.text.secondary,
        '&.Mui-disabled': {
          border: 'none',
          color: theme.palette.text.disabled,
        },
        [`&.${fabricClasses.toggleButtonOutlined}`]: {
          border: `0.1rem solid ${theme.palette.grey[600]}`,
        },
        '&:hover': {
          // hover background-color needs opacity to display borders correctly
          backgroundColor: theme.palette.background.darken10,
        },
        '&.Mui-focusVisible': {
          ...theme.outlineStyleMixin({outlineColor: theme.palette.blue[900]}),
        },
      }),
      sizeSmall: ({theme}) => ({
        fontSize: '1.6rem',
        padding: theme.spacing(0.625),
      }),
      sizeMedium: ({theme}) => ({
        fontSize: '2rem',
        padding: theme.spacing(0.875),
      }),
      sizeLarge: ({theme}) => ({
        fontSize: '2.4rem',
        padding: theme.spacing(1.125),
      }),
    },
  },
};
