'use client';

import React, { useState } from 'react';
import { 
  User, 
  Store, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Save, 
  Upload, 
  X,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  MoreVertical,
  ChevronRight,
  Camera,
  Layers,
  FileText
} from 'lucide-react';
import useUserStore from '@/store/useUserStore';
import api from '@/lib/api';

export default function SellerSettings() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    shopDescription: user?.shopDescription || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || { street: '', city: '', state: '', zipCode: '' },
    returnPolicy: user?.returnPolicy || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/api/seller/profile', formData);
      setUser(response.data);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Cài đặt gian hàng</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Thiết lập nhận diện thương hiệu và vận hành chuyên nghiệp.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1173d4] hover:bg-[#1173d4]/90 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            <Save size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shop Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
               <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Store size={24} />
               </div>
               <h3 className="font-black uppercase tracking-[0.2em] text-sm">Hồ sơ gian hàng</h3>
            </div>
            <div className="p-10 space-y-8">
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group/avatar">
                    <div className="size-32 rounded-[40px] bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
                       {user?.shopLogo ? (
                         <img src={user.shopLogo} alt="Logo" className="w-full h-full object-cover" />
                       ) : (
                         <Store size={48} className="text-slate-300" />
                       )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-[#1173d4] text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-90 transition-transform flex items-center justify-center">
                       <Camera size={18} />
                    </button>
                  </div>
                  <div className="flex-1 space-y-6 w-full">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên gian hàng</label>
                        <input 
                          type="text" 
                          name="shopName"
                          value={formData.shopName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold placeholder:text-slate-400" 
                          placeholder="Nhập tên shop của bạn..." 
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                          <div className="relative group/input">
                            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within/input:text-[#1173d4] transition-colors"><Phone size={16} /></span>
                            <input 
                              type="tel" 
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-12 text-sm font-bold" 
                              placeholder="09xx..."
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email liên hệ</label>
                           <div className="relative group/input">
                             <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within/input:text-[#1173d4] transition-colors"><Mail size={16} /></span>
                             <input 
                              type="email" 
                              value={user?.email}
                              disabled
                              className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-12 text-sm font-bold text-slate-400 cursor-not-allowed opacity-60" 
                            />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả gian hàng</label>
                  <textarea 
                    name="shopDescription"
                    value={formData.shopDescription}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[24px] focus:ring-2 focus:ring-[#1173d4]/50 p-6 text-sm font-medium leading-relaxed min-h-[120px]" 
                    placeholder="Giới thiệu về kinh nghiệm, quy mô và cam kết với khách hàng..."
                  ></textarea>
               </div>
            </div>
          </div>

          {/* Logistics & Address */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
               <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <MapPin size={24} />
               </div>
               <h3 className="font-black uppercase tracking-[0.2em] text-sm">Vận chuyển & Kho hàng</h3>
            </div>
            <div className="p-10 space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ lấy hàng</label>
                  <input 
                    type="text" 
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold" 
                    placeholder="Số nhà, tên đường..." 
                  />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉnh/Thành phố</label>
                     <input 
                        type="text" 
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold" 
                      />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quận/Huyện</label>
                     <input 
                        type="text" 
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold" 
                      />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã ZIP (Nếu có)</label>
                     <input 
                        type="text" 
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold" 
                      />
                  </div>
               </div>
               <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Đối tác vận chuyển mặc định</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['GHTK', 'GHN', 'Viettel Post', 'J&T'].map((p, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${i === 0 ? 'border-[#1173d4] bg-blue-500/5 text-[#1173d4] font-black' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'} `}>
                         <span className="text-[10px] uppercase tracking-widest">{p}</span>
                         <div className="mt-2 size-4 rounded-full border-2 border-current flex items-center justify-center">
                            {i === 0 && <div className="size-2 bg-current rounded-full"></div>}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Verification Status */}
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute right-[-40px] top-[-40px] size-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="size-16 rounded-[24px] bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                 <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-2">Trạng thái xác thực</h4>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-6">Đã xác minh danh tính</p>
              <div className="space-y-4">
                 {[
                   { label: 'CCCD/Hộ chiếu', status: 'Approved' },
                   { label: 'Giấy phép KD', status: 'Approved' },
                   { label: 'Tài khoản bank', status: 'Verified' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
                     <span className="size-2 rounded-full bg-emerald-500"></span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Policies */}
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1173d4]">Quy định & Chính sách</h4>
                <FileText size={18} className="text-slate-400" />
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chính sách đổi trả</label>
                   <textarea 
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 p-4 text-[11px] font-medium leading-relaxed min-h-[100px]" 
                    placeholder="Ví dụ: Đổi trả trong 7 ngày nếu có lỗi kỹ thuật..."
                  ></textarea>
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <button className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 hover:bg-[#1173d4]/5 rounded-2xl transition-all group">
                     <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#1173d4]">Chính sách bảo mật</span>
                     <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
