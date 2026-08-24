const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tenantId: {
    type: String,
    required: true,
    default: 'default_tenant',
    index: true
  },
  recipientEmployeeId: {
    type: String,
    required: true,
    index: true
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['new_task', 'task_updated', 'system', 'general'],
    default: 'new_task'
  },
  taskId: {
    type: String,
    default: ''
  },
  taskNumber: {
    type: String,
    default: ''
  },
  taskTitle: {
    type: String,
    default: ''
  },
  gross: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  month: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

notificationSchema.index({ tenantId: 1, recipientEmployeeId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
