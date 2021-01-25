const mongoose = require('mongoose');

const mouSchema = new mongoose.Schema({
  investment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investment'
  },
  topUp: {
    type: mongoose.Schema.ObjectId,
    ref: 'TopUp'
  },
  mouGenerated: {
    type: Boolean,
    default: false
  },
  dateGenerated: {
    type: Date,
    default: Date.now
  }
  // TODO issuedBy
});

const Mou = mongoose.model('Mou', mouSchema);

module.exports = Mou;
