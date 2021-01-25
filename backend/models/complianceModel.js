const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer'
  },
  investment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investment'
  },
  topup: {
    type: mongoose.Schema.ObjectId,
    ref: 'TopUp'
  },
  complianceVerified: {
    type: Boolean,
    default: false
  },
  dateComplianceVerified: {
    type: Date,
    default: Date.now()
  },
  complianceVerifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff'
  },
  comment: String
});

const Compliance = mongoose.model('Compliance', complianceSchema);

module.exports = Compliance;
