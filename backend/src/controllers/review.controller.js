const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');
const Room = require('../models/Room');
// Create or update a review for a room
exports.createOrUpdateReview = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    let review = await Review.findOne({ user: userId, room: roomId });
    if (review) {
        review.rating = rating;
        review.comment = comment;
        await review.save();
    } else {
        review = await Review.create({ user: userId, room: roomId, rating, comment });
    }
    // Recalculate room's average rating
    const reviews = await Review.find({ room: roomId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    room.averageRating = avgRating;
    await room.save();
    res.status(201).json({ success: true, review });
});
// Get all reviews for a room
exports.getReviewsForRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    const reviews = await Review.find({ room: roomId }).populate('user', 'name avatarUrl');
    res.json({ success: true, reviews });
});
// Delete a review
exports.deleteReview = asyncHandler(async (req, res) => {
    const { roomId, reviewId } = req.params;    
    const userId = req.user.id;
    const review = await Review.findOneAndDelete({ _id: reviewId, room: roomId, user: userId });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    // Recalculate room's average rating
    const reviews = await Review.find({ room: roomId });
    const room = await Room.findById(roomId);   
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        room.averageRating = avgRating;
    }
    else {
        room.averageRating = 0;
    }
    await room.save();
    res.json({ success: true, message: 'Review deleted' });
});

