import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout/Layout'
import { AuthProvider } from './contexts/AuthContext'

// Lazy load pages
const Home = lazy(() => import('./pages/Home').catch(() => ({ default: () => <div className="text-center py-20">Home Page</div> })))
const Rooms = lazy(() => import('./pages/Rooms').catch(() => ({ default: () => <div className="text-center py-20">Rooms Page</div> })))
const Bookings = lazy(() => import('./pages/Bookings').catch(() => ({ default: () => <div className="text-center py-20">Bookings Page</div> })))
const Contact = lazy(() => import('./pages/Contact').catch(() => ({ default: () => <div className="text-center py-20">Contact Page</div> })))

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
                  <Route path="*" element={<NotFound />} />
                </Route>
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
