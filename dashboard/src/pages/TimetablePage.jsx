import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Card, CardContent, Chip, Grid, LinearProgress } from '@mui/material';
import { AccessTime, Room, Person } from '@mui/icons-material';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6'];

export default function TimetablePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then((res) => {
      const allCourses = res.data.courses || [];
      // Filter to only show courses relevant to user
      let filtered;
      if (user?.role === 'Student') {
        filtered = allCourses.filter((c) => c.enrolledStudents?.includes(user._id) && c.schedule?.days?.length > 0);
      } else if (user?.role === 'Faculty') {
        filtered = allCourses.filter((c) => (c.faculty?._id === user._id || c.faculty === user._id) && c.schedule?.days?.length > 0);
      } else {
        filtered = allCourses.filter((c) => c.schedule?.days?.length > 0);
      }
      setCourses(filtered);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  // Build timetable grid: { day: { hour: course } }
  const getSlot = (day, hour) => {
    return courses.find((c) => {
      if (!c.schedule?.days?.includes(day)) return false;
      const start = c.schedule.startTime;
      const end = c.schedule.endTime;
      return start && hour >= start && hour < end;
    });
  };

  if (loading) return <LinearProgress />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={0.5}>Timetable</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {user?.role === 'Student' ? 'Your weekly class schedule' : user?.role === 'Faculty' ? 'Your teaching schedule' : 'All scheduled courses'}
      </Typography>

      {courses.length === 0 ? (
        <Card><CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">No scheduled courses found</Typography>
          <Typography variant="body2" color="text.secondary">Courses need schedule data (days, start/end times) to appear here.</Typography>
        </CardContent></Card>
      ) : (
        <>
          {/* Weekly Grid View */}
          <Card sx={{ mb: 3, overflow: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', minWidth: 900 }}>
              {/* Header row */}
              <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>TIME</Typography>
              </Box>
              {DAYS.map((day) => (
                <Box key={day} sx={{ p: 1.5, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">{day.slice(0, 3).toUpperCase()}</Typography>
                </Box>
              ))}

              {/* Time slots */}
              {HOURS.map((hour) => (
                <Box key={hour} sx={{ display: 'contents' }}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>{hour}</Typography>
                  </Box>
                  {DAYS.map((day) => {
                    const course = getSlot(day, hour);
                    const colorIdx = course ? courses.indexOf(course) % COLORS.length : 0;
                    const isStart = course && course.schedule.startTime === hour;

                    return (
                      <Box key={`${day}-${hour}`} sx={{
                        p: 0.5, minHeight: 50,
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        bgcolor: course ? `${COLORS[colorIdx]}10` : 'transparent',
                      }}>
                        {isStart && (
                          <Box sx={{
                            p: 1, borderRadius: 1.5, height: '100%',
                            bgcolor: `${COLORS[colorIdx]}20`,
                            borderLeft: `3px solid ${COLORS[colorIdx]}`,
                            display: 'flex', flexDirection: 'column', gap: 0.25,
                          }}>
                            <Typography variant="caption" fontWeight={800} color={COLORS[colorIdx]} sx={{ display: 'block', lineHeight: 1.3 }}>
                              {course.courseCode}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', lineHeight: 1.3 }} noWrap>
                              {course.title}
                            </Typography>
                            {course.schedule.room && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem', lineHeight: 1.3, mt: 0.25 }}>
                                📍 {course.schedule.room}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Card>

          {/* Course List with Schedule Details */}
          <Typography variant="h6" fontWeight={700} mb={2}>Schedule Details</Typography>
          <Grid container spacing={2}>
            {courses.map((c, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c._id}>
                <Card sx={{
                  borderLeft: `4px solid ${COLORS[i % COLORS.length]}`,
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' },
                  transition: 'all 0.3s ease',
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={800} color={COLORS[i % COLORS.length]}>
                      {c.courseCode}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} mb={1}>{c.title}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {c.schedule.startTime} — {c.schedule.endTime}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Room sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{c.schedule.room || 'TBD'}</Typography>
                      </Box>
                      {c.faculty?.name && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">{c.faculty.name}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {c.schedule.days?.map((d) => (
                        <Chip key={d} label={d.slice(0, 3)} size="small" variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 22, borderColor: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length] }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
