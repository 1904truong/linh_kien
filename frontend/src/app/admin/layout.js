'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  ChevronRight,
  Menu,
  X,
  ShieldHalf,
  PackageSearch,
  WalletCards,
  MessageSquare,
  AlertCircle,
  Database
} from 'lucide-react';
import useUserStore from '@/store/useUserStore';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (mounted && pathname !== '/admin/login') {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, router, mounted, pathname]);

  if (!mounted) return null;

  // Render minimal layout for login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#0A0F14]" suppressHydrationWarning>{children}</div>;
  }

  const menuItems = [
    { title: 'Bảng điều khiển', icon: LayoutDashboard, href: '/admin', section: 'Chính' },
    { title: 'Duyệt hồ sơ KYC', icon: ShieldCheck, href: '/admin/kyc', section: 'Chính' },
    { title: 'Duyệt sản phẩm', icon: PackageSearch, href: '/admin/products', section: 'Chính' },
    { title: 'Quản lý tồn kho', icon: Database, href: '/admin/inventory', section: 'Chính' },
    { title: 'Quản lý người dùng', icon: Users, href: '/admin/users', section: 'Chính' },
    { title: 'Tranh chấp & Khiếu nại', icon: AlertCircle, href: '/admin/disputes', section: 'Chính' },
    { title: 'Tài chính & Đối soát', icon: WalletCards, href: '/admin/finance', section: 'Tài chính' },
    { title: 'Báo cáo hệ thống', icon: BarChart3, href: '/admin/reports', section: 'Tài chính' },
    { title: 'Cấu hình Master Data', icon: Database, href: '/admin/master-data', section: 'Hệ thống' },
    { title: 'Cài đặt hệ thống', icon: Settings, href: '/admin/settings', section: 'Hệ thống' },
    { title: 'Phân quyền Admin', icon: ShieldHalf, href: '/admin/permissions', section: 'Hệ thống' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const activeItem = menuItems.find(item => item.href === pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#101922] text-slate-100 font-sans selection:bg-[#1173d4] selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-[#1A2632] border-r border-[#2d3d4d] flex flex-col shrink-0 transition-all duration-300 z-50
      `}>
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-[#2d3d4d]/50">
          <div className="size-10 bg-[#1173d4] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
            <ShieldAlert size={24} strokeWidth={2.5} />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <h1 className="text-sm font-black uppercase tracking-widest text-white">Admin <span className="text-[#1173d4]">Portal</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Hệ thống quản trị</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
          {['Chính', 'Tài chính', 'Hệ thống'].map((section) => (
            <div key={section} className="space-y-1">
              {isSidebarOpen && (
                <div className="px-4 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {section}
                </div>
              )}
              {menuItems.filter(i => i.section === section).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-[#1173d4] text-white font-bold shadow-lg shadow-blue-500/20' 
                        : 'text-slate-400 hover:bg-[#1173d4]/10 hover:text-[#1173d4]'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-[#1173d4] transition-colors'} />
                    {isSidebarOpen && <span className="text-sm truncate">{item.title}</span>}
                    {isActive && isSidebarOpen && (
                      <div className="absolute right-2 size-1.5 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#2d3d4d]/50 bg-[#151D26]">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all font-bold text-sm
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#101922]">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#1A2632] border-b border-[#2d3d4d] shrink-0 z-30 shadow-sm">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 mr-2 rounded-lg hover:bg-slate-700/50 text-slate-400 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hidden md:block">Hệ thống</span>
            <ChevronRight size={14} className="text-slate-600 hidden md:block" />
            <span className="text-[#1173d4] text-xs font-black uppercase tracking-widest">
              {activeItem?.title || 'Bảng điều khiển'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-[#101922] border border-[#2d3d4d] text-slate-200 text-[11px] font-bold rounded-xl pl-10 pr-4 py-2 w-64 focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="flex items-center gap-2 pr-4 border-r border-[#2d3d4d]">
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#101922] border border-[#2d3d4d] text-slate-400 hover:text-white transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-rose-500 rounded-full ring-2 ring-[#1A2632]"></span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#101922] border border-[#2d3d4d] text-slate-400 hover:text-white transition-all">
                <Moon size={18} />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white leading-none mb-1">{user?.name || 'Admin Nguyễn'}</p>
                <p className="text-[10px] text-[#1173d4] font-black uppercase tracking-widest">Quản trị viên cấp cao</p>
              </div>
              <div className="size-10 rounded-xl bg-[#1173d4]/20 border-2 border-[#1173d4] overflow-hidden shadow-lg shadow-blue-500/10">
                <img 
                  className="w-full h-full object-cover" 
                  src={user?.avatar || "https://i.pravatar.cc/100?img=12"} 
                  alt="Avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d3d4d;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1173d4;
        }
      `}</style>
    </div>
  );
}
