import type { ReactNode } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

// Pages render inside the main area of `AlationLayout`. The shell (sidebar,
// header, sub-nav) is provided by the template — pages only author what's inside
// the main area: a `<PageHeaderSection>` + a padded body.
//
// `PageHeaderSection` is not a shared component in @alation/alation-ui; it lives
// per consumer app. Inlined here as a local helper to match the canonical layout.

function PageHeaderSection({
  children,
  hideBorder = false,
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
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function LayoutExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Form page — maxWidth 640</Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <PageHeaderSection>
            <Typography variant="h1">Settings</Typography>
            <Button variant="contained">Save</Button>
          </PageHeaderSection>
          <Box sx={{ p: 4 }}>
            <Box sx={{ maxWidth: 640 }}>
              <Stack spacing={3}>
                <TextField label="Display name" fullWidth />
                <TextField label="Email" type="email" fullWidth />
                <TextField label="Bio" fullWidth multiline minRows={3} />
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Content page — maxWidth 960</Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <PageHeaderSection>
            <Typography variant="h1">Data sources</Typography>
          </PageHeaderSection>
          <Box sx={{ p: 4 }}>
            <Box sx={{ maxWidth: 960 }}>
              <Typography variant="body1">
                Content-heavy pages cap at 960. Wider panels (tables, dashboards) can run full-bleed
                inside the main area; everything else honours this rule so long-form reading stays comfortable.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Full-bleed — dashboards / data tables</Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <PageHeaderSection>
            <Typography variant="h1">Quality issues</Typography>
          </PageHeaderSection>
          <Box sx={{ p: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1">Issues queue</Typography>
              <Typography variant="body2" color="text.secondary">
                No maxWidth — fills the main area.
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Stack>
    </Stack>
  );
}
