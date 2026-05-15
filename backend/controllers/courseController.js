const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const { status, department, semester, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
      ];
    }

    // Students only see published/enrollment-open/in-progress courses
    if (req.user.role === 'Student') {
      filter.status = { $in: ['Published', 'Enrollment_Open', 'In_Progress', 'Completed'] };
    }

    const courses = await Course.find(filter)
      .populate('faculty', 'name email facultyId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty', 'name email facultyId department')
      .populate('enrolledStudents', 'name email studentId department');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Admin
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Validate status transition if status is being changed
    if (req.body.status && req.body.status !== course.status) {
      const transition = Course.validateTransition(course.status, req.body.status);
      if (!transition.valid) {
        return res.status(400).json({ success: false, message: transition.message });
      }
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('faculty', 'name email')
      .populate('enrolledStudents', 'name email studentId');

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Student
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.status !== 'Enrollment_Open') {
      return res.status(400).json({
        success: false,
        message: `Cannot enroll — course status is "${course.status}". Enrollment is only open when status is "Enrollment_Open".`,
      });
    }

    if (course.isFull) {
      return res.status(400).json({ success: false, message: 'Course is at maximum capacity' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Student
exports.unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!['Enrollment_Open'].includes(course.status)) {
      return res.status(400).json({ success: false, message: 'Cannot unenroll after enrollment period' });
    }

    const idx = course.enrolledStudents.indexOf(req.user._id);
    if (idx === -1) {
      return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
    }

    course.enrolledStudents.splice(idx, 1);
    await course.save();

    res.json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign faculty to course
// @route   PUT /api/courses/:id/assign-faculty
// @access  Admin
exports.assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'Faculty') {
      return res.status(400).json({ success: false, message: 'Invalid faculty member' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { faculty: facultyId },
      { new: true }
    ).populate('faculty', 'name email facultyId');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.enrolledStudents.length > 0 && course.status === 'In_Progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a course that is in progress with enrolled students',
      });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get courses for current user (Enrolled for students, Assigned for faculty)
// @route   GET /api/courses/enrolled
// @access  Private
exports.getMyCourses = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      filter = { enrolledStudents: req.user._id };
    } else if (req.user.role === 'Faculty') {
      filter = { faculty: req.user._id };
    } else if (req.user.role === 'Admin') {
      filter = {}; // Admins see all for LMS
    }

    const courses = await Course.find(filter)
      .populate('faculty', 'name email facultyId')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
