import { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { Bell, LogOut, Search, Settings, User } from 'lucide-react';

// Inline text wordmark so this Example.tsx has no consumer-only asset imports.
function CustomerAlationLogo() {
  return (
    <Box sx={{ color: '#FFF', display: 'inline-flex', alignItems: 'center', px: 1 }}>
      <Box sx={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>Logo</Box>
    </Box>
  );
}

export default function AppTopHeaderExample() {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSearch = () => {
    if (searchValue.trim()) {
      // In production this would route via the app router. Demo no-op.
    }
  };

  return (
    <Box
      component="header"
      sx={{
        p: '12px',
        pb: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        bgcolor: '#0D1322',
      }}
    >
      <CustomerAlationLogo />

      <Box sx={{ flex: 1, maxWidth: 600 }}>
        <TextField
          placeholder="Search Alation"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          size="small"
          fullWidth
          variant="filled"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <IconButton
                size="small"
                onClick={handleSearch}
                sx={{
                  padding: '4px',
                  color: isFocused ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <Search size={18} />
              </IconButton>
            ),
          }}
          sx={{
            backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            transition: 'background-color 0.2s ease',
            '& .MuiFilledInput-root': {
              height: 36,
              backgroundColor: 'transparent',
              borderRadius: '6px',
              border: isFocused
                ? '1px solid rgba(0, 0, 0, 0.23)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&.Mui-focused': { backgroundColor: 'transparent' },
              '&:before, &:after': { display: 'none' },
            },
            '& .MuiInputBase-input': {
              color: isFocused ? 'rgba(0, 0, 0, 0.87)' : '#FFF',
              fontSize: 14,
            },
            '& .MuiInputBase-input::placeholder': {
              color: isFocused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.72)',
              opacity: 1,
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          aria-label="Notifications"
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Bell size={20} />
        </IconButton>
        <IconButton
          aria-label="Settings"
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Settings size={20} />
        </IconButton>
        <Avatar
          src="https://mockmind-api.uifaces.co/content/human/219.jpg"
          alt="User avatar"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ width: 32, height: 32, cursor: 'pointer' }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><User size={16} /></ListItemIcon>
            My Profile
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><Settings size={16} /></ListItemIcon>
            Profile Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><LogOut size={16} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
