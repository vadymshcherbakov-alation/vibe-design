import '@fontsource/inter/400.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/600-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import type {Components, Theme, ThemeOptions} from '@mui/material/styles';

export const muiTypographyOverrides: Components<Theme> = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        body0: 'p',
        body1: 'p',
        body2: 'p',
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        hero: 'h1',
        heroLg: 'h1',
        heroXl: 'h1',
        inherit: 'p',
        machineBody0: 'p',
        machineBody1: 'p',
        machineBody2: 'p',
        machineH1: 'h1',
        machineH2: 'h2',
        machineH3: 'h3',
        machineH4: 'h4',
        machineH5: 'h5',
        machineH6: 'h6',
        machineHero: 'h1',
        machineOverline: 'p',
        machineSubtitle1: 'h6',
        machineSubtitle2: 'h6',
        subtitle1: 'h6',
        subtitle2: 'h6',
      },
    },
    styleOverrides: {
      root: ({theme}) => ({
        '.MuiTypography-machine': {
          fontSize: 'inherit',
          fontWeight: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
        },
        '.MuiInput-root': {
          fontSize: 'inherit',
          fontWeight: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
        },
        '&.MuiTypography-h2.MuiTypography-gutterBottom, &.MuiTypography-h3.MuiTypography-gutterBottom': {
          marginBottom: theme.spacing(1),
        },
        '&.MuiTypography-machineBody0, &.MuiTypography-machineBody1, &.MuiTypography-machineBody2': {
          'strong, b': {
            fontWeight: 500,
          },
        },
      }),
      body1: ({theme}) => ({
        '&.MuiTypography-gutterBottom': {
          marginBottom: theme.spacing(1),
        },
        strong: {
          fontWeight: 600,
        },
      }),
      body2: ({theme}) => ({
        '&.MuiTypography-gutterBottom': {
          marginBottom: theme.spacing(1),
        },
        strong: {
          fontWeight: 500,
        },
      }),
      heroXl: ({theme}) => ({
        '&.MuiTypography-gutterBottom': {
          marginBottom: theme.spacing(4),
        },
      }),
    },
  },
};

const machineFontFamily = '"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace';

