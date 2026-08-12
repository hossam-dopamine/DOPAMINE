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
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  },
  tenantId: {
    type: String,
    required: true,
    default: 'default_tenant',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
