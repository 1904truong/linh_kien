'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Settings2, Bell, LogOut, Package, Tag, Info, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

import useNotificationStore from '@/store/useNotificationStore';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, logout } = useUserStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getNotiIcon = (type) => {
    switch(type) {
      case 'order': return <Package size={16} />;
      case 'promo': return <Tag size={16} />;
      default: return <Info size={16} />;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    useCartStore.getState().clearCart();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101922] border-b border-slate-800" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4" suppressHydrationWarning>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#1173d4] p-1.5 rounded-lg">
            <Settings2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">XeParts</h1>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full bg-[#1A2129] border-none rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#1173d4] focus:outline-none transition-all font-bold"
              placeholder="Tìm kiếm phụ tùng, mã OEM hoặc đời xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                }
              }}
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            {user?.role === 'admin' ? (
              <>
                <Link href="/admin" className="text-[#1173d4] flex items-center gap-2">
                  <ShieldCheck size={16} /> Kênh Quản trị
                </Link>
                <Link href="/admin/kyc" className="hover:text-[#1173d4] transition-colors">Duyệt KYC</Link>
                <Link href="/admin/inventory" className="hover:text-[#1173d4] transition-colors">Kho hàng</Link>
              </>
            ) : user?.role === 'seller' ? (
              <>
                <Link href="/seller" className="text-emerald-400 flex items-center gap-2">
                  <Package size={16} /> Kênh Người bán
                </Link>
                <Link href="/seller/products" className="hover:text-emerald-400 transition-colors">Sản phẩm của tôi</Link>
                <Link href="/seller/orders" className="hover:text-emerald-400 transition-colors">Đơn hàng mới</Link>
              </>
            ) : (
              <>
                <Link href="/search" className="hover:text-[#1173d4] transition-colors">Sản phẩm</Link>
                <Link href="/vin-search" className="hover:text-[#1173d4] transition-colors">Tra mã VIN</Link>
                <Link href="/orders" className="hover:text-[#1173d4] transition-colors">Đơn hàng</Link>
                <Link href="/promotions" className="hover:text-[#1173d4] transition-colors">Khuyến mãi</Link>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Link href="/cart" className="p-2.5 hover:bg-slate-800 rounded-full relative text-slate-300 hover:text-white transition-all">
                <ShoppingCart size={22} />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#1173d4] text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-full transition-all relative ${showNotifications ? 'bg-[#1173d4] text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
              >
                <Bell size={22} />
                {mounted && unreadCount > 0 && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-rose-500 border-2 border-[#101922] rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">{unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-96 bg-[#1A2129] border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => markAllAsRead()}
                        className="text-[8px] font-black uppercase tracking-widest text-[#1173d4] hover:underline"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center space-y-3">
                         <Bell size={32} className="text-slate-700 mx-auto opacity-20" />
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Không có thông báo mới</p>
                      </div>
                    ) : notifications.map((noti) => (
                      <div 
                        key={noti._id} 
                        onClick={() => { if(!noti.isRead) markAsRead(noti._id); }}
                        className={`p-5 border-b border-slate-800/50 hover:bg-white/[0.03] transition-colors cursor-pointer flex gap-4 ${!noti.isRead ? 'bg-[#1173d4]/5' : ''}`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 h-fit ${
                          noti.type === 'order' ? 'bg-[#1173d4]/10 text-[#1173d4]' : 
                          noti.type === 'promo' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {getNotiIcon(noti.type)}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{noti.title}</p>
                            <span className="text-[8px] font-bold text-slate-500">{getTimeAgo(noti.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">{noti.message}</p>
                          {!noti.isRead && <div className="w-1.5 h-1.5 bg-[#1173d4] rounded-full mt-2"></div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/orders" 
                    onClick={() => setShowNotifications(false)}
                    className="p-4 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors bg-white/[0.01]"
                  >
                    Xem tất cả đơn hàng
                  </Link>
                </div>
              )}
            </div>

            {mounted && user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link href="/profile" className="flex items-center gap-3 group">
                   <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none truncate max-w-[100px]">{user.name}</p>
                      <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${
                        user.role === 'admin' ? 'text-amber-400' : 
                        user.role === 'seller' ? 'text-emerald-400' : 'text-[#1173d4]'
                      }`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 
                         user.role === 'seller' ? 'Người bán' : 'Thành viên'}
                      </p>
                   </div>
                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1173d4] to-blue-400 flex items-center justify-center text-white font-black text-sm border-2 border-slate-800 group-hover:border-[#1173d4] transition-all uppercase">
                      {user.name?.charAt(0) || 'U'}
                   </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-[#1173d4] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1173d4]/90 transition-all shadow-lg shadow-[#1173d4]/20"
              >
                Đăng nhập
              </Link>
            )}
            
            <button className="md:hidden p-2 text-slate-300">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
