import {Components, IconButtonProps, SxProps, Theme} from '@mui/material';

import {extendComponentOverrides} from './overrideHelpers';

export const getContainedIconButtonStyles = (
  color: IconButtonProps['color'],
  theme: Theme,
  isAccent = false,
): SxProps<Theme> => {
  if (color === 'default' || color === undefined || color === 'inherit') {
    return {
      color: theme.palette.text.secondary,
      backgroundColor: isAccent ? theme.palette.background.lighten20 : theme.palette.grey[300],
      '&:hover': {
        backgroundColor: isAccent ? theme.palette.background.lighten30 : theme.palette.grey[500],
      },
      '&.Mui-focusVisible': {
        ...theme.outlineStyleMixin({outlineColor: theme.palette.text.secondary}),
      },
    };
  }

  return {
    backgroundColor: theme.palette[color].main,
    '&:hover': {
      backgroundColor: color === 'warning' ? theme.palette[color].light : theme.palette[color].dark,
    },
    '&.Mui-focusVisible': {
      ...theme.outlineStyleMixin({outlineColor: theme.palette[color].dark}),
    },
  };
};

function getTextIconButtonColor(theme: Theme, color: IconButtonProps['color'], isShell = false) {
  switch (color) {
    case undefined:
    case 'default':
      return isShell ? theme.palette.grey[400] : theme.palette.text.secondary;
    case 'inherit':
      return 'currentcolor';
    case 'warning':
      return theme.palette.warning.dark;
    default:
      return isShell ? theme.palette[color].main : undefined;
  }
}

function getTextIconButtonStyles(theme: Theme, color: IconButtonProps['color'], isShell = false) {
  const buttonColor = getTextIconButtonColor(theme, color, isShell);
  let hoverColor: string | undefined = undefined;

  if (color === 'default' || color === 'inherit') {
    hoverColor = theme.palette.mode === 'dark' ? theme.palette.background.lighten10 : theme.palette.background.darken10;
  } else if (color !== undefined) {
    hoverColor = theme.palette[color].light;
  }

  return {
    color: buttonColor,
    '&:hover': {
      backgroundColor: hoverColor,
    },
    '&.Mui-focusVisible': {
      ...theme.outlineStyleMixin({outlineColor: buttonColor}),
    },
  };
}

function getOutlinedIconButtonStyle(theme: Theme, color: IconButtonProps['color'], isAccent = false) {
  switch (color) {
    case 'inherit':
      return {border: '0.1rem solid currentcolor'};
    case 'default':
    case undefined:
      return {border: `0.1rem solid ${getTextIconButtonColor(theme, color, isAccent)}`};
    default:
      return {
        border: `0.1rem solid ${isAccent ? getTextIconButtonColor(theme, color, isAccent) : theme.palette[color].main}`,
      };
  }
}

function getOutlinedIconButtonPadding(theme: Theme) {
  return {
    '&.MuiIconButton-sizeSmall': {
      padding: `calc(${theme.spacing(0.75)} - 0.1rem) calc(${theme.spacing(0.75)} - 0.1rem)`,
    },
    '&.MuiIconButton-sizeMedium': {
      padding: `calc(${theme.spacing(1)} - 0.1rem) calc(${theme.spacing(1)} - 0.1rem)`,
    },
    '&.MuiIconButton-sizeLarge': {
      padding: `calc(${theme.spacing(1.25)} - 0.1rem) calc(${theme.spacing(1.25)} - 0.1rem)`,
    },
  };
}

export const muiIconButtonOverrides: Components<Theme> = {
  MuiIconButton: {
    defaultProps: {
      disableFocusRipple: true,
      disableRipple: true,
    },
    variants: [
      {
        props: {size: 'xsmall'},
        style: ({theme}) => ({
          fontSize: theme.typography.iconSmall.fontSize,
          padding: theme.spacing(0.5),
        }),
      },
    ],
    styleOverrides: {
      root: ({ownerState, theme}) => {
        return {
          borderRadius: theme.shape.borderRadius,
          '&.MuiIconButton-contained': {
            color: theme.palette.common.white,
            [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Contained` : 'contained'}`]: {
              ...getContainedIconButtonStyles(ownerState?.color, theme),
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.grey[400],
              color: theme.palette.grey[600],
            },
          },
          '&.MuiIconButton-text': {
            [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Text` : 'text'}`]: {
              ...getTextIconButtonStyles(theme, ownerState?.color),
            },
            '&.Mui-disabled': {
              color: theme.palette.grey[600],
            },
          },
          '&.MuiIconButton-outlined': {
            [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Outlined` : 'outlined'}`]: {
              ...getTextIconButtonStyles(theme, ownerState?.color),
              ...getOutlinedIconButtonStyle(theme, ownerState?.color),
            },
            ...getOutlinedIconButtonPadding(theme),
            '&.Mui-disabled': {
              color: theme.palette.grey[600],
              borderColor: theme.palette.grey[600],
            },
          },
          '&.MuiIconButton-outlined, &.MuiIconButton-text': {
            '&:hover': {
              backgroundColor: theme.palette.background.darken10,
            },
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          },
        };
      },
      colorWarning: ({theme}) => ({
        '&.MuiIconButton-contained': {
          color: theme.palette.warning.dark,
        },
      }),
      colorPrimary: ({theme}) =>
        theme.palette.mode === 'dark'
          ? {
              '&&.MuiIconButton-outlined': {
                color: theme.palette.text.primary,
                borderColor: theme.palette.background.lighten30,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focusVisible': {
                  ...theme.outlineStyleMixin({outlineColor: theme.palette.blue[900]}),
                },
              },
            }
          : {},
      sizeSmall: ({theme}) => ({
        fontSize: theme.typography.iconSmall.fontSize,
        padding: theme.spacing(0.75),
      }),
      sizeMedium: ({theme}) => ({
        fontSize: theme.typography.iconMedium.fontSize,
        padding: theme.spacing(1),
      }),
      sizeLarge: ({theme}) => ({
        fontSize: theme.typography.iconLarge.fontSize,
        padding: theme.spacing(1.25),
      }),
    },
  },
};

export const muiIconButtonShellOverrides: Components<Theme> = {
  MuiIconButton: {
    ...muiIconButtonOverrides.MuiIconButton,
    styleOverrides: {
      ...muiIconButtonOverrides.MuiIconButton?.styleOverrides,
      root: ({ownerState, theme}) => ({
        ...extendComponentOverrides(
          muiIconButtonOverrides.MuiIconButton?.styleOverrides?.root,
          {
            '&.MuiIconButton-contained': {
              color: theme.palette.common.white,
              [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Contained` : 'contained'}`]: {
                ...getContainedIconButtonStyles(ownerState?.color, theme),
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.grey[400],
                color: theme.palette.grey[600],
              },
            },
            '&.MuiIconButton-text': {
              [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Text` : 'text'}`]: {
                ...getTextIconButtonStyles(theme, ownerState?.color),
              },
            },
            '&.MuiIconButton-outlined': {
              [`&.MuiIconButton-${ownerState?.color ? `${ownerState.color}Outlined` : 'outlined'}`]: {
                ...getTextIconButtonStyles(theme, ownerState?.color),
                ...getOutlinedIconButtonStyle(theme, ownerState?.color),
              },
              ...getOutlinedIconButtonPadding(theme),
              '&.Mui-disabled': {
                color: theme.palette.grey[600],
                borderColor: theme.palette.grey[600],
              },
            },
            '&&.Mui-disabled': {
              color: theme.palette.text.disabled,
            },
          },
          theme,
        ),
      }),
    },
  },
};
