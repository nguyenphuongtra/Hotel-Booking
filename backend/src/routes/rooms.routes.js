const express = require('express');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const roomController = require('../controllers/room.controller');


const router = express.Router();


router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoom);


// admin
router.post('/', protect, authorize('admin'), upload.array('images', 6), roomController.createRoom);
router.put('/:id', protect, authorize('admin'), upload.array('images', 6), roomController.updateRoom);
router.delete('/:id', protect, authorize('admin'), roomController.deleteRoom);


module.exports = router;