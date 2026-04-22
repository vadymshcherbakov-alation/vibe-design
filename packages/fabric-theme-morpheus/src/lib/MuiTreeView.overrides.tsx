import {SvgIcon, useTheme} from '@mui/material';
import type {Components, Theme} from '@mui/material/styles';

import {CaretRightSmallIcon} from '@alation/icons-neo';
import type {} from '@mui/x-tree-view/themeAugmentation';

export enum TreeItemTestId {
  Down = 'caretDownIcon',
  Id = 'treeItemId',
  Up = 'caretUpIcon',
}

const CollapseIcon = () => {
  const theme = useTheme();
  return (
    <SvgIcon
      component={CaretRightSmallIcon}
      data-testid={TreeItemTestId.Down}
      sx={{
        '&&&': {
          fontSize: theme.typography.iconXSmall.fontSize,
        },
      }}
    />
  );
};
const ExpandIcon = () => {
  const theme = useTheme();
  return (
    <SvgIcon
      component={CaretRightSmallIcon}
      data-testid={TreeItemTestId.Up}
      sx={{
        '&&&': {
          fontSize: theme.typography.iconXSmall.fontSize,
        },
        transform: 'rotate(90deg)',
      }}
    />
  );
};

export const muiTreeViewOverrides = {
  MuiTreeView: {
    defaultProps: {
      slotProps: {
        collapseIcon: CollapseIcon,
        expandIcon: ExpandIcon,
      },
    },
  },
  MuiTreeItem: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        marginTop: '0.4rem',
      },
      content: ({theme}) => ({
        paddingBottom: 0,
        paddingTop: 0,
        '&:hover, &.Mui-selected, &.Mui-selected:hover, &.Mui-focused': {
          backgroundColor: theme.palette.background.lighten10,
          borderRadius: '0.4rem',
        },
      }),
    },
  },
  MuiTreeItem2: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        marginTop: '0.4rem',
      },
      content: ({theme}) => ({
        paddingBottom: 0,
        paddingTop: 0,
        '&:hover, &.Mui-selected, &.Mui-selected:hover, &.Mui-focused': {
          backgroundColor: theme.palette.background.lighten10,
          borderRadius: '0.4rem',
        },
      }),
    },
  },
} satisfies Components<Theme>;
