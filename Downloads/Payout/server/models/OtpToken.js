const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true
  },
  tempUserData: {
    username: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    birthDate: { type: Date, required: true },
    termsAccepted: { type: Boolean, default: true }
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastSentAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index to automatically purge expired tokens
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

otpTokenSchema.methods.compareOtp = async function(candidateOtp) {
  return await bcrypt.compare(String(candidateOtp), this.otpHash);
};

otpTokenSchema.statics.hashOtp = async function(otp) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(String(otp), salt);
};

module.exports = mongoose.model('OtpToken', otpTokenSchema);
