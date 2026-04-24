import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

// Colours are consumed via `theme.palette.*` — never hard-coded.
// This preview renders each semantic token from the theme so the reader
// can see what they get when they reach for `primary.main`, `text.secondary`, etc.

type SwatchProps = {
  label: string;
  token: string;
  bg: string;
  fg?: string;
  border?: string;
};

function Swatch({ label, token, bg, fg, border }: SwatchProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: bg,
        color: fg ?? 'text.primary',
        border: border ? `1px solid ${border}` : undefined,
        minHeight: 72,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 500 }}>{label}</Typography>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>{token}</Typography>
    </Paper>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">{title}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 2,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

export default function ColoursExample() {
  const theme = useTheme();
  const p = theme.palette;

  return (
    <Stack spacing={4}>
      <Group title="Text on background.paper">
        <Swatch label="text.primary"   token={p.text.primary}   bg="background.paper" fg="text.primary" />
        <Swatch label="text.secondary" token={p.text.secondary} bg="background.paper" fg="text.secondary" />
        <Swatch label="text.disabled"  token={p.text.disabled}  bg="background.paper" fg="text.disabled" />
      </Group>

      <Group title="Primary / Info (blue)">
        <Swatch label="primary.main"  token={p.primary.main}  bg="primary.main"  fg="primary.contrastText" />
        <Swatch label="primary.dark"  token={p.primary.dark}  bg="primary.dark"  fg="primary.contrastText" />
        <Swatch label="primary.light" token={p.primary.light} bg="primary.light" fg="text.primary" />
      </Group>

      <Group title="Success / Error / Warning">
        <Swatch label="success.main" token={p.success.main} bg="success.main" fg="success.contrastText" />
        <Swatch label="error.main"   token={p.error.main}   bg="error.main"   fg="error.contrastText" />
        <Swatch label="warning.main" token={p.warning.main} bg="warning.main" fg="text.primary" />
      </Group>

      <Group title="Neutral (Grey) — shared scale">
        <Swatch label="grey.100" token={p.grey[100]} bg="grey.100" />
        <Swatch label="grey.300" token={p.grey[300]} bg="grey.300" />
        <Swatch label="grey.500" token={p.grey[500]} bg="grey.500" fg="common.white" />
        <Swatch label="grey.700" token={p.grey[700]} bg="grey.700" fg="common.white" />
        <Swatch label="grey.900" token={p.grey[900]} bg="grey.900" fg="common.white" />
      </Group>

      <Group title="Background surfaces">
        <Swatch label="background.default" token={p.background.default} bg="background.default" />
        <Swatch label="background.paper"   token={p.background.paper}   bg="background.paper" />
      </Group>
    </Stack>
  );
}
