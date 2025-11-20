const express = require('express');
const routes = express.Router();
const {
    createRoom,
    getRoom,
    listRooms,
    updateRoom,
    deleteRoom
} = require('../controllers/room.controller');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
routes.get('/', listRooms);
routes.get('/:id', getRoom);
// admin
routes.post('/', protect, authorize('admin'),
    upload.array('images', 6),
    body('name').notEmpty().withMessage('Tên phòng là bắt buộc'),
    body('price').isFloat({ gt: 0 }).withMessage('Giá phòng phải lớn hơn 0'),
    validate,
    createRoom
);
routes.put('/:id', protect, authorize('admin'),
    upload.array('images', 6),
    body('name').optional().notEmpty().withMessage('Tên phòng là bắt buộc'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Giá phòng phải lớn hơn 0'),
    validate,
    updateRoom
);
routes.delete('/:id', protect, authorize('admin'), deleteRoom);
module.exports = routes;