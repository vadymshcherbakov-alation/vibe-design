import { useState } from 'react';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Search } from 'lucide-react';

export default function TextFieldExample() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [port, setPort] = useState('');
  const [query, setQuery] = useState('');

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Single-line (default)</Typography>
        <TextField
          label="Connection name"
          required
          helperText="Used in connection URLs and logs"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Multi-line</Typography>
        <TextField
          label="Description"
          multiline
          minRows={3}
          maxRows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Typed — password / number</Typography>
        <Stack direction="row" spacing={2}>
          <TextField label="Password" type="password" fullWidth />
          <TextField
            label="Port"
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            sx={{ width: 160 }}
          />
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Search (with adornment)</Typography>
        <TextField
          label="Search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Error / Disabled</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Email"
            error
            helperText="Enter a valid email address"
            defaultValue="not-an-email"
            fullWidth
          />
          <TextField label="Locked" disabled value="read-only value" fullWidth />
        </Stack>
      </Stack>
    </Stack>
  );
}
