const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   phone: { type: String },
   subject: { type: String },
   message: { type: String, required: true },
   status: { type: String, enum: ['new','processing','handled'], default: 'new' },
   replied: { type: Boolean, default: false },
   replyMessage: { type: String },
   repliedAt: { type: Date },
   handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }   
}, { timestamps: true });
module.exports = mongoose.model('Contact', contactSchema);