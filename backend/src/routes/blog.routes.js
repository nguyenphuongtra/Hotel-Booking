const express = require('express');
const routes = express.Router();
const {createBlog,
    getBlogById,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    toggleBlogActive
} = require('../controllers/blog.controller');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');


routes.post('/',
    protect,
    authorize('admin'),
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    validate,
    createBlog
);
routes.get('/:id', getBlogById);
routes.get('/', getAllBlogs);
routes.put('/:id',  
    protect,  
    authorize('admin'),
    updateBlog
);
routes.delete('/:id', 
    protect,
    authorize('admin'),
    deleteBlog
);
routes.patch('/:id/toggle',
    protect,
    authorize('admin'),
    toggleBlogActive
);
module.exports = routes;