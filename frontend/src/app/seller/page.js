'use client';

import React, { useEffect } from 'react';
import { 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Settings,
  Droplets,
  Disc,
  Package,
  ShieldCheck
} from 'lucide-react';
import useSellerStore from '@/store/useSellerStore';
import Link from 'next/link';

export default function SellerDashboard() {
  const { stats, fetchStats, loading } = useSellerStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { 
      title: 'Đơn hàng mới hôm nay', 
      value: stats.totalOrdersToday || 0, 
      trend: '+15%', 
      icon: ShoppingBag, 
      color: 'blue',
      growth: true 
    },
    { 
      title: 'Cảnh báo hết hàng', 
      value: stats.lowStockProducts || 0, 
      trend: stats.lowStockProducts > 5 ? 'Nguy cấp' : 'Bình thường', 
      icon: AlertTriangle, 
      color: 'orange',
      warning: stats.lowStockProducts > 0
    },
    { 
      title: 'Sản phẩm chờ duyệt', 
      value: stats.pendingProducts || 0, 
      trend: 'Chờ duyệt', 
      icon: CheckCircle2, 
      color: 'purple' 
    },
    { 
      title: 'Doanh thu hôm nay', 
      value: `${((stats.revenueToday || 0) / 1000).toFixed(0)}Kđ`, 
      trend: '+8.2%', 
      icon: Wallet, 
      color: 'emerald',
      growth: true 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Verification Notice */}
      {!stats.isApproved && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="text-amber-500 font-black text-sm uppercase tracking-widest">Tài khoản chưa được xác thực</h4>
              <p className="text-amber-500/70 text-xs font-semibold mt-1">Vui lòng hoàn thiện hồ sơ KYC để kích hoạt gian hàng và bắt đầu bán hàng.</p>
            </div>
          </div>
          <Link href="/seller/kyc" className="px-8 py-3 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95">
            Xác thực ngay
          </Link>
        </div>
      )}

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              {stat.growth ? (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp size={12} /> {stat.trend}
                </span>
              ) : stat.warning ? (
                <span className="text-xs font-bold text-red-500 flex items-center gap-0.5">
                  <AlertTriangle size={12} />
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500">{stat.trend}</span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-black mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Visual Mockup */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold">Thống kê doanh thu</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Phân tích dòng tiền 7 ngày gần nhất</p>
            </div>
            <select className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold rounded-lg focus:ring-0 px-4 py-2">
              <option>Theo tuần</option>
              <option>Theo tháng</option>
            </select>
          </div>
          <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
            {stats.weeklyRevenue && stats.weeklyRevenue.length > 0 ? (
              stats.weeklyRevenue.map((day, i) => {
                const maxRevenue = Math.max(...stats.weeklyRevenue.map(d => d.revenue), 1);
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                       <div 
                         className="w-full bg-[#1173d4]/20 group-hover:bg-[#1173d4] rounded-t-lg transition-all duration-300 relative" 
                         style={{ height: `${Math.max(height, 5)}%` }}
                       >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {day.revenue.toLocaleString()}₫
                         </div>
                       </div>
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full text-center">
                      {day._id.split('-').slice(1).join('/')}
                    </span>
                  </div>
                );
              })
            ) : (
              [40, 65, 55, 85, 45, 95, 30].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div 
                    className="w-full bg-[#1173d4]/10 rounded-t-lg transition-all duration-300" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day {i + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Alerts & Activity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Phê duyệt chờ xử lý</h4>
            <div className="space-y-4">
              {[
                { name: 'Cụm đèn pha LED BMW', from: 'AutoPart Express', icon: Settings },
                { name: 'Dầu nhớt Castrol 4L', from: 'Global Lubricants', icon: Droplets },
                { name: 'Lốp Michelin Pilot', from: 'Michelin VN', icon: Disc }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate leading-tight">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Từ: {item.from}</p>
                  </div>
                  <button className="text-[#1173d4] hover:underline text-xs font-bold">Xem</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-center text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Xem tất cả phê duyệt
            </button>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={20} className="text-red-500" />
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Sắp hết hàng</h4>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400/80 mb-4">Có 5 sản phẩm đang dưới mức tồn kho tối thiểu. Vui lòng nhập hàng ngay.</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i+20}')`, backgroundSize: 'cover' }}></div>
              ))}
              <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">+2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h4 className="text-xl font-black tracking-tight">Đơn hàng mới nhất</h4>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter mt-1">Quản lý giao dịch thời gian thực</p>
          </div>
          <Link href="/seller/orders" className="bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest hover:text-[#1173d4] hover:border-[#1173d4] transition-all shadow-sm">
            Quản lý tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30 dark:bg-slate-800/20">
                <th className="px-8 py-5">Mã đơn hàng</th>
                <th className="px-8 py-5">Khách hàng</th>
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-8 py-5 text-right">Tổng tiền</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order, i) => {
                  const statusMap = {
                    'pending': { label: 'Chờ xác nhận', color: 'orange' },
                    'processing': { label: 'Đang xử lý', color: 'blue' },
                    'shipped': { label: 'Đang giao', color: 'purple' },
                    'delivered': { label: 'Hoàn thành', color: 'emerald' },
                    'cancelled': { label: 'Đã hủy', color: 'rose' }
                  };
                  const statusInfo = statusMap[order.status] || { label: order.status, color: 'slate' };
                  
                  return (
                    <tr key={i} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                      <td className="px-8 py-6 font-black text-[#1173d4] tracking-tight">#{order.orderCode}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{order.buyerName}</span>
                          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-1">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-600 dark:text-slate-400 font-medium">
                        {order.items?.length || 0} sản phẩm
                      </td>
                      <td className="px-8 py-6 font-black text-right tracking-tight">
                        {order.totalPrice?.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`bg-${statusInfo.color}-500/10 text-${statusInfo.color}-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-${statusInfo.color}-500/20 uppercase tracking-widest`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/seller/orders?search=${order._id}`} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors inline-block">
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-400 font-medium italic">
                    Chưa có đơn hàng nào gần đây.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
