// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authAPI } from '../api/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  isLocked?: boolean
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  setUser: (user: User | null) => void
  setAuthState: (token: string, user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  const applyAuthState = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  // Khởi tạo auth từ localStorage khi app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        applyAuthState(storedToken, JSON.parse(storedUser))
      } catch (error) {
        console.error('Lỗi parse user từ localStorage:', error)
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [applyAuthState])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, user: newUser } = response.data.data

      applyAuthState(newToken, newUser)

      toast.success('Đăng nhập thành công!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email hoặc mật khẩu không đúng'
      toast.error(message)
      throw error
    }
  }, [applyAuthState])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password })
      const { token: newToken, user: newUser } = response.data.data

      applyAuthState(newToken, newUser)

      toast.success('Đăng ký thành công! Chào mừng bạn!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại'
      toast.error(message)
      throw error
    }
  }, [applyAuthState])

  const logout = useCallback(() => {
    // Xóa hết
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)

    // Xóa cache (nếu dùng react-query ở nơi khác)
    queryClient.clear()

    toast.success('Đã đăng xuất')
  }, [queryClient])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    register,
    setUser,
    setAuthState: applyAuthState,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider')
  }
  return context
}