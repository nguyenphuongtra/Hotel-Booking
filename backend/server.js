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
app.set('trust proxy', 1);
connectDB();

app.use(helmet());
app.use(cors({ origin: [
    'http://localhost:5173',
    'https://hotel-booking-ix1p.onrender.com',
    'https://hotel-booking-gray-alpha.vercel.app'
] , credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, 
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/users.routes'));
app.use('/api/rooms', require('./src/routes/rooms.routes'));
app.use('/api/bookings', require('./src/routes/bookings.routes'));
app.use('/api/coupons', require('./src/routes/coupons.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/payments', require('./src/routes/payment.routes'));
app.use('/api/contacts', require('./src/routes/contact.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));
app.use('/api/blogs', require('./src/routes/blog.routes'));


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
