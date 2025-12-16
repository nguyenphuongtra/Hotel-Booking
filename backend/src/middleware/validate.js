const { validationResult } = require('express-validator');

//kiểm tra kết quả validate từ các routes 
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};