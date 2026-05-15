import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Alert, LinearProgress,
  IconButton, Tooltip, Avatar, InputAdornment, Switch,
} from '@mui/material';
import { PersonAdd, Delete, Search, Block, CheckCircle } from '@mui/icons-material';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: '', userName: '', action: '' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'Student',
    department: '', studentId: '', facultyId: '', phone: '',
  });

  const fetchUsers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/auth/users', { params });
      setUsers(res.data.users || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleCreate = async () => {
    try {
      await api.post('/auth/register', form);
      setMsg({ text: `${form.role} "${form.name}" created successfully!`, type: 'success' });
      setDialogOpen(false);
      setForm({ name: '', email: '', password: '', role: 'Student', department: '', studentId: '', facultyId: '', phone: '' });
      fetchUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Error creating user', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/auth/users/${id}`);
      setMsg({ text: res.data.message, type: 'success' });
      setConfirmDialog({ open: false, userId: '', userName: '', action: '' });
      fetchUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Error deleting user', type: 'error' });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/auth/users/${id}/toggle-status`);
      setMsg({ text: res.data.message, type: 'success' });
      fetchUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Error toggling status', type: 'error' });
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await api.put(`/auth/users/${id}/role`, { role: newRole });
      setMsg({ text: res.data.message, type: 'success' });
      fetchUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Error changing role', type: 'error' });
    }
  };

  const roleColor = { Admin: 'error', Faculty: 'warning', Student: 'primary' };
  const roleHex = { Admin: '#ef4444', Faculty: '#f59e0b', Student: '#6366f1' };
  const activeCount = users.filter((u) => u.isActive !== false).length;
  const inactiveCount = users.filter((u) => u.isActive === false).length;

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>User Management</Typography>
          <Typography variant="body2" color="text.secondary">
            {users.length} total • {activeCount} active • {inactiveCount} inactive
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setDialogOpen(true)}
          sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          Add New User
        </Button>
      </Box>

      {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth size="small" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment> }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField select fullWidth size="small" label="Filter by Role" value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No users found</TableCell></TableRow>
            ) : users.map((u) => (
              <TableRow key={u._id} sx={{
                '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' },
                opacity: u.isActive === false ? 0.5 : 1,
              }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: roleHex[u.role] || '#6366f1', fontSize: '0.9rem' }}>
                      {u.name?.charAt(0)}
                    </Avatar>
                    <Typography fontWeight={600} fontSize="0.9rem">{u.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                <TableCell>
                  <TextField select size="small" value={u.role} variant="standard"
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    sx={{ minWidth: 90, '& .MuiInput-underline:before': { borderBottom: 'none' } }}>
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Faculty">Faculty</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{u.studentId || u.facultyId || '—'}</Typography></TableCell>
                <TableCell><Typography variant="body2">{u.department || '—'}</Typography></TableCell>
                <TableCell>
                  <Tooltip title={u.isActive !== false ? 'Active — Click to deactivate' : 'Inactive — Click to activate'}>
                    <Switch size="small" checked={u.isActive !== false}
                      onChange={() => handleToggleStatus(u._id)}
                      color={u.isActive !== false ? 'success' : 'default'} />
                  </Tooltip>
                </TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{new Date(u.createdAt).toLocaleDateString()}</Typography></TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete user">
                    <IconButton size="small" color="error"
                      onClick={() => setConfirmDialog({ open: true, userId: u._id, userName: u.name, action: 'delete' })}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Add New User</Typography>
          <Typography variant="caption" color="text.secondary">Create a Student, Faculty, or Admin account</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 8 }}>
              <TextField fullWidth label="Full Name" size="small" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField select fullWidth label="Role" size="small" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Faculty">Faculty</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email" type="email" size="small" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required
                placeholder="e.g. newuser@scms.edu" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Password" type="password" size="small" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required
                helperText="Min 6 characters" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label={form.role === 'Faculty' ? 'Faculty ID' : form.role === 'Admin' ? 'Admin ID' : 'Student ID'} size="small"
                value={form.role === 'Faculty' ? form.facultyId : form.studentId}
                onChange={(e) => form.role === 'Faculty'
                  ? setForm({ ...form, facultyId: e.target.value })
                  : setForm({ ...form, studentId: e.target.value })}
                placeholder={form.role === 'Faculty' ? 'e.g. FAC003' : 'e.g. STU006'} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Department" size="small" value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Phone" size="small" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.email || !form.password}>
            Create {form.role}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{confirmDialog.userName}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(confirmDialog.userId)}>
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
