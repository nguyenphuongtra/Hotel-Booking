import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    avatar: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileImage, setProfileImage] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        toast.success('Ảnh đã được tải lên')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên')
      return
    }
    
    toast.success('Cập nhật hồ sơ thành công')
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền tất cả các trường')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    toast.success('Đổi mật khẩu thành công')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsChangingPassword(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Đã đăng xuất')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Hồ Sơ Cá Nhân</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Avatar Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"></div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-16 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 p-1 shadow-lg">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-white text-4xl font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition"
                  >
                    <Camera size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {user?.role === 'admin' ? '👑 Quản trị viên' : '👤 Khách hàng'}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                >
                  {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thông Tin Cá Nhân</h3>

            {isEditing ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-400 bg-gray-100 focus:outline-none transition cursor-not-allowed"
                    placeholder="Email của bạn"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-semibold"
                >
                  <Save size={20} />
                  Lưu Thay Đổi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <Mail className="text-orange-500" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <Phone className="text-orange-500" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Số điện thoại</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formData.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <MapPin className="text-orange-500" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Địa chỉ</p>
                    <p className="text-gray-900 dark:text-white font-semibold">{formData.address || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                  <Calendar className="text-orange-500" size={24} />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ngày tham gia</p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bảo Mật</h3>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm font-semibold"
              >
                {isChangingPassword ? 'Hủy' : 'Đổi Mật Khẩu'}
              </button>
            </div>

            {isChangingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-gray-600 dark:text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-3 text-gray-600 dark:text-gray-400"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3 text-gray-600 dark:text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-semibold"
                >
                  Xác Nhận Đổi Mật Khẩu
                </button>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-slate-700/30 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  ✓ Mật khẩu được bảo vệ bằng mã hóa mạnh mẽ
                </p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400">Phòng Đã Đặt</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400">Đánh Giá</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">⭐</p>
              <p className="text-gray-600 dark:text-gray-400">Đánh Giá Trung Bình</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Vùng Nguy Hiểm</h3>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
