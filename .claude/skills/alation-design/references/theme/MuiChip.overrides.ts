import {chipClasses, darken, Theme} from '@mui/material';
import {type Components, type Palette, type PaletteColor} from '@mui/material/styles';

import {type ColorBase} from '@alation/fabric-types';
import {capitalize} from '@alation/util';

/**
 * Spec: https://www.figma.com/design/cHkamdvPz1IkmQSwjqWHdX/NEO---Design-System-2.0?node-id=1-5455&m=dev
 */

type ChipColor = keyof Palette;

function isObjectWithKeys(obj: unknown, keys: readonly string[]): obj is Record<string, string> {
  return typeof obj === 'object' && obj !== null && keys.every((key) => Object.keys(obj).includes(key));
}

function isPaletteColor(color: unknown): color is PaletteColor {
  return isObjectWithKeys(color, ['light', 'main', 'dark', 'contrastText']);
}

function isColorBase(color: unknown): color is ColorBase {
  return isObjectWithKeys(color, [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700',
  ]);
}

const getFilledLightChipStyles = (color: ChipColor, theme: Theme) => {
  return isPaletteColor(theme.palette[color])
    ? {
        backgroundColor: theme.palette[color][theme.palette.mode],
        '& .MuiChip-avatar': {
          backgroundColor: theme.palette[color].main,
          color: theme.palette.common.white,
        },
        '& .MuiChip-icon, & .MuiChip-label': {
          color: theme.palette[color][theme.palette.mode === 'dark' ? 'light' : 'dark'],
        },
        '& .MuiChip-deleteIcon': {
          color: theme.palette[color].main,
          '&:hover': {
            color: theme.palette[color].dark,
          },
        },
        '&.Mui-focusVisible': {
          ...theme.outlineStyleMixin({outlineColor: theme.palette[color].dark, outlineOffset: '0.2rem'}),
        },
      }
    : isColorBase(theme.palette[color])
      ? {
          backgroundColor: theme.palette[color][theme.palette.mode === 'dark' ? '800' : '200'],
          color: theme.palette[color][theme.palette.mode === 'dark' ? '200' : '800'],
        }
      : {};
};

const getFilledChipStyles = (color: ChipColor, theme: Theme) => {
  return isPaletteColor(theme.palette[color])
    ? {
        backgroundColor: theme.palette[color].main,
        color: theme.palette[color].contrastText,
        '& .MuiChip-avatar': {
          backgroundColor:
            color === 'warning'
              ? theme.palette.background.lighten50
              : theme.palette[color][theme.palette.mode === 'dark' ? 'light' : 'dark'],
          color: theme.palette[color].contrastText,
        },
        '& .MuiChip-icon': {
          color: theme.palette[color].contrastText,
        },
        '& .MuiChip-deleteIcon': {
          color: theme.palette[color][theme.palette.mode],
          '&:hover': {
            color: theme.palette.common.white,
          },
        },
        '&.Mui-focusVisible': {
          ...theme.outlineStyleMixin({outlineColor: theme.palette[color].dark, outlineOffset: '0.2rem'}),
        },
      }
    : isColorBase(theme.palette[color])
      ? {
          backgroundColor: theme.palette[color][theme.palette.mode === 'dark' ? '400' : '600'],
          color: theme.palette[color][theme.palette.mode === 'dark' ? '900' : '50'],
        }
      : {};
};

const getDisabledStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey.A400 : theme.palette.grey[400],
  opacity: 1,
  '& .MuiChip-avatar': {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.common.white,
  },
  '& .MuiChip-icon': {
    color: theme.palette.grey[600],
  },
  '& .MuiChip-label': {
    color: theme.palette.text.disabled,
  },
  '& .MuiChip-deleteIcon': {
    color: theme.palette.mode === 'dark' ? theme.palette.background.darken70 : theme.palette.background.lighten70,
  },
});

