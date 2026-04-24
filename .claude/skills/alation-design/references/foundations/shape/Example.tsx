import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';

// `theme.shape.borderRadius` is 6 px. `sx={{ borderRadius: n }}` is a multiplier
// — `borderRadius: 2` resolves to 12 px. Elevation uses `<Paper elevation={n}>`;
// prefer `variant="outlined"` for in-content containers.

export default function ShapeExample() {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Radius multipliers</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { n: 0, label: '0 · 0px · squared' },
            { n: 1, label: '1 · 6px · small controls' },
            { n: 2, label: '2 · 12px · Card / Paper' },
          ].map(({ n, label }) => (
            <Paper
              key={n}
              variant="outlined"
              sx={{ p: 2, borderRadius: n, width: 160, height: 96, display: 'flex', alignItems: 'flex-end' }}
            >
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Paper>
          ))}
          <Stack alignItems="center" spacing={0.5} sx={{ width: 160 }}>
            <Avatar sx={{ width: 64, height: 64 }}>VS</Avatar>
            <Typography variant="caption" color="text.secondary">'50%' · circle</Typography>
          </Stack>
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Elevation (Paper)</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', py: 2 }}>
          {[0, 1, 2, 3, 4].map((elev) => (
            <Stack key={elev} alignItems="center" spacing={0.5}>
              <Paper
                elevation={elev}
                sx={{ p: 2, borderRadius: 2, width: 140, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography variant="subtitle1">elevation={elev}</Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary">
                {elev === 0 ? 'Flat — prefer outlined' : elev === 2 ? 'Floating panel' : elev === 3 ? 'Modal (via Dialog)' : elev === 4 ? 'Heavy floating' : 'Subtle raise'}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">Outlined vs elevated — in-content preference</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="subtitle1">Outlined</Typography>
            <Typography variant="body2" color="text.secondary">Preferred for in-content containers.</Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="subtitle1">Elevated</Typography>
            <Typography variant="body2" color="text.secondary">Use when the surface should visually float.</Typography>
          </Paper>
        </Box>
      </Stack>
    </Stack>
  );
}
