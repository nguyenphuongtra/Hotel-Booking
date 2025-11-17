const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize(['admin']), createCategory);

module.exports = router;
