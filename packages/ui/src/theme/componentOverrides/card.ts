import { avatarClasses, Components, Theme } from "@mui/material";

export const cardOverrides: Components<Theme> = {
  MuiCardHeader: {
    defaultProps: {
      subheaderTypographyProps: {
        color: "text.secondary",
        variant: "body1",
      },
      titleTypographyProps: { variant: "h3" },
    },
    styleOverrides: {
      avatar: ({ theme }) => ({
        marginRight: 8,
      }),
      root: {
        [`& .${avatarClasses.root}`]: {
          height: 40,
          width: 40,
          "& svg": { height: 24, width: 24 },
        },
        padding: 0,
      },
    },
  },
};
