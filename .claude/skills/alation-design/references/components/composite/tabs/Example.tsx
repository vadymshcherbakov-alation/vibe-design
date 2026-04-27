import { useState } from 'react';
import {
  Box,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { Activity, FileText, GitBranch, Layers, List } from 'lucide-react';

export default function TabsExample() {
  const [page, setPage] = useState('imported');
  const [obj, setObj] = useState('overview');
  const [scroll, setScroll] = useState('all');
  const [vertical, setVertical] = useState('email');

  return (
    <Stack spacing={4} sx={{ maxWidth: 880 }}>
      {/* Variant — Horizontal · standard · with plain count badges (page-header pairing).
          Composition mirrors page-header Variant C exactly — the Page Header drops its
          border (`hideBorder` + `pb: 1`) and a wrapping <Box px=3 borderBottom=1> around
          <Tabs> owns the underline. Padding numbers must match the page-header preview. */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Horizontal · standard · plain count badges (page-header pairing — see Page Header Variant C)
        </Typography>
        <Box>
          {/* PageHeaderSection-equivalent: padding 24px 24px 8px 24px, no border-bottom */}
          <Box sx={{ px: 3, pt: 3, pb: 1 }}>
            <Typography variant="h1">MCP servers</Typography>
          </Box>
          {/* Tabs row: px: 3 to align with the header padding, border-bottom on the wrapping Box */}
          <Box sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={page}
              onChange={(_, v) => setPage(v)}
              aria-label="MCP server views"
            >
              <Tab
                value="imported"
                id="tab-imported"
                aria-controls="panel-imported"
                label={<>Imported <span className="MuiTab-status">12</span></>}
              />
              <Tab
                value="published"
                id="tab-published"
                aria-controls="panel-published"
                label={<>Published <span className="MuiTab-status">4</span></>}
              />
            </Tabs>
          </Box>
          <Box
            role="tabpanel"
            id={`panel-${page}`}
            aria-labelledby={`tab-${page}`}
            sx={{ p: 3 }}
          >
            <Typography variant="body1">
              {page === 'imported'
                ? 'Imported servers panel — list of servers connected from the marketplace.'
                : 'Published servers panel — servers your team has published.'}
            </Typography>
          </Box>
        </Box>
      </Stack>

      {/* Variant — Horizontal · text + leading icon · catalog-object detail */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Horizontal · text + leading icon (catalog-object detail)
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={obj}
            onChange={(_, v) => setObj(v)}
            aria-label="Object detail views"
          >
            <Tab
              value="overview"
              id="tab-overview"
              aria-controls="panel-overview"
              icon={<FileText size={16} />}
              iconPosition="start"
              label="Overview"
            />
            <Tab
              value="schema"
              id="tab-schema"
              aria-controls="panel-schema"
              icon={<Layers size={16} />}
              iconPosition="start"
              label="Schema"
            />
            <Tab
              value="lineage"
              id="tab-lineage"
              aria-controls="panel-lineage"
              icon={<GitBranch size={16} />}
              iconPosition="start"
              label="Lineage"
            />
            <Tooltip title="Connect a source to see quality">
              <span>
                <Tab
                  value="quality"
                  id="tab-quality"
                  aria-controls="panel-quality"
                  icon={<Activity size={16} />}
                  iconPosition="start"
                  label="Quality"
                  disabled
                />
              </span>
            </Tooltip>
          </Tabs>
        </Box>
      </Stack>

      {/* Variant — Scrollable */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Scrollable · overflow with scroll buttons
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: 480 }}>
          <Tabs
            value={scroll}
            onChange={(_, v) => setScroll(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Run filter views"
          >
            <Tab value="all"      id="tab-all"      aria-controls="panel-all"      label="All runs" />
            <Tab value="failed"   id="tab-failed"   aria-controls="panel-failed"   label="Failed" />
            <Tab value="running"  id="tab-running"  aria-controls="panel-running"  label="In progress" />
            <Tab value="cancel"   id="tab-cancel"   aria-controls="panel-cancel"   label="Cancelled" />
            <Tab value="success"  id="tab-success"  aria-controls="panel-success"  label="Successful" />
            <Tab value="skipped"  id="tab-skipped"  aria-controls="panel-skipped"  label="Skipped" />
            <Tab value="archived" id="tab-archived" aria-controls="panel-archived" label="Archived" />
          </Tabs>
        </Box>
      </Stack>

      {/* Variant — Vertical · settings layout */}
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Vertical · settings layout
        </Typography>
        <Box
          sx={{
            display: 'flex',
            minHeight: 240,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Tabs
            orientation="vertical"
            value={vertical}
            onChange={(_, v) => setVertical(v)}
            aria-label="Notification settings"
            sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
          >
            <Tab value="email"   id="tab-email"   aria-controls="panel-email"   label="Email" />
            <Tab value="in-app"  id="tab-in-app"  aria-controls="panel-in-app"  label="In-app" />
            <Tab value="slack"   id="tab-slack"   aria-controls="panel-slack"   icon={<List size={16} />} iconPosition="start" label="Slack" />
            <Tab value="webhook" id="tab-webhook" aria-controls="panel-webhook" label="Webhooks" />
          </Tabs>
          <Box
            role="tabpanel"
            id={`panel-${vertical}`}
            aria-labelledby={`tab-${vertical}`}
            sx={{ flex: 1, p: 3 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {vertical === 'email'   && 'Email notifications'}
              {vertical === 'in-app'  && 'In-app notifications'}
              {vertical === 'slack'   && 'Slack delivery'}
              {vertical === 'webhook' && 'Webhook delivery'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Settings for the selected channel.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
