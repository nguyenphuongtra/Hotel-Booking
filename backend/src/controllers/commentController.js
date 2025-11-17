const Comment = require('../models/Comment');

exports.addComment = async (req, res, next) => {
  try {
    const { postId, content, parent } = req.body;
    if (!postId || !content) return res.status(400).json({ message: 'postId and content required' });
    const comment = await Comment.create({
      post: postId,
      content,
      parent,
      author: req.user ? req.user._id : undefined,
      authorName: req.user ? req.user.name : req.body.authorName
    });
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.getCommentsForPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId }).sort('createdAt').populate('author','name');
    res.json(comments);
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    // only author or admin can delete
    if (comment.author && req.user && String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await comment.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
