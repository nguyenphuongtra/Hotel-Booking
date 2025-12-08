const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Blog = require('../models/Blog');

exports.createBlog = asyncHandler(async (req, res) => {
    const { title, content, description, imageUrl } = req.body;
    const blog = await Blog.create({
        title,
        content,
        description,
        imageUrl,
    });
    res.status(201).json({ success: true, blog });
});

exports.getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog });
});

exports.getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
}); 
exports.updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog });
});
exports.deleteBlog = asyncHandler(async (req, res) => {   
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted' });
});

exports.toggleBlogActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.active = !blog.active;
    await blog.save();
    res.json({ success: true, blog });
});


