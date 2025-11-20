const express = require('express');
const routes = express.Router();
// controller exports use different names (listRooms, getRoom) so alias them to the route expected names
const { createRoom, listRooms: getRooms, getRoom: getRoomById, updateRoom, deleteRoom } = require('../controllers/room.controller');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
routes.get('/', getRooms);
routes.get('/:id', getRoomById);
// admin
routes.post('/', protect, authorize('admin'),
    body('name').notEmpty().withMessage('Tên phòng là bắt buộc'),
    body('price').isFloat({ gt: 0 }).withMessage('Giá phòng phải lớn hơn 0'),   
    validate,
    createRoom
);
routes.put('/:id', protect, authorize('admin'),
    param('id').isMongoId().withMessage('ID phòng không hợp lệ'),
    body('name').optional().notEmpty().withMessage('Tên phòng là bắt buộc'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Giá phòng phải lớn hơn 0'),
    validate,
    updateRoom
);
routes.delete('/:id', protect, authorize('admin'),
    param('id').isMongoId().withMessage('ID phòng không hợp lệ'),   
    validate,
    deleteRoom
);
module.exports = routes;