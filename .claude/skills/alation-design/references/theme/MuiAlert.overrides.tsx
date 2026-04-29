import {AlertColor, SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {CheckCircleIcon, InformationFilledIcon, StopIcon, WarningFilledIcon} from '@alation/icons-neo';
import {capitalize} from '@alation/util';

function getIconColor(theme: Theme, severity: AlertColor) {
  return severity === 'warning' && theme.palette.mode !== 'dark'
    ? {
        '.MuiSvgIcon-root': {
          color: theme.palette.warning.dark,
        },
      }
    : {};
}

function outlinedMixin(theme: Theme, severity: AlertColor) {
  return {
    backgroundColor: theme.palette[severity].light,
    borderColor: theme.palette[severity].main,
    borderStyle: 'solid',
    ...getIconColor(theme, severity),
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette[severity].dark,
    }),
  };
}

export const muiAlertOverrides: Components<Theme> = {
  MuiAlert: {
    defaultProps: {
      iconMapping: {
        error: <SvgIcon component={StopIcon} />,
        info: <SvgIcon component={InformationFilledIcon} />,
        success: <SvgIcon component={CheckCircleIcon} />,
        warning: <SvgIcon component={WarningFilledIcon} />,
      },
      variant: 'outlined',
    },
    styleOverrides: {
      root: ({ownerState, theme}) => ({
        borderWidth: 0,
        padding: theme.spacing(2),
        '.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
        [`& .MuiButton-outlined${capitalize(ownerState.severity as string)}`]: {
          '&:not(.MuiButton-outlinedWarning)': {
            borderColor: theme.palette[ownerState.severity as AlertColor].main,
          },
          '&.Mui-disabled': {
            borderColor: theme.palette.grey[600],
            color: theme.palette.text.disabled,
          },
          color: theme.palette[ownerState.severity as AlertColor].dark,
        },
        [`& .MuiButton-text${capitalize(ownerState.severity as string)}`]: {
          color: theme.palette[ownerState.severity as AlertColor].dark,
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          },
        },
      }),
      filled: ({theme}) => ({
        '.MuiButtonBase-root': {
          color: 'inherit',
          '&.MuiButton-outlined': {
            borderColor: theme.palette.background.lighten30,
          },
          '&:hover': {
            backgroundColor: theme.palette.background.lighten10,
          },
        },
      }),
      filledWarning: ({theme}) => ({
        ...getIconColor(theme, 'warning'),
        '& .MuiButtonBase-root.MuiButton-outlined': {
          borderColor: theme.palette.background.darken30,
        },
        '.MuiButtonBase-root:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
        backgroundColor: undefined,
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.warning.light,
        }),
      }),
      outlined: ({ownerState, theme}) => ({
        borderWidth: '0.1rem',
        color: theme.palette.text.primary,
        ...outlinedMixin(theme, ownerState.severity as AlertColor),
      }),
      standard: ({ownerState, theme}) => ({
        borderBottomWidth: '0.1rem',
        borderRadius: 0,
        color: theme.palette.text.primary,
        ...outlinedMixin(theme, ownerState.severity as AlertColor),
      }),
      action: ({theme}) => ({
        flexShrink: 0,
        marginRight: 0,
        paddingTop: 0,
        '.MuiIconButton-sizeSmall': {
          marginTop: 0,
          padding: 0,
        },
        '.MuiSvgIcon-root': {
          fontSize: theme.typography.iconLarge.fontSize,
        },
      }),
      icon: ({theme}) => ({
        padding: theme.spacing(0, 2, 0, 0),
        margin: 0,
        '.MuiSvgIcon-root': {
          fontSize: theme.typography.iconLarge.fontSize,
        },
      }),
      message: ({theme}) => ({
        ...theme.typography.body1,
        lineHeight: 1.85,
        padding: 0,
      }),
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.subtitle1,
        '&&': {
          marginBottom: theme.spacing(0.5),
        },
      }),
    },
  },
};
