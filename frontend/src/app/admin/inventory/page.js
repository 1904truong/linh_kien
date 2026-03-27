'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  PackageCheck,
  PackageX,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpDown,
  Tag,
  Store,
  ExternalLink,
  Edit3,
  X,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function InventoryManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: { totalProducts: 0, lowStock: 0, outOfStock: 0 }, products: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ inventory: 0, safetyStock: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [filter, category, page]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/inventory/status', {
        params: {
          searchTerm,
          filter,
          category,
          page,
          limit: 10
        }
      });
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast.error('Không thể tải dữ liệu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditData({
      inventory: product.inventory,
      safetyStock: product.safetyStock || 5
    });
    setShowEditModal(true);
  };

  const handleUpdateInventory = async () => {
    setSubmitting(true);
    try {
      const response = await api.put(`/admin/inventory/${selectedProduct._id}`, editData);
      if (response.data.success) {
        toast.success('Cập nhật tồn kho thành công!');
        setShowEditModal(false);
        fetchInventory();
      }
    } catch (error) {
      console.error('Update inventory error:', error);
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Hệ thống đèn', 'Hệ thống phanh', 'Hệ thống treo', 'Động cơ', 'Hộp số', 'Phụ tùng bảo dưỡng'];

  const getStockStatus = (inventory, safetyStock) => {
    if (inventory <= 0) return { label: 'Hết hàng', color: 'text-rose-400', bg: 'bg-rose-400/10', icon: PackageX };
    if (inventory <= safetyStock) return { label: 'Sắp hết', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: TrendingDown };
    return { label: 'Sẵn hàng', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: PackageCheck };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Title & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Quản lý tồn kho</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Theo dõi mức độ lưu kho và cảnh báo thiếu hụt hàng hóa</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchInventory}
             className="p-2.5 bg-[#1A2632] border border-[#2d3d4d] text-slate-400 hover:text-white rounded-xl transition-all"
           >
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng số sản phẩm', value: data.stats.totalProducts, icon: Package, color: 'blue' },
          { label: 'Cảnh báo sắp hết', value: data.stats.lowStock, icon: TrendingDown, color: 'amber' },
          { label: 'Sản phẩm hết hàng', value: data.stats.outOfStock, icon: PackageX, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 size-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-center gap-4 relative">
              <div className={`size-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tìm kiếm kho hàng</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Tên sản phẩm, Mã OEM..." 
                className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchInventory()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bộ lọc kho</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Đã hết hàng</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Danh mục</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto text-slate-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#101922]/50 border-b border-[#2d3d4d]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sản phẩm / OEM</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Tồn kho</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Ngưỡng an toàn</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3d4d]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                      <RefreshCw className="animate-spin" size={32} />
                      <p className="text-xs font-bold uppercase tracking-widest">Đang tải dữ liệu kho...</p>
                    </div>
                  </td>
                </tr>
              ) : data.products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                      <PackageX size={48} className="opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : data.products.map((item) => {
                const status = getStockStatus(item.inventory, item.safetyStock);
                return (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-[#101922] border border-[#2d3d4d] flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                           {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <Tag size={18} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-black text-white group-hover:text-[#1173d4] transition-all line-clamp-1">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{item.oemCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`text-sm font-black ${item.inventory <= item.safetyStock ? 'text-amber-400' : 'text-white'}`}>
                        {item.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-xs font-bold text-slate-400">{item.safetyStock || 5}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.color} border border-current/20`}>
                        <status.icon size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-[#101922] hover:bg-[#1173d4]/20 text-slate-500 hover:text-[#1173d4] rounded-xl border border-[#2d3d4d] transition-all" 
                          title="Chỉnh sửa kho"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 bg-[#101922] hover:bg-slate-700 text-slate-500 hover:text-white rounded-xl border border-[#2d3d4d] transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-6 bg-[#101922]/30 border-t border-[#2d3d4d] flex items-center justify-between">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
             Hiển thị <span className="text-white">{data.products.length}</span> / {data.pagination?.total || 0} sản phẩm
           </p>
           <div className="flex items-center gap-3">
              <button 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="size-10 flex items-center justify-center bg-[#101922] border border-[#2d3d4d] text-slate-400 hover:text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-black text-white px-2">Trang {page}</span>
              <button 
                disabled={page >= (data.pagination?.totalPages || 1)}
                onClick={() => setPage(p => p + 1)}
                className="size-10 flex items-center justify-center bg-[#101922] border border-[#2d3d4d] text-slate-400 hover:text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Edit Stock Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0A0F14]/90 backdrop-blur-xl" onClick={() => setShowEditModal(false)}></div>
          
          <div className="relative w-full max-w-lg bg-[#111820] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight italic">Cập nhật kho hàng</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{selectedProduct.oemCode}</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-[#1A2129] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="size-16 rounded-xl bg-[#101922] overflow-hidden shrink-0">
                  <img src={selectedProduct.images?.[0]} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{selectedProduct.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{selectedProduct.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Số lượng tồn kho</label>
                  <input 
                    type="number" 
                    value={editData.inventory}
                    onChange={(e) => setEditData({ ...editData, inventory: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#101922] border border-white/10 text-white rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-[#1173d4]/20 focus:border-[#1173d4] outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ngưỡng an toàn</label>
                  <input 
                    type="number" 
                    value={editData.safetyStock}
                    onChange={(e) => setEditData({ ...editData, safetyStock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#101922] border border-white/10 text-white rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                <AlertTriangle size={18} className="text-[#1173d4] shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                  Thay đổi ngưỡng an toàn sẽ ảnh hưởng đến các cảnh báo "Sắp hết hàng" tự động trên hệ thống. 
                  Hãy đảm bảo giá trị này phù hợp với tốc độ tiêu thụ sản phẩm.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                Hủy
              </button>
              <button 
                disabled={submitting}
                onClick={handleUpdateInventory}
                className="flex-1 px-8 py-4 bg-[#1173d4] hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {submitting ? 'ĐANG CẬP NHẬT...' : 'LƯU THAY ĐỔI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
