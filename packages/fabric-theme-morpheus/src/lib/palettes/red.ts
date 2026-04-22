import type {Palette, SimplePaletteColorOptions} from '@mui/material/styles';

import {textShell} from './text';

export const red: Palette['red'] = {
  50: '#FEFBFB',
  100: '#FFF0F0',
  200: '#FFE1E1',
  300: '#FFC9CB',
  400: '#FFA8AC',
  500: '#FF7781',
  600: '#CA334A',
  700: '#C3002E',
  800: '#9B001B',
  900: '#6F0012',
  A100: '#FDE7ED',
  A200: '#FFE1E1',
  A400: '#FFA8AC',
  A700: '#951838',
};

export const simpleRed: SimplePaletteColorOptions = {
  light: red[100],
  main: red[600],
  dark: red[700],
  contrastText: textShell.primary,
};

export const simpleRedDark: SimplePaletteColorOptions = {
  light: red[800],
  main: red[600],
  dark: red[100],
  contrastText: textShell.primary,
};
