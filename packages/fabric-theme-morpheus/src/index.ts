import {createTheme, type Shadows, type ThemeOptions} from '@mui/material/styles';
import {LicenseInfo} from '@mui/x-license';
import {merge} from 'lodash';

import {fabricClasses} from '@alation/fabric-types';

import {
  colorPaletteOverrides,
  colorPaletteOverridesDark,
  colorPaletteShellOverrides,
  colorPaletteShellOverridesDark,
  colorPaletteSidePanelOverrides,
  colorPaletteSidePanelOverridesDark,
} from './lib/ColorPalette.overrides';
import {getFroalaStyleOverrides} from './lib/FroalaEditor.overrides';
import {getLexicalEditorOverrides} from './lib/LexicalEditor.overrides';
import {muiAccordionOverrides} from './lib/MuiAccordion.overrides';
import {muiAlertOverrides} from './lib/MuiAlert.overrides';
import {muiAppBarOverrides} from './lib/MuiAppBar.overrides';
import {muiAutocompleteOverrides, muiAutocompleteShellOverrides} from './lib/MuiAutocomplete.overrides';
import {muiAvatarOverrides} from './lib/MuiAvatar.overrides';
import {muiBackdropOverrides} from './lib/MuiBackdrop.overrides';
import {muiBadgeOverrides} from './lib/MuiBadge.overrides';
import {muiBreadcrumbsOverrides} from './lib/MuiBreadcrumbs.overrides';
import {muiButtonOverrides, muiButtonShellOverrides} from './lib/MuiButton.overrides';
import {muiButtonGroupOverrides} from './lib/MuiButtonGroup.overrides';
import {muiCardOverrides} from './lib/MuiCard.overrides';
import {muiCheckboxOverrides} from './lib/MuiCheckbox.overrides';
import {muiChipOverrides} from './lib/MuiChip.overrides';
import {muiCircularProgressOverrides} from './lib/MuiCircularProgress.overrides';
import {muiDataGridOverrides} from './lib/MuiDataGrid.overrides';
import {muiDatePickerOverrides} from './lib/MuiDatePicker.overrides';
import {muiDialogOverrides} from './lib/MuiDialog.overrides';
import {muiDrawerOverrides, muiDrawerShellOverrides} from './lib/MuiDrawer.overrides';
import {muiFormControlLabelOverrides} from './lib/MuiFormControlLabel.overrides';
import {muiFormHelperTextOverrides} from './lib/MuiFormHelperText.overrides';
import {muiIconButtonOverrides, muiIconButtonShellOverrides} from './lib/MuiIconButton.overrides';
import {muiInputOverrides} from './lib/MuiInput.overrides';
import {muiInputLabelOverrides} from './lib/MuiInputLabel.overrides';
import {muiLinearProgressOverrides} from './lib/MuiLinearProgress.overrids';
import {muiLinkDarkOverrides, muiLinkShellOverrides} from './lib/MuiLink.overrides';
import {muiListOverrides, muiListShellOverrides} from './lib/MuiList.overrides';
import {muiLoadingButtonOverrides} from './lib/MuiLoadingButton.overrides';
import {muiMenuOverrides, muiMenuShellOverrides} from './lib/MuiMenu.overrides';
import {muiOutlinedInputOverrides} from './lib/MuiOutlinedInput.overrides';
import {muiPaperOverrides, muiPaperShellOverrides, muiPaperSidePanelOverrides} from './lib/MuiPaper.overrides';
import {muiPopoverOverrides} from './lib/MuiPopover.overrides';
import {muiPopperOverrides} from './lib/MuiPopper.overrides';
import {muiRadioOverrides} from './lib/MuiRadio.overrides';
import {muiSelectOverrides, muiSelectShellOverrides} from './lib/MuiSelect.overrides';
import {muiSnackbarOverrides} from './lib/MuiSnackbar.overrides';
import {muiSvgIconOverrides} from './lib/MuiSvgIcon.overrides';
import {muiSwitchOverrides} from './lib/MuiSwitch.overrides';
import {muiTableOverrides} from './lib/MuiTable.overrides';
import {muiTablePaginationOverrides} from './lib/MuiTablePagination.overrides';
import {muiTabsOverrides} from './lib/MuiTabs.overrides';
import {muiTextAreaOverrides} from './lib/MuiTextArea.overrides';
import {muiTextFieldOverrides} from './lib/MuiTextField.overrides';
import {muiTimePickerOverrides} from './lib/MuiTimePicker.overrides';
import {muiToggleButtonOverrides} from './lib/MuiToggleButton.overrides';
import {muiTooltipOverrides} from './lib/MuiTooltip.overrides';
import {muiTreeViewOverrides} from './lib/MuiTreeView.overrides';
import {muiTypographyOverrides, muiTypographyThemeOptions} from './lib/MuiTypography.overrides';
import {blue} from './lib/palettes/blue';

