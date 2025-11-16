const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Coupon = require('../models/Coupon');

exports.createBooking = asyncHandler(async (req, res) => {
    const { roomId, checkIn, checkOut, adults, children, couponCode, paymentMethod } = req.body;


    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const room = await Room.findById(roomId).session(session);
        if (!room) throw { statusCode: 404, message: 'Room not found' };


        const overlapCount = await Booking.countDocuments({
            room: roomId,
            status: { $in: ['pending','confirmed'] },
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
        }).session(session);


        if (overlapCount >= (room.quantity || 1)) throw { statusCode: 400, message: 'Không có sẵn cho các ngày đã chọn' };


        let basePrice = room.price;
        const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        let total = basePrice * Math.max(1, nights);


        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, active: true }).session(session);
            const now = new Date();
            if (!coupon) throw { statusCode: 400, message: 'Phiếu giảm giá không hợp lệ' };
            if (coupon.startAt && coupon.startAt > now) throw { statusCode: 400, message: 'Phiếu giảm giá chưa được bắt đầu' };
            if (coupon.endAt && coupon.endAt < now) throw { statusCode: 400, message: 'Phiếu giảm giá đã hết hạn' };
            if (coupon.minAmount && total < coupon.minAmount) throw { statusCode: 400, message: 'Giỏ hàng quá nhỏ để sử dụng phiếu giảm giá' };
            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw { statusCode: 400, message: 'Phiếu giảm giá đã sử dụng hết' };


            total = total - (total * (coupon.percent || 0) / 100);
            coupon.usedCount += 1;
            await coupon.save({ session });
        }


        const booking = await Booking.create([{
            user: req.user._id,
            room: roomId,
            checkIn, checkOut, adults, children,
            price: total,
            coupon: coupon ? coupon._id : null,
            paymentMethod,
            status: paymentMethod === 'cash' ? 'confirmed' : 'pending'
        }], { session });


        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, booking: booking[0] });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err; 
    }
});

exports.getBookingsForUser = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.json({ success: true, bookings });
});
exports.getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('room');
    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đặt chỗ' });
    if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Không được phép xem đặt phòng này' });
    }
    res.json({ success: true, booking });
});

// Admin 
exports.getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find().populate('room user');
    res.json({ success: true, bookings });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = status;
    await booking.save();
    res.json({ success: true, booking });
});

exports.deleteBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
});

