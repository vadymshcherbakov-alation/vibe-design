import { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

export default function RadioExample() {
  const [cadence, setCadence] = useState('hourly');
  const [format, setFormat] = useState('csv');
  const [access, setAccess] = useState('team');

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Named styles axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Named styles · selection state</Typography>
        <RadioGroup value="picked" name="named-styles">
          <FormControlLabel value="unpicked" control={<Radio />} label="Unselected — available, not chosen" />
          <FormControlLabel value="picked"   control={<Radio />} label="Selected — the current choice" />
        </RadioGroup>
      </Stack>

      {/* Vertical group — the default shape */}
      <FormControl>
        <FormLabel id="cadence-label">Sync cadence</FormLabel>
        <RadioGroup
          aria-labelledby="cadence-label"
          name="cadence"
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
        >
          <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
          <FormControlLabel value="daily"  control={<Radio />} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
        </RadioGroup>
      </FormControl>

      {/* Horizontal group — short labels only */}
      <FormControl>
        <FormLabel id="format-label">Export format</FormLabel>
        <RadioGroup
          row
          aria-labelledby="format-label"
          name="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <FormControlLabel value="csv"  control={<Radio />} label="CSV" />
          <FormControlLabel value="json" control={<Radio />} label="JSON" />
          <FormControlLabel value="xlsx" control={<Radio />} label="XLSX" />
        </RadioGroup>
      </FormControl>

      {/* Per-option helper (caption under the label) */}
      <FormControl>
        <FormLabel id="access-label">Access level</FormLabel>
        <RadioGroup
          aria-labelledby="access-label"
          name="access"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
        >
          <FormControlLabel
            value="private"
            control={<Radio />}
            label={
              <Stack>
                <Typography variant="body2">Private</Typography>
                <Typography variant="caption" color="text.secondary">
                  Only you can see and edit this catalog object.
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            value="team"
            control={<Radio />}
            label={
              <Stack>
                <Typography variant="body2">Team</Typography>
                <Typography variant="caption" color="text.secondary">
                  Recommended — your team can view and edit.
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            value="public"
            control={<Radio />}
            label={
              <Stack>
                <Typography variant="body2">Public</Typography>
                <Typography variant="caption" color="text.secondary">
                  Everyone in the organisation can view.
                </Typography>
              </Stack>
            }
          />
        </RadioGroup>
      </FormControl>

      {/* States */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">States — disabled</Typography>
        <RadioGroup value="locked" name="states">
          <FormControlLabel value="locked"   control={<Radio disabled />} label="Disabled — selected" />
          <FormControlLabel value="locked-2" control={<Radio disabled />} label="Disabled — unselected" />
        </RadioGroup>
      </Stack>
    </Stack>
  );
}
