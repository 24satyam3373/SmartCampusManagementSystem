import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, Chip,
  Divider, Alert, IconButton, CircularProgress,
} from '@mui/material';
import { Save, Lock, Person, Email, Phone, Business, Badge, CameraAlt } from '@mui/icons-material';

export default function ProfilePage() {
  const { user, refreshUser, getAvatarUrl } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', department: user?.department || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: 'success' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/update-profile', form);
      await refreshUser();
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setMsg({ text: 'Only JPEG, PNG, WebP and GIF images are allowed', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: 'Image must be less than 5MB', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await api.put('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshUser();
      setMsg({ text: '✅ Avatar updated successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to upload avatar', type: 'error' });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwMsg({ text: 'Passwords do not match', type: 'error' });
    }
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword,
      });
      setPwMsg({ text: 'Password changed successfully!', type: 'success' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ text: err.response?.data?.message || 'Error', type: 'error' });
    }
  };

  const roleColor = { Admin: 'error', Faculty: 'warning', Student: 'primary' };
  const roleGradient = {
    Admin: 'linear-gradient(135deg, #ef4444, #f97316)',
    Faculty: 'linear-gradient(135deg, #f59e0b, #eab308)',
    Student: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={3}>My Profile</Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              {/* Avatar with Upload */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={getAvatarUrl(user?.avatar)}
                  sx={{
                    width: 120, height: 120, mx: 'auto', fontSize: '3rem',
                    background: roleGradient[user?.role] || roleGradient.Student,
                    border: '4px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                {/* Camera overlay button */}
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  sx={{
                    position: 'absolute', bottom: 4, right: 4,
                    width: 36, height: 36,
                    bgcolor: 'primary.main', color: '#fff',
                    border: '2px solid #111827',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {uploading ? <CircularProgress size={18} color="inherit" /> : <CameraAlt sx={{ fontSize: 18 }} />}
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  onChange={handleAvatarUpload}
                />
              </Box>

              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>{user?.email}</Typography>
              <Chip label={user?.role} color={roleColor[user?.role]} variant="outlined" />

              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'left', px: 2 }}>
                {[
                  { icon: <Badge fontSize="small" />, label: 'ID', value: user?.studentId || user?.facultyId || 'N/A' },
                  { icon: <Business fontSize="small" />, label: 'Department', value: user?.department || 'N/A' },
                  { icon: <Email fontSize="small" />, label: 'Email', value: user?.email },
                  { icon: <Phone fontSize="small" />, label: 'Phone', value: user?.phone || 'N/A' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Profile */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />Edit Profile
              </Typography>
              {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}
              <form onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" startIcon={<Save />} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />Change Password
              </Typography>
              {pwMsg.text && <Alert severity={pwMsg.type} onClose={() => setPwMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{pwMsg.text}</Alert>}
              <form onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth type="password" label="Current Password" value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth type="password" label="New Password" value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required
                      helperText="Minimum 6 characters" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth type="password" label="Confirm Password" value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required
                      error={pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword}
                      helperText={pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? 'Passwords do not match' : ''} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="warning" startIcon={<Lock />}>
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
