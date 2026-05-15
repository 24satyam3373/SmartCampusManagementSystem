import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, Chip, Box, Menu, MenuItem, Badge, Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, MenuBook, FactCheck, Grade, Notifications,
  Logout, Person, School, CalendarMonth, Settings, People, Payments, AutoStories,
  LightMode, DarkMode, SettingsBrightness
} from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Courses', path: '/courses', icon: <MenuBook fontSize="small" /> },
  { label: 'Attendance', path: '/attendance', icon: <FactCheck fontSize="small" /> },
  { label: 'Grades', path: '/grades', icon: <Grade fontSize="small" /> },
  { label: 'Timetable', path: '/timetable', icon: <CalendarMonth fontSize="small" /> },
  { label: 'Notifications', path: '/notifications', icon: <Notifications fontSize="small" /> },
  { label: 'Fees', path: '/fees', icon: <Payments fontSize="small" /> },
  { label: 'LMS', path: '/lms', icon: <AutoStories fontSize="small" /> },
  { label: 'Users', path: '/users', icon: <People fontSize="small" />, adminOnly: true },
];

export default function TopNav() {
  const { user, logout, getAvatarUrl } = useAuth();
  const { mode, actualMode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState(null);

  const roleColor = { Admin: 'error', Faculty: 'warning', Student: 'primary' };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    window.location.href = 'http://localhost:5173';
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ 
      background: actualMode === 'dark' ? 'rgba(10, 14, 23, 0.7)' : 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(10px)', 
      borderBottom: '1px solid', 
      borderColor: 'divider',
      zIndex: 1201,
    }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4, textDecoration: 'none' }}>
          <School sx={{ color: '#818cf8', fontSize: 32 }} />
          <Typography variant="h6" sx={{ color: actualMode === 'dark' ? '#818cf8' : '#4f46e5', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'sans-serif' }}>
            Galgotias
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
          {navItems.filter((item) => !item.adminOnly || user?.role === 'Admin').map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              size="small"
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                bgcolor: location.pathname === item.path ? 'rgba(99,102,241,0.1)' : 'transparent',
                borderRadius: 2, px: 2, fontSize: '0.85rem',
                '&:hover': { bgcolor: 'rgba(99,102,241,0.08)', color: 'primary.light' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Chip label={user?.role} size="small" color={roleColor[user?.role] || 'default'} variant="outlined" sx={{ mr: 1 }} />
        
        {/* Theme Toggle */}
        <Tooltip title="Change Theme">
          <IconButton onClick={(e) => setThemeAnchorEl(e.currentTarget)} size="small" sx={{ mr: 1, color: 'text.secondary' }}>
            {mode === 'dark' ? <DarkMode fontSize="small" /> : mode === 'light' ? <LightMode fontSize="small" /> : <SettingsBrightness fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Menu 
          anchorEl={themeAnchorEl} 
          open={!!themeAnchorEl} 
          onClose={() => setThemeAnchorEl(null)}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 150, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' } } }}
        >
          <MenuItem onClick={() => { toggleTheme('light'); setThemeAnchorEl(null); }} selected={mode === 'light'}>
            <LightMode fontSize="small" sx={{ mr: 1.5, color: 'orange' }} /> Light
          </MenuItem>
          <MenuItem onClick={() => { toggleTheme('dark'); setThemeAnchorEl(null); }} selected={mode === 'dark'}>
            <DarkMode fontSize="small" sx={{ mr: 1.5, color: '#818cf8' }} /> Dark
          </MenuItem>
          <MenuItem onClick={() => { toggleTheme('system'); setThemeAnchorEl(null); }} selected={mode === 'system'}>
            <SettingsBrightness fontSize="small" sx={{ mr: 1.5 }} /> System Default
          </MenuItem>
        </Menu>

        <Tooltip title={user?.name || ''}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar
              src={getAvatarUrl(user?.avatar)}
              sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.9rem' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}
          slotProps={{ 
            paper: { 
              sx: { 
                bgcolor: actualMode === 'dark' ? '#1a1f2e' : '#ffffff', 
                border: actualMode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', 
                minWidth: 180,
                borderRadius: '12px',
                boxShadow: actualMode === 'dark' ? 'none' : '0 10px 40px rgba(0,0,0,0.1)'
              } 
            } 
          }}>
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
            <Person fontSize="small" sx={{ mr: 1 }} /> My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
