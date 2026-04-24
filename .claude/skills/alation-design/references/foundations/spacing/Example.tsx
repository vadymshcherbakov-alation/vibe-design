import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

// Every gap, padding, and margin comes from `theme.spacing(n)` — the numeric
// `sx` shorthand (`p: 2`, `gap: 1.5`) resolves to the same scale. This preview
// shows each scale value as a visible bar, then the canonical page-body layout.

const SCALE: Array<{ n: number; label: string; usage: string }> = [
  { n: 0.5, label: '0.5 · 4px',  usage: 'Icon-to-label leading' },
  { n: 1,   label: '1 · 8px',    usage: 'Tight cluster (chip gap)' },
  { n: 1.5, label: '1.5 · 12px', usage: 'Compact form stack' },
  { n: 2,   label: '2 · 16px',   usage: 'Card / Paper inner padding' },
  { n: 2.5, label: '2.5 · 20px', usage: 'Spacious card padding' },
  { n: 3,   label: '3 · 24px',   usage: 'Form field stack, section break' },
  { n: 4,   label: '4 · 32px',   usage: 'Page body padding' },
  { n: 5,   label: '5 · 40px',   usage: 'Large section separation' },
  { n: 6,   label: '6 · 48px',   usage: 'Empty-state rhythm' },
  { n: 8,   label: '8 · 64px',   usage: 'Page hero / splash padding' },
];

export default function SpacingExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Scale — each bar is `theme.spacing(n)` wide</Typography>
        <Stack spacing={1.5}>
          {SCALE.map(({ n, label, usage }) => (
            <Box
              key={n}
              sx={{ display: 'grid', gridTemplateColumns: '140px 1fr 260px', alignItems: 'center', gap: 2 }}
            >
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Box sx={{ width: (theme) => theme.spacing(n), height: 16, bgcolor: 'primary.main', borderRadius: 1 }} />
              <Typography variant="caption" color="text.secondary">{usage}</Typography>
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Canonical page-body layout</Typography>
        <Box sx={{ p: 4, bgcolor: 'background.default', borderRadius: 2 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: 520 }}>
            <Stack spacing={3}>
              <TextField label="Name" fullWidth />
              <TextField label="Description" fullWidth multiline minRows={3} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained">Save</Button>
                <Button variant="outlined" color="inherit">Cancel</Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Stack>
  );
}
