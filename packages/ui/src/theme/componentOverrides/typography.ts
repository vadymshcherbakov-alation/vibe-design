import { Components, Theme } from "@mui/material/styles";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    code: true;
    codeStrong: true;
    machineHero: true;
    machineH1: true;
    machineH2: true;
    machineH3: true;
    machineH4: true;
    machineH5: true;
    machineH6: true;
    machineOverline: true;
    machineSubtitle1: true;
    machineSubtitle2: true;
    machineBody0: true;
    machineBody1: true;
    machineBody2: true;
    machineButtonSm: true;
    machineButton: true;
    machineButtonLg: true;
    machineCaption: true;
  }
}

export const typographyOverrides: Components<Theme> = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        subtitle1: "h6",
        subtitle2: "h6",
        body1: "p",
        body2: "p",
        inherit: "p",
        machineHero: "h1",
        machineH1: "h1",
        machineH2: "h2",
        machineH3: "h3",
        machineH4: "h4",
        machineH5: "h5",
        machineH6: "h6",
        machineOverline: "p",
        machineSubtitle1: "h6",
        machineSubtitle2: "h6",
        machineBody0: "p",
        machineBody1: "p",
        machineBody2: "p",
        machineCaption: "p",
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.tokens.typography.fontFamily,
      }),
      h1: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.heading.h1.size}px`,
        fontWeight: theme.tokens.typography.heading.h1.weight,
        lineHeight: theme.tokens.typography.heading.h1.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      h2: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.heading.h2.size}px`,
        fontWeight: theme.tokens.typography.heading.h2.weight,
        lineHeight: theme.tokens.typography.heading.h2.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      h3: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.heading.h3.size}px`,
        fontWeight: theme.tokens.typography.heading.h3.weight,
        lineHeight: theme.tokens.typography.heading.h3.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      body1: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.body.body1.size}px`,
        fontWeight: theme.tokens.typography.body.body1.weight,
        lineHeight: theme.tokens.typography.body.body1.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      body2: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.body.body2.size}px`,
        fontWeight: theme.tokens.typography.body.body2.weight,
        lineHeight: theme.tokens.typography.body.body2.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      subtitle1: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.subtitle1.size}px`,
        fontWeight: theme.tokens.typography.subtitle1.weight,
        lineHeight: theme.tokens.typography.subtitle1.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      subtitle2: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.subtitle2.size}px`,
        fontWeight: theme.tokens.typography.subtitle2.weight,
        lineHeight: theme.tokens.typography.subtitle2.lineHeight,
        color: theme.tokens.color.text.primary,
      }),
      button: ({ theme }) => ({
        ...theme.tokens.typography.button,
        color: theme.tokens.color.text.primary,
      }),
      caption: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.body.base.size}px`,
        fontWeight: theme.tokens.typography.body.base.weight,
        lineHeight: theme.tokens.typography.body.base.lineHeight,
        color: theme.tokens.color.text.secondary,
      }),
      overline: ({ theme }) => ({
        fontSize: `${theme.tokens.typography.body.base.size}px`,
        fontWeight: theme.tokens.typography.body.base.weight,
        lineHeight: theme.tokens.typography.body.base.lineHeight,
        color: theme.tokens.color.text.secondary,
        textTransform: "uppercase",
      }),
    },
    variants: [
      {
        props: { variant: "code" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: "20px",
          color: theme.tokens.color.text.primary,
          letterSpacing: "-0.25px",
        }),
      },
      {
        props: { variant: "codeStrong" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "13px",
          fontWeight: 600,
          color: theme.tokens.color.text.primary,
        }),
      },
      {
        props: { variant: "machineHero" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "26px",
          fontWeight: 600,
          lineHeight: 1.29,
        }),
      },
      {
        props: { variant: "machineH1" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.33,
        }),
      },
      {
        props: { variant: "machineH2" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "17px",
          fontWeight: 500,
          lineHeight: 1.47,
        }),
      },
      {
        props: { variant: "machineH3" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.41,
        }),
      },
      {
        props: { variant: "machineH4" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: 1.33,
        }),
      },
      {
        props: { variant: "machineH5" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.23,
        }),
      },
      {
        props: { variant: "machineH6" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: 1.23,
        }),
      },
      {
        props: { variant: "machineOverline" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: 1.23,
          textTransform: "uppercase" as const,
        }),
      },
      {
        props: { variant: "machineSubtitle1" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "13px",
          fontWeight: 500,
          lineHeight: 1.33,
        }),
      },
      {
        props: { variant: "machineSubtitle2" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: 1.43,
        }),
      },
      {
        props: { variant: "machineBody0" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "13px",
          fontWeight: 400,
          lineHeight: 1.33,
        }),
      },
      {
        props: { variant: "machineBody1" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.43,
        }),
      },
      {
        props: { variant: "machineBody2" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "11px",
          fontWeight: 500,
          lineHeight: 1.23,
        }),
      },
      {
        props: { variant: "machineButtonSm" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: 1.14,
        }),
      },
      {
        props: { variant: "machineButton" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "12px",
          fontWeight: 500,
          lineHeight: 1.43,
        }),
      },
      {
        props: { variant: "machineButtonLg" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: 1.41,
        }),
      },
      {
        props: { variant: "machineCaption" },
        style: ({ theme }) => ({
          fontFamily: theme.tokens.typography.monoFontFamily,
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: 1.45,
        }),
      },
    ],
  },
};
