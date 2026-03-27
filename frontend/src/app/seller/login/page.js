'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  BadgeCheck,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import toast from 'react-hot-toast';

export default function SellerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (user && user.role === 'seller') {
      router.push('/seller');
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

      if (data.user.role !== 'seller') {
        throw new Error('Tài khoản này không phải là Người bán. Vui lòng đăng nhập đúng trang.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      toast.success('Chào mừng quay lại, đối tác!');
      router.push('/seller');
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
         <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
           <div className="inline-flex items-center justify-center size-20 bg-emerald-500 rounded-[24px] mb-6 shadow-2xl shadow-emerald-500/20 -rotate-6 hover:rotate-0 transition-transform duration-500">
             <Store size={40} className="text-white" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center justify-center gap-3">
             Seller <span className="text-emerald-500">Center</span>
           </h1>
           <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-3">Kênh hành trình cùng XeParts</p>
        </div>

        <div className="bg-[#1A2632] border border-white/5 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl">
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email đối tác</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 bg-[#0A0F14] border-none rounded-2xl pl-14 pr-6 text-white font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                    placeholder="partner@xeparts.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu cửa hàng</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 bg-[#0A0F14] border-none rounded-2xl pl-14 pr-14 text-white font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
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
                className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? "Đang xác thực..." : "Tiếp tục kinh doanh"}
                <TrendingUp size={18} fill="currentColor" />
              </button>
           </form>

           <div className="mt-10 pt-8 border-t border-white/5">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-slate-500">Bạn chưa có cửa hàng?</span>
               <Link href="/register?role=seller" className="text-emerald-500 hover:underline">Đăng ký ngay →</Link>
             </div>
           </div>
        </div>

        <div className="mt-8 text-center flex flex-col gap-4">
          <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-all">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
