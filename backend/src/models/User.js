const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String }, 
  provider: { type: String, enum: ['local','google'], default: 'local' },
  phone: String,
  address: String,
  avatarUrl: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
  isLocked: { type: Boolean, default: false },
  refreshTokens: [{ token: String, createdAt: Date }], 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
