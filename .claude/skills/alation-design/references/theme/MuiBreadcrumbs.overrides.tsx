import {SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {ChevronRightIcon} from '@alation/icons-neo';

export const muiBreadcrumbsOverrides: Components<Theme> = {
  MuiBreadcrumbs: {
    defaultProps: {
      separator: <SvgIcon component={ChevronRightIcon} />,
    },
    styleOverrides: {
      li: ({theme}) => ({
        '& > *': {
          color: theme.palette.text.secondary,
          textDecoration: 'none',
        },
        '.MuiTypography-root': {
          display: 'flex',
          alignItems: 'center',
          '.MuiSvgIcon-root': {
            marginRight: theme.spacing(0.75),
          },
        },
        a: {
          cursor: 'pointer',
          display: 'inline-block', // Need for showing focus on anchor links wrapping Typography
          borderRadius: theme.shape.borderRadius, // Defines shape of outline on focus
        },
        '&:last-child *': {
          color: theme.palette.text.primary,
        },
        '*:focus-visible': {
          ...theme.outlineStyleMixin(),
        },
        '& .MuiIconButton-root': {
          '&.ellipsis-item': {
            '&[aria-expanded="true"]': {
              backgroundColor: theme.palette.grey[500],
            },
            borderRadius: theme.spacing(0.3),
            height: '2.4rem',
            padding: theme.spacing(0.5, 0),
            width: '1.6rem',
          },
        },
      }),
    },
  },
};
