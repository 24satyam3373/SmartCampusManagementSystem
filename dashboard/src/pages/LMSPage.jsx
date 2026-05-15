import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Box, Grid, Card, CardContent, Typography, Button, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  List, ListItem, ListItemText, ListItemIcon, Divider, Chip,
  LinearProgress, Tab, Tabs, IconButton
} from '@mui/material';
import { 
  MenuBook, Assignment, VideoLibrary, PictureAsPdf, 
  Link as LinkIcon, CloudUpload, Grade, Send, CheckCircle, 
  Error, CalendarMonth 
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LMSPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'Link', url: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', maxScore: 100 });
  const [submissionContent, setSubmissionContent] = useState('');
  const [targetAssignment, setTargetAssignment] = useState(null);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [targetSubmission, setTargetSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/enrolled');
      setCourses(res.data);
      if (res.data.length > 0) handleSelectCourse(res.data[0]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    try {
      const res = await api.get(`/lms/courses/${course._id}/assignments`);
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAddMaterial = async () => {
    try {
      await api.post(`/lms/courses/${selectedCourse._id}/materials`, newMaterial);
      setOpenMaterialDialog(false);
      // Refresh course data
      const res = await api.get('/courses/enrolled');
      const updated = res.data.find(c => c._id === selectedCourse._id);
      setSelectedCourse(updated);
      setNewMaterial({ title: '', type: 'Link', url: '' });
    } catch (error) {
      alert('Error adding material');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await api.post('/lms/assignments', { ...newAssignment, courseId: selectedCourse._id });
      setOpenAssignmentDialog(false);
      handleSelectCourse(selectedCourse);
      setNewAssignment({ title: '', description: '', dueDate: '', maxScore: 100 });
    } catch (error) {
      alert('Error creating assignment');
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      await api.post(`/lms/assignments/${targetAssignment._id}/submit`, { content: submissionContent });
      setOpenSubmitDialog(false);
      handleSelectCourse(selectedCourse);
      setSubmissionContent('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting assignment');
    }
  };

  const handleGradeSubmission = async () => {
    try {
      await api.put(`/lms/assignments/${selectedAssignment._id}/grade/${targetSubmission.student._id}`, gradeData);
      setOpenGradeDialog(false);
      
      // Refresh assignments
      const res = await api.get(`/lms/courses/${selectedCourse._id}/assignments`);
      setAssignments(res.data);
      const updatedAsm = res.data.find(a => a._id === selectedAssignment._id);
      setSelectedAssignment(updatedAsm);
      setGradeData({ grade: '', feedback: '' });
    } catch (error) {
      alert('Error updating grade');
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 4
      }}>
        Learning Management System
      </Typography>

      <Grid container spacing={4}>
        {/* Course List Sidebar */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook color="primary" /> My Courses
          </Typography>
          <List sx={{ background: 'action.hover', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
            {courses.map((course) => (
              <ListItem 
                button 
                key={course._id} 
                selected={selectedCourse?._id === course._id}
                onClick={() => handleSelectCourse(course)}
                sx={{ borderRadius: '12px', m: 1, '&.Mui-selected': { background: 'rgba(99,102,241,0.15)' } }}
              >
                <ListItemText primary={course.title} secondary={course.courseCode} />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Course Content Area */}
        <Grid item xs={12} md={9}>
          {selectedCourse ? (
            <Card sx={{ borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2 }}>
                  <Tab label="Materials" />
                  <Tab label="Assignments" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Course Materials</Typography>
                  {user.role === 'Faculty' && (
                    <Button variant="contained" startIcon={<CloudUpload />} onClick={() => setOpenMaterialDialog(true)} sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}>
                      Add Material
                    </Button>
                  )}
                </Box>
                
                <List>
                  {selectedCourse.materials?.length > 0 ? selectedCourse.materials.map((m, i) => (
                    <Card key={i} sx={{ mb: 2, background: 'action.hover', borderRadius: '12px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <ListItem>
                        <ListItemIcon>
                          {m.type === 'PDF' ? <PictureAsPdf color="error" /> : 
                           m.type === 'Video' ? <VideoLibrary color="primary" /> : <LinkIcon />}
                        </ListItemIcon>
                        <ListItemText primary={m.title} secondary={new Date(m.uploadedAt).toLocaleDateString()} />
                        <Button href={m.url} target="_blank" variant="outlined" size="small">View</Button>
                      </ListItem>
                    </Card>
                  )) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <Error sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>No materials uploaded yet.</Typography>
                    </Box>
                  )}
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Assignments</Typography>
                  {user.role === 'Faculty' && (
                    <Button variant="contained" startIcon={<Assignment />} onClick={() => setOpenAssignmentDialog(true)} sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}>
                      New Assignment
                    </Button>
                  )}
                </Box>

                <Grid container spacing={3}>
                  {assignments.map((asm) => {
                    const submission = asm.submissions?.find(s => s.student === user?._id);
                    return (
                      <Grid item xs={12} key={asm._id}>
                        <Card sx={{ background: 'action.hover', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <Typography variant="h6" fontWeight={700}>{asm.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{asm.description}</Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Chip icon={<CalendarMonth />} label={`Due: ${new Date(asm.dueDate).toLocaleDateString()}`} size="small" />
                                  <Chip icon={<Grade />} label={`${asm.maxScore} Points`} size="small" variant="outlined" />
                                </Box>
                              </div>
                              {user.role === 'Student' && (
                                submission ? (
                                  <Box sx={{ textAlign: 'right' }}>
                                    <Chip icon={<CheckCircle />} label="Submitted" color="success" sx={{ mb: 1 }} />
                                    {submission.grade !== undefined && (
                                      <Typography variant="h6" color="primary">Score: {submission.grade}/{asm.maxScore}</Typography>
                                    )}
                                  </Box>
                                ) : (
                                  <Button variant="contained" color="secondary" onClick={() => { setTargetAssignment(asm); setOpenSubmitDialog(true); }}>
                                    Submit Now
                                  </Button>
                                )
                              )}
                              {user.role === 'Faculty' && (
                                <Button 
                                  variant="outlined" 
                                  startIcon={<Grade />} 
                                  onClick={() => { setSelectedAssignment(asm); setOpenSubmissionsDialog(true); }}
                                >
                                  View Submissions ({asm.submissions?.length || 0})
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </TabPanel>
            </Card>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <MenuBook sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
              <Typography variant="h5" color="text.secondary">Select a course to view LMS content</Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog open={openMaterialDialog} onClose={() => setOpenMaterialDialog(false)}>
        <DialogTitle>Add Course Material</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Title" fullWidth value={newMaterial.title} onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})} />
          <TextField select label="Type" fullWidth SelectProps={{ native: true }} value={newMaterial.type} onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}>
            <option value="Link">Link</option>
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
          </TextField>
          <TextField label="URL" fullWidth value={newMaterial.url} onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMaterialDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMaterial} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)}>
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Title" fullWidth value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
          <TextField label="Description" fullWidth multiline rows={3} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
          <TextField label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
          <TextField label="Max Score" type="number" fullWidth value={newAssignment.maxScore} onChange={(e) => setNewAssignment({...newAssignment, maxScore: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignmentDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAssignment} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Submit Assignment: {targetAssignment?.title}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField 
            label="Your Submission / Links" 
            fullWidth 
            multiline 
            rows={6} 
            placeholder="Type your response or paste links to your work here..."
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained" startIcon={<Send />}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* View Submissions Dialog */}
      <Dialog open={openSubmissionsDialog} onClose={() => setOpenSubmissionsDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Submissions: {selectedAssignment?.title}</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ width: '100%', p: 0 }}>
            {selectedAssignment?.submissions?.length > 0 ? selectedAssignment.submissions.map((sub, i) => (
              <Box key={sub._id}>
                <ListItem sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={700}>{sub.student?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">({sub.student?.studentId})</Typography>
                    </Box>
                    <Box>
                      {sub.grade !== undefined ? (
                        <Chip label={`Graded: ${sub.grade}/${selectedAssignment.maxScore}`} color="primary" size="small" />
                      ) : (
                        <Chip label="Pending Grade" color="warning" size="small" />
                      )}
                      <Button 
                        size="small" 
                        sx={{ ml: 1 }} 
                        onClick={() => { setTargetSubmission(sub); setGradeData({ grade: sub.grade || '', feedback: sub.feedback || '' }); setOpenGradeDialog(true); }}
                      >
                        Grade
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ background: 'action.hover', p: 2, borderRadius: '8px', width: '100%', whiteSpace: 'pre-wrap' }}>
                    {sub.content}
                  </Typography>
                  {sub.feedback && (
                    <Typography variant="caption" sx={{ mt: 1, color: 'primary.main', fontStyle: 'italic' }}>
                      Feedback: {sub.feedback}
                    </Typography>
                  )}
                </ListItem>
                <Divider />
              </Box>
            )) : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>No submissions yet.</Typography>
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmissionsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Grade Submission Dialog */}
      <Dialog open={openGradeDialog} onClose={() => setOpenGradeDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Grade Submission: {targetSubmission?.student?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Score" 
            type="number" 
            fullWidth 
            value={gradeData.grade} 
            onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
            helperText={`Max Score: ${selectedAssignment?.maxScore}`}
          />
          <TextField 
            label="Feedback" 
            fullWidth 
            multiline 
            rows={3} 
            value={gradeData.feedback} 
            onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGradeDialog(false)}>Cancel</Button>
          <Button onClick={handleGradeSubmission} variant="contained">Save Grade</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
