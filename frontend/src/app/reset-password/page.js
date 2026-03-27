'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Settings2, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Mã đặt lại mật khẩu không tìm thấy. Vui lòng kiểm tra lại link trong email.');
    }
  }, [token]);

  const validatePassword = (pass) => {
    if (!pass) return "Vui lòng nhập mật khẩu mới.";
    if (pass.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (pass.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";
    if (!/[A-Z]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa (A-Z).";
    if (!/[a-z]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).";
    if (!/[0-9]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).";
    if (!/[@$!%*?&]/.test(pass)) return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.";
    if (/\s/.test(pass)) return "Mật khẩu không được chứa khoảng trắng.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
        setError('Không tìm thấy mã xác thực.');
        return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] flex font-sans selection:bg-[#1173d4]/30 text-white">
      {/* Left Decoration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0D131A] border-r border-slate-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1173d415_0%,transparent_70%)]"></div>
        <div className="relative z-10 w-full flex flex-col justify-between p-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#1173d4] p-2 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#1173d4]/20">
              <Settings2 size={28} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">XeParts Pro</span>
          </Link>

          <div>
            <h1 className="text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Tạo mật khẩu<br />
              <span className="text-[#1173d4]">Mới</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
              Bảo mật tài khoản của bạn với mật khẩu mạnh gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="w-4 h-1.5 rounded-full bg-slate-800"></div>
            <div className="w-12 h-1.5 rounded-full bg-[#1173d4]"></div>
            <div className="w-4 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight">Đặt lại mật khẩu</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
              Nhập mật khẩu mới để hoàn tất bảo mật
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#131920] border border-slate-800/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nhập lại mật khẩu mới</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#131920] border border-slate-800/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all font-bold"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#131920]/50 p-4 rounded-xl border border-slate-800/30">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Yêu cầu bảo mật:</p>
                 <ul className="text-[10px] text-slate-500 font-medium grid grid-cols-2 gap-x-4 gap-y-1 ml-1">
                    {['Ít nhất 8 ký tự', 'Chứa chữ hoa (A-Z)', 'Chứa chữ thường (a-z)', 'Phải có chữ số (0-9)', 'Ký tự đặc biệt', 'Không khoảng trắng'].map((req, i) => (
                        <li key={i} className="flex items-center gap-1.5 italic">• {req}</li>
                    ))}
                 </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-[#1173d4] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1173d4]/20 hover:bg-[#1173d4]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-[#131920] border border-slate-800/50 p-10 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-lg shadow-emerald-500/5">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Thành công!</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Mật khẩu của bạn đã được đặt lại thành công. Bạn đang được chuyển hướng đến trang đăng nhập...
                </p>
              </div>
              <div className="pt-4">
                <Loader2 className="animate-spin mx-auto text-[#1173d4]" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 pb-4 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Hệ thống quản lý chuyên nghiệp <span className="text-[#1173d4]">XeParts Pro</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1173d4]" size={40} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
