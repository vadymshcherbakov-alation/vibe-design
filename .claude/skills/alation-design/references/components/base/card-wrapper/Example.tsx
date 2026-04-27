import { Card, CardActions, CardContent, Button, Paper, Stack, Typography } from '@mui/material';

export default function CardExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Structured Card — outlined</Typography>
        <Card variant="outlined" sx={{ borderRadius: 2, maxWidth: 420 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Connection details</Typography>
            <Typography variant="body2" color="text.secondary">
              Credentials, host, port, and driver. Updates take effect on next sync.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button variant="outlined" color="primary" size="small">Edit</Button>
            <Button variant="text" color="inherit" size="small">View history</Button>
          </CardActions>
        </Card>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Paper — flat metric surface</Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 240 }}>
          <Typography variant="subtitle1">Total CDEs</Typography>
          <Typography variant="hero">1,284</Typography>
          <Typography variant="body2" color="text.secondary">+42 this week</Typography>
        </Paper>
      </Stack>
    </Stack>
  );
}
