import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accepted: false,
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  // Responsive
  const isMobile = window.innerWidth < 800;

  // Chuyển hướng sau khi đăng ký thành công
  useEffect(() => {
    if (shouldRedirect && isAuthenticated) {
      navigate('/login');
    }
  }, [shouldRedirect, isAuthenticated, navigate]);
  const validate = () => {
    const err: any = {};
    if (!form.name) err.name = 'Vui lòng nhập họ tên.';
    if (!form.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) err.email = 'Email không hợp lệ.';
    if (!form.password || form.password.length < 8) err.password = 'Mật khẩu tối thiểu 8 ký tự.';
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (!form.accepted) err.accepted = 'Bạn cần đồng ý điều khoản dịch vụ.';
    return err;
  };
  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccess(false);
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length !== 0) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(true);
      setShouldRedirect(true);
    } catch (error: any) {
      setGeneralError(error?.response?.data?.message || error?.message || 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center items-center">
      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row gap-8 items-center'} justify-center`}>
        {/* Left - Image (Desktop only) */}
        {!isMobile && (
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
                alt="Hotel reception"
                className="w-full h-[600px] object-cover"
                style={{ minWidth: 320 }}
              />
            </div>
          </div>
        )}
        {/* Right - Registration Form */}
        <div className={`${isMobile ? 'w-full' : 'w-[420px]'} shrink-0`}>
          <Card>
            <CardContent className="space-y-4 pt-8 pb-10">
              <h2 className="text-2xl font-bold text-center mb-2">Tạo tài khoản</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Tên hiển thị */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm">Họ tên *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="name" type="text" placeholder="Họ và tên" className="pl-10"
                      value={form.name} onChange={e => handleChange('name', e.target.value)} />
                  </div>
                  {!!errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="Email"
                      className="pl-10" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                  </div>
                  {!!errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-sm">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="phone" type="tel" placeholder="096xxxxxxx" className="pl-10" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                  </div>
                </div>
                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm">Mật khẩu *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Tạo mật khẩu mạnh" className="pl-10 pr-10"
                      value={form.password} onChange={e => handleChange('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!!errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
                {/* Xác nhận mật khẩu */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm">Xác nhận mật khẩu *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"
                      className="pl-10 pr-10" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!!errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
                {/* Checkbox terms */}
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="terms" checked={form.accepted} onCheckedChange={v => handleChange('accepted', v)} />
                  <label htmlFor="terms" className="text-sm cursor-pointer text-gray-600">Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản dịch vụ</a> & <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a></label>
                </div>
                {!!errors.accepted && <p className="text-xs text-red-500">{errors.accepted}</p>}
                {/* Error & success message */}
                {generalError && <div className="text-sm text-red-600 pt-3 text-center">{generalError}</div>}
                {success && <div className="text-sm text-green-600 pt-3 text-center">Đăng ký thành công! Chuyển tới trang đăng nhập...</div>}
                {/* Submit */}
                <Button className="w-full mt-2" size="lg" isLoading={loading}>Tạo tài khoản</Button>
              </form>
              {/* Link login */}
              <div className="pt-4 text-center text-sm text-gray-600">
                Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
