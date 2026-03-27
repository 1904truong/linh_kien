'use client';

import React, { useState, useEffect } from 'react';
import { 
  PackageSearch, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Tag, 
  Store, 
  Layers,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  History,
  FileSearch
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductModeration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products/pending', {
        params: {
          page: pagination.page,
          search: searchTerm,
          category
        }
      });
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch Pending Products Error:', error);
      toast.error('Không thể tải danh sách sản phẩm chờ duyệt.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, pagination.page]);

  const handleApprove = async (productId) => {
    try {
      const response = await api.patch(`/admin/products/${productId}/approve`);
      if (response.data.success) {
        toast.success('Đã duyệt sản phẩm thành công!');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Duyệt sản phẩm thất bại.');
    }
  };

  const handleReject = async (productId) => {
    const reason = prompt('Lý do từ chối sản phẩm này:');
    if (reason === null) return;
    try {
      const response = await api.patch(`/admin/products/${productId}/reject`, { reason });
      if (response.data.success) {
        toast.success('Đã từ chối sản phẩm.');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Gửi yêu cầu thất bại.');
    }
  };

  const categories = ['Phụ tùng gầm', 'Hệ thống phanh', 'Hệ thống treo', 'Động cơ', 'Hộp số', 'Lọc dầu'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Kiểm duyệt sản phẩm</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1 uppercase">Đảm bảo chất lượng và tính minh bạch của hàng hóa trên sàn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest uppercase">{pagination.total} SP chờ duyệt</span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1173d4] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
            <FileSearch size={16} />
            <span>Duyệt hàng loạt</span>
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Tìm kiếm sản phẩm</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tên sản phẩm, Mã SKU..." 
                className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPagination({ ...pagination, page: 1 }); }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Danh mục</label>
            <select 
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPagination({ ...pagination, page: 1 }); }}
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 uppercase">Trạng thái duyệt</label>
            <select className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
              <option value="pending">Đang chờ (Pending)</option>
              <option value="approved">Đã duyệt (Approved)</option>
              <option value="rejected">Từ chối (Rejected)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid / Table */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#101922]/50 border-b border-[#2d3d4d]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Gian hàng</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Giá bán</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh mục</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời gian</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3d4d]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1173d4]"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] uppercase">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? products.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-[#101922] border border-[#2d3d4d] flex items-center justify-center text-slate-500 overflow-hidden shadow-inner">
                         {item.images && item.images[0] ? (
                           <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="p-2 bg-slate-800 rounded-lg">
                             <Tag size={20} />
                           </div>
                         )}
                      </div>
                      <div className="flex flex-col max-w-xs">
                        <span className="text-xs font-black text-white group-hover:text-primary transition-all line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter uppercase">{item.oemCode || item._id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Store size={14} className="text-[#1173d4]" />
                      {item.sellerId?.shopName || item.sellerId?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-sm font-black text-white">{item.price?.toLocaleString('vi-VN')}₫</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <Layers size={14} />
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 bg-[#101922] hover:bg-primary/20 text-slate-500 hover:text-primary rounded-xl border border-[#2d3d4d] transition-all" title="Xem chi tiết">
                          <Eye size={16} />
                       </button>
                       <button 
                         onClick={() => handleApprove(item._id)}
                         className="p-2 bg-[#101922] hover:bg-emerald-400/20 text-slate-500 hover:text-emerald-400 rounded-xl border border-[#2d3d4d] transition-all" title="Duyệt bán">
                          <CheckCircle2 size={16} />
                       </button>
                       <button 
                         onClick={() => handleReject(item._id)}
                         className="p-2 bg-[#101922] hover:bg-rose-400/20 text-slate-500 hover:text-rose-400 rounded-xl border border-[#2d3d4d] transition-all" title="Từ chối">
                          <XCircle size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-slate-500 font-medium italic">
                    Không có sản phẩm nào đang chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
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

    </div>
  );
}
