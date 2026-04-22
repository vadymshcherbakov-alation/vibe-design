import { Components, Theme } from "@mui/material/styles";

export const listOverrides: Components<Theme> = {
  MuiListItemAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        marginRight: 8,
        minWidth: 0,
        height: 16,
        width: 16,
        "& .MuiAvatar-root": {
          backgroundColor: theme.tokens.palette.neutral[300],
          height: "inherit",
          width: "inherit",
          "& .MuiSvgIcon-root": {
            color: theme.tokens.color.text.primary,
          },
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingLeft: 8,
        borderRadius: 4,
        "&:hover, &.Mui-focusVisible": {
          backgroundColor: theme.tokens.color.background.control.hover,
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.tokens.color.text.primary,
        fontSize: theme.tokens.typography.iconSize.sm,
        marginRight: 8,
        minWidth: 0,
        "& .MuiCheckbox-root": {
          padding: "0 4px 0 8px",
        },
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 4,
        margin: "4px 0",
        "&:first-of-type": {
          marginTop: 0,
        },
        "&:last-child": {
          marginBottom: 0,
        },
        "&.Mui-disabled": {
          color: theme.tokens.color.text.disabled,
        },
        "&:hover, &:focus, .MuiListItemButton-root": {
          "& .MuiListItemSecondaryAction-root": {
            "& svg": {
              opacity: 1,
            },
          },
        },
        "& .MuiListItemButton-root": {
          marginLeft: -8,
        },
        "& .MuiIconButton-root": {
          padding: 2,
        },
      }),
      gutters: {
        paddingLeft: 8,
      },
      dense: ({ theme }) => ({
        margin: "2px 0",
        "& .MuiIconButton-root": {
          fontSize: theme.tokens.typography.iconSize.sm,
        },
      }),
    },
  },
  MuiListItemSecondaryAction: {
    styleOverrides: {
      root: {
        "& svg": {
          opacity: 0,
        },
        "& .MuiIconButton-root.Mui-focusVisible": {
          "& svg": {
            opacity: 1,
          },
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 0,
        "& + .MuiSvgIcon-root": {
          color: theme.tokens.color.text.primary,
          fontSize: theme.tokens.typography.iconSize.md,
        },
      }),
      dense: ({ theme }) => ({
        "&& .MuiListItemText-primary": {
          fontSize: theme.tokens.typography.body.base.size,
        },
        "& + .MuiSvgIcon-root": {
          fontSize: theme.tokens.typography.iconSize.sm,
        },
      }),
      inset: {
        paddingLeft: 16,
      },
      secondary: ({ theme }) => ({
        fontSize: theme.tokens.typography.body.base.size,
      }),
    },
  },
};
