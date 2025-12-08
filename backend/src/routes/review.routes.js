const express = require('express');
const routes = express.Router();
const {
    createOrUpdateReview,
    getReviewsForRoom,
    deleteReview,
} = require('../controllers/review.controller');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');



routes.post('/:roomId', protect,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString(),
    validate,
    createOrUpdateReview,
);
routes.get('/room/:roomId', getReviewsForRoom);
routes.delete('/:roomId/:reviewId', protect, deleteReview);
module.exports = routes;
