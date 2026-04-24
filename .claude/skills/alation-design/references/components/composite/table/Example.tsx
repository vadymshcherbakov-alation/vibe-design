import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical } from 'lucide-react';

interface OAuthClient {
  id: string;
  applicationName: string;
  clientId: string;
  createdBy: string;
  createdAt: string;
}

const rows: OAuthClient[] = [
  { id: '1', applicationName: 'Data Integration Service', clientId: 'oauth_client_abc123', createdBy: 'admin@example.com', createdAt: '2024-01-15' },
  { id: '2', applicationName: 'Analytics Dashboard',      clientId: 'oauth_client_def456', createdBy: 'user@example.com',  createdAt: '2024-02-20' },
  { id: '3', applicationName: 'Mobile App',               clientId: 'oauth_client_ghi789', createdBy: 'developer@example.com', createdAt: '2024-03-10' },
  { id: '4', applicationName: 'Reporting Service',        clientId: 'oauth_client_jkl012', createdBy: 'analyst@example.com', createdAt: '2024-04-05' },
  { id: '5', applicationName: 'Data Pipeline',            clientId: 'oauth_client_mno345', createdBy: 'engineer@example.com', createdAt: '2024-05-18' },
  { id: '6', applicationName: 'Admin Portal',             clientId: 'oauth_client_pqr678', createdBy: 'admin@example.com', createdAt: '2024-06-22' },
];

const columns: GridColDef<OAuthClient>[] = [
  { field: 'applicationName', headerName: 'Application Name', flex: 1 },
  { field: 'clientId', headerName: 'Client ID', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
  { field: 'createdAt', headerName: 'Created At', width: 140 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 80,
    renderCell: () => (
      <Tooltip title="More actions">
        <IconButton size="small">
          <MoreVertical size={16} />
        </IconButton>
      </Tooltip>
    ),
  },
];

export default function TableExample() {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          border: `1px solid ${theme.palette.neutral[200]}`,
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={rows.slice(0, 5)}
          columns={columns}
          rowHeight={40}
          hideFooter
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            boxShadow: 'none',
            '& .MuiDataGrid-main': { border: 'none', borderRadius: 0, boxShadow: 'none' },
            '& .MuiDataGrid-main:only-child': { borderBottom: 'none' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: theme.palette.grey[50] },
            '& .MuiDataGrid-cell': { px: '10px' },
            '& .MuiDataGrid-columnHeader': { px: '10px' },
            '& .MuiDataGrid-row:hover': { backgroundColor: theme.palette.neutral[50] },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Show rows</Typography>
          <Box
            component="select"
            defaultValue={5}
            sx={{
              border: `1px solid ${theme.palette.neutral[300]}`,
              borderRadius: 1,
              px: 1,
              py: 0.375,
              fontSize: theme.typography.body2.fontSize,
              fontFamily: 'inherit',
              bgcolor: 'transparent',
              cursor: 'default',
              outline: 'none',
            }}
          >
            {[5, 10, 25].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">1–5 of {rows.length}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" disabled><ChevronsLeft size={16} /></IconButton>
            <IconButton size="small" disabled><ChevronLeft size={16} /></IconButton>
            <IconButton size="small"><ChevronRight size={16} /></IconButton>
            <IconButton size="small"><ChevronsRight size={16} /></IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
