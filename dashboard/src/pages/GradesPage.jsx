import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, MenuItem, TextField, Grid, Chip, LinearProgress, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Grade as GradeIcon, Add } from '@mui/icons-material';

export default function GradesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [grades, setGrades] = useState([]);
  const [gpaData, setGpaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({ studentId: '', midScore: 0, finalScore: 0 });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/courses').then((res) => {
      setCourses(res.data.courses || []);
      if (res.data.courses?.length) setSelectedCourse(res.data.courses[0]._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    if (user?.role === 'Student') {
      api.get(`/grades/student/${user._id}`).then((res) => setGrades(res.data.grades || [])).catch(console.error);
      api.get(`/grades/gpa/${user._id}`).then((res) => setGpaData(res.data)).catch(console.error);
    } else {
      api.get(`/grades/course/${selectedCourse}`).then((res) => setGrades(res.data.grades || [])).catch(console.error);
      api.get(`/courses/${selectedCourse}`).then((res) => setStudents(res.data.course?.enrolledStudents || [])).catch(console.error);
    }
  }, [selectedCourse, user]);

  const handleGrade = async () => {
    try {
      await api.post('/grades', {
        studentId: gradeForm.studentId, courseId: selectedCourse,
        midterm: { score: +gradeForm.midScore, maxScore: 100 },
        final: { score: +gradeForm.finalScore, maxScore: 100 },
        assignments: [{ title: 'Coursework', score: +gradeForm.assignScore || 70, maxScore: 100, weight: 100 }],
      });
      setMsg({ text: 'Grade saved!', type: 'success' });
      setDialogOpen(false);
      const res = await api.get(`/grades/course/${selectedCourse}`);
      setGrades(res.data.grades || []);
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error', type: 'error' }); }
  };

  const gradeColor = (letter) => {
    if (['A+', 'A', 'A-'].includes(letter)) return '#10b981';
    if (['B+', 'B', 'B-'].includes(letter)) return '#6366f1';
    if (['C+', 'C', 'C-'].includes(letter)) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={0.5}>Grades</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {user?.role === 'Student' ? 'Your academic performance' : 'Manage student grades'}
      </Typography>

      {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}

      {/* Student GPA Card */}
      {user?.role === 'Student' && gpaData && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4, p: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={900} sx={{ color: gradeColor(gpaData.gpa >= 3.5 ? 'A' : gpaData.gpa >= 2.5 ? 'B' : 'C') }}>
                {gpaData.gpa?.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Cumulative GPA</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Credits: <strong>{gpaData.totalCredits}</strong></Typography>
              <Typography variant="body2" color="text.secondary">Courses Completed: <strong>{gpaData.coursesCompleted}</strong></Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {(user?.role === 'Faculty' || user?.role === 'Admin') && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Select Course" size="small" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              {courses.map((c) => <MenuItem key={c._id} value={c._id}>{c.courseCode} — {c.title}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add Grade</Button>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              {user?.role === 'Student' ? <TableCell>Course</TableCell> : <TableCell>Student</TableCell>}
              <TableCell>Total</TableCell><TableCell>Letter</TableCell><TableCell>GPA</TableCell>
              <TableCell>Midterm</TableCell><TableCell>Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No grades yet</TableCell></TableRow>
            ) : grades.map((g) => (
              <TableRow key={g._id} sx={{ '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' } }}>
                {user?.role === 'Student' ? (
                  <TableCell><Typography fontWeight={600}>{g.course?.courseCode}</Typography><Typography variant="caption" color="text.secondary">{g.course?.title}</Typography></TableCell>
                ) : (
                  <TableCell><Typography fontWeight={600}>{g.student?.name}</Typography><Typography variant="caption" color="text.secondary">{g.student?.studentId}</Typography></TableCell>
                )}
                <TableCell><Typography fontWeight={700} color={gradeColor(g.letterGrade)}>{g.totalGrade}%</Typography></TableCell>
                <TableCell><Chip label={g.letterGrade} size="small" sx={{ fontWeight: 800, bgcolor: `${gradeColor(g.letterGrade)}20`, color: gradeColor(g.letterGrade), border: `1px solid ${gradeColor(g.letterGrade)}40` }} /></TableCell>
                <TableCell><Typography fontWeight={600}>{g.gpa?.toFixed(1)}</Typography></TableCell>
                <TableCell>{g.midterm?.score}/{g.midterm?.maxScore}</TableCell>
                <TableCell>{g.final?.score}/{g.final?.maxScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h6" fontWeight={700}>Assign Grade</Typography>
          <Typography variant="caption" color="text.secondary">
            Course: {courses.find((c) => c._id === selectedCourse)?.courseCode || '—'} • Max Score: 100
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              select fullWidth label="Select Student" value={gradeForm.studentId}
              onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
              helperText={students.length === 0 ? 'No students enrolled in this course' : `${students.length} students enrolled`}
            >
              {students.map((s) => (
                <MenuItem key={s._id} value={s._id}>{s.name} ({s.studentId})</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth label="Assignment / Coursework Score" type="number"
              value={gradeForm.assignScore || ''}
              onChange={(e) => setGradeForm({ ...gradeForm, assignScore: e.target.value })}
              helperText="Out of 100"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth label="Midterm Score" type="number"
                value={gradeForm.midScore}
                onChange={(e) => setGradeForm({ ...gradeForm, midScore: e.target.value })}
                helperText="Out of 100"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
              <TextField
                fullWidth label="Final Exam Score" type="number"
                value={gradeForm.finalScore}
                onChange={(e) => setGradeForm({ ...gradeForm, finalScore: e.target.value })}
                helperText="Out of 100"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGrade} disabled={!gradeForm.studentId}>Save Grade</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
