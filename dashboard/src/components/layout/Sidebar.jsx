import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Box, Typography, TextField, List, ListItemButton, ListItemText, Chip, Divider, InputAdornment, CircularProgress,
} from '@mui/material';
import { Search, MenuBook, Person } from '@mui/icons-material';

export default function Sidebar() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (user?.role === 'Admin') {
          const res = await api.get('/auth/users');
          setItems(res.data.users?.map((u) => ({ id: u._id, primary: u.name, secondary: u.email, tag: u.role })) || []);
        } else {
          const res = await api.get('/courses');
          setItems(res.data.courses?.map((c) => ({ id: c._id, primary: c.courseCode, secondary: c.title, tag: c.status?.replace('_', ' ') })) || []);
        }
      } catch (e) {
        console.error('Sidebar fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchItems();
  }, [user]);

  const filtered = items.filter((i) =>
    i.primary.toLowerCase().includes(search.toLowerCase()) ||
    i.secondary.toLowerCase().includes(search.toLowerCase())
  );

  const tagColor = (tag) => {
    const map = { Admin: 'error', Faculty: 'warning', Student: 'primary', 'In Progress': 'success', 'Enrollment Open': 'info', Draft: 'default', Published: 'secondary', Completed: 'warning' };
    return map[tag] || 'default';
  };

  return (
    <Box sx={{
      width: 280, height: '100vh', pt: '72px',
      bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider',
      display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 1200,
    }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, fontSize: '0.7rem' }}>
          {user?.role === 'Admin' ? '👥 User Directory' : '📚 My Courses'}
        </Typography>
        <TextField
          fullWidth size="small" placeholder="Search..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2, fontSize: '0.85rem' } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }}
        />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={24} /></Box>
        ) : filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No items found</Typography>
        ) : (
          <List dense disablePadding>
            {filtered.map((item) => (
              <ListItemButton key={item.id} sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' } }}>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                />
                <Chip label={item.tag} size="small" color={tagColor(item.tag)} variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 22, ml: 1 }} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">{filtered.length} items</Typography>
      </Box>
    </Box>
  );
}
