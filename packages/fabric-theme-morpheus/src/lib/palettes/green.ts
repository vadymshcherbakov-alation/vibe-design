import type {Palette, SimplePaletteColorOptions} from '@mui/material/styles';

import {textShell} from './text';

export const green: Palette['green'] = {
  50: '#FCFDFB',
  100: '#F0F8EB',
  200: '#E2F3D5',
  300: '#CBEAB2',
  400: '#ACD987',
  500: '#81BE40',
  600: '#488800',
  700: '#277800',
  800: '#125C00',
  900: '#0D4100',
  A100: '#F0F8EB',
  A200: '#E2F3D5',
  A400: '#ACD987',
  A700: '#277800',
};

export const simpleGreen: SimplePaletteColorOptions = {
  light: green[100],
  main: green[600],
  dark: green[700],
  contrastText: textShell.primary,
};

export const simpleGreenDark: SimplePaletteColorOptions = {
  light: green[800],
  main: green[600],
  dark: green[100],
  contrastText: textShell.primary,
};
