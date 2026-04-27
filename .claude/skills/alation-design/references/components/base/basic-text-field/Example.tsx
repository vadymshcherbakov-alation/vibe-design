import { useState } from 'react';
import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ExternalLink, Eye, EyeOff, Search, X } from 'lucide-react';

export default function BasicTextFieldExample() {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('finance_prod');
  const [password, setPassword] = useState('s3cret-handshake');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      {/* Adornment axis */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Adornment · none (default)</Typography>
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
        <Typography variant="overline" color="text.secondary">Adornment · leading icon (Search)</Typography>
        <TextField
          label="Search objects"
          type="search"
          placeholder="Name, owner, tag…"
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
        <Typography variant="overline" color="text.secondary">Adornment · trailing icon (ExternalLink)</Typography>
        <TextField
          label="Webhook URL"
          type="url"
          defaultValue="https://hooks.example.com/endpoint"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ExternalLink size={16} aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Adornment · leading + trailing (Search + Clear)</Typography>
        <TextField
          label="Search objects"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} aria-hidden="true" />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                >
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
          fullWidth
        />
      </Stack>

      {/* Password visibility */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Password visibility · toggle</Typography>
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Stack>

      {/* States */}
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
          <TextField label="Locked" disabled value="finance_prod" fullWidth />
        </Stack>
      </Stack>
    </Stack>
  );
}
