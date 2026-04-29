import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ChevronLeft, MoreVertical, Play, Plus } from 'lucide-react';

// Page header shell. In production this is a thin wrapper around a <Box> with
// padding + bottom divider. Inline here so Example.tsx has no consumer-only imports.
function PageHeaderSection({
  children,
  hideBorder,
  sx,
}: {
  children: ReactNode;
  hideBorder?: boolean;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        pt: 3,
        px: 3,
        pb: 2.5,
        borderBottom: hideBorder ? 'none' : 1,
        borderColor: 'divider',
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}

// Reusable right-side actions group used in examples 2–5.
function ActionsGroup({
  primaryLabel,
  primaryIcon,
  showSecondary = true,
}: {
  primaryLabel: string;
  primaryIcon: ReactNode;
  showSecondary?: boolean;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" color="inherit">Export</Button>
      {showSecondary ? <Button variant="outlined" color="primary">Share</Button> : null}
      <Button variant="contained" color="primary" startIcon={primaryIcon}>
        {primaryLabel}
      </Button>
      <IconButton size="medium" aria-label="More actions">
        <MoreVertical />
      </IconButton>
    </Stack>
  );
}

// ── Example 1: Title only (baseline) ──────────────────────────────────────────
function Example1TitleOnly() {
  return (
    <PageHeaderSection>
      <Typography variant="h1">Browse agents</Typography>
    </PageHeaderSection>
  );
}

// ── Example 2: Title + actions group ──────────────────────────────────────────
function Example2TitleAndActions() {
  return (
    <PageHeaderSection>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h1">Browse agents</Typography>
        <ActionsGroup primaryLabel="Build agent" primaryIcon={<Plus size={16} />} />
      </Box>
    </PageHeaderSection>
  );
}

// ── Example 3: Title + Breadcrumb (Back to parent) + actions group ────────────
function Example3WithBreadcrumb() {
  return (
    <PageHeaderSection>
      <Box component="nav" aria-label="Back to monitors" sx={{ mb: 1 }}>
        <Link
          component="button"
          color="text.secondary"
          underline="hover"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, font: 'inherit' }}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Monitors
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h1">Daily freshness check</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" color="inherit">Export</Button>
          <Button variant="contained" color="primary" startIcon={<Play size={14} />}>
            Run now
          </Button>
          <IconButton size="medium" aria-label="More actions">
            <MoreVertical />
          </IconButton>
        </Stack>
      </Box>
    </PageHeaderSection>
  );
}

// ── Example 4: + Label Chip ───────────────────────────────────────────────────
function Example4WithLabelChip() {
  return (
    <PageHeaderSection>
      <Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
        <Link color="text.secondary" underline="hover">Datasources</Link>
        <Link color="text.secondary" underline="hover">finance_prod</Link>
        <Typography color="text.primary" aria-current="page">Orders</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h1">Orders</Typography>
          <Chip label="Certified" color="success" variant="filledLight" size="xsmall" />
        </Box>
        <ActionsGroup primaryLabel="Add to data product" primaryIcon={<Plus size={16} />} />
      </Box>
    </PageHeaderSection>
  );
}

// ── Example 5: + Tabs (full composition) ──────────────────────────────────────
function Example5WithTabs() {
  const [tab, setTab] = useState('overview');
  return (
    <>
      <PageHeaderSection hideBorder sx={{ pb: 1 }}>
        <Breadcrumbs aria-label="Object trail" sx={{ mb: 1 }}>
          <Link color="text.secondary" underline="hover">Datasources</Link>
          <Link color="text.secondary" underline="hover">finance_prod</Link>
          <Typography color="text.primary" aria-current="page">Orders</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h1">Orders</Typography>
            <Chip label="Certified" color="success" variant="filledLight" size="xsmall" />
          </Box>
          <ActionsGroup primaryLabel="Add to data product" primaryIcon={<Plus size={16} />} showSecondary={false} />
        </Box>
      </PageHeaderSection>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Object views">
          <Tab label="Overview" value="overview" />
          <Tab label="Schema"   value="schema" />
          <Tab label="Lineage"  value="lineage" />
        </Tabs>
      </Box>
    </>
  );
}

// ── Gallery preview ───────────────────────────────────────────────────────────
export default function PageHeaderExample() {
  const examples: Array<{ title: string; node: ReactNode }> = [
    { title: 'Example 1 · Title only',                                        node: <Example1TitleOnly /> },
    { title: 'Example 2 · + Actions group',                                   node: <Example2TitleAndActions /> },
    { title: 'Example 3 · + Breadcrumb (Back to parent)',                     node: <Example3WithBreadcrumb /> },
    { title: 'Example 4 · + Label Chip',                                      node: <Example4WithLabelChip /> },
    { title: 'Example 5 · + Tabs (full composition)',                         node: <Example5WithTabs /> },
  ];

  return (
    <Stack spacing={4}>
      {examples.map(({ title, node }) => (
        <Box key={title}>
          <Typography variant="overline" color="text.secondary">{title}</Typography>
          <Paper variant="outlined" sx={{ mt: 1, overflow: 'hidden' }}>{node}</Paper>
        </Box>
      ))}
    </Stack>
  );
}
