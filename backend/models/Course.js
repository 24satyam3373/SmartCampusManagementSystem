const mongoose = require('mongoose');

// Valid state transitions for the course lifecycle
const VALID_TRANSITIONS = {
  Draft: ['Published'],
  Published: ['Enrollment_Open', 'Draft'],
  Enrollment_Open: ['In_Progress', 'Published'],
  In_Progress: ['Completed'],
  Completed: ['Archived'],
  Archived: [],
};

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Minimum 1 credit'],
      max: [6, 'Maximum 6 credits'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    maxCapacity: {
      type: Number,
      default: 60,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    schedule: {
      days: [
        {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
      ],
      startTime: String,
      endTime: String,
      room: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Enrollment_Open', 'In_Progress', 'Completed', 'Archived'],
      default: 'Draft',
    },
    semester: {
      type: String,
      enum: ['Fall', 'Spring', 'Summer'],
    },
    year: {
      type: Number,
    },
    materials: [
      {
        title: { type: String, required: true },
        type: { type: String, enum: ['PDF', 'Video', 'Link', 'Document'], default: 'Link' },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: current enrollment count
courseSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Virtual: is course full
courseSchema.virtual('isFull').get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length >= this.maxCapacity : false;
});

// Static: validate state transition
courseSchema.statics.validateTransition = function (currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `Cannot transition from "${currentStatus}" to "${newStatus}". Allowed: [${(allowed || []).join(', ')}]`,
    };
  }
  return { valid: true };
};

// Index for common queries
courseSchema.index({ status: 1, department: 1 });
courseSchema.index({ faculty: 1 });

module.exports = mongoose.model('Course', courseSchema);
