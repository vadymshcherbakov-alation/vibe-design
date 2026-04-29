import { Box, Button, Chip, IconButton, Stack, TextField, InputAdornment, Typography } from '@mui/material';

// Primary — Lucide Library. Always check `lucide-react` FIRST.
import {
  EllipsisVertical,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Table,
  Trash2,
} from 'lucide-react';

// Backfill — Custom Library. Use ONLY for icons not in Lucide — typically
// Alation-specific concepts (Agent, Flow, Workflow, brand marks).
import {
  AgentIcon,
  FlowIcon,
  CdeIcon,
} from '@alation/icons-neo';

// Iconography contract:
// 1) Lucide Library (`lucide-react`) is primary — always check first.
// 2) Custom Library (`@alation/icons-neo`) is the backfill, used only when
//    Lucide does not have a suitable icon (typically Alation-specific concepts).
// 3) The Alation container (IconButton, Button startIcon, Chip icon, etc.)
//    drives the size via theme tokens (iconXSmall..iconLarge). Never pass
//    `size={…}` on an icon inside an Alation container.

export default function IconographyExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Sizes — container wins</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="xsmall" aria-label="Edit (xsmall)"><Pencil /></IconButton>
          <IconButton size="small"  aria-label="Edit (small)"><Pencil /></IconButton>
          <IconButton size="medium" aria-label="Edit (medium)"><Pencil /></IconButton>
          <IconButton size="large"  aria-label="Edit (large)"><Pencil /></IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          xsmall 1.2rem · small 1.6rem · medium 2rem · large 2.4rem
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">In-context — Lucide Library (primary)</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button variant="contained" startIcon={<Plus />}>Build agent</Button>
          <Button variant="outlined" startIcon={<Pencil />}>Edit</Button>
          <Chip icon={<Table size={16} />} label="Tables" variant="outlined" />
          <TextField
            placeholder="Search"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search aria-hidden="true" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton size="small" color="error" aria-label="Delete"><Trash2 /></IconButton>
          <IconButton size="small" aria-label="More actions"><EllipsisVertical /></IconButton>
          <Button variant="text" startIcon={<Sparkles />}>Generate with AI</Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">In-context — Custom Library (backfill, Alation-specific)</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button variant="contained" startIcon={<AgentIcon />}>Open Agent</Button>
          <IconButton size="small" aria-label="Open flow"><FlowIcon /></IconButton>
          <IconButton size="small" aria-label="Open CD Manager"><CdeIcon /></IconButton>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Lucide Library samples — browse the full set at lucide.dev/icons
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
          {[
            { Icon: Plus, name: 'Plus' },
            { Icon: Search, name: 'Search' },
            { Icon: Pencil, name: 'Pencil' },
            { Icon: Trash2, name: 'Trash2' },
            { Icon: EllipsisVertical, name: 'EllipsisVertical' },
            { Icon: Settings, name: 'Settings' },
            { Icon: Sparkles, name: 'Sparkles' },
            { Icon: Table, name: 'Table' },
          ].map(({ Icon, name }) => (
            <Stack key={name} alignItems="center" spacing={0.5} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Icon size={20} aria-hidden="true" />
              <Typography variant="caption" color="text.secondary">{name}</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Custom Library samples — Alation-specific concepts not in Lucide
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
          {[
            { Icon: AgentIcon, name: 'AgentIcon' },
            { Icon: FlowIcon, name: 'FlowIcon' },
            { Icon: CdeIcon, name: 'CdeIcon' },
          ].map(({ Icon, name }) => (
            <Stack key={name} alignItems="center" spacing={0.5} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Icon aria-hidden="true" />
              <Typography variant="caption" color="text.secondary">{name}</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}
