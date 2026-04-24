import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Breadcrumbs, Button, Chip, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AlertCircle, Play, Plus } from 'lucide-react';

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
        px: 3,
        py: 2.5,
        borderBottom: hideBorder ? 'none' : 1,
        borderColor: 'divider',
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}

// ── Variant A: Simple title ───────────────────────────────────────────────────
function SimpleTitleHeader() {
  return (
    <PageHeaderSection>
      <Typography variant="h1">Browse agents</Typography>
    </PageHeaderSection>
  );
}

// ── Variant B: Title with primary action ──────────────────────────────────────
function TitleWithActionHeader() {
  return (
    <PageHeaderSection>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h1">Browse agents</Typography>
        <Button variant="contained" startIcon={<Plus size={16} />}>
          Build agent
        </Button>
      </Box>
    </PageHeaderSection>
  );
}

// ── Variant C: Title with tabs ────────────────────────────────────────────────
function TitleWithTabsHeader() {
  const [tab, setTab] = useState('imported');
  return (
    <>
      <PageHeaderSection hideBorder sx={{ pb: 1 }}>
        <Typography variant="h1">MCP servers</Typography>
      </PageHeaderSection>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Imported servers" value="imported" />
          <Tab label="Published servers" value="published" />
        </Tabs>
      </Box>
    </>
  );
}

// ── Variant D: Breadcrumb + title + badge + action ────────────────────────────
function TitleWithBreadcrumbAndBadgeHeader() {
  const theme = useTheme();
  return (
    <PageHeaderSection>
      <Breadcrumbs sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">Home</Typography>
        <Typography variant="body2" color="text.secondary">Monitors</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h1">Data Contract for FIFA World Cup Test</Typography>
          <Chip
            icon={<AlertCircle size={14} />}
            label="Medium"
            size="small"
            sx={{
              bgcolor: theme.palette.amber[100],
              color: theme.palette.amber[900],
              '& .MuiChip-icon': { color: theme.palette.amber[900] },
            }}
          />
        </Box>
        <Button variant="outlined" startIcon={<Play size={14} />}>
          Run Now
        </Button>
      </Box>
    </PageHeaderSection>
  );
}

// ── Gallery preview ───────────────────────────────────────────────────────────
export default function PageHeaderExample() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" color="text.secondary">Simple title</Typography>
        <Paper variant="outlined" sx={{ mt: 1, overflow: 'hidden' }}>
          <SimpleTitleHeader />
        </Paper>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">Title with primary action</Typography>
        <Paper variant="outlined" sx={{ mt: 1, overflow: 'hidden' }}>
          <TitleWithActionHeader />
        </Paper>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">Title with tabs</Typography>
        <Paper variant="outlined" sx={{ mt: 1, overflow: 'hidden' }}>
          <TitleWithTabsHeader />
        </Paper>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">Title with breadcrumb, badge, and action</Typography>
        <Paper variant="outlined" sx={{ mt: 1, overflow: 'hidden' }}>
          <TitleWithBreadcrumbAndBadgeHeader />
        </Paper>
      </Box>
    </Stack>
  );
}
