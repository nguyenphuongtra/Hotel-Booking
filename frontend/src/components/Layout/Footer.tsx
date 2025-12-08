import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Giới thiệu */}
          <div>
            <h3 className="text-xl font-bold gradient-primary bg-clip-text text-transparent mb-4">Hotel Booking</h3>
            <p className="text-gray-400 leading-relaxed mb-4">Nền tảng đặt phòng khách sạn hàng đầu với dịch vụ chuyên nghiệp và giá cạnh tranh.</p>
            <p className="text-gray-500 text-sm">Chúng tôi cung cấp trải nghiệm đặt phòng an toàn, nhanh chóng và tiện lợi.</p>
          </div>

          {/* Dịch vụ */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Dịch vụ</h4>
            <ul className="space-y-3">
              <li><Link to="/rooms" className="text-gray-400 hover:text-orange-400 transition duration-200">Tìm phòng</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition duration-200">Ưu đãi đặc biệt</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition duration-200">Điều kiện huỷ bỏ</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition duration-200">Hỗ trợ khách hàng</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-orange-400 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-400">Hotline</span>
                  <span className="text-white font-semibold">+84 (123) 456-7890</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-orange-400 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-semibold">support@hotelbooking.com</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-400 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-400">Địa chỉ</span>
                  <span className="text-white font-semibold">Đà Nẵng, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Kết nối với chúng tôi</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition duration-200"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition duration-200"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition duration-200"><Instagram size={20} /></a>
            </div>
            <p className="text-gray-400 text-sm">Theo dõi chúng tôi để nhận thông tin khuyến mãi mới nhất.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              &copy; {currentYear} Hotel Booking. Made with <Heart size={16} className="text-red-500" /> All rights reserved.
            </p>
            <div className="flex gap-6 flex-wrap justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Chính sách riêng tư</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Điều khoản dịch vụ</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-200">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
