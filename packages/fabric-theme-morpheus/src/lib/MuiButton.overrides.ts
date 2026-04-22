import {buttonClasses, ButtonProps, Components, CSSObject, Theme} from '@mui/material';
import {keyframes} from '@mui/system';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1turn);
  }
`;

/**
 * Spec: https://www.figma.com/file/hpCXXKmFnH53j0koyBb7Nn/Design-System?node-id=3%3A237
 */

const getHoverBackgroundStyle = (theme: Theme, color: ButtonProps['color'], variant: ButtonProps['variant']) => {
  const gradientHoverStyle = {
    '&:hover': {
      backgroundColor: theme.palette.background.gradient,
      '&.spin::before': {
        animation: `${spin} 1.5s linear infinite`,
      },
    },
  };
  switch (true) {
    case variant === 'contained':
      if (color === 'gradient') {
        return gradientHoverStyle;
      }
      return {
        '&:hover': {
          backgroundColor:
            color === undefined || color === 'inherit' ? theme.palette.grey[500] : theme.palette[color].dark,
        },
      };
    case variant === 'outlined' || variant === 'text':
      if (color === 'gradient') {
        return gradientHoverStyle;
      }
      return {
        '&:hover': {
          backgroundColor:
            color === undefined || color === 'inherit' ? theme.palette.grey[500] : theme.palette[color].light,
        },
      };
    default:
      return {};
  }
};

const getFocusVisibleOutlineStyle = (theme: Theme, color: ButtonProps['color']) => {
  const outlineColor =
    color === undefined || color === 'inherit' || color === 'gradient'
      ? theme.palette.text.secondary
      : theme.palette[color].dark;

  return {
    '&.Mui-focusVisible': {
      ...theme.outlineStyleMixin({outlineColor}),
    },
  };
};

export const muiButtonOverrides: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      disableFocusRipple: true,
    },
    variants: [
      {
        props: {size: 'xsmall'},
        style: {
          height: '2.4rem',
        },
      },
    ],
    styleOverrides: {
      root: ({ownerState, theme}) => ({
        borderRadius: theme.shape.borderRadius,
        lineHeight: 'normal',
        transition: 'none',
        whiteSpace: 'nowrap',
        ...getFocusVisibleOutlineStyle(theme, ownerState?.color),
        [`&.${buttonClasses.disabled}`]: {
          color: theme.palette.text.disabled,
        },
        // outlinedWarning
        [`&.${buttonClasses.outlined}.${buttonClasses.colorWarning}`]: {
          borderColor: theme.palette.warning.dark,
          color: theme.palette.warning.dark,
        },
        // outlinedPrimary
        [`&.${buttonClasses.outlined}.${buttonClasses.colorPrimary}`]: {
          ...(theme.palette.mode === 'dark'
            ? {
                color: theme.palette.text.primary,
                borderColor: theme.palette.background.lighten30,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focusVisible': {
                  ...theme.outlineStyleMixin({outlineColor: theme.palette.blue[900]}),
                },
              }
            : {}),
        },
        // containedWarning
        [`&.${buttonClasses.contained}.${buttonClasses.colorWarning}`]: {
          '&:hover': {
            backgroundColor: theme.palette.warning.light,
          },
        },
        // textWarning
        [`&.${buttonClasses.text}.${buttonClasses.colorWarning}`]: {
          color: theme.palette.warning.dark,
        },
        [`&.${buttonClasses.colorInherit}.${buttonClasses.contained}`]: {
          backgroundColor: theme.palette.grey[400],
        },
        '&.MuiButton-colorGradient': {
          border: '0 solid transparent',
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.main,
          position: 'relative',
          overflow: 'hidden',
          inset: 0,
          isolation: 'isolate',

          '&::after': {
            borderRadius: theme.shape.borderRadius,
            background: theme.palette.background.paper,
            position: 'absolute',
            inset: 1.5,
            content: '""',
            display: 'inline-block',
            zIndex: '-1',
          },
          '&:hover': {
            '&::after': {
              background: theme.palette.background.gradient,
            },
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          },
        },
      }),
      contained: ({ownerState, theme}) => ({
        '&.Mui-disabled': {
          backgroundColor: theme.palette.grey[400],
        },
        ...getHoverBackgroundStyle(theme, ownerState?.color, 'contained'),
      }),
      outlined: ({ownerState, theme}) => ({
        border: '0.1rem solid',
        '&.Mui-disabled': {
          border: `0.1rem solid ${
            theme.palette.mode === 'dark' ? theme.palette.background.lighten30 : theme.palette.grey[500]
          }`,
        },
        '&.MuiButton-colorGradient': {
          isolation: 'isolate',
          '&.spin': {
            '&:before': {
              inset: -40, // this is finicky and needs to be customized to the button length
            },
          },
          '&::before': {
            borderRadius: theme.shape.borderRadius,
            position: 'absolute',
            inset: 0,
            content: '""',
            background: theme.palette.background.gradientOutline,
            display: 'inline-block',
            zIndex: '-1',
          },
        },
        ...getHoverBackgroundStyle(theme, ownerState?.color, 'outlined'),
      }),
      text: ({ownerState, theme}) => ({
        ...(theme.palette.mode === 'dark'
          ? {
              color: theme.palette.text.primary,
              borderColor: theme.palette.background.lighten30,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.light,
              },
              '&.Mui-focusVisible': {
                ...theme.outlineStyleMixin({outlineColor: theme.palette.blue[900]}),
              },
            }
          : {...getHoverBackgroundStyle(theme, ownerState?.color, 'text')}),
      }),
      colorInherit: ({theme}) => ({
        borderColor: theme.palette.grey[500],
      }),
      sizeLarge: ({theme}): CSSObject => ({
        padding: theme.spacing(1.25, 2.5),
        ...(theme.typography.buttonLg as CSSObject),
        [`.${buttonClasses.icon} > *:nth-of-type(1)`]: {
          fontSize: theme.typography.iconLarge.fontSize,
        },
        [`&.${buttonClasses.outlined}`]: {
          ...theme.typography.buttonLg,
        },
      }),
      sizeMedium: ({theme}) => ({
        padding: theme.spacing(1, 2),
        ...theme.typography.button,
      }),
      sizeSmall: ({theme}) => ({
        padding: theme.spacing(0.75, 1.5),
        ...(theme.typography.buttonSm as CSSObject),
        [`.${buttonClasses.icon} > *:nth-of-type(1)`]: {
          fontSize: theme.typography.iconSmall.fontSize,
        },
      }),
      outlinedSizeLarge: ({theme}) => ({
        padding: `calc(${theme.spacing(1.25)} - 0.1rem) calc(${theme.spacing(2.5)} - 0.1rem)`,
      }),
      outlinedSizeMedium: ({theme}) => ({
        padding: `calc(${theme.spacing(1)} - 0.1rem) calc(${theme.spacing(2)} - 0.1rem)`,
      }),
      outlinedSizeSmall: ({theme}) => ({
        padding: `calc(${theme.spacing(0.75)} - 0.1rem) calc(${theme.spacing(1.5)} - 0.1rem)`,
      }),
      endIcon: ({theme}) => ({
        marginRight: 0,
        marginLeft: theme.spacing(1),
      }),
      startIcon: ({theme}) => ({
        marginLeft: 0,
        marginRight: theme.spacing(1),
      }),
    },
  },
};

export const muiButtonShellOverrides: Components<Theme> = {
  MuiButton: {
    ...muiButtonOverrides.MuiButton,
    styleOverrides: {
      root: ({theme}) => ({
        [`&.${buttonClasses.text}.${buttonClasses.colorPrimary}`]: {
          color: theme.palette.primary.light,
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
          },
        },
        [`&.${buttonClasses.text}.${buttonClasses.colorInherit}`]: {
          '&:hover': {
            color: 'currentColor',
            backgroundColor: theme.palette.background.darken10,
          },
        },
      }),
    },
  },
};
