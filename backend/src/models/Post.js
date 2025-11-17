// src/models/Post.js
import mongoose from "mongoose";
import slugify from "slugify";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: "" },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, {
  timestamps: true,
});

PostSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    let base = slugify(this.title, { lower: true, strict: true }).slice(0, 200);
    let slug = base;
    let i = 1;
    const Post = mongoose.model("Post");
    while (await Post.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${i++}`;
    }
    this.slug = slug;
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model("Post", PostSchema);
