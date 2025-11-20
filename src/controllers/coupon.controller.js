const asyncHandler = require('../middlewares/asyncHandler');
const Coupon = require('../models/Coupon');


exports.createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
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
    res.json({ success: true, coupon });
});