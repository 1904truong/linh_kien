'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Settings2,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import useCartStore from '@/store/useCartStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simplified login validation
    if (!password) {
      setError("Vui lòng nhập mật khẩu.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      // Fetch cart items for the logged-in user
      await useCartStore.getState().fetchCart();

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#101922]">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
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
            Hệ thống quản lý chuyên nghiệp
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-6 text-white uppercase">
            Giải pháp tối ưu cho <span className="text-[#1173d4]">Phụ tùng Ô tô</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed font-medium">
            Nền tảng cung cấp linh kiện chính hãng, tra cứu mã phụ tùng nhanh chóng và quản lý kho vận hiệu quả cho các garage và đại lý.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-black text-white tracking-tighter">500k+</span>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sản phẩm có sẵn</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-black text-white tracking-tighter">2k+</span>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Đối tác tin cậy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24">
        <div className="w-full max-w-[440px] flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 text-[#1173d4]">
              <div className="bg-[#1173d4] p-2 rounded-xl">
                <Settings2 size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">XeParts Pro</span>
            </Link>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Chào mừng trở lại</h2>
              <p className="text-slate-500 font-bold text-sm">Đăng nhập để tiếp tục quản lý và tìm kiếm phụ tùng.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-xs font-bold animate-pulse">
                {error}
              </div>
            )}
            
            {/* Email/Phone Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email hoặc Số điện thoại</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold" 
                  placeholder="example@gmail.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                <Link 
                  href="/forgot-password"
                  className="text-[10px] font-bold text-[#1173d4] hover:underline uppercase tracking-widest"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                <input 
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-800 bg-[#0A0F14] text-white focus:ring-2 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 font-bold" 
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

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input 
                className="w-5 h-5 rounded-lg border-slate-800 bg-[#0A0F14] text-[#1173d4] focus:ring-[#1173d4] transition-all cursor-pointer" 
                id="remember" 
                type="checkbox"
              />
              <label className="text-xs text-slate-400 font-bold select-none cursor-pointer" htmlFor="remember">Duy trì đăng nhập</label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#1173d4] hover:bg-[#1173d4]/90 text-white font-black rounded-2xl shadow-xl shadow-[#1173d4]/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-[#101922] px-4 text-slate-600">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 h-12 border border-slate-800 rounded-2xl hover:bg-white/[0.02] transition-all group">
              <img alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxn7lAwoyXjOUu3UMWk9BcG1c7Y759lI6eWs60pDG97a8o_3xTKrrOvboxVSLlbAxN_wG6YifchkzFrHuuvfZ7KQqNql8llNgUx-aOYPYXSg_oryoPECv1ugn59Il7CDodEArKP2P5kKsZzj0RuKC_mFL4zJKSjEk8BX9_nmmQAvRCB8k-cEp4bmnAS8_Djg2-kQM2iMIKzKbO569YDh6WtGqOlChE0cyvZBUbw20pdDlPwonkZt5GQS4B1qBNSQ6Gecg2ygqfg7k"/>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 h-12 border border-slate-800 rounded-2xl hover:bg-white/[0.02] transition-all group">
              <img alt="Facebook" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQxMy6HfmOtLid_cgqXHqHZpFxlDWHjvCRkDW3w5PIYrYJRtID4h29awxnpioTMRlLe9GdVHo0aAFN3N6gE5s5rapF2Jhh48jceur4ouGAOoGOVTe-Q3CEXamh1P2ZkrsyqNnT_wB-vlDwHMqnsddcZHok0VMUGDRAyD8Cv2aTdvAbVXGpM2IydIH8itjZXVw46h3GN58hZwqeTQwhB1CIOrPEcWBoYhKYklbyRk9K6EL6g4zvuNKUO2RewmDyzt6vG0TJAz-jVJs"/>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Facebook</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-slate-500 text-sm font-bold">
            Chưa có tài khoản? 
            <Link className="text-[#1173d4] font-black hover:underline ml-2" href="/register">Đăng ký ngay</Link>
          </p>
        </div>

        {/* Language & Terms */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <a className="hover:text-white transition-colors" href="#">Điều khoản</a>
          <a className="hover:text-white transition-colors" href="#">Bảo mật</a>
          <a className="hover:text-white transition-colors" href="#">Hỗ trợ</a>
        </div>
      </div>
    </div>
  );
}
