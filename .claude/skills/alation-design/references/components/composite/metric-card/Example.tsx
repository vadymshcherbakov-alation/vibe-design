import { Box, Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AlertTriangle } from 'lucide-react';

export default function MetricCardExample() {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
      {/* Quota / progress metric */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          width: 320,
        }}
      >
        <Typography variant="subtitle1">Data Quality Starter</Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="hero">24</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              of 25 checks active
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <AlertTriangle size={14} color={theme.palette.error.main} />
            <Typography variant="subtitle1" color="error.main">96%</Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={96}
          color="error"
          sx={{ height: 6, borderRadius: 4, bgcolor: theme.palette.neutral[200] }}
        />

        <Typography variant="body2" color="text.secondary">1 remaining</Typography>

        <Box>
          <Button variant="outlined" color="inherit" size="small">
            View breakdown
          </Button>
        </Box>
      </Paper>

      {/* Simple metric */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: 240,
        }}
      >
        <Typography variant="subtitle1">Total assets</Typography>
        <Typography variant="hero">1,248</Typography>
        <Typography variant="body2" color="text.secondary">+42 this week</Typography>
      </Paper>
    </Stack>
  );
}
