const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'leader'],
    required: true
  },
  employeeId: {
    type: String,
    default: null
  },
  allowedEmployeeIds: {
    type: [String],
    default: []
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  birthDate: {
    type: Date,
    default: null
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
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
    index: true
  },
  banReason: {
    type: String,
    default: ''
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  termsAcceptedAt: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', userSchema);
