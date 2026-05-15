const Fee = require('../models/Fee');
const User = require('../models/User');

// @desc    Get all fees (Admin) or specific student fees
// @route   GET /api/fees
// @access  Private
exports.getFees = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Student') {
      query.student = req.user._id;
    } else if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    const fees = await Fee.find(query).populate('student', 'name email studentId').sort({ dueDate: 1 });
    res.json({ success: true, count: fees.length, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get fee by ID
// @route   GET /api/fees/:id
// @access  Private
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name email studentId');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    // Check ownership
    if (req.user.role === 'Student' && fee.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this fee' });
    }

    res.json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process fee payment (Mock)
// @route   POST /api/fees/:id/pay
// @access  Student
exports.processPayment = async (req, res) => {
  try {
    const { amount, cardNo, cvv, expiry } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    if (fee.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'Fee is already paid' });
    }

    // Mock Card Validation (per requirements in the image)
    if (cardNo === '0000000000000000' || cvv === '000') {
      return res.status(400).json({ success: false, message: 'Invalid card details.' });
    }

    // Valid card check (e.g. 4111...)
    if (!cardNo || cardNo.length < 16 || !cvv || !expiry) {
      return res.status(400).json({ success: false, message: 'Please provide valid payment details.' });
    }

    // Process payment
    fee.status = 'Paid';
    fee.paymentDetails = {
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      paymentDate: new Date(),
      method: 'Card',
      lastFour: cardNo.slice(-4),
    };
    fee.receiptNumber = 'REC' + Date.now().toString().slice(-8);

    await fee.save();

    res.json({
      success: true,
      message: 'Payment successful. Receipt generated.',
      fee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new fee (Admin)
// @route   POST /api/fees
// @access  Admin
exports.createFee = async (req, res) => {
  try {
    const { studentId, title, amount, dueDate } = req.body;
    
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ success: false, message: 'Valid student not found' });
    }

    const fee = await Fee.create({
      student: studentId,
      title,
      amount,
      dueDate,
    });

    res.status(201).json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
