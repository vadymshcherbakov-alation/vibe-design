import { useState } from 'react';
import { Divider, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

export default function SwitchExample() {
  const [notify, setNotify] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [metrics, setMetrics] = useState(false);
  const [pinned, setPinned] = useState(false);

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Named styles axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Named styles · on/off state</Typography>
        <FormControlLabel control={<Switch checked={false} />} label="Off — setting is disabled" />
        <FormControlLabel control={<Switch checked />}         label="On — setting is enabled" />
      </Stack>

      {/* Label placement */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Label placement</Typography>
        <FormControlLabel
          control={<Switch checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
          label="End placement (default) — standard settings row"
        />
        <FormControlLabel
          labelPlacement="start"
          control={<Switch checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
          label="Start placement — right-aligned in two-column layouts"
          sx={{ ml: 0, justifyContent: 'space-between' }}
        />
      </Stack>

      {/* States */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">States — disabled</Typography>
        <FormControlLabel control={<Switch disabled />}         label="Disabled — off" />
        <FormControlLabel control={<Switch disabled checked />} label="Disabled — on" />
      </Stack>

      {/* Settings panel — instant on/off */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Settings panel — instant toggles</Typography>
        <Stack divider={<Divider flexItem />}>
          <FormControlLabel
            control={
              <Switch
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
            }
            label="Send weekly digest"
            sx={{ ml: 0, justifyContent: 'space-between' }}
            labelPlacement="start"
          />
          <FormControlLabel
            control={
              <Switch
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
              />
            }
            label="Auto-sync sources"
            sx={{ ml: 0, justifyContent: 'space-between' }}
            labelPlacement="start"
          />
          <FormControlLabel
            control={
              <Switch
                checked={metrics}
                onChange={(e) => setMetrics(e.target.checked)}
              />
            }
            label="Share usage metrics"
            sx={{ ml: 0, justifyContent: 'space-between' }}
            labelPlacement="start"
          />
          <FormControlLabel
            control={<Switch disabled checked />}
            label="Maintenance mode (locked by admin)"
            sx={{ ml: 0, justifyContent: 'space-between' }}
            labelPlacement="start"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
