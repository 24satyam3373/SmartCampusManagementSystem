import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopNav />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: '280px', mt: '64px', p: 3, minHeight: 'calc(100vh - 64px)', position: 'relative', zIndex: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
