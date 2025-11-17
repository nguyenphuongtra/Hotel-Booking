import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  element: React.ReactElement
  requiredRole?: 'user' | 'admin'
}

export const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return element
}
