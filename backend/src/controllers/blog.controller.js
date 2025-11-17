// src/controllers/blog.controller.js
import Post from "../models/Post.js";
import Category from "./models/Category.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

/**
 * Helpers
 */
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

/**
 * Create Post
 */
export const createPost = async (req, res, next) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const {
      title, excerpt, content, category, tags = [], status = "draft", isFeatured = false,
    } = req.body;

    const post = await Post.create({
      title, excerpt, content, category: category || null, tags, status, isFeatured, author: req.user._id,
    });

    await post.populate("author", "username email").execPopulate?.();

    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * List posts with pagination, search, filter
 */
export const getPosts = async (req, res, next) => {
  try {
    // validation handled in route
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) {
      // allow category slug or id
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filter.category = req.query.category;
      } else {
        const cat = await Category.findOne({ slug: req.query.category });
        if (cat) filter.category = cat._id;
        else filter.category = null; // will return empty
      }
    }
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { title: { $regex: s, $options: "i" } },
        { excerpt: { $regex: s, $options: "i" } },
        { content: { $regex: s, $options: "i" } },
      ];
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username email")
      .populate("category", "name slug")
      .lean();

    res.json({
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single by id or slug
 */
export const getPost = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let post;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      post = await Post.findById(idOrSlug)
        .populate("author", "username email")
        .populate("category", "name slug");
    } else {
      post = await Post.findOne({ slug: idOrSlug })
        .populate("author", "username email")
        .populate("category", "name slug");
    }
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * Update post
 */
export const updatePost = async (req, res, next) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { id } = req.params;
    const updates = req.body;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy post" });

    Object.assign(post, updates);
    // saving will update slug/publishedAt via pre hook
    await post.save();
    await post.populate("author", "username email").execPopulate?.();
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete post
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy post" });
    await post.remove();
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

/**
 * Publish post (action)
 */
export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy post" });

    post.status = "published";
    if (!post.publishedAt) post.publishedAt = new Date();
    await post.save();
    res.json({ data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's posts
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    res.json({
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Category controllers (simple)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Missing name" });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category exists" });
    const cat = await Category.create({ name });
    res.status(201).json({ data: cat });
  } catch (err) { next(err); }
};

export const listCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ name: 1 }).lean();
    res.json({ data: cats });
  } catch (err) { next(err); }
};
