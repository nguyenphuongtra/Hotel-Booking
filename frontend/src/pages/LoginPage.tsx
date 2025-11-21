import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  // Responsive: detect isMobile by window width
  const isMobile = window.innerWidth < 800;

  const validate = () => {
    const err: any = {};
    if (!form.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) err.email = 'Email không hợp lệ.';
    if (!form.password || form.password.length < 8) err.password = 'Mật khẩu tối thiểu 8 ký tự.';
    return err;
  };

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length !== 0) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      setTimeout(() => navigate('/'), 100);
    } catch (error: any) {
      setGeneralError(error?.response?.data?.message || error?.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    authAPI.googleAuth();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center items-center">
      <div className={`w-full flex ${isMobile ? 'flex-col' : 'flex-row gap-8 items-center'} justify-center`}>
        {/* Left: Image desktop only */}
        {!isMobile && (
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                alt="Hotel lobby"
                className="w-full h-[600px] object-cover"
                style={{ minWidth: 320 }}
              />
            </div>
          </div>
        )}
        {/* Right: Login Form */}
        <div className={`${isMobile ? 'w-full' : 'w-[420px]'} shrink-0`}>
          <Card>
            <CardContent className="space-y-5 pt-8 pb-10">
              <h2 className="text-2xl font-bold text-center mb-2">Đăng nhập</h2>
              {/* Google Login */}
              <Button variant="outline" className="w-full gap-2" type="button" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Đăng nhập bằng Google
              </Button>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="Email"
                      className="pl-10" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                  </div>
                  {!!errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"
                      className="pl-10 pr-10" value={form.password} onChange={e => handleChange('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!!errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={form.remember} onCheckedChange={v => handleChange('remember', v)} />
                  <label htmlFor="remember" className="text-sm cursor-pointer">Duy trì đăng nhập</label>
                  <span className="flex-1 text-right">
                    <a href="#" className="text-blue-600 text-sm hover:underline">Quên mật khẩu?</a>
                  </span>
                </div>
                {/* Error message */}
                {generalError && <div className="text-sm text-red-600 pt-3 text-center">{generalError}</div>}
                {/* Submit */}
                <Button className="w-full mt-2" size="lg" isLoading={loading}>Đăng nhập</Button>
              </form>
              {/* Link register */}
              <div className="pt-4 text-center text-sm text-gray-600">
                Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
