const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the fee (e.g. Semester 1 Tuition)'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the fee amount'],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid'],
      default: 'Unpaid',
    },
    paymentDetails: {
      transactionId: String,
      paymentDate: Date,
      method: {
        type: String,
        enum: ['Card', 'NetBanking', 'UPI', 'Cash'],
      },
      lastFour: String,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fee', feeSchema);
