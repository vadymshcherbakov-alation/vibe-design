import type {Components, Theme} from '@mui/material/styles';

const tabsContainerOverride = (orientation: 'vertical' | 'horizontal') => ({
  '& button': {
    '&.MuiTab-root': {
      '&:not(:focus-visible)': {
        borderRightWidth: orientation === 'vertical' ? '0.2rem' : 0,
        borderBottomWidth: orientation === 'vertical' ? 0 : '0.2rem',
      },
      minHeight: '4.8rem',
    },
  },
});

export const muiTabsOverrides: Components<Theme> = {
  MuiTab: {
    defaultProps: {
      disableRipple: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({theme}) => ({
        ...theme.typography.body1,
        '&:hover, &:focus-visible': {
          backgroundColor: theme.palette.background.darken10,
        },
        '& .MuiSvgIcon-root': {
          fontSize: theme.typography.iconSmall.fontSize,
        },
        '.MuiTab-status': {
          borderRadius: theme.borderRadiusToRem(12),
          height: '2rem',
          lineHeight: 'normal',
          padding: theme.spacing(0.25, 1),
          backgroundColor: theme.palette.grey[400],
        },
        '&.Mui-selected': {
          ...theme.typography.subtitle2,
          color: theme.palette.text.primary,
          '.MuiTab-status': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.dark,
          },
        },
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: () => tabsContainerOverride('horizontal'),
      flexContainerVertical: () => tabsContainerOverride('vertical'),
      scrollButtons: ({theme}) => ({
        color: theme.palette.grey[700],
        '&:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
      }),
    },
  },
};
