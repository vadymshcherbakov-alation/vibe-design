import {buttonClasses, SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {fabricClasses} from '@alation/fabric-types';
import {LoadingIcon} from '@alation/icons-neo';
import type {} from '@mui/lab/themeAugmentation';

const loadingButtonClasses = {
  loadingIndicator: 'MuiLoadingButton-loadingIndicator',
  loadingIndicatorStart: 'MuiLoadingButton-loadingIndicatorStart',
  loadingIndicatorEnd: 'MuiLoadingButton-loadingIndicatorEnd',
};

export const muiLoadingButtonOverrides: Components<Theme> = {
  MuiLoadingButton: {
    defaultProps: {
      loadingPosition: 'start',
      loadingIndicator: <SvgIcon className={fabricClasses.rotate} component={LoadingIcon} />,
      disableElevation: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({theme}) => ({
        // All Sizes
        [`.${loadingButtonClasses.loadingIndicator}`]: {
          '&:first-of-type': {
            left: 0,
            position: 'static',
            marginRight: theme.spacing(1),
          },
        },
        // Large
        [`&.${buttonClasses.sizeLarge}`]: {
          [`.${loadingButtonClasses.loadingIndicator}`]: {
            fontSize: theme.typography.iconLarge.fontSize,
          },
          [`.${loadingButtonClasses.loadingIndicatorStart}`]: {
            left: '2rem',
          },
          [`.${loadingButtonClasses.loadingIndicatorEnd}`]: {
            right: '2rem',
          },
        },
        // Medium
        [`&.${buttonClasses.sizeMedium}`]: {
          [`.${loadingButtonClasses.loadingIndicator}`]: {
            fontSize: theme.typography.iconMedium.fontSize,
          },
          [`.${loadingButtonClasses.loadingIndicatorStart}`]: {
            left: '1.6rem',
          },
          [`.${loadingButtonClasses.loadingIndicatorEnd}`]: {
            right: '1.6rem',
          },
        },
        // Small
        [`&.${buttonClasses.sizeSmall}`]: {
          [`.${loadingButtonClasses.loadingIndicator}`]: {
            fontSize: theme.typography.iconSmall.fontSize,
          },
          [`.${loadingButtonClasses.loadingIndicatorStart}`]: {
            left: '1.2rem',
          },
          [`.${loadingButtonClasses.loadingIndicatorEnd}`]: {
            right: '1.2rem',
          },
        },
        // XSmall
        '&.MuiButton-sizeXsmall': {
          [`.${loadingButtonClasses.loadingIndicator}`]: {
            fontSize: theme.typography.iconXSmall.fontSize,
          },
          [`.${loadingButtonClasses.loadingIndicatorStart}`]: {
            left: '1.6rem',
          },
          [`.${loadingButtonClasses.loadingIndicatorEnd}`]: {
            right: '1.6rem',
          },
        },
      }),
    },
  },
};
