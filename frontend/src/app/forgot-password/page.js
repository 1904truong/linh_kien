'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ChevronLeft, Loader2, CheckCircle2, AlertCircle, Settings2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] flex font-sans selection:bg-[#1173d4]/30">
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
              Khôi phục<br />
              <span className="text-[#1173d4]">Mật khẩu</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
              Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào gara của mình chỉ trong vài bước đơn giản.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-1.5 rounded-full bg-[#1173d4]"></div>
            <div className="w-4 h-1.5 rounded-full bg-slate-800"></div>
            <div className="w-4 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-4"
            >
              <ChevronLeft size={16} /> Quay lại đăng nhập
            </Link>
            <h2 className="text-3xl font-black text-white tracking-tight">Quên mật khẩu?</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
              Nhập email để nhận link đặt lại mật khẩu
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-[#131920] border border-slate-800/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1173d4] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1173d4]/20 hover:bg-[#1173d4]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Gửi yêu cầu'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-[#131920] border border-slate-800/50 p-10 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-lg shadow-emerald-500/5">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Kiểm tra Email</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="text-white font-bold">{email}</span>. Vui lòng kiểm tra hộp thư đến của bạn.
                </p>
              </div>
              <Link 
                href="/login" 
                className="block w-full text-center text-[10px] font-black text-[#1173d4] uppercase tracking-widest hover:underline pt-4"
              >
                Đã nhận được email? Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Hỗ trợ kỹ thuật: <span className="text-slate-400">024 123 4567</span>
          </p>
        </div>
      </div>
    </div>
  );
}
