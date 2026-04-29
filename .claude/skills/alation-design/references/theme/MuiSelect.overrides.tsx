import type {Components, Theme} from '@mui/material/styles';

import {TriangleArrowDownIcon} from '@alation/icons-neo';

import {extendComponentOverrides} from './overrideHelpers';

export const muiSelectOverrides: Components<Theme> = {
  MuiSelect: {
    defaultProps: {
      variant: 'outlined',
      IconComponent: TriangleArrowDownIcon,
      autoWidth: false,
    },
    styleOverrides: {
      select: ({theme}) => ({
        display: 'flex',
        padding: theme.spacing(1.0875),
        '&.MuiInputBase-inputSizeSmall': {
          padding: theme.spacing(0.585),
          ...theme.typography.body1,
          lineHeight: 1.4375,
        },
      }),
      icon: {
        fontSize: '1.5rem',
        top: 'calc(50% - 1rem)',
        width: '2rem',
        height: '2rem',
        '&.Mui-disabled': {
          opacity: 0.25,
        },
      },
      // Standard variant is used to achieve "text-button" styling for select input
      standard: ({theme}) => ({
        borderRadius: theme.borderRadiusToRem(6),
        color: theme.palette.primary.main,
        paddingLeft: theme.spacing(1.5),
        ...theme.typography.button,
        '&:hover, &:focus-visible, &[aria-expanded="true"]': {
          backgroundColor: theme.palette.primary.light,
        },
        '& ~ .MuiSelect-icon': {
          color: theme.palette.primary.main,
          right: '1.4rem',
          top: 'calc(50% - 1.1rem)',
          transform: 'scale(0.7)',
          fill: theme.palette.primary.main,
        },
        '&.MuiInputBase-inputSizeSmall': {
          paddingLeft: theme.spacing(1.5),
          ...theme.typography.button,
        },
      }),
    },
  },
};

export const muiSelectShellOverrides: Components<Theme> = {
  MuiSelect: {
    ...muiSelectOverrides.MuiSelect,
    styleOverrides: {
      ...muiSelectOverrides.MuiSelect?.styleOverrides,
      select: ({theme}) => ({
        ...extendComponentOverrides(
          muiSelectOverrides.MuiSelect?.styleOverrides?.select,
          {
            background: theme.palette.background.lighten10,
          },
          theme,
        ),
      }),
      standard: ({theme}) => ({
        ...extendComponentOverrides(
          muiSelectOverrides.MuiSelect?.styleOverrides?.standard,
          {
            color: theme.palette.primary.contrastText,
            '&:hover, &:focus-visible, &[aria-expanded="true"]': {
              background: theme.palette.background.lighten30,
            },
            '& ~ .MuiSvgIcon-root': {
              color: theme.palette.primary.contrastText,
            },
          },
          theme,
        ),
      }),
    },
  },
};
