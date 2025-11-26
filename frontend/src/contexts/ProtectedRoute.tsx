import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  element: React.ReactElement
  requiredRole?: 'user' | 'admin'
  [key: string]: any // Allow arbitrary props
}

export const ProtectedRoute = ({ element, requiredRole, ...rest }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // Vẫn đang load auth state từ localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Chưa đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Có yêu cầu role cụ thể nhưng user không đủ quyền
  if (requiredRole && user.role !== requiredRole) {
    // Nếu là user thường cố vào admin → về trang chủ
    // Nếu là admin cố vào trang user-only (hiếm) → cũng về trang chủ
    return <Navigate to="/" replace />
  }

  // Đã OK → cho vào
  return React.cloneElement(element, rest)
}