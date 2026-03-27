'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  X
} from 'lucide-react';


export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', type: 'Garage' });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        api.get('/seller/customers/stats'),
        api.get('/seller/customers', { params: { search: debouncedSearch, type: filterType } })
      ]);
      setStatsData(statsRes.data.data);
      setCustomers(listRes.data.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filterType]);

  const handleExportCSV = async () => {
    try {
      // Fetch maximum items based on current search & filter to export all matching records
      const res = await api.get('/seller/customers', { params: { limit: 10000, search: debouncedSearch, type: filterType } });
      const dataToExport = res.data.data.customers;
      
      if (dataToExport.length === 0) {
        alert('Không có dữ liệu để xuất báo cáo!');
        return;
      }

      const headers = ['Tên khách hàng', 'Loại', 'Số điện thoại', 'Email', 'Địa chỉ', 'Số đơn hàng', 'Tổng chi tiêu', 'Lần mua cuối'];
      const csvRows = dataToExport.map(c => [
        `"${c.name}"`,
        c.type,
        `'${c.phone}`, // Add tick for Excel to avoid scientific notation
        c.email,
        `"${c.address}"`,
        c.totalOrders,
        c.totalSpent.toString().replace(/đ/g, ''),
        c.lastOrder
      ]);
      
      // Prepend BOM so Excel reads UTF-8 correctly
      const csvContent = '\uFEFF' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Bao_Cao_Khach_Hang_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Đã có lỗi xảy ra khi tải file.');
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/seller/customers', formData);
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', address: '', type: 'Garage' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const stats = [
    { label: 'Tổng khách hàng', value: statsData?.totalCustomers || 0, change: 'Khách hàng', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Khách hàng mới', value: statsData?.newCustomers || 0, change: '1 tháng qua', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tỷ lệ quay lại', value: statsData?.returnRate || '0%', change: '>1 Đơn hàng', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Đối tác chiến lược', value: statsData?.strategicPartners || 0, change: 'Garage/Workshop', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const getTypeBadge = (type) => {
    const styles = {
      'Garage': 'bg-blue-50 text-blue-700 border-blue-100',
      'Mechanic': 'bg-orange-50 text-orange-700 border-orange-100',
      'Individual': 'bg-slate-50 text-slate-700 border-slate-100',
      'Workshop': 'bg-purple-50 text-purple-700 border-purple-100'
    };
    return styles[type] || 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Quản lý Khách hàng</h1>
          <p className="text-slate-500 text-sm font-medium">Theo dõi thông tin và lịch sử giao dịch của các đối tác & khách lẻ.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#1173d4] hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          <UserPlus size={18} />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded-lg bg-slate-50 text-slate-500`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter & Table Area */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên, số điện thoại, email..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-[#1173d4]/5 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all font-sans"
              >
                <Filter size={18} />
                {filterType === 'all' ? 'Tất cả' : filterType === 'Garage' ? 'Garage' : filterType === 'Workshop' ? 'Xưởng DV' : filterType === 'Mechanic' ? 'Thợ máy' : 'Khách lẻ'}
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-20">
                  {['all', 'Garage', 'Workshop', 'Mechanic', 'Individual'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => { setFilterType(t); setShowFilterDropdown(false); }} 
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all ${filterType === t ? 'bg-[#1173d4]/10 text-[#1173d4]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {t === 'all' ? 'Tất cả phân loại' : t === 'Garage' ? 'Garage' : t === 'Workshop' ? 'Xưởng dịch vụ' : t === 'Mechanic' ? 'Thợ máy' : 'Khách lẻ'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={handleExportCSV} className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Đơn hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chi tiêu</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lần cuối</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full" aria-label="loading"></div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium">Không tìm thấy khách hàng nào.</td>
                </tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1173d4] font-black">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-[#1173d4] transition-colors">{customer.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <MapPin size={10} />
                          {customer.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getTypeBadge(customer.type)}`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Phone size={12} className="text-slate-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <Mail size={12} />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{customer.totalOrders}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Giao dịch</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-[#1173d4]" />
                      <span className="text-sm font-black text-slate-900">{customer.totalSpent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {customer.lastOrder}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:bg-[#1173d4]/10 text-slate-400 hover:text-[#1173d4] rounded-lg transition-all">
                          <ArrowUpRight size={18} />
                       </button>
                       <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                          <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">Hiển thị 1 - 5 của 1,284 khách hàng</p>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 cursor-not-allowed">Trước</button>
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-100 transition-all">Sau</button>
          </div>
        </div>
      </div>
      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-lg">Thêm khách hàng (CRM)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên khách hàng *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1173d4] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1173d4] transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phân loại</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1173d4] transition-all bg-white appearance-none">
                    <option value="Garage">Garage</option>
                    <option value="Workshop">Xưởng dịch vụ</option>
                    <option value="Mechanic">Thợ máy</option>
                    <option value="Individual">Khách lẻ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1173d4] transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1173d4] transition-all" />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 font-bold text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-all">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-[#1173d4] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all">Lưu khách hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
