const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const {
  addMaterial,
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  gradeSubmission
} = require('../controllers/lmsController');

router.use(protect);

router.post('/courses/:id/materials', roleCheck('Faculty', 'Admin'), addMaterial);
router.get('/courses/:id/assignments', getCourseAssignments);
router.post('/assignments', roleCheck('Faculty', 'Admin'), createAssignment);
router.post('/assignments/:id/submit', roleCheck('Student'), submitAssignment);
router.put('/assignments/:id/grade/:studentId', roleCheck('Faculty', 'Admin'), gradeSubmission);

module.exports = router;
