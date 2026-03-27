'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  RotateCw, 
  Clock,
  UserX,
  Eye,
  CheckCircle2,
  XCircle,
  History,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  UserCircle,
  Building2,
  Landmark,
  FileText
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function KYCManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const fetchKYCRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/kyc/pending', {
        params: {
          page: pagination.page,
          search: searchTerm,
          role: role || undefined
        }
      });
      if (response.data.success) {
        setRequests(response.data.data.requests);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch KYC Error:', error);
      toast.error('Không thể tải danh sách KYC.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCRequests();
  }, [searchTerm, role, pagination.page]);

  const handleApprove = async (userId) => {
    try {
      const response = await api.patch(`/admin/kyc/${userId}/approve`);
      if (response.data.success) {
        toast.success('Đã duyệt hồ sơ KYC thành công!');
        setSelectedRequest(null);
        fetchKYCRequests();
      }
    } catch (error) {
      toast.error('Duyệt hồ sơ thất bại.');
    }
  };

  const handleReject = async (userId) => {
    if (!rejectReason) {
      toast.error('Vui lòng nhập lý do từ chối.');
      return;
    }
    try {
      const response = await api.patch(`/admin/kyc/${userId}/reject`, { reason: rejectReason });
      if (response.data.success) {
        toast.success('Đã từ chối hồ sơ KYC.');
        setShowRejectForm(false);
        setRejectReason('');
        setSelectedRequest(null);
        fetchKYCRequests();
      }
    } catch (error) {
      toast.error('Gửi yêu cầu thất bại.');
    }
  };

  const stats = [
    { label: 'Chờ xử lý', value: pagination.total, icon: RotateCw, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Đã duyệt (Tháng)', value: '1,240', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Từ chối (Tháng)', value: '42', icon: UserX, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Phê duyệt hồ sơ (KYC)</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1 uppercase">Quản lý và phê duyệt danh tính Người bán & Nhà cung cấp</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all">
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </button>
          <button 
            onClick={fetchKYCRequests}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1173d4] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
            <RotateCw size={16} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1A2632] p-6 rounded-[28px] border border-[#2d3d4d] flex items-center gap-5 group hover:border-slate-500 transition-all shadow-xl">
            <div className={`size-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 uppercase">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value} hồ sơ</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Card */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Tìm kiếm</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tên, Email..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPagination({ ...pagination, page: 1 }); }}
                className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Loại đối tác</label>
            <select 
              value={role}
              onChange={(e) => { setRole(e.target.value); setPagination({ ...pagination, page: 1 }); }}
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
              <option value="">Tất cả loại</option>
              <option value="seller">Người bán (Seller)</option>
              <option value="supplier">Nhà cung cấp (Supplier)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Trạng thái</label>
            <select className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-slate-500">
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Ngày đăng ký</label>
            <input 
              type="date" 
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:[color-scheme:dark]" 
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#101922]/50 border-b border-[#2d3d4d]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã hồ sơ</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên đơn vị</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày đăng ký</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3d4d]">
              {loading ? (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1173d4]"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] uppercase">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : requests.length > 0 ? requests.map((req) => (
                <tr key={req._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase truncate max-w-[100px]">{req._id}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-[#101922] border border-[#2d3d4d] flex items-center justify-center text-primary font-black shadow-inner">
                        {req.name?.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{req.name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter uppercase">{req.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border capitalize ${
                      req.role === 'supplier' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                    }`}>
                      {req.role === 'supplier' ? 'Nhà cung cấp' : 'Người bán'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase bg-amber-400/10 text-amber-400`}>
                      <span className={`size-1.5 rounded-full bg-amber-400 animate-pulse`}></span>
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => setSelectedRequest(req)}
                         className="p-2 bg-[#101922] hover:bg-primary/20 text-slate-500 hover:text-primary rounded-xl border border-[#2d3d4d] transition-all" title="Xem chi tiết">
                          <Eye size={16} />
                       </button>
                       <button 
                         onClick={() => handleApprove(req._id)}
                         className="p-2 bg-[#101922] hover:bg-emerald-400/20 text-slate-500 hover:text-emerald-400 rounded-xl border border-[#2d3d4d] transition-all" title="Phê duyệt">
                          <CheckCircle2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="6" className="px-8 py-20 text-center text-slate-500 font-medium italic uppercase tracking-widest text-[10px] font-black">
                    Không có hồ sơ nào đang chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Wrapper */}
        <div className="px-8 py-6 bg-[#1A2632]/50 border-t border-[#2d3d4d] flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest uppercase">Trang {pagination.page} / {pagination.pages}</p>
          <div className="flex items-center gap-4">
             <button 
               disabled={pagination.page === 1}
               onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
               className="flex items-center gap-1 px-4 py-2 bg-[#101922] border border-[#2d3d4d] text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-30">
                <ChevronLeft size={16} /> Trước
             </button>
             <button 
               disabled={pagination.page === pagination.pages}
               onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
               className="flex items-center gap-1 px-4 py-2 bg-[#101922] border border-[#2d3d4d] text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-30">
                Sau <ChevronRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-[#1A2632] border border-[#2d3d4d] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl flex flex-col custom-scrollbar">
              <div className="p-8 border-b border-[#2d3d4d] flex items-center justify-between sticky top-0 bg-[#1A2632] z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                       <UserCircle size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">{selectedRequest.name}</h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedRequest.role === 'seller' ? 'Người bán' : 'Nhà cung cấp'}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white/10 text-slate-500 hover:text-white rounded-xl transition-all">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-8 space-y-10">
                 {/* ID Documents */}
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 uppercase">
                       <FileText size={16} className="text-primary" /> Hồ sơ định danh
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 uppercase">Mặt trước CCCD</p>
                          <div className="aspect-video rounded-3xl bg-[#101922] border border-[#2d3d4d] overflow-hidden">
                             {selectedRequest.kycDetails?.idCardFront ? (
                               <img src={selectedRequest.kycDetails.idCardFront} className="w-full h-full object-cover" alt="Front" />
                             ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 italic text-[10px] uppercase font-black">Chưa cung cấp</div>
                             )}
                          </div>
                       </div>
                       <div className="space-y-3">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 uppercase">Mặt sau CCCD</p>
                          <div className="aspect-video rounded-3xl bg-[#101922] border border-[#2d3d4d] overflow-hidden">
                             {selectedRequest.kycDetails?.idCardBack ? (
                               <img src={selectedRequest.kycDetails.idCardBack} className="w-full h-full object-cover" alt="Back" />
                             ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 italic text-[10px] uppercase font-black">Chưa cung cấp</div>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d] flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest uppercase">Số CCCD</span>
                       <span className="text-sm font-black text-white">{selectedRequest.kycDetails?.idCardNumber || 'Chưa cung cấp'}</span>
                    </div>
                 </div>

                 {/* Business License */}
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 uppercase">
                       <Building2 size={16} className="text-emerald-400" /> Thông tin doanh nghiệp
                    </h4>
                    <div className="space-y-4">
                       <div className="p-6 bg-[#101922] rounded-3xl border border-[#2d3d4d] flex items-center justify-center">
                          {selectedRequest.kycDetails?.businessLicense ? (
                            <img src={selectedRequest.kycDetails.businessLicense} className="max-w-full max-h-96 object-contain rounded-xl" alt="License" />
                          ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-700 italic text-[10px] uppercase font-black">Giấy phép kinh doanh chưa được tải lên</div>
                          )}
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 uppercase">Mã số thuế</p>
                             <p className="text-xs font-black text-white">{selectedRequest.kycDetails?.taxCode || 'N/A'}</p>
                          </div>
                          <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 uppercase">Số điện thoại</p>
                             <p className="text-xs font-black text-white">{selectedRequest.phoneNumber || 'N/A'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Bank Info */}
                 <div className="space-y-6 pb-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 uppercase">
                       <Landmark size={16} className="text-amber-400" /> Tài khoản ngân hàng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 uppercase">Ngân hàng</p>
                          <p className="text-xs font-black text-white uppercase">{selectedRequest.kycDetails?.bankInfo?.bankName || 'N/A'}</p>
                       </div>
                       <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 uppercase">Số tài khoản</p>
                          <p className="text-xs font-black text-white uppercase">{selectedRequest.kycDetails?.bankInfo?.accountNumber || 'N/A'}</p>
                       </div>
                       <div className="p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 uppercase">Chủ tài khoản</p>
                          <p className="text-xs font-black text-white uppercase">{selectedRequest.kycDetails?.bankInfo?.accountName || 'N/A'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="p-10 border-t border-[#2d3d4d] sticky bottom-0 bg-[#1A2632] flex items-center gap-4">
                 {showRejectForm ? (
                    <div className="flex-1 flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                       <input 
                         type="text"
                         placeholder="Nhập lý do từ chối (Gửi đến người dùng)..."
                         value={rejectReason}
                         onChange={(e) => setRejectReason(e.target.value)}
                         className="flex-1 bg-[#101922] border-none rounded-2xl py-4 px-6 text-sm font-bold text-white focus:ring-2 focus:ring-rose-500/50 transition-all shadow-inner"
                       />
                       <button onClick={() => handleReject(selectedRequest._id)} className="px-8 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all">Gửi từ chối</button>
                       <button onClick={() => setShowRejectForm(false)} className="px-6 bg-slate-800 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-700 transition-all">Hủy</button>
                    </div>
                 ) : (
                    <>
                       <button onClick={() => handleApprove(selectedRequest._id)} className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                          <CheckCircle2 size={20} /> Phê duyệt hồ sơ
                       </button>
                       <button onClick={() => setShowRejectForm(true)} className="flex-1 py-5 bg-[#101922] border-2 border-slate-700 hover:border-rose-500 hover:text-rose-500 text-slate-500 rounded-3xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all flex items-center justify-center gap-3">
                          <XCircle size={20} /> Từ chối yêu cầu
                       </button>
                    </>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
