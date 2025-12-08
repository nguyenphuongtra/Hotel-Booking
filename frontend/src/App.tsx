import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout/Layout'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './contexts/ProtectedRoute'
import { AdminLayout } from './components/Layout/AdminLayout'

const Home = lazy(() => import('./pages/Home').catch(() => ({ default: () => <div className="text-center py-20">Home Page</div> })))
const Rooms = lazy(() => import('./pages/Rooms').catch(() => ({ default: () => <div className="text-center py-20">Rooms Page</div> })))
const Bookings = lazy(() => import('./pages/Bookings').catch(() => ({ default: () => <div className="text-center py-20">Bookings Page</div> })))
const Contact = lazy(() => import('./pages/Contact').catch(() => ({ default: () => <div className="text-center py-20">Contact Page</div> })))
const LoginPage = lazy(() => import('./pages/LoginPage').catch(() => ({ default: () => <div className="text-center py-20">Login Page</div> })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').catch(() => ({ default: () => <div className="text-center py-20">Register Page</div> })))
const OAuthSuccess = lazy(() => import('./pages/auth/OAuthSuccess').catch(() => ({ default: () => <div className="text-center py-20">OAuth Success Page</div> })))
const RoomDetails = lazy(() => import('./pages/RoomDetails').catch(() => ({ default: () => <div className="text-center py-20">Room Details Page</div> })))
const PaymentPage = lazy(() => import('./pages/PaymentPage').catch(() => ({ default: () => <div className="text-center py-20">Payment Page</div> })))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess').catch(() => ({ default: () => <div className="text-center py-20">Payment Success Page</div> })))
const BlogPage = lazy(() => import('./pages/BlogPage').catch(() => ({ default: () => <div className="text-center py-20">Blog Page</div> })))
const VnpayReturn = lazy(() => import('./pages/VnpayReturn').catch(() => ({ default: () => <div className="text-center py-20">VNPay Return Page</div> })))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').catch(() => ({ default: () => <div className="text-center py-20">Admin Dashboard</div> })))
const AdminUsers = lazy(() => import('./pages/AdminUsers').then(module => ({ default: module.AdminUsers })).catch(() => ({ default: () => <div className="text-center py-20">Admin Users</div> })))
const AdminRooms = lazy(() => import('./pages/AdminRooms').then(module => ({ default: module.AdminRooms })).catch(() => ({ default: () => <div className="text-center py-20">Admin Rooms</div> })))
const AdminBookings = lazy(() => import('./pages/AdminBookings').then(module => ({ default: module.AdminBookings })).catch(() => ({ default: () => <div className="text-center py-20">Admin Bookings</div> })))
const AdminCoupons = lazy(() => import('./pages/AdminCoupons').then(module => ({ default: module.AdminCoupons })).catch(() => ({ default: () => <div className="text-center py-20">Admin Coupons</div> })))
const AdminBlog = lazy(() => import('./pages/AdminBlog').then(module => ({ default: module.AdminBlogs })).catch(() => ({ default: () => <div className="text-center py-20">Admin Blog</div> })))


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
})

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/oauth-success" element={<OAuthSuccess />} />
                  <Route path="/rooms/:roomId" element={<RoomDetails />} />
                  <Route path="/booking" element={<PaymentPage />} />
                  <Route path="/success" element={<PaymentSuccess />} />
                  <Route path="/vnpay_return" element={<VnpayReturn />} />
                  <Route path="/blogs" element={<BlogPage />} />
                </Route>
                <Route path='/admin' element={<ProtectedRoute requiredRole="admin" element={<AdminLayout />} />}>
                  <Route path='dashboard' element={<AdminDashboard viewMode={'desktop'} />} />
                  <Route path='users' element={<AdminUsers viewMode={'desktop'} />} />
                  <Route path='rooms' element={<AdminRooms viewMode="desktop" />} />
                  <Route path='bookings' element={<AdminBookings viewMode='desktop'/>} />
                  <Route path='coupons' element={<AdminCoupons viewMode='desktop'/>} />
                  <Route path='posts' element={<AdminBlog viewMode='desktop'/>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#000',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '16px',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
  </div>
)

export default App
