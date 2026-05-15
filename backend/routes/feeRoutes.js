const express = require('express');
const router = express.Router();
const { getFees, getFeeById, processPayment, createFee } = require('../controllers/feeController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getFees)
  .post(roleCheck('Admin'), createFee);

router.route('/:id')
  .get(getFeeById);

router.post('/:id/pay', roleCheck('Student'), processPayment);

module.exports = router;
