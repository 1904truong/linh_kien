'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MessageSquare,
  ShieldAlert,
  Archive,
  Eye,
  ArrowUpDown,
  FileText,
  User,
  Store,
  ExternalLink,
  Loader2,
  Undo2
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionAction, setResolutionAction] = useState('full_refund');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/disputes', {
        params: { 
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm 
        }
      });
      setDisputes(response.data.disputes);
    } catch (error) {
      toast.error('Không thể tải danh sách tranh chấp');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      toast.error('Vui lòng nhập ghi chú giải quyết');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/admin/disputes/${selectedDispute._id}/resolve`, {
        action: resolutionAction,
        notes: resolutionNotes
      });
      toast.success('Đã giải quyết tranh chấp thành công');
      setIsResolveModalOpen(false);
      fetchDisputes();
      setSelectedDispute(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi giải quyết tranh chấp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'in_review': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const translateReason = (reason) => {
    const reasons = {
      'item_not_received': 'Chưa nhận được hàng',
      'damaged_item': 'Hàng bị hư hỏng',
      'wrong_item': 'Sai sản phẩm',
      'not_as_described': 'Không đúng mô tả',
      'other': 'Lý do khác'
    };
    return reasons[reason] || reason;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
             <AlertCircle size={28} className="text-[#1173d4]" />
             QUẢN LÝ TRANH CHẤP
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-10">Giải quyết khiếu nại giữa Người mua & Người bán</p>
        </div>

        <div className="flex items-center gap-3 bg-[#1A2632] p-1 rounded-2xl border border-slate-800">
           {['all', 'pending', 'resolved'].map((s) => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-[#1173d4] text-white shadow-lg' : 'text-slate-500 hover:text-white'
               }`}
             >
               {s === 'all' ? 'Tất cả' : s === 'pending' ? 'Đang chờ' : 'Đã xong'}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Table Area */}
      <div className="bg-[#1A2632] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/[0.01]">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo Mã đơn / Tên người dùng..." 
              className="w-full h-12 bg-[#101922] border border-slate-800 rounded-2xl pl-12 pr-4 text-xs font-bold text-white focus:ring-2 focus:ring-[#1173d4]/50 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDisputes()}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng tranh chấp</p>
              <p className="text-xl font-black text-white">{disputes.length}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
            <Loader2 className="animate-spin text-[#1173d4]" size={40} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đang tải dữ liệu...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6 opacity-30">
            <Archive size={60} strokeWidth={1} className="text-slate-600" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Không có tranh chấp nào cần xử lý</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-slate-800">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tranh chấp</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Các bên liên quan</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lý do khiếu nại</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr key={dispute._id} className="border-b border-slate-800/50 hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white group-hover:text-[#1173d4] transition-colors flex items-center gap-2">
                          #{dispute._id.slice(-8).toUpperCase()}
                          <Clock size={12} className="text-slate-600" />
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Đơn hàng: {dispute.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <User size={12} className="text-blue-400" />
                          <span className="text-[11px] font-bold text-white">{dispute.buyerId?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Store size={12} className="text-emerald-400" />
                          <span className="text-[11px] font-bold text-slate-400">{dispute.sellerId?.shopName || dispute.sellerId?.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-200">{translateReason(dispute.reason)}</p>
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-1 italic max-w-xs">"{dispute.description}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border fill-current ${getStatusStyle(dispute.status)}`}>
                        {dispute.status === 'pending' ? 'Chờ xử lý' : 
                         dispute.status === 'resolved' ? 'Đã giải quyết' : 'Đã bác bỏ'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedDispute(dispute)}
                        className="p-3 bg-[#1173d4]/10 text-[#1173d4] hover:bg-[#1173d4] hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Tỷ lệ giải quyết', value: '94%', icon: <CheckCircle2 className="text-emerald-500" /> },
           { label: 'TG xử lý TB', value: '14 Giờ', icon: <Clock className="text-blue-400" /> },
           { label: 'Hoàn tiền tích lũy', value: '45.2M ₫', icon: <ShieldAlert className="text-amber-500" /> }
         ].map((stat) => (
           <div key={stat.label} className="bg-[#1A2632] p-6 rounded-[24px] border border-slate-800 flex items-center justify-between shadow-xl">
             <div className="space-y-1">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
               <p className="text-2xl font-black text-white">{stat.value}</p>
             </div>
             <div className="p-3 bg-white/[0.03] rounded-2xl">
               {stat.icon}
             </div>
           </div>
         ))}
      </div>

      {/* Detail Overlay / Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
           <div className="w-full max-w-xl h-full bg-[#1A2632] rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border-l border-slate-800 animate-in slide-in-from-right duration-500">
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-black text-white tracking-tight uppercase">Chi tiết khiếu nại</h2>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mã: #{selectedDispute._id}</p>
                </div>
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <Undo2 size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#101922] p-6 rounded-3xl border border-slate-800 space-y-3">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ngày tạo</p>
                       <p className="text-xs font-bold text-white leading-none">{new Date(selectedDispute.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="bg-[#101922] p-6 rounded-3xl border border-slate-800 space-y-3">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Loại tranh chấp</p>
                       <p className="text-xs font-bold text-blue-400 uppercase leading-none">{translateReason(selectedDispute.reason)}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nội dung khiếu nại</h3>
                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 italic text-sm text-slate-300 leading-relaxed font-medium">
                       "{selectedDispute.description}"
                    </div>
                 </div>

                 {selectedDispute.evidence?.length > 0 && (
                   <div className="space-y-4">
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Bằng chứng hình ảnh</h3>
                     <div className="grid grid-cols-2 gap-4">
                        {selectedDispute.evidence.map((img, i) => (
                           <img key={i} src={img} className="w-full aspect-video object-cover rounded-2xl border border-slate-800 hover:scale-105 transition-transform" />
                        ))}
                     </div>
                   </div>
                 )}

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Lịch sử giao dịch</h3>
                    <div className="bg-[#101922] p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="size-12 bg-[#1173d4]/10 rounded-2xl flex items-center justify-center text-[#1173d4]">
                             <FileText size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white uppercase tracking-tight">Đơn hàng {selectedDispute.orderId?._id?.slice(-8).toUpperCase()}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedDispute.orderId?.totalPrice?.toLocaleString()} ₫ • {selectedDispute.orderId?.paymentMethod?.toUpperCase()}</p>
                          </div>
                       </div>
                       <button className="p-3 hover:bg-[#1173d4]/10 text-[#1173d4] rounded-xl transition-all">
                          <ExternalLink size={18} />
                       </button>
                    </div>
                 </div>

                 {selectedDispute.status === 'resolved' && (
                   <div className="space-y-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                      <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                         <CheckCircle2 size={14} /> Đã giải quyết
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">Hướng xử lý: <span className="text-white font-bold">{selectedDispute.resolution?.action}</span></p>
                      <p className="text-xs text-slate-400 font-medium italic">"{selectedDispute.resolution?.notes}"</p>
                   </div>
                 )}
              </div>

              {/* Modal Footer / Action Bar */}
              {selectedDispute.status === 'pending' && (
                <div className="p-8 bg-[#151D26] border-t border-slate-800 flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setResolutionAction('rejected');
                      setIsResolveModalOpen(true);
                    }}
                    className="flex-1 h-14 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Bác bỏ khiếu nại
                  </button>
                  <button 
                    onClick={() => {
                      setResolutionAction('full_refund');
                      setIsResolveModalOpen(true);
                    }}
                    className="flex-1 h-14 bg-[#1173d4] text-white hover:bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    Chấp nhận & Giải quyết
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Resolution Confirmation Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-[#1A2632] border border-slate-800 rounded-[40px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-3">
                 <div className={`size-16 mx-auto rounded-3xl flex items-center justify-center ${resolutionAction === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {resolutionAction === 'rejected' ? <XCircle size={32} /> : <CheckCircle2 size={32} />}
                 </div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">Xác nhận xử lý</h2>
                 <p className="text-xs text-slate-500 font-medium">Bạn đang thực hiện thao tác <span className={resolutionAction === 'rejected' ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{resolutionAction === 'rejected' ? 'BÁC BỎ' : 'CHẤP NHẬN'}</span> tranh chấp này.</p>
              </div>

              <div className="space-y-6">
                 {resolutionAction !== 'rejected' && (
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Hình thức giải quyết</label>
                      <select 
                        value={resolutionAction}
                        onChange={(e) => setResolutionAction(e.target.value)}
                        className="w-full h-14 bg-[#101922] border border-slate-800 rounded-2xl px-5 text-xs font-bold text-white focus:ring-2 focus:ring-[#1173d4]/50 outline-none transition-all appearance-none"
                      >
                         <option value="full_refund">Hoàn tiền 100%</option>
                         <option value="partial_refund">Hoàn tiền một phần</option>
                         <option value="replacement">Đổi trả sản phẩm</option>
                      </select>
                   </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Ghi chú giải quyết (Gửi cho các bên)</label>
                    <textarea 
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full h-32 bg-[#101922] border border-slate-800 rounded-2xl p-5 text-xs font-medium text-white focus:ring-2 focus:ring-[#1173d4]/50 outline-none transition-all placeholder:text-slate-600 resize-none"
                      placeholder="Nhập lý do cụ thể và hướng dẫn..."
                      required
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => setIsResolveModalOpen(false)}
                   className="flex-1 h-14 border border-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-800 transition-all"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={handleResolve}
                   disabled={isSubmitting}
                   className={`flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
                     resolutionAction === 'rejected' 
                      ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                   }`}
                 >
                   {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Xác nhận ngay'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
