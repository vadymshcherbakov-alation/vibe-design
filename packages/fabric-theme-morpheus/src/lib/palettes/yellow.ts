import type {Palette, SimplePaletteColorOptions} from '@mui/material/styles';

import {darkGrey} from './grey';
import {text} from './text';

export const yellow: Palette['yellow'] = {
  50: '#FFFDEF',
  100: '#FFF6DA',
  200: '#FFEEBB',
  300: '#FDE088',
  400: '#F4CB3B',
  500: '#E5AA00',
  600: '#B77600',
  700: '#B05F00',
  800: '#924A00',
  900: '#703B00',
  A100: '#FFFDEF',
  A200: '#FFF6DA',
  A400: '#FFEEBB',
  A700: '#FDE088',
};

export const simpleYellow: SimplePaletteColorOptions = {
  light: yellow[100],
  main: yellow[400],
  dark: yellow[700],
  contrastText: text.primary,
};

export const simpleYellowDark: SimplePaletteColorOptions = {
  light: yellow[800],
  main: yellow[400],
  dark: yellow[100],
  contrastText: darkGrey[100],
};
