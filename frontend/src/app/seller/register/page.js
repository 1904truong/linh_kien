'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, ArrowRight, CheckCircle2, ShieldCheck, Mail, User, Phone, MapPin, Lock, FileText } from 'lucide-react';
import useUserStore from '@/store/useUserStore';
import api from '@/lib/api';

export default function SellerRegister() {
  const [formData, setFormData] = useState({ 
    name: '', 
    shopName: '', 
    email: '', 
    phoneNumber: '', 
    address: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', { ...formData, role: 'seller' });
      alert('Đăng ký thành công! Vui lòng chờ quản trị viên phê duyệt gian hàng của bạn.');
      router.push('/seller/login');
    } catch (err) {
      alert('Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] flex flex-col items-center justify-center p-4 lg:p-10 font-sans selection:bg-[#1173d4] selection:text-white">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[-5%] size-[600px] bg-emerald-500/10 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] size-[600px] bg-[#1173d4]/15 rounded-full blur-[130px]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-[#101922] rounded-[40px] overflow-hidden border border-slate-800 shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Side: Benefits */}
        <div className="p-16 lg:p-20 bg-[#1A2129] border-r border-slate-800 flex flex-col">
           <Link href="/" className="flex items-center gap-3 mb-16">
               <div className="bg-[#1173d4] p-2 rounded-xl">
                 <Store size={28} className="text-white" />
               </div>
               <h1 className="text-2xl font-black tracking-tighter text-white">XeParts <span className="text-[#1173d4]">Pro</span></h1>
           </Link>

           <div className="space-y-10">
              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-white leading-tight">Khởi tạo gian hàng,<br/> bứt phá doanh số.</h2>
                 <p className="text-slate-500 font-medium leading-relaxed">Gia nhập cộng đồng hơn 5.000+ nhà cung cấp phụ tùng ô tô uy tín nhất Việt Nam.</p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                 {[
                   { title: 'Hoa hồng 0%', desc: 'Ưu đãi cực lớn cho 3 tháng đầu tiên tham gia.' },
                   { title: 'Quản lý 1-chạm', desc: 'Dễ dàng theo dõi tồn kho và dòng tiền trên mọi thiết bị.' },
                   { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chuyên gia luôn đồng hành cùng sự phát triển của bạn.' }
                 ].map((benefit, i) => (
                   <div key={i} className="flex gap-5 group">
                      <div className="size-12 rounded-2xl bg-[#1173d4]/5 flex items-center justify-center text-[#1173d4] border border-[#1173d4]/10 group-hover:bg-[#1173d4] group-hover:text-white transition-all duration-500">
                         <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="font-bold text-white tracking-tight">{benefit.title}</h4>
                         <p className="text-xs text-slate-500 font-medium">{benefit.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-auto pt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="size-10 rounded-full border-4 border-[#101922] bg-slate-800" style={{backgroundImage: `url('https://i.pravatar.cc/100?img=${i+30}')`, backgroundSize: 'cover'}}></div>)}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+5.2k Shop đã tham gia</p>
           </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-10 lg:p-20 overflow-y-auto max-h-[90vh] custom-scrollbar">
           <div className="mb-12">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Trở thành Đối tác</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tạo tài khoản người bán chuyên nghiệp</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Họ và tên</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="Nguyễn Văn A"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Tên gian hàng</label>
                    <div className="relative">
                       <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="XeParts Store"
                         value={formData.shopName}
                         onChange={e => setFormData({...formData, shopName: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email doanh nghiệp</label>
                    <div className="relative">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="email" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="contact@cuahang.com"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Số điện thoại</label>
                    <div className="relative">
                       <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="tel" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="09xx xxx xxx"
                         value={formData.phoneNumber}
                         onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Địa chỉ kho hàng</label>
                    <div className="relative">
                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="Hà Nội, Việt Nam"
                         value={formData.address}
                         onChange={e => setFormData({...formData, address: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mật khẩu</label>
                    <div className="relative">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <input 
                         type="password" 
                         required
                         className="w-full bg-[#1A2129] border-2 border-slate-800 rounded-2xl p-4 pl-14 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all"
                         placeholder="••••••••"
                         value={formData.password}
                         onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                 <FileText className="text-[#1173d4] shrink-0" size={18} />
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Bằng cách nhấp vào "Xác nhận đăng ký", bạn đồng ý với <Link href="/terms" className="text-[#1173d4] font-bold">Điều khoản đối tác</Link> và <Link href="/privacy" className="text-[#1173d4] font-bold">Chính sách bảo mật</Link> của XeParts.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1173d4] hover:bg-blue-500 text-white p-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? 'Đang khởi tạo...' : 'Xác nhận đăng ký Đối tác'}
                <ArrowRight size={18} />
              </button>
           </form>

           <div className="mt-12 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Đã có tài khoản? <Link href="/seller/login" className="text-[#1173d4] hover:underline">Đăng nhập ngay</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
