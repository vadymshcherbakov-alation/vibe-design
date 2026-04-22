/* eslint-disable functional/prefer-readonly-type */
import {SimplePaletteColorOptions} from '@mui/material/styles';
import {StandardLonghandPropertiesHyphen} from 'csstype';
import type {CSSProperties} from 'react';

export interface ColorBase {
  100: string;
  200: string;
  300: string;
  400: string;
  50: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  A100: string;
  A200: string;
  A400: string;
  A700: string;
}

export interface DiffPaletteBase {
  readonly del: string;
  readonly ins: string;
  readonly mod: string;
}

export interface LineagePaletteBase {
  readonly background: string;
  readonly backgroundSecondary: string;
  readonly deprecated: string;
  readonly deprecatedSecondary: string;
  readonly graphEdge: string;
  readonly highlighted: string;
  readonly selected: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly textSelected: string;
}

declare module '@mui/material/Button' {
  interface ButtonClasses {
    containedError: string;

    containedInfo: string;

    containedSuccess: string;

    containedWarning: string;

    outlinedError: string;

    outlinedInfo: string;

    outlinedSuccess: string;

    outlinedWarning: string;

    textError: string;

    textInfo: string;

    textSuccess: string;

    textWarning: string;
  }
}

declare module '@mui/material/styles' {
  export interface TypographyVariants {
    readonly body0: CSSProperties;
    readonly buttonLg: CSSProperties;
    readonly buttonSm: CSSProperties;
    readonly hero: CSSProperties;
    readonly heroLg: CSSProperties;
    readonly heroXl: CSSProperties;
    readonly iconLarge: CSSProperties;
    readonly iconMedium: CSSProperties;
    readonly iconSmall: CSSProperties;
    readonly iconXSmall: CSSProperties;
    readonly machineBody0: CSSProperties;
    readonly machineBody1: CSSProperties;
    readonly machineBody2: CSSProperties;
    readonly machineButton: CSSProperties;
    readonly machineButtonLg: CSSProperties;
    readonly machineButtonSm: CSSProperties;
    readonly machineCaption: CSSProperties;
    readonly machineH1: CSSProperties;
    readonly machineH2: CSSProperties;
    readonly machineH3: CSSProperties;
    readonly machineH4: CSSProperties;
    readonly machineH5: CSSProperties;
    readonly machineH6: CSSProperties;
    readonly machineHero: CSSProperties;
    readonly machineOverline: CSSProperties;
    readonly machineSubtitle1: CSSProperties;
    readonly machineSubtitle2: CSSProperties;
  }

  // allow configuration using `createTheme`
  export interface TypographyVariantsOptions {
    readonly body0?: CSSProperties;
    readonly buttonLg?: CSSProperties;
    readonly buttonSm?: CSSProperties;
    readonly hero?: CSSProperties;
    readonly heroLg?: CSSProperties;
    readonly heroXl?: CSSProperties;
    readonly iconLarge?: CSSProperties;
    readonly iconMedium?: CSSProperties;
    readonly iconSmall?: CSSProperties;
    readonly iconXSmall?: CSSProperties;
    readonly machineBody0?: CSSProperties;
    readonly machineBody1?: CSSProperties;
    readonly machineBody2?: CSSProperties;
    readonly machineButton?: CSSProperties;
    readonly machineButtonLg?: CSSProperties;
    readonly machineButtonSm?: CSSProperties;
    readonly machineCaption?: CSSProperties;
    readonly machineH1?: CSSProperties;
    readonly machineH2?: CSSProperties;
    readonly machineH3?: CSSProperties;
    readonly machineH4?: CSSProperties;
    readonly machineH5?: CSSProperties;
    readonly machineH6?: CSSProperties;
    readonly machineHero?: CSSProperties;
    readonly machineOverline?: CSSProperties;
    readonly machineSubtitle1?: CSSProperties;
    readonly machineSubtitle2?: CSSProperties;
  }

  export type DiffPalette = DiffPaletteBase;

  export type LineagePalette = LineagePaletteBase;

  export interface Palette {
    readonly blue: ColorBase;
    readonly brand: SimplePaletteColorOptions;
    readonly cyan: ColorBase;
    readonly emerald: ColorBase;
    readonly diff: DiffPalette;
    readonly gradient: SimplePaletteColorOptions;
    readonly lineage: LineagePalette;
    readonly orange: ColorBase;
    readonly violet: ColorBase;
    readonly purple: ColorBase;
    readonly teal: ColorBase;
    readonly pink: ColorBase;
    readonly neutral: ColorBase;
    readonly green: ColorBase;
    readonly amber: ColorBase;
    readonly yellow: ColorBase;
    readonly red: ColorBase;
  }

  export interface PaletteOptions {
    readonly blue: ColorBase;
    readonly brand: SimplePaletteColorOptions;
    readonly cyan: ColorBase;
    readonly emerald: ColorBase;
    readonly diff: DiffPalette;
    readonly gradient: SimplePaletteColorOptions;
    readonly lineage: LineagePalette;
    readonly orange: ColorBase;
    readonly violet: ColorBase;
    readonly purple: ColorBase;
    readonly teal: ColorBase;
    readonly pink?: ColorBase;
    readonly neutral?: ColorBase;
    readonly green?: ColorBase;
    readonly amber?: ColorBase;
    readonly yellow?: ColorBase;
    readonly red?: ColorBase;
  }

  export interface TypeBackground {
    readonly darken10: string;
    readonly darken100: string;
    readonly darken20: string;
    readonly darken30: string;
    readonly darken50: string;
    readonly darken70: string;

