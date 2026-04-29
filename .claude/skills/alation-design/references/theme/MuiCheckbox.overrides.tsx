import {SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {CheckboxIcon, CheckboxIndeterminateIcon, CheckboxOutlineBlankIcon} from '@alation/icons-neo';

/**
 * Spec: https://www.figma.com/file/hpCXXKmFnH53j0koyBb7Nn/Design-System?node-id=926%3A54201
 */

export const muiCheckboxOverrides: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      checkedIcon: <SvgIcon component={CheckboxIcon} />,
      classes: {root: 'medium'},
      disableFocusRipple: true,
      disableRipple: true,
      icon: <SvgIcon component={CheckboxOutlineBlankIcon} />,
      indeterminateIcon: <SvgIcon component={CheckboxIndeterminateIcon} />,
      size: 'medium',
    },
    styleOverrides: {
      root: ({theme}) => ({
        padding: theme.spacing(1),
        '&.small': {
          padding: theme.spacing(0.75, 1),
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
          '& + .MuiFormControlLabel-label': {
            '&.Mui-disabled': {
              color: theme.palette.text.primary,
            },
          },
        },
        '&.Mui-focusVisible': {
          '& .MuiSvgIcon-root': {
            ...theme.outlineStyleMixin({outlineColor: theme.palette.grey[800], outlineOffset: 0}),
            borderRadius: '0.5rem',
          },
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              outlineColor: theme.palette.blue[900],
            },
          },
        },
        '& .MuiSvgIcon-fontSizeSmall': {
          fontSize: '1.6rem',
        },
      }),
    },
  },
};
