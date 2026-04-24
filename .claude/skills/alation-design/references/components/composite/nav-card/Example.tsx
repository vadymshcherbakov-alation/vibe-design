import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart3, Bot, Database, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

function NavCard({ icon: Icon, title, description, onClick }: NavCardProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        bgcolor: 'transparent',
        borderRadius: 2,
        minHeight: 98,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.neutral[300]}`,
        },
      }}
    >
      <CardContent sx={{ p: 0, width: '100%', '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              bgcolor: theme.palette.blue[100],
              color: theme.palette.blue[600],
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>{title}</Typography>
            <Typography variant="body0" color="text.secondary">{description}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function NavCardExample() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 520 }}>
      <NavCard
        icon={Database}
        title="Data sources"
        description="Connect and manage data sources across your organization."
      />
      <NavCard
        icon={Bot}
        title="Agents"
        description="Browse, build, and run Alation agents."
      />
      <NavCard
        icon={Workflow}
        title="Flows"
        description="Compose multi-step workflows and schedule runs."
      />
      <NavCard
        icon={BarChart3}
        title="Analytics"
        description="Usage, query, and catalog health dashboards."
      />
    </Stack>
  );
}
