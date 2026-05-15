const express = require('express');
const router = express.Router();
const { upsertGrade, getCourseGrades, getStudentGrades, getStudentGPA } = require('../controllers/gradeController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/', protect, roleCheck('Faculty', 'Admin'), upsertGrade);
router.get('/course/:courseId', protect, roleCheck('Faculty', 'Admin'), getCourseGrades);
router.get('/student/:studentId', protect, getStudentGrades);
router.get('/gpa/:studentId', protect, getStudentGPA);

module.exports = router;
