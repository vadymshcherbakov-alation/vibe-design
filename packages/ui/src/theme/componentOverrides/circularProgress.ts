import { Components, Theme } from "@mui/material/styles";

export const circularProgressOverrides: Components<Theme> = {
  MuiCircularProgress: {
    defaultProps: {
      size: 50,
      thickness: 5,
    },
  },
};
