import { Button, Stack, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

export default function ButtonExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Primary</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" color="primary">Save changes</Button>
          <Button variant="contained" color="primary" startIcon={<Plus size={16} />}>
            Add source
          </Button>
          <Button variant="contained" color="primary" disabled>Save changes</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Blue secondary</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="primary">Cancel</Button>
          <Button variant="outlined" color="primary" disabled>Cancel</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Grey outlined</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit">Export</Button>
          <Button variant="outlined" color="inherit">Filter</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Text</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="text" color="primary">Learn more</Button>
          <Button variant="text" color="primary">Edit</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Destructive (always pair with ConfirmDialog)</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" color="error">Delete source</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes</Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
