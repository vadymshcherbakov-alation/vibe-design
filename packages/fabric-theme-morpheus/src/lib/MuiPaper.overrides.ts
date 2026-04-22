import type {Components, Theme} from '@mui/material/styles';

export const muiPaperOverrides: Components<Theme> = {
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ownerState, theme}) => {
        const isGradient = ownerState.variant === 'gradient';
        const isGradientOutline = ownerState.variant === 'gradientOutlined';
        const borderWidth = ownerState.gradientborderwidth ?? 1;
        const borderRadius = ownerState.square ? 0 : theme.shape.borderRadius;

        const gradientStyles =
          isGradient || isGradientOutline
            ? {
                position: 'relative',
                overflow: 'hidden',
                zIndex: 0,
                padding: 1, // to ensure the border is visible
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                  borderRadius,
                  background: theme.palette.background.gradientOutline,
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: borderWidth,
                  left: borderWidth,
                  right: borderWidth,
                  bottom: borderWidth,
                  zIndex: -1,
                  borderRadius,
                  background: isGradientOutline ? theme.palette.background.paper : theme.palette.background.gradient,
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
                ...(ownerState.elevation && {
                  boxShadow: theme.shadows[ownerState.elevation],
                }),
              }
            : {};

        return {
          backgroundImage: 'none',
          '&.MuiPopover-paper': {
            borderStyle: 'solid',
            borderWidth: '0.1rem',
          },
          ...gradientStyles,
        };
      },
      rounded: ({theme}) => ({borderRadius: theme.shape.borderRadius}),
    },
  },
};

export const muiPaperShellOverrides: Components<Theme> = {
  MuiPaper: {
    ...muiPaperOverrides.MuiPaper,
    styleOverrides: {
      root: ({theme}) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
};

export const muiPaperSidePanelOverrides: Components<Theme> = {
  MuiPaper: {
    ...muiPaperOverrides.MuiPaper,
    styleOverrides: {
      root: ({theme}) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
};
