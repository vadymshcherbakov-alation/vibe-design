import type {Components, Theme} from '@mui/material/styles';

/**
 * Spec: https://www.figma.com/file/KOwS8lv2lJjRUGDduXuR9v/%5BWIP%5D-NEO-Fabric-Design-System?node-id=44%3A5131
 */

export const muiAccordionOverrides: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
      elevation: 0,
      variant: 'outlined',
    },
    styleOverrides: {
      root: ({theme}) => ({
        borderColor: theme.palette.grey[500],
        '&:before': {
          display: 'none',
        },
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&.MuiPaper-elevation': {
          border: `0.1rem solid ${theme.palette.grey[500]}`,
          '&.Mui-expanded, &:last-child': {
            '& .MuiAccordionSummary-root': {
              boxShadow: theme.shadows[1],
            },
          },
        },
        '& .MuiAccordionDetails-root': {
          padding: theme.spacing(2),
        },
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
          '& .MuiAccordionSummary-expandIconWrapper, .MuiTypography-root': {
            color: theme.palette.text.disabled,
          },
        },
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({theme}) => ({
        borderTop: `0.1rem solid ${theme.palette.grey[500]}`,
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({theme}) => ({
        '&.Mui-focusVisible, &:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
        '&:not(.Mui-expanded)': {
          borderRadius: 'inherit',
        },
        '& .MuiAccordionSummary-headerContent, & .MuiAccordionSummary-blurbContent': {
          alignItems: 'center',
          display: 'flex',
          marginRight: theme.spacing(1),
          overflow: 'hidden',
          '& > *:first-of-type': {
            marginRight: theme.spacing(1),
          },
          '& .MuiSvgIcon-root': {
            fontSize: theme.typography.iconSmall.fontSize,
          },
        },
        '& .MuiAccordionSummary-headerContent': {
          flexShrink: 0,
          width: '100%',
          '& .MuiFormControlLabel-root': {
            marginLeft: theme.spacing(-1),
            '& .MuiCheckbox-root': {
              padding: theme.spacing(0, 1, 0, 0),
            },
          },
          '&:not(:last-child)': {
            width: '45%',
          },
        },
        '& .MuiAccordionSummary-blurbContent': {
          color: theme.palette.text.secondary,
        },
        '& .MuiAccordionSummary-actionContent': {
          display: 'flex',
          flexDirection: 'row-reverse',
          flexGrow: 1,
          marginRight: theme.spacing(2),
        },
      }),
      expandIconWrapper: ({theme}) => ({
        color: theme.palette.text.secondary,
        fontSize: theme.typography.iconLarge.fontSize,
      }),
      content: {
        alignItems: 'center',
        overflow: 'hidden',
      },
    },
  },
};
