const Grade = require('../models/Grade');

exports.upsertGrade = async (req, res) => {
  try {
    const { studentId, courseId, assignments, midterm, final: finalExam, remarks } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ success: false, message: 'studentId and courseId are required' });
    }
    let grade = await Grade.findOne({ student: studentId, course: courseId });
    if (grade) {
      if (assignments) grade.assignments = assignments;
      if (midterm) grade.midterm = midterm;
      if (finalExam) grade.final = finalExam;
      if (remarks) grade.remarks = remarks;
      grade.gradedBy = req.user._id;
      await grade.save();
    } else {
      grade = await Grade.create({
        student: studentId, course: courseId,
        assignments: assignments || [],
        midterm: midterm || { score: 0, maxScore: 100 },
        final: finalExam || { score: 0, maxScore: 100 },
        gradedBy: req.user._id, remarks,
      });
    }
    const populated = await Grade.findById(grade._id)
      .populate('student', 'name email studentId')
      .populate('course', 'courseCode title credits');
    res.json({ success: true, grade: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate('student', 'name email studentId')
      .populate('gradedBy', 'name')
      .sort({ totalGrade: -1 });
    res.json({ success: true, count: grades.length, grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentGrades = async (req, res) => {
  try {
    if (req.user.role === 'Student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ success: false, message: 'Can only view your own grades' });
    }
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('course', 'courseCode title credits department')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: grades.length, grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentGPA = async (req, res) => {
  try {
    if (req.user.role === 'Student' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ success: false, message: 'Can only view your own GPA' });
    }
    const grades = await Grade.find({ student: req.params.studentId }).populate('course', 'credits');
    if (grades.length === 0) {
      return res.json({ success: true, gpa: 0, totalCredits: 0, coursesCompleted: 0 });
    }
    let totalPoints = 0, totalCredits = 0;
    grades.forEach((g) => {
      if (g.gpa !== undefined && g.course && g.course.credits) {
        totalPoints += g.gpa * g.course.credits;
        totalCredits += g.course.credits;
      }
    });
    const cumulativeGPA = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
    res.json({ success: true, gpa: cumulativeGPA, totalCredits, coursesCompleted: grades.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
