const mongoose = require('mongoose');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// @desc    Add material to course
// @route   POST /api/lms/courses/:id/materials
// @access  Private (Faculty/Admin)
exports.addMaterial = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if faculty is assigned to this course
    if (req.user.role === 'Faculty' && course.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to add materials to this course' });
    }

    course.materials.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create assignment
// @route   POST /api/lms/assignments
// @access  Private (Faculty/Admin)
exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxScore } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      faculty: req.user._id,
      dueDate,
      maxScore
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments for a course
// @route   GET /api/lms/courses/:id/assignments
// @access  Private
exports.getCourseAssignments = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Course ID' });
    }

    const assignments = await Assignment.find({ course: req.params.id })
      .populate('faculty', 'name email')
      .populate('submissions.student', 'name studentId');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/lms/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    assignment.submissions.push({
      student: req.user._id,
      content: req.body.content,
      fileUrl: req.body.fileUrl
    });

    await assignment.save();
    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/lms/assignments/:id/grade/:studentId
// @access  Private (Faculty)
exports.gradeSubmission = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(
      s => s.student.toString() === req.params.studentId
    );

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;

    await assignment.save();
    res.json({ message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
