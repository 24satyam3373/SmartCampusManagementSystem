import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box, Typography, Card, CardContent, Button, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid, Alert, LinearProgress, IconButton, Tooltip,
} from '@mui/material';
import { Add, Edit, PersonAdd, CheckCircle } from '@mui/icons-material';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ courseCode: '', title: '', description: '', credits: 3, department: '', maxCapacity: 60, semester: 'Fall', year: 2026 });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/courses', form);
      setMsg({ text: 'Course created!', type: 'success' });
      setDialogOpen(false);
      setForm({ courseCode: '', title: '', description: '', credits: 3, department: '', maxCapacity: 60, semester: 'Fall', year: 2026 });
      fetchCourses();
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error', type: 'error' }); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/courses/${id}`, { status: newStatus });
      setMsg({ text: `Status updated to ${newStatus.replace('_', ' ')}`, type: 'success' });
      fetchCourses();
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Invalid transition', type: 'error' }); }
  };

  const handleEnroll = async (id) => {
    try {
      await api.post(`/courses/${id}/enroll`);
      setMsg({ text: 'Enrolled successfully!', type: 'success' });
      fetchCourses();
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error', type: 'error' }); }
  };

  const handleUnenroll = async (id) => {
    try {
      await api.post(`/courses/${id}/unenroll`);
      setMsg({ text: 'Unenrolled', type: 'info' });
      fetchCourses();
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error', type: 'error' }); }
  };

  const statusColor = { Draft: 'default', Published: 'secondary', Enrollment_Open: 'info', In_Progress: 'success', Completed: 'warning', Archived: 'default' };
  const nextStates = { Draft: ['Published'], Published: ['Enrollment_Open', 'Draft'], Enrollment_Open: ['In_Progress', 'Published'], In_Progress: ['Completed'], Completed: ['Archived'] };

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Courses</Typography>
          <Typography variant="body2" color="text.secondary">{courses.length} courses total</Typography>
        </Box>
        {user?.role === 'Admin' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Create Course</Button>
        )}
      </Box>

      {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell><TableCell>Title</TableCell><TableCell>Credits</TableCell>
              <TableCell>Department</TableCell><TableCell>Faculty</TableCell><TableCell>Students</TableCell>
              <TableCell>Status</TableCell><TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c._id} sx={{ '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' } }}>
                <TableCell><Typography fontWeight={700} color="primary.main">{c.courseCode}</Typography></TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.credits}</TableCell>
                <TableCell>{c.department}</TableCell>
                <TableCell>{c.faculty?.name || '—'}</TableCell>
                <TableCell>{c.enrolledStudents?.length || 0}/{c.maxCapacity}</TableCell>
                <TableCell><Chip label={c.status?.replace('_', ' ')} size="small" color={statusColor[c.status]} variant="outlined" /></TableCell>
                <TableCell>
                  {user?.role === 'Admin' && nextStates[c.status]?.map((ns) => (
                    <Tooltip title={`→ ${ns.replace('_', ' ')}`} key={ns}>
                      <IconButton size="small" onClick={() => handleStatusChange(c._id, ns)} sx={{ mr: 0.5 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ))}
                  {user?.role === 'Student' && c.status === 'Enrollment_Open' && (
                    c.enrolledStudents?.includes(user._id) ? (
                      <Button size="small" color="error" onClick={() => handleUnenroll(c._id)}>Unenroll</Button>
                    ) : (
                      <Button size="small" variant="outlined" onClick={() => handleEnroll(c._id)} startIcon={<CheckCircle />}>Enroll</Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 4 }}><TextField fullWidth label="Course Code" size="small" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} /></Grid>
            <Grid size={{ xs: 8 }}><TextField fullWidth label="Title" size="small" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" size="small" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
            <Grid size={{ xs: 4 }}><TextField fullWidth label="Credits" size="small" type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: +e.target.value })} /></Grid>
            <Grid size={{ xs: 4 }}><TextField fullWidth label="Department" size="small" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Grid>
            <Grid size={{ xs: 4 }}><TextField fullWidth label="Capacity" size="small" type="number" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: +e.target.value })} /></Grid>
            <Grid size={{ xs: 6 }}><TextField select fullWidth label="Semester" size="small" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}><MenuItem value="Fall">Fall</MenuItem><MenuItem value="Spring">Spring</MenuItem><MenuItem value="Summer">Summer</MenuItem></TextField></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth label="Year" size="small" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
