import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authAPI, userAPI } from '../api/api'
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  // Fetch user profile
  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await userAPI.getCurrentUser()
      return response.data.data as User
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  // Set user when profile is fetched
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile)
    }
  }, [userProfile])

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      setToken(storedToken)
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user', error)
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, user: newUser } = response.data.data

      // Store token and user
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      setToken(newToken)
      setUser(newUser)

      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })

      toast.success('Login successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }, [queryClient])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password })
      const { token: newToken, user: newUser } = response.data.data

      // Store token and user
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      setToken(newToken)
      setUser(newUser)

      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })

      toast.success('Registration successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }, [queryClient])

  const logout = useCallback(() => {
    // Clear storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear state
    setToken(null)
    setUser(null)

    // Clear queries
    queryClient.clear()

    toast.success('Logged out successfully')
  }, [queryClient])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: isLoading || isUserLoading,
    login,
    logout,
    register,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
