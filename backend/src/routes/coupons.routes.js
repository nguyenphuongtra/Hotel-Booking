const express = require('express');
const routes = express.Router();
const {} = require('../controllers/coupon.controller');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createCoupon,
    getCouponByCode,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive
} = require('../controllers/coupon.controller');



routes.post('/',
    protect,
    authorize('admin'),
    body('code').notEmpty().withMessage('Code is required'),
    // Accept frontend field names: `type` and `discount` (values: 'percent' or 'fixed')
    body('type').isIn(['percent','fixed']).withMessage('Invalid discount type'),
    body('discount').isFloat({ gt: 0 }).withMessage('Discount value must be greater than 0'),
    validate,
    createCoupon
);

routes.get('/:code', getCouponByCode);
routes.get('/', 
    protect,
    authorize('admin'),
    getAllCoupons
);
routes.put('/:id',
    protect,    
    authorize('admin'),
    updateCoupon
);
routes.delete('/:id',
    protect,
    authorize('admin'),
    deleteCoupon
);
routes.patch('/:id/toggle',
    protect,
    authorize('admin'),
    toggleCouponActive
);

module.exports = routes;