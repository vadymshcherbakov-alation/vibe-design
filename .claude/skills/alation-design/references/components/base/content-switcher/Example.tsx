import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

export default function ContentSwitcherExample() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [scope, setScope] = useState<'all' | 'mine' | 'shared'>('all');
  const [cadence, setCadence] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [size, setSize] = useState<'medium' | 'small'>('medium');

  // exclusive groups must reject null updates so a value is always selected
  const handleExclusive =
    <T extends string>(setter: (v: T) => void) =>
    (_: unknown, next: T | null) => {
      if (next !== null) setter(next);
    };

  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      {/* Named styles axis — selection state */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Named styles · selection state
        </Typography>
        <ToggleButtonGroup exclusive value="selected" aria-label="Selection state">
          <ToggleButton value="unselected">Unselected</ToggleButton>
          <ToggleButton value="selected">Selected</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Sizes — Medium (default) and Small */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes</Typography>
        <ToggleButtonGroup
          exclusive
          value={size}
          onChange={handleExclusive<'medium' | 'small'>(setSize)}
          aria-label="Density"
        >
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="small">Small</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={size}
          onChange={handleExclusive<'medium' | 'small'>(setSize)}
          aria-label="Density (small)"
        >
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="small">Small</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* View-mode toggle — Grid / List */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">View mode</Typography>
        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={handleExclusive<'grid' | 'list'>(setView)}
          aria-label="View mode"
        >
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Filter pill above a data-table view — All / Mine / Shared */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Source filter — above a data-table view
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={scope}
          onChange={handleExclusive<'all' | 'mine' | 'shared'>(setScope)}
          aria-label="Source filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="mine">Mine</ToggleButton>
          <ToggleButton value="shared">Shared</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Inside a Form Field — labelled choice in a form */}
      <FormControl>
        <FormLabel id="cadence-label">Sync cadence</FormLabel>
        <ToggleButtonGroup
          exclusive
          value={cadence}
          onChange={handleExclusive<'daily' | 'weekly' | 'monthly'>(setCadence)}
          aria-labelledby="cadence-label"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      {/* States — disabled group + disabled option */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">States — disabled</Typography>
        <ToggleButtonGroup exclusive value="grid" disabled aria-label="Disabled group">
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup exclusive value="grid" aria-label="One option disabled">
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list" disabled>List</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
