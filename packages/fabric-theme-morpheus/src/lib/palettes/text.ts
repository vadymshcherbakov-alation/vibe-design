import {Palette} from '@mui/material/styles';

import {darkGrey, grey} from './grey';

export const text = {
  primary: grey[900],
  secondary: grey[800],
  disabled: grey[600],
} satisfies Palette['text'];

export const textShell = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  disabled: '#B7B7C1',
} satisfies Palette['text'];

export const textDark = {
  primary: darkGrey[900],
  secondary: darkGrey[700],
  disabled: darkGrey[600],
} satisfies Palette['text'];
