import type {Components, Theme} from '@mui/material/styles';

export const muiSvgIconOverrides: Components<Theme> = {
  MuiSvgIcon: {
    defaultProps: {
      fontSize: 'inherit',
    },
    variants: [
      {
        props: {fontSize: 'xsmall'},
        style: ({theme}) => ({
          fontSize: theme.typography.iconXSmall.fontSize,
        }),
      },
    ],
    styleOverrides: {
      fontSizeSmall: ({theme}) => ({
        fontSize: theme.typography.iconSmall.fontSize,
      }),
      fontSizeMedium: ({theme}) => ({
        fontSize: theme.typography.iconMedium.fontSize,
      }),
      fontSizeLarge: ({theme}) => ({
        fontSize: theme.typography.iconLarge.fontSize,
      }),
    },
  },
};
