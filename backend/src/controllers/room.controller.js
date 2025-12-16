const asyncHandler = require('../middleware/asyncHandler');
const Room = require('../models/Room');
const cloudinary = require('../services/cloudinary.service');

exports.createRoom = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.files && req.files.length) {
        const urls = [];
        for (const f of req.files) {
            const url = await cloudinary.uploadBuffer(f.buffer, 'rooms');
            urls.push(url);
        }
        data.images = urls;
    }
    const room = await Room.create(data);
    res.status(201).json({ success: true, room });
});
exports.updateRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });


    if (req.files && req.files.length) {
        const urls = [];
        for (const f of req.files) {
            const url = await cloudinary.uploadBuffer(f.buffer, 'rooms');
            urls.push(url);
        }
        data.images = room.images.concat(urls);
    }


    Object.assign(room, data);
    await room.save();
    res.json({ success: true, room });
});
exports.deleteRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted' });
});
exports.getRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    
    const Booking = require('../models/Booking');
    const Review = require('../models/Review');
    
    const bookings = await Booking.find({ room: id }).select('user checkIn checkOut status').lean();
    const reviews = await Review.find({ room: id }).populate('user', 'name').lean();
    
    const bookingsWithUserId = bookings.map(booking => ({
      ...booking,
      userId: booking.user?.toString() || booking.user
    }));
    
    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      userName: review.user?.name || 'Khách',
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    }));
    
    res.json({ success: true, room: { ...room.toObject(), bookings: bookingsWithUserId, reviews: formattedReviews } });
});

exports.listRooms = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, q, minPrice, maxPrice, type, amenities, sort } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (type) filter.type = type;
    if (amenities) filter.amenities = { $all: amenities.split(',') };


    let query = Room.find(filter);
    if (sort) query = query.sort(sort);
    const total = await Room.countDocuments(filter);
    const rooms = await query.skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, meta: { total, page: Number(page), limit: Number(limit) }, rooms });
});

exports.upLoadRommImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (req.files && req.files.length) {
        const urls = [];    
        for (const f of req.files) {
            const url = await cloudinary.uploadBuffer(f.buffer, 'rooms');
            urls.push(url);
        }
        room.images = room.images.concat(urls);
        await room.save();
    }
    res.json({ success: true, room });
});
