const express = require('express');
const router = express.Router();
const {
  getCourses, getCourse, createCourse, updateCourse,
  enrollCourse, unenrollCourse, assignFaculty, deleteCourse, getMyCourses
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', protect, getCourses);
router.get('/enrolled', protect, getMyCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, roleCheck('Admin'), createCourse);
router.put('/:id', protect, roleCheck('Admin'), updateCourse);
router.delete('/:id', protect, roleCheck('Admin'), deleteCourse);
router.post('/:id/enroll', protect, roleCheck('Student'), enrollCourse);
router.post('/:id/unenroll', protect, roleCheck('Student'), unenrollCourse);
router.put('/:id/assign-faculty', protect, roleCheck('Admin'), assignFaculty);

module.exports = router;
