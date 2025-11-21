import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, LogIn, LayoutGrid } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Hotel
          </Link>
          
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition">Trang chủ</Link>
            <Link to="/rooms" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition">Phòng</Link>
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition">Blog</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-gray-700 dark:text-gray-300 text-sm">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} />
                      <span>Hồ sơ</span>
                    </Link>
                    <Link
                      to="/bookings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutGrid size={18} />
                      <span>Đặt phòng của tôi</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutGrid size={18} />
                        <span>Admin</span>
                      </Link>
                    )}
                    <hr className="my-2 dark:border-slate-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white hover:shadow-lg transition"
              >
                <LogIn size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="flex flex-col gap-4 pb-4 md:hidden">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>Trang chủ</Link>
            <Link to="/rooms" className="text-gray-700 dark:text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>Phòng</Link>
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>Liên hệ</Link>
            {!isAuthenticated && (
              <Link to="/login" className="text-orange-500 font-semibold" onClick={() => setIsOpen(false)}>Đăng nhập</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
