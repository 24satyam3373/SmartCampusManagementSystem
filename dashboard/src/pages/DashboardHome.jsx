import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress, Skeleton, Avatar, Button, useTheme } from '@mui/material';
import { People, MenuBook, FactCheck, TrendingUp, School, Assignment, CalendarMonth, Warning, ArrowForward, Payments } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

function StatCard({ icon, label, value, color, subtitle }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{
      background: isDark 
        ? `linear-gradient(135deg, ${color}15, ${color}05)`
        : `linear-gradient(135deg, ${color}10, ${theme.palette.background.paper})`,
      border: `1px solid ${color}20`,
      '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? `0 8px 25px ${color}15` : `0 8px 30px rgba(0,0,0,0.08)` },
      transition: 'all 0.3s ease',
    }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: 3, bgcolor: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} color={color}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children, height = 400 }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{ 
      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.05)',
      borderRadius: 4,
      background: isDark 
        ? 'linear-gradient(135deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))'
        : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))',
      backdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.08)',
    }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography variant="h6" fontWeight={800} mb={3} sx={{ color: 'text.primary', opacity: 0.9, px: 1 }}>{title}</Typography>
        <Box sx={{ width: '100%', height, px: 1 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ 
      bgcolor: isDark ? '#1a1f2e' : '#ffffff', 
      border: '1px solid',
      borderColor: 'divider', 
      borderRadius: 2, 
      p: 1.5,
      boxShadow: isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} variant="caption" display="block" sx={{ color: p.color }}>
          {p.name}: {p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function DashboardHome() {
  const { user, getAvatarUrl } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [pendingFee, setPendingFee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          api.get('/auth/dashboard-stats'),
          api.get('/courses'),
        ];
        
        if (user?.role === 'Student') {
          promises.push(api.get('/fees'));
        }

        const [statsRes, coursesRes, feesRes] = await Promise.all(promises);
        
        setStats(statsRes.data.stats);
        setCourses(coursesRes.data.courses || []);
        
        if (feesRes) {
          const unpaid = feesRes.data.fees.filter(f => f.status !== 'Paid');
          if (unpaid.length > 0) {
            // Check if due within 7 days
            const soon = unpaid.find(f => {
              const diff = new Date(f.dueDate) - new Date();
              return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
            });
            setPendingFee(soon);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const enrolled = courses.filter((c) => c.enrolledStudents?.includes(user?._id));
  const taught = courses.filter((c) => c.faculty?._id === user?._id || c.faculty === user?._id);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} /></Grid>
          ))}
        </Grid>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} /></Grid>
          <Grid item xs={12} md={6}><Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} /></Grid>
        </Grid>
      </Box>
    );
  }

  // Prepare chart data
  const attendancePieData = (stats?.attendanceSummary || []).map((a) => ({ name: a._id, value: a.count }));
  const courseStatusData = (stats?.coursesByStatus || []).map((c) => ({ name: c._id?.replace('_', ' '), value: c.count }));
  const gradeData = (stats?.gradeDistribution || []).map((g) => ({ grade: g._id, count: g.count, avgScore: Math.round(g.avgScore) }));
  const enrollmentData = stats?.enrollmentTrend || [];
  const attendanceTrend = (stats?.attendanceTrend || []).map((a) => ({
    date: a._id.slice(5), // MM-DD
    present: a.present, absent: a.absent, total: a.total,
  }));

  return (
    <Box sx={{ 
      width: '100%', 
      pb: 6,
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: isDark 
          ? 'radial-gradient(rgba(99,102,241,0.05) 1px, transparent 1px)' 
          : 'radial-gradient(rgba(99,102,241,0.1) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: -1,
      }
    }}>
      {/* Visual Welcome Banner */}
      <Card sx={{
        mb: 5, position: 'relative', overflow: 'hidden', borderRadius: 5,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
        border: '1px solid',
        borderColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(99,102,241,0.05)',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/campus_hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: isDark ? 0.12 : 0.06,
        }} />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: isDark 
            ? 'linear-gradient(135deg, rgba(10,14,23,0.85), rgba(10,14,23,0.6))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))',
        }} />
        <CardContent sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 }, px: { xs: 3, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-1px' }}>
                Welcome back, <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
              </Typography>
              <Typography variant="h6" color="text.secondary" mt={1} sx={{ opacity: 0.8, fontWeight: 500 }}>
                {user?.role === 'Admin' && 'Here\'s an overview of your campus ecosystem.'}
                {user?.role === 'Faculty' && 'Here are your classes and tasks for today.'}
                {user?.role === 'Student' && 'Track your courses, attendance, and performance.'}
              </Typography>
            </Box>
            <Avatar
              src={getAvatarUrl(user?.avatar)}
              sx={{
                width: 100, height: 100,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Fee Reminder Banner */}
      {pendingFee && (
        <Card sx={{
          mb: 4, bgcolor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 3, animation: 'pulse 2s infinite ease-in-out'
        }}>
          <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'warning.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Warning fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="warning.main">
                  Fee Payment Reminder
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your <strong>{pendingFee.title}</strong> of ₹{pendingFee.amount.toLocaleString()} is due in {Math.ceil((new Date(pendingFee.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days.
                </Typography>
              </Box>
            </Box>
            <Button
              component={RouterLink}
              to="/fees"
              variant="contained"
              color="warning"
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Pay Now
            </Button>
          </CardContent>
          <style>{`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.2); }
              70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
              100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
            }
          `}</style>
        </Card>
      )}

      {/* Stat Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {user?.role === 'Admin' && (
          <>
            <Grid item xs={12} sm={6} md={3}><StatCard icon={<People />} label="Students" value={stats?.totalStudents || 0} color="#6366f1" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard icon={<Assignment />} label="Faculty" value={stats?.totalFaculty || 0} color="#8b5cf6" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard icon={<MenuBook />} label="Total Courses" value={stats?.totalCourses || 0} color="#10b981" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard icon={<FactCheck />} label="Active" value={courses.filter((c) => c.status === 'In_Progress').length} color="#f59e0b" /></Grid>
          </>
        )}
        {user?.role === 'Faculty' && (
          <>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<MenuBook />} label="My Courses" value={taught.length} color="#6366f1" /></Grid>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<People />} label="Total Students" value={taught.reduce((a, c) => a + (c.enrolledStudents?.length || 0), 0)} color="#10b981" /></Grid>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<CalendarMonth />} label="Classes Today" value={taught.filter((c) => c.schedule?.days?.includes(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()])).length} color="#f59e0b" /></Grid>
          </>
        )}
        {user?.role === 'Student' && (
          <>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<School />} label="Enrolled" value={enrolled.length} color="#6366f1" /></Grid>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<MenuBook />} label="Available" value={courses.filter((c) => c.status === 'Enrollment_Open').length} color="#10b981" /></Grid>
            <Grid item xs={12} sm={6} md={4}><StatCard icon={<TrendingUp />} label="Total Courses" value={courses.length} color="#f59e0b" /></Grid>
          </>
        )}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Attendance Trend (Line/Area Chart) */}
        {attendanceTrend.length > 0 && (
          <Grid item xs={12} md={6}>
            <ChartCard title="📈 Attendance Trend (Last 30 Days)">
              <ResponsiveContainer>
                <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorPresent)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: isDark ? '#111827' : '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorAbsent)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: isDark ? '#111827' : '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        )}

        {/* Attendance Distribution (Pie) */}
        {attendancePieData.length > 0 && (
          <Grid item xs={12} md={6}>
            <ChartCard title="📊 Attendance Distribution">
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={attendancePieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={120}
                    paddingAngle={5} 
                    dataKey="value"
                    stroke={isDark ? '#111827' : '#fff'}
                    strokeWidth={4}
                    animationDuration={2000}
                  >
                    {attendancePieData.map((_, i) => (
                      <Cell key={i} fill={['#10b981', '#ef4444', '#f59e0b', '#3b82f6'][i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '25px' }} layout="horizontal" />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        )}
      </Grid>

      {/* Second Charts Row */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Enrollment Bar Chart */}
        {enrollmentData.length > 0 && (
          <Grid item xs={12} md={6}>
            <ChartCard title="🎓 Course Enrollment vs Capacity">
              <ResponsiveContainer>
                <BarChart data={enrollmentData} barGap={8} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                  <XAxis 
                    dataKey="course" 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="enrolled" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Enrolled" barSize={32} animationDuration={1500} />
                  <Bar dataKey="capacity" fill={isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.12)'} radius={[6, 6, 0, 0]} name="Capacity" barSize={32} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        )}

        {/* Grade Distribution */}
        {gradeData.length > 0 && (
          <Grid item xs={12} md={6}>
            <ChartCard title="📝 Grade Distribution">
              <ResponsiveContainer>
                <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                  <XAxis 
                    dataKey="grade" 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false}
                    dy={10}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1500}>
                    {gradeData.map((entry, i) => {
                      const color = ['A+','A','A-'].includes(entry.grade) ? '#10b981' :
                        ['B+','B','B-'].includes(entry.grade) ? '#6366f1' :
                        ['C+','C','C-'].includes(entry.grade) ? '#f59e0b' : '#ef4444';
                      return <Cell key={i} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        )}
      </Grid>

      {/* Course Cards */}
      <Typography variant="h6" fontWeight={700} mb={2}>
        {user?.role === 'Admin' ? 'All Courses' : user?.role === 'Faculty' ? 'My Courses' : 'My Enrolled Courses'}
      </Typography>
      <Grid container spacing={2}>
        {(user?.role === 'Admin' ? courses : user?.role === 'Faculty' ? taught : enrolled).slice(0, 6).map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c._id}>
            <Card sx={{
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.08)' 
              },
              transition: 'all 0.3s ease',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main">{c.courseCode}</Typography>
                  <Chip label={c.status?.replace('_', ' ')} size="small"
                    color={c.status === 'In_Progress' ? 'success' : c.status === 'Enrollment_Open' ? 'info' : c.status === 'Draft' ? 'default' : 'warning'}
                    variant="outlined" sx={{ fontSize: '0.65rem', height: 22 }} />
                </Box>
                <Typography variant="body2" fontWeight={600} noWrap>{c.title}</Typography>
                <Typography variant="caption" color="text.secondary">{c.credits} Credits • {c.department}</Typography>
                {c.faculty?.name && <Typography variant="caption" color="text.secondary" display="block">Faculty: {c.faculty.name}</Typography>}
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{c.enrolledStudents?.length || 0} / {c.maxCapacity}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
