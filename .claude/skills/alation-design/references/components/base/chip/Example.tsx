import { useState } from 'react';
import { Chip, Stack, Typography } from '@mui/material';

export default function ChipExample() {
  const [selected, setSelected] = useState<'databases' | 'dashboards' | null>('databases');

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Status — soft (filledLight)</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Active"     variant="filledLight" color="success" size="xsmall" />
          <Chip label="Pending"    variant="filledLight" color="warning" size="xsmall" />
          <Chip label="Deprecated" variant="filledLight" color="error"   size="xsmall" />
          <Chip label="Info"       variant="filledLight" color="info"    size="xsmall" />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Status — solid (filled)</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Active"     variant="filled" color="success" size="small" />
          <Chip label="Warning"    variant="filled" color="warning" size="small" />
          <Chip label="Error"      variant="filled" color="error"   size="small" />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Filter — toggle</Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Databases"
            size="small"
            variant={selected === 'databases' ? 'filled' : 'outlined'}
            color={selected === 'databases' ? 'primary' : 'default'}
            onClick={() => setSelected('databases')}
          />
          <Chip
            label="Dashboards"
            size="small"
            variant={selected === 'dashboards' ? 'filled' : 'outlined'}
            color={selected === 'dashboards' ? 'primary' : 'default'}
            onClick={() => setSelected('dashboards')}
          />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Applied filter (removable)</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Owner: vadym.shcherbakov" size="small" onDelete={() => {}} />
          <Chip label="Tag: PII"                 size="small" onDelete={() => {}} />
        </Stack>
      </Stack>
    </Stack>
  );
}
