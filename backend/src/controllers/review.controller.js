const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');
const Room = require('../models/Room');

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
    
    res.status(201).json({ success: true, review });
});
exports.getReviewsForRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    const reviews = await Review.find({ room: roomId }).populate('user', 'name avatarUrl');
    res.json({ success: true, reviews });
});
exports.deleteReview = asyncHandler(async (req, res) => {
    const { roomId, reviewId } = req.params;    
    const userId = req.user.id;
    const review = await Review.findOneAndDelete({ _id: reviewId, room: roomId, user: userId });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
});

