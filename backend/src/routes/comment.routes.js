const express = require('express');
const { addComment, getCommentsForPost, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, addComment);
router.get('/post/:postId', getCommentsForPost);
router.delete('/:id', protect, deleteComment);

module.exports = router;
