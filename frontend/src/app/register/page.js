'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Settings2,
  CheckCircle2,
  Store
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validatePassword = (pass) => {
    if (!pass) return "Vui lòng nhập mật khẩu.";
    if (pass.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (pass.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";
    if (!/[A-Z]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa (A-Z).";
    if (!/[a-z]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).";
    if (!/[0-9]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).";
    if (!/[@$!%*?&]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@, $, !, %, *, ?, &).";
    if (/\s/.test(pass)) return "Mật khẩu không được chứa khoảng trắng.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, shopName: role === 'seller' ? shopName : '' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#101922]">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1173d4]/10 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1173d4]/40 to-[#101922]"></div>
          <img 
            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Branding Background" 
          />
        </div>
        <div className="relative z-10 max-w-lg text-left">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1173d4]/20 border border-[#1173d4]/30 text-[#1173d4] text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={14} />
            Tham gia cộng đồng phụ tùng lớn nhất
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-6 text-white uppercase">
            Bắt đầu hành trình <span className="text-[#1173d4]">XeParts Pro</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            Tạo tài khoản ngay để quản lý gara, tìm kiếm linh kiện thông minh và nhận ưu đãi độc quyền dành riêng cho đối tác.
          </p>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col gap-8 my-auto">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 text-[#1173d4]">
              <div className="bg-[#1173d4] p-2 rounded-xl">
                <Settings2 size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">XeParts Pro</span>
            </Link>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Đăng ký tài khoản</h2>
              <p className="text-slate-500 font-bold text-sm">Điền thông tin bên dưới để bắt đầu sử dụng hệ thống.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-xs font-bold animate-shake">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl text-xs font-bold">
                Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
              </div>
            )}
            
            {/* Full Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold text-sm" 
                  placeholder="Nguyễn Văn A" 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold text-sm" 
                  placeholder="example@gmail.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold text-sm" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nhập lại mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold text-sm" 
                  placeholder="••••••••" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-3 p-4 bg-white/[0.02] border border-slate-800 rounded-2xl">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Loại tài khoản</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-all ${role === 'customer' ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
                >
                  Người mua
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2 px-4 rounded-xl text-[10px] font-bold uppercase transition-all ${role === 'seller' ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
                >
                  Người bán
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading || success}
              className="w-full h-14 mt-4 bg-[#1173d4] hover:bg-[#1173d4]/90 text-white font-black rounded-2xl shadow-xl shadow-[#1173d4]/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-500 text-sm font-bold">
            Đã có tài khoản? 
            <Link className="text-[#1173d4] font-black hover:underline ml-2" href="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
