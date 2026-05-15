const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @desc    Mark attendance (bulk)
// @route   POST /api/attendance/mark
// @access  Faculty
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    // records: [{ studentId, status, remarks }]

    if (!courseId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, date, and records array',
      });
    }

    // Verify faculty teaches this course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this course',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        const attendance = await Attendance.findOneAndUpdate(
          {
            student: record.studentId,
            course: courseId,
            date: attendanceDate,
          },
          {
            student: record.studentId,
            course: courseId,
            date: attendanceDate,
            status: record.status,
            markedBy: req.user._id,
            remarks: record.remarks || '',
          },
          { upsert: true, new: true, runValidators: true }
        );
        results.push(attendance);
      } catch (err) {
        errors.push({ studentId: record.studentId, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Marked ${results.length} records, ${errors.length} errors`,
      results,
      errors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for a course
// @route   GET /api/attendance/course/:courseId
// @access  Faculty, Admin
exports.getCourseAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { course: req.params.courseId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name email studentId')
      .populate('markedBy', 'name')
      .sort({ date: -1, student: 1 });

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student attendance
// @route   GET /api/attendance/student/:studentId
// @access  Student (own), Faculty, Admin
exports.getStudentAttendance = async (req, res) => {
  try {
    // Students can only view their own attendance
    if (req.user.role === 'Student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ success: false, message: 'Can only view your own attendance' });
    }

    const { courseId } = req.query;
    const filter = { student: req.params.studentId };
    if (courseId) filter.course = courseId;

    const records = await Attendance.find(filter)
      .populate('course', 'courseCode title')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance statistics for a course
// @route   GET /api/attendance/stats/:courseId
// @access  Private
exports.getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      { $match: { course: require('mongoose').Types.ObjectId.createFromHexString(req.params.courseId) } },
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
          excused: { $sum: { $cond: [{ $eq: ['$status', 'Excused'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $project: {
          studentName: '$student.name',
          studentId: '$student.studentId',
          total: 1,
          present: 1,
          absent: 1,
          excused: 1,
          late: 1,
          attendanceRate: {
            $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 1],
          },
        },
      },
      { $sort: { attendanceRate: -1 } },
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
