const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');


const router = express.Router();


router.post('/', protect, [
body('roomId').notEmpty(),
body('checkIn').isISO8601(),
body('checkOut').isISO8601()
], validate, bookingController.createBooking);


router.get('/me', protect, bookingController.getBookingsForUser);
router.get('/', protect, authorize('admin'), bookingController.getAllBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.delete('/:id', protect, authorize('admin'), bookingController.deleteBooking);
router.put('/:id/status', protect, authorize('admin'), bookingController.updateBookingStatus);



module.exports = router;
