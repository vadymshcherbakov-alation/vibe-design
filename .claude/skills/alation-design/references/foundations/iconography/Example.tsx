import { Box, Button, Chip, IconButton, Stack, TextField, InputAdornment, Typography } from '@mui/material';

// Primary — Custom Library. Always check `@alation/icons-neo` FIRST.
import {
  AgentIcon,
  DatabaseIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
  TrashIcon,
  WorkflowIcon,
} from '@alation/icons-neo';

// Backfill — Lucide Library. Use ONLY for icons not yet shipped by the Custom Library.
import { EllipsisVertical, PanelLeftClose } from 'lucide-react';

// Iconography contract:
// 1) Custom Library (`@alation/icons-neo`) is primary — always check first.
// 2) Lucide Library (`lucide-react`) is the backfill, used only when an icon
//    is not yet in the Custom Library.
// 3) The Alation container (IconButton, Button startIcon, Chip icon, etc.)
//    drives the size via theme tokens (iconXSmall..iconLarge). Never pass
//    `size={…}` on an icon inside an Alation container.

export default function IconographyExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes — container wins</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="xsmall" aria-label="More (xsmall)"><PencilIcon /></IconButton>
          <IconButton size="small"  aria-label="More (small)"><PencilIcon /></IconButton>
          <IconButton size="medium" aria-label="More (medium)"><PencilIcon /></IconButton>
          <IconButton size="large"  aria-label="More (large)"><PencilIcon /></IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          xsmall 1.2rem · small 1.6rem · medium 2rem · large 2.4rem
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">In-context — Custom Library (primary)</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button variant="contained" startIcon={<PlusIcon />}>Build agent</Button>
          <Button variant="outlined" startIcon={<PencilIcon />}>Edit</Button>
          <Chip icon={<DatabaseIcon />} label="PostgreSQL" variant="outlined" />
          <TextField
            placeholder="Search"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon aria-hidden="true" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton size="small" color="error" aria-label="Delete"><TrashIcon /></IconButton>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">In-context — Lucide Library (backfill, only when not in Custom)</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <IconButton size="small" aria-label="More actions"><EllipsisVertical /></IconButton>
          <IconButton size="small" aria-label="Collapse panel"><PanelLeftClose /></IconButton>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Custom Library samples — full export list in @alation/icons-neo/src/index.ts
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
          {[
            { Icon: DatabaseIcon, name: 'DatabaseIcon' },
            { Icon: AgentIcon, name: 'AgentIcon' },
            { Icon: WorkflowIcon, name: 'WorkflowIcon' },
            { Icon: TableIcon, name: 'TableIcon' },
            { Icon: SettingsIcon, name: 'SettingsIcon' },
            { Icon: SearchIcon, name: 'SearchIcon' },
            { Icon: PlusIcon, name: 'PlusIcon' },
            { Icon: PencilIcon, name: 'PencilIcon' },
            { Icon: TrashIcon, name: 'TrashIcon' },
          ].map(({ Icon, name }) => (
            <Stack key={name} alignItems="center" spacing={0.5} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Icon aria-hidden="true" />
              <Typography variant="caption" color="text.secondary">{name}</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Lucide Library samples — only when an icon isn't in the Custom Library
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
          {[
            { Icon: EllipsisVertical, name: 'EllipsisVertical' },
            { Icon: PanelLeftClose, name: 'PanelLeftClose' },
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
