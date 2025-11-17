const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middlewares/auth');
const {
  createPost, listPosts, getPost, updatePost, deletePost
} = require('../controllers/postController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, 'uploads/'); },
  filename: function(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', listPosts);
router.get('/:slug', getPost);
router.post('/', protect, authorize(['admin','author']), upload.single('featuredImage'), createPost);
router.put('/:id', protect, authorize(['admin','author']), upload.single('featuredImage'), updatePost);
router.delete('/:id', protect, authorize(['admin','author']), deletePost);

module.exports = router;
