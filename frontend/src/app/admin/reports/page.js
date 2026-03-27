'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, PieChart } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/kyc/reports/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Fetch reports error:', error);
        toast.error('Không thể tải dữ liệu báo cáo.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700" suppressHydrationWarning>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Báo cáo hệ thống</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1 uppercase">Phân tích dữ liệu kinh doanh và hiệu suất vận hành</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1173d4] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
          <Download size={18} />
          Xuất báo cáo tổng hợp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-8 shadow-2xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3 uppercase">
               <PieChart className="text-emerald-400" size={20} />
               Cơ cấu người dùng
            </h4>
            <div className="grid grid-cols-2 gap-4">
               {loading ? (
                 <div className="col-span-2 h-32 flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Đang tính toán...</div>
               ) : stats?.users.map((u, i) => (
                 <div key={i} className="bg-[#101922] p-6 rounded-3xl border border-[#2d3d4d] flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 truncate max-w-full">{u._id}</span>
                    <span className="text-2xl font-black text-white">{u.count}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-8 shadow-2xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3 uppercase">
               <TrendingUp className="text-blue-400" size={20} />
               Danh mục sản phẩm
            </h4>
            <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
               {loading ? (
                 <div className="h-32 flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Đang phân tích...</div>
               ) : stats?.categories.map((c, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                    <span className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[150px]">{c._id}</span>
                    <span className="text-xs font-black text-primary">{c.count} sản phẩm</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
