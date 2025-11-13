const express = require('express');
require("dotenv").config();
const routes = express.Router();
const passport = require("../config/google");
const jwt = require("jsonwebtoken");
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');
const validate = require('../middleware/validate');


routes.post('/register',
    body('name').notEmpty().withMessage('Name là bắt buộc'),
    body('email').isEmail().withMessage('Email hợp lệ là bắt buộc'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    validate,
    authController.register
);
routes.post('/login',
    body('email').isEmail().withMessage('Email hợp lệ là bắt buộc'),
    body('password').notEmpty().withMessage('Password là bắt buộc'),
    validate,   
    authController.login
);


routes.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: true  
  })
);
routes.get('/google/callback', (req, res, next) => {
  if (!req.query || !req.query.code) {
    return res.redirect('/api/auth/google');
  }
  passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
}, (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(`${process.env.CLIENT_URL}?error=NoUser`);
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
});

module.exports = routes;