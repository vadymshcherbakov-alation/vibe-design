import { useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Stack, Typography } from '@mui/material';

type Source = { id: string; name: string; selected: boolean };

export default function CheckboxExample() {
  const [subscribed, setSubscribed] = useState(true);
  const [agreed, setAgreed] = useState(false);

  const [sources, setSources] = useState<Source[]>([
    { id: 'pg', name: 'PostgreSQL — finance_prod', selected: true },
    { id: 'sf', name: 'Snowflake — analytics', selected: false },
    { id: 'mq', name: 'MySQL — legacy_orders', selected: true },
  ]);

  const allChecked = useMemo(() => sources.every((s) => s.selected), [sources]);
  const someChecked = useMemo(
    () => sources.some((s) => s.selected) && !allChecked,
    [sources, allChecked]
  );

  const toggleAll = () =>
    setSources((rows) => rows.map((r) => ({ ...r, selected: !allChecked })));
  const toggleOne = (id: string) =>
    setSources((rows) => rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Named styles axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Named styles · checked state</Typography>
        <FormControlLabel control={<Checkbox checked={false} />} label="Unchecked" />
        <FormControlLabel control={<Checkbox checked />} label="Checked" />
        <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
      </Stack>

      {/* Size axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes</Typography>
        <FormControlLabel control={<Checkbox size="medium" defaultChecked />} label="Medium (default)" />
        <FormControlLabel control={<Checkbox size="small" defaultChecked />} label="Small — dense rows" />
      </Stack>

      {/* States */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">States</Typography>
        <FormControlLabel control={<Checkbox disabled />} label="Disabled — unchecked" />
        <FormControlLabel control={<Checkbox disabled checked />} label="Disabled — checked" />
      </Stack>

      {/* Single boolean — opt-in */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Single boolean — opt-in</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={subscribed}
              onChange={(e) => setSubscribed(e.target.checked)}
            />
          }
          label="Send me product updates"
        />
        <FormControlLabel
          required
          control={
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          }
          label="I agree to the terms of service"
        />
      </Stack>

      {/* Multi-select with parent indeterminate */}
      <Stack spacing={1}>
        <FormLabel id="sources-label" component={Typography} variant="overline" color="text.secondary">
          Sources — multi-select with select-all
        </FormLabel>
        <FormGroup aria-labelledby="sources-label">
          <FormControlLabel
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={someChecked}
                onChange={toggleAll}
              />
            }
            label="Select all"
          />
          {sources.map((s) => (
            <FormControlLabel
              key={s.id}
              control={
                <Checkbox
                  checked={s.selected}
                  onChange={() => toggleOne(s.id)}
                />
              }
              label={s.name}
            />
          ))}
        </FormGroup>
      </Stack>
    </Stack>
  );
}
