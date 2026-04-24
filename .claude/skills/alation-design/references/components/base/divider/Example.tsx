import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';

export default function DividerExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Horizontal — between sections inside a surface</Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 480 }}>
          <Typography variant="subtitle1">General</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Name, description, owner.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Advanced</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sync schedule, retry policy.
          </Typography>
        </Paper>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Vertical — inside a toolbar row</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="text">Filter</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Sort</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Group</Button>
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Labelled (sparingly)</Typography>
        <Box sx={{ maxWidth: 480 }}>
          <Divider>or</Divider>
        </Box>
      </Stack>
    </Stack>
  );
}
