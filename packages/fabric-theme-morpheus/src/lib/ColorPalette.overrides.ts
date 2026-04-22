import type {PaletteOptions, SimplePaletteColorOptions, ThemeOptions} from '@mui/material/styles';
import {merge} from 'lodash';
import mix from 'mix-css-color';

import {amber} from './palettes/amber';
import {blue, darkBlue} from './palettes/blue';
import {brand, darkBrand} from './palettes/brand';
import {cyan} from './palettes/cyan';
import {diff} from './palettes/diff';
import {emerald} from './palettes/emerald';
import {green, simpleGreen, simpleGreenDark} from './palettes/green';
import {darkGrey, grey} from './palettes/grey';
import {lineage} from './palettes/lineage';
import {neutral} from './palettes/neutral';
import {orange} from './palettes/orange';
import {pink} from './palettes/pink';
import {purple} from './palettes/purple';
import {red, simpleRed, simpleRedDark} from './palettes/red';
import {teal} from './palettes/teal';
import {text, textDark, textShell} from './palettes/text';
import {violet} from './palettes/violet';
import {simpleYellow, simpleYellowDark, yellow} from './palettes/yellow';

const mixedBackground = mix(brand.background, '#FFFFFF', 10);

const primaryAndInfoPaletteOptions: SimplePaletteColorOptions = {
  light: blue[100],
  main: blue[600],
  dark: blue[800],
  contrastText: textShell.primary,
};

export const colorPaletteOverrides = {
  palette: {
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      darken10: 'rgba(78, 78, 88, 0.1)',
      darken20: 'rgba(78, 78, 88, 0.2)',
      darken30: 'rgba(78, 78, 88, 0.3)',
      darken50: 'rgba(78, 78, 88, 0.5)',
      darken70: 'rgba(78, 78, 88, 0.7)',
      darken100: 'rgba(78, 78, 88, 1)',
      lighten10: 'rgba(255, 255, 255, 0.1)',
      lighten20: 'rgba(255, 255, 255, 0.2)',
      lighten30: 'rgba(255, 255, 255, 0.3)',
      lighten50: 'rgba(255, 255, 255, 0.5)',
      lighten70: 'rgba(255, 255, 255, 0.7)',
      lighten90: 'rgba(255, 255, 255, 0.9)',
      lighten95: 'rgba(255, 255, 255, 0.95)',
      gradient:
        'linear-gradient(65deg, rgba(143, 123, 172, 0.08) 15.75%, rgba(130, 195, 255, 0.08) 50%, rgba(253, 166, 0, 0.08) 84.25%), #FFFFFF',
      gradientOrange: 'linear-gradient(96deg, #FFBB56 -0.55%, #FF834E 114.37%)',
      gradientOutline: 'linear-gradient(65.31deg, #8F7BAC 15.75%, #82C3FF 50%, #FDA600 84.25%)',
    },
    brand: {
      main: brand.logo,
    },
    gradient: {
      main: 'rgba(0,0,0,0)',
      dark: 'rgba(0,0,0,0)',
    },
    divider: grey[400], // Used for table border
    primary: {...primaryAndInfoPaletteOptions},
    secondary: {
      light: mixedBackground.hex,
      main: blue[900],
      dark: brand.background,
    },
    success: {...simpleGreen},
    error: {...simpleRed},
    warning: {...simpleYellow},
    info: {...primaryAndInfoPaletteOptions},
    amber,
    orange,
    blue,
    cyan,
    violet,
    grey,
    text,
    diff,
    emerald,
    lineage,
    neutral,
    purple,
    teal,
    pink,
    green,
    red,
    yellow,
  },
} satisfies {readonly palette: PaletteOptions};

export const colorPaletteOverridesDark = merge({}, colorPaletteOverrides, {
  palette: {
    mode: 'dark',
    background: {
      default: darkGrey[200],
      paper: darkGrey[200],
    },
    divider: darkGrey[400],
    primary: {
      ...primaryAndInfoPaletteOptions,
      light: darkBlue[200],
      main: darkBlue[600],
      dark: darkBlue[700],
      contrastText: darkGrey[900],
    },
    blue: {
      ...darkBlue,
    },
    grey: {
      ...darkGrey,
    },
    error: {
      ...simpleRedDark,
    },
    success: {...simpleGreenDark},
    text: {
      ...textDark,
    },
    warning: {
      ...simpleYellowDark,
    },
  },
}) satisfies {readonly palette: PaletteOptions};

export const colorPaletteShellOverrides = merge({}, colorPaletteOverrides, {
  palette: {
    background: {
      default: brand.background,
      darken10: 'rgba(0, 0, 0, 0.1)',
      darken20: 'rgba(0, 0, 0, 0.2)',
      darken30: 'rgba(0, 0, 0, 0.3)',
      darken50: 'rgba(0, 0, 0, 0.5)',
      darken70: 'rgba(0, 0, 0, 0.7)',
      darken100: 'rgba(0, 0, 0, 1)',
    },
    brand: {
      main: brand.logo,
    },
    secondary: {
      light: darkGrey[200],
      main: brand.background,
    },
    text: {
      ...textShell,
    },
  },
}) satisfies Pick<ThemeOptions, 'palette'>;

export const colorPaletteShellOverridesDark = merge({}, colorPaletteShellOverrides, {
  palette: {
    mode: 'dark',
    background: {
      default: darkBrand.background,
      paper: darkBrand.background,
      lighten10: 'rgba(227, 233, 236, .1)',
      lighten20: 'rgba(227, 233, 236, .2)',
      lighten30: 'rgba(227, 233, 236, .3)',
      lighten50: 'rgba(227, 233, 236, .5)',
      lighten70: 'rgba(227, 233, 236, .7)',
      lighten100: 'rgba(227, 233, 236, 1)',
    },
    primary: {...primaryAndInfoPaletteOptions, main: darkBlue[600]},
    secondary: {
      light: darkGrey[200],
      main: darkBrand.background,
    },
    grey: {
      ...darkGrey,
    },
    text: {
      ...textShell,
    },
  },
}) satisfies {readonly palette: PaletteOptions};

export const colorPaletteSidePanelOverrides = merge({}, colorPaletteOverrides, {
  palette: {
    background: {
      default: `color-mix(in srgb, ${brand.background} 5%, ${colorPaletteOverrides.palette.background.paper})`,
      paper: `color-mix(in srgb, ${brand.background} 5%, ${colorPaletteOverrides.palette.background.paper})`,
    },
  },
}) satisfies Pick<ThemeOptions, 'palette'>;

export const colorPaletteSidePanelOverridesDark = merge({}, colorPaletteOverridesDark, {
  palette: {
    background: {
      default: `color-mix(in srgb, ${brand.background} 5%, ${colorPaletteOverridesDark.palette.background.paper})`,
      paper: `color-mix(in srgb, ${brand.background} 5%, ${colorPaletteOverridesDark.palette.background.paper})`,
    },
  },
}) satisfies {readonly palette: PaletteOptions};
