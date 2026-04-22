import type {Components, CSSObject, Theme} from '@mui/material/styles';

import {muiInputOverrides} from './MuiInput.overrides';

export const muiOutlinedInputOverrides: Components<Theme> = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({theme}) => ({
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.background.darken10,
        },
      }),
      notchedOutline: (props) => {
        return {
          border: (muiInputOverrides?.MuiInput?.styleOverrides?.root as (p: {theme: Theme}) => CSSObject)(props)
            ?.border,
          borderRadius: props.theme.borderRadiusToRem(6),
        };
      },
    },
  },
};
