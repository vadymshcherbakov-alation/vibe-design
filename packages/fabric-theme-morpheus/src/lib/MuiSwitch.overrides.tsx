import {SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {CheckThickIcon, TimesIcon} from '@alation/icons-neo';

enum State {
  Default,
  Hover,
  Disabled,
}

const getColor = (theme: Theme, isChecked = true, state = State.Default): string => {
  if (isChecked) {
    if (state === State.Disabled) {
      return theme.palette.blue[200];
    }
    if (state === State.Hover) {
      return theme.palette.blue[900];
    }
    return theme.palette.blue[600];
  }
  if (state === State.Disabled) {
    return theme.palette.grey[400];
  }
  if (state === State.Hover) {
    return theme.palette.grey[800];
  }
  return theme.palette.grey[700];
};

export const getSwitchThumbStyles = (theme: Theme, isChecked = true, state = State.Hover) => ({
  backgroundColor: theme.palette.background.default,
  color: getColor(theme, isChecked, state),
});

export const getSwitchTrackStyles = (theme: Theme, isChecked = true, state = State.Hover) => ({
  opacity: 1,
  backgroundColor: getColor(theme, isChecked, state),
});

export const muiSwitchOverrides: Components<Theme> = {
  MuiSwitch: {
    defaultProps: {
      disableFocusRipple: true,
      disableRipple: true,
      checkedIcon: <SvgIcon component={CheckThickIcon} />,
      icon: <SvgIcon component={TimesIcon} />,
    },
    styleOverrides: {
      root: {
        padding: 0,
        width: '3.6rem',
        height: '2rem',
        borderRadius: '1rem',
        '& .MuiSvgIcon-root': {
          fontSize: '1.2rem',
        },
      },
      switchBase: ({theme}) => ({
        backgroundColor: theme.palette.background.default,
        color: getColor(theme, false, State.Default),
        '& + .MuiSwitch-track': {
          ...getSwitchTrackStyles(theme, false, State.Default),
        },
        '&:hover,&.Mui-focusVisible': {
          ...getSwitchThumbStyles(theme, false, State.Hover),
          '& + .MuiSwitch-track': {
            ...getSwitchTrackStyles(theme, false, State.Hover),
          },
        },
        '&.Mui-disabled': {
          ...getSwitchThumbStyles(theme, false, State.Disabled),
          '& + .MuiSwitch-track': {
            ...getSwitchTrackStyles(theme, false, State.Disabled),
          },
        },
        '&.Mui-checked': {
          transform: 'translateX(1.6rem)',
          '& + .MuiSwitch-track': {
            ...getSwitchTrackStyles(theme, true, State.Default),
          },
          '&:hover,&.Mui-focusVisible': {
            ...getSwitchThumbStyles(theme, true, State.Hover),
            '& + .MuiSwitch-track': {
              ...getSwitchTrackStyles(theme, true, State.Hover),
            },
          },
          '&.Mui-disabled': {
            ...getSwitchThumbStyles(theme, true, State.Disabled),
            '& + .MuiSwitch-track': {
              ...getSwitchTrackStyles(theme, true, State.Disabled),
            },
          },
        },
        width: '1.6rem',
        height: '1.6rem',
        padding: 0,
        margin: '0.2rem',
      }),
    },
  },
};
