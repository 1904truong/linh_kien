'use client';

import React, { useState, useEffect } from 'react';
import useUserStore from '@/store/useUserStore';
import { Car, Plus, Trash2, ShieldCheck, User as UserIcon, Settings, Package, Heart, History, Headphones, MapPin, Zap, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout, garage, addVehicle, removeVehicle, selectedVehicle, setSelectedVehicle } = useUserStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ brand: '', model: '', year: '' });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Redirect if not logged in
    const token = localStorage.getItem('token');
    if (!token && mounted) {
      router.push('/login');
    }
  }, [mounted, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    router.push('/login');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.year) return;
    addVehicle(newVehicle);
    setNewVehicle({ brand: '', model: '', year: '' });
    setShowAddForm(false);
  };

  const navItems = [
    { label: 'Hồ sơ cá nhân', icon: <UserIcon size={18} />, active: true },
    { label: 'Đơn hàng của tôi', icon: <Package size={18} />, href: '/orders' },
    { label: 'Gara của tôi', icon: <Car size={18} /> },
    { label: 'Địa chỉ nhận hàng', icon: <MapPin size={18} /> },
    { label: 'Sản phẩm yêu thích', icon: <Heart size={18} /> },
    { label: 'Lịch sử xem', icon: <History size={18} /> },
    { label: 'Trung tâm hỗ trợ', icon: <Headphones size={18} />, href: '/help' },
  ];

  if (!mounted || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold text-sm uppercase tracking-widest">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#1A2129] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1173d4] to-blue-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20 uppercase">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white dark:border-[#1A2129] rounded-full flex items-center justify-center text-white">
                       <ShieldCheck size={12} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Thành viên XeParts</p>
                  </div>
               </div>

               <div className="space-y-1">
                 {navItems.map((item, i) => (
                   <Link 
                    key={i} 
                    href={item.href || '#'}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-[#1173d4]/10 text-[#1173d4]' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                   >
                     <div className="flex items-center gap-3">
                       <span className={item.active ? 'text-[#1173d4]' : 'text-slate-400'}>{item.icon}</span>
                       <span className="text-xs font-bold">{item.label}</span>
                     </div>
                     <ChevronRight size={14} className={item.active ? 'opacity-100' : 'opacity-0'} />
                   </Link>
                 ))}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold text-xs"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Smart Garage Section */}
            <section className="bg-white dark:bg-[#1A2129] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Smart Garage</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Quản lý đội xe để nhận gợi ý linh kiện chính xác nhất</p>
                </div>
                
                <button 
                   onClick={() => setShowAddForm(!showAddForm)}
                   className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${showAddForm ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-[#1173d4] text-white shadow-[#1173d4]/20 hover:bg-[#1173d4]/90'}`}
                >
                  {showAddForm ? 'Hủy bỏ' : <><Plus size={16} /> Thêm xe mới</>}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddVehicle} className="mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-4 duration-300 relative z-10">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Hãng xe</label>
                     <input 
                       type="text" 
                       placeholder="Toyota, Ford..." 
                       className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all"
                       value={newVehicle.brand}
                       onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Dòng xe</label>
                     <input 
                       type="text" 
                       placeholder="Vios, Ranger..." 
                       className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all"
                       value={newVehicle.model}
                       onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Năm sản xuất</label>
                     <div className="flex gap-2">
                        <input 
                           type="number" 
                           placeholder="2024" 
                           className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all"
                           value={newVehicle.year}
                           onChange={e => setNewVehicle({...newVehicle, year: e.target.value})}
                        />
                        <button type="submit" className="bg-[#1173d4] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1173d4]/90 transition-all shadow-md shadow-[#1173d4]/20">
                           <Plus size={24} />
                        </button>
                     </div>
                  </div>
                </form>
              )}

              {garage.length === 0 ? (
                <div className="py-16 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
                    <Car size={32} />
                  </div>
                  <h4 className="font-bold text-sm">Gara của bạn đang trống</h4>
                  <p className="text-xs text-slate-400 mt-2 max-w-[280px]">Thêm thông tin xe để chúng tôi giúp bạn lọc linh kiện chính xác nhất.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                  {garage.map((v) => (
                    <div 
                      key={v.id} 
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedVehicle?.id === v.id ? 'border-[#1173d4] bg-[#1173d4]/5 dark:bg-[#1173d4]/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${selectedVehicle?.id === v.id ? 'bg-[#1173d4] text-white shadow-md shadow-[#1173d4]/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                           <Car size={24} />
                        </div>
                        <div>
                          <p className="font-bold leading-tight">{v.brand} {v.model}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Đời xe {v.year}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedVehicle?.id === v.id && (
                          <div className="w-2 h-2 rounded-full bg-[#1173d4] animate-pulse" />
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeVehicle(v.id); }}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Account Details Section */}
            <section className="bg-white dark:bg-[#1A2129] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold tracking-tight">Chi tiết tài khoản</h2>
                 <button className="text-[#1173d4] text-xs font-bold hover:underline">Chỉnh sửa</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 {[
                   { label: 'Họ và tên', value: user.name, icon: <UserIcon size={16} /> },
                   { label: 'Địa chỉ Email', value: user.email, icon: <div className="text-[10px] font-bold">@</div> },
                   { label: 'Số điện thoại', value: user.phone || 'Chưa cập nhật', icon: <Plus size={16} /> },
                   { label: 'Địa chỉ nhận hàng', value: user.address || 'Chưa cập nhật', icon: <MapPin size={16} /> },
                 ].map((field, idx) => (
                   <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50 transition-all hover:border-[#1173d4]/30">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#1173d4]">
                         {field.icon}
                      </div>
                      <div className="space-y-0.5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{field.label}</span>
                         <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{field.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Loyalty Program */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                 <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                    <Zap size={160} />
                 </div>
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 bg-[#1173d4] rounded-xl flex items-center justify-center shadow-lg shadow-[#1173d4]/30">
                       <Zap size={24} className="fill-white" />
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">Tích lũy linh kiện</h4>
                       <p className="text-xs text-slate-400">Bạn đang là thành viên <span className="text-[#1173d4] font-bold">MỚI</span></p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="text-center md:text-right">
                       <p className="text-3xl font-black text-[#1173d4] tracking-tighter">0 <span className="text-xs text-slate-400 uppercase font-bold ml-1">Points</span></p>
                    </div>
                    <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1173d4] hover:text-white transition-all">Đổi quà</button>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
