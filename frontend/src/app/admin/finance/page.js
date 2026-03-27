'use client';

import React from 'react';
import { 
  WalletCards, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Download, 
  Search, 
  CreditCard, 
  TrendingUp, 
  History,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function AdminFinance() {
  const transactions = [
    { id: '#TXN-9042', entity: 'Gara Quang Minh', type: 'Platform Fee', amount: '+4,520,000đ', date: 'Vừa xong', status: 'Completed' },
    { id: '#TXN-9038', entity: 'Auto Pro Store', type: 'Payout', amount: '-12,000,000đ', date: '10 phút trước', status: 'Pending' },
    { id: '#TXN-9025', entity: 'Toyo Parts', type: 'Platform Fee', amount: '+18,000đ', date: '1 giờ trước', status: 'Completed' },
    { id: '#TXN-9012', entity: 'Luxury Tuning', type: 'Withdrawal', amount: '-50,000,000đ', date: 'Hôm qua', status: 'Completed' },
  ];

  const financialStats = [
    { label: 'Tổng tiền Escrow', value: '4.8B', icon: WalletCards, color: 'text-[#1173d4]', bg: 'bg-[#1173d4]/10' },
    { label: 'Phí sàn thu (Tháng)', value: '124.5M', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Chờ thanh toán', value: '312.0M', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Tổng giao dịch', value: '12.4K', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Tài chính & Giao dịch</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Quản lý dòng diện sàn, phí giao dịch và khớp lệnh thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all">
            <PieChart size={16} />
            <span>Đối soát</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
            <Download size={16} />
            <span>Xuất báo cáo tài chính</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {financialStats.map((stat, i) => (
          <div key={i} className="bg-[#1A2632] p-6 rounded-[28px] border border-[#2d3d4d] shadow-xl hover:border-slate-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2d3d4d] flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
              <History className="text-[#1173d4]" size={20} />
              Lịch sử giao dịch
            </h4>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-[#101922] border border-[#2d3d4d] rounded-xl text-slate-400 hover:text-white">
                  <Filter size={16} />
               </button>
               <button className="p-2 bg-[#101922] border border-[#2d3d4d] rounded-xl text-slate-400 hover:text-white">
                  <Search size={16} />
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#101922]/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã GD</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Đơn vị / Đối tác</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại giao dịch</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Số tiền</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3d4d]">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-xs font-black text-slate-400 tracking-tighter">{txn.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary font-bold text-[10px]">
                           {txn.entity.charAt(0)}
                         </div>
                         <span className="text-xs font-black text-white group-hover:text-primary transition-colors">{txn.entity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                        txn.type === 'Platform Fee' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : txn.type === 'Payout' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-purple-400 border-purple-400/20 bg-purple-400/5'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-sm text-white">
                      {txn.amount}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className={`size-1.5 rounded-full ${txn.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
                        <span className={`text-[10px] font-black uppercase ${txn.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {txn.status === 'Completed' ? 'Thành công' : 'Chờ xử lý'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Summary Card */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600 to-[#1173d4] rounded-[32px] p-8 shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                 <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                       <DollarSign size={24} />
                    </div>
                    <button className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                       <ExternalLink size={16} />
                    </button>
                 </div>
                 <div>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Số dư sàn (Available)</p>
                    <h5 className="text-4xl font-black tracking-tighter">1,240,500,000đ</h5>
                 </div>
                 <button className="w-full py-4 bg-white text-[#1173d4] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all">
                    Thanh toán định kỳ (Auto-pay)
                 </button>
              </div>
           </div>

           <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Cảnh báo tài chính</h4>
              <div className="p-4 bg-amber-400/5 border border-amber-400/10 rounded-2xl flex gap-4">
                 <AlertTriangle className="text-amber-400 shrink-0" size={20} />
                 <div>
                    <p className="text-xs font-bold text-amber-200 mb-1">Dòng tiền rút tăng đột biến</p>
                    <p className="text-[10px] text-amber-400/60 font-medium">Hệ thống ghi nhận 15 yêu cầu rút tiền lớn trong 1 giờ.</p>
                 </div>
              </div>
              <button className="w-full py-3 bg-[#101922] border border-[#2d3d4d] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all rounded-xl">
                 Xem Nhật ký rủi ro
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}
