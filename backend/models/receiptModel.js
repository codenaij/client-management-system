const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: [true, 'Receipt should have a customer']
  },
  investment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investment'
  },
  topUp: {
    type: mongoose.Schema.ObjectId,
    ref: 'TopUp'
  },
  // issuedBy: {},
  issuedAt: {
    type: Date,
    default: Date.now()
  },
  generated: {
    type: Boolean,
    default: false
  }
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
