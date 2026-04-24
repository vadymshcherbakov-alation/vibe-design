import { Box, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

// Every piece of visible text uses `<Typography variant="…">`.
// This preview renders each variant so the reader sees the role/weight/size
// they're picking when they reach for `h1`, `subtitle1`, `hero`, `body2`, etc.

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" color="text.secondary">{name}</Typography>
      <Box>{children}</Box>
    </Box>
  );
}

export default function TypographyExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="text.secondary">Display &amp; headings</Typography>
        <Row name="hero"><Typography variant="hero">1,284</Typography></Row>
        <Row name="h1"><Typography variant="h1">Page title</Typography></Row>
        <Row name="h2"><Typography variant="h2">Major section title</Typography></Row>
        <Row name="h3"><Typography variant="h3">Section heading</Typography></Row>
        <Row name="h4"><Typography variant="h4">Sub-section heading</Typography></Row>
        <Row name="subtitle1"><Typography variant="subtitle1">Card / panel title</Typography></Row>
        <Row name="subtitle2"><Typography variant="subtitle2">Secondary card label</Typography></Row>
      </Stack>

      <Divider />

      <Stack spacing={1.5}>
        <Typography variant="overline" color="text.secondary">Body &amp; meta</Typography>
        <Row name="body0"><Typography variant="body0">Slightly larger body — used in form-field labels.</Typography></Row>
        <Row name="body1"><Typography variant="body1">Primary body text. Inter, default weight, default line-height.</Typography></Row>
        <Row name="body2"><Typography variant="body2">Secondary body text and descriptions.</Typography></Row>
        <Row name="body2 + text.secondary"><Typography variant="body2" color="text.secondary">Muted helper text.</Typography></Row>
        <Row name="caption"><Typography variant="caption">Updated 2 hours ago</Typography></Row>
        <Row name="overline"><Typography variant="overline">Category label</Typography></Row>
      </Stack>

      <Divider />

      <Stack spacing={1.5}>
        <Typography variant="overline" color="text.secondary">Machine (monospace — JetBrains Mono)</Typography>
        <Row name="machineBody1"><Typography variant="machineBody1">src/lib/MuiTypography.overrides.ts</Typography></Row>
        <Row name="machineBody2"><Typography variant="machineBody2">inline_identifier_42</Typography></Row>
      </Stack>
    </Stack>
  );
}