// for pro version of data grid / date picker
LicenseInfo.setLicenseKey(
  '3f6ef4646c3219ffd9b7fa8a4e0f182fTz0xMTk5MTEsRT0xNzkwOTg1NTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1RMy0yMDI0LEtWPTI=',
);

/**
 * Theming: https://mui.com/material-ui/customization/theming/
 * Default Theme: https://mui.com/material-ui/customization/default-theme/
 * Custom Variables: https://mui.com/material-ui/customization/theming/#custom-variables
 */

const morpheusThemeConfig: ThemeOptions = {
  ...colorPaletteOverrides,
  outline: {
    outlineStyle: 'solid',
    outlineOffset: '0.1rem',
    outlineWidth: '0.2rem',
    outlineColor: blue[900],
  },
  outlineStyleMixin(outline) {
    const {
      outlineOffset = this.outline?.outlineOffset,
      outlineColor = this.outline?.outlineColor,
      outlineWidth = this.outline?.outlineWidth,
      outlineStyle = this.outline?.outlineStyle,
    } = outline || {};
    return {
      outline: `${outlineWidth} ${outlineStyle} ${outlineColor}`,
      outlineOffset,
    };
  },
  shape: {
    borderRadius: 6,
  },
  borderRadiusToRem: (radius: number) => `${radius / 10}rem`,

  // Typography
  ...muiTypographyThemeOptions,
  shadows: [
    'none',
    '0px 0.7px 1.4px rgba(0, 0, 0, 0.07), 0px 1.9px 4px rgba(0, 0, 0, 0.05), 0px 4.5px 10px rgba(0, 0, 0, 0.05)',
    '0px 0.9px 4px -1px rgba(0, 0, 0, 0.08), 0px 2.6px 8px -1px rgba(0, 0, 0, 0.06), 0px 5.7px 12px -1px rgba(0, 0, 0, 0.05), 0px 15px 15px -1px rgba(0, 0, 0, 0.04)',
    '0px 1px 5px rgba(0, 0, 0, 0.1), 0px 3.6px 13px rgba(0, 0, 0, 0.07), 0px 8.4px 23px rgba(0, 0, 0, 0.06), 0px 23px 35px rgba(0, 0, 0, 0.05)',
    '0px 2.7px 9px rgba(0, 0, 0, 0.13), 0px 9.4px 24px rgba(0, 0, 0, 0.09), 0px 21.8px 43px rgba(0, 0, 0, 0.08)',
    ...Array(20).fill(
      '0px 2.7px 9px rgba(0, 0, 0, 0.13), 0px 9.4px 24px rgba(0, 0, 0, 0.09), 0px 21.8px 43px rgba(0, 0, 0, 0.08)',
    ),
  ] as Shadows,
  spacing: (factor: number) => `${0.8 * factor}rem`,
  components: {
    ...muiAccordionOverrides,
    ...muiAlertOverrides,
    ...muiAppBarOverrides,
    ...muiAvatarOverrides,
    ...muiAutocompleteOverrides,
    ...muiBadgeOverrides,
    ...muiBackdropOverrides,
    ...muiBreadcrumbsOverrides,
    ...muiButtonGroupOverrides,
    ...muiButtonOverrides,
    ...muiCardOverrides,
    ...muiCheckboxOverrides,
    ...muiChipOverrides,
    ...muiCircularProgressOverrides,
    ...muiDataGridOverrides,
    ...muiDatePickerOverrides,
    ...muiDialogOverrides,
    ...muiDialogOverrides,
    ...muiDrawerOverrides,
    ...muiFormControlLabelOverrides,
    ...muiFormHelperTextOverrides,
    ...muiIconButtonOverrides,
    ...muiInputLabelOverrides,
    ...muiInputOverrides,
    ...muiLinearProgressOverrides,
    ...muiListOverrides,
    ...muiLoadingButtonOverrides,
    ...muiMenuOverrides,
    ...muiOutlinedInputOverrides,
    ...muiOutlinedInputOverrides,
    ...muiPaperOverrides,
    ...muiPopoverOverrides,
    ...muiPopperOverrides,
    ...muiRadioOverrides,
    ...muiSelectOverrides,
    ...muiSelectOverrides,
    ...muiSnackbarOverrides,
    ...muiSvgIconOverrides,
    ...muiSwitchOverrides,
    ...muiTablePaginationOverrides,
    ...muiTabsOverrides,
    ...muiTextFieldOverrides,
    ...muiTimePickerOverrides,
    ...muiTreeViewOverrides,
    ...muiToggleButtonOverrides,
    ...muiTooltipOverrides,
    ...muiTooltipOverrides,
    ...muiTypographyOverrides,
    ...muiTableOverrides,
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        ...getFroalaStyleOverrides(theme),
        ...muiTextAreaOverrides,
        ...getLexicalEditorOverrides(theme),
        html: {
          fontSize: '62.5%',
        },
        body: {overflow: 'hidden'},
        // Don't do this for storybook!
        'body.sb-show-main': {overflow: 'auto'},
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          scrollbarColor: 'auto !important',
          '&::-webkit-scrollbar': {
            width: '1.6rem',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundClip: 'content-box',
            border: '0.4rem solid transparent',
            borderRadius: '5rem',
            backgroundColor: colorPaletteOverrides.palette.background?.darken30,
            '&:focus': {
              backgroundColor: colorPaletteOverrides.palette.background?.darken70,
            },
            '&:hover': {
              backgroundColor: colorPaletteOverrides.palette.background?.darken70,
            },
          },
          '&:hover::-webkit-scrollbar-thumb': {
            visibility: 'visible',
          },
          '&::-webkit-scrollbar-corner': {
            background: 'rgba(0,0,0,0)',
          },
          '.pageSideDrawer *': {
            scrollbarColor: `${colorPaletteOverrides.palette.background?.lighten30} transparent`,
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colorPaletteOverrides.palette.background?.lighten30,
              '&:focus': {
                backgroundColor: colorPaletteOverrides.palette.background?.lighten70,
              },
              '&:hover': {
                backgroundColor: colorPaletteOverrides.palette.background?.lighten70,
              },
            },
          },
        },
        // Animations
        '@keyframes rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        [`.${fabricClasses.rotate}`]: {
          animationName: 'rotate',
          animationTimingFunction: 'linear',
          animationDuration: '1s',
          animationIterationCount: 'infinite',
          display: 'block',
        },
      }),
    },
  },
};

