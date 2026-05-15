import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box, Typography, Card, CardContent, Button, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, MenuItem, TextField, Alert, LinearProgress,
  Checkbox, IconButton, Tooltip,
} from '@mui/material';
import { FactCheck, Save, CheckCircle, People, Warning } from '@mui/icons-material';

export default function AttendancePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [markingData, setMarkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: 'success' });
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    api.get('/courses').then((res) => {
      const c = res.data.courses || [];
      setCourses(c);
      // Default to first course that has enrolled students, or first In_Progress course
      const active = c.find((x) => x.enrolledStudents?.length > 0 && x.status === 'In_Progress');
      const fallback = c.find((x) => x.enrolledStudents?.length > 0) || c[0];
      setSelectedCourse((active || fallback)?._id || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    if (user?.role === 'Student') {
      api.get(`/attendance/student/${user._id}?courseId=${selectedCourse}`)
        .then((res) => setRecords(res.data.records || []))
        .catch(console.error);
    } else {
      api.get(`/attendance/course/${selectedCourse}`)
        .then((res) => setRecords(res.data.records || []))
        .catch(console.error);
      // Load enrolled students for marking
      api.get(`/courses/${selectedCourse}`)
        .then((res) => {
          const students = res.data.course?.enrolledStudents || [];
          setEnrolledCount(students.length);
          setMarkingData(students.map((s) => ({
            studentId: s._id, name: s.name, studentCode: s.studentId, status: 'Present', remarks: '',
          })));
        }).catch(console.error);
    }
  }, [selectedCourse, user]);

  const handleMark = async () => {
    try {
      const payload = { courseId: selectedCourse, date, records: markingData };
      await api.post('/attendance/mark', payload);
      setMsg({ text: `✅ Attendance marked for ${markingData.length} students!`, type: 'success' });
      // Refresh records
      const res = await api.get(`/attendance/course/${selectedCourse}`);
      setRecords(res.data.records || []);
    } catch (e) { setMsg({ text: e.response?.data?.message || 'Error marking attendance', type: 'error' }); }
  };

  const markAll = (status) => {
    setMarkingData(markingData.map((s) => ({ ...s, status })));
  };

  const updateStatus = (idx, status) => {
    const updated = [...markingData];
    updated[idx].status = status;
    setMarkingData(updated);
  };

  const statusChip = (status) => {
    const colors = { Present: 'success', Absent: 'error', Excused: 'warning', Late: 'info' };
    return <Chip label={status} size="small" color={colors[status] || 'default'} sx={{ fontWeight: 600 }} />;
  };

  const selectedCourseObj = courses.find((c) => c._id === selectedCourse);

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={0.5}>Attendance</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {user?.role === 'Student' ? 'View your attendance records' : 'Mark and view attendance'}
      </Typography>

      {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ text: '', type: 'success' })} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}

      {/* Course & Date Selection */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          select label="Select Course" size="small" value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          sx={{ minWidth: 280 }}
        >
          {courses.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.courseCode} — {c.title}
              {c.enrolledStudents?.length > 0 ? ` (${c.enrolledStudents.length} students)` : ' (No students)'}
            </MenuItem>
          ))}
        </TextField>
        {(user?.role === 'Faculty' || user?.role === 'Admin') && (
          <TextField
            label="Date" type="date" size="small" value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
        )}
        {selectedCourseObj && (
          <Chip
            icon={<People sx={{ fontSize: 16 }} />}
            label={`${enrolledCount} enrolled • ${selectedCourseObj.status?.replace('_', ' ')}`}
            variant="outlined" size="small"
            color={enrolledCount > 0 ? 'primary' : 'warning'}
          />
        )}
      </Box>

      {/* Faculty/Admin: Mark Attendance */}
      {(user?.role === 'Faculty' || user?.role === 'Admin') && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                <FactCheck sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mark Attendance — {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Mark all Present">
                  <Button size="small" variant="outlined" color="success" onClick={() => markAll('Present')}>
                    All Present
                  </Button>
                </Tooltip>
                <Tooltip title="Mark all Absent">
                  <Button size="small" variant="outlined" color="error" onClick={() => markAll('Absent')}>
                    All Absent
                  </Button>
                </Tooltip>
                <Button variant="contained" startIcon={<Save />} onClick={handleMark} disabled={markingData.length === 0}>
                  Save Attendance
                </Button>
              </Box>
            </Box>

            {markingData.length === 0 ? (
              <Alert severity="warning" icon={<Warning />} sx={{ borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600}>No students enrolled in this course</Typography>
                <Typography variant="caption" color="text.secondary">
                  Students need to enroll in "{selectedCourseObj?.title}" before attendance can be marked. 
                  Try selecting a course with enrolled students like CS101 or MATH201.
                </Typography>
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell><TableCell>ID</TableCell>
                      <TableCell>Present</TableCell><TableCell>Absent</TableCell>
                      <TableCell>Late</TableCell><TableCell>Excused</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markingData.map((s, i) => (
                      <TableRow key={s.studentId} sx={{ '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' } }}>
                        <TableCell><Typography fontWeight={600} fontSize="0.85rem">{s.name}</Typography></TableCell>
                        <TableCell><Typography variant="caption" color="text.secondary">{s.studentCode}</Typography></TableCell>
                        {['Present', 'Absent', 'Late', 'Excused'].map((st) => (
                          <TableCell key={st} padding="checkbox">
                            <Checkbox checked={s.status === st} onChange={() => updateStatus(i, st)} size="small"
                              sx={{ color: st === 'Present' ? '#10b981' : st === 'Absent' ? '#ef4444' : st === 'Late' ? '#3b82f6' : '#f59e0b',
                                '&.Mui-checked': { color: st === 'Present' ? '#10b981' : st === 'Absent' ? '#ef4444' : st === 'Late' ? '#3b82f6' : '#f59e0b' } }} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Records Table */}
      <Typography variant="h6" fontWeight={700} mb={2}>
        Attendance Records
        {records.length > 0 && <Chip label={`${records.length} records`} size="small" sx={{ ml: 1, fontWeight: 600 }} />}
      </Typography>
      <TableContainer component={Card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {user?.role !== 'Student' && <TableCell>Student</TableCell>}
              {user?.role === 'Student' && <TableCell>Course</TableCell>}
              <TableCell>Date</TableCell><TableCell>Status</TableCell><TableCell>Marked By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  {enrolledCount === 0
                    ? '⚠️ No students enrolled — select a course with students to see records'
                    : '📋 No attendance records yet for this course. Use the form above to mark attendance.'}
                </TableCell>
              </TableRow>
            ) : records.slice(0, 50).map((r) => (
              <TableRow key={r._id} sx={{ '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' } }}>
                {user?.role !== 'Student' && <TableCell>{r.student?.name || '—'}</TableCell>}
                {user?.role === 'Student' && <TableCell>{r.course?.courseCode} — {r.course?.title}</TableCell>}
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>{statusChip(r.status)}</TableCell>
                <TableCell><Typography variant="caption" color="text.secondary">{r.markedBy?.name || '—'}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
