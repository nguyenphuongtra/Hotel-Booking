// src/models/Category.js
import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

CategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Category", CategorySchema);
