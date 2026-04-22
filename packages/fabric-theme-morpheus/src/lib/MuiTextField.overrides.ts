import type {Components, Theme} from '@mui/material/styles';

export const muiTextFieldOverrides: Components<Theme> = {
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
    styleOverrides: {
      root: ({theme}) => ({
        '& .MuiInputBase-root': {
          border: 0,
          padding: theme.spacing(1.0875),
          '& > input': {
            padding: 0,
            margin: 0,
          },
          '& ..MuiInputOutlined-root': {
            borderColor: 'yellow',
          },
        },
        '& .MuiInputBase-sizeSmall': {
          padding: theme.spacing(0.585),
          ...theme.typography.body1,
          lineHeight: 1.4375,
        },
      }),
    },
  },
};
