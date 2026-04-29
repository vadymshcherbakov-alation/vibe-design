import { Box, Divider, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

// Every piece of visible text uses `<Typography variant="…">`.
// This preview mirrors the Figma "Typography" page — two type families
// and the Figma text-style scale (Header H1–H3, Subtitle 1/2, Body 1/2,
// Button, Mono Body 1/2). MUI variant ↔ Figma text-style mapping is
// shown alongside each row.

function Row({
  variant,
  figma,
  description,
  children,
}: {
  variant: string;
  figma: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '160px 200px 1fr',
        alignItems: 'baseline',
        gap: 3,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography variant="subtitle2">{variant}</Typography>
        <Typography variant="caption" color="text.secondary">
          Figma · {figma}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}

export default function TypographyExample() {
  return (
    <Stack spacing={5}>
      {/* 1. Type families */}
      <Stack spacing={1.5}>
        <Typography variant="overline" color="text.secondary">
          Type families
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            alignItems: 'baseline',
            gap: 3,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="subtitle2">Body</Typography>
            <Typography variant="caption" color="text.secondary">
              font/family/body
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: 'body', fontSize: 22, fontWeight: 500 }}>
            Inter — The quick brown fox jumps over the lazy dog
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            alignItems: 'baseline',
            gap: 3,
            py: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle2">Machine</Typography>
            <Typography variant="caption" color="text.secondary">
              font/family/mono-body
            </Typography>
          </Box>
          <Typography variant="machineBody1" sx={{ fontSize: 18 }}>
            JetBrains Mono — 0x1A2B3C4D5E
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* 2. Type scale — Figma text styles */}
      <Stack spacing={1.5}>
        <Typography variant="overline" color="text.secondary">
          Type scale
        </Typography>
        <Row
          variant="h1"
          figma="Header - H1"
          description="Page titles. One per page, inside the Page Header."
        >
          <Typography variant="h1">Data sources settings</Typography>
        </Row>
        <Row
          variant="h2"
          figma="Header - H2"
          description="Major section title within a page."
        >
          <Typography variant="h2">Connected sources</Typography>
        </Row>
        <Row
          variant="h3"
          figma="Header - H3"
          description="Section heading inside a page or large card."
        >
          <Typography variant="h3">Recent activity</Typography>
        </Row>
        <Row
          variant="subtitle1"
          figma="Subtitle1"
          description="Card and panel titles. Form-field labels."
        >
          <Typography variant="subtitle1">Total catalog objects</Typography>
        </Row>
        <Row
          variant="subtitle2"
          figma="Subtitle2"
          description="Secondary card label · compact heading inside dense surfaces."
        >
          <Typography variant="subtitle2">Last synced 2 hours ago</Typography>
        </Row>
        <Row
          variant="body1"
          figma="Body1"
          description="Default paragraph text. The base reading size."
        >
          <Typography variant="body1">
            Alation indexes tables, columns, and business terms across every source you connect.
          </Typography>
        </Row>
        <Row
          variant="body2"
          figma="Body2"
          description="Secondary body text · descriptions, helper text, dense table rows."
        >
          <Typography variant="body2" color="text.secondary">
            Adds approximately 12,400 tables to the catalog.
          </Typography>
        </Row>
        <Row
          variant="button"
          figma="Button"
          description="Theme-owned · consumed by <Button>. Never pass to Typography directly."
        >
          <Typography variant="button">Connect source</Typography>
        </Row>
        <Row
          variant="machineBody1"
          figma="Mono - Body1"
          description="Monospace body — code, identifiers, hashes."
        >
          <Typography variant="machineBody1">src/lib/MuiTypography.overrides.ts</Typography>
        </Row>
        <Row
          variant="machineBody2"
          figma="Mono - Body2"
          description="Monospace compact — inline code, short identifiers."
        >
          <Typography variant="machineBody2">const data = {`{ key: 'value' }`};</Typography>
        </Row>
      </Stack>
    </Stack>
  );
}
