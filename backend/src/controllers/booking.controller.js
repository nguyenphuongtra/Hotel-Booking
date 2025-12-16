const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Coupon = require('../models/Coupon');

exports.createBooking = asyncHandler(async (req, res) => {
    const { roomId, checkIn, checkOut, adults, children, couponCode, paymentMethod, totalPrice, phoneNumber } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const overlapCount = await Booking.countDocuments({
        room: roomId,
        status: { $in: ['pending', 'confirmed'] },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
    });

    if (overlapCount >= (room.quantity || 1)) {
        return res.status(400).json({ success: false, message: 'Không có sẵn cho các ngày đã chọn' });
    }

    let basePrice = room.price;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)); // tính số đêm
    let total = totalPrice || (basePrice * Math.max(1, nights));

    let coupon = null;
    if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode, active: true });
        const now = new Date();
        
        if (!coupon) {
            return res.status(400).json({ success: false, message: 'Phiếu giảm giá không hợp lệ' });
        }
        if (coupon.startAt && coupon.startAt > now) {
            return res.status(400).json({ success: false, message: 'Phiếu giảm giá chưa được bắt đầu' });
        }
        if (coupon.endAt && coupon.endAt < now) {
            return res.status(400).json({ success: false, message: 'Phiếu giảm giá đã hết hạn' });
        }
        if (coupon.minAmount && total < coupon.minAmount) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng quá nhỏ để sử dụng phiếu giảm giá' });
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ success: false, message: 'Phiếu giảm giá đã sử dụng hết' });
        }

        total = total - (total * (coupon.percent || 0) / 100); // tính toán giảm giá
        coupon.usedCount += 1; // cập nhật số lần sử dụng
        await coupon.save();
    }

    const booking = await Booking.create({
        user: req.user._id,
        room: roomId,
        checkIn,
        checkOut,
        adults,
        children,
        totalPrice: total,
        coupon: coupon ? coupon._id : null,
        paymentMethod,
        phoneNumber: phoneNumber,
        status: paymentMethod === 'cash' ? 'confirmed' : 'pending'
    });

    res.status(201).json({ success: true, booking });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('room user');
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
    const bookings = await Booking.find()
        .populate('room user') // chi tiết đặt phòng và người dùng
        .sort({ createdAt: -1 }); 
    res.json({ success: true, bookings });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = status; // Cập nhật trạng thái đặt phòng
    await booking.save();
    res.json({ success: true, booking });
});

exports.deleteBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
});

