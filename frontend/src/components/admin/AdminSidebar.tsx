import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Hotel, CalendarCheck, FileText, Percent } from 'lucide-react';

export function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        ADMIN
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink to="/admin/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
        <NavLink to="/admin/users" icon={<Users className="w-5 h-5" />} label="Quản lý User" />
        <NavLink to="/admin/rooms" icon={<Hotel className="w-5 h-5" />} label="Quản lý Phòng" />
        <NavLink to="/admin/bookings" icon={<CalendarCheck className="w-5 h-5" />} label="Quản lý Đặt phòng" />
        <NavLink to="/admin/posts" icon={<FileText className="w-5 h-5" />} label="Quản lý Bài viết" />
        <NavLink to="/admin/coupons" icon={<Percent className="w-5 h-5" />} label="Quản lý Mã giảm giá" />
      </nav>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ to, icon, label }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
