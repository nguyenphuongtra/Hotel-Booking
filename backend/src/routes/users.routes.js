const express = require('express');
const routes = express.Router();
const {
    getUser,
    getUsers,
    updateUserRole,
    lockUser,
    unlockUser,
    deleteUser,
    getCurrentUser,
    refreshCurrentUser
} = require('../controllers/user.controller');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');


routes.get('/', protect, authorize('admin'), getUsers);
routes.get('/me', protect, getCurrentUser);
routes.get('/me/refresh', protect, refreshCurrentUser); 
routes.get('/:id', protect, authorize('admin'), getUser);   

// admin
routes.put('/:id/role', protect, authorize('admin'),
    body('role').isIn(['user', 'admin']).withMessage('Vai trò không hợp lệ'),
    validate,
    updateUserRole
);
routes.put('/:id/lock', protect, authorize('admin'), lockUser);
routes.put('/:id/unlock', protect, authorize('admin'), unlockUser);

routes.delete('/:id', protect, authorize('admin'), deleteUser);

routes.post
module.exports = routes;