export const muiChipOverrides: Components<Theme> = {
  MuiChip: {
    defaultProps: {
      clickable: true,
    },

    styleOverrides: {
      root: ({ownerState, theme}) => ({
        lineHeight: 'normal',
        '&:not(.MuiChip-clickable)': {
          pointerEvents: 'none',
        },
        '&.MuiChip-filledLight': {
          [`&.MuiChip-color${capitalize(ownerState.color as string)}`]: {
            ...getFilledLightChipStyles(ownerState.color as ChipColor, theme),
          },
          '&.Mui-disabled': {
            ...getDisabledStyles(theme),
          },
          '&.MuiChip-filledLight.MuiChip-colorGradient': {
            position: 'relative',
            // creates a pseudo element to create a gradient background for border
            '&:before': {
              // match the border radius of the chip
              borderRadius: theme.borderRadiusToRem(16),
              // fill the chip
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              content: '""',
              background: theme.palette.background.gradientOutline,
              display: 'inline-block',
            },
            '&:after': {
              background: theme.palette.background.paper,
              borderRadius: theme.borderRadiusToRem(16),
              position: 'absolute',
              top: 1,
              left: 1,
              right: 1,
              bottom: 1,
              content: '""',
              display: 'inline-block',
            },
            '&:hover:after': {
              background: theme.palette.background.gradient,
            },

            '&.Mui-focusVisible': {
              ...theme.outlineStyleMixin({outlineColor: theme.palette.grey[800], outlineOffset: '0.2rem'}),
              '&:after': {
                background: `linear-gradient(65deg, rgba(143, 123, 172, 0.08) 15.75%, rgba(130, 195, 255, 0.08) 50%, rgba(253, 166, 0, 0.08) 84.25%), ${theme.palette.background.paper}`,
              },
            },
            [`&.Mui-disabled .${chipClasses.label}`]: {
              color: darken(theme.palette.text.primary, 0.2),
            },
            [`& .${chipClasses.icon}, & .${chipClasses.label}, & .${chipClasses.avatar}`]: {
              zIndex: 1,
            },
            [`& .${chipClasses.avatar}`]: {
              color: theme.palette.common.white,
            },
          },
        },
        variants: [
          {
            props: {size: 'xsmall'},
            style: {
              height: '2rem',
              '& .MuiChip-label.MuiChip-labelXsmall': {
                padding: theme.spacing(0, 1), // 0, 8px
                fontSize: theme.typography.caption.fontSize, // 11px
              },
            },
          },
        ],
      }),
      filled: ({ownerState, theme}) => ({
        [`&.MuiChip-color${capitalize(ownerState.color as string)}`]: {
          ...getFilledChipStyles(ownerState.color as ChipColor, theme),
        },
        '&.MuiChip-colorDefault': {
          backgroundColor: theme.palette.background.darken10,
          '& .MuiChip-avatar': {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 700],
            color: theme.palette.common.white,
          },
          '& .MuiChip-icon, & .MuiChip-label': {
            color: theme.palette.text.primary,
          },
          '&.MuiChip-deleteIcon': {
            color: theme.palette.grey[600],
            '&:hover': {
              color: theme.palette.grey[700],
            },
          },
          '&:hover': {
            backgroundColor: theme.palette.grey[500],
          },
          '&.Mui-focusVisible': {
            ...theme.outlineStyleMixin({outlineColor: theme.palette.grey[800], outlineOffset: '0.2rem'}),
          },
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.lighten10,
          }),
        },
        '&.Mui-disabled': {
          ...getDisabledStyles(theme),
        },
      }),
      labelMedium: ({theme}) => ({
        padding: theme.spacing(0, 1),
      }),
      labelSmall: ({theme}) => ({
        padding: theme.spacing(0, 1),
      }),
      sizeMedium: ({theme}) => ({
        padding: theme.spacing(0.375),
        height: '2.8rem',
      }),
      sizeSmall: ({theme}) => ({
        padding: theme.spacing(0.25, 0.375),
        height: '2.4rem',
      }),
      avatar: ({theme}) => ({
        fontSize: theme.typography.body2.fontSize,
        margin: 0,
      }),
      avatarMedium: ({theme}) => ({
        '& .MuiSvgIcon-root': {
          height: '1em',
          width: '1em',
          fontSize: theme.typography.iconSmall.fontSize,
        },
      }),
      avatarSmall: {
        fontSize: '0.8rem',
      },
      deleteIconMedium: ({theme}) => ({
        fontSize: theme.typography.iconMedium.fontSize,
        margin: theme.spacing(0, 0.25),
      }),
      deleteIconSmall: ({theme}) => ({
        margin: theme.spacing(0, 0.125),
      }),
      icon: ({theme}) => ({
        fontSize: theme.typography.iconSmall.fontSize,
      }),
      iconMedium: ({theme}) => ({
        margin: theme.spacing(0, -0.25, 0, 1),
      }),
      iconSmall: ({theme}) => ({
        margin: theme.spacing(0, -0.25, 0, 0.75),
      }),
    },
  },
};
