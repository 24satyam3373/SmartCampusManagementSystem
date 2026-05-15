import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import CoursesPage from './pages/CoursesPage';
import AttendancePage from './pages/AttendancePage';
import GradesPage from './pages/GradesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import TimetablePage from './pages/TimetablePage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import FeesPage from './pages/FeesPage';
import LMSPage from './pages/LMSPage';
import { Box, Typography, Button } from '@mui/material';
import CustomCursor from './components/CustomCursor';
import GlobalShapes from './components/GlobalShapes';
import ParticleCanvas from './components/ParticleCanvas';

function UnauthorizedPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Typography variant="h2" fontWeight={800} color="error.main" mb={2}>403</Typography>
      <Typography variant="h5" fontWeight={600} mb={1}>Access Denied</Typography>
      <Typography color="text.secondary" mb={3}>You don't have permission to view this page.</Typography>
      <Button variant="contained" href="/">Go to Dashboard</Button>
    </Box>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="lms" element={<LMSPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function AppVisualLayer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <CustomCursor />
      <ParticleCanvas />
      {!isAuthPage && <GlobalShapes />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppVisualLayer />
      <AuthProvider>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
