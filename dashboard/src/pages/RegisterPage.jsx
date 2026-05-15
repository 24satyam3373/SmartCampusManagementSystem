import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  CircularProgress, Grid, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { School, PersonAdd, Person, MenuBook } from '@mui/icons-material';

export default function RegisterPage() {
  const [role, setRole] = useState('Student');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', studentId: '', facultyId: '', phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { mode } = useThemeMode();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!form.name || !form.email) {
      return setError('Name and email are required');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        department: form.department,
        studentId: role === 'Student' ? form.studentId : undefined,
        facultyId: role === 'Faculty' ? form.facultyId : undefined,
        phone: form.phone,
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', position: 'relative', overflow: 'hidden',
    }}>
      {/* Campus Background */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/images/pattern_bg.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: mode === 'dark' ? 0.08 : 0.03, zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', inset: 0,
        background: mode === 'dark'
          ? 'radial-gradient(ellipse at top, rgba(16,185,129,0.06) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at top, rgba(16,185,129,0.04) 0%, transparent 60%)',
        zIndex: 0,
      }} />

      <Card sx={{ 
        width: 520, 
        bgcolor: mode === 'dark' ? 'rgba(17,24,39,0.8)' : 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid',
        borderColor: 'divider', 
        position: 'relative', 
        zIndex: 1,
        boxShadow: mode === 'dark' ? 'none' : '0 20px 50px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <School sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #10b981, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Create Account</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Register as a Student or Faculty member
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          {/* Role Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup value={role} exclusive onChange={(_, v) => v && setRole(v)} size="small"
              sx={{ 
                '& .MuiToggleButton-root': { px: 3, borderColor: 'divider' },
                '& .Mui-selected': { bgcolor: 'rgba(99,102,241,0.1) !important', color: 'primary.main', fontWeight: 700 } 
              }}>
              <ToggleButton value="Student">
                <Person sx={{ mr: 1, fontSize: 18 }} /> Student
              </ToggleButton>
              <ToggleButton value="Faculty">
                <MenuBook sx={{ mr: 1, fontSize: 18 }} /> Faculty
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" value={form.name} onChange={handleChange('name')}
                  required placeholder="e.g. John Doe" autoFocus size="small" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" type="email" value={form.email} onChange={handleChange('email')}
                  required placeholder="e.g. john@scms.edu" size="small" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label={role === 'Faculty' ? 'Faculty ID' : 'Student ID'} size="small"
                  value={role === 'Faculty' ? form.facultyId : form.studentId}
                  onChange={role === 'Faculty' ? handleChange('facultyId') : handleChange('studentId')}
                  placeholder={role === 'Faculty' ? 'e.g. FAC003' : 'e.g. STU006'} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')}
                  placeholder="e.g. +91 98765 43210" size="small" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Department" value={form.department} onChange={handleChange('department')}
                  placeholder="e.g. Computer Science" size="small" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Password" type="password" value={form.password} onChange={handleChange('password')}
                  required helperText="Min 6 characters" size="small" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Confirm Password" type="password" value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')} required size="small"
                  error={form.confirmPassword !== '' && form.password !== form.confirmPassword}
                  helperText={form.confirmPassword !== '' && form.password !== form.confirmPassword ? 'Mismatch' : ' '} />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd />}
                  sx={{ py: 1.2, fontWeight: 700 }}>
                  {loading ? 'Creating Account...' : `Sign Up as ${role}`}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography component={RouterLink} to="/login" variant="body2"
                sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
