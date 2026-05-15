const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
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
    assignments: [
      {
        title: { type: String, required: true },
        score: { type: Number, required: true, min: 0 },
        maxScore: { type: Number, required: true, min: 1 },
        weight: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
    midterm: {
      score: { type: Number, min: 0, default: 0 },
      maxScore: { type: Number, min: 1, default: 100 },
    },
    final: {
      score: { type: Number, min: 0, default: 0 },
      maxScore: { type: Number, min: 1, default: 100 },
    },
    totalGrade: {
      type: Number,
      min: 0,
      max: 100,
    },
    letterGrade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'N/A'],
      default: 'N/A',
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One grade record per student per course
gradeSchema.index({ student: 1, course: 1 }, { unique: true });

// Compute letter grade and GPA from totalGrade
gradeSchema.methods.computeLetterGrade = function () {
  const g = this.totalGrade;
  if (g >= 97) { this.letterGrade = 'A+'; this.gpa = 4.0; }
  else if (g >= 93) { this.letterGrade = 'A'; this.gpa = 4.0; }
  else if (g >= 90) { this.letterGrade = 'A-'; this.gpa = 3.7; }
  else if (g >= 87) { this.letterGrade = 'B+'; this.gpa = 3.3; }
  else if (g >= 83) { this.letterGrade = 'B'; this.gpa = 3.0; }
  else if (g >= 80) { this.letterGrade = 'B-'; this.gpa = 2.7; }
  else if (g >= 77) { this.letterGrade = 'C+'; this.gpa = 2.3; }
  else if (g >= 73) { this.letterGrade = 'C'; this.gpa = 2.0; }
  else if (g >= 70) { this.letterGrade = 'C-'; this.gpa = 1.7; }
  else if (g >= 67) { this.letterGrade = 'D+'; this.gpa = 1.3; }
  else if (g >= 60) { this.letterGrade = 'D'; this.gpa = 1.0; }
  else { this.letterGrade = 'F'; this.gpa = 0.0; }
};

// Pre-save: compute total grade from components
gradeSchema.pre('save', function (next) {
  // Calculate weighted assignment average
  let assignmentTotal = 0;
  let assignmentWeightSum = 0;
  if (this.assignments && this.assignments.length > 0) {
    this.assignments.forEach((a) => {
      assignmentTotal += (a.score / a.maxScore) * a.weight;
      assignmentWeightSum += a.weight;
    });
  }

  // Remaining weight split between midterm (30%) and final (30%) if no assignments
  const midtermPercent = this.midterm.score / this.midterm.maxScore;
  const finalPercent = this.final.score / this.final.maxScore;

  // Default weighting: assignments 40%, midterm 30%, final 30%
  if (assignmentWeightSum > 0) {
    this.totalGrade = Math.round(
      (assignmentTotal / assignmentWeightSum) * 40 +
      midtermPercent * 30 +
      finalPercent * 30
    );
  } else {
    this.totalGrade = Math.round(midtermPercent * 50 + finalPercent * 50);
  }

  this.computeLetterGrade();
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
