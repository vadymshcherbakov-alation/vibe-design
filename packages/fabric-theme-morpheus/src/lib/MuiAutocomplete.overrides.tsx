import {autocompleteClasses, filledInputClasses, SvgIcon} from '@mui/material';
import type {Components, Theme} from '@mui/material';

import {SearchIcon} from '@alation/icons-neo';
import {getShellAppBarInputColor} from '@alation/util';

const expandedStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[100],
  border: `solid ${theme.palette.grey[500]}`,
  borderRadius: `${theme.borderRadiusToRem(6)}`,
  color: theme.palette.mode === 'dark' ? undefined : theme.palette.grey[800],
  '& .autocompleteAdornment.MuiButtonBase-root': {
    color: theme.palette.grey[800],
  },
  '& ::placeholder': {
    color: theme.palette.mode === 'dark' ? undefined : theme.palette.text.disabled,
    opacity: 1,
  },
});

const commonOverrides = {
  borderRadius: '0.6rem',
  '& .MuiFilledInput-root.MuiInputBase-sizeSmall': {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
};

export const muiAutocompleteOverrides = {
  MuiAutocomplete: {
    styleOverrides: {
      root: ({theme}) => ({
        ...commonOverrides,
        '& .MuiInputBase-root': {
          '&.MuiFilledInput-root, &.MuiFilledInput-root:hover, &.MuiFilledInput-root.Mui-expanded ':
            expandedStyles(theme),
        },
        '& .MuiIconButton-root.autocompleteAdornment': {
          color: 'text.primary',
        },
        '.MuiOutlinedInput-root': {
          '.MuiAutocomplete-input': {
            padding: '0',
          },
        },
      }),
      listbox: ({theme}) => ({
        '& .MuiAutocomplete-option': {
          '&[aria-selected="true"]': {
            backgroundColor: 'transparent',
          },
          '&:hover, &.Mui-focusVisible, &.Mui-focused': {
            backgroundColor: theme.palette.background.darken10,
          },
        },
      }),
    },
  },
} satisfies Components<Theme>;

export const muiAutocompleteShellOverrides = {
  MuiAutocomplete: {
    defaultProps: {
      popupIcon: <SvgIcon component={SearchIcon} />,
    },
    styleOverrides: {
      root: ({theme}) => ({
        ...commonOverrides,
        backgroundColor: getShellAppBarInputColor(theme.palette.background.default),
        '& .MuiInputBase-root.MuiFilledInput-root': {
          background: 'transparent',
          color: theme.palette.text.primary,
          borderRadius: `${theme.borderRadiusToRem(6)}`,
          border: `0.05rem solid ${theme.palette.background.lighten30}`,
          '& ::placeholder': {
            color: theme.palette.text.primary,
            opacity: 0.72,
          },
          [`& .${filledInputClasses.input}.${filledInputClasses.disabled}, & .${filledInputClasses.input}.${filledInputClasses.disabled}::placeholder`]:
            {
              color: theme.palette.text.primary, // All non-webkit browsers
              WebkitTextFillColor: theme.palette.text.primary, // webkit specific
              opacity: 0.75,
            },
        },
        [`&.${autocompleteClasses.expanded}`]: {
          '& .MuiFilledInput-root': expandedStyles(theme),
        },
        '& .MuiButtonBase-root.MuiIconButton-root.MuiAutocomplete-popupIndicator': {
          transform: 'none',
        },
        [`&:not(.${autocompleteClasses.expanded})`]: {
          '& .autocompleteAdornment.MuiButtonBase-root:hover': {
            color: theme.palette.text.primary,
          },
          '& .MuiButtonBase-root:not(:hover)': {
            color: theme.palette.text.primary,
          },
        },
      }),
    },
  },
} satisfies Components<Theme>;
