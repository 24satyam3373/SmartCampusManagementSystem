import { createTheme } from '@mui/material/styles';

const getThemeConfig = (mode) => ({
  palette: {
    mode,
    primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
    secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    background: { 
      default: mode === 'dark' ? '#0a0e17' : '#f0f2f5', 
      paper: mode === 'dark' ? '#111827' : '#ffffff' 
    },
    text: { 
      primary: mode === 'dark' ? '#f1f5f9' : '#0f172a', 
      secondary: mode === 'dark' ? '#94a3b8' : '#475569' 
    },
    divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    action: {
      hover: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", -apple-system, sans-serif',
    h1: { fontFamily: '"Inter", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: '10px' 
          },
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(16px)',
          boxShadow: mode === 'dark' ? 'none' : '0 8px 32px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 24px', fontWeight: 700 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { 
        root: { fontWeight: 700, borderRadius: 10 },
        outlined: { borderWidth: '1.5px' }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
        head: { fontWeight: 700, color: mode === 'dark' ? '#94a3b8' : '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.8px' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { 
          borderRadius: 20, 
          padding: 8, 
          backgroundImage: 'none',
          bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          border: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 800, fontSize: '1.25rem' }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { 
          background: mode === 'dark' ? '#0d1220' : '#ffffff', 
          borderRight: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' 
        },
      },
    },
  },
});

export default getThemeConfig;
