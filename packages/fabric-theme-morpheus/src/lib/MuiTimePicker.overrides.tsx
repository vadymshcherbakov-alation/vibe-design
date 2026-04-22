import {menuItemClasses, SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {ClockIcon} from '@alation/icons-neo';

import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
import {text} from './palettes/text';

export const muiTimePickerOverrides: Components<Theme> = {
  MuiTimePicker: {
    defaultProps: {
      slots: {
        openPickerIcon: (props) => <SvgIcon component={ClockIcon} htmlColor={text.primary} {...props} />,
      },
      slotProps: {
        popper: {
          sx: {
            width: '24rem',
            height: '21.2rem',
            [`.${menuItemClasses.root}`]: {
              height: '2.8rem',
            },
          },
        },
      },
    },
  },
};