export * from '@alation/fabric-types';
export const fabricThemeMorpheus = createTheme(morpheusThemeConfig);

export const fabricThemeMorpheusTest = createTheme(
  merge({}, morpheusThemeConfig, {
    transitions: {
      // So we have `transition: none;` everywhere
      create: () => 'none',
    },
  }),
);

export const fabricThemeMorpheusDark = createTheme(
  merge({}, morpheusThemeConfig, colorPaletteOverridesDark, {
    components: {
      ...muiLinkDarkOverrides,
    },
  }),
);

export const fabricThemeMorpheusShell = createTheme(
  merge({}, morpheusThemeConfig, colorPaletteShellOverrides, {
    components: {
      ...morpheusThemeConfig.components,
      ...muiAutocompleteShellOverrides,
      ...muiButtonShellOverrides,
      ...muiIconButtonShellOverrides,
      ...muiLinkShellOverrides,
      ...muiListShellOverrides,
      ...muiPaperShellOverrides,
      ...muiSelectShellOverrides,
      ...muiDrawerShellOverrides,
      ...muiMenuShellOverrides,
    },
  }),
);

export const fabricThemeMorpheusShellDark = createTheme(
  merge({}, morpheusThemeConfig, colorPaletteShellOverridesDark, {
    components: merge({}, fabricThemeMorpheusShell.components, {}),
  }),
);

export const fabricThemeMorpheusSidePanel = createTheme(
  merge({}, morpheusThemeConfig, colorPaletteSidePanelOverrides, {
    components: {
      ...muiPaperSidePanelOverrides,
    },
  }),
);
export const fabricThemeMorpheusSidePanelDark = createTheme(
  merge({}, morpheusThemeConfig, colorPaletteSidePanelOverridesDark, {
    components: {
      ...morpheusThemeConfig.components,
      ...muiPaperSidePanelOverrides,
    },
  }),
);

export {morpheusThemeConfig};
export {brand} from './lib/palettes/brand';
export {useBrand} from './lib/hooks/useBrand';

export enum ColorMode {
  Auto = 'auto',
  Dark = 'dark',
  Light = 'light',
}

export const defaultColorMode = ColorMode.Light;

export function isColorMode(mode: string): mode is ColorMode {
  return Object.values(ColorMode).includes(mode as ColorMode);
}

export enum ColorVariant {
  Shell = 'shell',
  SidePanel = 'sidePanel',
  Standard = 'standard',
}

export function getTheme(mode: ColorMode, variant: ColorVariant = ColorVariant.Standard) {
  switch (mode) {
    case 'light':
      switch (variant) {
        case 'shell':
          return fabricThemeMorpheusShell;
        case 'sidePanel':
          return fabricThemeMorpheusSidePanel;
        default:
          return fabricThemeMorpheus;
      }
    case 'dark':
      switch (variant) {
        case 'shell':
          return fabricThemeMorpheusShellDark;
        case 'sidePanel':
          return fabricThemeMorpheusSidePanelDark;
        default:
          return fabricThemeMorpheusDark;
      }
    case 'auto':
    default:
      switch (variant) {
        case 'shell':
          return fabricThemeMorpheusShell;
        case 'sidePanel':
          return fabricThemeMorpheusSidePanel;
        default:
          return fabricThemeMorpheus;
      }
  }
}

export {GridRowHeightDensity} from './lib/GridRowHeightDensity';
export {NoRowsOverlayContainer} from './lib/MuiDataGrid.overrides';
