import { useState } from 'react';
import { ListItemIcon, ListSubheader, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Globe, Lock, Users } from 'lucide-react';

export default function SelectInputExample() {
  const [dbType, setDbType] = useState('postgres');
  const [access, setAccess] = useState('team');
  const [region, setRegion] = useState('');
  const [flatRegion, setFlatRegion] = useState('us');
  const [driver, setDriver] = useState('postgres');

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* 5.1 Leading icon on items */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Leading icon on items · without (default)
        </Typography>
        <TextField
          select
          label="Database type"
          helperText="Determines the connection driver"
          required
          value={dbType}
          onChange={(e) => setDbType(e.target.value)}
          fullWidth
        >
          <MenuItem value="postgres">PostgreSQL</MenuItem>
          <MenuItem value="mysql">MySQL</MenuItem>
          <MenuItem value="snowflake">Snowflake</MenuItem>
        </TextField>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Leading icon on items · with
        </Typography>
        <TextField
          select
          label="Access level"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          fullWidth
        >
          <MenuItem value="private">
            <ListItemIcon><Lock aria-hidden="true" size={16} /></ListItemIcon>
            Private
          </MenuItem>
          <MenuItem value="team">
            <ListItemIcon><Users aria-hidden="true" size={16} /></ListItemIcon>
            Team
          </MenuItem>
          <MenuItem value="public">
            <ListItemIcon><Globe aria-hidden="true" size={16} /></ListItemIcon>
            Public
          </MenuItem>
        </TextField>
      </Stack>

      {/* 5.2 Grouping */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Grouping · flat (default)
        </Typography>
        <TextField
          select
          label="Region"
          value={flatRegion}
          onChange={(e) => setFlatRegion(e.target.value)}
          fullWidth
        >
          <MenuItem value="us">Americas</MenuItem>
          <MenuItem value="eu">EMEA</MenuItem>
          <MenuItem value="apac">APAC</MenuItem>
        </TextField>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Grouping · grouped (with ListSubheader)
        </Typography>
        <TextField
          select
          label="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          fullWidth
        >
          <MenuItem value=""><em>Select a region…</em></MenuItem>
          <ListSubheader>Americas</ListSubheader>
          <MenuItem value="us-east">US East</MenuItem>
          <MenuItem value="us-west">US West</MenuItem>
          <ListSubheader>EMEA</ListSubheader>
          <MenuItem value="eu-central">EU Central</MenuItem>
          <MenuItem value="eu-west">EU West</MenuItem>
          <ListSubheader>APAC</ListSubheader>
          <MenuItem value="ap-south">AP South</MenuItem>
          <MenuItem value="ap-northeast">AP Northeast</MenuItem>
        </TextField>
      </Stack>

      {/* 5.3 Prompt row + 5.4 size */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Size · small (dense forms)
        </Typography>
        <TextField
          select
          label="Driver"
          size="small"
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          fullWidth
        >
          <MenuItem value="postgres">PostgreSQL</MenuItem>
          <MenuItem value="mysql">MySQL</MenuItem>
          <MenuItem value="snowflake">Snowflake</MenuItem>
        </TextField>
      </Stack>

      {/* States */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Error / Disabled</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Access level"
            error
            helperText="Access level is required"
            defaultValue=""
            fullWidth
          >
            <MenuItem value=""><em>Select…</em></MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="team">Team</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </TextField>
          <TextField
            select
            label="Locked"
            disabled
            value="team"
            fullWidth
          >
            <MenuItem value="team">Team</MenuItem>
          </TextField>
        </Stack>
      </Stack>
    </Stack>
  );
}
