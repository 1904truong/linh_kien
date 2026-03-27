'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus,
  Truck,
  BarChart3,
  Store,
  MessageSquare,
  ShoppingBag,
  ChevronDown,
  PackagePlus,
  FilePlus,
  Download,
  Activity,
  Users
} from 'lucide-react';
import useUserStore from '@/store/useUserStore';

export default function SellerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && pathname !== '/seller/login') {
      if (!user) {
        router.push('/seller/login');
      } else if (user.role !== 'seller' && user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, router, mounted, pathname]);

  if (!mounted) return null;

  // Render minimal layout for login page
  if (pathname === '/seller/login') {
    return <div className="min-h-screen bg-[#0A0F14]" suppressHydrationWarning>{children}</div>;
  }

  const menuItems = [
    { title: 'Bảng điều khiển', icon: LayoutDashboard, href: '/seller' },
    { title: 'Sản phẩm', icon: Package, href: '/seller/products' },
    { title: 'Đăng sản phẩm', icon: Plus, href: '/seller/products/new' },
    { title: 'Khách hàng', icon: Users, href: '/seller/customers' },
    { title: 'Nguồn hàng', icon: Truck, href: '/seller/sourcing' },
    { title: 'Đơn hàng', icon: ShoppingCart, href: '/seller/orders', badge: 12 },
    { title: 'Doanh thu', icon: BarChart3, href: '/seller/reports' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0A0F14] text-slate-900 dark:text-slate-100 font-sans" suppressHydrationWarning>
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-50 dark:bg-[#101922] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#1173d4] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Store size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#1173d4]">XeParts Pro</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-tighter">Vận hành chuyên nghiệp</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#1173d4]/10 text-[#1173d4] font-bold border-l-4 border-[#1173d4]' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#1173d4]' : 'group-hover:text-slate-900 dark:group-hover:text-white'} />
                <span className="text-sm">{item.title}</span>
                {item.badge && (
                  <span className="absolute right-4 bg-[#1173d4] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800">
              {user?.shopLogo ? (
                <img src={user.shopLogo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate leading-tight">{user?.shopName || user?.name || 'Đối tác'}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase truncate tracking-tighter">Nhân viên bán hàng</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors group"
            >
              <LogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#0A0F14]">
        {/* High-Fidelity Professional Header */}
        <header className="h-[72px] flex items-center justify-between px-6 bg-white border-b border-slate-100 shrink-0 z-30 shadow-sm transition-all duration-300">
          
          {/* Left Zone: Context & Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <nav className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                <Link href="/seller" className="hover:text-[#1173d4] transition-colors">Dashboard</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-bold">Seller</span>
              </nav>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-extrabold text-[#1F2937] tracking-tight">
                  {menuItems.find(i => i.href === pathname)?.title || 'Bảng điều khiển'}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="size-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Shop đang hoạt động</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Zone: Actions & Profile */}
          <div className="flex items-center gap-5">
            
            {/* Minimal Search Bar */}
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1173d4] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-64 h-10 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-12 text-xs font-medium text-[#1F2937] focus:ring-4 focus:ring-[#1173d4]/5 focus:border-[#1173d4] focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm opacity-60 pointer-events-none group-focus-within:opacity-0 transition-opacity">
                 <span className="text-[9px] font-bold text-slate-400">K</span>
              </div>
            </div>

            {/* Icon Cluster */}
            <div className="flex items-center gap-1 border-r border-slate-100 pr-4">
              <button className="size-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#1173d4] hover:bg-slate-50 transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#1173d4] hover:bg-slate-50 transition-all relative">
                <MessageSquare size={18} />
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-[#1173d4] rounded-full ring-2 ring-white"></span>
              </button>
            </div>

            {/* Primary Action Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1173d4] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10 active:scale-95">
                <Plus size={16} strokeWidth={2.5} />
                <span>Tạo mới</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 group-hover:visible transition-all duration-200 z-50 p-1.5">
                 <Link href="/seller/products/new" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors">
                    <PackagePlus size={16} className="text-[#1173d4]" /> Đăng sản phẩm
                 </Link>
                 <Link href="/seller/orders/new" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors">
                    <FilePlus size={16} className="text-emerald-500" /> Tạo đơn hàng
                 </Link>
              </div>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 transition-all">
                <div className="size-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#1173d4] font-bold text-xs overflow-hidden">
                  {user?.shopLogo ? <img src={user.shopLogo} className="w-full h-full object-cover" alt="S" /> : (user?.name?.charAt(0) || 'S')}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                   <span className="text-xs font-bold text-[#1F2937] leading-none mb-0.5">{user?.shopName || user?.name || 'Admin'}</span>
                   <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Nhân viên bán hàng</span>
                </div>
                <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
              
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 group-hover:visible transition-all duration-200 z-50 p-1.5">
                 <Link href="/seller/settings" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors">
                    <Settings size={16} className="text-slate-400" /> Cấu hình
                 </Link>
                 <div className="h-px bg-slate-50 my-1"></div>
                 <button onClick={handleLogout} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-rose-50 text-[11px] font-semibold text-rose-500 transition-colors text-left">
                    <LogOut size={16} /> Đăng xuất
                 </button>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
