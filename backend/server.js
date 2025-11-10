const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const passport = require('./src/config/google');

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// session middleware needed for Passport to support login sessions (req.login)
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true if serving over HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// initialize passport (OAuth strategies configured in src/config/google.js)
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/users.routes'));
app.use('/api/rooms', require('./src/routes/users.routes'));
app.use('/api/bookings', require('./src/routes/bookings.routes'));
app.use('/api/coupons', require('./src/routes/coupons.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));

// docs
// app.use('/api/docs', require('./docs/swagger')); 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
