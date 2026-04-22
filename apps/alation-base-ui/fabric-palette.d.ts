// Declares custom MUI Palette properties used by @alation/fabric-theme-morpheus.
// These mirror the augmentations in @alation/fabric-types to give full TypeScript support.
// The `export {}` makes this a module file so `declare module` blocks are augmentations, not replacements.
export {};

interface FabricColorBase {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
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

declare module "@mui/material/styles" {
  interface Palette {
    readonly blue: FabricColorBase;
    readonly cyan: FabricColorBase;
    readonly emerald: FabricColorBase;
    readonly orange: FabricColorBase;
    readonly violet: FabricColorBase;
    readonly purple: FabricColorBase;
    readonly teal: FabricColorBase;
    readonly pink: FabricColorBase;
    readonly neutral: FabricColorBase;
    readonly green: FabricColorBase;
    readonly amber: FabricColorBase;
    readonly yellow: FabricColorBase;
    readonly red: FabricColorBase;
  }
  interface PaletteOptions {
    readonly blue?: FabricColorBase;
    readonly cyan?: FabricColorBase;
    readonly emerald?: FabricColorBase;
    readonly orange?: FabricColorBase;
    readonly violet?: FabricColorBase;
    readonly purple?: FabricColorBase;
    readonly teal?: FabricColorBase;
    readonly pink?: FabricColorBase;
    readonly neutral?: FabricColorBase;
    readonly green?: FabricColorBase;
    readonly amber?: FabricColorBase;
    readonly yellow?: FabricColorBase;
    readonly red?: FabricColorBase;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    readonly body0: true;
    readonly code: true;
    readonly codeStrong: true;
    readonly machineBody0: true;
    readonly machineBody1: true;
    readonly machineBody2: true;
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
    readonly machineButton: true;
    readonly machineButtonLg: true;
    readonly machineButtonSm: true;
    readonly machineCaption: true;
    readonly hero: true;
    readonly heroLg: true;
    readonly heroXl: true;
    readonly buttonLg: true;
    readonly buttonSm: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "text" | "contained" | "outlined";
  }
}
