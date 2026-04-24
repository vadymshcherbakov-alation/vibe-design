import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Info } from 'lucide-react';

// Field-row shell: label (+ optional info) above input + helper text below.
// This mirrors the composition contract in usage.md — production assembles
// FormControl + InputLabel + one input + FormHelperText directly; this shell
// gives the preview a consistent layout without introducing a shared wrapper.
function FieldRow({
  label,
  info,
  required,
  helperText,
  children,
}: {
  label: string;
  info?: string;
  required?: boolean;
  helperText?: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
        <Typography component="label" variant="subtitle1">
          {label}{required ? ' *' : ''}
        </Typography>
        {info && (
          <Tooltip title={info}>
            <Info size={14} aria-label="More info" style={{ color: 'var(--mui-palette-text-secondary, #4E4E58)' }} />
          </Tooltip>
        )}
      </Stack>
      {children}
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

export default function FormFieldExample() {
  const [name, setName] = useState('');
  const [dbType, setDbType] = useState('postgres');
  const [cadence, setCadence] = useState('daily');
  const [enabled, setEnabled] = useState(true);

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Text Input — the most common Form Field */}
      <FieldRow
        label="Connection name"
        required
        info="Used in connection URLs, logs, and API calls"
        helperText="Used in connection URLs and logs"
      >
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. production-replica-01"
        />
      </FieldRow>

      {/* Select — single choice from fixed set */}
      <FieldRow label="Database type" helperText="Determines the connection driver">
        <TextField
          select
          fullWidth
          value={dbType}
          onChange={(e) => setDbType(e.target.value)}
        >
          <MenuItem value="postgres">PostgreSQL</MenuItem>
          <MenuItem value="mysql">MySQL</MenuItem>
          <MenuItem value="snowflake">Snowflake</MenuItem>
        </TextField>
      </FieldRow>

      {/* Radio group — 2–5 visible options */}
      <FieldRow label="Sync cadence">
        <FormControl>
          <RadioGroup
            row
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
          >
            <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
            <FormControlLabel value="daily"  control={<Radio />} label="Daily" />
            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          </RadioGroup>
          <FormHelperText>How often Alation refreshes metadata</FormHelperText>
        </FormControl>
      </FieldRow>

      {/* Checkbox — single boolean */}
      <FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          }
          label="Enable scheduled sync"
        />
        <FormHelperText>Sync will run on the cadence selected above</FormHelperText>
      </FormControl>
    </Stack>
  );
}
