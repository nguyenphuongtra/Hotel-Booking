const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: Number,
  children: Number,
  price: Number,
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash','momo','vnpay','card'] },
  paymentInfo: Object,
}, { timestamps: true });

bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });
module.exports = mongoose.model('Booking', bookingSchema);
