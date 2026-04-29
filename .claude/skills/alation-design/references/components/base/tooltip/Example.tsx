import { IconButton, Stack, Tooltip, Typography, Box } from '@mui/material';
import { MoreVertical, Copy, Filter, Trash2 } from 'lucide-react';

export default function TooltipExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Default — icon-only label</Typography>
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="More actions">
            <IconButton size="small" aria-label="More actions">
              <MoreVertical />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy link">
            <IconButton size="small" aria-label="Copy link">
              <Copy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton size="small" aria-label="Filter">
              <Filter />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Placements</Typography>
        <Stack direction="row" spacing={3} sx={{ py: 4 }}>
          <Tooltip title="Top placement" placement="top">
            <Typography variant="body2">top</Typography>
          </Tooltip>
          <Tooltip title="Bottom placement" placement="bottom">
            <Typography variant="body2">bottom</Typography>
          </Tooltip>
          <Tooltip title="Left placement" placement="left">
            <Typography variant="body2">left</Typography>
          </Tooltip>
          <Tooltip title="Right placement" placement="right">
            <Typography variant="body2">right</Typography>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Arrow vs no-arrow</Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Arrow (theme default)">
            <IconButton size="small" aria-label="Delete">
              <Trash2 />
            </IconButton>
          </Tooltip>
          <Tooltip title="No arrow" arrow={false}>
            <IconButton size="small" aria-label="Delete">
              <Trash2 />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">describeChild — visible label needs more context</Typography>
        <Tooltip title="Delete this data source permanently" describeChild>
          <Box component="span" sx={{ display: 'inline-flex' }}>
            <IconButton size="small" color="error" aria-label="Delete">
              <Trash2 />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Single-line — short phrase ≤ ~60 characters</Typography>
        <Tooltip title="Copy table name to clipboard">
          <IconButton size="small" aria-label="Copy table name">
            <Copy />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          Multi-line — 2–3 line clarification (~60–300 characters, wraps automatically at MUI's 300px max-width)
        </Typography>
        <Tooltip title="Published items are visible to everyone in the workspace and count toward the data product score. Unpublishing reverts both.">
          <IconButton size="small" aria-label="Publish status help">
            <Filter />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Truncated text — tooltip reveals full value</Typography>
        <Tooltip title="finance_production_snowflake_warehouse_us_east">
          <Typography
            variant="body2"
            sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            finance_production_snowflake_warehouse_us_east
          </Typography>
        </Tooltip>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Disabled trigger — wrap in span</Typography>
        <Tooltip title="Complete all required fields to save">
          <Box component="span" sx={{ display: 'inline-flex' }}>
            <IconButton size="small" aria-label="Save" disabled>
              <Copy />
            </IconButton>
          </Box>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
