import React from "react";
import { Components, Theme } from "@mui/material/styles";

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.99999 0.666667C12.0501 0.666667 15.3333 3.94991 15.3333 8C15.3333 12.0501 12.0501 15.3333 7.99999 15.3333C3.9499 15.3333 0.666656 12.0501 0.666656 8C0.666656 3.94991 3.9499 0.666667 7.99999 0.666667ZM7.99999 7.33333C7.6318 7.33333 7.33332 7.63181 7.33332 8V10.6667C7.33332 11.0349 7.6318 11.3333 7.99999 11.3333C8.36818 11.3333 8.66666 11.0349 8.66666 10.6667V8C8.66666 7.63181 8.36818 7.33333 7.99999 7.33333ZM7.99999 4.66667C7.6318 4.66667 7.33332 4.96514 7.33332 5.33333C7.33332 5.70152 7.6318 6 7.99999 6H8.0065C8.37469 6 8.67317 5.70152 8.67317 5.33333C8.67317 4.96514 8.37469 4.66667 8.0065 4.66667H7.99999Z" fill="currentColor"/>
  </svg>
);

export const alertOverrides: Components<Theme> = {
  MuiAlert: {
    defaultProps: {
      iconMapping: {
        info: <InfoIcon />,
      },
    },
    styleOverrides: {
      root: {
        borderRadius: "8px",
        alignItems: "flex-start",
        padding: "8px",
        "& .MuiAlert-icon": {
          marginTop: "2px",
          alignSelf: "flex-start",
          padding: 0,
          marginRight: "8px",
        },
        "& .MuiAlert-message": {
          padding: 0,
        },
      },
      filledSuccess: ({ theme }) => ({
        backgroundColor: theme.tokens.palette.neutral[800],
        color: theme.tokens.color.text.inverted,
        "& .MuiAlert-icon": {
          color: theme.tokens.palette.green[500],
        },
        "& .MuiAlert-message": {
          fontSize: `${theme.tokens.typography.body.base.size}px`,
          lineHeight: theme.tokens.typography.body.base.lineHeight,
          color: theme.tokens.color.text.inverted,
        },
        "& .MuiAlert-action": {
          color: theme.tokens.color.text.inverted,
        },
      }),
      filledInfo: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.information,
        color: theme.tokens.color.text.primary,
        border: `1px solid ${theme.tokens.color.border.information}`,
        "& .MuiAlert-icon": {
          color: theme.tokens.color.text.information,
        },
        "& .MuiAlert-message": {
          fontSize: "13px",
          lineHeight: "20px",
          color: theme.tokens.color.text.primary,
        },
        "& .MuiAlert-action": {
          color: theme.tokens.color.text.primary,
        },
      }),
      standardInfo: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.information,
        color: theme.tokens.color.text.primary,
        border: `1px solid ${theme.tokens.color.border.information}`,
        "& .MuiAlert-icon": {
          color: theme.tokens.color.text.information,
        },
        "& .MuiAlert-message": {
          fontSize: "13px",
          lineHeight: "20px",
          color: theme.tokens.color.text.primary,
        },
        "& .MuiAlert-action": {
          color: theme.tokens.color.text.primary,
        },
      }),
      standardWarning: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.warning,
        color: theme.tokens.color.text.primary,
        border: `1px solid ${theme.tokens.color.border.warning}`,
        "& .MuiAlert-icon": {
          color: theme.tokens.color.text.warning,
        },
        "& .MuiAlert-message": {
          fontSize: "13px",
          lineHeight: "20px",
          color: theme.tokens.color.text.primary,
        },
        "& .MuiAlert-action": {
          color: theme.tokens.color.text.primary,
        },
      }),
    },
  },
};
