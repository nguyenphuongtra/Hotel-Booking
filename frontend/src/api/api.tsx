import axios, { type AxiosInstance } from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response); 
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  googleCallback: (token: string) => {
    localStorage.setItem('token', token);
  },
};



export const userAPI = {
  getAllUsers: () =>
    apiClient.get('/users'),

  getCurrentUser: () =>
    apiClient.get('/users/me'),

  refreshCurrentUser: () =>
    apiClient.get('/users/me/refresh'),

  getUserById: (userId: string) =>
    apiClient.get(`/users/${userId}`),

  updateUserRole: (userId: string, data: { role: 'user' | 'admin' }) =>
    apiClient.put(`/users/${userId}/role`, data),

  lockUser: (userId: string) =>
    apiClient.put(`/users/${userId}/lock`),

  unlockUser: (userId: string) =>
    apiClient.put(`/users/${userId}/unlock`),

  deleteUser: (userId: string) =>
    apiClient.delete(`/users/${userId}`),
};



export const roomAPI = {
  listRooms: (params?: Record<string, any>) =>
    apiClient.get('/rooms', { params }),

  getRoom: (roomId: string) =>
    apiClient.get(`/rooms/${roomId}`),

  createRoom: (data: Record<string, any>) =>
    apiClient.post('/rooms', data),

  updateRoom: (roomId: string, data: Record<string, any>) =>
    apiClient.put(`/rooms/${roomId}`, data),

  deleteRoom: (roomId: string) =>
    apiClient.delete(`/rooms/${roomId}`),
};



export const bookingAPI = {
  createBooking: (data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    [key: string]: any;
  }) =>
    apiClient.post('/bookings', data),

  getMyBookings: () =>
    apiClient.get('/bookings/me'),

  getAllBookings: () =>
    apiClient.get('/bookings'),

  getBookingById: (bookingId: string) =>
    apiClient.get(`/bookings/${bookingId}`),

  deleteBooking: (bookingId: string) =>
    apiClient.delete(`/bookings/${bookingId}`),

  updateBookingStatus: (bookingId: string, data: { status: string }) =>
    apiClient.put(`/bookings/${bookingId}/status`, data),
};



export const couponAPI = {
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

  getCouponByCode: (code: string) =>
    apiClient.get(`/coupons/${code}`),
  getAllCoupons: () => 
    apiClient.get('/coupons'),

  updateCoupon: (id: string, data: any) => 
    apiClient.put(`/coupons/${id}`, data),

  deleteCoupon: (id: string) => 
    apiClient.delete(`/coupons/${id}`)
};



export const paymentAPI = {
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

  vnpayReturn: (params: Record<string, any>) =>
    apiClient.get('/payments/vnpay_return', { params }),

  vnpayIPN: (params: Record<string, any>) =>
    apiClient.get('/payments/vnpay_ipn', { params }),
};


export const adminAPI = {
};

export const blogAPI = {
  createBlog: (data: any) =>
    apiClient.post('/blogs', data),

  getBlogById: (blogId: string) =>
    apiClient.get(`/blogs/${blogId}`),

  getAllBlogs: (params?: Record<string, any>) =>
    apiClient.get('/blogs', { params }),
  
  updateBlog: (blogId: string, data: any) =>
    apiClient.put(`/blogs/${blogId}`, data),
  
  deleteBlog: (blogId: string) =>
    apiClient.delete(`/blogs/${blogId}`),

  toggleBlogActive: (blogId: string) =>
    apiClient.put(`/blogs/${blogId}/toggle`),
};


export const reviewsAPI = {
  submitReview: (roomId: string, data: { rating: number; comment?: string }) =>
    apiClient.post(`/reviews/rooms/${roomId}`, data),
  
  getReviewsByRoom: (roomId: string) =>
    apiClient.get(`/reviews/rooms/${roomId}`),

  deleteReview: (reviewId: string) =>
    apiClient.delete(`/reviews/${reviewId}`),
};

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  delete apiClient.defaults.headers.common['Authorization'];
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};


export const createFormData = (
  data: Record<string, any>,
  files?: File[],
  fileFieldName: string = 'images'
): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append(fileFieldName, file);
    });
  }

  return formData;
};

export default apiClient;
