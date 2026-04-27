import { Chip, Stack, Typography } from '@mui/material';
import { ObjectChips } from '@alation/alation-ui';

export default function ChipExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Label Chip — status</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Active"     color="success" size="xsmall" />
          <Chip label="Pending"    color="warning" size="xsmall" />
          <Chip label="Deprecated" color="error"   size="xsmall" />
          <Chip label="Info"       color="info"    size="xsmall" />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Label Chip — category</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Native"  color="info"    size="xsmall" />
          <Chip label="MCP"     color="default" size="xsmall" />
          <Chip label="Catalog" color="primary" size="xsmall" />
          <Chip label="Custom"  color="secondary" size="xsmall" />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Object Chip — interactive catalog objects (click + remove)</Typography>
        <ObjectChips
          items={[
            { otype: 'user',    id: 1, name: 'Vadym Shcherbakov' },
            { otype: 'user',    id: 2, name: 'Chao Li' },
            { otype: 'dataset', id: 3, name: 'finance_prod' },
            { otype: 'agent',   id: 4, name: 'ingest_agent' },
          ]}
          chipsClickable
          onDelete={(item) => console.log('remove', item)}
        />
      </Stack>
    </Stack>
  );
}
