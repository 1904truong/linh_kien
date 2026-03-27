'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Plus,
  ShoppingBag
} from 'lucide-react';
import useSellerStore from '@/store/useSellerStore';
import Link from 'next/link';
import api from '@/lib/api';

export default function SellerOrders() {
  const { orders, pagination, fetchOrders, deleteOrder, loading } = useSellerStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeTab !== 'All') params.status = activeTab.toLowerCase();
    fetchOrders(params);
  }, [fetchOrders, debouncedSearch, activeTab]);

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const displayOrders = Array.isArray(orders) ? orders : [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/seller/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        // Refresh orders
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeTab !== 'All') params.status = activeTab.toLowerCase();
        fetchOrders(params);
        alert('Cập nhật trạng thái đơn hàng thành công!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      const result = await deleteOrder(orderId);
      if (result.success) {
        alert('Xóa đơn hàng thành công!');
        // Refresh with current filters
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeTab !== 'All') params.status = activeTab.toLowerCase();
        fetchOrders(params);
      } else {
        alert('Lỗi: ' + result.error);
      }
    }
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" onClick={() => setOpenMenuId(null)}>
      <header>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý đơn hàng</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Theo dõi và xử lý các đơn hàng của bạn hiệu quả hơn.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-[#1173d4] hover:text-[#1173d4] transition-all shadow-sm">
                <Printer size={16} /> In báo cáo
             </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mt-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center pb-3 px-1 transition-all relative ${
                  activeTab === tab 
                    ? 'text-[#1173d4]' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className="text-sm font-black uppercase tracking-widest whitespace-nowrap">
                  {tab === 'All' ? 'Tất cả' : getStatusLabel(tab.toLowerCase())}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1173d4] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-xl relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-[#1173d4] transition-colors">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Tìm mã đơn hàng, tên khách hàng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[#1173d4]/20 focus:border-transparent outline-none text-sm transition-all shadow-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Filter size={18} />
            Bộ lọc
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1173d4] text-white rounded-2xl text-sm font-black hover:bg-[#1173d4]/90 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <Plus size={18} />
            Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-8 py-5">Khách hàng</th>
                <th className="px-8 py-5">Ngày đặt</th>
                <th className="px-8 py-5 text-right">Tổng tiền</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-10 border-4 border-[#1173d4] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Đang tải đơn hàng...</p>
                    </div>
                  </td>
                </tr>
              ) : displayOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <ShoppingBag size={48} className="opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Không có đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              ) : displayOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-[#1173d4] border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        {order.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1173d4] transition-colors">{order.userId?.name || 'Khách lẻ'}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-1">Order {order._id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black tracking-tight">{order.totalPrice.toLocaleString()}₫</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent shadow-sm ${getStatusStyle(order.items[0]?.status)}`}>
                      {getStatusLabel(order.items[0]?.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                       {order.items[0]?.status === 'pending' && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'processing'); }}
                           className="text-[#1173d4] hover:underline text-[10px] font-black uppercase tracking-widest"
                         >
                           Xác nhận đơn
                         </button>
                       )}
                       <span className="text-slate-200 dark:text-slate-800">|</span>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === order._id ? null : order._id); }}
                         className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                       >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === order._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                          <div className="py-2">
                             {order.items[0]?.status !== 'cancelled' && (
                               <button 
                                 onClick={() => { if(window.confirm('Bạn có chắc muốn hủy đơn này?')) handleUpdateStatus(order._id, 'cancelled'); setOpenMenuId(null); }}
                                 className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                               >
                                 <Clock size={16} /> Hủy đơn hàng
                               </button>
                             )}
                             <button 
                               onClick={() => handleDelete(order._id)}
                               className="w-full text-left px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors flex items-center gap-3"
                             >
                               <XCircle size={16} /> Xóa đơn hàng
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Hiển thị {displayOrders.length} trên tổng số {pagination.orders.total} đơn hàng
          </p>
          <div className="flex gap-2">
            <button 
              className="p-2.5 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl text-slate-500 disabled:opacity-20 transition-all"
              disabled={pagination.orders.page === 1}
              onClick={() => fetchOrders({ page: pagination.orders.page - 1, search: searchTerm, status: activeTab !== 'All' ? activeTab.toLowerCase() : undefined })}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(pagination.orders.pages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => fetchOrders({ page: i + 1, search: searchTerm, status: activeTab !== 'All' ? activeTab.toLowerCase() : undefined })}
                  className={`size-10 rounded-xl text-xs font-black transition-all ${
                    pagination.orders.page === i + 1 
                      ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/30' 
                      : 'hover:bg-white dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="p-2.5 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl text-slate-500 disabled:opacity-20 transition-all"
              disabled={pagination.orders.page === pagination.orders.pages}
              onClick={() => fetchOrders({ page: pagination.orders.page + 1, search: searchTerm, status: activeTab !== 'All' ? activeTab.toLowerCase() : undefined })}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
