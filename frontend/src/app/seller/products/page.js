'use client';

import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Visibility, 
  Edit, 
  Delete,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  Trash2
} from 'lucide-react';
import useSellerStore from '@/store/useSellerStore';
import Link from 'next/link';

export default function SellerProducts() {
  const { products, pagination, fetchProducts, loading } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
    fetchProducts(params);
  }, [fetchProducts, searchTerm, statusFilter]);

  // Clientside filtering as fallback or for instant feedback if desired, 
  // but we should primarily rely on the server fetch above.
  const displayProducts = Array.isArray(products) ? products : [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'hidden': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang bán';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'hidden': return 'Đã ẩn';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toolbar Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-[#1173d4] transition-colors">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sản phẩm, SKU hoặc mã OEM..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#1173d4]/50 focus:border-transparent outline-none text-sm transition-all shadow-sm"
            />
          </div>
        </div>
        <Link 
          href="/seller/products/new"
          className="bg-[#1173d4] hover:bg-[#1173d4]/90 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <PlusCircle size={20} />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái:</span>
          <div className="flex gap-2">
            {['All', 'Active', 'Pending', 'Hidden'].map((status) => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status 
                    ? 'bg-[#1173d4] text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status === 'All' ? 'Tất cả' : getStatusLabel(status.toLowerCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-8 py-5 w-12 text-center">
                  <input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-700 text-[#1173d4] focus:ring-[#1173d4]/50" />
                </th>
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-8 py-5">Giá bán</th>
                <th className="px-8 py-5 text-center">Kho hàng</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-10 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : displayProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Package size={48} className="opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : displayProducts.map((p) => (
                <tr key={p._id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-6 text-center">
                    <input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-700 text-[#1173d4] focus:ring-[#1173d4]/50" />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <Package size={24} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1173d4] transition-colors">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-1">OEM: {p.oemCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 dark:text-white tracking-tight">{p.price.toLocaleString()}₫</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${p.inventory < p.safetyStock ? 'text-red-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`}>
                        {p.inventory}
                      </span>
                      {p.inventory < p.safetyStock && (
                        <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter shadow-sm shadow-red-500/10">Sắp hết</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(p.status)} shadow-sm`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-xl transition-all hover:scale-110 active:scale-90" title="Xem">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-[#1173d4]/10 hover:text-[#1173d4] rounded-xl transition-all hover:scale-110 active:scale-90" title="Sửa">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all hover:scale-110 active:scale-90" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">
            Hiển thị {displayProducts.length} trong tổng số {pagination.products.total} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 disabled:opacity-20 transition-all" 
              disabled={pagination.products.page === 1}
              onClick={() => fetchProducts({ page: pagination.products.page - 1, search: searchTerm, status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined })}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(pagination.products.pages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => fetchProducts({ page: i + 1, search: searchTerm, status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined })}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    pagination.products.page === i + 1 
                      ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/30' 
                      : 'hover:bg-white dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 disabled:opacity-20 transition-all"
              disabled={pagination.products.page === pagination.products.pages}
              onClick={() => fetchProducts({ page: pagination.products.page + 1, search: searchTerm, status: statusFilter !== 'All' ? statusFilter.toLowerCase() : undefined })}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
