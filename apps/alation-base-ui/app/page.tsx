import { Box, Button, Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h1">Welcome to Vibe Design</Typography>
        <Typography variant="body1" color="text.secondary">
          Explore and prototype with Alation design system components.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component="a"
          href="https://alation-design-system.vercel.app/#foundations/colours"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Alation Design System
        </Button>
      </Stack>
    </Box>
  );
}
