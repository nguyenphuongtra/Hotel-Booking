const Post = require('../models/Post');
const Category = require('../models/Categories');
const makeUniqueSlug = require('../utils/slugify');
const mongoose = require('mongoose');

// create post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, categories = [], tags = [], published } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'title and content required' });
    const slug = await makeUniqueSlug(Post, title);
    const post = new Post({
      title, slug, content, excerpt,
      author: req.user._id,
      categories: categories.map(id => mongoose.Types.ObjectId(id)),
      tags,
      published: published || false,
      publishedAt: published ? new Date() : null
    });
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
};

// get single post (increments view)
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email')
      .populate('categories', 'name slug');
    if (!post) return res.status(404).json({ message: 'Not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
};

// list posts with pagination, search, filter, sort
exports.listPosts = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, q, category, tag, sort = '-createdAt', published } = req.query;
    page = parseInt(page); limit = parseInt(limit);
    const filter = {};
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $in: [q] } }
    ];
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (published === 'true') filter.published = true;
    if (published === 'false') filter.published = false;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('categories', 'name slug')
      .sort(sort)
      .skip((page-1)*limit)
      .limit(limit);

    res.json({ page, limit, total, data: posts });
  } catch (err) { next(err); }
};

// update post
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    // only author or admin can edit
    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, content, excerpt, categories, tags, published } = req.body;
    if (title && title !== post.title) {
      post.title = title;
      post.slug = await makeUniqueSlug(Post, title);
    }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (categories) post.categories = categories;
    if (tags) post.tags = tags;
    if (typeof published !== 'undefined') {
      post.published = published;
      post.publishedAt = published ? new Date() : null;
    }
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
};

// delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
