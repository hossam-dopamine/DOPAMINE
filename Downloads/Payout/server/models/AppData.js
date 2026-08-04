const mongoose = require('mongoose');

const appDataSchema = new mongoose.Schema({
  employees: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  exchangeRate: {
    type: Number,
    default: 50
  },
  eurExchangeRate: {
    type: Number,
    default: 55
  },
  lastUpdatedBy: {
    type: String,
    default: 'system'
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

// Always enforce single document
appDataSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      return next(new Error('Only one AppData document can exist'));
    }
  }
  this.lastUpdatedAt = new Date();
  next();
});

module.exports = mongoose.model('AppData', appDataSchema);
