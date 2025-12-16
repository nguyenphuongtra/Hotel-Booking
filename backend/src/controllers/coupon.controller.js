const asyncHandler = require('../middleware/asyncHandler');
const Coupon = require('../models/Coupon');


exports.createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, type, maxUses, startAt, endAt, active } = req.body;
    const coupon = await Coupon.create({
        code,
        discountValue: discount,
        discountType: type,
        maxUses,
        startAt,
        endAt,
        active,
    });
    res.status(201).json({ success: true, coupon });
});


exports.getCouponByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const now = new Date();
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    if (coupon.startAt && coupon.startAt > now) return res.status(400).json({ success: false, message: 'Coupon not active yet' });
    if (coupon.endAt && coupon.endAt < now) return res.status(400).json({ success: false, message: 'Coupon expired' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon used up' });

    const formattedCoupon = {
        ...coupon.toObject(),
        discount: coupon.discountValue,
        type: coupon.discountType,
    };
    res.json({ success: true, coupon: formattedCoupon });
});
exports.getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    const formatted = coupons.map(c => ({
        ...c.toObject(),
        discount: c.discountValue,
        type: c.discountType,
    }));
    res.json({ success: true, coupons: formatted });
});
exports.updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatePayload = { ...req.body };
    if (typeof updatePayload.discount !== 'undefined') {
        updatePayload.discountValue = updatePayload.discount;
        delete updatePayload.discount;
    }
    if (typeof updatePayload.type !== 'undefined') {
        updatePayload.discountType = updatePayload.type;
        delete updatePayload.type;
    }
    const coupon = await Coupon.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
});
exports.deleteCoupon = asyncHandler(async (req, res) => {   
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
});
exports.toggleCouponActive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    coupon.active = !coupon.active;
    await coupon.save();
    res.json({ success: true, coupon });
});