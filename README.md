# 🏨 Hotel Booking Platform

A full-stack hotel booking system built with modern technologies, featuring a robust backend API and an interactive frontend interface.

[![GitHub](https://img.shields.io/badge/GitHub-View%20Repository-181717?style=flat-square&logo=github)](https://github.com/yourusername/Hotel-Booking)
[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](#license)
[![Build Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)](#)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Features Details](#features-details)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🔐 **Authentication & Authorization**
  - Email/Password registration and login
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Role-based access control (User/Admin)

- 🛏️ **Room Management**
  - Browse available rooms with advanced filters
  - Filter by price range, room type, and amenities
  - View detailed room information and images
  - Search functionality

- 📅 **Booking System**
  - Real-time availability checking
  - Multiple payment methods (Cash, Momo, VNPay, Card)
  - Coupon/discount code support
  - Check-in/check-out date selection
  - Guest information management (adults, children)

- 💳 **Payment Integration**
  - VNPay payment gateway integration
  - Multiple payment method support
  - Secure payment processing
  - Payment status tracking

- ⭐ **Reviews & Ratings**
  - User reviews and ratings for rooms
  - Review management
  - Comment functionality

- 📝 **Blog System**
  - Blog posts management
  - Rich content support
  - User engagement

- 💬 **Contact & Support**
  - Contact form submission
  - Inquiry management

- 👤 **User Profile**
  - Profile management
  - Booking history
  - Avatar upload support

### Admin Features
- 📊 **Dashboard**
  - Business analytics and statistics
  - Booking overview
  - Revenue tracking

- 🏢 **Room Management**
  - Create, update, delete rooms
  - Image upload to Cloudinary
  - Amenities management
  - Price and availability control

- 👥 **User Management**
  - View all users
  - User role management
  - Account status control

- 📅 **Booking Management**
  - View all bookings
  - Status management (Pending, Confirmed, Cancelled, Completed)
  - Booking details and history

- 🎟️ **Coupon Management**
  - Create and manage discount coupons
  - Set expiration dates and usage limits
  - Track coupon usage

- 📝 **Blog Management**
  - Create, edit, delete blog posts
  - Content management

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5.1.0)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:**
  - JWT (JSON Web Tokens)
  - Passport.js with Google OAuth 2.0
  - Session-based authentication
- **Security:**
  - Helmet.js for HTTP headers
  - CORS configuration
  - bcryptjs for password hashing
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **Payment Gateway:** VNPay
- **Data Validation:** Express Validator
- **Logging:** Morgan
- **File Upload:** Multer
- **Others:**
  - crypto-js for encryption
  - dotenv for environment variables

### Frontend
- **Framework:** React 19.2.0
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:**
  - Tailwind CSS 4.1.17
  - Radix UI components
  - Lucide React icons
- **State Management:**
  - React Query (TanStack Query)
  - Context API
- **Forms:**
  - React Hook Form
  - Zod for validation
- **HTTP Client:** Axios
- **Routing:** React Router DOM v7.9.6
- **UI Libraries:**
  - Recharts for analytics
  - Swiper for carousel
  - React DatePicker
- **Notifications:** React Hot Toast
- **Date Handling:** Moment.js
- **Linting:** ESLint
- **Development:** TypeScript, PostCSS, Autoprefixer

## 📁 Project Structure

```
Hotel-Booking/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         # MongoDB connection
│   │   │   └── google.js           # Google OAuth config
│   │   ├── controllers/            # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── room.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── blog.controller.js
│   │   │   ├── coupon.controller.js
│   │   │   └── contact.controller.js
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   ├── Booking.js
│   │   │   ├── Review.js
│   │   │   ├── Blog.js
│   │   │   ├── Coupon.js
│   │   │   └── Contact.js
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── rooms.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── coupons.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── upload.js
│   │   │   └── validate.js
│   │   └── services/
│   │       ├── cloudinary.service.js
│   │       └── mail.service.js
│   ├── server.js                   # Entry point
│   ├── package.json
│   └── .env                        # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Rooms.tsx
│   │   │   ├── RoomDetails.tsx
│   │   │   ├── Bookings.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── admin/              # Admin pages
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminRooms.tsx
│   │   │       ├── AdminUsers.tsx
│   │   │       ├── AdminBookings.tsx
│   │   │       └── AdminCoupons.tsx
│   │   ├── components/             # Reusable components
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── HotelMap.tsx
│   │   │   ├── room/
│   │   │   │   ├── RoomHeader.tsx
│   │   │   │   ├── RoomImageGallery.tsx
│   │   │   │   ├── RoomDescription.tsx
│   │   │   │   ├── Amenities.tsx
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   └── RoomReviews.tsx
│   │   │   ├── admin/
│   │   │   │   └── AdminSidebar.tsx
│   │   │   └── ui/                 # UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       └── ... (20+ UI components)
│   │   ├── contexts/               # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── api/
│   │   │   └── api.tsx             # API client
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles/
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
└── package.json
```

## 📦 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
- **Cloudinary** account for image storage
- **VNPay** account for payment processing (Vietnam)
- **Google OAuth 2.0** credentials (for authentication)
- **Nodemailer** configuration for email sending

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Hotel-Booking.git
cd Hotel-Booking
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hotel-booking
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking

# JWT & Session
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=your-email-host
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@hotelbooking.com

# VNPay Payment Gateway
VNP_TMNCODE=your-vnp-tmncode
VNP_HASHSECRET=your-vnp-hash-secret
VNP_URL=https://sandbox.vnpayment.vn/paygate
VNP_RETURN_URL=http://localhost:5173/vnpay_return

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🏃 Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm start
# or with nodemon for development
npm install -g nodemon
nodemon server.js
```

Backend will run on: `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-deployment-url.com/api`

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/google            # Google OAuth login
GET    /api/auth/google/callback   # Google OAuth callback
POST   /api/auth/refresh-token     # Refresh JWT token
```

### Room Endpoints
```
GET    /api/rooms                  # List all rooms (with filters)
GET    /api/rooms/:id              # Get room details
POST   /api/rooms                  # Create room (Admin)
PUT    /api/rooms/:id              # Update room (Admin)
DELETE /api/rooms/:id              # Delete room (Admin)
POST   /api/rooms/:id/images       # Upload room images
```

### Booking Endpoints
```
POST   /api/bookings               # Create booking
GET    /api/bookings               # Get user's bookings
GET    /api/bookings/:id           # Get booking details
PUT    /api/bookings/:id           # Update booking
DELETE /api/bookings/:id           # Cancel booking
GET    /api/admin/bookings         # Get all bookings (Admin)
```

### Payment Endpoints
```
POST   /api/payments/create_payment_url    # Create VNPay payment URL
GET    /api/payments/vnpay_return          # VNPay callback
```

### Review Endpoints
```
POST   /api/reviews                # Create review
GET    /api/reviews/:roomId        # Get room reviews
PUT    /api/reviews/:id            # Update review
DELETE /api/reviews/:id            # Delete review
```

### Coupon Endpoints
```
POST   /api/coupons                # Create coupon (Admin)
GET    /api/coupons                # List coupons
PUT    /api/coupons/:id            # Update coupon (Admin)
DELETE /api/coupons/:id            # Delete coupon (Admin)
POST   /api/coupons/validate       # Validate coupon code
```

### User Endpoints
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
GET    /api/admin/users            # List all users (Admin)
PUT    /api/users/:id/role         # Update user role (Admin)
```

### Blog Endpoints
```
GET    /api/blogs                  # List blog posts
GET    /api/blogs/:id              # Get blog details
POST   /api/blogs                  # Create blog (Admin)
PUT    /api/blogs/:id              # Update blog (Admin)
DELETE /api/blogs/:id              # Delete blog (Admin)
```

### Contact Endpoints
```
POST   /api/contacts               # Submit contact form
GET    /api/admin/contacts         # Get all contacts (Admin)
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  avatarUrl: String,
  role: String (enum: ['user', 'admin']),
  bookings: [ObjectId],
  isLocked: Boolean,
  refreshTokens: [{token, createdAt}],
  createdAt: Date,
  updatedAt: Date
}
```

### Room Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  type: String,
  price: Number,
  quantity: Number,
  images: [String],
  amenities: [String],
  maxGuests: Number,
  size: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  checkIn: Date,
  checkOut: Date,
  adults: Number,
  children: Number,
  totalPrice: Number,
  phoneNumber: String,
  coupon: ObjectId (ref: Coupon),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  paymentMethod: String (enum: ['cash', 'momo', 'vnpay', 'card']),
  paymentStatus: String (enum: ['unpaid', 'paid']),
  paymentInfo: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Coupon Collection
```javascript
{
  _id: ObjectId,
  code: String (unique),
  percent: Number,
  minAmount: Number,
  maxUses: Number,
  usedCount: Number,
  startAt: Date,
  endAt: Date,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Features Details

### Authentication System
- JWT-based authentication with refresh tokens
- Google OAuth 2.0 integration for social login
- Secure password hashing with bcryptjs
- Session management with express-session
- Protected routes and role-based access control

### Booking System
- Real-time availability checking to prevent double bookings
- Automatic date overlap detection
- Multiple payment method support
- Coupon code validation with expiration and usage limits
- Booking status tracking (pending, confirmed, cancelled, completed)

### Payment Processing
- VNPay integration for Vietnamese users
- Secure payment transaction handling
- Payment status tracking
- Transaction history and records

### Image Management
- Cloudinary integration for cloud storage
- Multiple image upload support
- Image optimization and CDN delivery

### Email System
- Nodemailer for transactional emails
- Booking confirmation emails
- Payment receipts
- User notifications

## 🔐 Security Features

- CORS configuration for cross-origin requests
- Helmet.js for securing HTTP headers
- JWT token-based authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- Environment variables for sensitive data
- Role-based access control
- Protected admin routes

## 📦 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`:

```bash
vercel deploy
```

### Backend (Render/Heroku)
1. Push to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables
4. Deploy with automatic CI/CD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 📞 Support

For support, email support@hotelbooking.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- React documentation
- Tailwind CSS
- All contributors and users

---

**Last Updated:** January 2026 | **Status:** Active Development