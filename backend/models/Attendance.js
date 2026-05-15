const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Excused', 'Late'],
      required: [true, 'Attendance status is required'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [200, 'Remarks cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one record per student per course per day
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

// Index for querying by course or student
attendanceSchema.index({ course: 1, date: -1 });
attendanceSchema.index({ student: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
