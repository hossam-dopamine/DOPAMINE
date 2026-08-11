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
  tenantId: {
    type: String,
    required: true,
    default: 'default_tenant',
    index: true
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

// Always enforce single document per tenant
appDataSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ tenantId: this.tenantId });
    if (count > 0) {
      return next(new Error('Only one AppData document can exist per tenant'));
    }
  }
  this.lastUpdatedAt = new Date();
  next();
});

module.exports = mongoose.model('AppData', appDataSchema);
