import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Filter, MoreVertical, Pencil, Trash2 } from 'lucide-react';

export default function IconButtonExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Default (text variant) — row / toolbar actions</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="More actions">
            <IconButton size="small" aria-label="More actions">
              <MoreVertical />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" aria-label="Edit">
              <Pencil />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="xsmall">
            <IconButton size="xsmall" aria-label="More (xsmall)"><MoreVertical /></IconButton>
          </Tooltip>
          <Tooltip title="small">
            <IconButton size="small" aria-label="More (small)"><MoreVertical /></IconButton>
          </Tooltip>
          <Tooltip title="medium">
            <IconButton size="medium" aria-label="More (medium)"><MoreVertical /></IconButton>
          </Tooltip>
          <Tooltip title="large">
            <IconButton size="large" aria-label="More (large)"><MoreVertical /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Outlined — standalone toolbar control</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Filter">
            {/* @ts-expect-error — `variant` is an Alation theme extension on MuiIconButton */}
            <IconButton size="medium" variant="outlined" aria-label="Filter">
              <Filter />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Destructive (pair with ConfirmDialog)</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Delete row">
            <IconButton size="small" color="error" aria-label="Delete row">
              <Trash2 />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
}
