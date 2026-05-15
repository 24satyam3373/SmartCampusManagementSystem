import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box, Typography, Card, CardContent, Button, Chip, TextField, MenuItem, Grid,
  Alert, LinearProgress, List, ListItem, ListItemText, IconButton, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Notifications as NotifIcon, Add, MarkEmailRead, Circle } from '@mui/icons-material';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'Announcement', targetRole: 'All', priority: 'Medium' });

  const fetch = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/notifications', form);
      setMsg({ text: 'Notification sent!', type: 'success' });
      setDialogOpen(false);
      setForm({ title: '', message: '', type: 'Announcement', targetRole: 'All', priority: 'Medium' });
      fetch();
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error', type: 'error' }); }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const priorityColor = { High: 'error', Medium: 'warning', Low: 'default' };
  const typeIcon = { Announcement: '📢', Alert: '🚨', Reminder: '⏰' };
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary">{unreadCount} unread</Typography>
        </Box>
        {user?.role === 'Admin' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>New Notification</Button>
        )}
      </Box>

      {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2 }}>{msg.text}</Alert>}

      <Card>
        <List disablePadding>
          {notifications.length === 0 ? (
            <ListItem><ListItemText primary="No notifications" secondary="You're all caught up!" /></ListItem>
          ) : notifications.map((n, i) => (
            <Box key={n._id}>
              <ListItem sx={{
                py: 2, px: 3,
                bgcolor: n.isRead ? 'transparent' : 'rgba(99,102,241,0.04)',
                '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' },
              }}
                secondaryAction={
                  !n.isRead && (
                    <IconButton size="small" onClick={() => markRead(n._id)} sx={{ color: 'primary.main' }}>
                      <MarkEmailRead fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <Box sx={{ mr: 2, fontSize: '1.5rem' }}>{typeIcon[n.type] || '📢'}</Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!n.isRead && <Circle sx={{ fontSize: 8, color: 'primary.main' }} />}
                      <Typography fontWeight={n.isRead ? 500 : 700} fontSize="0.95rem">{n.title}</Typography>
                      <Chip label={n.priority} size="small" color={priorityColor[n.priority]} variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      <Chip label={n.targetRole} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        From {n.sender?.name} • {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {i < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}
            </Box>
          ))}
        </List>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Title" size="small" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Message" size="small" multiline rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Grid>
            <Grid size={{ xs: 4 }}><TextField select fullWidth label="Type" size="small" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><MenuItem value="Announcement">Announcement</MenuItem><MenuItem value="Alert">Alert</MenuItem><MenuItem value="Reminder">Reminder</MenuItem></TextField></Grid>
            <Grid size={{ xs: 4 }}><TextField select fullWidth label="Target" size="small" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}><MenuItem value="All">All</MenuItem><MenuItem value="Student">Students</MenuItem><MenuItem value="Faculty">Faculty</MenuItem></TextField></Grid>
            <Grid size={{ xs: 4 }}><TextField select fullWidth label="Priority" size="small" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><MenuItem value="Low">Low</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="High">High</MenuItem></TextField></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setDialogOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleCreate}>Send</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
