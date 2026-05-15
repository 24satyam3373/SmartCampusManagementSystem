const express = require('express');
const router = express.Router();
const {
  markAttendance, getCourseAttendance, getStudentAttendance, getAttendanceStats,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/mark', protect, roleCheck('Faculty', 'Admin'), markAttendance);
router.get('/course/:courseId', protect, roleCheck('Faculty', 'Admin'), getCourseAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/stats/:courseId', protect, getAttendanceStats);

module.exports = router;
