import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import HotelMap from '../components/Layout/HotelMap'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setTimeout(() => setIsSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng trả lời các câu hỏi của bạn và cung cấp thông tin chi tiết về các dịch vụ của chúng tôi
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-6">
                <Phone className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Điện Thoại</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">+84 (123) 456-7890</p>
              <p className="text-gray-600 dark:text-gray-400">+84 (098) 765-4321</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 mb-6">
                <Mail className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">info@hotel.com</p>
              <p className="text-gray-600 dark:text-gray-400">support@hotel.com</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 mb-6">
                <MapPin className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Địa Chỉ</h3>
              <p className="text-gray-600 dark:text-gray-400">123 Hotel Street</p>
              <p className="text-gray-600 dark:text-gray-400">Đà Nẵng, Việt Nam</p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-8">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  <p className="text-green-800 dark:text-green-300 font-medium">Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ bạn sớm.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Họ Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Số Điện Thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="+84 (123) 456-7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Tiêu Đề</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Tiêu đề tin nhắn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Tin Nhắn</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                    placeholder="Nhập tin nhắn của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isLoading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                </button>
              </form>
            </div>

            {/* Info Box */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Giờ Làm Việc</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="text-orange-500 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Thứ Hai - Thứ Sáu</p>
                      <p className="text-gray-600 dark:text-gray-400">08:00 - 22:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-red-500 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Thứ Bảy - Chủ Nhật</p>
                      <p className="text-gray-600 dark:text-gray-400">09:00 - 23:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl p-8 shadow-lg text-white">
                <h3 className="text-2xl font-bold mb-4">Cần Hỗ Trợ Nhanh?</h3>
                <p className="mb-6 text-white/90">Gọi cho chúng tôi ngay để được hỗ trợ tức thì từ nhân viên chuyên nghiệp của chúng tôi.</p>
                <a href="tel:+84123456789" className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                  Gọi Ngay: +84 (123) 456-7890
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg overflow-hidden">
            <h2 className="text-3xl font-bold mb-8">Vị Trí Của Chúng Tôi</h2>
            <div className="rounded-xl overflow-hidden h-96 md:h-[500px]">
              <HotelMap />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Câu Hỏi Thường Gặp</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border-l-4 border-orange-500 bg-slate-50 dark:bg-slate-900 rounded">
              <h3 className="font-bold mb-2 text-lg">Thời gian phản hồi là bao lâu?</h3>
              <p className="text-gray-600 dark:text-gray-400">Chúng tôi thường phản hồi trong vòng 24 giờ trong giờ làm việc.</p>
            </div>
            <div className="p-6 border-l-4 border-red-500 bg-slate-50 dark:bg-slate-900 rounded">
              <h3 className="font-bold mb-2 text-lg">Chính sách hủy phòng là gì?</h3>
              <p className="text-gray-600 dark:text-gray-400">Hủy miễn phí trong vòng 7 ngày trước khi nhận phòng.</p>
            </div>
            <div className="p-6 border-l-4 border-pink-500 bg-slate-50 dark:bg-slate-900 rounded">
              <h3 className="font-bold mb-2 text-lg">Bạn có phục vụ quốc tế không?</h3>
              <p className="text-gray-600 dark:text-gray-400">Có, chúng tôi chào đón khách từ khắp nơi trên thế giới.</p>
            </div>
            <div className="p-6 border-l-4 border-orange-400 bg-slate-50 dark:bg-slate-900 rounded">
              <h3 className="font-bold mb-2 text-lg">Có chương trình khách hàng trung thành không?</h3>
              <p className="text-gray-600 dark:text-gray-400">Có, đăng ký để nhận điểm thưởng và ưu đãi độc quyền.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
