import axios, { type AxiosInstance } from 'axios'
// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  // Register new user - POST auth endpoint
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  // Login user - POST auth endpoint
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  // Google OAuth redirect
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Google OAuth callback handler
  googleCallback: (token: string) => {
    localStorage.setItem('token', token);
  },
};

// ============================================================================
// USER API
// ============================================================================

export const userAPI = {
  // Get all users (admin only)
  getAllUsers: () =>
    apiClient.get('/users'),

  // Get current user profile
  getCurrentUser: () =>
    apiClient.get('/users/me'),

  // Refresh current user data
  refreshCurrentUser: () =>
    apiClient.get('/users/me/refresh'),

  // Get user by ID (admin only)
  getUserById: (userId: string) =>
    apiClient.get(`/users/${userId}`),

  // Update user role (admin only)
  updateUserRole: (userId: string, data: { role: 'user' | 'admin' }) =>
    apiClient.put(`/users/${userId}/role`, data),

  // Lock user account (admin only)
  lockUser: (userId: string) =>
    apiClient.put(`/users/${userId}/lock`),

  // Unlock user account (admin only)
  unlockUser: (userId: string) =>
    apiClient.put(`/users/${userId}/unlock`),

  // Delete user (admin only)
  deleteUser: (userId: string) =>
    apiClient.delete(`/users/${userId}`),
};

// ============================================================================
// ROOM API
// ============================================================================

export const roomAPI = {
  // Get all rooms with optional filters
  listRooms: (params?: Record<string, any>) =>
    apiClient.get('/rooms', { params }),

  // Get room by ID
  getRoom: (roomId: string) =>
    apiClient.get(`/rooms/${roomId}`),

  // Create new room (admin only) - FormData with room details and images
  createRoom: (data: FormData) =>
    apiClient.post('/rooms', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Update room (admin only) - FormData with updated room details and images
  updateRoom: (roomId: string, data: FormData) =>
    apiClient.put(`/rooms/${roomId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete room (admin only)
  deleteRoom: (roomId: string) =>
    apiClient.delete(`/rooms/${roomId}`),
};

// ============================================================================
// BOOKING API
// ============================================================================

export const bookingAPI = {
  // Create new booking with roomId, checkIn, checkOut dates
  createBooking: (data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    [key: string]: any;
  }) =>
    apiClient.post('/bookings', data),

  // Get bookings for current user
  getMyBookings: () =>
    apiClient.get('/bookings/me'),

  // Get all bookings (admin only)
  getAllBookings: () =>
    apiClient.get('/bookings'),

  // Get booking by ID
  getBookingById: (bookingId: string) =>
    apiClient.get(`/bookings/${bookingId}`),

  // Delete booking (admin only)
  deleteBooking: (bookingId: string) =>
    apiClient.delete(`/bookings/${bookingId}`),

  // Update booking status (admin only)
  updateBookingStatus: (bookingId: string, data: { status: string }) =>
    apiClient.put(`/bookings/${bookingId}/status`, data),
};

// ============================================================================
// COUPON API
// ============================================================================

export const couponAPI = {
  // Create new coupon (admin only)
  createCoupon: (data: {
    code: string;
    discount: number;
    maxUses?: number;
    startAt?: string;
    endAt?: string;
    active?: boolean;
    [key: string]: any;
  }) =>
    apiClient.post('/coupons', data),

  // Get coupon by code
  getCouponByCode: (code: string) =>
    apiClient.get(`/coupons/${code}`),
};

// ============================================================================
// PAYMENT API
// ============================================================================

export const paymentAPI = {
  // Create VNPay payment URL
  createPaymentUrl: (data: {
    amount: number;
    bookingId: string;
    orderDescription?: string;
    bankCode?: string;
    orderType?: string;
    language?: string;
    [key: string]: any;
  }) =>
    apiClient.post('/payments/create_payment_url', data),

  // Handle VNPay return from payment gateway (usually handled by server redirect)
  vnpayReturn: (params: Record<string, any>) =>
    apiClient.get('/payments/vnpay_return', { params }),

  // Handle VNPay IPN (usually handled by server callback)
  vnpayIPN: (params: Record<string, any>) =>
    apiClient.get('/payments/vnpay_ipn', { params }),
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminAPI = {
  // Get dashboard statistics
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const reviewsAPI = {
  // Submit a review for a room
  submitReview: (roomId: string, data: { rating: number; comment?: string }) =>
    apiClient.post(`/reviews/rooms/${roomId}`, data),
  
  // Get reviews for a room
  getReviewsByRoom: (roomId: string) =>
    apiClient.get(`/reviews/rooms/${roomId}`),

  deleteReview: (reviewId: string) =>
    apiClient.delete(`/reviews/${reviewId}`),
};

// Set authentication token
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clear authentication token
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Get current authentication token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Create FormData for file uploads
// Params: data (form fields), files (files array), fileFieldName (field name for files)
export const createFormData = (
  data: Record<string, any>,
  files?: File[],
  fileFieldName: string = 'images'
): FormData => {
  const formData = new FormData();

  // Add regular fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Add files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append(fileFieldName, file);
    });
  }

  return formData;
};

// Export apiClient for advanced usage if needed
export default apiClient;
