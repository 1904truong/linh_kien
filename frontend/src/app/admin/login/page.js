'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      if (data.user.role !== 'admin') {
        throw new Error('Tài khoản này không có quyền truy cập khu vực Quản trị.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast.success('Chào mừng Quản trị viên!');
      router.push('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
           <div className="inline-flex items-center justify-center size-20 bg-[#1173d4] rounded-[24px] mb-6 shadow-2xl shadow-blue-500/20 rotate-12 hover:rotate-0 transition-transform duration-500">
             <ShieldAlert size={40} className="text-white" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center justify-center gap-3">
             Admin <span className="text-[#1173d4]">Portal</span>
           </h1>
           <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-3">Hệ thống quản trị XeParts</p>
        </div>

        <div className="bg-[#1A2632] border border-white/5 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl">
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email quản trị viên</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 bg-[#0A0F14] border-none rounded-2xl pl-14 pr-6 text-white font-bold focus:ring-2 focus:ring-[#1173d4]/50 transition-all outline-none"
                    placeholder="admin@xeparts.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu bảo mật</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 bg-[#0A0F14] border-none rounded-2xl pl-14 pr-14 text-white font-bold focus:ring-2 focus:ring-[#1173d4]/50 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-[#1173d4] to-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                <Zap size={18} fill="currentColor" />
              </button>
           </form>

           <div className="mt-10 pt-8 border-t border-white/5">
             <div className="flex items-start gap-4 p-5 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                <ShieldCheck className="text-[#1173d4] shrink-0" size={20} />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                   Lưu ý: Trang này chỉ dành cho nhân viên có quyền quản trị. Mọi truy cập trái phép đều được ghi lại trong nhật ký hệ thống.
                </p>
             </div>
           </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-[#1173d4] uppercase tracking-widest transition-all">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
