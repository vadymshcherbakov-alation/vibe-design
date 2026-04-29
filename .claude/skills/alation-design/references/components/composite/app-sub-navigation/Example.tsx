import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Bell, ChevronLeft, FileText, Inbox, Key, Mail, Smartphone, User } from 'lucide-react';

type IconType = ComponentType<{ size?: number; color?: string }>;

interface SubNavItem {
  id: string;
  label: string;
  icon: IconType;
  href: string;
  dividerBefore?: boolean;
}

interface SubNavSection {
  title: string;
  items: SubNavItem[];
}

interface SubNavConfig {
  title: string;
  items?: SubNavItem[];
  sections?: SubNavSection[];
}

interface SubNavProps {
  config: SubNavConfig;
  pathname: string;
  onNavigate?: (href: string) => void;
}

function ItemRow({
  item,
  isActive,
  onClick,
}: {
  item: SubNavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <Box>
      {item.dividerBefore && (
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: '4px' }} />
      )}
      <Box
        component="div"
        role="link"
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          py: '10px',
          px: '12px',
          ml: '-12px',
          mr: '-12px',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 150ms',
          '&:hover': {
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.10)',
          },
        }}
      >
        <Icon size={16} color="#FFF" />
        <Typography
          sx={{
            color: '#FFF',
            fontSize: 13,
            fontWeight: isActive ? 500 : 400,
            lineHeight: 1.54,
          }}
        >
          {item.label}
        </Typography>
      </Box>
    </Box>
  );
}

export function AppSubNavigation({ config, pathname, onNavigate }: SubNavProps) {
  const [currentSection, setCurrentSection] = useState<SubNavSection | null>(null);

  useEffect(() => {
    if (config.sections && currentSection === null) {
      const activeSection = config.sections.find((section) =>
        section.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
      );
      if (activeSection) setCurrentSection(activeSection);
    }
  }, [pathname, config.sections, currentSection]);

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: 'rgba(255,255,255,0.0625)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px 12px 0 0',
        minHeight: 0,
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ pl: '24px', py: '16px', flexShrink: 0 }}>
        <Typography sx={{ color: '#FFF', fontSize: 22, fontWeight: 600, lineHeight: 1.21 }}>
          {config.title}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', pl: '24px', pr: '12px', pb: '16px' }}>
        {currentSection ? (
          <Box>
            <Button
              variant="text"
              onClick={() => setCurrentSection(null)}
              startIcon={<ChevronLeft size={16} />}
              sx={{
                color: '#FFF',
                fontSize: 13,
                fontWeight: 400,
                textTransform: 'none',
                p: '4px 8px',
                ml: '-8px',
                mb: '16px',
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              All {config.title}
            </Button>
            <Typography sx={{ color: '#FFF', fontSize: 16, fontWeight: 500, mb: '16px' }}>
              {currentSection.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentSection.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={() => onNavigate?.(item.href)}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {config.sections
              ? config.sections.map((section) => (
                  <Box
                    key={section.title}
                    onClick={() => setCurrentSection(section)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: '10px',
                      px: '12px',
                      ml: '-12px',
                      mr: '-12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 150ms',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.10)' },
                    }}
                  >
                    <Typography sx={{ color: '#FFF', fontSize: 13, fontWeight: 400 }}>
                      {section.title}
                    </Typography>
                    <ChevronLeft size={16} color="#FFF" style={{ transform: 'rotate(180deg)' }} />
                  </Box>
                ))
              : config.items?.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isActive={pathname === item.href}
                    onClick={() => onNavigate?.(item.href)}
                  />
                ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Demo configs ───────────────────────────────────────────────────────────
const flatConfig: SubNavConfig = {
  title: 'Compose',
  items: [
    { id: 'new', label: 'New thread', icon: FileText, href: '/app/compose/new' },
    { id: 'drafts', label: 'Drafts', icon: Inbox, href: '/app/compose/drafts' },
    { id: 'shared', label: 'Shared with me', icon: User, href: '/app/compose/shared' },
  ],
};

const sectionedConfig: SubNavConfig = {
  title: 'Settings',
  sections: [
    {
      title: 'Profile',
      items: [
        { id: 'p-personal', label: 'Personal details', icon: User, href: '/app/settings/profile/personal' },
        { id: 'p-photo', label: 'Photo', icon: User, href: '/app/settings/profile/photo' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { id: 'n-email', label: 'Email', icon: Mail, href: '/app/settings/notifications/email' },
        { id: 'n-inapp', label: 'In-app', icon: Bell, href: '/app/settings/notifications/inapp' },
        { id: 'n-mobile', label: 'Mobile push', icon: Smartphone, href: '/app/settings/notifications/mobile' },
      ],
    },
    {
      title: 'API access',
      items: [{ id: 'api-tokens', label: 'Personal tokens', icon: Key, href: '/app/settings/api/tokens' }],
    },
  ],
};

export default function AppSubNavigationExample() {
  const [pathname, setPathname] = useState('/app/settings/notifications/email');
  return (
    <Box sx={{ display: 'flex', gap: 2, bgcolor: '#0D1322', p: 2, height: 480 }}>
      <AppSubNavigation
        config={sectionedConfig}
        pathname={pathname}
        onNavigate={(href) => setPathname(href)}
      />
      <AppSubNavigation config={flatConfig} pathname={pathname} onNavigate={(href) => setPathname(href)} />
    </Box>
  );
}
