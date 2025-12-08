const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    datePorted: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
