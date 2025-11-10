const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  percent: Number,
  minAmount: Number,
  maxUses: Number,
  usedCount: { type: Number, default: 0 },
  startAt: Date,
  endAt: Date,
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
