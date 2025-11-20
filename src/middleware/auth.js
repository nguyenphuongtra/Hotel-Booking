const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bảo vệ route, yêu cầu phải có token
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Giải mã token và lấy thông tin người dùng
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.isLocked) {
      return res.status(403).json({ success: false, message: 'Account locked' });
    }

    // Gán user vào req.user
    req.user = user;
    next(); // Tiến hành đến route tiếp theo
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Middleware kiểm tra quyền hạn người dùng
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
