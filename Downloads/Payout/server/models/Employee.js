const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'عضو'
  },
  defaultDeductionRate: {
    type: Number,
    default: 10
  },
  paymentMethod: {
    type: String,
    default: 'instapay'
  },
  paymentDetails: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  adjustments: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
