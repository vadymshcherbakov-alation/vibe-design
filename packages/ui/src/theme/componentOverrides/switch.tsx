import { Components, Theme } from "@mui/material/styles";

enum SwitchState {
  Default,
  Hover,
  Disabled,
}

function getTrackColor(
  theme: Theme,
  checked: boolean,
  state: SwitchState,
): string {
  if (checked) {
    if (state === SwitchState.Disabled) return theme.tokens.palette.blue[200];
    if (state === SwitchState.Hover) return theme.tokens.palette.blue[900];
    return theme.tokens.palette.blue[600];
  }
  if (state === SwitchState.Disabled) return theme.tokens.palette.neutral[400];
  if (state === SwitchState.Hover) return theme.tokens.palette.neutral[800];
  return theme.tokens.palette.neutral[700];
}

const enc = (hex: string) => hex.replace("#", "%23");

const xIconUrl = (color: string) =>
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${enc(color)}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>")`;

const checkIconUrl = (color: string) =>
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${enc(color)}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>")`;

const thumbIconBase = {
  content: '""',
  display: "block",
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 10,
  height: 10,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "contain",
};

// Shared root dimensions — applied to both root and the sizeSmall variant override
const rootDimensions = {
  padding: 0,
  width: 36,
  height: 20,
};

export const switchOverrides: Components<Theme> = {
  MuiSwitch: {
    defaultProps: {
      disableFocusRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        ...rootDimensions,
        borderRadius: 10,
        // Override MUI's sizeSmall variant which sets width:40, height:24, padding:7
        "&.MuiSwitch-sizeSmall": {
          ...rootDimensions,
        },
      },
      track: {
        borderRadius: 10,
        opacity: 1,
      },
      thumb: ({ theme }) => ({
        backgroundColor: theme.tokens.color.background.control.default,
        boxShadow: "none",
        width: 16,
        height: 16,
        borderRadius: "50%",
        position: "relative",
        "&::before": {
          ...thumbIconBase,
          backgroundImage: xIconUrl(
            getTrackColor(theme, false, SwitchState.Default),
          ),
        },
      }),
      switchBase: ({ theme }) => ({
        // Explicit dimensions so the switchBase doesn't expand beyond the thumb
        width: 16,
        height: 16,
        // Override MUI's sizeSmall variant which sets padding:4 on switchBase
        padding: "0 !important",
        margin: 2,
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: getTrackColor(theme, false, SwitchState.Default),
        },
        "&:hover, &.Mui-focusVisible": {
          backgroundColor: "transparent",
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: getTrackColor(theme, false, SwitchState.Hover),
          },
          "& .MuiSwitch-thumb::before": {
            backgroundImage: xIconUrl(
              getTrackColor(theme, false, SwitchState.Hover),
            ),
          },
        },
        "&.Mui-disabled": {
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: getTrackColor(theme, false, SwitchState.Disabled),
          },
          "& .MuiSwitch-thumb": {
            backgroundColor: theme.tokens.color.background.control.default,
          },
          "& .MuiSwitch-thumb::before": {
            backgroundImage: xIconUrl(
              getTrackColor(theme, false, SwitchState.Disabled),
            ),
          },
        },
        "&.Mui-checked": {
          transform: "translateX(16px)",
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: getTrackColor(theme, true, SwitchState.Default),
          },
          "& .MuiSwitch-thumb::before": {
            backgroundImage: checkIconUrl(
              getTrackColor(theme, true, SwitchState.Default),
            ),
          },
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "transparent",
            "& + .MuiSwitch-track": {
              opacity: 1,
              backgroundColor: getTrackColor(theme, true, SwitchState.Hover),
            },
            "& .MuiSwitch-thumb::before": {
              backgroundImage: checkIconUrl(
                getTrackColor(theme, true, SwitchState.Hover),
              ),
            },
          },
          "&.Mui-disabled": {
            "& + .MuiSwitch-track": {
              opacity: 1,
              backgroundColor: getTrackColor(theme, true, SwitchState.Disabled),
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: theme.tokens.color.background.control.default,
            },
            "& .MuiSwitch-thumb::before": {
              backgroundImage: checkIconUrl(
                getTrackColor(theme, true, SwitchState.Disabled),
              ),
            },
          },
        },
      }),
    },
  },
};
