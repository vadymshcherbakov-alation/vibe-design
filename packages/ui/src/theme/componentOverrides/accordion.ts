import { Components, Theme } from "@mui/material/styles";

export const accordionOverrides: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
      elevation: 0,
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.tokens.color.border.default,
        borderRadius: 6,
        "&:first-of-type": {
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        },
        "&:last-of-type": {
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        },
        "&:before": {
          display: "none",
        },
        "&:not(:last-child)": {
          borderBottom: 0,
        },
        "&.MuiPaper-elevation": {
          border: `1px solid ${theme.tokens.color.border.default}`,
          "&.Mui-expanded, &:last-child": {
            "& .MuiAccordionSummary-root": {
              boxShadow: theme.tokens.shadow.hover,
            },
          },
        },
        "& .MuiAccordionDetails-root": {
          padding: 16,
        },
        "&.Mui-disabled": {
          backgroundColor: "transparent",
          "& .MuiAccordionSummary-expandIconWrapper, .MuiTypography-root": {
            color: theme.tokens.color.text.disabled,
          },
        },
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderTop: `1px solid ${theme.tokens.color.border.default}`,
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-focusVisible, &:hover": {
          backgroundColor: theme.tokens.color.background.control.hover,
        },
        "&:not(.Mui-expanded)": {
          borderRadius: "inherit",
        },
        "& .MuiAccordionSummary-headerContent, & .MuiAccordionSummary-blurbContent":
          {
            alignItems: "center",
            display: "flex",
            marginRight: 8,
            overflow: "hidden",
            "& > *:first-of-type": {
              marginRight: 8,
            },
            "& .MuiSvgIcon-root": {
              fontSize: theme.tokens.typography.iconSize.sm,
            },
          },
        "& .MuiAccordionSummary-headerContent": {
          flexShrink: 0,
          width: "100%",
          "& .MuiFormControlLabel-root": {
            marginLeft: -8,
            "& .MuiCheckbox-root": {
              padding: "0 8px 0 0",
            },
          },
          "&:not(:last-child)": {
            width: "45%",
          },
        },
        "& .MuiAccordionSummary-blurbContent": {
          color: theme.tokens.color.text.secondary,
        },
        "& .MuiAccordionSummary-actionContent": {
          display: "flex",
          flexDirection: "row-reverse",
          flexGrow: 1,
          marginRight: 16,
        },
      }),
      expandIconWrapper: ({ theme }) => ({
        color: theme.tokens.color.text.secondary,
        fontSize: theme.tokens.typography.iconSize.lg,
      }),
      content: {
        alignItems: "center",
        overflow: "hidden",
      },
    },
  },
};
