'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  PackageSearch, 
  WalletCards, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  UserPlus,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recentKYC, setRecentKYC] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, kycRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/recent-kyc')
        ]);
        
        if (statsRes.data.success) setStatsData(statsRes.data.data);
        if (kycRes.data.success) setRecentKYC(kycRes.data.data);
      } catch (error) {
        console.error('Admin Dashboard Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { label: 'Tổng người dùng', value: statsData?.totalUsers || '0', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Hồ sơ chờ duyệt', value: statsData?.pendingKYC || '0', change: '+5 hồ sơ', trend: 'up', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Sản phẩm mới', value: statsData?.newProducts || '0', change: '+24%', trend: 'up', icon: PackageSearch, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Doanh thu sàn', value: statsData?.totalRevenue || '0₫', change: '-3%', trend: 'down', icon: WalletCards, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1173d4]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700" suppressHydrationWarning>
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">Chào buổi sáng, Admin!</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Hệ thống đang vận hành ổn định • 0 lỗi nghiêm trọng</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-2">
            <Activity className="text-[#1173d4] animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live: 142 session</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1A2632] p-6 rounded-[28px] border border-[#2d3d4d] shadow-xl hover:border-[#1173d4]/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent KYC Requests */}
        <div className="lg:col-span-2 bg-[#1A2632] rounded-[32px] border border-[#2d3d4d] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#2d3d4d] flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
              <ShieldCheck className="text-[#1173d4]" size={20} />
              Yêu cầu KYC gần đây
            </h4>
            <Link href="/admin/kyc" className="text-[10px] font-bold text-[#1173d4] hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#101922]/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest"> Đối tác</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Loại</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3d4d]">
                {recentKYC.length > 0 ? recentKYC.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#101922] border border-[#2d3d4d] flex items-center justify-center text-primary font-black shadow-inner">
                          {req.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white group-hover:text-primary transition-colors">{req.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{req.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${
                        req.type === 'Supplier' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                      }`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${
                           req.status === 'Pending' ? 'bg-amber-400 animate-pulse' : req.status === 'Approved' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}></div>
                        <span className={`text-[10px] font-black uppercase ${
                           req.status === 'Pending' ? 'text-amber-400' : req.status === 'Approved' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>{req.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <Link href={`/admin/kyc?id=${req._id}`} className="p-2 bg-[#101922] hover:bg-primary/20 text-slate-400 hover:text-primary rounded-xl border border-[#2d3d4d] transition-all inline-block">
                          <ExternalLink size={14} />
                       </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-medium italic">Không có yêu cầu KYC mới.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[#1A2632] rounded-[32px] border border-[#2d3d4d] p-6 shadow-2xl space-y-6">
           <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
              <Activity className="text-[#1173d4]" size={20} />
              Sức khỏe hệ thống
           </h4>
           <div className="space-y-4">
              {[
                { label: 'API Gateway', status: 'Healthy', val: '99.9%', color: 'bg-emerald-400' },
                { label: 'Database Node 1', status: 'Steady', val: '8ms', color: 'bg-emerald-400' },
                { label: 'Cloud Storage', status: 'Normal', val: '1.2TB', color: 'bg-blue-400' },
                { label: 'Payment Webhook', status: 'Lagging', val: '120ms', color: 'bg-amber-400' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-black text-white">{item.val}</span>
                   </div>
                   <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} w-3/4 animate-pulse`}></div>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full py-3 bg-[#101922] hover:bg-slate-800 border border-[#2d3d4d] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">
              Báo cáo chi tiết kỹ thuật
           </button>
        </div>
      </div>
    </div>
  );
}