// eslint-disable-next-line functional/prefer-readonly-type
export const muiTypographyThemeOptions: {typography: ThemeOptions['typography']} = {
  typography: {
    htmlFontSize: 10,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif, "Open Sans", "Lucida Grande", "Segoe UI", Arial',
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    hero: {
      fontSize: '2.6rem',
      fontWeight: 600,
      lineHeight: 1.3846153846,
      letterSpacing: '-0.05rem',
    },
    heroLg: {
      fontSize: '4rem',
      fontWeight: 600,
      lineHeight: 1.3846153846,
      letterSpacing: '-0.05rem',
    },
    heroXl: {
      fontSize: '5rem',
      fontWeight: 600,
      lineHeight: 1.3846153846,
      letterSpacing: '-0.1rem',
    },
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
      lineHeight: 1.4545454545,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
      lineHeight: 1.3333333333,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 500,
      lineHeight: 1.4285714286,
    },
    h5: {
      fontSize: '1.2rem',
      lineHeight: 1.333333333,
      fontWeight: 500,
    },
    //Designers DNU H5-H6
    h6: {
      // Used by MuiListSubHeader
      fontSize: '1.2rem',
      fontWeight: 500,
      lineHeight: 1.3333333333,
    },
    overline: {
      fontSize: '1.2rem',
      lineHeight: 1.3333333333,
      fontWeight: 500,
      letterSpacing: '0.03rem',
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontSize: '1.4rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '1.3rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body0: {
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1.3rem',
      fontWeight: 400,
      lineHeight: 1.5384615385,
    },
    body2: {
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: 1.3333333333,
    },
    buttonSm: {
      fontSize: '1.3rem',
      lineHeight: 1.2307692308,
      textTransform: 'none',
      fontWeight: 500,
    },
    button: {
      fontSize: '1.3rem',
      lineHeight: 1.5384615385,
      textTransform: 'none',
      fontWeight: 500,
    },
    buttonLg: {
      fontSize: '1.6rem',
      lineHeight: 1.5,
      textTransform: 'none',
      fontWeight: 500,
    },

    machineHero: {
      fontFamily: machineFontFamily,
      fontSize: '2.6rem',
      fontWeight: 600,
      lineHeight: 1.2857142857,
      letterSpacing: '-0.07rem',
    },
    machineH1: {
      fontFamily: machineFontFamily,
      fontSize: '2.2rem',
      fontWeight: 600,
      lineHeight: 1.3333333333,
      letterSpacing: '-0.05rem',
    },
    machineH2: {
      fontFamily: machineFontFamily,
      fontSize: '1.7rem',
      fontWeight: 500,
      lineHeight: 1.4736842105,
      letterSpacing: '-0.05rem',
    },
    machineH3: {
      fontFamily: machineFontFamily,
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: 1.4117647059,
      letterSpacing: '-0.04rem',
    },

    machineH4: {
      fontFamily: machineFontFamily,
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.3333333333,
      letterSpacing: '-0.04rem',
    },
    machineH5: {
      fontFamily: machineFontFamily,
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: 1.2307692308,
      letterSpacing: '-0.04rem',
    },
    machineH6: {
      fontFamily: machineFontFamily,
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.2307692308,
      letterSpacing: '-0.04rem',
    },
    machineOverline: {
      fontFamily: machineFontFamily,
      fontSize: '1.1rem',
      fontWeight: 400,
      letterSpacing: '0.025rem',
      lineHeight: 1.2307692308,
      textTransform: 'uppercase',
    },
    machineSubtitle1: {
      fontFamily: machineFontFamily,
      fontSize: '1.3rem',
      fontWeight: 500,
      letterSpacing: '-0.03rem',
      lineHeight: 1.3333333333,
    },
    machineSubtitle2: {
      fontFamily: machineFontFamily,
      fontSize: '1.2rem',
      fontWeight: 500,
      letterSpacing: '-0.025rem',
      lineHeight: 1.4285714286,
    },
    machineBody0: {
      fontFamily: machineFontFamily,
      fontSize: '1.3rem',
      fontWeight: 400,
      letterSpacing: '-0.025rem',
      lineHeight: 1.3333333333,
    },
    machineBody1: {
      fontFamily: machineFontFamily,
      fontSize: '1.2rem',
      fontWeight: 400,
      letterSpacing: '-0.025rem',
      lineHeight: 1.4285714286,
    },

    machineBody2: {
      fontFamily: machineFontFamily,
      fontSize: '1.1rem',
      fontWeight: 500,
      letterSpacing: '-0.025rem',
      lineHeight: 1.2307692308,
    },
    machineButtonSm: {
      fontFamily: machineFontFamily,
      fontSize: '1.2rem',
      fontWeight: 500,
      letterSpacing: '-0.025rem',
      lineHeight: 1.1428571429,
    },
    machineButton: {
      fontFamily: machineFontFamily,
      fontSize: '1.2rem',
      fontWeight: 500,
      letterSpacing: '-0.025rem',
      lineHeight: 1.4285714286,
    },
    machineButtonLg: {
      fontFamily: machineFontFamily,
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '-0.025rem',
      lineHeight: 1.4117647059,
    },
    //TODO: AL-133277 missing in design system, ask Ian what to do for caption
    caption: {
      fontWeight: 400,
      fontSize: '1.1rem',
      lineHeight: 1.45,
    },
    machineCaption: {
      fontFamily: machineFontFamily,
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.45,
    },
    iconXSmall: {
      fontSize: '1.2rem',
    },
    iconSmall: {
      fontSize: '1.6rem',
    },
    iconMedium: {
      fontSize: '2rem',
    },
    iconLarge: {
      fontSize: '2.4rem',
    },
  },
};
