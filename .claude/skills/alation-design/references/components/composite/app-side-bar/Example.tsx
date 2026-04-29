import type { ComponentType, ReactNode } from 'react';
import { Box, SvgIcon, Tooltip } from '@mui/material';
import Storefront from '@mui/icons-material/Storefront';
import { Menu as MenuIcon } from 'lucide-react';
import {
  AddOnsIcon,
  AgentIcon,
  AreaChartIcon,
  CdeIcon,
  ComposeIcon,
  GovernanceIcon,
  LogoIcon,
  VerifiedIcon,
} from '@alation/icons-neo';

type IconType = ComponentType<{ size?: number; color?: string }>;

interface NavButtonProps {
  name: string;
  icon: IconType;
  isActive?: boolean;
  onClick?: () => void;
  /** True when the icon is an SVG component from @alation/icons-neo (wrap in MUI SvgIcon). */
  isProductIcon?: boolean;
}

function NavButton({ name, icon: Icon, isActive, onClick, isProductIcon }: NavButtonProps) {
  return (
    <Tooltip title={name} placement="right" arrow>
      <Box
        component="button"
        onClick={onClick}
        aria-label={name}
        aria-current={isActive ? 'page' : undefined}
        sx={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isActive ? 'brand.main' : 'transparent',
          color: '#FFF',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: isActive ? 'brand.main' : 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {isProductIcon ? (
          <SvgIcon component={Icon as ComponentType} sx={{ fontSize: 20 }} />
        ) : (
          <Icon size={20} />
        )}
      </Box>
    </Tooltip>
  );
}

const TOP_ENTRIES: { name: string; icon: IconType; isActive?: boolean }[] = [
  { name: 'Catalog', icon: LogoIcon as IconType, isActive: true },
  { name: 'Compose', icon: ComposeIcon as IconType },
  { name: 'Curate and Govern', icon: GovernanceIcon as IconType },
  { name: 'Alation Analytics', icon: AreaChartIcon as IconType },
  { name: 'Data Products', icon: Storefront as IconType },
  { name: 'Data Quality', icon: VerifiedIcon as IconType },
  { name: 'CDE Manager', icon: CdeIcon as IconType },
  { name: 'Agent Studio', icon: AgentIcon as IconType },
];

interface AppSideBarExampleProps {
  onMenuClick?: () => void;
  height?: ReactNode;
}

export default function AppSideBarExample({ onMenuClick }: AppSideBarExampleProps = {}) {
  return (
    <Box
      sx={{
        width: 56,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: 'neutral.800',
        px: '10px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', py: '10px' }}>
        <NavButton name="Menu" icon={MenuIcon} onClick={onMenuClick} />
        {TOP_ENTRIES.map((entry) => (
          <NavButton key={entry.name} {...entry} isProductIcon />
        ))}
      </Box>
      <Box sx={{ pb: '10px' }}>
        <NavButton name="Add-Ons" icon={AddOnsIcon as IconType} isProductIcon />
      </Box>
    </Box>
  );
}
