import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { ObjectChips } from '@alation/alation-ui';

export default function ChipExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Label Chip · Subtle (default, variant="filledLight") — every colour
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Default"    color="default" variant="filledLight" size="xsmall" />
          <Chip label="Active"     color="success" variant="filledLight" size="xsmall" />
          <Chip label="Pending"    color="warning" variant="filledLight" size="xsmall" />
          <Chip label="Deprecated" color="error"   variant="filledLight" size="xsmall" />
          <Chip label="Info"       color="info"    variant="filledLight" size="xsmall" />
          <Chip label="Native"     color="blue"    variant="filledLight" size="xsmall" />
          <Chip label="Metadata"   color="cyan"    variant="filledLight" size="xsmall" />
          <Chip label="Healthy"    color="emerald" variant="filledLight" size="xsmall" />
          <Chip label="Beta"       color="orange"  variant="filledLight" size="xsmall" />
          <Chip label="Catalog"    color="purple"  variant="filledLight" size="xsmall" />
          <Chip label="Lineage"    color="teal"    variant="filledLight" size="xsmall" />
          <Chip label="Custom"     color="violet"  variant="filledLight" size="xsmall" />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Label Chip · Strong (escalation, variant="filled") — every colour
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Default"    color="default" variant="filled" size="xsmall" />
          <Chip label="Active"     color="success" variant="filled" size="xsmall" />
          <Chip label="Pending"    color="warning" variant="filled" size="xsmall" />
          <Chip label="Critical"   color="error"   variant="filled" size="xsmall" />
          <Chip label="Info"       color="info"    variant="filled" size="xsmall" />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Use sparingly — one Strong chip per surface. Stacking multiple Strong colours
          burns the saturation budget and the call-to-action stops landing.
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Label Chip · with tooltip (the only allowed affordance)
        </Typography>
        <Tooltip title="Owner has not approved this dataset in the last 30 days">
          <Chip label="Stale" color="warning" variant="filledLight" size="xsmall" />
        </Tooltip>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Object Chip · catalog objects (always avatar / icon, white with grey border)
        </Typography>
        <ObjectChips
          items={[
            { otype: 'user',    id: 1, name: 'Vadym Shcherbakov' },
            { otype: 'user',    id: 2, name: 'Chao Li' },
            { otype: 'dataset', id: 3, name: 'finance_prod' },
            { otype: 'agent',   id: 4, name: 'ingest_agent' },
            { otype: 'term',    id: 5, name: 'Customer LTV' },
          ]}
          chipsClickable
          onDelete={(item) => console.log('remove', item)}
        />
      </Stack>
    </Stack>
  );
}
