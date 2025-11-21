import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuthState } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        setAuthState(token, user)
        navigate('/', { replace: true })
      } catch (err) {
        console.error('Lỗi xử lý Google login:', err)
        navigate('/login?error=oauth')
      }
    } else {
      navigate('/login?error=oauth')
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
        <p className="text-lg font-medium">Đang hoàn tất đăng nhập...</p>
        <p className="text-sm text-gray-600 mt-2">Vui lòng đợi giây lát</p>
      </div>
    </div>
  )
}