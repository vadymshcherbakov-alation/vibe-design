import { Box, Button, Chip, IconButton, Stack, TextField, InputAdornment, Typography } from '@mui/material';
import {
  Bot,
  Database,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  Table,
  Trash2,
  Workflow,
} from 'lucide-react';

// Icons in the `@repo/ui` prototype come from `lucide-react`; production uses
// `@alation/icons-neo`. Both share the same API shape — the icon is rendered
// inside an Alation container (IconButton, Button startIcon, Chip icon, etc.)
// and the container drives the size via the theme (`iconXSmall`..`iconLarge`).
// Do NOT pass `size={…}` on an icon inside an Alation container.

export default function IconographyExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes — container wins</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="xsmall" aria-label="More (xsmall)"><MoreVertical /></IconButton>
          <IconButton size="small"  aria-label="More (small)"><MoreVertical /></IconButton>
          <IconButton size="medium" aria-label="More (medium)"><MoreVertical /></IconButton>
          <IconButton size="large"  aria-label="More (large)"><MoreVertical /></IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          xsmall 1.2rem · small 1.6rem · medium 2rem · large 2.4rem
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">In-context usage</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button variant="contained" startIcon={<Plus />}>Build agent</Button>
          <Button variant="outlined" startIcon={<Pencil />}>Edit</Button>
          <Chip icon={<Database size={16} />} label="PostgreSQL" variant="outlined" />
          <TextField
            placeholder="Search"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} aria-hidden="true" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton size="small" color="error" aria-label="Delete"><Trash2 /></IconButton>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Common lucide icons — browse the full set at lucide.dev/icons</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
          {[
            { Icon: Database, name: 'Database' },
            { Icon: Bot, name: 'Bot' },
            { Icon: Workflow, name: 'Workflow' },
            { Icon: Table, name: 'Table' },
            { Icon: Settings, name: 'Settings' },
            { Icon: Search, name: 'Search' },
            { Icon: Plus, name: 'Plus' },
            { Icon: Pencil, name: 'Pencil' },
            { Icon: Trash2, name: 'Trash2' },
            { Icon: MoreVertical, name: 'MoreVertical' },
          ].map(({ Icon, name }) => (
            <Stack key={name} alignItems="center" spacing={0.5} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Icon size={20} aria-hidden="true" />
              <Typography variant="caption" color="text.secondary">{name}</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}
