import {type Components, Theme} from '@mui/material/styles';

import {getSwitchThumbStyles, getSwitchTrackStyles} from './MuiSwitch.overrides';

export const muiFormControlLabelOverrides: Components<Theme> = {
  MuiFormControlLabel: {
    styleOverrides: {
      root: ({theme}) => ({
        '&:hover': {
          // Overriding styles for wrapped switch component on hover
          '.MuiSwitch-switchBase': {
            '&:not(.Mui-disabled)': {
              ...getSwitchThumbStyles(theme, false),
              '& + .MuiSwitch-track': {
                ...getSwitchTrackStyles(theme, false),
              },
              '&.Mui-checked': {
                ...getSwitchThumbStyles(theme),
                '& + .MuiSwitch-track': {
                  ...getSwitchTrackStyles(theme),
                },
              },
            },
          },
        },
      }),
    },
  },
};
