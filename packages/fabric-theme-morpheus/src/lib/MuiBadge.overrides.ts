import type {Components, Theme} from '@mui/material/styles';

export const muiBadgeOverrides: Components<Theme> = {
  MuiBadge: {
    styleOverrides: {
      badge: ({theme}) => ({
        outline: `${theme.borderRadiusToRem(2)} solid ${theme.palette.background.default}`,
      }),
      standard: ({theme}) => ({
        ...theme.typography.body2,
        lineHeight: 1,
      }),
      dot: ({theme}) => ({
        borderRadius: theme.borderRadiusToRem(5),
      }),
    },
  },
};
