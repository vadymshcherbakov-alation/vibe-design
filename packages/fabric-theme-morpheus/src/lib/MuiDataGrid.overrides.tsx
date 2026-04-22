import {Box, SvgIcon} from '@mui/material';
import {type Components, styled, type Theme, useTheme} from '@mui/material/styles';
import {type GridCellParams, type GridRowHeightParams, type MuiEvent} from '@mui/x-data-grid-pro';
import {type FC, type MouseEvent, PropsWithChildren, ReactNode} from 'react';

import {ExportIcon} from '@alation/icons-neo';

import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import {GridRowHeightDensity} from './GridRowHeightDensity';

export const dataGridHandleCellDoubleClick = (_params: GridCellParams, event: MuiEvent<MouseEvent>) => {
  event.defaultMuiPrevented = true;
  event.stopPropagation();
};

const StyledNoRowsOverlay = styled('div')(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(1),
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

export function NoRowsOverlayContainer({children}: PropsWithChildren): ReactNode {
  return (
    <StyledNoRowsOverlay>
      <svg aria-hidden focusable='false' height='100' viewBox='0 0 184 152' width='120'>
        <g fill='none' fillRule='evenodd'>
          <g transform='translate(24 31.67)'>
            <ellipse className='ant-empty-img-5' cx='67.797' cy='106.89' rx='67.797' ry='12.668' />
            <path
              className='ant-empty-img-1'
              d='M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z'
            />
            <path
              className='ant-empty-img-2'
              d='M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z'
            />
            <path
              className='ant-empty-img-3'
              d='M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z'
            />
          </g>
          <path
            className='ant-empty-img-3'
            d='M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z'
          />
          <g className='ant-empty-img-4' transform='translate(149.65 15.383)'>
            <ellipse cx='20.654' cy='3.167' rx='2.849' ry='2.815' />
            <path d='M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z' />
          </g>
        </g>
      </svg>
      {children}
    </StyledNoRowsOverlay>
  );
}

function CustomNoRowsOverlay() {
  const theme = useTheme();
  return (
    <NoRowsOverlayContainer>
      <Box sx={{mt: 1}}>{theme.components?.MuiDataGrid?.defaultProps?.localeText?.noRowsLabel ?? 'No Rows'}</Box>
    </NoRowsOverlayContainer>
  );
}

const MuiGridToolbarExportIcon: FC = () => {
  return <SvgIcon component={ExportIcon} />;
};

const calculateRowHeight = ({densityFactor}: GridRowHeightParams) => {
  switch (densityFactor) {
    case GridRowHeightDensity.Compact:
      return 32;
    case GridRowHeightDensity.Standard:
      return 40;
    case GridRowHeightDensity.Comfortable:
      return 48;
    default:
      return 40;
  }
};

export const muiDataGridOverrides: Components<Theme> = {
  MuiDataGrid: {
    defaultProps: {
      columnHeaderHeight: 36,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSorting: true,
      getRowHeight: calculateRowHeight,
      onCellDoubleClick: dataGridHandleCellDoubleClick,
      pageSizeOptions: [5, 10, 25, 50, 100],
      slots: {
        columnResizeIcon: () => (
          <Box className='MuiColumn-resize-element'>
            <Box />
          </Box>
        ),
        exportIcon: MuiGridToolbarExportIcon,
        noRowsOverlay: CustomNoRowsOverlay,
        noResultsOverlay: CustomNoRowsOverlay,
      },
      sortingOrder: ['desc', 'asc'],
    },
    styleOverrides: {
      root: ({theme}) => ({
        border: 'none',
        ...theme.typography.body1,
        '& .MuiDataGrid-cell': {
          ...theme.typography.body1,
          borderColor: `${theme.palette.grey[400]} !important`,
          '&:focus, &:focus-within': {
            '.editable-text-cell__wrapper .MuiButtonGroup-root': {
              opacity: 1,
            },
          },
        },
        '& .MuiDataGrid-main:only-child': {
          borderBottom: `0.1rem solid ${theme.palette.grey[500]}`,
          borderBottomLeftRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
        },
        '& .MuiDataGrid-main': {
          boxSizing: 'content-box',
          border: `0.1rem solid ${theme.palette.grey[500]}`,
          borderBottom: 'none',
          borderTopRightRadius: theme.shape.borderRadius,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        '& .MuiDataGrid-withBorderColor': {
          borderColor: theme.palette.grey[500],
        },
      }),
      footerContainer: ({theme}) => ({
        '&.MuiDataGrid-withBorderColor': {
          borderBottom: `0.1rem solid ${theme.palette.grey[500]}`,
          borderRight: `0.1rem solid ${theme.palette.grey[500]}`,
          borderLeft: `0.1rem solid ${theme.palette.grey[500]}`,
          borderBottomLeftRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
        },
      }),
      menu: ({theme}) => ({
        backgroundColor: theme.palette.background.paper,
        border: theme.palette.grey[400],
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
      }),
      toolbarContainer: ({theme}) => ({
        display: 'flex',
        flexDirection: 'row',
        padding: '0.1rem 0 0 0',
        marginBottom: theme.spacing(1),
      }),
      withBorderColor: ({theme}) => ({
        borderColor: theme.palette.grey[400],
      }),
      columnHeaders: {
        overflow: 'visible',
      },
      columnHeaderTitle: ({theme}) => ({
        ...theme.typography.subtitle2,
      }),
      columnSeparator: ({theme}) => ({
        color: theme.palette.grey[500],
      }),
      'columnSeparator--resizable': ({theme}) => ({
        height: '100%',
        '&:hover': {
          color: theme.palette.primary.main,
        },
        '& .MuiColumn-resize-element': {
          display: 'flex',
          justifyContent: 'center',
          opactiy: 0.3,
          width: '3rem',
          '& >:first-of-type': {
            border: '0.1rem solid',
            height: '2rem',
            zIndex: 1200,
          },
        },
      }),
      'columnSeparator--resizing': ({theme}) => ({
        '& .MuiColumn-resize-element >:first-of-type': {
          borderColor: theme.palette.primary.main,
          height: '100vh',
          position: 'absolute',
          top: 0,
        },
      }),
      row: ({theme}) => ({
        borderColor: theme.palette.grey[400],
      }),
      cell: ({theme}) => ({
        ...theme.typography.body1,
        borderColor: `${theme.palette.grey[400]} !important`,
        borderTopColor: `${theme.palette.grey[400]} !important`,
        display: 'flex',
        alignItems: 'center',
        '&:focus, &:focus-within': {
          '.editable-text-cell__wrapper .MuiButtonGroup-root': {
            opacity: 1,
          },
        },
      }),
    },
  },
};