    default: string;
    gradient: string;
    gradientOrange: string;
    gradientOutline: string;
    readonly lighten10: string;
    readonly lighten20: string;
    readonly lighten30: string;
    readonly lighten50: string;
    readonly lighten70: string;
    readonly lighten90: string;
    readonly lighten95: string;

    paper: string;
  }
}

declare module '@mui/material/Typography' {
  export interface TypographyPropsVariantOverrides {
    readonly body0: true;
    readonly buttonLg: true;
    readonly buttonSm: true;
    readonly hero: true;
    readonly heroLg: true;
    readonly heroXl: true;
    readonly machineBody0: true;
    readonly machineBody1: true;
    readonly machineBody2: true;
    readonly machineButton: true;
    readonly machineButtonLg: true;
    readonly machineButtonSm: true;
    readonly machineCaption: true;
    readonly machineH1: true;
    readonly machineH2: true;
    readonly machineH3: true;
    readonly machineH4: true;
    readonly machineH5: true;
    readonly machineH6: true;
    readonly machineHero: true;
    readonly machineOverline: true;
    readonly machineSubtitle1: true;
    readonly machineSubtitle2: true;
  }

  export interface TypographyClasses {
    alignCenter: string;
    alignJustify: string;
    alignLeft: string;
    alignRight: string;
    body0: string;
    body1: string;
    body2: string;
    button: string;
    buttonLg: string;
    buttonSm: string;
    caption: string;
    gutterBottom: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    hero: string;
    heroLg: string;
    heroXl: string;
    inherit: string;
    machineBody0: string;
    machineBody1: string;
    machineBody2: string;
    machineButton: string;
    machineButtonLg: string;
    machineButtonSm: string;
    machineCaption: string;
    machineH1: string;
    machineH2: string;
    machineH3: string;
    machineH4: string;
    machineH5: string;
    machineH6: string;
    machineHero: string;
    machineOverline: string;
    machineSubtitle1: string;
    machineSubtitle2: string;
    noWrap: string;
    overline: string;
    paragraph: string;
    root: string;
    subtitle1: string;
    subtitle2: string;
  }
}

// module augment the 'pill' variant for MuiButton
declare module '@mui/material/Button' {
  export interface ButtonPropsVariantOverrides {
    readonly pill: true;
  }

  export interface ButtonPropsColorOverrides {
    readonly gradient: true;
  }

  export interface ButtonPropsSizeOverrides {
    readonly xsmall: true;
  }
}

declare module '@mui/material/IconButton' {
  export interface IconButtonPropsSizeOverrides {
    readonly xsmall: true;
  }
}

declare module '@mui/material/Chip' {
  export interface ChipPropsVariantOverrides {
    readonly filledLight: true;
    readonly pill: true;
  }

  export interface ChipPropsSizeOverrides {
    readonly xsmall: true;
  }

  export interface ChipPropsColorOverrides {
    readonly gradient: true;
    readonly blue: true;
    readonly cyan: true;
    readonly emerald: true;
    readonly orange: true;
    readonly violet: true;
    readonly purple: true;
    readonly teal: true;
  }
}

declare module '@mui/material/Paper' {
  export interface PaperPropsVariantOverrides {
    readonly gradient: true;
    readonly gradientOutlined: true;
  }

  interface PaperOwnProps {
    /**
     * Only works with `variant="gradient"` or `variant="gradientOutlined"`.
     */
    gradientborderwidth?: number;
  }
}

declare module '@mui/material/SvgIcon' {
  export interface SvgIconPropsColorOverrides {
    readonly brand: true;
  }

  export interface SvgIconPropsSizeOverrides {
    readonly xsmall: true;
  }
}

export interface OutlineStyles {
  readonly outlineColor: StandardLonghandPropertiesHyphen['outline-color'];
  readonly outlineOffset: StandardLonghandPropertiesHyphen['outline-offset'];
  readonly outlineStyle: StandardLonghandPropertiesHyphen['outline-style'];
  readonly outlineWidth: StandardLonghandPropertiesHyphen['outline-width'];
}

export type borderRadiusToRem = (radius: number) => string;

export type OutlineStyleMixin = (outline?: Partial<OutlineStyles>) => Partial<CSSProperties>;

declare module '@mui/material/styles' {
  export interface Theme {
    readonly borderRadiusToRem: borderRadiusToRem;
    readonly outline: OutlineStyles;
    readonly outlineStyleMixin: OutlineStyleMixin;
  }
  export interface ThemeOptions {
    readonly borderRadiusToRem: borderRadiusToRem;
    readonly outline: OutlineStyles;
    readonly outlineStyleMixin: OutlineStyleMixin;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    readonly blue: ColorBase;
    readonly brand: SimplePaletteColorOptions;
    readonly cyan: ColorBase;
    readonly emerald: ColorBase;
    readonly diff: DiffPaletteBase;
    readonly gradient: SimplePaletteColorOptions;
    readonly lineage: LineagePaletteBase;
    readonly orange: ColorBase;
    readonly violet: ColorBase;
    readonly purple: ColorBase;
    readonly teal: ColorBase;
    readonly pink: ColorBase;
    readonly neutral: ColorBase;
    readonly green: ColorBase;
    readonly amber: ColorBase;
    readonly yellow: ColorBase;
    readonly red: ColorBase;
  }
}

declare module '@mui/system/createTheme' {
  export interface Theme {
    readonly borderRadiusToRem: borderRadiusToRem;
    readonly outline: OutlineStyles;
    readonly outlineStyleMixin: OutlineStyleMixin;
  }
  export interface ThemeOptions {
    readonly borderRadiusToRem: borderRadiusToRem;
    readonly outline: OutlineStyles;
    readonly outlineStyleMixin: OutlineStyleMixin;
  }
}

// eslint-disable-next-line import/no-default-export
export default {};
export {fabricClasses} from './lib/fabricClasses';
