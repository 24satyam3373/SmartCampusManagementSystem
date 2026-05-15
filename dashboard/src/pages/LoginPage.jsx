import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { School, Login } from '@mui/icons-material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { actualMode } = useThemeMode();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (mail, pass) => { setEmail(mail); setPassword(pass); };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: actualMode === 'dark' ? '#0a0e17' : '#e9edf5',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background elements */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/images/campus_hero.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: actualMode === 'dark' ? 0.16 : 0.24, zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', inset: 0,
        background: actualMode === 'dark' 
          ? 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(10,14,23,0.45) 72%)'
          : 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(233,237,245,0.52) 72%)',
        zIndex: 0,
      }} />

      <Card sx={{ 
        width: 420, 
        bgcolor: actualMode === 'dark' ? 'rgba(17,24,39,0.86)' : 'rgba(255,255,255,0.94)', 
        backdropFilter: 'blur(14px)', 
        border: '1px solid',
        borderColor: 'divider', 
        position: 'relative', 
        zIndex: 2,
        boxShadow: actualMode === 'dark' ? 'none' : '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
              <School sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={800} sx={{ color: 'primary.main', letterSpacing: '-0.5px' }}>
                Galgotias
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Sign in to your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required sx={{ mb: 2 }} autoFocus />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5 }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Login />}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              Quick Access
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                { label: 'Admin', email: 'admin@galgotias.edu', pass: 'admin123', color: '#ef4444' },
                { label: 'Faculty', email: 'faculty1@galgotias.edu', pass: 'faculty123', color: '#f59e0b' },
                { label: 'Student', email: 'student1@galgotias.edu', pass: 'student123', color: '#6366f1' },
              ].map((q) => (
                <Button key={q.label} size="small" variant="outlined" onClick={() => quickLogin(q.email, q.pass)}
                  sx={{ borderColor: q.color, color: q.color, fontSize: '0.75rem', '&:hover': { bgcolor: `${q.color}15`, borderColor: q.color }, borderRadius: 2 }}>
                  {q.label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography component={RouterLink} to="/register" variant="body2"
                sx={{ color: 'success.main', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Sign Up
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
