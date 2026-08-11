const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    default: 'task'
  },
  taskNumber: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  gross: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR'],
    default: 'USD'
  },
  deductionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  delayDeduction: {
    type: Number,
    default: 0,
    min: 0
  },
  advance: {
    type: Number,
    default: 0,
    min: 0
  },
  fixedDeduction: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'paid'],
    default: 'pending'
  },
  month: {
    type: String,
    default: 'january'
  },
  exchangeRate: {
    type: Number
  },
  eurExchangeRate: {
    type: Number
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  character: {
    type: String,
    default: ''
  },
  vpn: {
    type: String,
    default: ''
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

taskSchema.index({ tenantId: 1, employeeId: 1, month: 1 });
taskSchema.index({ tenantId: 1, status: 1 });
taskSchema.index({ tenantId: 1, employeeId: 1, status: 1 });
taskSchema.index({ employeeId: 1, month: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ employeeId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
