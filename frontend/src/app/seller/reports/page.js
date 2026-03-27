'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Package,
  Layers
} from 'lucide-react';
import api from '@/lib/api';

export default function SellerReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/seller/reports');
        if (response.data.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Fetch Reports Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Wallet': return Wallet;
      case 'TrendingUp': return TrendingUp;
      case 'BarChart3': return BarChart3;
      case 'TrendingDown': return TrendingDown;
      default: return BarChart3;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1173d4]"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Báo cáo doanh thu</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Phân tích hiệu suất kinh doanh và dòng tiền chi tiết.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-xs font-bold">30 ngày qua</span>
            <ChevronRight size={14} className="text-slate-400 rotate-90" />
          </div>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#1173d4] hover:dark:bg-[#1173d4] dark:hover:text-white transition-all shadow-lg active:scale-95">
            <Download size={16} /> Xuất file EXCEL
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.summary.map((card, i) => {
          const Icon = getIcon(card.icon);
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${card.color}-500/10 text-${card.color}-500 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{card.title}</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight">
                {card.title.includes('Tỷ lệ') ? `${card.value}%` : `${card.value.toLocaleString('vi-VN')}₫`}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className="text-xl font-black tracking-tight">Biểu đồ doanh thu</h4>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter mt-1">Phân bổ doanh thu theo thời gian</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-[#1173d4]"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ngày</span>
               </div>
            </div>
          </div>
          <div className="h-72 w-full flex items-end justify-between gap-2 px-4 relative">
             <div className="absolute inset-0 flex flex-col justify-between py-10 opacity-10 pointer-events-none">
               {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-slate-500"></div>)}
             </div>
             {data.growth.map((point, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                 <div 
                   className="w-full bg-[#1173d4]/10 rounded-t-xl group-hover/bar:bg-[#1173d4] transition-all duration-500 relative" 
                   style={{height: `${Math.max(10, (point.revenue / Math.max(...data.growth.map(p => p.revenue))) * 100)}%`}}
                   title={`${point.revenue.toLocaleString()}₫`}
                 ></div>
                 <span className="text-[8px] font-black text-slate-400">{point._id}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h4 className="text-xl font-black tracking-tight mb-2">Cơ cấu danh mục</h4>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter mb-8">Tỷ trọng doanh thu theo ngành hàng</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative py-10">
             <div className="size-48 rounded-full border-[20px] border-[#1173d4] relative flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">100%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tổng quan</p>
                </div>
             </div>
          </div>

          <div className="space-y-4 pt-6">
            {data.categories.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-[#1173d4]" style={{opacity: 1 - (i * 0.2)}}></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black tracking-tight block">{item.revenue.toLocaleString()}₫</span>
                  <span className="text-[8px] font-bold text-slate-400">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight">Sản phẩm hiệu quả nhất</h4>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Top performing products by revenue</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/20 dark:bg-slate-800/10">
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-8 py-5 text-center">Đã bán</th>
                <th className="px-8 py-5 text-right">Doanh thu</th>
                <th className="px-8 py-5 text-right">Lợi nhuận (Ước tính)</th>
                <th className="px-8 py-5 text-center">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.topProducts.map((p, i) => (
                <tr key={i} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#1173d4] transition-colors">{p.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-bold">{p.sold}</td>
                  <td className="px-8 py-6 text-right font-black tracking-tight">{p.revenue.toLocaleString()}₫</td>
                  <td className="px-8 py-6 text-right font-black text-emerald-500 tracking-tight">{p.profit.toLocaleString()}₫</td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center justify-center size-8 rounded-full ${p.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {p.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
