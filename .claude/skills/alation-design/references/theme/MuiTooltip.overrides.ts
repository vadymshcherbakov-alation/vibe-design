import {type Components, Theme} from '@mui/material/styles';

// NOTE: This is cloned from class and has yet to be fully morpheus themed
export const muiTooltipOverrides: Components<Theme> = {
  MuiTooltip: {
    defaultProps: {
      arrow: true,
      placement: 'top',
    },
    styleOverrides: {
      popper: {
        opacity: 0.8,
        '&.MuiTooltip-popper-breakAll .MuiTooltip-tooltip': {
          wordBreak: 'break-all',
        },
      },
      tooltip: ({theme}) => ({
        backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 400 : 900],
      }),
      arrow: ({theme}) => ({
        color: theme.palette.grey[theme.palette.mode === 'dark' ? 400 : 900],
      }),
    },
  },
};
