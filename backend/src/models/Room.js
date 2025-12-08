const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomNumber: String,
  type: { type: String, enum: ['single','double','suite','family'] },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  images: [String],
  amenities: [String], 
  occupancy: { adults: Number, children: Number },
  description: String,
  quantity: { type: Number, default: 1 }, 
  ratingsAvg: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 }
}, { timestamps: true });

roomSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Room', roomSchema);
